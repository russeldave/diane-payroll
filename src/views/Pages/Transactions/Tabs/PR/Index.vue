<template>
  <div class="dark:border-gray-700 bg-green-50 overflow-x-auto overflow-y-hidden">
    <!-- Static Tabs -->
    <ul
      class="flex flex-nowrap xl:flex-wrap -mb-px text-sm md:text-lg font-bold text-center text-gray-500 dark:text-gray-400"
    >
      <!-- PR List (For Purchase) Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('PR_List_For_Purchase_Tab')"
          @click.prevent="activateTab('PRP')"
          title="PR List (For Purchase)"
          :class="{
            'inline-flex text-green-600 border-b-4 p-2 mb-1 border-green-500 rounded-t-lg active dark:text-green-500 dark:border-green-500':
              activeTab === 'PRP',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'PRP',
          }"
        >
          <i class="fas fa-file-invoice me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline"
            >PR List (For Purchase)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"
            ><small>PR List (For Purchase)</small></span
          >
        </a>
      </li>
      <!-- PR Items (For Purchase) Tab -->
      <!-- <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('PR_Items_For_Purchase_Tab')"
          @click.prevent="activateTab('IFP')"
          title="PR Items (For Purchase)"
          :class="{
            'inline-flex text-lime-500 border-b-4 p-2 mb-1 border-green-600 rounded-t-lg active dark:text-green-500 dark:border-green-500':
              activeTab === 'IFP',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'IFP',
          }"
        >
          <i class="fas fa-boxes me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline"
            >PR Items (For Purchase)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"
            ><small>Items (For Purchase)</small></span
          >
        </a>
      </li> -->
      <!-- PR Items (For Receiviing) Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('PR_Items_For_Purchase_Tab')"
          @click.prevent="activateTab('PRR')"
          title="PR Items (Receiving)"
          :class="{
            'inline-flex text-green-600 border-b-4 p-2 border-green-500 mb-1 rounded-t-lg active dark:text-green-500 dark:border-green-500':
              activeTab === 'PRR',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'PRR',
          }"
        >
          <i class="fas fa-boxes me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline"
            >PR Items (Receiving)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"
            ><small>Items (Receiving)</small></span
          >
        </a>
      </li>
      <!-- PR List (Completed) Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('PR_Slip_Completed_Tab')"
          @click.prevent="activateTab('PRC')"
          title="PR List (Completed)"
          :class="{
            'inline-flex text-green-500 border-b-4 p-2 border-green-600 mb-1 rounded-t-lg active dark:text-green-500 dark:border-green-500':
              activeTab === 'PRC',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'PRC',
          }"
        >
          <i class="fas fa-file-invoice me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline"
            >PR List (Arrived)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"
            ><small>List (Arrived)</small></span
          >
        </a>
      </li>
      <!-- PR Items (Completed) Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('PR_Items_Completed_Tab')"
          @click.prevent="activateTab('IC')"
          title="PR Items (Completed)"
          :class="{
            'inline-flex text-green-500 border-b-4 p-2 border-green-600 mb-1 rounded-t-lg active dark:text-green-500 dark:border-green-500':
              activeTab === 'IC',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'IC',
          }"
        >
          <i class="fas fa-boxes me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden xl:inline"
            >PR Items (Arrived)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline xl:hidden text-nowrap"
            ><small>Items (Arrived)</small></span
          >
        </a>
      </li>
    </ul>
  </div>

  <!-- Tab content -->
  <PRForPurchaseTab v-if="activeTab === 'PRP'"></PRForPurchaseTab>
  <PRCompletedTab v-if="activeTab === 'PRC'"></PRCompletedTab>
  <PRItemsReceiving v-if="activeTab === 'PRR'"></PRItemsReceiving>
  <PRItemsForPurchase v-if="activeTab === 'IFP'"></PRItemsForPurchase>
  <PRItemsForCompleted v-if="activeTab === 'IC'"></PRItemsForCompleted>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { hasPermission } from "@/views/Utility/Permissions";

import PRForPurchaseTab from "../PR/PRSlipForPurchase/Index.vue";
import PRCompletedTab from "../PR/PRSlipCompleted/Index.vue"; 
import PRItemsReceiving from "../PR/PRItemsReceiving/Index.vue";
import PRItemsForPurchase from "../PR/PRItemsForPurchase/Index.vue";
import PRItemsForCompleted from "../PR/PRItemsCompleted/Index.vue";
// Define the active tab state
const activeTab = ref("PRP");

// Activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user") || "[]");
  activeTab.value = user?.[0]?.defaultPage ?? "PRP";
});
</script>
