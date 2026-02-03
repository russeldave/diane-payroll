<template>
  <button
    @click.prevent="editBehavior()"
    type="button"
    :title="`Scrap Ingredient!`"
    class="bg-orange-500 text-white hover:opacity-70 focus:bg-orange-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap"
  >
    <i class="fas fa-dumpster"></i>
    Scrap
  </button>

  <!-- Scrap Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="Scrap Ingredient"
    @close="closeIngredient()"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="scrapIngredient()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Ingredient Name</label
            >
            <div class="flex mt-1">
              <input
                type="text"
                id="ProductName"
                required
                v-model="ingredientForm.ingredient_name"
                disabled
                placeholder="Ingredient Name"
                class="p-2 border rounded-l w-full bg-gray-200"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="CurrentStock" class="block text-sm font-medium text-gray-700"
              >Current Stock</label
            >
            <div class="flex mt-1">
              <input
                type="text"
                id="CurrentStock"
                required
                v-model="ingredientForm.stocks"
                disabled
                placeholder="Current Stock"
                class="p-2 border rounded-l w-full bg-gray-200"
              />
              <button type="" class="bg-red-500 p-2 text-white rounded-r">
                {{ ingredientForm.unit_abbre }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center my-6">
          <div class="flex-grow border-t border-gray-400"></div>
          <span class="mx-4 text-gray-400 text-sm font-semibold">Scrap Details</span>
          <div class="flex-grow border-t border-gray-400"></div>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <label for="ScrapQuantity" class="block text-sm font-medium text-gray-700"
              >Quantity to Scrap</label
            >
            <div class="flex mt-1">
              <input
                type="number"
                step="any"
                id="ScrapQuantity"
                required
                v-model="ingredientForm.scrap_quantity"
                placeholder="Enter quantity to scrap"
                class="p-2 border rounded-l w-full"
                min="0.01"
                :max="ingredientForm.stocks"
              />
              <button type="" class="bg-red-500 p-2 text-white rounded-r">
                {{ ingredientForm.unit_abbre }}
              </button>
            </div>
          </div>
          <div class="mb-4">
            <label for="ScrapReason" class="block text-sm font-medium text-gray-700"
              >Reason</label
            >
            <div class="flex mt-1">
              <textarea
                id="ScrapReason"
                required
                v-model="ingredientForm.reason"
                placeholder="Enter reason for scrapping"
                class="p-2 border rounded w-full"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Scrap Ingredient
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";
import Swal from "sweetalert2";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
});

const isAddModalOpen = ref(false);

const ingredientForm = ref({
  ingredient_id: 0,
  ingredient_name: "",
  unit_abbre: "",
  stocks: 0,
  scrap_quantity: 1,
  reason: "",
});

const editBehavior = () => {
  resetForm();
  fillForm();
  isAddModalOpen.value = true;
};

const closeIngredient = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = false;
};

const fillForm = () => {
  const data = props.data;
  ingredientForm.value = {
    ingredient_id: data.id,
    ingredient_name: data.name,
    unit_abbre: data.unitAbbre,
    stocks: data.stocks || 0,
    scrap_quantity: 1,
    reason: "",
  };
};

const resetForm = () => {
  ingredientForm.value = {
    ingredient_id: 0,
    ingredient_name: "",
    unit_abbre: "",
    stocks: 0,
    scrap_quantity: 1,
    reason: "",
  };
};

const scrapIngredient = async () => {
  try {
    if (
      Number(ingredientForm.value.scrap_quantity) > Number(ingredientForm.value.stocks)
    ) {
      Alert("error", "Error", "Scrap quantity cannot be greater than current stock");
      return;
    }

    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we process the scrap request.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(ingredientForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}scrap-ingredients/ingredient`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    if (response.data.status === "success") {
      Alert("success", "Success", response.data.message);
      emits("transaction_id", Math.random());
      closeIngredient();
    }
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};
</script>
