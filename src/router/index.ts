import { createRouter, createWebHistory, RouteRecordRaw, } from 'vue-router';
import Home from '../views/Home.vue';
import User from '../views/User.vue';
import Error from '../views/Error.vue';
import CreateKey from '../views/CreateKey.vue';


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/hrissue',
    component: Home,
    children: [
      {
        path: 'hrissue',
        name: 'hrissue',
        redirect: '/hrissue/employee',
        component: () => import('../views/HRIssue/index.vue').catch(err => err),
        children: [
          {
            path: 'template',
            name: 'Template',
            component: () => import('../views/HRIssue/Template/index.vue'),
            redirect: '/hrissue/template/list',
            children: [
              {
                path: 'list',
                name: 'TemplateList',
                component: () => import('../views/HRIssue/Template/List.vue'),
              }, {
                path: 'detail/:type',
                name: 'TemplateDetail',
                component: () => import('../views/HRIssue/Template/NewTemplate.vue'),
              },
            ]
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
        redirect: '/dashboard/list',
        children: [
          {
            path: 'list',
            name: 'listview',
            component: () => import('../views/Dashboard/ListView.vue'),
          }, {
            path: 'operate',
            name: 'operateJira',
            component: () => import('../views/Dashboard/CheckList.vue'),
          },
        ]
      },
    ]
  }, {
    path: '/login',
    name: 'Login',
    component: User,
  }, {
    path: '/encrypt-info',
    name: 'CreateKey',
    component: CreateKey,
  }, {
    path: '/:pathMatch(.*)',
    name: 'error',
    component: Error,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
