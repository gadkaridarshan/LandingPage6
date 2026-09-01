// @helix:story USER-297000
// Self-contained Contact form: validation, accessible error states, submit flow, and success state.
// No backend wiring required — the submit is simulated locally and gracefully handled.

const FORM_ID = "contact-form-element";
const SUCCESS_ID = "contact-form-success";
const STATUS_ID = "contact-form-status";
const RESET_ID = "contact-reset";
const SUCCESS_EMAIL_ID = "contact-success-email";
const SUBMIT_ID = "contact-submit";
const COUNTER_ID = "contact-message-counter";

// RFC-5322-lite: pragmatic email regex for client-side validation.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Read the DOM node that wraps a given input (the .field container).
 * @param {HTMLElement} inputEl
 * @returns {HTMLElement | null}
 */
function getFieldWrapper(inputEl) {
    return /** @type {HTMLElement | null} */ (inputEl.closest(".field"));
}

/**
 * Render an error message for a field. Returns true when the value is valid.
 * @param {HTMLInputElement | HTMLTextAreaElement} inputEl
 * @param {string} value
 * @returns {boolean}
 */
function validateField(inputEl, value) {
    const errorEl = document.querySelector(
        `[data-error-for="${inputEl.name}"]`
    );
    const wrapper = getFieldWrapper(inputEl);
    const trimmed = value.trim();
    let message = "";

    if (!trimmed) {
        message = "This field is required.";
    } else if (inputEl.type === "email" && !EMAIL_REGEX.test(trimmed)) {
        message = "Please enter a valid email address.";
    } else if (inputEl.minLength > 0 && trimmed.length < inputEl.minLength) {
        message = `Please enter at least ${inputEl.minLength} characters.`;
    } else if (inputEl.maxLength > 0 && trimmed.length > inputEl.maxLength) {
        message = `Please keep this under ${inputEl.maxLength} characters.`;
    }

    if (errorEl) {
        errorEl.textContent = message;
    }
    if (wrapper) {
        wrapper.classList.toggle("field--invalid", message.length > 0);
        wrapper.setAttribute("data-invalid", message.length > 0 ? "true" : "false");
    }
    inputEl.setAttribute("aria-invalid", message.length > 0 ? "true" : "false");

    return message.length === 0;
}

/**
 * Update the live character counter for the message field.
 * @param {HTMLTextAreaElement} textarea
 */
function updateCounter(textarea) {
    const counter = document.getElementById(COUNTER_ID);
    if (!counter) return;
    const max = textarea.maxLength > 0 ? textarea.maxLength : 0;
    const length = textarea.value.length;
    counter.textContent = max > 0 ? `${length} / ${max}` : `${length}`;
}

/**
 * Announce a status message to assistive technologies via the live region.
 * @param {string} message
 */
function announce(message) {
    const status = document.getElementById(STATUS_ID);
    if (status) {
        status.textContent = message;
    }
}

/**
 * Wire up the contact form once the DOM is ready.
 */
function initContactForm() {
    const form = /** @type {HTMLFormElement | null} */ (
        document.getElementById(FORM_ID)
    );
    if (!form) return;

    const submit = /** @type {HTMLButtonElement | null} */ (
        document.getElementById(SUBMIT_ID)
    );
    const success = document.getElementById(SUCCESS_ID);
    const successEmail = document.getElementById(SUCCESS_EMAIL_ID);
    const resetBtn = document.getElementById(RESET_ID);
    const contact = form.closest(".contact");

    const fields = /** @type {HTMLInputElement[]} */ (
        Array.from(form.querySelectorAll("input, textarea"))
    );

    // Live validation + counter on input
    fields.forEach((field) => {
        field.addEventListener("input", () => {
            validateField(field, field.value);
            if (field.tagName === "TEXTAREA") {
                updateCounter(/** @type {HTMLTextAreaElement} */ (field));
            }
        });
        field.addEventListener("blur", () => {
            validateField(field, field.value);
        });
    });

    // Initial counter render
    const messageField = /** @type {HTMLTextAreaElement | null} */ (
        form.querySelector('textarea[name="message"]')
    );
    if (messageField) {
        updateCounter(messageField);
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let allValid = true;
        fields.forEach((field) => {
            const ok = validateField(field, field.value);
            if (!ok) allValid = false;
        });

        if (!allValid) {
            announce("Please correct the highlighted fields and try again.");
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid && typeof firstInvalid.focus === "function") {
                firstInvalid.focus();
            }
            return;
        }

        // Simulate submit — no backend wiring
        if (submit) {
            submit.disabled = true;
            submit.textContent = "Sending…";
        }

        window.setTimeout(() => {
            const data = new FormData(form);
            const email = String(data.get("email") || "");

            if (successEmail) {
                successEmail.textContent = email;
            }
            if (contact) {
                contact.classList.add("is-success");
            }
            if (success) {
                success.removeAttribute("hidden");
            }
            announce("Your message has been sent. Thank you.");
            if (resetBtn && typeof resetBtn.focus === "function") {
                resetBtn.focus();
            }
        }, 350);
    });

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            form.reset();
            fields.forEach((field) => validateField(field, ""));
            if (contact) {
                contact.classList.remove("is-success");
            }
            if (success) {
                success.setAttribute("hidden", "");
            }
            if (submit) {
                submit.disabled = false;
                submit.textContent = "Send message";
            }
            if (messageField) {
                updateCounter(messageField);
            }
            const firstField = fields[0];
            if (firstField && typeof firstField.focus === "function") {
                firstField.focus();
            }
            announce("Form reset.");
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactForm);
} else {
    initContactForm();
}