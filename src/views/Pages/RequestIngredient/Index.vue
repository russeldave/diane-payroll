<template>
  <div v-if="hasPermission('Navigation_Request_Ingredient')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- Ingredient List Full Width -->
      <IngredientList @transaction_id="handleTransaction" @cart_count="updateCartCount" />

      <!-- Slide-over Cart -->
      <transition name="slide">
        <div
          v-if="isCartOpen"
          class="fixed inset-y-0 right-0 z-50 w-100 bg-white border-l border-gray-300 shadow-lg transform transition-transform duration-300 ease-in-out"
        >
          <div
            :class="DEFAULT_BG"
            class="flex items-center justify-between p-4 border-b border-gray-200"
          >
            <h2 class="text-2xl font-bold text-white">Cart</h2>
            <button @click="isCartOpen = false" class="text-red-600 hover:text-gray-800">
              <i class="fa fa-2x fa-times-circle text-red-500"></i>
            </button>
          </div>
          <div class="p-4 overflow-y-auto h-[calc(100%-64px)] w-full">
            <Cart :key="updateKey" />
          </div>
        </div>
      </transition>

      <!-- Floating Cart Button -->
      <button
       
      @click="isCartOpen = true"
        class="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200"
        title="Open Cart"
      >
        <i class="fas fa-shopping-cart text-xl"></i>
        <b class="text-red-500 ml-1 font-bold">{{ cartCount }}</b>
      </button>
    </div>
  </div>

  <!-- Permission Error View -->
  <div v-else class="relative">
    <Error403 />
  </div>
</template>
<script setup>
import { ref } from "vue";
import { hasPermission } from "@/views/Utility/Permissions";
import {
  VUE_APP_API_URL,
  DATE_NOW,
  COMPANIES,
  CATEGORIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import Error403 from "@/views/Error/403.vue";

import IngredientList from "./Modules/IngredientList.vue";
import Cart from "./Modules/Cart.vue";

const isCartOpen = ref(false);
const updateKey = ref(false);
const cartCount = ref(0);

const updateCartCount = (count) => {
  cartCount.value = count;
  console.log("Cart Count Updated:", count);
};

const toggleRequestItemVisibility = () => {
  isRequestItemVisible.value = !isRequestItemVisible.value;
};

const handleTransaction = (transactionId) => {
  console.log("Transaction ID:", transactionId);
  updateKey.value = transactionId;
  isCartOpen.value = true; // Open slideover when transaction is triggered
}
</script>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
