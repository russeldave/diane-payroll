<template>
  <div class="dark:border-gray-700 bg-indigo-50 overflow-x-auto overflow-y-hidden">
    <!-- Static Tabs -->
    <ul class="flex flex-nowrap xl:flex-wrap -mb-px text-sm md:text-lg font-bold text-center text-gray-500 dark:text-gray-400">
      <!-- 'Item-in Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('MRF_List_For_Releasing_Tab')"
          @click.prevent="activateTab('MRFReleasing')"
          title="MRF List (For Releasing)"
          :class="{
            'inline-flex text-indigo-500 border-b-4 mb-1 p-2 border-indigo-500 rounded-t-lg active dark:text-indigo-500 dark:border-indigo-500':
              activeTab === 'MRFReleasing',
            'inline-flex items-center justify-center p-2 border-b-4 mb-1 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'MRFReleasing',
          }"
        >
          <i class="fas fa-file-invoice me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">MRF List</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>MRF List</small></span>
        </a>
      </li>
      <!-- Inventory Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('MRF_Items_For_Releasing_Tab')"
          @click.prevent="activateTab('Pending')"
          title="MRF Items (Pending)"
          :class="{
            'inline-flex text-indigo-500 border-b-4 p-2 border-indigo-500 rounded-t-lg active dark:text-indigo-500 dark:border-indigo-500':
              activeTab === 'Pending',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'Pending',
          }"
        >
          <i class="fas fa-boxes me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">MRF Items (Pending)</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>Items (Pending)</small></span>
        </a>
      </li>
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('MRF_Items_For_Releasing_Tab')"
          @click.prevent="activateTab('Releasing')"
          title="MRF Items (Complete)"
          :class="{
            'inline-flex text-indigo-600 border-b-4 p-2 border-indigo-500 rounded-t-lg active dark:text-indigo-500 dark:border-indigo-500':
              activeTab === 'Releasing',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'Releasing',
          }"
        >
          <i class="fas fa-boxes me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">MRF Items (Complete)</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>Items (Complete)</small></span>
        </a>
      </li>
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('MRF_List_Completed_Tab')"
          @click.prevent="activateTab('MRFCompleted')"
          title="MRF List (Completed)"
          :class="{
            'inline-flex text-indigo-600 border-b-4 p-2 border-indigo-500 rounded-t-lg active dark:text-indigo-500 dark:border-indigo-500':
              activeTab === 'MRFCompleted',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'MRFCompleted',
          }"
        >
          <i class="fas fa-file-invoice me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">MRF List (Issued)</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>List (Issued)</small></span>
        </a>
      </li>
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('MRF_Items_Completed_Tab')"
          @click.prevent="activateTab('Completed')"
          title="MRF Items (Completed)"
          :class="{
            'inline-flex text-indigo-600 border-b-4 p-2 border-indigo-500 rounded-t-lg active dark:text-indigo-500 dark:border-indigo-500':
              activeTab === 'Completed',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'Completed',
          }"
        >
          <i class="fas fa-boxes me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">MRF Items (Issued)</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>Items (Issued)</small></span>
        </a>
      </li>
    </ul>
  </div>

  <!-- Tab content -->
  <MRFForReleasingTab v-if="activeTab === 'MRFReleasing' && hasPermission('MRF_List_For_Releasing_Tab')" :warehouse_id="props.warehouse_id"></MRFForReleasingTab>
  <MRFCompletedTab v-if="activeTab === 'MRFCompleted' && hasPermission('MRF_List_Completed_Tab')" :warehouse_id="props.warehouse_id"></MRFCompletedTab>
  <ForReleasingItemsTab v-if="activeTab === 'Releasing' && hasPermission('MRF_Item_Releasing_Tab')" :warehouse_id="props.warehouse_id"></ForReleasingItemsTab>
  <PendingItemsTab v-if="activeTab === 'Pending' && hasPermission('MRF_Item_Pending_Tab')" :warehouse_id="props.warehouse_id"></PendingItemsTab>
  <CompletedItemsTab v-if="activeTab === 'Completed' && hasPermission('MRF_Items_Completed_Tab')" :warehouse_id="props.warehouse_id"></CompletedItemsTab>
</template>

<script setup>
import { ref } from "vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { hasPermission } from "@/views/Utility/Permissions";

// Import the tab components
import MRFForReleasingTab from "../MRF/MRFSlipForReleasing/Index.vue";
import MRFCompletedTab from "../MRF/MRFSlipCompleteds/Index.vue";
import ForReleasingItemsTab from "../MRF/MRFItemsForReleasing/Index.vue";
import PendingItemsTab from "../MRF/MRFItemsPending/Index.vue";
import CompletedItemsTab from "../MRF/MRFItemsCompleteds/Index.vue";

const props = defineProps({
  warehouse_id: Number,
});

// Define the active tab state
const activeTab = ref("MRFReleasing");

// Activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};
</script>
