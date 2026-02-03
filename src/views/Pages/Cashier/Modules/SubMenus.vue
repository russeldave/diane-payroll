<template>
  <button
    @click.stop="getSubMenus"
    class="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-800 transition-colors"
  >
    <i class="fa fa-list"></i> Sub Menus
      <span
        v-if="props.data.subMenuCount > 0"
        class="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow border-2 border-white"
      >
        {{ props.data.subMenuCount }}
      </span>

  </button>

  <Modal
    :show="isViewModalOpen"
    :maxWidth="'4xl'"
    :title="`Sub Menus - ${parentMenu?.title || parentMenu?.name || 'Menu'}`"
    @close="closeSubMenuModal"
  >
    <div class="p-4">
      <!-- Loading / Error / SubMenu Grid -->
      <div v-if="loading" class="flex justify-center py-8"><Loader /></div>
      <div v-else-if="error" class="text-center text-red-500 py-8">{{ error }}</div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        <div
          v-for="(item, index) in subMenus"
          :key="item.id"
          class="relative border rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer"
          :style="{ borderColor: item.bgColor, borderWidth: '4px' }"
          @click.prevent="addCartItem(item)"
        >
          <MenuCards :data="item" :isSimple="true" />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end mt-6 border-t pt-4">
        <button
          @click="closeSubMenuModal"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import {
  BearToken,
  FormDx,
  handleApiError,
  generateRandomHex,
} from "@/views/Utility/Helper.js";
import { VUE_APP_API_URL } from "@/views/Utility/Global.js";
import Loader from "@/views/Component/Loader.vue";
import Modal from "@/views/Component/Modal.vue";
import MenuCards from "./MenuCards.vue";

const emits = defineEmits(["submenu_added"]);
const props = defineProps({
  data: { type: Object, required: true },
});

const token = localStorage.getItem("token");
const isViewModalOpen = ref(false);
const loading = ref(false);
const error = ref(null);
const subMenus = ref([]);
const parentMenu = ref(null);

// Fetch sub-menus for this menu
const getSubMenus = async () => {
  loading.value = true;
  error.value = null;
  subMenus.value = [];
  parentMenu.value = props.data;

  isViewModalOpen.value = true;

  try {
    const payload = {
      parent_menu_id: props.data.id,
      page_num: 1,
      itemsperpage: 50,
      with_images: true,
      menu_category_id: 0,
    };

    const response = await axios.post(
      `${VUE_APP_API_URL}menus/sub-menus`,
      payload,
      BearToken(token)
    );

    const menus = response.data.submenus || response.data.menus || [];
    subMenus.value = menus.map((item) => ({
      id: item.id,
      title: item.title || item.name || "Untitled",
      description: item.description || "",
      retailPrice: item.retailPrice || item.price || 0,
      quantity: 1,
      total: item.retailPrice || item.price || 0,
      availability: item.availability !== false,
      bgColor: generateRandomHex(),
    }));
  } catch (err) {
    error.value = handleApiError(err);
  } finally {
    loading.value = false;
  }
};

// Add submenu to cart - FIXED VERSION
const addCartItem = (item) => {
  // Check if item is available
  if (item.availability === false) {
    Swal.fire({
      icon: 'warning',
      title: 'Out of Stock',
      text: `${item.title} is currently out of stock.`,
      confirmButtonText: 'OK'
    });
    return;
  }

  const total = item.retailPrice * item.quantity;

  // Create cart object identical to main addCartItem
  const cartItem = {
    menu_id: item.id,
    menu_name: item.title,
    price: item.retailPrice,
    quantity: item.quantity,
    total: total,
    discount_id: 0,
    discount_value: 0,
    less: 0,
    final_total: total,
    bg_color: item.bgColor,
  };

  // Emit to parent (which handles actual cart storage)
  emits("submenu_added", cartItem);

  // Close modal after adding to cart
  closeSubMenuModal();

  // Toast feedback
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: `Added ${item.title} to cart`,
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
};

// Close modal
const closeSubMenuModal = () => {
  isViewModalOpen.value = false;
  loading.value = false;
  error.value = null;
  subMenus.value = [];
  parentMenu.value = null;
};
</script>