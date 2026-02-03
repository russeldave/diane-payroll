<template>
  <div class="flex justify-center items-center">
    <!-- Thumbnail Image -->
    <img
        v-if="props.thumbnail"
        :src="thumbnailSrc"
        loading="lazy"
        class="border shadow cursor-pointer object-contain w-[500px] h-[215px] rounded-md transition-transform transform hover:scale-105"
        @click="openGallery"
        alt="Image Thumbnail"
    />
    <div
      v-else
      class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500"
      >
      <span class="text-4xl">🖼️</span>
      <p class="mt-2 text-sm font-semibold">No Image Available</p>
    </div>

    <!-- Modal for Gallery -->
    <Teleport to="body">
      <div
        v-if="showGallery"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[99999]"
        @click.self="closeGallery"
      >
        <div class="relative w-full h-full flex flex-col">
          <!-- Close Button -->
          <button
            @click.prevent="closeGallery"
            class="absolute top-4 right-4 p-2 text-white font-bold bg-red-700 rounded-full z-[100000]"
            title="Close Gallery"
          >
            <i class="fa fa-times"></i>
          </button>

          <!-- Selected Image -->
          <div class="selected-image-container p-2">
            <img
              v-if="images.images?.length > 0"
              :src="'data:image/jpeg;base64,' + images.images[currentIndex].image"
              alt="Selected Image"
              class="w-full h-full object-contain rounded"
            />

          </div>

          <!-- Gallery Thumbnails -->
          <div class="absolute bottom-0 w-full bg-gray-800 p-2 flex overflow-x-auto space-x-3">
            <div
              v-if="images.images?.length > 0"
              v-for="(img, index) in images.images"
              :key="index"
              class="relative hover:scale-110"
            >
              <!-- Thumbnail -->
              <img
                :src="'data:image/jpeg;base64,' + img.image"
                class="w-20 h-20 object-cover rounded-lg cursor-pointer transition-transform transform"
                @click="currentIndex = index"
                alt="Gallery Image"
              />

              <!-- Primary Checkbox -->
              <input
                type="checkbox"
                v-model="img.isPrimaryImage"
                @change.prevent="setPrimaryImage(img.id, img.isPrimaryImage)"
                title="Set Image as Primary"
                class="absolute top-2 left-2 hover:bg-lime-500 p-2 z-[100001]"
              />

              <!-- Delete Button -->
              <button
                type="button"
                v-if="canDeleteImage"
                @click.prevent="removeImage(img.id)"
                class="absolute top-2 right-2 p-1 text-red-500 font-bold bg-gray-200 cursor-pointer z-[100002] text-sm"
                title="Remove Item Image"
              >
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import defaultImage from '@/assets/images/default/imageNotAvailable.jpg';
import { FormDx, BearToken, handleApiError, Alert } from '@/views/Utility/Helper';
import { VUE_APP_API_URL } from '@/views/Utility/Global';
import Swal from "sweetalert2";
import axios from 'axios';


const token = localStorage.getItem("token");
const props = defineProps({
  item_id: { type: Number, required: true },
  thumbnail: { type: [String, Boolean], required: true },
  canDeleteImage: { type: Boolean, default: false },
  item_id_number: { type: String, default: '00' },
});

const emits = defineEmits(['remove-image', "adjustModal"]);
const images = ref([]);
const showGallery = ref(false);
const currentIndex = ref(0);
const thumbnailSrc = ref(defaultImage);

const getItemImages = async () => {
  try {
    images.value = [];
    const formData = FormDx({ item_id_number: props.item_id_number });
    const response = await axios.post(
      `${VUE_APP_API_URL}items/get-item-images`,
      formData,
      BearToken(token)
    );
    images.value = response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const openGallery = () => {
  showGallery.value = true;
  emits("adjustModal", true);
  getItemImages();
};

const closeGallery = () => {
  showGallery.value = false;
  emits("adjustModal", false);
};

const removeImage = async (image_id) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this image. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      const formData = FormDx({ item_image_id: image_id });
      const response = await axios.post(
        `${VUE_APP_API_URL}items/delete-image`,
        formData,
        BearToken(token)
      );
      Alert("warning", "Deleted!", response.data.message);
      getItemImages();
    } else {
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
  } catch (error) {
    handleApiError(error);
  }
};

const setPrimaryImage = async (image_id, is_primary) => {
  try {
    const confirmed = await Swal.fire({
      title: "Set as Primary Image?",
      text: "This image will be set as the primary display image.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, set it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      const formData = FormDx({
        item_id: props.item_id,
        item_image_id: image_id,
        is_primary: is_primary,
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}items/set-primary-image`,
        formData,
        BearToken(token)
      );
      Alert("success", "Updated!", response.data.message);
      getItemImages();
    } else {
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
  } catch (error) {
    handleApiError(error);
  }
};

const showThumbNail = () => {
  thumbnailSrc.value = props.thumbnail
    ? 'data:image/jpeg;base64,' + props.thumbnail
    : defaultImage;
};

onMounted(() => {
  showThumbNail();
});
</script>

<style scoped>
.selected-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 1rem;
}


.selected-image-container img {
  width: auto;
  height: auto;
  max-width: 80vw;  /* 80% of viewport width */
  max-height: 80vh; /* 80% of viewport height */
  object-fit: contain;
  border-radius: 0.75rem;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease-in-out;
}

/* Add a subtle zoom on hover */
.selected-image-container img:hover {
  transform: scale(1.03);
}

/* Responsive for smaller devices */
@media (max-width: 768px) {
  .selected-image-container img {
    max-width: 90vw;
    max-height: 70vh;
  }
}
</style>

