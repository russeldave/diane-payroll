<template>
  <div class="p-4 bg-white rounded" v-if="discountOptions.length > 0">
    <div class="flex justify-center space-x-2 mt-2">
      <!-- Custom Discount Type Selector as Square Buttons -->
      <div class="block">
        <label class="block font-semibold text-center mb-2">Discount Options:</label>
        <div class="flex space-x-3 flex-wrap">
          <button
            v-for="(disc, index) in discountOptions"
            :key="index"
            :class="menuDiscount.discount_id == disc.value ? 'bg-lime-200' : ''"
            @click="computeDiscount(disc.value)"
            class="w-12 h-12 flex text-xs items-center justify-center rounded-lg border transition-colors duration-200 hover:bg-lime-600 focus:outline-none"
          >
            {{ disc.label }}
          </button>
          <button
            @click.prevent="undoDiscountToMenu()"
            :disabled="discountClicked"
            class="w-12 h-12 text-xs flex items-center bg-red-200 justify-center rounded-lg border transition-colors duration-200 hover:bg-red-600 focus:outline-none"
          >
            Undo
          </button>
        </div>
      </div>
      <!-- Custom Value Input as Square Button -->
    </div>
    <div class="grid grid-cols-3 md:grid-cols-3 gap-3"></div>
    <div class="mt-4 flex justify-center space-x-4" v-if="menuDiscount.discount_id < 3">
      <div class="block">
        <label class="block font-semibold text-center mb-2">Discount Value:</label>
        <input
          v-model.number="menuDiscount.value"
          @input.prevent="applyDiscount()"
          type="number"
          min="0"
          placeholder="Enter value"
          class="text-center border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3">
      <div class="mt-4 flex justify-center space-x-4">
        <div class="block">
          <label class="block font-semibold text-start mb-2">Price:</label>
          <input
            v-model.number="menuDiscount.total_price"
            disabled
            type="number"
            min="0"
            placeholder="Enter value"
            class="text-start border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div class="mt-4 flex justify-center space-x-4">
        <div class="block">
          <label class="block font-semibold text-start mb-2">Discounted Amount:</label>
          <input
            v-model.number="menuDiscount.final_price"
            disabled
            type="number"
            min="0"
            placeholder="Enter value"
            class="text-start border rounded-lg p-2 text-red-500 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <small
            v-if="discountClicked"
            class="flex items-center text-red-500 text-sm space-x-2"
            ><i class="fa fa-spinner animate-spin"></i>&nbsp;Calculating Discount...</small
          >
        </div>
      </div>
    </div>
  </div>
  <div v-else class="p-4"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import Swal from "sweetalert2";
import Loader from "@/views/Component/Loader.vue";
import axios from "axios";
import { hasPermission } from "@/views/Utility/Permissions";
import Modal from "@/views/Component/Modal.vue";
import Error403 from "@/views/Error/403.vue";
import {
  moneyFormatter,
  BearToken,
  FormDx,
  useDebounce,
  handleApiError,
  Alert
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
  discount_id: 0,
  discount_type: "percent", // either 'percent' or 'amount'
  value: 0,
  discounted_price: 0,
  final_total: 0,
  less: 0,
});
const discountOptions = ref([]);

// Initialize items for demonstration
onMounted(() => {
  showMenuDiscount();
});

// Show the discount modal and load item details

const showMenuDiscount = () => {
  const item = props.data;
  const hasDiscount = item.menus?.some((item) => item.discount_id > 0);
  const totalDiscountedPrice = item.menus?.reduce(
    (sum, item) => sum + item.final_total,
    0
  );
  const totalPrice = item.menus?.reduce((sum, item) => sum + item.total, 0);

  menuDiscount.value.total_price = totalPrice;
  menuDiscount.value.final_price = totalDiscountedPrice;

  menuDiscount.value.final_total = totalPrice;
  discountOptionsDropdown();
};
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
const computeDiscount = (discount_id) => {
  menuDiscount.value.discount_id = discount_id;

  applyDiscount();
};

const undoDiscountToMenu = () => {
  Alert("info", "Attention!", "Discount Removed");

  const activeIndex = menuDiscount.value.index;

  menuDiscount.value.discount_id = 0;
  menuDiscount.value.discount_abbre = "-";
  menuDiscount.value.less = 0;
  menuDiscount.value.final_price = menuDiscount.value.final_price;

  emits("discountData", menuDiscount);
};
const applyMenuDiscount = () => {
  emits("discountData", menuDiscount.value);
  Alert("success", "Success!", "Order Discount Applied");
};

const applyDiscount = useDebounce(async () => {
  applyDiscountValue();
}, 500);
// Apply the selected discount
const applyDiscountValue = async () => {
  try {
    // Show processing state
    // Swal.fire({
    //   title: "Processing...",
    //   text: "Please wait while we compute the discount.",
    //   allowOutsideClick: false,
    //   allowEscapeKey: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    discountClicked.value = true;
    const formData = FormDx(menuDiscount.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/compute-discount-per-invoice`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    if (response) {
      const discountedData = response.data.computed;
      const activeIndex = menuDiscount.value.index;

      menuDiscount.value.discount_abbre = discountedData.discountAbbre ?? "-";
      menuDiscount.value.less = parseFloat(discountedData.less ?? 0);
      menuDiscount.value.total_price = parseFloat(discountedData.total ?? 0);
      menuDiscount.value.final_price = parseFloat(discountedData.finalTotal ?? 0);
      menuDiscount.value.value = parseFloat(discountedData.value ?? 0);
      
      emits("discountData", menuDiscount.value);
      // Alert("success", "Success!", "Order Discount Applied");
    }
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  } finally {
    discountClicked.value = false;
  }
};

// Remove item from the list
const removeItem = (index) => {
  items.value.splice(index, 1);
};

</script>
