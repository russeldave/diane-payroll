<template>
  <button
    @click.prevent="addBehavior()"
    type="button"
    :class="[
      'bg-green-500 text-white hover:opacity-70 focus:bg-green-300 font-bold text-sm  md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-truck-ramp-box"></i>
    &nbsp;Receive Ingredient
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="Receive Ingredient"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="receiveIngredient()" autocomplete="off">
        <div class="flex justify-between px-2 pt-3 space-x-2">
          <h1 class="font-bold text-xl">Receive Ingredients</h1>
          <button
            @click.prevent="addIngredient()"
            class="bg-blue-500 text-white hover:opacity-70 rounded font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
            :disabled="receiveForm.ingredients.length >= 5"
            :class="{
              'opacity-50 cursor-not-allowed': receiveForm.ingredients.length >= 5,
            }"
          >
            <i class="fas fa-plus"></i>
            Add Row ({{ receiveForm.ingredients.length }}/5)
          </button>
        </div>

        <div class="mb-4 overflow-auto text-nowrap flex flex-nowrap px-2">
          <!-- Desktop Table View -->
          <table
            class="w-full border-collapse bg-white text-xs md:text-sm uppercase text-nowrap hidden md:table"
          >
            <thead
              :class="DEFAULT_BG"
              class="text-white border-b-2 border-black text-nowrap"
            >
              <tr>
                <th class="text-left border p-2" width="50%">Ingredients</th>
                <!-- <th class="text-left border p-2" width="10%">Unit</th> -->
                <th class="text-center border p-2">Previous Price</th>
                <th class="text-left border p-2" width="5%">Received Qty</th>
                <th class="text-center border p-2 text-wrap" width="10%">
                  Actual Price Per Item
                </th>
                <th class="text-center border p-2 text-wrap" width="10%">
                  Receiving Price
                </th>
                <th class="text-left border p-2">Reference Number</th>
                <th class="text-center border p-2 text-wrap" width="5%">
                  Proof of Receipt
                </th>
                <th class="text-center border p-2" width="20%">Remarks</th>
                <th class="text-center border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="receiveForm.ingredients?.length > 0"
                v-for="(ingredient, index) in receiveForm.ingredients"
                :key="index"
                class="border"
              >
                <td class="border p-2">
                  <!-- {{ ingredient.ingredient_id }} -->
                  <SearchDropdown
                    apiEndpoint="ingredients/search-name-only-in-receiving"
                    :searchModel="searchIngredient"
                    :key="ingredient.name"
                    placeholder="Search Ingredient"
                    itemLabel="name"
                    itemId="id"
                    :defaultValue="ingredient.name"
                    inputId="ingredientName"
                    formatLabel="none"
                    className="focus-visible:bg-yellow-100 p-2 w-full border rounded text-gray-900 text-sm"
                    @item-selected="(data) => fillIngredientForm(data, index)"
                    dataKey="ingredients"
                    returnName="['name']"
                  />
                  <IngredientImage
                    v-if="ingredient.id > 0"
                    :key="ingredient.id"
                    :ingredient_id="ingredient.id"
                  />
                </td>
                <!-- <td class="right border p-2">
                    <div class="border-0 p-2 w-full text-start focus-visible:bg-yellow-100">
                      {{ ingredient.unit }}
                    </div>
                  </td> -->
                <td class="right border p-2">
                  <div class="flex">
                    <input
                      step="any"
                      disabled
                      v-model.number="ingredient.suggested_price"
                      type="number"
                      class="border bg-gray-200 rounded p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                    />
                  </div>
                </td>
                <td class="right border p-2">
                  <div class="flex">
                    <input
                      step="any"
                      v-model.number="ingredient.quantity"
                      type="number"
                      class="border rounded-l p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                    />
                    <UnitConverter
                      :key="ingredient.id + ingredient.unit_abbre"
                      :data="ingredient"
                      :unit="ingredient.unit_abbre"
                      v-if="ingredient.unit_abbre"
                    />
                  </div>
                </td>
                <td class="right border p-2">
                  <div class="flex">
                    <p hidden>
                      {{
                        (ingredient.actual_price = (
                          ingredient.receiving_price / ingredient.quantity
                        ).toFixed(2))
                      }}
                    </p>
                    <input
                      step="any"
                      v-model.number="ingredient.actual_price"
                      type="number"
                      class="border bg-gray-200 rounded p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                    />
                  </div>
                </td>
                <td class="right border p-2">
                  <div class="flex">
                    <input
                      step="any"
                      v-model.number="ingredient.receiving_price"
                      type="number"
                      class="border rounded p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                    />
                  </div>
                </td>
                <!-- <td class="right border p-2">
                    <input step="any" v-model.number="ingredient.trimmings" type="number" class="border p-2 w-full text-left focus-visible:bg-yellow-100"/>
                  </td>
                  <td class="right border p-2">
                    <input step="any" v-model.number="ingredient.variance" type="number" class="border p-2 w-full text-left focus-visible:bg-yellow-100"/>
                  </td> -->
                <td class="right border p-2">
                  <input
                    v-model.number="ingredient.reference_number"
                    placeholder="Input Reference Number"
                    type="text"
                    class="border rounded p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                  />
                </td>

                <td class="border p-2">
                  <ImageUpload
                    :maxFiles="5"
                    :maxFileSize="10 * 1024 * 1024"
                    :hideDragArea="true"
                    @files-selected="(files) => handleFileUpload(files, index)"
                  />
                </td>
                <td class="right border p-2">
                  <textarea
                    v-model.number="ingredient.remarks"
                    class="border rounded p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                    rows="2"
                  ></textarea>
                </td>
                <td class="border p-2 text-center">
                  <button
                    @click.prevent="removeIngredient(index)"
                    class="bg-red-500 text-sm md:text-md text-white p-1 rounded-full"
                  >
                    <i class="fa fa-times"></i> Remove
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="9" class="border p-2 text-center text-red-500 font-bold">
                  <small>No ingredients added!</small>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Mobile Card View -->
          <div class="w-full md:hidden bg-gray-200 p-2 rounded space-y-4">
            <div
              v-if="receiveForm.ingredients?.length > 0"
              v-for="(ingredient, index) in receiveForm.ingredients"
              :key="index"
              class="bg-white rounded-lg shadow-md p-4 space-y-3"
            >
              <div class="flex justify-between items-center">
                <h3 class="font-bold text-lg">Ingredient #{{ index + 1 }}</h3>
                <button
                  @click.prevent="removeIngredient(index)"
                  class="bg-red-500 text-white p-2 rounded-full"
                >
                  <i class="fa fa-times"></i>
                </button>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Ingredient</label
                  >
                  <SearchDropdown
                    apiEndpoint="ingredients/search-name-only-in-receiving"
                    :searchModel="searchIngredient"
                    :key="ingredient.name"
                    placeholder="Search Ingredient"
                    itemLabel="name"
                    itemId="id"
                    :defaultValue="ingredient.name"
                    inputId="ingredientName"
                    formatLabel="none"
                    className="focus-visible:bg-yellow-100 p-2 w-full border rounded text-gray-900 text-sm"
                    @item-selected="(data) => fillIngredientForm(data, index)"
                    dataKey="ingredients"
                    returnName="['name']"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Previous Price</label
                  >
                  <input
                    step="any"
                    disabled
                    v-model.number="ingredient.suggested_price"
                    type="number"
                    class="border bg-gray-200 rounded p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Received Quantity</label
                  >
                  <div class="flex">
                    <input
                      step="any"
                      v-model.number="ingredient.quantity"
                      type="number"
                      class="border rounded-l p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                    />
                    <UnitConverter
                      :key="ingredient.id + ingredient.unit_abbre"
                      :data="ingredient"
                      :unit="ingredient.unit_abbre"
                      v-if="ingredient.unit_abbre"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Actual Price Per Item</label
                  >
                  <input
                    step="any"
                    v-model.number="ingredient.actual_price"
                    type="number"
                    class="border bg-gray-200 rounded p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Receiving Price</label
                  >
                  <input
                    step="any"
                    v-model.number="ingredient.receiving_price"
                    type="number"
                    class="border rounded p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Reference Number</label
                  >
                  <input
                    v-model.number="ingredient.reference_number"
                    placeholder="Input Reference Number"
                    type="text"
                    class="border rounded p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Remarks</label
                  >
                  <textarea
                    v-model.number="ingredient.remarks"
                    class="border rounded p-2 w-full focus-visible:bg-yellow-100 text-gray-900 text-sm"
                    rows="2"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Proof of Receipt</label
                  >
                  <ImageUpload
                    :maxFiles="5"
                    :maxFileSize="10 * 1024 * 1024"
                    :hideDragArea="true"
                    @files-selected="(files) => handleFileUpload(files, index)"
                  />
                </div>
              </div>
            </div>

            <div
              v-else
              class="text-center text-red-500 font-bold p-4 bg-white rounded-lg shadow"
            >
              <small>No ingredients added!</small>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end px-2">
          <button
            type="submit"
            class="bg-green-500 text-white hover:opacity-70 rounded font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
          >
            Receive
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
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import { BearToken, Alert, handleApiError } from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import UnitConverter from "./UnitConverter.vue";
import IngredientImage from "./ReceiveImage.vue";
import ImageUpload from "@/views/Component/ImageUpload.vue";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
});

