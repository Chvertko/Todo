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
  searchClearButton: ".search-form__clear-button",
};

//state
let currentFilter = window.localStorage.getItem("currentFilter") || "all";
let searchValue = "";
const todoForm = document.querySelector(SELECTORS.todoForm);
const mainInput = document.querySelector(SELECTORS.mainInput);
const todosList = document.querySelector(SELECTORS.todoList);
const filterWrapper = document.querySelector(SELECTORS.filterWrapper);
const searchInput = document.querySelector(SELECTORS.searchInput);
const clearSearchButton = document.querySelector(SELECTORS.searchClearButton);

//storage
const getTodosFromStorage = () => {
  const todosFromStorage = window.localStorage.getItem("todos");
  if (todosFromStorage) {
    try {
      const parsedTodos = JSON.parse(todosFromStorage);

      if (Array.isArray(parsedTodos)) {
        return parsedTodos;
      }
    } catch {
      window.localStorage.removeItem("todos");
    }
  }
  return [];
};
let todos = getTodosFromStorage();

const getVisibleTodos = (todos, currentFilter, searchValue) => {
  return todos.filter((todo) => {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !todo.done) ||
      (currentFilter === "completed" && todo.done);
    const matchesSearch =
      !searchValue ||
      todo.text.toLowerCase().includes(searchValue.toLowerCase());
    return matchesFilter && matchesSearch;
  });
};
const setTodosToStorage = (todos) => {
  window.localStorage.setItem("todos", JSON.stringify(todos));
};

//helpers
const findTodoById = (todos, todoId) => {
  const numericTodoId = Number(todoId);
  return todos.find((todo) => todo.id === numericTodoId);
};

const createTodo = (todos, value) => {
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
  setTodosToStorage(todos);
};

const removeTodo = (todos, todoId) => {
  return todos.filter((todo) => todo.id !== Number(todoId));
};

const toggleTodo = (todos, todoId) => {
  return todos.map((todo) => {
    if (todo.id === Number(todoId)) {
      return { ...todo, done: !todo.done };
    }
    return todo;
  });
};

const startEditTodo = (todos, todoId) => {
  return todos.map((todo) => {
    if (todo.id === Number(todoId)) {
      return { ...todo, editing: true };
    }
    return todo;
  });
};

const saveEditTodo = (todos, todoId) => {
  const todo = findTodoById(todos, todoId);

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
  setTodosToStorage(todos);
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

const renderTodos = () => {
  const visibleTodos = getVisibleTodos(todos, currentFilter, searchValue);

  todosList.innerHTML = visibleTodos
    .map((todo) => renderTodoItem(todo))
    .join("");
};

const handleSubmit = (event) => {
  event.preventDefault();

  const value = mainInput.value;

  createTodo(todos, value);

  mainInput.value = "";
  renderTodos();
};

todosList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(SELECTORS.deleteButton);

  if (deleteButton) {
    todos = removeTodo(todos, deleteButton.dataset.id);
    setTodosToStorage(todos);
    renderTodos();
  }

  const editButton = event.target.closest(SELECTORS.editButton);

  if (editButton) {
    todos = startEditTodo(todos, editButton.dataset.id);
    setTodosToStorage(todos);
    renderTodos();
    return;
  }

  const saveButton = event.target.closest(SELECTORS.saveButton);

  if (saveButton) {
    saveEditTodo(todos, saveButton.dataset.id);
    return;
  }

  const checkbox = event.target.closest(SELECTORS.completeCheckbox);

  if (checkbox) {
    const taskItem = checkbox.closest(SELECTORS.todoItem);
    if (taskItem) {
      todos = toggleTodo(todos, taskItem.dataset.id);
      setTodosToStorage(todos);
      renderTodos();
    }
  }
});

todosList.addEventListener("keydown", (event) => {
  if (event.target.matches(SELECTORS.editInput) && event.key === "Enter") {
    const todoItem = event.target.closest(SELECTORS.todoItem);

    if (todoItem) {
      saveEditTodo(todos, todoItem.dataset.id);
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
  currentFilter = nextFilter;
  window.localStorage.setItem("currentFilter", currentFilter);
  renderTodos();
});

searchInput.addEventListener("input", (event) => {
  searchValue = event.target.value;
  renderTodos();
});

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  searchValue = "";
  renderTodos();
});

todoForm.addEventListener("submit", handleSubmit);
getTodosFromStorage();
renderTodos();
