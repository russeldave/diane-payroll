<template>
  <div class="dark:border-gray-700 bg-cyan-50 overflow-x-auto overflow-y-hidden">
    <!-- Static Tabs -->
    <ul class="flex flex-nowrap xl:flex-wrap -mb-px text-sm md:text-lg font-bold text-center text-gray-500 dark:text-gray-400">
      <!-- 'Item-in Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('Request_Items_Pending_Tab')"
          @click.prevent="activateTab('StockIn')"
          title="Pending Requested Items"
          :class="{
            'inline-flex text-cyan-600 border-b-4 mb-1 p-2 border-cyan-500 rounded-t-lg active dark:text-cyan-500 dark:border-cyan-500':
              activeTab === 'StockIn',
            'inline-flex items-center justify-center p-2 border-b-4 mb-1 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'StockIn',
          }"
        >
          <i class="fas fa-file-invoice me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">Stock In</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>Stock In</small></span>
        </a>
      </li>
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('Request_Items_Approved_Tab')"
          @click.prevent="activateTab('StockOut')"
          title="Approved Requested Items"
          :class="{
            'inline-flex text-cyan-600 border-b-4 p-2 border-cyan-500 rounded-t-lg active dark:text-cyan-500 dark:border-cyan-500':
              activeTab === 'StockOut',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'StockOut',
          }"
        >
          <i class="fas fa-file-invoice me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">Stock Out</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>Stock Out</small></span>
        </a>
      </li>
    </ul>
  </div>

  <!-- Tab content -->
  <StockInTab v-if="activeTab === 'StockIn' && hasPermission('Request_Items_Pending_Tab')"></StockInTab>
  <StockOutTab v-if="activeTab === 'StockOut' && hasPermission('Request_Items_Approved_Tab')"></StockOutTab>
</template>

<script setup>
import { ref } from "vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { hasPermission } from "@/views/Utility/Permissions";

// Import the tab components
import StockInTab from "./StockIn/Index.vue";
import StockOutTab from "./StockOut/Index.vue";
const props = defineProps({
  // warehouse_id: Number,
});

// Define the active tab state
const activeTab = ref("StockOut");

// Activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};
</script>
