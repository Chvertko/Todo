const TODOS_KEY = "todos";
const FILTER_KEY = "currentFilter";
const VALID_FILTERS = new Set(["all", "active", "completed"]);

export const loadTodos = () => {
  const storedTodos = window.localStorage.getItem(TODOS_KEY);
  if (!storedTodos) {
    return [];
  }

  try {
    const parsedTodos = JSON.parse(storedTodos);
    if (Array.isArray(parsedTodos)) {
      return parsedTodos;
    }
  } catch {
    window.localStorage.removeItem(TODOS_KEY);
  }

  return [];
};

export const saveTodos = (todos) => {
  window.localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};

export const loadCurrentFilter = () => {
  const filter = window.localStorage.getItem(FILTER_KEY);
  return VALID_FILTERS.has(filter) ? filter : "all";
};

export const saveCurrentFilter = (filter) => {
  window.localStorage.setItem(FILTER_KEY, filter);
};
