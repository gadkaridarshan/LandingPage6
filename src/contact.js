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
    }
    inputEl.setAttribute("aria-invalid", message ? "true" : "false");

    return message.length === 0;
}

/**
 * Validate every field in the form. Returns true when the entire form is valid.
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateForm(form) {
    const inputs = /** @type {Array<HTMLInputElement | HTMLTextAreaElement>} */ (
        Array.from(form.querySelectorAll("input, textarea"))
    );
    let allValid = true;
    let firstInvalid = /** @type {HTMLElement | null} */ (null);

    for (const input of inputs) {
        const ok = validateField(input, input.value);
        if (!ok) {
            allValid = false;
            if (!firstInvalid) firstInvalid = input;
        }
    }

    if (firstInvalid) {
        /** @type {HTMLElement} */ (firstInvalid).focus();
    }
    return allValid;
}

/**
 * Update the live character counter for the message field.
 * @param {HTMLTextAreaElement} textarea
 * @param {HTMLElement} counterEl
 */
function updateCounter(textarea, counterEl) {
    const max = textarea.maxLength > 0 ? textarea.maxLength : 2000;
    const current = textarea.value.length;
    counterEl.textContent = `${current} / ${max}`;
}

/**
 * Set the live region status message.
 * @param {HTMLElement} statusEl
 * @param {string} message
 * @param {"idle" | "error" | "success"} state
 */
function setStatus(statusEl, message, state) {
    statusEl.textContent = message;
    if (state === "idle") {
        statusEl.removeAttribute("data-state");
    } else {
        statusEl.setAttribute("data-state", state);
    }
}

/**
 * Simulate a network round-trip for the contact form submission.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function fakeSubmit(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * Initialize the contact form once the DOM is ready.
 */
function init() {
    const form = /** @type {HTMLFormElement | null} */ (
        document.getElementById(FORM_ID)
    );
    const successPanel = document.getElementById(SUCCESS_ID);
    const statusEl = document.getElementById(STATUS_ID);
    const resetBtn = document.getElementById(RESET_ID);
    const successEmailEl = document.getElementById(SUCCESS_EMAIL_ID);
    const submitBtn = /** @type {HTMLButtonElement | null} */ (
        document.getElementById(SUBMIT_ID)
    );
    const counterEl = document.getElementById(COUNTER_ID);
    const messageEl = /** @type {HTMLTextAreaElement | null} */ (
        document.getElementById("contact-message")
    );

    if (
        !form ||
        !successPanel ||
        !statusEl ||
        !resetBtn ||
        !successEmailEl ||
        !submitBtn ||
        !counterEl ||
        !messageEl
    ) {
        // Component not present on this page; nothing to wire up.
        return;
    }

    // Live validation: clear error state as the user types.
    form.addEventListener("input", (event) => {
        const target = /** @type {HTMLElement | null} */ (event.target);
        if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement
        ) {
            if (target.name === "message") {
                updateCounter(messageEl, counterEl);
            }
            if (target.dataset.touched === "true") {
                validateField(target, target.value);
            }
        }
    });

    // Mark fields as touched on blur so we don't show errors before the user has interacted.
    form.addEventListener(
        "blur",
        (event) => {
            const target = /** @type {HTMLElement | null} */ (event.target);
            if (
                target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement
            ) {
                target.dataset.touched = "true";
                validateField(target, target.value);
            }
        },
        true
    );

    // Initialize the counter on first paint.
    updateCounter(messageEl, counterEl);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        setStatus(statusEl, "", "idle");

        if (!validateForm(form)) {
            setStatus(
                statusEl,
                "Please fix the highlighted fields and try again.",
                "error"
            );
            return;
        }

        submitBtn.disabled = true;
        submitBtn.classList.add("is-loading");
        setStatus(statusEl, "Sending your message…", "idle");

        try {
            await fakeSubmit(900);

            const emailInput = /** @type {HTMLInputElement | null} */ (
                form.querySelector('input[name="email"]')
            );
            successEmailEl.textContent = emailInput ? emailInput.value : "";

            form.hidden = true;
            successPanel.hidden = false;
            successPanel.setAttribute("tabindex", "-1");
            successPanel.focus();

            // Reset form values so a follow-up "Send another" starts clean.
            form.reset();
            updateCounter(messageEl, counterEl);
            Array.from(form.querySelectorAll("input, textarea")).forEach(
                (el) => {
                    el.dataset.touched = "false";
                    el.setAttribute("aria-invalid", "false");
                    const wrapper = getFieldWrapper(/** @type {HTMLElement} */ (el));
                    if (wrapper) wrapper.classList.remove("field--invalid");
                }
            );
        } catch (err) {
            setStatus(
                statusEl,
                "Something went wrong sending your message. Please try again.",
                "error"
            );
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove("is-loading");
        }
    });

    resetBtn.addEventListener("click", () => {
        successPanel.hidden = true;
        form.hidden = false;
        setStatus(statusEl, "", "idle");
        const firstField = /** @type {HTMLElement | null} */ (
            form.querySelector("input, textarea")
        );
        if (firstField) firstField.focus();
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}