const isAddModalOpen = ref(false);
const isViewModalOpen = ref(false);
const selectedFile = ref(null);
const searchIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});

const receiveForm = ref({
  ingredients: [
    {
      ingredient_id: 0,
      reference_number: "",
      name: "",
      quantity: 1,
      unit_abbre: "",
      unit_name: "",
      trimmings: 0,
      variance: 0,
      remarks: "",
      suggested_price: 0,
      actual_price: 0,
      receiving_price: 0,
      ingredient_images: [],
    },
  ],
});

const addBehavior = () => {
  resetForm();
  isAddModalOpen.value = true;
};

const addIngredient = () => {
  if (receiveForm.value.ingredients.length >= 5) {
    Alert("warning", "Maximum Limit", "You can only add up to 5 ingredients at a time.");
    return;
  }
  receiveForm.value.ingredients.push({
    ingredient_id: 0,
    name: "",
    unit_abbre: "",
    unit_name: "",
    reference_number: "",
    quantity: 1,
    trimmings: 0,
    variance: 0,
    remarks: "",
    suggested_price: 0,
    actual_price: 0,
    receiving_price: 0,
    ingredient_images: [],
  });
};

const resetForm = () => {
  receiveForm.value = {
    ingredients: [
      {
        ingredient_id: 0,
        reference_number: "",
        name: "",
        quantity: 1,
        unit_abbre: "",
        unit_name: "",
        trimmings: 0,
        variance: 0,
        remarks: "",
        suggested_price: 0,
        actual_price: 0,
        receiving_price: 0,
        ingredient_images: [],
      },
    ],
  };
};

