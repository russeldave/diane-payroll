<template>
  <!-- v-if="hasPermission('Navigation_Meals_List')" -->
  <div>
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Menu'" /> -->
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-1">Menu Management test</h1>
    </div>
  </div>
  <!-- <div v-else>
    <Error403 />
  </div> -->
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  CATEGORIES,
  DEFAULT_BG,
  MENU_DOWNLOAD_LINK,
  MENU_INGREDIENTS_DOWNLOAD_LINK,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  barcodeConverter,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";
import Loader from "@/views/Component/Loader.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";

const getTest = async () => {
  try {
    const response = await axios.post(`api/users/test`);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return []; // You may want to handle errors more gracefully based on your use case
  }
};

// Call listMeals when component is mounted
onMounted(() => {
  getTest();
});
</script>
