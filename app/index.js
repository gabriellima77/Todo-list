import putAllProjects from './src/components/projects/index.js';
import Tasks from './src/components/task/index.js';

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
