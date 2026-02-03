<template>
  <div v-if="hasPermission('Navigation_Employees')">
    
    <div
       class="p-4 min-h-screen"
    >
      <BreadCrumbs :page="'Employee Management'" />
      <h1 class="text-lg md:text-2xl font-bold mb-4 mt-4">Employee Management</h1>
      <div class="">
        <!-- Static Tabs -->
        <ul class="flex flex-wrap -mb-px text-lg font-bold text-center text-gray-500 dark:text-gray-400">
           <!-- 'Item-in Tab -->
           <li class="me-2">
            <a
              href="#"
              v-if="hasPermission('Employee_Tab_Employee') && hasPermission('Navigation_Employee') && hasPermission('Navigation_Settings')"
              @click.prevent="activateTab('Employee')"
              :class="{
                'inline-flex text-blue-500 border-b-2 p-4 border-blue-600 bg-blue-100 rounded-t-lg active dark:text-blue-500 dark:border-blue-500': activeTab === 'Employee',
                'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group': activeTab !== 'Employee'
              }"
            >
              <i class="fas fa-users me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md">Employee</span>
            </a>
          </li>
          <li class="me-2">
            <a
              href="#"
              v-if="hasPermission('Employee_Tab_Position') && hasPermission('Navigation_Employee') && hasPermission('Navigation_Settings')"
              @click.prevent="activateTab('Position')"
              :class="{
                'inline-flex text-red-500 border-b-2 p-4 border-red-600 bg-red-100 rounded-t-lg active dark:text-red-500 dark:border-red-500': activeTab === 'Position',
                'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group': activeTab !== 'Position'
              }"
            >
              <i class="fas fa-network-wired me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md">Position</span>
            </a>
          </li>
        </ul>
      </div>
      
      <!-- Tab content -->
      <Employee v-if="activeTab == 'Employee'"></Employee>
      <Position v-if="activeTab == 'Position'"></Position>
    </div>
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>

<script setup>
import { ref } from "vue";
import BreadCrumbs from '@/views/Component/BreadCrumbs.vue';
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from '@/views/Error/403.vue';
// Import the tab components
import Employee from '@/views/Pages/Employee/Tabs/Employee/Index.vue';
import Position from '@/views/Pages/Employee/Tabs/Position/Index.vue';

// Define the active tab state
const activeTab = ref("Employee");

// Activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};

</script>
