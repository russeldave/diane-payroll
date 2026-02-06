<template>
  <!-- Search and Orders Button -->
  <div
    class="sticky top-0 bg-white flex items-center gap-4 py-4 border-b border-gray-300"
  >
    <div class="flex items-center w-full gap-2 overflow-auto">
      <!-- Search Input -->
      <div class="grid grid-cols-1 md:grid-cols-3 w-full gap-3">
       <div class="flex w-full">
        <!-- Search Input -->
        <input
          type="search"
          placeholder="Search Name or SKU"
          v-model="search.search"
          @change.prevent="searchInput"
          class="w-full border-2 border-gray-300 focus:ring-2 focus:ring-blue-300 rounded-l-lg text-sm p-2"
        />
        <button
              class="flex flex-row font-bold text-white rounded-r-md p-2 hover:scale-110"
              :class="search.is_full_text_search === 1 ? 'bg-blue-500' : 'bg-gray-300'"
              @click.prevent="search.is_full_text_search = search.is_full_text_search === 1 ? 0 : 1"
              >
              Text
            </button>
        <!-- Search Button -->
        <button
          title="Search Menus"
          @click="searchInput"
          class="px-4 bg-blue-500 text-white font-medium rounded-r-lg border-2 border-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          type="button"
        >
          <i class="fa fa-search"></i>
        </button>
      </div>

        <select
          class="flex w-full border-2 border-gray-300 focus:bg-amber-200 rounded-l text-sm p-2"
          v-model="search.category_id"
          @change.prevent="searchInput"
          >
          <option value="0">All Categories</option>
          <option
            v-for="cat in categories.ingredientCategories"
            :key="cat.value"
            :value="cat.value"
          >
            {{ cat.label }}
          </option>
        </select>
        <!-- Request New Item Button -->
        <div class="flex-shrink-0 md:w-auto w-full mt-2 md:mt-0">
          <button
            @click="toggleRequestItemVisibility"
            class="w-full md:w-auto px-4 py-2 bg-orange-400 text-white font-bold rounded shadow hover:bg-orange-700"
          >
            Suggest New Item
          </button>
        </div>
        <!-- RequestItem Modal -->

        <!-- <div
          class="items-center flex space-x-3"
          v-if="!isRequestItemVisible && !isCartVisible"
        >
        <button
            @click="toggleRequestItemVisibility"
            class="w-[10rem]px-2 text-nowrap shadow-xl text-white gap-2 flex font-bold justify-center p-2 bg-blue-600 rounded focus:outline-none"
          >
           Request New Item
          </button>
        </div> -->
      </div>
    </div>

  </div>
  <teleport to="body">
    <div class="absolute top-0 mt-28 lg:top-0 right-0 pt-0 z-999"
      >
      <RequestItem
      v-if="isRequestItemVisible"
      :key="isRequestItemVisible"
      :updateKey="updateKey"
      @transaction_id="handleCloseRequest"
      @close="toggleRequestItemVisibility"
    />
    </div>
  </teleport>


  <!-- Ingredient Items (Grid) -->
  <div
    class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4"
  >
    <div
      v-for="(item, index) in loading ? search?.itemsperpage : data.items"
      :key="loading ? `skeleton-${index}` : item.id"
      class="relative border rounded-lg overflow-hidden transition duration-200"
      :class="loading ? 'animate-pulse' : 'hover:shadow-lg hover:scale-105'"
      :style="!loading ? { borderColor: item.bgColor, borderWidth: '4px' } : {}"
      :title="!loading && item.description != 'null' ? item.description : ''"
    >
      <!-- Skeleton Loading State -->
      <template v-if="loading">
        <div class="w-full h-40 bg-red-200"></div>
        <div class="absolute top-0 left-0">
          <div
            class="bg-amber-300 h-6 w-20 rounded-r shadow-[4px_4px_0_rgba(0,0,0,0.25)]"
          ></div>
        </div>
        <div class="absolute bottom-0 w-full bg-gray-200 p-2">
          <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </template>

      <!-- Actual Menu Item -->
      <template v-else>
        <MenuCards
          :key="item.id"
          :data="item"
          :isSimple="true"
          @transaction_id="handleTransaction"
        />
      </template>
    </div>
  </div>
  <!-- No Meals State -->
  <div
    v-if="data.menus?.length === 0 && !loading"
    class="flex justify-center items-center text-xl text-gray-700 mt-10"
  >
    <p>No meals found.</p>
  </div>
  <!-- Pagination -->
  <div class="flex justify-center mt-6">
    <Paginator
      v-if="data.totalrows"
      :page_number="search.page_num"
      :total_rows="data.totalrows"
      :itemsperpage="search.itemsperpage"
      @page_num="handlePagination"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import RequestItem from "./RequestItem.vue";
import Loader from "@/views/Component/Loader.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import {
  BearToken,
  FormDx,
  useDebounce,
  moneyFormatter,
  generateRandomHex,
} from "@/views/Utility/Helper.js";
import { VUE_APP_API_URL } from "@/views/Utility/Global.js";

import MenuCards from "../Modules/MenuCards.vue";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id", "cart_count"]);
const loading = ref(false);
const data = ref([]);
const categories = ref([]);

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 20,
  category_id: 0,
  is_full_text_search: 0
});

const searchInput = useDebounce(async () => {
  // await getIngredientsByCategory();
  handlePagination(1);
}, 500);

// Fetch meals by category
const getIngredientsByCategory = async () => {
  try {
    loading.value = true;
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `api/ingredients/list-in-shopping`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    data.value.menus?.forEach((item) => {
      item.price = 0;
      item.quantity = 1;
      item.bgColor = generateRandomHex(); // Assign random hex color
    });

    emits("cart_count", response.data.totalCartItems);
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.error("Error fetching meals from local JSON:", error);
  }
};

// Handle Pagination
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  getIngredientsByCategory(search.value.menu_category_id);
};

const handleTransaction = (transaction_id) => {
  emits("transaction_id", transaction_id);
};



const getCategories = async () => {
  try {
    const response = await axios.get(
      `api/ingredient-categories/dropdown`,
      BearToken(token)
    );
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
const isRequestItemVisible = ref(false);

const toggleRequestItemVisibility = () => {
  isRequestItemVisible.value = !isRequestItemVisible.value;
};

onMounted(() => {
  getCategories();
  getIngredientsByCategory();
});
</script>
