<template>
  <div v-if="hasPermission('Navigation_Material_Requisition')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Material Requisiton'" /> -->
      <!-- <Popper arrow  content="{ content }">
        <h1 class="text-lg md:text-2xl font-bold mb-4 mt-4 text-nowrap">Transactions</h1>
        <template #content>
          <div class="bg-red-500">This is the Popper content</div>
        </template>
      </Popper> -->
      <!-- <div class="block lg:flex lg:justify-start space-x-3 items-center">
        <h1 class="text-lg md:text-2xl font-bold mb-4 mt-4 text-nowrap">Transactions</h1>
        <Instructions />
      </div> -->
      <div class="flex items-center justify-between mb-4 mt-1">
        <h1 class="text-lg md:text-2xl font-bold">
          Material Requisition / Purchase Request Management
        </h1>

        <div class="flex items-start space-x-2">
          <LowStocks/>
          <Available/>
          <IngredientMenuHistory />
          <!-- <MRFAvailable /> -->
          <MRFReceived />       
          <StockOut/>
        </div>
      </div>
      <!-- Warehouse Selection -->
      <div class="flex flex-nowrap overflow-x-auto">
        <!-- Static Tabs -->
        <ul
          class="flex flex-row -mb-px text-sm md:text-lg font-bold text-center text-gray-500 dark:text-gray-400"
        >
          <li
            class="me-2 relative"
            v-if="
              hasPermission('Transactions_Requested') &&
              hasPermission('Navigation_Transactions')
            "
          >
            <a
              href="#"
              title="Material Requisition Requested"
              @click.prevent="activateTab('StockInOut')"
              :class="{
                'inline-flex text-cyan-500 border-b-4 border-cyan-400 p-2 mb-1 bg-cyan-50 rounded-t-lg active dark:text-cyan-500 dark:border-cyan-500':
                  activeTab === 'StockInOut',
                'inline-flex items-center justify-center p-2 mb-1 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'StockInOut',
              }"
            >
              <i class="fas fa-list-check me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate Transfer"
                >Stock In & Out</span
              >
              <!-- <span class="text-xs sm:text-sm md:text-md xl:text-md truncate inline xl:hidden text-nowrap">NIR</span> -->
            </a>
          </li>
          <!-- <li
            class="me-2 relative"
            v-if="
              hasPermission('Transactions_Requested') &&
              hasPermission('Navigation_Transactions')
            "
            >
            <a
              href="#"
              title="Material Requisition Requested"
              @click.prevent="activateTab('Requested')"
              :class="{
                'inline-flex text-purple-500 border-b-4 border-purple-400 p-2 mb-1 bg-purple-50 rounded-t-lg active dark:text-purple-500 dark:border-purple-500':
                  activeTab === 'Requested',
                'inline-flex items-center justify-center p-2 mb-1 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'Requested',
              }"
            >
              <i class="fas fa-list-check me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate Transfer"
                >New Item Request</span
              >
            </a>
          </li> -->
          <li
            class="me-2"
            v-if="
              hasPermission('Transactions_Approval') &&
              hasPermission('Navigation_Transactions')
            "
          >
            <a
              href="#"
              title="Material Requisition For Approval"
              @click.prevent="activateTab('Approval')"
              :class="{
                'inline-flex text-red-500 border-b-4 p-2 border-red-400 bg-red-50 rounded-t-lg active dark:text-red-500 dark:border-red-500':
                  activeTab === 'Approval',
                'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'Approval',
              }"
            >
              <i class="fas fa-hourglass me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate Transfer"
                >For Approval</span
              >
              <!-- <span class="text-xs sm:text-sm md:text-md xl:text-md truncate inline xl:hidden text-nowrap">MRF - FA</span> -->
            </a>
          </li>
          <li
            class="me-2"
            v-if="
              hasPermission('Transactions_MRF') &&
              hasPermission('Navigation_Transactions')
            "
            >
            <a
              href="#"
              title="Material Requisition"
              @click.prevent="activateTab('MRF')"
              :class="{
                'inline-flex text-indigo-500 border-b-4 border-blue-400 p-2 bg-indigo-50 rounded-t-lg active dark:text-indigo-500 dark:border-indigo-500':
                  activeTab === 'MRF',
                'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'MRF',
              }"
              >
              <i class="fas fa-file-invoice me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate Transfer"
                >Approved</span
              >
              <!-- <span class="text-xs sm:text-sm md:text-md xl:text-md truncate inline xl:hidden text-nowrap">MRF - AP</span> -->
            </a>
          </li>
          <li
            class="me-2"
            v-if="
              hasPermission('Transactions_PR') && hasPermission('Navigation_Transactions')
            "
          >
            <a
              href="#"
              title="Purchase Request"
              @click.prevent="activateTab('PR')"
              :class="{
                'inline-flex text-green-500 border-b-4 border-lime-600 p-2 bg-green-50 rounded-t-lg active dark:text-green-500 dark:border-green-500':
                  activeTab === 'PR',
                'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'PR',
              }"
            >
              <i class="fas fa-file-contract me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate Transfer"
                >PR / Receiving</span
              >
              <!-- <span class="text-xs sm:text-sm md:text-md xl:text-md truncate inline xl:hidden text-nowrap">PR/RCV</span> -->
            </a>
          </li>
          <li
            class="me-2"
            v-if="
              hasPermission('Transactions_Purchased') &&
              hasPermission('Navigation_Transactions')
            "
          >
            <a
              href="#"
              @click.prevent="activateTab('Purchased')"
              title="Purchase Order"
              :class="{
                'inline-flex text-yellow-500 p-2 border-b-4 border-yellow-400 bg-yellow-50 rounded-t-lg active dark:text-yellow-500 dark:border-yellow-500':
                  activeTab === 'Purchased',
                'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'Purchased',
              }"
            >
              <i class="fas fa-truck-fast me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate Transfer"
                  >Purchase Order</span
              >
              <!-- <span class="text-xs sm:text-sm md:text-md xl:text-md truncate inline xl:hidden text-nowrap">PO</span> -->
            </a>
          </li>
          <!-- <li class="me-2 mb-2 md:mb-0">
            <a
              href="#"
              v-if="hasPermission('MRF_Item_Receiving_Tab')"
              @click.prevent="activateTab('Receiving')"
              title="Receiving"
              :class="{
                'inline-flex text-blue-500 border-b-2 p-4 bg-blue-50 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                  activeTab === 'Receiving',
                'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'Receiving',
              }"
            >
              <i class="fas fa-warehouse me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate Transfer">Receiving</span>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate inline xl:hidden text-nowrap"><small>RCV</small></span>
            </a>
          </li> -->
          <!-- <li class="me-2" v-if="hasPermission('Transactions_Transferred') && hasPermission('Navigation_Transactions')">
            <a
              href="#"
              title="Transferred"
              @click.prevent="activateTab('Transferred')"
              :class="{
                'inline-flex text-orange-500 border-b-2 p-4 bg-orange-50 rounded-t-lg active dark:text-orange-500 dark:border-orange-500':
                  activeTab === 'Transferred',
                'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'Transferred',
              }"
            >
              <i class="fas fa-exchange-alt me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate hidden md:inline">Transferred</span>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate inline md:hidden" title="Transferred Items">TRNS</span>
            </a>
          </li> -->
          <!-- <li class="me-2" v-if="hasPermission('Transactions_Floating') && hasPermission('Navigation_Transactions')">
            <a
              href="#"
              title="Floating"
              @click.prevent="activateTab('Floating')"
              :class="{
                'inline-flex text-blue-500 border-b-2 p-4 bg-blue-50 border-blue-500 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                  activeTab === 'Floating',
                'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'Floating',
              }"
            >
              <i class="fas fa-box me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate hidden md:inline">Floating Items</span>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate inline md:hidden" title="Floating Items">Floating</span>
            </a>
          </li> -->
          <!-- <li
            class="me-2"
            v-if="
              hasPermission('Transactions_Return') &&
              hasPermission('Navigation_Transactions')
            "
            >
            <a
              href="#"
              title="Return Items"
              @click.prevent="activateTab('Return')"
              :class="{
                'inline-flex text-gray-500 border-b-4 p-2 bg-gray-50 border-blue-500 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                  activeTab === 'Return',
                'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'Return',
              }"
              >
              <i class="fas fa-rotate-left me-2"></i>
              <span
                class="text-xs sm:text-sm md:text-md xl:text-md truncate hidden md:inline"
                >Return Items</span
              >
              <span
                class="text-xs sm:text-sm md:text-md xl:text-md truncate inline md:hidden"
                title="Floating Items"
                >Return</span
              >
            </a>
          </li> -->
          <li class="me-2 mb-2 md:mb-0">
            <a
              href="#"
              v-if="hasPermission('Direct_Receive_Tab')"
              @click.prevent="activateTab('Direct_Receive')"
              title="Direct_Receive"
              :class="{
                'inline-flex text-blue-500 p-2 border-b-4 bg-blue-50 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                  activeTab === 'Direct_Receive',
                'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'Direct_Receive',
              }"
            >
              <i class="fas fa-warehouse me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate Transfer"
                >Direct Receiving</span
              >
            </a>
          </li>
          <li class="me-2 mb-2 md:mb-0">
            <a
              href="#"
              v-if="hasPermission('Direct_Receive_Tab')"
              @click.prevent="activateTab('Cancelled')"
              title="Cancelled"
              :class="{
                'inline-flex text-blue-500 p-2 border-b-4 bg-blue-50 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                  activeTab === 'Cancelled',
                'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'Cancelled',
              }"
            >
              <i class="fas fa-warehouse me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md truncate Transfer"
                >Cancelled</span
              >
            </a>
          </li>
        </ul>
      </div>

      <!-- Tab content -->
      <ApprovalTab
        :key="receivedTabKey"
        :warehouse_id="warehouse_id"
        v-if="
          activeTab === 'Approval' &&
          hasPermission('Transactions_Approval') &&
          hasPermission('Navigation_Transactions')
        "
      />
      <StockInOutTab
        :key="receivedTabKey"
        v-if="
          activeTab === 'StockInOut' &&
          hasPermission('Transactions_In_Out_Tab') &&
          hasPermission('Navigation_Transactions')
        "
      />
      <!-- <RequestedTab
        :key="receivedTabKey"
        :warehouse_id="warehouse_id"
        v-if="
          activeTab === 'Requested' &&
          hasPermission('Transactions_Requested') &&
          hasPermission('Navigation_Transactions')
        "
      /> -->
      <Direct
        :key="receivedTabKey"
        :warehouse_id="warehouse_id"
        v-if="
          activeTab === 'Direct_Receive' &&
          hasPermission('Transactions_Direct') &&
          hasPermission('Navigation_Transactions')
        "
      />
      <MRFTab
        :key="receivedTabKey"
        :warehouse_id="warehouse_id"
        v-if="
          activeTab === 'MRF' &&
          hasPermission('Transactions_MRF') &&
          hasPermission('Navigation_Transactions')
        "
      />
      <PRTab
        :key="receivedTabKey"
        v-if="activeTab === 'PR' && hasPermission('Transactions_PR')"
      />
      <Receiving
        :key="receivedTabKey"
        v-if="activeTab === 'Receiving' && hasPermission('Transactions_Receiving')"
        :warehouse_id="warehouse_id"
      />
      <PurchasedTab
        :key="receivedTabKey"
        :warehouse_id="warehouse_id"
        v-if="
          activeTab === 'Purchased' &&
          hasPermission('Transactions_Purchased') &&
          hasPermission('Navigation_Transactions')
        "
      />
      <!-- <TransferredTab :key="receivedTabKey" :warehouse_id="warehouse_id" v-if="activeTab === 'Transferred' && hasPermission('Transactions_Transferred') && hasPermission('Navigation_Transactions')" /> -->
      <Floating
        :key="receivedTabKey"
        :warehouse_id="warehouse_id"
        v-if="
          activeTab === 'Floating' &&
          hasPermission('Transactions_Floating') &&
          hasPermission('Navigation_Transactions')
        "
      />
      <!-- <Return
        :key="receivedTabKey"
        :warehouse_id="warehouse_id"
        v-if="
          activeTab === 'Return' &&
          hasPermission('Transactions_Return') &&
          hasPermission('Navigation_Transactions')
        "
      /> -->
      <CancelledTab
        :key="receivedTabKey"
        :warehouse_id="warehouse_id"
        v-if="
          activeTab === 'Cancelled' &&
          hasPermission('Transactions_Cancelled')
        "
      />
    </div>
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import Swal from "sweetalert2";

