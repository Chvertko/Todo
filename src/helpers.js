export const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const HAS_REAL_CHAR = /[^\s"'`«»“”„‘’]/u;

export const isBlank = (value) => !HAS_REAL_CHAR.test(String(value ?? ""));
