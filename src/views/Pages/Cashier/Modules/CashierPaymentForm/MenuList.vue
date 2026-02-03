<template>
  <!-- <div class="w-full h-[60vh] p-0">  use this if scrollabels-->
  <div class="w-full mb-4 p-0 relative h-full flex flex-col">
    <!-- Cart Container -->
    <div
      class="grid grid-cols-1 gap-4 overflow-y-auto"
      :class="{ 'h-full': items?.length > 1 }"
      v-if="items && items.length > 0"
      @scroll="handleScroll"
      ref="scrollContainer"
    >
      <!-- Item Card -->
      <div
        v-for="(item, index) in items"
        :key="index"
        class="bg-white rounded-lg shadow-md p-3 flex flex-col justify-between hover:shadow-lg transition-shadow border"
      >
        <!-- Item Header -->
        <div class="flex justify-between space-x-4 items-start">
          <div
            class="text-sm font-semibold uppercase ellipsis text-gray-800 truncate text-wrap"
          >
            {{ item.menu_name }}
          </div>
          <button
            @click.prevent="removeItem(index)"
            title="Remove Item"
            class="text-red-500 hover:text-red-700"
          >
            <i class="fa fa-trash text-lg"></i>
          </button>
        </div>

        <!-- Details and Controls Section -->
        <div class="flex justify-between items-center mt-2">
          <!-- Price and Discount -->
          <div class="flex flex-col">
            <div class="text-xs sm:text-sm text-gray-600">
              Price: {{ moneyFormatter(item.price) }}
            </div>
            <div
              v-if="item.discount_id != 0"
              class="mt-1 bg-yellow-400 text-white text-xs rounded px-1 py-0 inline-flex items-center"
            >
              <span
                >{{ item.discount_abbre }} Discount:
                <i class="text-red-500">-{{ item.less.toFixed(2) }}</i></span
              >
            </div>
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center space-x-1">
            <button
              @click="updateQuantity(index, -1)"
              class="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300 text-xs"
              :disabled="item.quantity <= 1"
            >
              <i class="fa fa-minus"></i>
            </button>
            <input
              v-model.number="item.quantity"
              type="number"
              min="1"
              class="w-16 text-center border rounded p-0 text-sm focus:ring-2 focus:ring-yellow-500"
              @input="debounceUpdateTotal(index)"
            />
            <button
              @click="updateQuantity(index, 1)"
              class="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300 text-xs"
            >
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>

        <!-- Total and Discount Button Section -->
        <div class="flex justify-between items-center mt-2">
          <div class="flex flex-col">
            <span class="text-sm font-bold text-gray-800">
              {{ moneyFormatter(item.final_total ?? 0) }}
            </span>
            <span v-if="item.discount_id != 0" class="text-xs text-red-500 line-through">
              {{ moneyFormatter(item.total) }}
            </span>
          </div>
          <button
            @click.prevent="showMenuDiscount(item, index)"
            title="Apply Discount"
            class="bg-yellow-500 shadow-[4px_4px_0_rgba(0,0,0,0.25)] text-white rounded px-2 py-1 text-xs hover:bg-yellow-600"
          >
            <i class="fa fa-percent mr-1"></i> Discount
          </button>
        </div>
      </div>
    </div>

    <!-- Scroll Indicators -->
    <div
      v-if="isScrollable && !isScrolledToBottom"
      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce"
    >
      <i class="fa fa-chevron-down text-gray-400"></i>
    </div>
    <div
      v-if="isScrollable && isScrolledToBottom"
      class="absolute top-0 left-1/2 transform -translate-x-1/2 animate-bounce"
    >
      <i class="fa fa-chevron-up text-gray-400"></i>
    </div>

    <!-- No Items Message -->
    <div
      v-else-if="!items || items.length === 0"
      class="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg"
    >
      <i
        class="fa fa-cart-arrow-down text-4xl text-gray-400 mb-2 animate__animated animate__headShake animate__infinite"
      ></i>
      <span class="text-red-500 font-semibold text-sm">No items in cart!</span>
    </div>

    <!-- Discount Modal -->
    <Modal
      :show="isDiscountModalOpen"
      :maxWidth="'lg'"
      title="Apply Discount"
      @close="isDiscountModalOpen = false"
    >
      <div class="p-6" v-if="discountOptions.length > 0">
        <!-- Discount Options -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Select Discount:</label
          >
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="(d, index) in discountOptions"
              :key="index"
              :class="[
                'p-3 rounded-lg border text-sm transition-colors',
                menuDiscount.discount_id == d.value
                  ? 'bg-lime-500 text-white'
                  : 'bg-gray-100 hover:bg-lime-100',
              ]"
              @click="computeDiscount(d.value)"
            >
              {{ d.label }}
            </button>
          </div>
        </div>

        <!-- Discount Value Input -->
        <div class="mb-4" v-if="menuDiscount.discount_id < 3">
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Discount Value:</label
          >
          <input
            v-model.number="menuDiscount.value"
            @change.prevent="applyDiscount()"
            type="number"
            min="0"
            placeholder="Enter value"
            class="w-full text-center border rounded-lg p-2 text-sm focus:ring-2 focus:ring-lime-500"
          />
        </div>

        <!-- Price and Discounted Amount -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Original Price:</label
            >
            <input
              v-model.number="menuDiscount.total_price"
              disabled
              type="number"
              class="w-full text-center border rounded-lg p-2 text-sm bg-gray-100"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Discounted Amount:</label
            >
            <input
              v-model.number="menuDiscount.final_price"
              disabled
              type="number"
              class="w-full text-center border rounded-lg p-2 text-sm bg-gray-100"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center space-x-3">
          <button
            @click.prevent="applyDiscountToMenu()"
            :disabled="discountClicked"
            :class="[
              'px-4 py-2 rounded text-white text-sm',
              discountClicked ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600',
            ]"
          >
            Apply
          </button>
          <button
            @click.prevent="undoDiscountToMenu()"
            :disabled="discountClicked"
            :class="[
              'px-4 py-2 rounded text-white text-sm',
              discountClicked ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600',
            ]"
          >
            Undo
          </button>
          <button
            @click="isDiscountModalOpen = false"
            class="px-4 py-2 rounded bg-gray-300 text-gray-800 text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>

        <!-- Loading Indicator -->
        <div v-if="discountClicked" class="flex justify-center mt-4 text-red-500 text-sm">
          <i class="fa fa-spinner animate-spin mr-2"></i> Calculating Discount...
        </div>
      </div>
      <div v-else class="p-6">
        <Loader />
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import Swal from "sweetalert2";
import Loader from "@/views/Component/Loader.vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import {
  moneyFormatter,
  BearToken,
  FormDx,
  handleApiError,
  Alert,
  useDebounce,
} from "@/views/Utility/Helper.js";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global.js";

