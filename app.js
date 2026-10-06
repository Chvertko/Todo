const SELECTORS = {
  todoForm: ".main-form",
  mainInput: ".main-input",
  todoList: ".todo-list",
  todoItem: ".todo-item",
  completeCheckbox: ".todo-item__complete-checkbox",
  deleteButton: ".todo-item__delete-button",
  editButton: ".todo-item__edit-button",
  saveButton: ".todo-item__save-button",
  editInput: ".todo-item__edit-input",
  filterWrapper: ".todo-list__filter-wrapper",
  searchInput: ".search-input",
};

//state
let currentFilter = window.localStorage.getItem("currentFilter") || "all";
let sortedTodos = [];
let searchValue = "";
const todos = [];
const todoForm = document.querySelector(SELECTORS.todoForm);
const mainInput = document.querySelector(SELECTORS.mainInput);
const todosList = document.querySelector(SELECTORS.todoList);
const filterWrapper = document.querySelector(SELECTORS.filterWrapper);
const searchInput = document.querySelector(SELECTORS.searchInput);
//storage
const getTodosFromStorage = () => {
  const todosFromStorage = window.localStorage.getItem("todos");
  if (todosFromStorage) {
    try {
      const parsedTodos = JSON.parse(todosFromStorage);

      if (Array.isArray(parsedTodos)) {
        todos.splice(
          0,
          todos.length,
          ...parsedTodos.map((todo) => ({
            ...todo,
            editing: false,
          })),
        );
      }
    } catch {
      window.localStorage.removeItem("todos");
    }
  }
  filterTodos();
};

//helpers
const findTodoById = (todoId) => {
  const numericTodoId = Number(todoId);
  return todos.find((todo) => todo.id === numericTodoId);
};

const createTodo = (value) => {
  const text = value.trim();

  if (!text) {
    return;
  }

  todos.push({
    id: Date.now(),
    text,
    createdAt: Date.now(),
    done: false,
    editing: false,
  });
  window.localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodo = (todoId) => {
  const todo = findTodoById(todoId);
  if (!todo) {
    return;
  }
  const filteredTodos = todos.filter((todo) => todo.id !== Number(todoId));
  todos.splice(0, todos.length, ...filteredTodos);
  window.localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
};

const toggleTodo = (todoId) => {
  const todo = findTodoById(todoId);

  if (!todo) {
    return;
  }

  todo.done = !todo.done;
  window.localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
};

const startEditTodo = (todoId) => {
  const todo = findTodoById(todoId);

  if (!todo) {
    return;
  }

  todo.editing = true;
  window.localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
};

const saveEditTodo = (todoId) => {
  const todo = findTodoById(todoId);

  if (!todo) {
    return;
  }

  const currentTodoItem = document.querySelector(
    `${SELECTORS.todoItem}[data-id="${todo.id}"]`,
  );

  if (!currentTodoItem) {
    return;
  }

  const input = currentTodoItem.querySelector(SELECTORS.editInput);

  if (!input) {
    return;
  }

  const newText = input.value.trim();

  if (!newText) {
    todo.editing = false;
    renderTodos();
    return;
  }
  todo.text = newText;
  todo.editing = false;
  window.localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
};

const filterTodos = (filter) => {
  currentFilter = filter;
  window.localStorage.setItem("currentFilter", currentFilter);
  renderTodos();
};

const renderTodoItem = (todo) => {
  const isEditing = todo.editing;

  return `
    <li class="todo-item ${todo.done ? "todo-item--done" : ""}" data-id="${todo.id}">
      ${
        isEditing
          ? `<input class="todo-item__edit-input" type="text" value="${todo.text}" />`
          : `<span class="todo-item__text">${todo.text}</span>`
      }

      <div class="todo-item__operations">
        <input
          class="todo-item__complete-checkbox"
          aria-label="Mark as complete"
          type="checkbox"
          ${todo.done ? "checked" : ""}
        />

        ${
          isEditing
            ? `<button class="todo-item__save-button" type="button" data-id="${todo.id}">Save</button>`
            : `<button class="todo-item__edit-button" type="button" data-id="${todo.id}">Edit</button>`
        }

        <button class="todo-item__delete-button" type="button" data-id="${todo.id}">X</button>
      </div>
    </li>
  `;
};

const getVisibleTodos = () => {
  let visibleTodos = [...todos];
  if (currentFilter === "active") {
    visibleTodos = visibleTodos.filter((todo) => !todo.done);
  }

  if (currentFilter === "completed") {
    visibleTodos = visibleTodos.filter((todo) => todo.done);
  }

  if (searchValue) {
    const value = searchValue.trim().toLowerCase();
    visibleTodos = visibleTodos.filter((todo) =>
      todo.text.toLowerCase().includes(value),
    );
  }
  return visibleTodos;
};

const renderTodos = () => {
  const visibleTodos = getVisibleTodos();

  todosList.innerHTML = visibleTodos
    .map((todo) => renderTodoItem(todo))
    .join("");
};

const handleSubmit = (event) => {
  event.preventDefault();

  const value = mainInput.value;

  createTodo(value);

  mainInput.value = "";
  renderTodos();
};

todosList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(SELECTORS.deleteButton);

  if (deleteButton) {
    removeTodo(deleteButton.dataset.id);
    return;
  }

  const editButton = event.target.closest(SELECTORS.editButton);

  if (editButton) {
    startEditTodo(editButton.dataset.id);
    return;
  }

  const saveButton = event.target.closest(SELECTORS.saveButton);

  if (saveButton) {
    saveEditTodo(saveButton.dataset.id);
    return;
  }

  const checkbox = event.target.closest(SELECTORS.completeCheckbox);

  if (checkbox) {
    const taskItem = checkbox.closest(SELECTORS.todoItem);
    if (taskItem) {
      toggleTodo(taskItem.dataset.id);
    }
  }
});

todosList.addEventListener("keydown", (event) => {
  if (event.target.matches(SELECTORS.editInput) && event.key === "Enter") {
    const todoItem = event.target.closest(SELECTORS.todoItem);

    if (todoItem) {
      saveEditTodo(todoItem.dataset.id);
    }
  }
});

filterWrapper.addEventListener("click", (event) => {
  const filterButton = event.target.closest("button");

  if (!filterButton) {
    return;
  }

  const nextFilter = filterButton.dataset.filter;

  if (!nextFilter) {
    return;
  }
  filterTodos(nextFilter);
});

searchInput.addEventListener("input", (event) => {
  searchValue = event.target.value;
  renderTodos();
});

todoForm.addEventListener("submit", handleSubmit);
getTodosFromStorage();
