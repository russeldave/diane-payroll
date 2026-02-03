<template>
  <div v-if="hasPermission('Navigation_Transfer')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Transfer'" /> -->
      <h1 class="text-lg md:text-2xl font-bold mt-1 text-nowrap">Transfer</h1>

      <TransferredTab
        :key="receivedTabKey"
        :warehouse_id="warehouse_id"
        v-if="
          activeTab === 'Transferred' &&
          hasPermission('Transfer_Transferred') &&
          hasPermission('Navigation_Transfer')
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
import TransferredTab from "./Tabs/Transferred/Index.vue";

// Define reactive properties
const activeTab = ref("Transferred");
const warehouse_id = ref(parseFloat(localStorage.getItem("defaultWarehouse")) || 0);
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
  localStorage.setItem("defaultWarehouse", warehouse_id.value);
  // Trigger a key change to force a reload of the components if needed
  receivedTabKey.value += 1;
};

// Function to check for changes in localStorage
const checkLocalStorageForChanges = () => {
  const currentWarehouseId = parseFloat(localStorage.getItem("defaultWarehouse")) || 0;
  if (currentWarehouseId !== warehouse_id.value) {
    warehouse_id.value = currentWarehouseId; // Update the reactive property
    receivedTabKey.value += 1; // Force a reload of components
  }
};

// Check localStorage on component mount and at regular intervals
onMounted(() => {
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