const token = localStorage.getItem("token");
const emits = defineEmits(["discountData"]);
const props = defineProps({
  data: Object,
});

const items = ref([]);
const isDiscountModalOpen = ref(false);
const discountClicked = ref(false);
const menuDiscount = ref({
  menu_id: 0,
  quantity: 0,
  price: 0,
  discount_id: 1,
  discount_type: "percent",
  value: 0,
  discounted_price: 0,
  final_price: 0,
  total_price: 0,
  less: 0,
});
const discountOptions = ref([]);
const isScrollable = ref(false);
const isScrolledToBottom = ref(false);
const scrollContainer = ref(null);

const handleScroll = (event) => {
  const container = event.target;
  const scrollPosition = container.scrollTop + container.clientHeight;
  const scrollHeight = container.scrollHeight;

  // Check if scrolled to bottom (with a small threshold)
  isScrolledToBottom.value = scrollHeight - scrollPosition < 10;
};

const checkScrollable = () => {
  const container = scrollContainer.value;
  if (container) {
    isScrollable.value = container.scrollHeight > container.clientHeight;
    // Reset scroll position when checking
    isScrolledToBottom.value = false;
  }
};

onMounted(() => {
  loadMenus();
  setTimeout(checkScrollable, 100);
  window.addEventListener("resize", checkScrollable);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScrollable);
});

const discountOptionsDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}discounts/dropdown`,
      BearToken(token)
    );
    discountOptions.value = response.data.discounts;
  } catch (error) {
    console.log(error);
  }
};

const loadMenus = () => {
  items.value = props.data || [];
  // Check scrollable after items are loaded
  setTimeout(checkScrollable, 100);
};

const updateQuantity = (index, change) => {
  const newQuantity = items.value[index].quantity + change;
  if (newQuantity >= 1) {
    items.value[index].quantity = newQuantity;
    updateTotal(index);
  }
};

const debounceUpdateTotal = useDebounce(async (index) => {
  updateTotal(index);
}, 500);

const updateTotal = (index) => {
  const item = items.value[index];

  if (item.discount_id > 0) {
    menuDiscount.value.index = index;
    menuDiscount.value.menu_id = item.menu_id;
    menuDiscount.value.discount_id = item.discount_id;
    menuDiscount.value.price = item.price;
    menuDiscount.value.quantity = item.quantity;

    applyDiscount();
  } else {
    items.value[index].total = item.price * item.quantity;
    items.value[index].final_total = item.price * item.quantity;
    emits("discountData", items.value);
  }
};

const showMenuDiscount = (item, index) => {
  isDiscountModalOpen.value = true;
  menuDiscount.value.index = index;
  menuDiscount.value.menu_id = item.menu_id;
  menuDiscount.value.price = item.price;
  menuDiscount.value.total_price = item.total;
  menuDiscount.value.final_price = item.total;
  menuDiscount.value.quantity = item.quantity;
  menuDiscount.value.discount_id = item.discount_id ?? 0;
  discountOptionsDropdown();
};

const computeDiscount = (discount_id) => {
  menuDiscount.value.discount_id = discount_id;
  applyDiscount();
};

const applyDiscountToMenu = () => {
  emits("discountData", items.value);
  Alert("success", "Success!", "Discount Applied");
  isDiscountModalOpen.value = false;
};

const undoDiscountToMenu = () => {
  Alert("info", "Attention!", "Discount Removed");
  const activeIndex = menuDiscount.value.index;
  items.value[activeIndex].discount_value = 0;
  items.value[activeIndex].discount_id = 0;
  items.value[activeIndex].less = 0;
  items.value[activeIndex].final_total = items.value[activeIndex].total;
  items.value[activeIndex].discount_abbre = "-";
  menuDiscount.value.total_price = items.value[activeIndex].total;
  menuDiscount.value.final_price = items.value[activeIndex].final_total;
  emits("discountData", items.value);
};

const applyDiscount = async () => {
  try {
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we compute the menu discount.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    discountClicked.value = true;
    const formData = FormDx(menuDiscount.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/compute-discount-per-menu`,
      formData,
      BearToken(token)
    );

    Swal.close();

    if (response) {
      const discountedData = response.data.computed;
      const activeIndex = menuDiscount.value.index;
      items.value[activeIndex].discount_value = discountedData.value ?? 0;
      items.value[activeIndex].discount_id = parseFloat(
        menuDiscount.value.discount_id ?? 0
      );
      items.value[activeIndex].less = parseFloat(discountedData.less ?? 0);
      items.value[activeIndex].total = parseFloat(discountedData.total ?? 0);
      items.value[activeIndex].final_total = parseFloat(discountedData.finalTotal ?? 0);
      items.value[activeIndex].discount_abbre = discountedData.discountAbbre ?? "-";
      // console.log("Test for discount: " + discountedData.value);
      // console.log(discountedData);
      emits("discountData", items.value);
    }
  } catch (error) {
    Swal.close();
    handleApiError(error);
  } finally {
    discountClicked.value = false;
  }
};

const removeItem = (index) => {
  items.value.splice(index, 1);
  emits("discountData", items.value);
};
</script>
