import putAllProjects from './components/projects/index.js';
import Tasks from './components/task/index.js';

const tasks = [
  { id: 1, text: 'Testando 1', isChecked: false },
  { id: 2, text: 'Testando 2', isChecked: true },
];

const start = async () => {
  await Tasks.putAddTask();
  await putAllProjects();
};

start();
