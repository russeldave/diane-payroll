<template>
  <button
    @click="addBehavior()"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-warehouse"></i>
    Add Warehouse
  </button>

  <!-- Add Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'lg'"
    title="Add Warehouse"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addWarehouse()" autocomplete="off">
        <!-- Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            v-model="warehouseForm.warehouse_name"
            placeholder="Input Warehouse Name"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        <!-- Remarks -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea
            v-model="warehouseForm.remarks"
            placeholder="Input Warehouse Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>

        <!-- is_allowed_in_receiving -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Allowed in Receiving</label
          >
          <label class="switch">
            <input
              type="checkbox"
              v-model="isAllowedInReceivingBool"
              @change="
                warehouseForm.is_allowed_in_receiving = isAllowedInReceivingBool ? 1 : 0
              "
            />
            <span class="slider"></span>
          </label>
        </div>

        <!-- is_auto_unpack -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Auto Unpack</label>
          <label class="switch">
            <input
              type="checkbox"
              v-model="isAutoUnpackBool"
              @change="warehouseForm.is_auto_unpack = isAutoUnpackBool ? 1 : 0"
            />
            <span class="slider"></span>
          </label>
        </div>

        <!-- Submit -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");

const isAddModalOpen = ref(false);
const isAllowedInReceivingBool = ref(false);
const isAutoUnpackBool = ref(false);

const warehouseForm = ref({
  warehouse_id: 0,
  warehouse_name: "",
  remarks: "",
  is_allowed_in_receiving: 0,
  is_auto_unpack: 0,
});

const addBehavior = () => {
  isAddModalOpen.value = true;
  resetForm();
};

const resetForm = () => {
  warehouseForm.value = {
    warehouse_id: 0,
    warehouse_name: "",
    remarks: "",
    is_allowed_in_receiving: 0,
    is_auto_unpack: 0,
  };
  isAllowedInReceivingBool.value = false;
  isAutoUnpackBool.value = false;
};

const addWarehouse = async () => {
  try {
    const formData = FormDx(warehouseForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}warehouses/add`,
      formData,
      BearToken(token)
    );

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};
</script>

<style scoped>
/* Toggle switch style */
.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 34px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #3b82f6;
}
input:checked + .slider:before {
  transform: translateX(22px);
}
</style>
