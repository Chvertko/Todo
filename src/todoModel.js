import { isBlank } from "./helpers.js";

export const getVisibleTodos = (todos, currentFilter, searchValue) => {
  const normalizedSearch = searchValue.trim().toLowerCase();

  return todos.filter((todo) => {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !todo.done) ||
      (currentFilter === "completed" && todo.done);
    const matchesSearch =
      !normalizedSearch || todo.text.toLowerCase().includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });
};

export const createTodo = (todos, value, id) => {
  const text = String(value ?? "").trim();

  if (isBlank(text)) {
    return todos;
  }

  return [
    ...todos,
    {
      id,
      text,
      done: false,
      editing: false,
    },
  ];
};

export const editTodo = (todos, todoId, newText) =>
  todos.map((todo) =>
    todo.id === Number(todoId)
      ? { ...todo, text: newText, editing: false }
      : todo,
  );

export const removeTodo = (todos, todoId) =>
  todos.filter((todo) => todo.id !== Number(todoId));

export const toggleTodo = (todos, todoId) =>
  todos.map((todo) =>
    todo.id === Number(todoId) ? { ...todo, done: !todo.done } : todo,
  );

export const startEditTodo = (todos, todoId) =>
  todos.map((todo) =>
    todo.id === Number(todoId) ? { ...todo, editing: true } : todo,
  );
