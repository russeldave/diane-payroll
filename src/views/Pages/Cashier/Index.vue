<template>
  <div
    v-if="hasPermission('Navigation_Cashier')"
    class="min-h-screen bg-white dark:border-gray-700 px-2 pt-2 rounded"
  >
    <div class="grid grid-cols-1 md:grid-cols-6 gap-2">
      <!-- Menu List Section (4/6) -->
      <div
        class="md:col-span-4 order-2 md:order-1 px-2 py-2 bg-white border border-gray-300 rounded-lg"
      >
        <!-- Search and Orders Button -->
        <div
          class="sticky top-0 bg-white z-10 flex items-center gap-4 py-4 border-b border-gray-300"
        >
          <!-- Search and Times Icon -->
          <button
            :title="!showSearch ? 'Search Menus' : 'Filter By Categories'"
            type="button"
            @click.prevent="toggleSearch"
            class="p-2"
          >
            <i
              class="fa fa-2x"
              :class="showSearch ? 'fa-list text-red-500' : 'fa-search text-blue-500'"
            ></i>
          </button>
          <div class="flex items-center w-full gap-2 overflow-auto">
            <!-- Search Input -->
            <div class="flex w-full">
              <input
                v-if="showSearch"
                type="search"
                placeholder="Search Name or SKU"
                v-model="search.search"
                @input="searchInput"
                class="flex w-full border-2 border-gray-300 focus:bg-amber-200 rounded-l text-md p-2"
              />
              <DailyCashierReport v-if="showSearch" />
               <UploadMenu
                  v-if="hasPermission('Upload_Utak_Inventory_Button')"
                />
            </div>
            <!-- Categories -->
            <span
              v-if="!showSearch"
              :class="
                search.menu_category_id == 0
                  ? 'bg-orange-500 text-white'
                  : 'bg-blue-600 text-white'
              "
              @click.prevent="getMealsByCategory(0)"
              class="flex-shrink-0 font-bold text-xs px-2 py-1 rounded cursor-pointer"
            >
              All
            </span>
            <span
              v-if="!showSearch"
              v-for="(c, cc) in categories"
              :key="cc"
              :class="
                search.menu_category_id == c.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-blue-600 text-white'
              "
              @click.prevent="getMealsByCategory(c.value)"
              class="flex-shrink-0 font-bold text-xs px-2 py-1 rounded cursor-pointer"
            >
              {{ c.label }}
            </span>
          </div>
        </div>

        <!-- Meal Items (Grid) -->
        <div
          class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4"
        >
          <div
            v-for="(item, index) in loading ? search?.itemsperpage : data.menus"
            :key="loading ? `skeleton-${index}` : item.id"
            class="relative border rounded-lg overflow-hidden transition duration-200"
            :class="
              loading
                ? 'border-gray-200 animate-pulse'
                : 'hover:opacity-60 border-gray-300 hover:shadow-lg hover:scale-105 hover:shadow-lg hover:border-4 hover:border-gray-400 hover:border-black hover:shadow-xl'
            "
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
              <div
                class="relative border rounded-lg overflow-hidden"
                @click.prevent="addCartItem(item, index)"
              >
                <MenuCards :data="item" :isSimple="true" />

                <!-- Add stop propagation here -->
                <div v-if="item.submenu != 0" @click.stop>
                  <SubMenus :data="item" 
                   @submenu_added="handleSubMenuAdded"
                  />
                </div>
              </div>
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
      </div>

      <!-- Sidebar Section (2/6) -->
      <div
        class="md:col-span-2 order-1 md:order-2 bg-white border border-gray-300 p-0 rounded-lg"
      >
        <CashierPaymentForm
          :key="updateKey"
          :items="itemsBought"
          @transaction_id="handleOrderTransaction"
        />
      </div>
    </div>
  </div>

  <!-- Permission Error View -->
  <div v-else class="relative">
    <Error403 />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "@/views/Component/Loader.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import Error403 from "@/views/Error/403.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import {
  BearToken,
  FormDx,
  useDebounce,
  moneyFormatter,
  generateRandomHex,
} from "@/views/Utility/Helper.js";
import { VUE_APP_API_URL } from "@/views/Utility/Global.js";
import SubMenus from "./Modules/SubMenus.vue";
import CashierPaymentForm from "./Modules/CashierPaymentForm/Index.vue";
import MenuCards from "./Modules/MenuCards.vue";
import DailyCashierReport from "./Modules/DailyCashierReport.vue";
import UploadMenu from "./Modules/UploadMenu.vue";

const token = localStorage.getItem("token");
const isMealsAdded = ref(false);
const loading = ref(false);
const showSidebar = ref(false);

const categories = ref([]);
const data = ref([]);
const itemsBought = ref([]);
const isMobile = ref(false);
const showSearch = ref(true);

// Add a flag to prevent duplicate API calls
let isFetching = false;

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 30,
  menu_category_id: 0,
});
const updateKey = ref(0);
const subTotal = computed(() =>
  itemsBought.value.reduce((sum, item) => sum + item.total, 0)
);
const vatRate = ref(0.12); // 12% VAT
const vatAmount = computed(() => subTotal.value * vatRate.value);
const totalWithVAT = computed(() => subTotal.value + vatAmount.value);

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getMealsByCategory(search.value.menu_category_id);
}, 500);

