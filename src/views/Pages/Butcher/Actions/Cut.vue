<template>
  <button
    @click.prevent="editBehavior()"
    type="button"
    :class="[
      'bg-green-500 text-white hover:opacity-70 rounded-l focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-cut"></i>
    Cut
  </button>

  <!-- Butcher Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="Cut Butcher"
    @close="isAddModalOpen = false"
  >
    <div class="block p-6">
      <form class="mt-4" @submit.prevent="cutIngredient()" autocomplete="off">
        <!-- Grouping the information fields into two sections -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Butcher Name & Cost Price Section -->
          <div>
            <div class="mb-4">
              <label for="ButcherName" class="block text-sm font-medium text-gray-700"
                >Butcher Name</label
              >
              <h1
                class="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
              >
                {{ butcherForm.butcher_name }}
              </h1>
            </div>
          </div>

          <div>
            <div class="mb-4">
              <label for="CostPrice" class="block text-sm font-medium text-gray-700"
                >Cost Price</label
              >
              <h1
                class="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
              >
                {{ butcherForm.butcher_cost_price ?? 0 }}
              </h1>
            </div>
          </div>
        </div>

        <!-- Net Weight, Trimmings, and Variance Inputs Section -->
        <div class="mb-4 md:col-span-2">
          <label for="NetWeight" class="block text-sm font-medium text-gray-700"
            >Net Weight</label
          >
          <input
            type="number"
            id="NetWeight"
            v-model="butcherForm.net_quantity"
            @input.prevent="calculateButcherCostPrice()"
            placeholder="Enter Net Quantity"
            required
            class="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="mb-4 md:col-span-2">
          <label for="Trimmings" class="block text-sm font-medium text-gray-700">
            Trimmings (<b class="font-bold text-red-500">{{
              butcherForm.trimming_name
            }}</b
            >)
          </label>
          <input
            type="number"
            id="Trimmings"
            v-model="butcherForm.trimming_quantity"
            @input.prevent="calculateButcherCostPrice()"
            placeholder="Enter Trimming Quantity"
            required
            class="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="mb-4 md:col-span-2">
          <label for="Variance" class="block text-sm font-medium text-gray-700"
            >Variance</label
          >
          <input
            type="number"
            id="Variance"
            v-model="butcherForm.variance_quantity"
            @input.prevent="calculateButcherCostPrice()"
            placeholder="Enter Variance"
            required
            class="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Total Deducted and Raw Cost Price Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="mb-4">
              <label for="TotalDeducted" class="block text-sm font-medium text-gray-700">
                Total Deducted
              </label>
              <p hidden>
                {{
                  (butcherForm.deducted_quantity =
                    (butcherForm.net_quantity ?? 0) +
                    (butcherForm.variance_quantity ?? 0) +
                    (butcherForm.trimming_quantity ?? 0))
                }}
              </p>
              <h1
                class="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
              >
                {{ butcherForm.deducted_quantity }}
              </h1>

              <small class="text-gray-500"
                >Deducted to <b class="text-red-500">{{ butcherForm.raw_name }}</b></small
              >
            </div>
          </div>

          <div>
            <div class="mb-4">
              <label for="RawCostPrice" class="block text-sm font-medium text-gray-700"
                >Raw Cost Price</label
              >
              <h1
                class="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
              >
                {{ butcherForm.raw_cost_price ?? 0 }}
              </h1>
            </div>
          </div>
        </div>

        <!-- Image Upload Section -->
        <div class="mb-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2"> Proof </label>
          <ImageUpload
            :maxFiles="5"
            :maxFileSize="10 * 1024 * 1024"
            :hideDragArea="false"
            @files-selected="handleImagesSelected"
          />
        </div>
        <!-- Submit Button Section -->
        <div class="flex items-center justify-end mt-6">
          <button
            type="submit"
            class="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
import ImageUpload from "@/views/Component/ImageUpload.vue";
import { VUE_APP_API_URL, UNITS } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

import IngImageViewer from "../Actions/IngImageViewer.vue";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
});
const isAddModalOpen = ref(false);
const units = ref([]);
const imageFiles = ref([]);
const categories = ref([]);
const trimmingIngredients = ref([]);
const butcherForm = ref({
  ingredient_id: 0,
  butcher_name: "",
  trimming_name: "",
  trimming_quantity: 0,
  raw_name: "",
  net_quantity: 0,
  variance_quantity: 0,
});
const editBehavior = () => {
  resetForm();
  fillForm();
  isAddModalOpen.value = true;
};
const fillForm = () => {
  const data = props.data;

  console.log(data);

  butcherForm.value = {
    ingredient_id: data.id,
    butcher_name: data.ingredientFullName,
    trimming_name: data.trimmingName,
    trimming_quantity: 0,
    raw_name: data.rawName,
    warehouse_id: data.warehouseId ?? 0,
    ingredient_id_number: data.ingredientIdNumber ?? 0,
    net_quantity: 0,
    variance_quantity: 0,
    butcher_cost_price: data.butcherCostPrice ?? 0,
    old_butcher_cost_price: data.butcherCostPrice ?? 0,
    raw_cost_price: data.rawCostPrice ?? 0,
    deducted_quantity: 0,
  };
};

const calculateButcherCostPrice = () => {
  butcherForm.value.butcher_cost_price = (
    ((butcherForm.value.deducted_quantity ?? 0) *
      (butcherForm.value.raw_cost_price ?? 0)) /
    (butcherForm.value.net_quantity ?? 0)
  ).toFixed(2);
  butcherForm.value.butcher_cost_price =
    butcherForm.value.butcher_cost_price == "NaN"
      ? 0
      : butcherForm.value.butcher_cost_price;
};

const resetForm = () => {
  butcherForm.value = {
    ingredient_id: 0,
    butcher_name: "",
    trimming_name: "",
    trimming_quantity: 0,
    raw_name: "",
    net_quantity: 0,
    variance_quantity: 0,
    butcher_cost_price: 0,
    old_butcher_cost_price: 0,
    raw_cost_price: 0,
    deducted_quantity: 0,
  };
};

const cutIngredient = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we process the butcher cut.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    butcherForm.value.is_trimming = butcherForm.value.is_trimming ? 1 : 0;
    const formData = FormDx(butcherForm.value);

    // Append image files
    imageFiles.value.forEach((file) => {
      formData.append("ingredient_images[]", file);
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/cut-butcher-raw-trimming`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

const handleImagesSelected = (files) => {
  imageFiles.value = files;
};
</script>
