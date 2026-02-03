import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import GuestLayout from '@/layouts/GuestLayout.vue';
import Login from '@/views/Auth/Index.vue';
import Register from '@/views/Auth/Register.vue';
//admin
import ConfigurationMain from '@/views/Pages/Configuration/Index.vue';
import ChartMain from '@/views/Pages/Charts/Index.vue';
import ReceivingMain from '@/views/Pages/Receiving/Index.vue';
import CollectedOrdersMain from '@/views/Pages/CollectedOrders/Index.vue';
import CustomerOrdersMain from '@/views/Pages/CustomerOrders/Index.vue';
import CashierMain from '@/views/Pages/Cashier/Index.vue';
import IngredientsMain from '@/views/Pages/Ingredients/Index.vue';
import MealsMain from '@/views/Pages/Meals/Index.vue';
import CategoryMain from '@/views/Pages/Category/Index.vue';
import IngCategoryMain from '@/views/Pages/IngCategory/Index.vue';
import BuffCategoryMain from '@/views/Pages/BuffCategory/Index.vue';
import CollectionsMain from '@/views/Pages/Collections/Index.vue';
import SalesMain from '@/views/Pages/Sales/Index.vue';
import ProductionsMain from '@/views/Pages/Productions/Index.vue';
import ButchersMain from '@/views/Pages/Butcher/Index.vue';
import UsersMain from '@/views/Pages/Users/Index.vue';
import CustomersMain from '@/views/Pages/Customers/Index.vue';
import LogsMain from '@/views/Pages/Logs/Index.vue';
import ProfileMain from '@/views/Pages/Profile/Index.vue';
import StatisticsMain from '@/views/Pages/Statistics/Index.vue';
import BuffetMain from '@/views/Pages/Buffet/Index.vue';
import ScrapMain from '@/views/Pages/Scrap/Index.vue';
import ExcelMain from '@/views/Pages/ExcelReport/Index.vue';
import TablesMain from '@/views/Pages/Tables/Index.vue';
import ProductionReportMain from '@/views/Pages/ProductionReport/Index.vue';
import ButcheryReportMain from '@/views/Pages/ButcheryReport/Index.vue';
import PhysicalCountReportMain from '@/views/Pages/PhysicalCountReport/Index.vue';
import StockMonitoringMain from '@/views/Pages/StockMonitoring/Index.vue';
import SuppliersMain from '@/views/Pages/Suppliers/Index.vue';
import RequestIngredientMain from '@/views/Pages/RequestIngredient/Index.vue';
import TransferMain from '@/views/Pages/Transfer/Index.vue';
import TransactionsMain from '@/views/Pages/Transactions/Index.vue';
import VarianceMain from '@/views/Pages/Varian/tabs/index.vue';
import EmployeesMain from '@/views/Pages/Employee/Index.vue';
//miscellaneous components
import TestMain from '@/views/Pages/Test/Index.vue';
import NotFound from '@/views/Error/404.vue'; // Import your custom 404 component
import Bounce from '@/views/Error/409.vue'; // Import your custom 404 component
import SystemInformation from '@/views/Pages/SystemInfo/Index.vue'; // SystemInformation 
import DataTableSampleMain from '@/views/Pages/Sample/DataTableSample.vue';
// import MainScanner from '@/views/Pages/BarcodeScanner/MainScanner.vue';
import MainScanner from '@/views/Pages/BarcodeScanner/MainScanner.vue';
import FunctionScanner from '@/views/Pages/BarcodeFunction/index.vue'