const removeIngredient = (index) => {
  receiveForm.value.ingredients.splice(index, 1);
};

const fillIngredientForm = (item, index) => {
  if (receiveForm.value.ingredients[index]) {
    receiveForm.value.ingredients[index].ingredient_id = item.id ?? 0;
    receiveForm.value.ingredients[index].name = item.name;
    receiveForm.value.ingredients[index].unit_abbre = item.unitAbbre ?? false;
    receiveForm.value.ingredients[index].unit_name = item.unitName ?? false;
    receiveForm.value.ingredients[index].child_unit = item.childUnitAbbre ?? false;
    receiveForm.value.ingredients[index].suggested_price = item.costPrice ?? 0;
  }
  searchIngredient.value.search = "";
};

const handleFileUpload = (files, index) => {
  if (!receiveForm.value.ingredients[index].ingredient_images) {
    receiveForm.value.ingredients[index].ingredient_images = [];
  }
  receiveForm.value.ingredients[index].ingredient_images = files;
};

const receiveIngredient = async () => {
  try {
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we process the receiving transaction.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = new FormData();

    receiveForm.value.ingredients.forEach((ingredient, index) => {
      Object.keys(ingredient).forEach((key) => {
        if (key !== "ingredient_images") {
          formData.append(`ingredients[${index}][${key}]`, ingredient[key] || "");
        }
      });

      if (ingredient.ingredient_images && ingredient.ingredient_images.length > 0) {
        ingredient.ingredient_images.forEach((file, fileIndex) => {
          formData.append(`ingredients[${index}][ingredient_images][${fileIndex}]`, file);
        });
      } else {
        formData.append(`ingredients[${index}][ingredient_images]`, "[]");
      }
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredient-receiving/add`,
      formData,
      BearToken(token)
    );

    Swal.close();
    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
</script>
