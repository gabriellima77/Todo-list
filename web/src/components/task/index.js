const addTaskToBd = async (task) => {
  const { text, project } = task;
  const response = await fetch(
    `http://localhost:4000/api/projects/${project}/tasks`,
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    }
  );
  const content = await response.json();
  return content;
};

const removeTask = async (project, id) => {
  return await fetch(
    `http://localhost:4000/api/projects/${project}/tasks/${id}`,
    {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  );
};

const editTask = async (task) => {
  const { id, text, project } = task;
  return await fetch(
    `http://localhost:4000/api/projects/${project}/tasks/${id}`,
    {
      method: 'PUT',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    }
  );
};

const editEvent = (text, id) => {
  const value = text.textContent;
  const parent = text?.parentElement;

  if (!parent) return;

  const after = parent.querySelector('.buttons');
  const input = document.createElement('input');
  const form = document.createElement('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const project = parent.parentElement.getAttribute('data-id');
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
    const selector = '.' + project;
    const section = document.querySelector(selector);
    const id = section.getAttribute('data-id');
    const text = input.value;
    const data = { text, project: id };
    const task = await addTaskToBd(data);
    putTasks([task], selector);
    const quantityElement = section.querySelector('.quantity');
    const value = parseInt(quantityElement.textContent) + 1;
    quantityElement.textContent = value;
    form.parentElement.removeChild(form);
  });

  form.append(input, button);
  return form;
};

const addTaskEvent = (section) => {
  const after = section.querySelector('.add').nextSibling;
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
        const project = task.parentElement.getAttribute('data-id');
        await removeTask(project, id);
        const section = task.parentElement;
        const quantityElement = section.querySelector('.quantity');
        const value = parseInt(quantityElement.textContent) - 1;
        quantityElement.textContent = value;
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