import Error403 from "@/views/Error/403.vue";
import MRFTab from "./Tabs/MRF/Index.vue";
import PRTab from "./Tabs/PR/Index.vue";
import PurchasedTab from "./Tabs/Purchased/Index.vue";
import Floating from "./Tabs/Floating/Index.vue"; 
// import RequestedTab from "./Tabs/Requested/Index.vue";
import StockInOutTab from "./Tabs/StockInOut/Index.vue";
import Receiving from "./Tabs/Receiving/Index.vue";
import Direct from "./Tabs/Direct/Index.vue";
// import Return from "./Tabs/Return/Index.vue";
import ApprovalTab from "./Tabs/Approval/Index.vue";
import CancelledTab from "./Tabs/Cancelled/Index.vue";
// import Popper from "vue3-popper";
// import MRFAvailable from "./Tabs/MRF/MRFAvailable.vue";
import MRFReceived from "./Tabs/MRF/MRFReceived.vue";
import IngredientMenuHistory from "../Ingredients/Actions/IngredientMenuHistory.vue";
import StockOut from "./Tabs/StockInOut/StockOut/StockOut.vue";
import LowStocks from "../Ingredients/Actions/LowStocks.vue";
import Available from "../Ingredients/Actions/Available.vue";
 
// Define reactive properties
const activeTab = ref("MRF");
const warehouse_id = ref(parseFloat(localStorage.getItem("warehouse_id")) || 0);
const warehouseList = ref([]); // Replace with actual warehouse list fetch
const receivedTabKey = ref(0);

