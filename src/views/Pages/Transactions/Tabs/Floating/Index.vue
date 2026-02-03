<template>
  <FloatingItems :warehouse_id="props.warehouse_id" />
</template>

<script setup>
import { ref, defineProps, watch } from "vue";

// Import the tab components
import FloatingItems from "../Floating/FloatingItems/Index.vue";
import { hasPermission } from "@/views/Utility/Permissions";

// Define props and reactive states
const props = defineProps({
  warehouse_id: Number,
});

const activeTab = ref(localStorage.getItem('activeReceivedTab') || 'PID'); // Default to 'FDS' or use stored value
const default_warehouse = ref(props.warehouse_id);

// Watch for changes in warehouse_id and update default_warehouse accordingly
watch(() => props.warehouse_id, (newVal) => {
  default_warehouse.value = newVal;
});

// Save activeTab to local storage when it changes
watch(activeTab, (newVal) => {
  localStorage.setItem('activeReceivedTab', newVal);
});

// Activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};
</script>
