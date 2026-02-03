<template>
    <div class=" dark:border-gray-700 bg-gray-50 overflow-x-auto overflow-y-hidden">
      <!-- Static Tabs -->
      <ul class="flex flex-nowrap lg:flex-wrap -mb-px text-sm md:text-lg font-bold text-center text-gray-500 dark:text-gray-400">
        <!-- PR List (For Purchase) Tab -->
        <li class="me-2 mb-2 md:mb-0">
          <a
            href="#"
            v-if="hasPermission('Return_Item_Tab')"
            @click.prevent="activateTab('Return')"
            title="Return Items"
            :class="{
              'inline-flex text-blue-500 border-b-4 p-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                activeTab === 'Return',
              'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-300 group':
                activeTab !== 'Return',
            }"
          >
            <i class="fas fa-file-invoice me-2"></i>
            <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline">Items</span>
            <span class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"><small>Items</small></span>
          </a>
        </li>
         <li class="me-2 mb-2 md:mb-0">
          <a
            href="#"
            v-if="hasPermission('Return_Item_List_Tab')"
            @click.prevent="activateTab('Return_List')"
            title="Return Items"
            :class="{
              'inline-flex text-blue-500 border-b-4 mb-1 p-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                activeTab === 'Return_List',
              'inline-flex items-center justify-center p-2 border-b-4 mb-1 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-300 group':
                activeTab !== 'Return_List',
            }"
          >
            <i class="fas fa-list me-2"></i>
            <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline">Returned Items List</span>
            <span class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"><small>Returned List</small></span>
          </a>
        </li>
      </ul>
    </div>
  
    <!-- Tab content -->
    <ToReturnItem v-if="activeTab === 'Return'" :key="props.warehouse_id" :warehouse_id="props.warehouse_id"></ToReturnItem>
    <ReturnedItem v-if="activeTab === 'Return_List'" :key="props.warehouse_id" :warehouse_id="props.warehouse_id"></ReturnedItem>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Import the tab components
  import ToReturnItem from "../Return/ToReturnItem/Index.vue";
  import ReturnedItem from '../Return/ReturnedItem/Index.vue';

  import { hasPermission } from "@/views/Utility/Permissions";
  
  const props = defineProps({
    warehouse_id: Number,
  });
  // Define the active tab state
  const activeTab = ref("Return");
  
  // Activate a tab
  const activateTab = (index) => {
    activeTab.value = index;
  };
  </script>
  