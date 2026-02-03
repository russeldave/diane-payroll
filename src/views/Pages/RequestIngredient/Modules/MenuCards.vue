<template>
  <div
    class="relative w-full h-80 rounded-xl shadow-lg bg-gray-900 flex flex-col overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-xl"
    :class="{ 'h-auto': isNameExpanded }"
    role="region"
    aria-label="Ingredient Card"
  >
    <!-- Overlay: Adding to Cart -->
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-black bg-opacity-60 text-white text-sm flex items-center justify-center z-50 font-semibold"
      aria-live="polite"
    >
      Adding to cart...
    </div>

    <!-- Image -->
    <div class="relative w-full h-2/3 flex items-center justify-center bg-gray-50">
      <ZoomOnView
        v-if="itemData.thumbNail"
        :item_id="itemData.id"
        :item_id_number="itemData.ingredientIdNumber"
        :thumbnail="itemData.thumbNail"
        :canDeleteImage="false"
      />
      <div
        v-else
        class="flex flex-col items-center justify-center
              bg-gray-100 text-gray-500
              border-2 border-dashed border-gray-300
              rounded-lg
              w-full h-full
              min-h-[180px]"
        >
        <span class="text-sm font-semibold uppercase tracking-wide">
          No Image Available
        </span>
      </div>

      <!-- Name Overlay -->
      <button
        v-if="isNameExpanded"
        @click="toggleName"
        class="absolute inset-0 bg-black bg-opacity-60 text-white text-sm font-extrabold uppercase text-center flex items-center justify-center p-4 z-20"
        :title="itemData.name"
        aria-label="Hide full ingredient name"
        aria-expanded="true"
      >
        <span class="w-full text-wrap break-words">
          {{ itemData.itemName ?? itemData.name }}
        </span>
      </button>
      <div 
        v-if="!isViewing"
        class="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
        <span class="bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
          Stocks: {{ itemData.floatStocks }}
        </span>
      </div>
      <div 
        v-if="!isStocksViewing"
        class="absolute top-3 left-30 right-3 flex justify-between items-start">
        <ItemStocks :data="itemData"/>
      </div>
    </div>

    <!-- Product Name (below image, truncated when not expanded) -->
    <div class="w-full flex flex-col items-center px-4 py-2">
      <button
        v-if="!isNameExpanded"
        @click="toggleName"
        class="text-sm font-extrabold text-white uppercase text-center w-full line-clamp-2"
        :title="itemData.name"
        aria-label="Show full ingredient name"
        aria-expanded="false"
      >
        {{ itemData.name }}
      </button>
    </div>

    <!-- Buttons Row -->
    <div
    v-if="isViewing"
    class="flex justify-between items-center w-full px-3 py-2 gap-2">
      <!-- Quantity Selector -->
      <div
        class="bg-white text-black text-xs font-semibold px-2 py-1 rounded-full shadow flex items-center gap-2"
        :class="{ 'opacity-60 pointer-events-none': isLoading }"
        role="group"
        aria-label="Quantity Selector"
      >
        <button
          @click="changeQuantity(-1)"
          class="w-6 h-6 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-bold transition-colors"
          :disabled="quantity <= 0"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span class="w-5 text-center font-bold" aria-live="polite">{{ quantity }}</span>
        <button
          @click="changeQuantity(1)"
          class="w-6 h-6 flex items-center justify-center bg-green-500 hover:bg-red-600 text-white rounded-full text-sm font-bold transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <!-- Add to Cart Button -->
      <button
        @click.prevent="addToCartItem(itemData)"
        class="bg-red-500 hover:bg-red-600 text-white uppercase text-xs font-semibold px-3 py-2 rounded-full shadow flex items-center gap-1 transition-colors"
        :class="{ 'opacity-60 pointer-events-none': isLoading }"
        :disabled="isLoading"
        aria-label="Add to cart"
      >
        <i class="fas fa-cart-plus"></i>
        Add to Cart
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import defaultImage from "@/assets/images/default/imageNotAvailable.jpg";
import { BearToken, FormDx, handleApiError } from "@/views/Utility/Helper.js";
import { VUE_APP_API_URL } from "@/views/Utility/Global.js";
import ZoomOnView from "./zoomOnView.vue";
import ItemStocks from "./ItemStocks.vue";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  isViewing: {
    type: Boolean,
    default: true
  }
});
console.log(props.data);

// You can destructure after defining:
// const { isViewing } = props;


// Create a reactive copy of props.data
const itemData = reactive({ ...props.data });

const setPrimaryImage = async (item_id, is_primary, ingredientIdNumber) => {
  try {
    // const confirmed = await Swal.fire({
    //   title: "Set as Primary Image?",
    //   text: "This image will be set as the primary display image.",
    //   icon: "question",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes, set it!",
    //   cancelButtonText: "No, cancel",
    //   reverseButtons: true,
    // });

    if (!is_primary) {
      const formData = FormDx({ item_id, thumb_nail: is_primary, ingredient_id_number: ingredientIdNumber });
      const response = await axios.post(
        `${VUE_APP_API_URL}items/set-no-primary-image`,
        formData,
        BearToken(token)
      );

      // Handle success response
      // Swal.fire("Success", response.data.message, "success");

      // Update reactive itemData
      if (response.data.image) {
        itemData.thumbNail = response.data.image; // Update reactive state
      } else {
        itemData.thumbNail = null; // Reset to null if no image is returned
      }
    }
  } catch (error) {
    console.error(error);
    handleApiError(error);
  }
};

// State
const quantity = ref(1);
const isLoading = ref(false);
const isNameExpanded = ref(false);

// Toggle name display
const toggleName = () => {
  isNameExpanded.value = !isNameExpanded.value;
};

// Change quantity
const changeQuantity = (delta) => {
  quantity.value = Math.max(0, quantity.value + delta);
};

// Add to cart
const addToCartItem = async (item) => {
  if (quantity.value <= 0 || isLoading.value) return;

  try {
    isLoading.value = true;
    const formData = FormDx({
      ingredient_id: item.id,
      quantity: quantity.value,
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}user-carts/add`,
      formData,
      BearToken(token)
    );

    if (response && !response.error) {
      Swal.fire("Success", response.data.message, "success");
      emits("transaction_id", Math.random());
    }
  } catch (error) {
    console.error("Add to Cart Error:", error);
    Swal.fire("Error", "Something went wrong.", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Ensure text truncation for long names */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Smooth height transition */
div[role="region"] {
  transition: height 0.3s ease;
}

/* Overlay name styling */
button[aria-expanded="true"] span {
  line-height: 1.2;
  max-height: 100%;
  overflow-wrap: break-word;
}
</style>