// Watch for changes in `warehouse_id` and force a component reload
watch(warehouse_id, () => {
  receivedTabKey.value += 1; // Update key to force component reload
});
// Activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};

// Update warehouse_id and sync with localStorage
const updateWarehouse = () => {
  localStorage.setItem("warehouse_id", warehouse_id.value);
  // Trigger a key change to force a reload of the components if needed
  receivedTabKey.value += 1;
};

// Function to check for changes in localStorage
const checkLocalStorageForChanges = () => {
  //wrong use props.warehouse_id as key on other components to reload
  const currentWarehouseId = parseFloat(localStorage.getItem("warehouse_id")) || 0;
  if (currentWarehouseId !== warehouse_id.value) {
    warehouse_id.value = currentWarehouseId; // Update the reactive property
    receivedTabKey.value += 1; // Force a reload of components
  }
};

// Check localStorage on component mount and at regular intervals
onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user") || "[]");
  activeTab.value = user?.[0]?.defaultTab ?? "MRF";
  checkLocalStorageForChanges(); // Check on mount

  // Set up a timer to periodically check localStorage
  const intervalId = setInterval(() => {
    checkLocalStorageForChanges();
  }, 1000); // Check every second

  // Clear interval on component unmount
  onUnmounted(() => {
    clearInterval(intervalId);
  });
});
</script>
