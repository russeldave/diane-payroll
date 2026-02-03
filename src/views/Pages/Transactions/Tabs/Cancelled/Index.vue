<template>
  <div class="dark:border-gray-700 bg-red-50 overflow-x-auto overflow-y-hidden">
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
            'inline-flex text-red-600 border-b-4 p-2 border-red-500 rounded-t-lg active dark:text-red-500 dark:border-red-500':
              activeTab === 'MRFReleasing',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'MRFReleasing',
          }"
        >
          <i class="fas fa-file-invoice me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">MRF Cancelled</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>MRF Cancelled</small></span>
        </a>
      </li>
      <!-- Inventory Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('MRF_Items_For_Releasing_Tab')"
          @click.prevent="activateTab('Releasing')"
          title="MRF Items (For Releasing)"
          :class="{
            'inline-flex text-red-600 border-b-4 mb-1 p-2 border-red-500 rounded-t-lg active dark:text-red-500 dark:border-red-500':
              activeTab === 'Releasing',
            'inline-flex items-center justify-center p-2 border-b-4 mb-1 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'Releasing',
          }"
        >
          <i class="fas fa-boxes me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline">Items MRF Cancelled</span>
          <span class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"><small>Items MRF Cancelled</small></span>
        </a>
      </li>
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('PR_Items_Rejected_Tab')"
          @click.prevent="activateTab('RC')"
          title="PR Items (Rejected)"
          :class="{
            'inline-flex text-green-600 border-b-4 p-2 border-green-500 mb-1 rounded-t-lg active dark:text-green-500 dark:border-green-500':
              activeTab === 'RC',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'RC',
          }"
        >
          <i class="fas fa-boxes me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline"
            >PR Items (Rejected)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"
            ><small>Items (Rejected)</small></span
          >
        </a>
      </li>
    </ul>
  </div>

  <!-- Tab content -->
  <MRFSlipCancelledTab v-if="activeTab === 'MRFReleasing' && hasPermission('MRF_List_For_Releasing_Tab')" :warehouse_id="props.warehouse_id"></MRFSlipCancelledTab>
  <MRFItemsCancelledTab v-if="activeTab === 'Releasing' && hasPermission('MRF_Item_Releasing_Tab')" :warehouse_id="props.warehouse_id"></MRFItemsCancelledTab>
  <PRItemsForRejected v-if="activeTab === 'RC'"></PRItemsForRejected>
</template>

<script setup>
import { ref } from "vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { hasPermission } from "@/views/Utility/Permissions";

// Import the tab components
import MRFSlipCancelledTab from "../Cancelled/MRFSlipCancelled/Index.vue";
import MRFItemsCancelledTab from "../Cancelled/MRFItemsCancelled/Index.vue";
import PRItemsForRejected from "../Cancelled/PRItemsRejected/Index.vue";

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
