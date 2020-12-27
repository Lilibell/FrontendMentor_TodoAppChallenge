const form = document.querySelector("form");
const leftItems = document.querySelector("span");
const themeButton = document.querySelector(".themes");
const todoList = document.querySelector(".todoList");
const ul = document.querySelector("#todos");
const sortButtons = document.querySelector(".sort");
const allButton = document.querySelector(".all");
const activeButton = document.querySelector(".active");
const completedButton = document.querySelector(".completed");
const inputTodo = document.querySelector("#newTodo");
const todoArray = [];
let listLength;

// Change input width while typing

function resizable(element, factor) {
  let int = Number(factor) || 7.7;
  function resize() {
    element.style.width = (element.value.length + 1) * int + "px";
  }
  let event = "keyup,keypress,focus,blur,change".split(",");
  for (let i in event) {
    element.addEventListener(event[i], resize, false);
  }
  resize();
}

resizable(inputTodo, 7);

// Change input while active

inputTodo.addEventListener("focus", function () {
  inputTodo.placeholder = "Currently typing";
});

inputTodo.addEventListener("blur", function () {
  inputTodo.placeholder = "Create a new todo...";
});

// Create new To Do list element

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let nextTodo = inputTodo.value;

  if (nextTodo !== "") {
    todoArray.push(nextTodo);
    listLength = todoArray.length;
    leftItems.innerText = listLength;

    let liEl = document.createElement("li");
    liEl.classList.add("whitebox");

    let liInput = document.createElement("input");
    liInput.type = "checkbox";
    liInput.id = `check${listLength}`;
    let liLabel = document.createElement("label");
    liLabel.htmlFor = `check${listLength}`;
    let liP = document.createElement("p");
    liP.id = "innerTodo";
    liP.innerText = `${nextTodo}`;
    let liDelete = document.createElement("button");
    liDelete.classList.add("btn", "delete");
    liDelete.id = `delete${listLength}`;

    liEl.append(liInput, liLabel, liP, liDelete);
    liEl.classList.add("draggable");
    liEl.draggable = true;

    ul.appendChild(liEl);
    initDragDrop();

    form.reset();
  }
});

// Change themes

themeButton.addEventListener("click", function () {
  document.body.classList.toggle("darkTheme");
  todoList.classList.toggle("boxShadow");
  sortButtons.classList.toggle("boxShadow");
});

// Check or delete To Do

ul.addEventListener("click", function (event) {
  if (event.target && event.target.nodeName == "BUTTON") {
    deleteTodo(event.target);
  } else if (event.target && event.target.nodeName == "INPUT") {
    completed();
  }
});

// Delete selected To Do

function deleteTodo(toDelete) {
  let deletedText = toDelete.previousElementSibling.innerText;
  let spliceStart = todoArray.indexOf(deletedText);
  toDelete.parentElement.remove();
  todoArray.splice(spliceStart, 1);
  listLength = listLength - 1;
  leftItems.innerText = listLength;
}

// Cross out completed To Do

function completed() {
  let checkboxes = document.querySelectorAll("input[type=checkbox");

  for (checkbox of checkboxes) {
    if (checkbox.checked) {
      checkbox.nextElementSibling.nextElementSibling.classList.add("strike");
    } else {
      checkbox.nextElementSibling.nextElementSibling.classList.remove("strike");
    }
  }
}

// Clear Completed

document
  .querySelector(".clearCompleted")
  .addEventListener("click", function () {
    let checkboxes = document.querySelectorAll("input[type=checkbox");

    for (checkbox of checkboxes) {
      if (checkbox.checked) {
        let todoDeleteButton =
          checkbox.nextElementSibling.nextElementSibling.nextElementSibling;
        deleteTodo(todoDeleteButton);
      }
    }
  });

// Sort To Do List

allButton.addEventListener("click", function () {
  let listElements = document.getElementsByTagName("li");

  for (listElement of listElements) {
    listElement.classList.remove("hide");
  }
});

activeButton.addEventListener("click", function () {
  let listElements = document.getElementsByTagName("li");

  for (listElement of listElements) {
    if (listElement.firstChild.checked) {
      listElement.classList.add("hide");
    } else {
      listElement.classList.remove("hide");
    }
  }
});

completedButton.addEventListener("click", function () {
  let listElements = document.getElementsByTagName("li");

  for (listElement of listElements) {
    if (listElement.firstChild.checked) {
      listElement.classList.remove("hide");
    } else {
      listElement.classList.add("hide");
    }
  }
});

// Drag and Drop

function initDragDrop() {
  let draggables = document.querySelectorAll(".draggable");

  for (let draggable of draggables) {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  }

  ul.addEventListener("dragover", (event) => {
    event.preventDefault();
    const afterElement = getDragAfterElement(ul, event.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      ul.appendChild(draggable);
    } else {
      ul.insertBefore(draggable, afterElement);
    }
  });
}

function getDragAfterElement(ul, y) {
  const draggableElements = [
    ...ul.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
