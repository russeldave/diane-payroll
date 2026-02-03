<template>
  <button
    @click="openModal()"
    type="button"
    class="bg-amber-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
  >
  <i class="fa-solid fa-clock-rotate-left"></i>
    History
  </button>

  <Modal
    :show="isViewModalOpen"
    :maxWidth="'8xl'"
    title="History"
    @close="closeModal"
  >
    <div v-if="loading" class="px-2 py-2 border text-center" colspan="10">
      <Loader />
    </div>

    <div v-else class="p-4 overflow-x-auto">
      <!-- Filters -->
      <div class="flex flex-col md:flex-row md:items-center w-[50%] md:justify-between gap-2 mb-4 mt-4">
        <!-- Search Text -->
        <input
          type="search"
          placeholder="Search Requested Item..."
          v-model="search.search"
          @input="searchInput"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
        />

        <!-- Type Select -->
        <select
          v-model="search.type"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          @change="handleTypeChange"
        >
          <option value="0">--All Dates--</option>
          <option value="2">Daily</option>
          <option value="3">Weekly</option>
          <option value="4">Monthly</option>
        </select>

        <input
          v-if="search.type === '2'"
          type="date"
          v-model="search.date"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          @change="handleDateChange"
        />

        <input
          v-if="search.type === '3'"
          type="week"
          v-model="search.date"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          @change="handleDateChange"
        />

        <input
          v-if="search.type === '4'"
          type="month"
          v-model="search.date"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          @change="handleDateChange"
        />
      </div>

      <!-- Table -->
      <div class="flex w-full overflow-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid">
              <th width="25%" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                Ingredient Name
              </th>
              <th width="20%" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                Transaction Date
              </th>
              <th class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                Transaction Type
              </th>
              <th class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                Description
              </th>
              <th title="Quantity per Unit" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                Transact Quantity
              </th>
              <th class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                Logs of Previous Stocks
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!loading && data.transacts?.length > 0">
              <tr
                v-for="transact in data.transacts"
                :key="transact.id"
                class="hover:bg-gray-300"
              >
              <td class="px-3 py-3 border text-center">
                  {{ transact.itemName }}
                </td>
                <td class="px-3 py-3 border text-center">
                  {{ transact.transactDate }}
                </td>

                <td class="px-4 py-4 border text-center">
                  <span class="font-bold text-lg text-white rounded-lg px-4 py-2"
                    :class="{
                      'bg-lime-400': transact.transactType == 'PR' || transact.transactType == 'DR',
                      'bg-rose-400': transact.transactType != 'PR' && transact.transactType != 'DR'
                    }">
                    {{ transact.transactType }}
                  </span> 
                </td>

                <td class="px-3 py-3 border text-center">
                  {{ transact.description }}
                </td>

                <td class="px-3 py-3 border text-center">
                  {{ transact.transactQuantity }}
                  <span class="italic text-red-600">
                    [{{ transact.unitAbbre }}]
                  </span>
                </td>

                <td 
                  class="px-3 py-3 border text-center text-nowrap"
                  >
                  {{ transact.stocksLog }}
                </td>
              </tr>
            </template>
            
            <!-- Loader -->
            <tr v-else-if="loading">
              <td class="px-2 py-2 border text-center" colspan="10">
                <Loader />
              </td>
            </tr>

            <tr v-else class="text-center">
              <td class="px-20 py-20 whitespace-nowrap text-sm text-gray-500" colspan="10">
                No Data Received.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="flex w-full overflow-auto mt-4">
        <Paginator
          v-if="data.totalrows > 0 && !loading"
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
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import { FormDx, BearToken, handleApiError, useDebounce } from "@/views/Utility/Helper.js";
import Loader from "@/views/Component/Loader.vue";
import Paginator from "@/views/Component/Pagination.vue";
import Modal from "@/views/Component/Modal.vue";

const emits = defineEmits(["transaction_id"]);

const props = defineProps({
  data: Object
});

const isViewModalOpen = ref(false);
const loading = ref(false);
const data = ref({ transacts: [], totalrows: 0 });

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: "0", // Default to all dates
  date: new Date().toISOString().split("T")[0], // Default to current date
  user_id: 0,
  // ingredient_id_number: props.data?.ingredientIdNumber || "",
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getAllHistory();
}, 500);

const getAllHistory = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/combine-history`,
      formData,
      BearToken(token)
    );
    if (response.data) {
      data.value = response.data;
    } else {
      data.value = { transacts: [], totalrows: 0 };
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  getAllHistory();
};

const handleDateChange = () => {
  search.value.page_num = 1;
  getAllHistory();
};

const handleTypeChange = () => {
  if (search.value.type === "2") {
    search.value.date = new Date().toISOString().split("T")[0];
  } else if (search.value.type === "3") {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    search.value.date = firstDay.toISOString().split("T")[0];
  } else if (search.value.type === "4") {
    search.value.date = new Date().toISOString().slice(0, 7);
  } else {
    search.value.date = "";
  }
  getAllHistory();
};

const openModal = () => {
  isViewModalOpen.value = true;
  // Update ingredient_id_number when opening modal
  if (props.data?.ingredientIdNumber) {
    search.value.ingredient_id_number = props.data.ingredientIdNumber;
  }
  getAllHistory();
};

const closeModal = () => {
  isViewModalOpen.value = false;
};

const token = localStorage.getItem("token");

// Watch for changes in props.data to update the ingredient_id_number
watch(
  () => props.data?.ingredientIdNumber,
  (newIngredientId) => {
    if (newIngredientId) {
      search.value.ingredient_id_number = newIngredientId;
    }
  }
);

// Load history when modal opens
watch(
  () => isViewModalOpen.value,
  (isOpen) => {
    if (isOpen) {
      getAllHistory();
    }
  }
);
</script>