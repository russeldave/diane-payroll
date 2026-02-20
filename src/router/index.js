// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '@/stores/sessionStore';

// Layouts
import AdminLayout from '@/layouts/AdminLayout.vue';
import GuestLayout from '@/layouts/GuestLayout.vue';

// Guest Pages
import Login from '@/views/Auth/Index.vue';
import Register from '@/views/Auth/Register.vue';

// Admin Pages
import ConfigurationMain from '@/views/Pages/Configuration/Index.vue';
import UsersMain from '@/views/Pages/Users/Index.vue';
import LogsMain from '@/views/Pages/Logs/Index.vue';
import ProfileMain from '@/views/Pages/Profile/Index.vue';
import EmployeesMain from '@/views/Pages/Employee/Index.vue';
import EmployeeTimeSettingsMain from '@/views/Pages/EmployeeTimeSettings/Index.vue';
import AttendanceLogsMain from '@/views/Pages/AttendanceLogs/Index.vue';
import DailyAttendanceMain from '@/views/Pages/DailyAttendance/Index.vue'
// import SystemInformation from '@/views/Pages/SystemInfo/Index.vue';

// Misc
import NotFound from '@/views/Error/404.vue';

const title = "FIS Multi-Store";
const titleFormat = (text) => (text ? `${title} | ${text}` : title);

const routes = [
  // Guest Layout
  {
    path: '/auth',
    component: GuestLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: { title: titleFormat('Login') }
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: { title: titleFormat('Register') }
      }
    ]
  },

  // Admin Layout
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: 'users',
        name: 'users',
        component: UsersMain,
        meta: { title: titleFormat('Users'), auth: true }
      },
      // {
      //   path: 'system-information',
      //   name: 'system-information',
      //   component: SystemInformation,
      //   meta: { title: titleFormat('System Information'), auth: true }
      // },
      {
        path: 'employees',
        name: 'employees',
        component: EmployeesMain,
        meta: { title: titleFormat('Employees'), auth: true }
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfileMain,
        meta: { title: titleFormat('Profile'), auth: true }
      },
      {
        path: 'logs',
        name: 'logs',
        component: LogsMain,
        meta: { title: titleFormat('User Logs'), auth: true }
      },
      {
        path: 'configurations',
        name: 'configurations',
        component: ConfigurationMain,
        meta: { title: titleFormat('Configurations'), auth: true }
      },
      {
        path: 'employeetimesettings',
        name: 'employeetimesettings',
        component: EmployeeTimeSettingsMain,
        meta: { title: titleFormat('Employee Time Settings '), auth: true }

      },
      {
        path: 'attendancelogs',
        name: 'attendancelogs',
        component: AttendanceLogsMain,
        meta: { title: titleFormat('Attendance Logs'), auth: true }

      },
      {
        path: 'dailyattendance',
        name: 'dailyattendance',
        component: DailyAttendanceMain,
        meta: { title: titleFormat('Daily Attendance'), auth: true }

      },

    ]
  },

  // Catch-all 404
  {
    path: '/:catchAll(.*)',
    component: NotFound,
    meta: { title: titleFormat('404 Not Found') }
  }
];

// Create router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useSessionStore();
  
  // Optional: Try fetching user if store is empty (handles page refresh)
  if (!authStore.user) await authStore.getUser();

  if (to.meta.auth && !authStore.authenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && authStore.authenticated) {
    next('/users');
  } else {
    next();
  }
});

// Update page title
router.afterEach((to) => {
  document.title = to.meta.title || title;
});

export default router;
