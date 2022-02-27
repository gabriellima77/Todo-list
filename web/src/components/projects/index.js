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
  header.append(box, showMore);
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
  header.addEventListener('click', () => {
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
    console.log(selector);
    addShowMoreEvent(selector);
    Tasks.putTasks(projectTasks, selector);
  }

  addProjectEvent();
};

export default putAllProjects;
