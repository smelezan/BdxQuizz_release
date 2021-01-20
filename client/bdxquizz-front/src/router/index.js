import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/categories',
    name: 'Categories',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Categories.vue'),
  },
  {
    path: '/quizz-room/:name',
    name: 'Quizz-room',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/QuizzRoom.vue'),
  },
  {
    path: '/stats/user',
    name: 'Profile',

    component: () =>
      import('../views/Profile.vue'),
  },
  {
    path: '/stats/categories',
    name: 'Ranking',

    component: () =>
      import('../views/Ranking.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
