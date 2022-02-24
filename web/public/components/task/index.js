const addTaskToBd = async (task) => {
  const response = await fetch('http://localhost:4000/api/tasks', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  const content = await response.json();
  return content;
};

const removeTask = async (id) => {
  return await fetch(`http://localhost:4000/api/tasks/${id}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
};

const editTask = async (task) => {
  const { id, text, project } = task;
  return await fetch(`http://localhost:4000/api/tasks/${id}`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, project }),
  });
};

const editEvent = (text, id) => {
  const value = text.textContent;
  const parent = text?.parentElement;

  if (!parent) return;

  const project = parent.parentElement
    .querySelector('h2')
    .textContent.toLowerCase();
  const after = parent.querySelector('.buttons');
  const input = document.createElement('input');
  const form = document.createElement('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value;
    await editTask({ text, id, project });
    const p = document.createElement('p');
    p.classList.add('text');
    p.textContent = text;
    parent.removeChild(form);
    parent.insertBefore(p, after);
  });

  const pattern = '[^"\'`]+';
  const title = 'No mínimo 1 caracter';
  input.pattern = pattern;
  input.title = title;
  input.value = value;
  input.required = true;
  input.classList.add('edit-input');
  form.appendChild(input);
  parent.removeChild(text);
  parent.insertBefore(form, after);
};

const createInput = (project) => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const button = document.createElement('button');

  input.classList.add('addtask-input');
  button.classList.add('addtask-btn');

  input.placeholder = 'Type your task';
  button.textContent = 'Confirm';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value;
    const data = { text, project };
    const task = await addTaskToBd(data);
    const seletor = '.' + project;
    putTasks([task], seletor);
    form.parentElement.removeChild(form);
  });

  form.append(input, button);
  return form;
};

const addTaskEvent = (section) => {
  const after = section.querySelector('.add');
  const classList = section.classList[1];
  const input = createInput(classList);
  section.insertBefore(input, after);
};

const putAddTask = (btn) => {
  btn.addEventListener('click', () => {
    const hasInput = btn.parentElement.querySelector('form');
    const parent = btn.parentElement;
    if (hasInput) return;
    addTaskEvent(parent);
  });
};

const createTask = ({ id, text, isChecked }) => {
  const task = document.createElement('div');
  const input = document.createElement('input');
  const p = document.createElement('p');
  const buttons = document.createElement('div');
  const btns = { remove: 'trash', edit: 'pen' };

  input.type = 'checkbox';
  input.classList.add('task-check');
  input.checked = isChecked;

  for (let key in btns) {
    let classList = 'fa-solid fa-';
    classList += btns[key];
    const button = document.createElement('button');
    const icon = document.createElement('i');
    icon.classList = classList;
    button.classList.add(key);
    if (key === 'remove') {
      button.addEventListener('click', async () => {
        await removeTask(id);
        task.parentElement.removeChild(task);
      });
    } else {
      button.addEventListener('click', () => {
        const text = task.querySelector('p');
        editEvent(text, id);
      });
    }
    button.appendChild(icon);
    buttons.appendChild(button);
  }

  p.classList.add('text');
  p.textContent = text;

  buttons.classList.add('buttons');

  task.classList.add('task');
  task.setAttribute('data-id', id);
  task.append(input, p, buttons);

  return task;
};

const putTasks = (tasks, selector) => {
  tasks = tasks.reverse();
  const section = document.querySelector(selector);
  const add = section.querySelector('.add');
  const after = add.nextSibling;
  tasks.forEach((task) => {
    const taskElement = createTask(task);
    section.insertBefore(taskElement, after);
  });
};

export default { putTasks, putAddTask, createInput };
