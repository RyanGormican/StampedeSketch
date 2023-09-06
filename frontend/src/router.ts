import { createRouter, createWebHistory} from 'vue-router';

import Main from './components/Main.vue';
import WaitingRoom from './components/WaitingRoom.vue';
import GameRoom from './components/GameRoom.vue';
const routes = [
  {
    path: '/gameroom/:port/:userToken',
    name: 'GameRoom',
    component: GameRoom,
  },
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