const token = localStorage.getItem('token');
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
      },
      {
        path: 'scan',
        name: 'scan',
        component: MainScanner,
        meta: { title: titleFormat('Scan') }
      },
      {
        path: 'function',
        name: 'function',
        component: FunctionScanner,
        meta: { title: titleFormat('Function') }
      }


    ]
  },
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: 'payments',
        name: 'payments',
        component: CollectionsMain,
        meta: { title: titleFormat('Payments') }
      },
      {
        path: 'variance',
        name: 'variance',
        component: VarianceMain,
        meta: { title: titleFormat('Variances') }
      },
      {
        path: 'transfer-ingredient',
        name: 'transfer-ingredient',
        component: TransferMain,
        meta: { title: titleFormat('Transfer Ingredient') }
      },
      {
        path: 'material-requisition',
        name: '-requisition',
        component:TransactionsMain,
        meta: { title: titleFormat('Material Requisition') }
      },
      {
        path: '/butchery-report',
        name: 'butchery-report',
        component: ButcheryReportMain,
        meta: { title: titleFormat('Butchery Report') }
      },
      {
        path: '/request-ingredient',
        name: 'request-ingredient',
        component: RequestIngredientMain,
        meta: { title: titleFormat('Request Ingredient') }
      },
      // {
      //   path: '/ingredient-receiving',
      //   name: 'ingredient-receiving',
      //   component: IngredientReceivingMain,
      //   meta: { title: titleFormat('Ingredient Receiving') }
      // },
      {
        path: '/physical-count-report',
        name: 'physical-count-report',
        component: PhysicalCountReportMain,
        meta: { title: titleFormat('Physical Count Report') }
      },
      {
        path: '/buffet-categories',
        name: 'butchery-categories',
        component: BuffCategoryMain,
        meta: { title: titleFormat('Buffet Category') }
      },
      {
        path: '/production-report',
        name: 'production-report',
        component: ProductionReportMain,
        meta: { title: titleFormat('Production Report') }
      },
      {
        path: '/sales',
        name: 'sales',
        component: SalesMain,
        meta: { title: titleFormat('Sales') }
      },
      {
        path: '/stock-monitoring-report',
        name: 'stock-monitoring-report',
        component: StockMonitoringMain,
        meta: { title: titleFormat('Stock Monitoring Report') }
      },
      {
        path: '/scrap-report',
        name: 'scrap-report',
        component: ScrapMain,
        meta: { title: titleFormat('Scrap Report') }
      },
       {
        path: '/excel-report',
        name: 'excel-report',
        component: ExcelMain,
        meta: { title: titleFormat('Excel Report') }
      },
      {
        path: '/customers',
        name: 'customers',
        component: CustomersMain,
        meta: { title: titleFormat('Customer') }
      },
      {
        path: '/collected-orders',
        name: 'collected-orders',
        meta: { title: titleFormat('Collected Orders') },
        component: CollectedOrdersMain
      },
      {
        path: '/customer-orders',
        name: 'customer-orders',
        component: CustomerOrdersMain,
        meta: { title: titleFormat('Customer Orders') }
      },
      {
        path: '/receiving',
        name: 'receiving',
        component: ReceivingMain,
        meta: { title: titleFormat('Receiving') }
      },
      {
        path: '/test',
        name: 'test',
        component: TestMain,
        meta: { title: titleFormat('Test') }
      },
      {
        path: '/suppliers',
        name: 'suppliers',
        component: SuppliersMain,
        meta: { title: titleFormat('Suppliers') }
      },
      {
        path: '/buffet',
        name: 'buffet',
        component: BuffetMain,
        meta: { title: titleFormat('Buffet') }
      },
      {
        path: '/meal-categories',
        name: 'meal-categories',
        component: CategoryMain,
        meta: { title: titleFormat('Meal Categories') }
      },
      {
        path: '/ingredient-categories',
        name: 'ingredient-categories',
        component: IngCategoryMain,
        meta: { title: titleFormat('Ingredient Categories') }
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
        path: '/cashier',
        name: 'cashier',
        component: CashierMain,
        meta: { title: titleFormat('Cashier') }
      },
      {
        path: '/menus',
        name: 'menus',
        component: MealsMain,
        meta: { title: titleFormat('Menus') }
      },
      {
        path: '/restaurant-tables',
        name: 'restaurent-tables',
        component: TablesMain,
        meta: { title: titleFormat('Restaurant Tables') }
      },
      {
        path: '/productions',
        name: 'productions',
        component: ProductionsMain,
        meta: { title: titleFormat('Productions') }
      },
      {
        path: '/butchers',
        name: 'butchers',
        component: ButchersMain,
        meta: { title: titleFormat('Butchers') }
      },
      {
        path: '/ingredients',
        name: 'ingredients',
        component: IngredientsMain,
        meta: { title: titleFormat('Ingredients') }
      },
      {
        path: '/charts',
        name: 'charts',
        component: ChartMain,
        meta: { title: titleFormat('Charts') }
      },
      {
        path: '/statistics',
        name: 'statistics',
        component: StatisticsMain,
        meta: { title: titleFormat('Statistics') }
      },
      {
        path: '/employees',
        name: 'employees',
        component: EmployeesMain,
        meta: { title: titleFormat('Employees') }
      },
      {
        path: '/409',
        name: '409',
        component: Bounce
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
      {
        path: '/sample/datatable',
        name: 'DataTableSample',
        component: DataTableSampleMain,
        meta: { title: titleFormat('Test Datatable') }
      }
    ],
    beforeEnter: (to, from, next) => {
      if (!token) {
        next({ name: 'login' });
      } else {
        next();
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
