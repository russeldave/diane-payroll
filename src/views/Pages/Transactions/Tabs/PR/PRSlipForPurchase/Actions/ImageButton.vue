<template>
  <button
    @click.prevent="openImageModal"
    type="button"
    class="bg-lime-700 text-white hover:opacity-60 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    Images
  </button>

  <Modal
    :show="isImageModalOpen"
    :maxWidth="'2xl'"
    title="PR Images"
    @close="isImageModalOpen = false"
  >
    <div class="p-6 space-y-6">
      <!-- Image Container -->
      <div
        class="bg-gray-100 rounded-md p-3 flex flex-wrap gap-3 overflow-x-auto justify-center"
      >
        <!-- Display images from API or uploaded files -->
        <template v-if="allImages.length">
          <div
            v-for="(img, index) in allImages"
            :key="index"
            class="relative group"
          >
            <img
              :src="img.url || 'data:image/jpeg;base64,' + img.image"
              class="w-28 h-28 object-cover rounded-lg cursor-pointer transition-transform transform group-hover:scale-105"
              alt="PR Image"
            />
            <button
              v-if="canDeleteImage"
              @click.prevent="removeImage(img.id)"
              class="absolute top-1 right-1 bg-gray-200 text-red-500 p-1 rounded-full hover:bg-red-100"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </template>

        <!-- No images -->
        <div v-else class="text-gray-500 text-sm italic">
          No images uploaded yet.
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import Modal from "@/views/Component/Modal.vue";
import axios from "axios";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { BearToken, Alert, handleApiError } from "@/views/Utility/Helper";

const props = defineProps({
  data: Object,
  uploadedFiles: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(["transaction_id"]);

const token = localStorage.getItem("token");
const isImageModalOpen = ref(false);
const images = ref([]); // images from API
const canDeleteImage = ref(true);

// ✅ Merge both API images and newly uploaded files
const allImages = computed(() => {
  // Prevent duplicates if both have the same URL/base64 content
  const existingUrls = new Set(images.value.map((i) => i.url || i.image));
  const newFiles = props.uploadedFiles.filter(
    (f) => !existingUrls.has(f.url || f.image)
  );
  return [...images.value, ...newFiles];
});

const openImageModal = async () => {
  isImageModalOpen.value = true;
  await loadImages();
};

// ✅ Watch for new uploadedFiles from UploadPR.vue
watch(
  () => props.uploadedFiles,
  (newFiles) => {
    if (newFiles?.length) {
      images.value = [...images.value, ...newFiles];
    }
  },
  { deep: true }
);

const loadImages = async () => {
  try {
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/get-images`,
      {
        pr_id: props.data.id
      },
      BearToken(token)
    );
    images.value = response.data.images || [];
  } catch (error) {
    handleApiError(error);
  }
};

// ✅ Delete image
const removeImage = async (id) => {
  try {
    await axios.delete(`${VUE_APP_API_URL}prs/image/${id}`, BearToken(token));
    images.value = images.value.filter((img) => img.id !== id);
    Alert("success", "Removed", "Image removed successfully.");
  } catch (error) {
    handleApiError(error);
  }
};
</script>
