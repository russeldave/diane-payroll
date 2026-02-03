<template>
  <div class="overflow-x-auto mt-4 overflow-y-hidden">
    <!-- Static Tabs -->
    <ul
      class="flex flex-nowrap lg:flex-wrap -mb-px text-sm md:text-lg font-bold text-center text-gray-500 dark:text-gray-400"
    >
      <!-- MRF Slip Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          @click.prevent="activateTab('MRF')"
          v-if="hasPermission('MRF_Slip_For_Transfer_Tab')"
          title="MRF Slip"
          :class="{
            'inline-flex text-red-500 border-b-2 p-4 border-red-600 bg-red-100 rounded-t-lg active dark:text-red-500 dark:border-red-500':
              activeTab === 'MRF',
            'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'MRF',
          }"
        >
          <i class="fas fa-truck-fast me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
            >MRF Slip</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"
            title="MRF Slip"
            >MRF</span
          >
        </a>
      </li>
      <!-- Items for Transfer Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('Transfer_For_Pending_Items_Tab')"
          @click.prevent="activateTab('FDI')"
          title="Items for Transfer"
          :class="{
            'inline-flex text-red-500 border-b-2 p-4 border-orange-600 bg-orange-100 rounded-t-lg active dark:text-orange-500 dark:border-orange-500':
              activeTab === 'FDI',
            'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'FDI',
          }"
        >
          <i class="fas fa-truck-fast me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
            >Items for Transfer (Pending)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"
            title="Pending Items for Transfer"
            >Pending Items</span
          >
        </a>
      </li>
      <!-- Receiving Items Tab -->

      <!-- Transferred Items Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('MRF_Transferred_Tab')"
          @click.prevent="activateTab('DI')"
          title="Transferred List"
          :class="{
            'inline-flex text-green-500 border-b-2 p-4 border-orange-600 bg-orange-100 rounded-t-lg active dark:text-orange-500 dark:border-orange-500':
              activeTab === 'DI',
            'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'DI',
          }"
        >
          <i class="fas fa-warehouse me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
            >Transfers List (Completed)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"
            title="Pending List for Transfer"
            >Transferred List</span
          >
        </a>
      </li>
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('MRF_Transferred_items_Tab')"
          @click.prevent="activateTab('TIC')"
          title="Transferred Items"
          :class="{
            'inline-flex text-green-500 border-b-2 p-4 border-orange-600 bg-orange-100 rounded-t-lg active dark:text-orange-500 dark:border-orange-500':
              activeTab === 'TIC',
            'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'TIC',
          }"
        >
          <i class="fas fa-warehouse me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
            >Transfers Items (Completed)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"
            title="Pending Items for Transfer"
            >Transferred Items</span
          >
        </a>
      </li>
    </ul>
  </div>

  <!-- Tab content -->
  <MRFSlip
    v-if="default_warehouse && activeTab === 'MRF'"
    :key="default_warehouse"
    :warehouse_id="default_warehouse"
  />
  <ForTransferItems
    v-if="default_warehouse && activeTab === 'FDI'"
    :key="default_warehouse"
    :warehouse_id="default_warehouse"
  />
  <TransferCompleted
    v-if="default_warehouse && activeTab === 'DI'"
    :key="default_warehouse"
    :warehouse_id="default_warehouse"
  />
  <TransferItemsCompleted
    v-if="default_warehouse && activeTab === 'TIC'"
    :key="default_warehouse"
    :warehouse_id="default_warehouse"
  />
</template>

<script setup>
import { ref, defineProps, watch } from "vue";
import { hasPermission } from "@/views/Utility/Permissions";

// Import the tab components
import TransferCompleted from "./TransferCompleted/Index.vue";
import ForTransferItems from "./ForTransferItems/Index.vue";
import TransferItemsCompleted from "./TransferItemsCompleted/Index.vue";
import MRFSlip from "./MRFSlip/Index.vue";

const activeTab = ref(localStorage.getItem("activeTransferredTab") || "MRF"); // Default to 'MRF' or use stored value
const default_warehouse = localStorage.getItem("warehouse_id") || 0;

// Save activeTab to local storage when it changes
watch(activeTab, (newVal) => {
  localStorage.setItem("activeTransferredTab", newVal);
});

// Activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};
</script>
