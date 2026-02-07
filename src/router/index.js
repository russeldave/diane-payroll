import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import GuestLayout from '@/layouts/GuestLayout.vue';
import { useSessionStore } from '@/stores/sessionStore';
import Login from '@/views/Auth/Index.vue';
import Register from '@/views/Auth/Register.vue';

import Dashboard2Page from '@/views/Pages/Dashboard2/Index.vue';
//admin
import ConfigurationMain from '@/views/Pages/Configuration/Index.vue';
// import ChartMain from '@/views/Pages/Charts/Index.vue';
// import ReceivingMain from '@/views/Pages/Receiving/Index.vue';
// import CollectedOrdersMain from '@/views/Pages/CollectedOrders/Index.vue';
// import CustomerOrdersMain from '@/views/Pages/CustomerOrders/Index.vue';
// import CashierMain from '@/views/Pages/Cashier/Index.vue';
// import IngredientsMain from '@/views/Pages/Ingredients/Index.vue';
// import MealsMain from '@/views/Pages/Meals/Index.vue';
// import CategoryMain from '@/views/Pages/Category/Index.vue';
// import IngCategoryMain from '@/views/Pages/IngCategory/Index.vue';
// import BuffCategoryMain from '@/views/Pages/BuffCategory/Index.vue';
// import CollectionsMain from '@/views/Pages/Collections/Index.vue';
// import SalesMain from '@/views/Pages/Sales/Index.vue';
// import ProductionsMain from '@/views/Pages/Productions/Index.vue';
// import ButchersMain from '@/views/Pages/Butcher/Index.vue';
import UsersMain from '@/views/Pages/Users/Index.vue';
import LogsMain from '@/views/Pages/Logs/Index.vue';
import ProfileMain from '@/views/Pages/Profile/Index.vue';
// import StatisticsMain from '@/views/Pages/Statistics/Index.vue';
// import BuffetMain from '@/views/Pages/Buffet/Index.vue';
// import ScrapMain from '@/views/Pages/Scrap/Index.vue';
// import ExcelMain from '@/views/Pages/ExcelReport/Index.vue';
// import TablesMain from '@/views/Pages/Tables/Index.vue';
// import ProductionReportMain from '@/views/Pages/ProductionReport/Index.vue';
// import ButcheryReportMain from '@/views/Pages/ButcheryReport/Index.vue';
// import PhysicalCountReportMain from '@/views/Pages/PhysicalCountReport/Index.vue';
// import StockMonitoringMain from '@/views/Pages/StockMonitoring/Index.vue';
// import SuppliersMain from '@/views/Pages/Suppliers/Index.vue';
// import RequestIngredientMain from '@/views/Pages/RequestIngredient/Index.vue';
// import TransferMain from '@/views/Pages/Transfer/Index.vue';
// import TransactionsMain from '@/views/Pages/Transactions/Index.vue';
// import VarianceMain from '@/views/Pages/Varian/tabs/index.vue';
import EmployeesMain from '@/views/Pages/Employee/Index.vue';
// //miscellaneous components
import NotFound from '@/views/Error/404.vue'; // Import your custom 404 component
// import Bounce from '@/views/Error/409.vue'; // Import your custom 404 component
  import SystemInformation from '@/views/Pages/SystemInfo/Index.vue'; // SystemInformation 
// import MainScanner from '@/views/Pages/BarcodeScanner/MainScanner.vue';
// import MainScanner from '@/views/Pages/BarcodeScanner/MainScanner.vue';
// import FunctionScanner from '@/views/Pages/BarcodeFunction/index.vue'

// const token = localStorage.getItem('token');
const title = "FIS Multi-Store";

const titleFormat = (text) => {
  return text ? `${title} | ${text}` : title;
}

const routes = [
  {
    path: '/',
    component: GuestLayout,
    children: [
      {
        path: '',
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
    ],
    beforeEnter: async (to, from, next) => {
      const sessionStore = useSessionStore();

      if (!sessionStore.isAuthenticated) {
        await sessionStore.fetchSession();
      }

      if (sessionStore.isAuthenticated) {
        next({ name: 'users' });
      } else {
        next({ name: 'login' });
      }
    }
  },

  
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard2',
        name: 'dashboard2',
        component: Dashboard2Page,
        meta: { title: titleFormat('dashboard2') }
      },
      {
        path: '/users',
        name: 'users',
        component: UsersMain,
        meta: { title: titleFormat('Users') }
      },
      {
        path: '/system-information',
        name: 'system-information',
        meta: { title: titleFormat('System Information') },
        component: SystemInformation
      },
      
      {
        path: '/employees',
        name: 'employees',
        component: EmployeesMain,
        meta: { title: titleFormat('Employees') }
      },
    
      {
        path: '/profile',
        name: 'profile',
        component: ProfileMain,
        meta: { title: titleFormat('Profile') }
      },
      {
        path: '/logs',
        name: 'logs',
        component: LogsMain,
        meta: { title: titleFormat('User Logs') }
      },
      {
        path: '/configurations',
        name: 'configurations',
        component: ConfigurationMain,
        meta: { title: titleFormat('Configurations') }
      },
    ],
    beforeEnter: async (to, from, next) => {
      const sessionStore = useSessionStore();

      if (!sessionStore.isAuthenticated) {
        await sessionStore.fetchSession();
      }

      if (sessionStore.isAuthenticated) {
        next();
      } else {
        next({ name: 'login' });
      }
    }
  },
  {
    path: '/:catchAll(.*)',
    component: NotFound,
    meta: { title: titleFormat('404 Not Found') },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Update the tab title whenever the route changes
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = 'Brixe - Point of Sales';
  }
  next();
});

export default router;
