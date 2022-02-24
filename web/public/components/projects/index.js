import Tasks from '../task/index.js';
const initialProjects = ['home', 'today', 'week'];

const getAllTasks = async () => {
  const response = await fetch('http://localhost:4000/api/tasks', {
    mode: 'cors',
  });
  const tasks = await response.json();
  return tasks;
};

const filterProjects = async () => {
  const tasks = await getAllTasks();
  let projects = tasks.reduce((projects, task) => {
    const { project } = task;
    const hasProject = projects[project];
    if (hasProject) projects[project].push(task);
    else projects[project] = [task];
    return projects;
  }, {});
  return projects;
};

const createProject = (project, quant = 0) => {
  const iconsClass = ['fa-solid fa-caret-down', 'fa-solid fa-circle-plus'];
  const section = document.createElement('section');
  const Title = project[0].toUpperCase() + project.substring(1);
  const header = document.createElement('div');
  const box = document.createElement('div');
  const h2 = document.createElement('h2');
  const quantity = document.createElement('span');
  const showMore = document.createElement('button');
  const add = document.createElement('button');
  const addText = document.createElement('span');

  section.classList.add('todo', project);
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
    const project = createProject(text);
    after.parentElement.insertBefore(project, after);
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
  const showMore = section.querySelector('.show-more');
  showMore.addEventListener('click', () => {
    section.classList.toggle('open');
    showMore.classList.toggle('open');
  });
};

const putAllProjects = async () => {
  const projects = await filterProjects();
  const after = document.querySelector('.add-project');
  const parent = after.parentElement;
  for (let key in projects) {
    const selector = '.' + key;
    const isAInitialProject = initialProjects.includes(key);
    if (!isAInitialProject) {
      const quantity = projects[key].length;
      const project = createProject(key, quantity);
      parent.insertBefore(project, after);
      addShowMoreEvent(selector);
    }
    const tasks = projects[key];
    Tasks.putTasks(tasks, selector);
  }

  initialProjects.forEach((className) => {
    const selector = '.' + className;
    const section = document.querySelector(selector);
    const quantity = section.querySelector('.quantity');
    const project = projects[className];
    quantity.textContent = project ? project.length : 0;
    addShowMoreEvent(selector);
  });

  addProjectEvent();
};

export default putAllProjects;