// Fetch meals by category
const getMealsByCategory = async (category_id) => {
  // Prevent duplicate calls
  if (isFetching) {
    console.log('getMealsByCategory already in progress, skipping...');
    return;
  }
  
  try {
    isFetching = true;
    loading.value = true;
    search.value.menu_category_id = category_id;
    data.value = [];
    
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menus/list-cashier`,
      formData,
      BearToken(token)
    );
    
    data.value = response.data;
    data.value.menus?.forEach((item) => {
      item.price = 0;
      item.quantity = 1;
      item.bgColor = generateRandomHex(); // Assign random hex color
    });
    
  } catch (error) {
    console.error("Error fetching meals from local JSON:", error);
  } finally {
    loading.value = false;
    isFetching = false;
  }
};

// Handle Pagination
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  getMealsByCategory(search.value.menu_category_id);
};

// Add item to cart
const addCartItem = (item, index) => {
  changeQuantity(index, -1);

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: `Added ${item.title} (${item.quantity} pcs.) to cart`,
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  isMealsAdded.value = true;
  updateKey.value = Math.random();

  const total = item.retailPrice * item.quantity;
  const existingItemIndex = itemsBought.value.findIndex(
    (cartItem) => cartItem.menu_id === item.id
  );
  

  if (existingItemIndex !== -1) {
    console.log(item);
    itemsBought.value[existingItemIndex].quantity += item.quantity;
    itemsBought.value[existingItemIndex].total =
      itemsBought.value[existingItemIndex].quantity * parseFloat(item.retailPrice);
    itemsBought.value[existingItemIndex].final_total =
      itemsBought.value[existingItemIndex].quantity * parseFloat(item.retailPrice);
  } else {
    itemsBought.value.push({
      menu_id: item.id,
      menu_name: item.title,
      price: item.retailPrice,
      quantity: item.quantity,
      total: total,
      discount_id: 0,
      discount_value: 0,
      less: 0,
      final_total: parseFloat(item.retailPrice * item.quantity) ?? 0,
      bg_color: item.bgColor,
    });
  }

  setTimeout(() => {
    isMealsAdded.value = false;
  }, 1000);

  localStorage.setItem("orders", JSON.stringify(itemsBought.value));
};

// Handle submenu additions to cart
const handleSubMenuAdded = (cartItem) => {
  // Check if item already exists in cart
  const existingItemIndex = itemsBought.value.findIndex(
    (item) => item.menu_id === cartItem.menu_id
  );

  if (existingItemIndex !== -1) {
    // Update existing item
    itemsBought.value[existingItemIndex].quantity += cartItem.quantity;
    itemsBought.value[existingItemIndex].total = 
      itemsBought.value[existingItemIndex].quantity * parseFloat(cartItem.price);
    itemsBought.value[existingItemIndex].final_total = 
      itemsBought.value[existingItemIndex].quantity * parseFloat(cartItem.price);
  } else {
    // Add new item
    itemsBought.value.push(cartItem);
  }

  // Update localStorage and refresh
  updateKey.value = Math.random();
  localStorage.setItem("orders", JSON.stringify(itemsBought.value));
};

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
  updateKey.value = Math.random();
};

const toggleSearch = () => {
  search.value.menu_category_id = 0;
  search.value.search = "";

  showSearch.value = !showSearch.value;
  getMealsByCategory(0);
};

// Change item quantity
const changeQuantity = (index, delta) => {
  const newQuantity = (data.value.menus?.[index].quantity ?? 0) + delta;
  if (newQuantity < 1) return;
  data.value.menus[index].quantity = newQuantity;
  data.value.menus[index].total =
    data.value.menus[index].price * data.value.menus[index].quantity;
};

const handleOrderTransaction = (data) => {
  itemsBought.value = data;
  updateKey.value = Math.random();
  localStorage.setItem("orders", JSON.stringify(data));
};

const getMealsCategory = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}menu-categories/dropdown`,
      BearToken(token)
    );
    categories.value = response.data.menuCategories ?? [];
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Watch for screen size changes
const handleResize = () => {
  isMobile.value = window.innerWidth < 623;
};

// Initialize component
const initializeComponent = async () => {
  await getMealsCategory();
  await getMealsByCategory(0);
  
  // Load orders from localStorage
  const savedOrders = localStorage.getItem("orders");
  if (savedOrders) {
    try {
      itemsBought.value = JSON.parse(savedOrders);
      console.log("Loaded orders from localStorage:", itemsBought.value);
    } catch (error) {
      console.error("Error parsing saved orders:", error);
      itemsBought.value = [];
    }
  } else {
    itemsBought.value = [];
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  initializeComponent().then(() => {
    // Only toggle sidebar after everything is loaded
    toggleSidebar();
  });
});

// onMounted(() => {
//   window.addEventListener("resize", handleResize);
//   initializeComponent();
//   toggleSidebar();
// });
</script>