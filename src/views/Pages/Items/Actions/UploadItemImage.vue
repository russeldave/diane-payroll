<template>
 <div class="block py-2">
    <form class="" @submit.prevent="uploadItemImage()" autocomplete="off">
       <div class="mb-2">
          <label
            for="itemImages"
            class="block text-sm font-medium text-gray-700"
            >Item Images</label
          >
          <div class="flex">
              <input
                type="file"
                id="itemImages"
                @change="handleImageUpload"
                multiple
                class="mt-1 p-2 border rounded-md w-full"
              />
              <button
                type="submit"
                class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                Upload
              </button>
          </div>
        </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";

import { VUE_APP_API_URL, PERMISSION, UNITS, CATEGORIES } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  useDebounce,
  handleApiError
} from "@/views/Utility/Helper";

import { hasPermission } from "@/views/Utility/Permissions";
const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const units = ref([]);
const coas = ref([]);
const props = defineProps({
  item_id: Number,
});

const imageFiles = ref([]);
const images = ref([]);

const itemsForm = ref({
  item_id: 0,
});

const uploadItemImage = async () => {
  try {
    const formData = new FormData();
    formData.append('item_id', props.item_id);

    // Append image files
    imageFiles.value.forEach(file => {
      formData.append('item_images[]', file);  // Using array notation for multiple files
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}items/add-images-only`,
      formData,
      BearToken(token)
    );

    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
}

</script>