<template>
  <div class="flex justify-center items-center">
    <!-- Thumbnail Imagess -->
    <img
      :src="thumbnailSrc"
      loading="lazy"
      class="border shadow cursor-pointer object-contain w-32 h-32 lg:h-48 lg:w-48 rounded-lg transition-transform transform group-hover:scale-105"
      @click="openGallery"
      alt="Image Thumbnail"
    />
    <!-- Modal for Gallery -->
    <div
      v-if="showGallery"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="relative w-full h-full flex flex-col">
        <!-- Close Button -->
        <button
          @click.prevent="closeGallery"
          class="absolute top-4 right-4 p-2 text-white font-bold bg-red-700 rounded-full z-10"
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
          />
          <img
            v-else
            :src="defaultImage"
            alt="Default Selected Image"
          />
        </div>
        <!-- Gallery Thumbnails -->
        <div class="absolute bottom-0 w-full bg-gray-800 p-2 flex overflow-x-auto space-x-2">
          <div v-if="images.images?.length > 0" v-for="(img, index) in images.images" :key="index" class="relative hover:scale-110">
            <!-- Thumbnail Image -->
            <img
              :src="'data:image/jpeg;base64,' + img.image"
              class="w-24 h-24 object-cover rounded-lg cursor-pointer transition-transform transform"
              @click="currentIndex = index"
              alt="Gallery Image"
            />
            <!-- Remove Button -->
            <button
              type="button"
              v-if="canDeleteImage"
              @click.prevent="removeImage(img.id)"
              class="absolute top-2 right-2 p-1 text-red-500 font-bold bg-gray-200 cursor-pointer z-1000 text-sm"
              title="Remove Item Image"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <!-- Default Thumbnail Image -->
          <div v-else class="relative hover:scale-110">
            <img
              :src="defaultImage"
              class="w-24 h-24 object-cover rounded-lg cursor-pointer transition-transform transform"
              @click="openGallery"
              alt="Default Thumbnail Image"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
// Import default image
import defaultImage from '@/assets/images/default/imageNotAvailable.jpg';
import { FormDx,BearToken, handleApiError } from '@/views/Utility/Helper';
import { VUE_APP_API_URL } from '@/views/Utility/Global';
import axios from 'axios';

const token = localStorage.getItem("token","adjustModal");
const props = defineProps({
  item_id: {
    type: Number,
    required: true
  },
  thumbnail:{
    type: [String, Boolean],
    required: true,
  },
  canDeleteImage: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['remove-image',"adjustModal"]);
const images = ref([]);
const showGallery = ref(false);
const currentIndex = ref(0);

// Computed property to determine the thumbnail source
const thumbnailSrc = ref(false);
const getItemImages = async () => {
  console.log(props);
  try {
    images.value = [];
    const formData = FormDx({ item_id_number: props.item_id });
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
  emits("adjustModal",true);
  getItemImages()
};

const closeGallery = () => {
  showGallery.value = false;
  emits("adjustModal",false);
};

const removeImage = (id) => {
  console.log(id);
};
const showThumbNail = () => {
  thumbnailSrc.value = props.thumbnail ? 'data:image/jpeg;base64,' + props.thumbnail :  defaultImage;

}
onMounted(() => {
    showThumbNail();
});
</script>

<style scoped>
/* Full-screen modal styling */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.relative {
  display: flex;
  flex-direction: column;
}

/* Ensure the modal content uses full height */
.flex-grow {
  flex-grow: 1;
}

/* Ensure the gallery thumbnails are properly styled */
.bg-gray-800 {
  background-color: #2d2d2d;
}

/* Center the selected image */
.selected-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Responsive image class */
.selected-image-container img {
  max-width: 100%;
  max-height: 80vh; /* Ensures the image does not exceed 80% of viewport height */
  object-fit: contain; /* Ensures the image maintains aspect ratio */
  display: block;
  margin: 0 auto; /* Centers the image horizontally */
}

/* Styling for the gallery thumbnails below */
.mt-4 {
  margin-top: 1rem;
}

.overflow-x-auto {
  overflow-x: auto;
}
</style>
