<template>
  <button
    @click.prevent="scrapBehavior()"
    type="button"
    :title="`Temporary Count Variance!`"
    class="bg-transparent rounded text-white hover:bg-orange-50 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap"
  >
    <i class="fas fa-coins text-yellow-500"></i>
  </button>

  <!-- Scrap Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'4xl'"
    :title="`Temporary Count for ${props.data.itemName}`"
    @close="closeTempCount()"
  >
    <div class="p-2">
      <!-- Scrap Form Tab -->
      <!-- <div>
        <form @submit.prevent="addTempCount()" autocomplete="off">
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
                    v-model="ingredientForm.item_name"
                    disabled
                    placeholder="Ingredient Name"
                    class="p-2 border rounded-l w-full bg-gray-200"
                  />
                </div>
              </div>
              <div class="mb-4">
                <label for="ScrapQuantity" class="block text-sm font-medium text-gray-700"
                  >Quantity</label
                >
                <div class="flex mt-1">
                  <input
                    type="number"
                    step="any"
                    id="ScrapQuantity"
                    required
                    v-model="ingredientForm.quantity"
                    placeholder="Enter quantity to add"
                    class="p-2 border rounded-l w-full"
                  />
                  <button type="" class="bg-red-500 p-2 text-white rounded-r">
                    {{ ingredientForm.unit_abbre }}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2">
              <button
                type="submit"
                class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                Add to Temporary Count
              </button>
            </div>
          </div>
        </form>
      </div> -->

      <!-- Scrap List Tab -->
      <div class="px-3 mt-4">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead :class="DEFAULT_BG" class="text-white">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider border"
                >
                  Quantity
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                >
                  Counted By
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="3" class="px-6 py-4 text-center">
                  <Loader />
                </td>
              </tr>
              <tr v-else-if="!loading && data.countLists?.length === 0">
                <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
              <tr
                v-for="scrap in data?.countLists"
                :key="scrap.id"
                v-if="!loading && data.countLists?.length > 0"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                  {{ scrap.dateOfCount }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border text-right"
                >
                  {{ scrap.count }} <sub>{{ scrap.unitAbbre }}</sub>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                  {{ scrap.userName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                  <span v-if="scrap.status == 1" class="bg-yellow-500 text-white text-md font-medium px-2 py-1 rounded">Pending</span>
                  <span v-else class="bg-green-500 text-white text-sm font-medium px-2 py-1 rounded">Approved</span>
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
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";
import Loader from "@/views/Component/Loader.vue";
import Paginator from "@/views/Component/Pagination.vue";
import Swal from "sweetalert2";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
});

const isAddModalOpen = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  warehouse_item_id: 0,
});

const ingredientForm = ref({
  warehouse_item_id: 0,
  item_name: "",
  unit_abbre: "",
  stocks: 0,
  quantity: 1,
  reason: "",
});

const loading = ref(false);
const data = ref([]);

const getTempCountList = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}variances/physical-count-log-lists`,
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
  getTempCountList();
};
const handleSearch = (event) => {
  search.value.search = event.target.value;
  getTempCountList();
};

const scrapBehavior = () => {
  resetForm();
  fillForm();
  getTempCountList();
  isAddModalOpen.value = true;
};

const closeTempCount = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = false;
};

const fillForm = () => {
  const data = props.data;
  ingredientForm.value = {
    warehouse_item_id: data.id,
    item_name: data.itemName,
    unit_abbre: data.unitAbbre ?? "pcs",
    stocks: data.stocks || 0,
    quantity: 1,
    reason: "",
  };

  search.value.warehouse_item_id = data.id;
};

const resetForm = () => {
  ingredientForm.value = {
    menu_id: 0,
    item_name: "",
    unit_abbre: "",
    stocks: 0,
    quantity: 1,
    reason: "",
  };
};

const addTempCount = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we process the temporary count.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(ingredientForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}item-logs/create-temporary-count-log`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    Alert("success", "Success", response.data.message);
    getTempCountList();
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};
</script>
