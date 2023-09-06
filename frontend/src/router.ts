import { createRouter, createWebHistory} from 'vue-router';

import Main from './components/Main.vue';
import WaitingRoom from './components/WaitingRoom.vue';

const routes = [
  {
    path: '/waitingroom/:port/:userToken',
    name: 'WaitingRoom',
    component: WaitingRoom,
  },
  {
    path: '/',
    name: 'Main',
    component: Main,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
