import Tasks from '../task/index.js';

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

const putAllProjects = async () => {
  const projects = await filterProjects();
  for (let key in projects) {
    const tasks = projects[key];
    const selector = '.' + key;
    Tasks.putTasks(tasks, selector);
  }
};

export default putAllProjects;
