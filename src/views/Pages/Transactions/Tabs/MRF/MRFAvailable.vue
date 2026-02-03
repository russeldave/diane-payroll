<template>
  <button
    @click="isViewModalOpen = true"
    class="bg-violet-600 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
  >
    <i class="fa fa-folder"></i> Available
  </button>
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'4xl'"
    title="Available"
    @close="closeModal()"
  >
    <div v-if="loading" class="p-4">
      <Loader />
    </div>
    <div class="p-4 overflow-x-auto" v-else>
      <div class="flex w-full overflow-auto py-4">
        <!-- <div class="flex w-full justify-between">
          <h1 class="text-lg font-bold text-gray-700">Search Ingredients</h1>
        </div>
      </div>
      <div class="mb-4">
        <SearchDropdown
          apiEndpoint="ingredients/search-name-only"
          :searchModel="searchIngredients"
          :key="search.search"
          placeholder="Search Ingredients"
          itemLabel="name"
          itemId="id"
          inputId="ingredientName"
          :defaultValue="search.search"
          formatLabel="none"
          className="focus-visible:bg-yellow-100 p-2 w-full border"
          @item-selected="(data) => fillIngredientForm(data)"
          dataKey="ingredients"
          returnName="['name']"
        />
      </div>
      <div
        class="flex w-full overflow-auto py-4"
        v-if="data.menuHistory?.length > 0 && !loading"
      >
        <div class="flex w-full justify-between">
          <h1 class="text-lg font-bold text-gray-700">
            Menus with this ingredients used.
          </h1>
        </div>
      </div>
      <div
        class="flex w-full overflow-auto"
        v-if="data.menuHistory?.length > 0 && !loading"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead :class="DEFAULT_BG">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border"
              >
                Menu Name
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider border"
              >
                Quantity Used
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="order in data.menuHistory"
              class="hover:bg-gray-200"
              v-if="data.menuHistory?.length > 0 && !loading"
              :key="order.id"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                {{ order.menuName }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 border"
              >
                {{ order.quantity }}
              </td>
            </tr>
            <tr v-if="data.menuHistory?.length == 0 && !loading" class="text-center">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="2">
                Not used in menus.
              </td>
            </tr>
          </tbody>
        </table> -->
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
import { ref, onMounted } from "vue";
import axios from "axios";
import {
  moneyFormatter,
  BearToken,
  FormDx,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper.js";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global.js";
import Loader from "@/views/Component/Loader.vue";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

const emits = defineEmits(["transaction_id"]);

const token = localStorage.getItem("token");
const isViewModalOpen = ref(false);
const data = ref([]);
const loading = ref(false);

const searchIngredients = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  category_id: 0,
});

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  ingredient_id: 0,
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getMenuHistory();
  handlePagination(1);
}, 500);

const getMenuHistory = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/search-in-menus`,
      formData,
      BearToken(token)
    );
    if (response.data) {
      data.value = response.data;
    } else {
      isViewModalOpen.value = false;
      emits("transaction_id", Math.random());
    }

    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  getMenuHistory();
};
const handleTransaction = (transaction_id) => {
  getMenuHistory();
  emits("transaction_id", Math.random() + "transactions-done");
};

const ingredientName = ref("");
const fillIngredientForm = (item) => {
  // // Ensure the index exists in the ingredients array
  search.value.ingredient_id = item.id ?? 0;
  search.value.search = item.name ?? "";

  // // Clear the search field
  searchIngredients.value.search = "";
  getMenuHistory();
};

const closeModal = () => {
  search.value.ingredient_id = 0;
  search.value.search = "";
  data.value = [];

  isViewModalOpen.value = false;
};
</script>
