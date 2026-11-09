import { escapeHtml } from "../../helpers.js";

export const Button = ({
  children = "",
  className = "",
  type = "button",
  dataId,
}) => `
  <button
    class="button ${escapeHtml(className)}"
    type="${escapeHtml(type)}"
    ${dataId === undefined ? "" : `data-id="${escapeHtml(dataId)}"`}
  >${escapeHtml(children)}</button>
`;
