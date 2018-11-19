const todoData = [];
const saveData = debounce(save, 500);
window.onload = init;


function init() {
  const store = localStorage.getItem("todo");
  if (store !== null) {
    const data = JSON.parse(store);
    data.forEach(cur => addTodo(todoList, cur.title, cur.done));
  }
  all.click();
  checkAllDone();
}
clear.addEventListener("click", _ => {
  todoData.length = 0;
  localStorage.clear();
  todoList.innerHTML = "";
});
todoInput.addEventListener("keyup", event => {
  if (event.keyCode === 13) {
    const title = todoInput.value.trim();
    if (title !== "") {
      todoInput.value = "";
      addTodo(todoList, title);
      checkAllDone();
    }
  }
});
todos.addEventListener("dblclick", event => {
  if (predicateEvent(event,"todoTitle")) {
    event.target.style.display = "none";
    showEditor(event.target.nextSibling, event.target.textContent);
  }
});
todos.addEventListener("focusout", event => {
  if (predicateEvent(event, "editor")) {
    const edt = event.target;
    edt.hidden = true;
    const title = edt.value.trim();
    const titleEle = edt.previousSibling;
    if (title !== "") {
      titleEle.textContent = title;
      updateData("edit", [getIndex(edt), title]);
    }
    titleEle.style.display = "";
  }
});
todos.addEventListener("keyup", event => {
  if (event.keyCode===13 && predicateEvent(event, "editor")) {
    event.target.blur();
  }
});
todos.addEventListener("click", event => {
  if (predicateEvent(event, "delete")) {
    event.target.parentNode.remove();
    updateData("delete", getIndex(event.target));
    checkAllDone();
  }
});
todos.addEventListener("change", event => {
  if (predicateEvent(event, "state")) {
    const target = event.target;
    if (target.checked === false) {
      changeAll.checked = false;
      target.parentNode.className = "todo active";
    } else {
      target.parentNode.className = "todo done";
    }
    updateData("state", getIndex(target));
    checkAllDone();
  } else if (predicateEvent(event, "changeAll", "id")) {
    const allCheck = todoList.querySelectorAll(".state");
    const state = event.target.checked;
    const newClassName = state ? "todo done" : "todo active";
    for (let i=0; i<allCheck.length; i++) {
      allCheck[i].checked = state;
      allCheck[i].parentNode.className = newClassName;
    }
    updateData("changeAll", state);
  } else if (predicateEvent(event, "filter", "name")) {
    todoList.className = "todo-list " + event.target.id;
  }
});
/* 工具类功能 */
function ele(tagName, attrs, children) { // 创建元素的工具
  const res = document.createElement(tagName);
  if (attrs===undefined && children===undefined) {
    return res;
  }
  Object.keys(attrs).forEach(attr => res.setAttribute(attr, attrs[attr]));
  if (children === undefined) {
    return res;
  } else {
    if (typeof children === "string") {
      res.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(cur => res.appendChild(cur));
    } else {
      res.appendChild(children);
    }
    return res;
  }
}
function debounce(action, interval) { // 防止频繁出发时间
  let time;
  return function (para) {
    clearTimeout(time);
    time = setTimeout(() => {
      action(para);
    }, interval);
  }
}
function getIndex(node) { // 拿到某个小控件所属任务的index
  return node.parentNode.dataset.index;
}
function predicateEvent(event, atr, type = "class") { // 判断事件来源
  if (type === "class") {
    return event.target.classList.contains(atr);
  } else {
    return event.target[type] === atr;
  }
}
function updateData(opt, msg) { // 更新数据
  switch (opt) {
    case "add":
      todoData.push(msg);
      break;
    case "delete":
      todoData.splice(msg, 1);
      const allTodo = todoList.children;
      for (let i = msg; i < allTodo.length; i++) {
        allTodo[i].dataset.index = i;
      }
      break;
    case "edit":
      todoData[msg[0]].title = msg[1];
      break;
    case "state":
      todoData[msg].done = !todoData[msg].done;
      break;
    case "changeAll":
      todoData.forEach(todo => todo.done = msg);
      break;
  }
  save(todoData);
}
function save(data) { // 保存到localStorage
  localStorage.todo = JSON.stringify(data);
}
function checkAllDone() { // 检查任务是否全部完成
  if (todoData.every(todo => todo.done)) {
    changeAll.checked = true;
  } else {
    changeAll.checked = false;
  }
}

/* 针对每个任务 */
function addTodo(parent, taskName, complete=false) {
  const newTodo = createTodoElement(taskName, complete);
  parent.appendChild(newTodo);
  updateData("add", {title: taskName,done: complete});
}
function createTodoElement(taskName, complete=false) {
  const check = ele("input", {
    class: "state",
    type: "checkbox",
  });
  check.checked = complete;
  const fig = ele("span", {
    class: "todoTitle"
  }, taskName);
  const editor = ele("input", {
    type: "text",
    class: "editor",
    hidden: true
  });
  const del = ele("X", {
    class: "delete",
  }, "X");
  const className = complete ? "todo done" : "todo active";
  const newTodo = ele("li", {
    class: className,
    "data-index": todoData.length,
  }, [check, fig, editor, del]);
  return newTodo;
}
function showEditor(target, title) {
  target.hidden = false;
  target.value = title;
  target.focus();
}




