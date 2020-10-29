import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import User from '../views/User.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard',
    component: Home,
    children: [
      {
        path: 'hrissue',
        name: 'hrissue',
        redirect: '/hrissue/employee',
        component: () => import('../views/HRIssue/index.vue'),
        children: [
          {
            path: 'template',
            name: 'Template',
            component: () => import('../views/HRIssue/Template/index.vue'),
          }, {
            path: 'employee',
            name: 'Employee',
            component: () => import('../views/HRIssue/Employee/index.vue'),
          },
        ]
      }, {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard/index.vue'),
      },
    ]
  }, {
    path: '/login',
    name: 'Login',
    component: User,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
