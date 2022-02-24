import putAllProjects from './components/projects/index.js';
import Tasks from './components/task/index.js';

const putAddTaskEvents = () => {
  const projects = document.querySelectorAll('.todo');
  projects.forEach((project) => {
    const btn = project.querySelector('.add');
    Tasks.putAddTask(btn);
  });
};

const start = async () => {
  putAddTaskEvents();
  await putAllProjects();
};

start();
