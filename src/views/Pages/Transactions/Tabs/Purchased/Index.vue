<template>
  <div class="dark:border-gray-700 bg-yellow-50 overflow-x-auto overflow-y-hidden">
    <!-- Static Tabs -->
    <ul
      class="flex flex-nowrap lg:flex-wrap -mb-px text-sm md:text-lg font-bold text-center text-gray-500 dark:text-gray-400"
    >
      <!-- Delivery Slip Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('Purchase_Order_Slip_For_Delivery_Tab')"
          @click.prevent="activateTab('POApproval')"
          title="Purchase Order List For Delivery"
          :class="{
            'inline-flex text-yellow-600 border-b-4 p-2 mb-1 border-yellow-500 rounded-t-lg active dark:text-yellow-500 dark:border-yellow-500':
              activeTab === 'POApproval',
            'inline-flex items-center justify-center p-2 mb-1 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'POApproval',
          }"
        >
          <i class="fas fa-clipboard me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
            >Purchase Order (For Approval)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"
            ><small>PO (For Approval)</small></span
          >
        </a>
      </li>
      <!-- Items for Delivery Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('Purchase_Order_Approved_Tab')"
          @click.prevent="activateTab('POItemsForAppoval')"
          title="PO Items for Approval"
          :class="{
            'inline-flex text-yellow-600 border-b-4 p-2 border-yellow-500 rounded-t-lg active dark:text-yellow-500 dark:border-yellow-500':
              activeTab === 'POItemsForAppoval',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'POItemsForAppoval',
          }"
        >
          <i class="fas fa-clipboard me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
            >Purchase Order Items (For Approval)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"
            ><small>PO Items (For Approval)</small></span
          >
        </a>
      </li>
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('Purchase_Order_Slip_Completed_Tab')"
          @click.prevent="activateTab('POForDelivery')"
          title="Completed Purchase Order List"
          :class="{
            'inline-flex text-yellow-600 border-b-4 p-2 mb-1 border-yellow-500 rounded-t-lg active dark:text-yellow-500 dark:border-yellow-500':
              activeTab === 'POForDelivery',
            'inline-flex items-center justify-center p-2 mb-1 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'POForDelivery',
          }"
        >
          <i class="fas fa-truck-fast me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
            >Purchase Order (For Delivery)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"
            ><small>PO (For Delivery)</small></span
          >
        </a>
      </li>
      <!-- Items for Delivery Tab -->
      <li class="me-2 mb-2 md:mb-0">
        <a
          href="#"
          v-if="hasPermission('Purchase_Order_Item_Completed_Tab')"
          @click.prevent="activateTab('POItemsForDelivery')"
          title="Items Delivered"
          :class="{
            'inline-flex text-yellow-600 border-b-4 p-2 border-yellow-500 rounded-t-lg active dark:text-yellow-500 dark:border-yellow-500':
              activeTab === 'POItemsForDelivery',
            'inline-flex items-center justify-center p-2 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
              activeTab !== 'POItemsForDelivery',
          }"
        >
          <i class="fas fa-truck-fast me-2"></i>
          <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
            >Purchase Order Items (For Delivery)</span
          >
          <span
            class="text-xs sm:text-sm md:text-md xl:text-md inline lg:hidden text-nowrap"
            ><small>PO Items (For Delivery)</small></span
          >
        </a>
      </li>
    </ul>
    <!-- <div class="justify-end flex">
      <Add v-if="hasPermission('Items_Add_New_Item_Button')" @transaction_id="handleTransaction" />
    </div> -->
  </div>

  <!-- Tab content -->
  <POForApproval v-if="activeTab === 'POApproval'" />
  <POItemsForApproval
    v-if="activeTab === 'POItemsForAppoval'"
    :warehouse_id="props.warehouse_id"
  />
  <POForDelivery v-if="activeTab === 'POForDelivery'" />
  <POItemsForDelivery
    v-if="activeTab === 'POItemsForDelivery'"
    :warehouse_id="props.warehouse_id"
  />
</template>

<script setup>
import { ref, defineProps, watch } from "vue";

// Import the tab components
import POForApproval from "../Purchased/POForApproval/Index.vue";
import POItemsForApproval from "../Purchased/POItemsForApproval/Index.vue";
import POForDelivery from "../Purchased/POForDelivery/Index.vue";
import POItemsForDelivery from "../Purchased/POItemsForDelivery/Index.vue";
import { hasPermission } from "@/views/Utility/Permissions";

// Define props and reactive states
const props = defineProps({
  warehouse_id: Number,
});

const activeTab = ref(localStorage.getItem("activePurchasedTab") || "POApproval"); // Default to 'FDS' or use stored value
const default_warehouse = ref(props.warehouse_id);

// Watch for changes in warehouse_id and update default_warehouse accordingly
watch(
  () => props.warehouse_id,
  (newVal) => {
    default_warehouse.value = newVal;
  }
);

// Save activeTab to local storage when it changes
watch(activeTab, (newVal) => {
  localStorage.setItem("activePurchasedTab", newVal);
});

// Activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};
</script>
