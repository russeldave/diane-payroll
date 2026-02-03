<template>
    <div class=" dark:border-gray-700 bg-blue-50 overflow-x-auto overflow-y-hidden">
      <!-- Static Tabs -->
      <ul class="flex flex-nowrap lg:flex-wrap -mb-px text-sm md:text-lg font-bold text-center text-gray-500 dark:text-gray-400">
        <!-- PR List (For Purchase) Tab -->
        <li class="me-2 mb-2 md:mb-0">
          <a
            href="#"
            v-if="hasPermission('Direct_Receiving_Tab')"
            @click.prevent="activateTab('Direct_Items')"
            title="Direct Receiving"
            :class="{
              'inline-flex text-blue-500 border-b-4 p-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                activeTab === 'Direct_Items',
              'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                activeTab !== 'Direct_Items',
            }"
          >
            <i class="fas fa-file-invoice me-2"></i>
            <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline">Items</span>
            <span class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"><small>Direct Receiving</small></span>
          </a>
        </li>
        <li class="me-2 mb-2 md:mb-0">
          <a
            href="#"
            v-if="hasPermission('Direct_Received_Items_Tab')"
            @click.prevent="activateTab('Direct_Received_Items')"
            title="Direct Receiving Items"
            :class="{
              'inline-flex text-blue-500 border-b-4 mb-1 p-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                activeTab === 'Direct_Received_Items',
              'inline-flex items-center justify-center p-2 border-b-4 mb-1 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                activeTab !== 'Direct_Received_Items',
            }"
          >
            <i class="fas fa-list-check me-2"></i>
            <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline">Direct Received Items List</span>
            <span class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"><small>Direct Received</small></span>
          </a>
        </li>
      </ul>
    </div>
  
    <!-- Tab content -->
    <DirectReceivingItems v-if="activeTab === 'Direct_Items'" :key="props.warehouse_id" :warehouse_id="props.warehouse_id"></DirectReceivingItems>
    <DirectReceivedItems v-if="activeTab === 'Direct_Received_Items'" :key="props.warehouse_id" :warehouse_id="props.warehouse_id"></DirectReceivedItems>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Import the tab components
  import DirectReceivingItems from "./DirectReceivingItems/Index.vue";
  import DirectReceivedItems from "./DirectReceivedItems/Index.vue";



  import { hasPermission } from "@/views/Utility/Permissions";
  
  const props = defineProps({
    warehouse_id: Number,
  });
  // Define the active tab state
  const activeTab = ref("Direct_Items");
  
  // Activate a tab
  const activateTab = (index) => {
    activeTab.value = index;
  };
  </script>
  