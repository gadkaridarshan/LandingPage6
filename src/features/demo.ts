// @helix:story USER-136000
// Demo entry: mounts the Features section into <body> when this module is loaded directly.
import { createFeaturesSection, defaultFeaturesConfig } from "./features";
import "./features.css";

if (typeof document !== "undefined") {
  const mount = document.getElementById("app") ?? document.body;
  const section = createFeaturesSection(defaultFeaturesConfig);
  mount.appendChild(section);
}