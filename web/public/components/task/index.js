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

const putAddTask = () => {
  const section = document.querySelector('.todo');
  const btn = section.querySelector('.add');
  btn.addEventListener('click', () => {
    const hasInput = section.querySelector('form');
    if (hasInput) return;
    addTaskEvent(section);
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
  const section = document.querySelector(selector);
  const after = section.querySelector('.add');
  tasks.forEach((task) => {
    const taskElement = createTask(task);
    section.insertBefore(taskElement, after);
  });
};

export default { putTasks, putAddTask };
