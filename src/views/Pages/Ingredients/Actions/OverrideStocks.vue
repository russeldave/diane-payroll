<template>
  <button
    @click.prevent="binBehavior()"
    class="bg-red-700 hover:opacity-70 focus:bg-red-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-l mb-4 float-end text-nowrap"
  >
    <i class="fas fa-ban"></i>
    Override
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'xl'"
    title="Override Stocks"
    @close="isAddModalOpen = false"
  >
      <div class="flex  ms-8 mt-4">
        <div class="bg-yellow-100 p-2 rounded-lg">
          <input
            type="checkbox"
              v-model="overrideForm.restore_item"
              class="w-4 h-4 bg-red-500"
              @change.prevent="restoreItem()"
            />
          <label
            for="LeagueName"
            class="mb-2 text-md ml-2 font-medium text-red-500"
            >Restore this item?</label>
        </div>
      </div>
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="overrideStocks()">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Warehouse Name</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="overrideForm.warehouse_name"
              placeholder="Input Warehouse Name"
              required
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Current Stocks</label
            >
            <input
              type="number"
              id="ProductName"
              v-model="overrideForm.current_stocks"
              placeholder="Input Product Stock Alarm Limit"
              required
              min="1"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Added Quantity</label
            >
            <input
              type="number"
              id="ProductName"
              v-model="overrideForm.added_stocks"
              placeholder="Input Product Stock Alarm Limit"
              required
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>
        <div class="flex items-center justify-end">
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
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  WAREHOUSE,
  CATEGORIES,
  
} from "@/views/Utility/Global";
import {handleApiError, FormDx, BearToken, Alert, replaceUnderScore } from "@/views/Utility/Helper";
const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const items = ref([]);
const warehouse = ref([]);
const overrideForm = ref({
  item_id: 0,
  item_name: "",
  current_stocks: 0,
  added_stocks: 1,
  restore_item: false
});

const resetForm = () => {
  overrideForm.value = {
    item_id: 0,
    item_name: "",
    current_stocks: 0,
    added_stocks: 1,
    restore_item: false
  };
};
const props = defineProps({
  data: Object,
});
const binBehavior = () => {
  const data = props.data;
  console.log('bingBehaviour');
  console.log(data)

  resetForm();
  overrideForm.value = {
    item_id: data.itemId,
    warehouse_id: data.warehouseId,
    warehouse_name: data.warehouseName,
    current_stocks: data.floatStocks,
    added_stocks: 1,
    restore_item: data.warehouseItemStatus === 7 ? false : true,
    ingredient_warehouse_id: data.id,
  };

  isAddModalOpen.value = true;
};

const overrideStocks = async () => {
  try {
    // Show the processing alert
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(overrideForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}overrides/float-stocks`,
      formData,
      BearToken(token)
    );

    Swal.close();
    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    console.log(error);
    Alert("error", "Error", error.response.data.message);
  }
};

const restoreItem = async () => {
  const { isConfirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to submit the changes?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, submit!',
    cancelButtonText: 'No, cancel'
  });

  if (!isConfirmed) return;

  try {
    const formData = FormDx({
      ingredient_warehouse_id: overrideForm.value.ingredient_warehouse_id,
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}warehouse-has-ingredients/unhide`,
      formData,
      BearToken(token)
    );

    isAddModalOpen.value = false;
    Swal.fire('Success', response.data.message, 'success');
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};


// Call listItems when component is mounted
onMounted(() => {});
</script>
