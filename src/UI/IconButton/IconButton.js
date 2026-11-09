import { escapeHtml } from "../../helpers.js";

export const IconButton = ({
  icon = "",
  onClick,
  title = "",
  className = "",
  dataId,
}) => `
  <button
    class="icon-button ${escapeHtml(className)}"
    type="button"
    title="${escapeHtml(title)}"
    aria-label="${escapeHtml(title)}"
    ${dataId === undefined ? "" : `data-id="${escapeHtml(dataId)}"`}
  >${escapeHtml(icon)}</button>
`;
