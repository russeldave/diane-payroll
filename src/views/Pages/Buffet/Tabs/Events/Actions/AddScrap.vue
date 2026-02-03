<template>
  <a
    title="Update Scrap Quantity"
    class="flex justify-center items-center text-md text-red-500 underline hover:text-red-700 cursor-pointer"
    @click="scrapBehavior()"
  >
    {{ props.dateData.scrap ?? 0 }}
    <sub>{{ props.data.unitAbbre ?? "-" }}</sub>
  </a>
  <!-- Scrap Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    :title="`Scrap ${props.data.dishesName}`"
    @close="closeIngredient()"
  >
    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200">
      <nav class="flex -mb-px" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-4 py-2 text-sm font-medium',
            activeTab === tab.key
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          <i :class="tab.icon" class="mr-2"></i>
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <div class="p-2">
      <!-- Scrap Form Tab -->
      <div v-if="activeTab === 'form'">
        <form @submit.prevent="scrapIngredient()" autocomplete="off">
          <div class="grid grid-cols-1 gap-6 p-6">
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
                  <select
                    id="ScrapReason"
                    v-model="ingredientForm.reason"
                    :disabled="reasons.length === 0"
                    required
                    class="p-2 border rounded-l w-full"
                  >
                    <option value="" disabled>Select reason</option>
                    <option
                      v-for="reason in reasons"
                      :key="reason.id"
                      :value="reason.value"
                    >
                      {{ reason.label }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="mb-4" v-if="ingredientForm.reason === 'Others'">
                <label for="ScrapReason" class="block text-sm font-medium text-gray-700"
                  >Other Reason</label
                >
                <div class="flex mt-1">
                  <textarea
                    id="ScrapReason"
                    required
                    v-model="ingredientForm.other_reason"
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
          </div>
        </form>
      </div>

      <!-- Scrap List Tab -->
      <div v-else-if="activeTab === 'list'">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reason
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created By
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="5" class="px-6 py-4 text-center">
                  <Loader />
                </td>
              </tr>
              <tr v-else-if="!loading && data.scrapLists?.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  No scrap records found
                </td>
              </tr>
              <tr
                v-for="scrap in data?.scrapLists"
                :key="scrap.id"
                v-if="!loading && data.scrapLists?.length > 0"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ scrap.scrapedDate }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ scrap.quantity }} <sub>{{ scrap.unitAbbre }}</sub>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ scrap.reason }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ scrap.userName }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex w-full overflow-auto">
          <Paginator
            v-if="data.totalrows"
            :page_number="search.page_num"
            :total_rows="data.totalrows"
            :itemsperpage="search.itemsperpage"
            @page_num="handlePagination"
          />
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";
import Loader from "@/views/Component/Loader.vue";
import Paginator from "@/views/Component/Pagination.vue";
import Swal from "sweetalert2";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
  dateData: Object,
});

const isAddModalOpen = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  buffet_has_dish_id: 0,
  buffet_date_id: 0,
});

const ingredientForm = ref({
  buffet_has_dish_id: 0,
  buffet_id: 0,
  buffet_date_id: 0,
  ingredient_name: "",
  unit_abbre: "",
  stocks: 0,
  scrap_quantity: 1,
  reason: "",
});

const activeTab = ref("form");
const loading = ref(false);
const data = ref([]);
const reasons = ref([]);

const tabs = [
  { key: "form", name: "Scrap Form", icon: "fas fa-pen-to-square" },
  { key: "list", name: "Scrap History", icon: "fas fa-clock-rotate-left" },
];

watch(activeTab, (newTab) => {
  if (newTab === "list") {
    search.value.page_num = 1; // Reset to first page
    getScrapList(); // Load the list
  }
});

const getScrapReasons = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}scrap-ingredients/dropdown-reasons`,
      BearToken(token)
    );
    reasons.value = response.data.reasons;
  } catch (error) {
    handleApiError(error);
  }
};

const getScrapList = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}scrap-buffets/list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};
const handlePagination = (page) => {
  search.value.page_num = page;
  getScrapList();
};
const handleSearch = (event) => {
  search.value.search = event.target.value;
  getScrapList();
};

const scrapBehavior = () => {
  resetForm();
  fillForm();
  getScrapReasons();
  getScrapList();
  isAddModalOpen.value = true;
};

const closeIngredient = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = false;
};

const fillForm = () => {
  const data = props.data;
  const date_data = props.dateData;

  ingredientForm.value = {
    buffet_has_dish_id: data.id,
    buffet_id: data.buffetId,
    buffet_date_id: date_data.buffetDateId,
    ingredient_name: data.dishesName,
    unit_abbre: data.unitAbbre ?? "pcs",
    stocks: data.stocks || 0,
    scrap_quantity: 1,
    reason: "",
  };

  search.value.buffet_has_dish_id = data.id ?? 0;
  search.value.buffet_date_id = date_data.buffetDateId ?? 0;
};

const resetForm = () => {
  ingredientForm.value = {
    buffet_has_dish_id: 0,
    buffet_id: 0,
    buffet_date_id: 0,
    ingredient_name: "",
    unit_abbre: "",
    stocks: 0,
    scrap_quantity: 1,
    reason: "",
  };
};

const scrapIngredient = async () => {
  try {
    // Show processing alert
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we process the scrap request.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    ingredientForm.value.reason =
      ingredientForm.value.reason == "Others"
        ? ingredientForm.value.other_reason
        : ingredientForm.value.reason;

    const formData = FormDx(ingredientForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}scrap-buffets/buffet`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();
    Alert("success", "Success", response.data.message);
    closeIngredient();
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};
</script>
