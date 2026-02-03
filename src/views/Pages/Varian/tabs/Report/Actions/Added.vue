<template>
  <a
    title="Click to update serve quantity"
    :class="formatQuantityColor(props.data.added)"
    class="underline hover:text-blue-700 text-xs md:text-sm text-nowrap cursor-pointer font-semibold"
    @click="openModal()"
  >
    {{ props.data.added ?? 0 }}
    <sub>{{ props.data.unitAbbre ?? "-" }}</sub>
  </a>
  <!-- Scrap Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'4xl'"
    :title="`Added ${props.data.name} History`"
    @close="closeIngredient()"
  >
    <div class="p-6">
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
              v-model="form.ingredient_name"
              disabled
              placeholder="Ingredient Name"
              class="p-2 border rounded-l w-full bg-gray-200"
            />
          </div>
        </div>
        <div class="mb-4">
          <label for="addedStock" class="block text-sm font-medium text-gray-700"
            >Added</label
          >
          <div class="flex mt-1">
            <input
              type="text"
              id="addedStock"
              required
              v-model="form.added"
              disabled
              placeholder="Current Stock"
              class="p-2 border rounded-l w-full bg-gray-200"
            />
            <button type="" class="bg-red-500 p-2 text-white rounded-r">
              {{ form.unit_abbre }}
            </button>
          </div>
        </div>
      </div>
      <!-- Scrap List Tab -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead :class="DEFAULT_BG" class="text-white">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Type
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Created By
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Remarks
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-4 text-center">
                <Loader />
              </td>
            </tr>
            <tr v-else-if="!loading && data.addedInventories?.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                No added records found
              </td>
            </tr>
            <tr
              v-for="scrap in data?.addedInventories"
              :key="scrap.id"
              v-if="!loading && data.addedInventories?.length > 0"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ scrap.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ scrap.userName ?? "None" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {{ scrap.quantity }} <sub>{{ scrap.unitAbbre }}</sub>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ scrap.remarks ?? "None" }}
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
  </Modal>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  handleApiError,
  formatQuantityColor,
} from "@/views/Utility/Helper";
import Loader from "@/views/Component/Loader.vue";
import Paginator from "@/views/Component/Pagination.vue";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
  dateCreated: String,
});

const isAddModalOpen = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  ingredient_id: 0,
});

const form = ref({
  ingredient_id: 0,
  ingredient_name: "",
  date_created: "",
  unit_abbre: "",
  filter_date: new Date().toISOString().slice(0, 10),
  added: 0,
});

const activeTab = ref("form");
const loading = ref(false);
const data = ref([]);

const getList = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients-variance-reports/get-added-inventories-filter-date`,
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
  getList();
};
const handleSearch = (event) => {
  search.value.search = event.target.value;
  getList();
};

const openModal = () => {
  resetForm();
  fillForm();
  getList();
  isAddModalOpen.value = true;
};

const closeIngredient = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = false;
};

const fillForm = () => {
  const data = props.data;
  form.value = {
    ingredient_id: data.id,
    ingredient_name: data.name,
    unit_abbre: data.unitAbbre ?? "pcs",
    filter_date: props.dateCreated ?? new Date().toISOString().slice(0, 10),
    added: data.added ?? 0,
  };

  search.value.ingredient_id = data.id;
  search.value.filter_date = props.dateCreated ?? new Date().toISOString().slice(0, 10);
};

const resetForm = () => {
  form.value = {
    ingredient_id: 0,
    ingredient_name: "",
    date_created: "",
    unit_abbre: "",
    filter_date: new Date().toISOString().slice(0, 10),
    added: 0,
  };

  search.value.ingredient_id = 0;
  search.value.filter_date = props?.dateCreated ?? new Date().toISOString().slice(0, 10);
};
</script>
