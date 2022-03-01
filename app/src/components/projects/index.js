import Tasks from '../task/index.js';
const initialProjects = ['home', 'today', 'week'];

async function getProjectTasks(id) {
  const response = await fetch(
    `http://localhost:4000/api/projects/${id}/tasks`,
    {
      mode: 'cors',
    }
  );
  const tasks = await response.json();
  return tasks;
}

async function getProjects() {
  const response = await fetch(`http://localhost:4000/api/projects`, {
    mode: 'cors',
  });
  const projects = await response.json();
  return projects;
}

async function createProject(project) {
  const response = await fetch(`http://localhost:4000/api/projects`, {
    mode: 'cors',
    method: 'POST',
    body: JSON.stringify(project),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data;
}

async function editProject(id, name) {
  await fetch(`http://localhost:4000/api/projects/${id}`, {
    mode: 'cors',
    method: 'PUT',
    body: JSON.stringify({ name }),
    headers: { 'Content-Type': 'application/json' },
  });
}

async function removeProject(id) {
  await fetch(`http://localhost:4000/api/projects/${id}`, {
    mode: 'cors',
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
}

const createBtns = (projectId) => {
  const btns = document.createElement('div');
  const btnsClass = { remove: 'trash', edit: 'pen' };
  btns.classList.add('buttons', 'project');
  for (let key in btnsClass) {
    const classList = 'fa-solid fa-' + btnsClass[key];
    const btn = document.createElement('button');
    const i = document.createElement('i');
    i.classList = classList;
    btn.classList.add(key);
    if (key === 'remove') {
      btn.addEventListener('click', async () => {
        await removeProject(projectId);
        const projectSection = document.querySelector(
          `[data-id="${projectId}"]`
        );
        projectSection.parentElement.removeChild(projectSection);
      });
    } else {
      btn.addEventListener('click', () => {
        const projectSection = document.querySelector(
          `[data-id="${projectId}"]`
        );
        const hasForm = projectSection.querySelector('form');
        if (hasForm) return;
        const form = document.createElement('form');
        const input = document.createElement('input');

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const after = form.nextElementSibling;
          const formParent = form.parentElement;
          const text = input.value;
          await editProject(projectId, text);
          const h2 = document.createElement('h2');
          h2.textContent = text;
          formParent.removeChild(form);
          formParent.insertBefore(h2, after);
        });

        form.appendChild(input);

        const text = projectSection.querySelector('h2');
        const textParent = text.parentElement;
        input.value = text.textContent;
        const after = text.nextElementSibling;
        textParent.removeChild(text);
        textParent.insertBefore(form, after);
      });
    }

    btn.appendChild(i);
    btns.appendChild(btn);
  }
  return btns;
};

const createProjectElement = (project, quant = 0) => {
  const { id, name } = project;
  const iconsClass = ['fa-solid fa-caret-down', 'fa-solid fa-circle-plus'];
  const section = document.createElement('section');
  const Title = name[0].toUpperCase() + name.substring(1);
  const header = document.createElement('div');
  const box = document.createElement('div');
  const h2 = document.createElement('h2');
  const quantity = document.createElement('span');
  const showMore = document.createElement('button');
  const add = document.createElement('button');
  const addText = document.createElement('span');
  const btns = createBtns(id);

  section.setAttribute('data-id', id);

  const classSection = name.replaceAll(' ', '_');

  section.classList.add('todo', classSection);
  header.classList.add('header');
  box.classList.add('box');
  quantity.classList.add('quantity');
  showMore.classList.add('show-more');
  add.classList.add('add');

  h2.textContent = Title;
  addText.textContent = 'Add Task';
  quantity.textContent = quant;

  const icons = iconsClass.map((c) => {
    const icon = document.createElement('i');
    icon.classList = c;
    return icon;
  });

  Tasks.putAddTask(add);

  showMore.appendChild(icons[0]);
  add.append(icons[1], addText);
  box.append(h2, quantity);
  header.append(box, btns, showMore);
  section.append(header, add);
  return section;
};

const createInput = () => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const button = document.createElement('button');

  input.classList.add('addtask-input');
  button.classList.add('addtask-btn');

  input.placeholder = 'Type your project';
  button.textContent = 'Confirm';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value;
    const after = document.querySelector('.add-project');
    const project = await createProject({ name: text });
    const projectElement = createProjectElement(project);
    after.parentElement.insertBefore(projectElement, after);
    form.parentElement.removeChild(form);
    const selector = '.' + projectElement.classList[1];
    addShowMoreEvent(selector);
  });
  form.append(input, button);
  return form;
};

const putInput = (after) => {
  const input = createInput();
  after.parentElement.insertBefore(input, after);
};

const addProjectEvent = () => {
  const addProject = document.querySelector('.add-project');
  addProject.addEventListener('click', () => {
    const hasInput = addProject.parentElement.querySelector('form');
    if (hasInput) return;
    putInput(addProject);
  });
};

const addShowMoreEvent = (selector) => {
  const section = document.querySelector(selector);
  const header = section.querySelector('.header');
  const showMore = section.querySelector('.show-more');
  header.addEventListener('click', (e) => {
    const isGrandParentClassBtns =
      e.target.parentElement.parentElement.classList[0] === 'buttons';
    const isParentClassBtns = e.target.parentElement.classList[0] === 'buttons';
    const isTargetClassBtns = e.target.classList[0] === 'buttons';
    if (isGrandParentClassBtns || isParentClassBtns || isTargetClassBtns)
      return;

    section.classList.toggle('open');
    showMore.classList.toggle('open');
  });
};

const putAllProjects = async () => {
  const after = document.querySelector('.add-project');

  const projects = await getProjects();
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const selector = '.' + project.name.replaceAll(' ', '_');
    const { id } = project;
    const projectTasks = await getProjectTasks(id);
    const quantity = projectTasks.length;
    const isAInitialProject = initialProjects.includes(project.name);
    if (!isAInitialProject) {
      const parent = after.parentElement;
      const projectElement = createProjectElement(project, quantity);
      parent.insertBefore(projectElement, after);
    } else {
      const section = document.querySelector(selector);
      const quantityElement = section.querySelector('.quantity');
      quantityElement.textContent = quantity;
      section.setAttribute('data-id', id);
    }
    addShowMoreEvent(selector);
    Tasks.putTasks(projectTasks, selector);
  }

  addProjectEvent();
};

export default putAllProjects;
