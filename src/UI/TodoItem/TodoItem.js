import { Button } from "../Button/Button.js";
import { IconButton } from "../IconButton/IconButton.js";
import { Input } from "../Input/Input.js";
import { escapeHtml } from "../../helpers.js";

export const TodoItem = (todo) => `
  <li
    class="todo-item ${todo.done ? "todo-item--done" : ""}"
    data-id="${escapeHtml(todo.id)}"
  >
    ${
      todo.editing
        ? Input({
            value: todo.text,
            className: "todo-item__edit-input",
          })
        : `<span class="todo-item__text">${escapeHtml(todo.text)}</span>`
    }
    <div class="todo-item__operations">
      <input
        class="todo-item__complete-checkbox"
        aria-label="Отметить задачу как выполненную"
        type="checkbox"
        ${todo.done ? "checked" : ""}
      />
      ${
        todo.editing
          ? Button({
              children: "Save",
              className: "todo-item__save-button",
              dataId: todo.id,
            })
          : IconButton({
              icon: "Edit",
              title: "Edit",
              className: "todo-item__edit-button",
              dataId: todo.id,
            })
      }
      ${IconButton({
        icon: "X",
        title: "Delete",
        className: "todo-item__delete-button icon-button--delete",
        dataId: todo.id,
      })}
    </div>
  </li>
`;
