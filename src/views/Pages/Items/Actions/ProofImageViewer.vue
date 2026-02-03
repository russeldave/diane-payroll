<template>
  <div class="relative p-0">
    <!-- Thumbnail Image with View Icon Overlay -->
    <div class="relative group">
      <img
        :src="thumbnailSrc"
        loading="lazy"
         @click="openGallery"
        class="border shadow cursor-pointer w-32 h-32 object-contain rounded-lg transition-transform transform group-hover:scale-105"
        alt="Image Thumbnail"
      />
      <!-- View Icon Overlay -->
      <!-- <div  @click="openGallery" class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
        <i class="fa fa-search text-white text-3xl"></i>
      </div> -->
    </div>

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
          <div v-for="(img, index) in images.images" :key="index" class="relative hover:scale-110">
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
          <div v-if="images.images?.length === 0" class="relative hover:scale-110">
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

const token = localStorage.getItem("token");
const props = defineProps({
  mrf_id: {
    type: Number,
    required: true
  },
  canDeleteImage: {
    type: Boolean,
    default: false
  },
  thumbnail:{
    type: [String, Boolean],
    default: defaultImage,
  }
});

const emit = defineEmits(['remove-image']);

const showGallery = ref(false);
const currentIndex = ref(0);
const images = ref([]);


const getItemImages = async () => {
  try {
    images.value = [];
    const formData = FormDx({ mrf_item_id: props.mrf_id });
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/get-images-per-mrf-item`,
      formData,
      BearToken(token)
    );
    images.value = response.data;
  } catch (error) {
    handleApiError(error);
  }
};
// Computed property to determine the thumbnail source
const thumbnailSrc = computed(() => {
  return props.thumbnail ? 'data:image/jpeg;base64,' +props.thumbnail : defaultImage;
});

const openGallery = () => {
  showGallery.value = true;
  getItemImages();
};

const closeGallery = () => {
  showGallery.value = false;
};

const removeImage = (id) => {
  console.log(id);
  emit('remove-image', id);
};
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

/* Ensure the modal content uses full height */
.relative {
  display: flex;
  flex-direction: column;
}

/* Ensure the gallery thumbnails are properly styled */
.bg-gray-800 {
  background-color: #2d2d2d;
}

/* Center the selected image */
.flex-grow {
  flex-grow: 1;
}

.selected-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Styling for the gallery thumbnails below */
.mt-4 {
  margin-top: 1rem;
}

.overflow-x-auto {
  overflow-x: auto;
}


/* Responsive image class */
.selected-image-container img {
  max-width: 100%;
  max-height: 80vh; /* Ensures the image does not exceed 80% of viewport height */
  object-fit: contain; /* Ensures the image maintains aspect ratio */
  display: block;
  margin: 0 auto; /* Centers the image horizontally */
}
</style>
