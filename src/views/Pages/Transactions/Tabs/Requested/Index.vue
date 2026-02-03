<template>
  <div class="dark:border-gray-700 bg-purple-50 overflow-x-auto overflow-y-hidden">
    <!-- Static Tabs -->
    <ul class="flex flex-nowrap xl:flex-wrap -mb-px text-sm md:text-lg font-bold text-center text-gray-500 dark:text-gray-400">
      <!-- 'Item-in Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('Request_Items_Pending_Tab')"
          @click.prevent="activateTab('Pending')"
          title="Pending Requested Items"
          :class="{
            'inline-flex text-purple-600 border-b-4 mb-1 p-2 border-purple-500 rounded-t-lg active dark:text-purple-500 dark:border-purple-500':
              activeTab === 'Pending',
            'inline-flex items-center justify-center p-2 border-b-4 mb-1 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'Pending',
          }"
        >
          <i class="fas fa-file-invoice me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">New Item (Pending)</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>Pending</small></span>
        </a>
      </li>
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('Request_Items_Approved_Tab')"
          @click.prevent="activateTab('Approved')"
          title="Approved Requested Items"
          :class="{
            'inline-flex text-purple-600 border-b-4 p-2 border-purple-500 rounded-t-lg active dark:text-purple-500 dark:border-purple-500':
              activeTab === 'Approved',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'Approved',
          }"
        >
          <i class="fas fa-file-invoice me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">New Item (Approved)</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>Approved</small></span>
        </a>
      </li>
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('Request_Items_Rejected_Tab')"
          @click.prevent="activateTab('Rejected')"
          title="Rejected Requested Items"
          :class="{
            'inline-flex text-purple-500 border-b-4 p-2 border-purple-500 rounded-t-lg active dark:text-purple-500 dark:border-purple-500':
              activeTab === 'Rejected',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'Rejected',
          }"
        >
          <i class="fas fa-file-invoice me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">New Item (Rejected)</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>Rejected</small></span>
        </a>
      </li>
    </ul>
  </div>

  <!-- Tab content -->
  <PendingItemsTab v-if="activeTab === 'Pending' && hasPermission('Request_Items_Pending_Tab')" :warehouse_id="props.warehouse_id"></PendingItemsTab>
  <ApprovedItemsTab v-if="activeTab === 'Approved' && hasPermission('Request_Items_Approved_Tab')" :warehouse_id="props.warehouse_id"></ApprovedItemsTab>
  <RejectedItemsTab v-if="activeTab === 'Rejected' && hasPermission('Request_Items_Rejected_Tab')" :warehouse_id="props.warehouse_id"></RejectedItemsTab>
</template>

<script setup>
import { ref } from "vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { hasPermission } from "@/views/Utility/Permissions";

// Import the tab components
import PendingItemsTab from "./Pending/Index.vue";
import ApprovedItemsTab from "./Approved/Index.vue";
import RejectedItemsTab from "./Rejected/Index.vue";
const props = defineProps({
  warehouse_id: Number,
});

// Define the active tab state
const activeTab = ref("Pending");

// Activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};
</script>
