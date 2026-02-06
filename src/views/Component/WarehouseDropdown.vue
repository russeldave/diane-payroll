<template>
  <div class="flex justify-start items-center gap-2">
    <select
      :class="user.warehouse_id == 0 ? 'bg-gray-200' : 'bg-amber-200'"
      class="text-gray-800 px-2 py-1 rounded text-3xl font-bold shadow-lg"
      v-model="user.warehouse_id"
      @change.prevent="assignDefaultWarehouse"
      :disabled="isDisabledSetWarehouse"
      >
      <option value="0">--Select Warehouse--</option>
      <option v-for="wh in warehouses" :key="wh.warehouseId" :value="wh.warehouseId">
        {{ wh.warehouseName }}
      </option>
    </select>
    <!-- <span v-if="loading" class="ml-2 text-xs text-gray-500">Loading...</span> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { VUE_APP_API_URL, PERMISSION } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  replaceSpaceWithUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";
import { hasPermission } from "../Utility/Permissions";

const emits = defineEmits(["warehouseChanged"]);
const token = localStorage.getItem("token");
const loading = ref(false);
const warehouses = ref([]);
const isDisabledSetWarehouse = ref(true);
const user = reactive({
  warehouse_id: 0,
});

const assignDefaultWarehouse = async () => {
  loading.value = true; // Show loader
  return;
  try {
    const formData = FormDx(user);
    const response = await axios.post(
      `${VUE_APP_API_URL}users/set-default-warehouse`,
      formData,
      BearToken(token)
    );

    loadDefaultWarehouse();
    localStorage.setItem("warehouse_id", user.warehouse_id);
    emits("warehouseChanged", user.warehouse_id);
    Alert("success", "Success", response.data.message);
    loading.value = false;
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    loading.value = false;
  }
};

const loadWarehouses = async () => {
  return;
  try {
    loading.value = true;
    warehouses.value = [];
    const response = await axios.post(
      `api/users/warehouses-dropdown`,
      { id: 0 }
    );
    warehouses.value = response.data.userWarehouses || [];
    loading.value = false;
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    loading.value = false;
  }
};

const loadDefaultWarehouse = async () => {
  return;
  try {
    const response = await axios.post(
      `${VUE_APP_API_URL}users/get-default-warehouse`,
      { id: 0 }, // Assuming you want to fetch all warehouses
      BearToken(token)
    );
    user.warehouse_id = response.data.warehouseId || 0;
    localStorage.setItem("warehouse_id", user.warehouse_id);
  } catch (error) {
    console.error("Error fetching warehouses:", error);
  }
};

onMounted(() => {
  loadWarehouses();
  loadDefaultWarehouse();
  isDisabledSetWarehouse.value = !hasPermission('Can_Set_User_Warehouse');
  // console.log('onMounted');
  // console.log(isDisabledSetWarehouse.value)
});
</script>
