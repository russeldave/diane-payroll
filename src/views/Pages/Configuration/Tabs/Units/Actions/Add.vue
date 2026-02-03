<template>
  <button
    @click.prevent="addBehavior()"
    type="button"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-ruler"></i>
    Add Unit
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'md'"
    title="New Unit"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addUnit()" autocomplete="off">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="unitForm.unit_name"
              placeholder="Input Unit Type"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Abbreviation</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="unitForm.abbre"
              placeholder="Input Unit Abbreviation"
              maxlength="5"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Remarks</label
            >
            <textarea
              v-model="unitForm.remarks"
              placeholder="Input Unit Remarks"
              class="mt-1 p-2 border rounded-md w-full"
            ></textarea>
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
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";
import { getUnits } from "@/views/Utility/PreProcess";
const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const warehouse = ref([]);
const categories = ref([]);
const unitForm = ref({
  brand_id: 0,
  unit_name: "",
  abbre: "",
  remarks: "",
});

const resetForm = () => {
  unitForm.value.brand_id = 0;
  unitForm.value.unit_name = "";
  unitForm.value.abbre = "";
  unitForm.value.remarks = "";
};

const addBehavior = () => {
  isAddModalOpen.value = true;
  resetForm();
};

const addUnit = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we create the unit.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(unitForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}units/add`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isAddModalOpen.value = false;
    getUnits(token);
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};
</script>
