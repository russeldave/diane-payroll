import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '@/stores/sessionStore';

import AdminLayout from '@/layouts/AdminLayout.vue';
import GuestLayout from '@/layouts/GuestLayout.vue';

import Login from '@/views/Auth/Index.vue';
import Register from '@/views/Auth/Register.vue';

import Dashboard2Page from '@/views/Pages/Dashboard2/Index.vue';
import UsersMain from '@/views/Pages/Users/Index.vue';
import LogsMain from '@/views/Pages/Logs/Index.vue';
import ProfileMain from '@/views/Pages/Profile/Index.vue';
import ConfigurationMain from '@/views/Pages/Configuration/Index.vue';
import EmployeesMain from '@/views/Pages/Employee/Index.vue';
import SystemInformation from '@/views/Pages/SystemInfo/Index.vue';
import NotFound from '@/views/Error/404.vue';

const title = 'FIS Multi-Store';
const titleFormat = (text) => (text ? `${title} | ${text}` : title);

const routes = [
  // 🔹 GUEST ROUTES (LOGIN / REGISTER)
  {
    path: '/',
    component: GuestLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: Login,
        meta: { title: titleFormat('Login') },
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: { title: titleFormat('Register') },
      },
    ],
    // beforeEnter: async (to, from, next) => {
    //   const sessionStore = useSessionStore();
    //   await sessionStore.fetchSession();

    //   if (sessionStore.isAuthenticated) {
    //     next({ name: 'users' });
    //   } else {
    //     next({ name: 'login' }); 
    //   }
    // },
  },

  // 🔹 ADMIN ROUTES (PROTECTED)
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard2',
        name: 'dashboard2',
        component: Dashboard2Page,
        meta: { title: titleFormat('Dashboard') },
      },
      {
        path: 'users',
        name: 'users',
        component: UsersMain,
        meta: { title: titleFormat('Users') },
      },
      {
        path: 'employees',
        name: 'employees',
        component: EmployeesMain,
        meta: { title: titleFormat('Employees') },
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfileMain,
        meta: { title: titleFormat('Profile') },
      },
      {
        path: 'logs',
        name: 'logs',
        component: LogsMain,
        meta: { title: titleFormat('User Logs') },
      },
      {
        path: 'configurations',
        name: 'configurations',
        component: ConfigurationMain,
        meta: { title: titleFormat('Configurations') },
      },
      {
        path: 'system-information',
        name: 'system-information',
        component: SystemInformation,
        meta: { title: titleFormat('System Information') },
      },
    ],
  },

  // 🔹 404
  {
    path: '/:catchAll(.*)',
    component: NotFound,
    meta: { title: titleFormat('404 Not Found') },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 🔹 TITLE HANDLER
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || title;
  next();
});

export default router;
