import {
  createTodo,
  editTodo,
  getVisibleTodos,
  removeTodo,
  startEditTodo,
  toggleTodo,
} from "./todoModel.js";
import {
  loadCurrentFilter,
  loadTodos,
  saveCurrentFilter,
  saveTodos,
} from "./storage.js";
import { TodoItem } from "./UI/TodoItem/TodoItem.js";
import "./styles/main.scss";

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

const init = () => {
  const todoForm = document.querySelector(SELECTORS.todoForm);
  const mainInput = document.querySelector(SELECTORS.mainInput);
  const todosList = document.querySelector(SELECTORS.todoList);
  const filterWrapper = document.querySelector(SELECTORS.filterWrapper);
  const searchInput = document.querySelector(SELECTORS.searchInput);
  const clearSearchButton = document.querySelector(SELECTORS.searchClearButton);

  let todos = loadTodos();
  let currentFilter = loadCurrentFilter();
  let searchValue = "";
  const renderFilterButtons = () => {
    const filterButtons = filterWrapper.querySelectorAll("button[data-filter]");
    filterButtons.forEach((button) => {
      button.classList.toggle(
        "button-active",
        button.dataset.filter === currentFilter,
      );
    });
  };
  const renderTodos = () => {
    todosList.innerHTML = getVisibleTodos(todos, currentFilter, searchValue)
      .map(TodoItem)
      .join("");
  };

  const updateTodos = (nextTodos) => {
    if (nextTodos === todos) {
      return;
    }

    todos = nextTodos;
    saveTodos(todos);
    renderTodos();
  };

  const saveTodoEdit = (todoId) => {
    const todoItem = Array.from(
      todosList.querySelectorAll(SELECTORS.todoItem),
    ).find((item) => item.dataset.id === String(todoId));
    const input = todoItem?.querySelector(SELECTORS.editInput);
    const newText = input?.value.trim();

    if (newText) {
      updateTodos(editTodo(todos, todoId, newText));
    }
  };

  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // способ  проверки на пустую строку
    if (!mainInput.value.trim()) {
      mainInput.value = "";
      return;
    }

    const nextTodos = createTodo(todos, mainInput.value, Date.now());

    if (nextTodos !== todos) {
      updateTodos(nextTodos);
    }

    mainInput.value = "";
  });

  todosList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(SELECTORS.deleteButton);
    if (deleteButton) {
      updateTodos(removeTodo(todos, deleteButton.dataset.id));
      return;
    }

    const editButton = event.target.closest(SELECTORS.editButton);
    if (editButton) {
      updateTodos(startEditTodo(todos, editButton.dataset.id));
      return;
    }

    const saveButton = event.target.closest(SELECTORS.saveButton);
    if (saveButton) {
      saveTodoEdit(saveButton.dataset.id);
      return;
    }

    const checkbox = event.target.closest(SELECTORS.completeCheckbox);
    const todoItem = checkbox?.closest(SELECTORS.todoItem);
    if (todoItem) {
      updateTodos(toggleTodo(todos, todoItem.dataset.id));
    }
  });

  todosList.addEventListener("keydown", (event) => {
    if (event.target.matches(SELECTORS.editInput) && event.key === "Enter") {
      const todoItem = event.target.closest(SELECTORS.todoItem);
      if (todoItem) {
        saveTodoEdit(todoItem.dataset.id);
      }
    }
  });

  filterWrapper.addEventListener("click", (event) => {
    const filterButton = event.target.closest("button[data-filter]");
    const nextFilter = filterButton?.dataset.filter;
    if (!nextFilter) {
      return;
    }

    currentFilter = nextFilter;
    saveCurrentFilter(currentFilter);
    renderTodos();
    renderFilterButtons();
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

  renderTodos();
};

init();
