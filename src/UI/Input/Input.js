import { escapeHtml } from "../../helpers.js";

export const Input = ({ value = "", placeholder = "", className = "" }) => `
  <input
    type="text"
    class="input ${escapeHtml(className)}"
    value="${escapeHtml(value)}"
    placeholder="${escapeHtml(placeholder)}"
  />
`;
