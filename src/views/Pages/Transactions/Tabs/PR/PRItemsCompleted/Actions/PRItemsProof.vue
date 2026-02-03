<template>
  <button
    @click.prevent="viewBehavior()"
    type="button"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded-l text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
   >
    <i class="fas fa-image"></i>
    <span>&nbsp;View Proof</span>
  </button>

  <!-- View Images Modal -->
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'4xl'"
    title="View Purchase Request Proof Images"
    @close="isViewModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <div v-if="images.length > 0" class="relative">
        <!-- Carousel -->
        <div class="relative w-full flex justify-center items-center">
          <img
            :src="'data:image/png;base64,' + images[currentImageIndex].image"
            alt="Direct Receive Proof Image"
            class="w-50 h-auto rounded-md"
          />
        </div>

        <!-- Image Count -->
        <div class="text-center mt-2 text-gray-600">
          Image {{ currentImageIndex + 1 }} of {{ images.length }}
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mt-4">
          <button
            @click="prevImage"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            :disabled="currentImageIndex === 0"
          >
            Previous
          </button>
          <button
            @click="nextImage"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            :disabled="currentImageIndex === images.length - 1"
          >
            Next
          </button>
        </div>

        <!-- Active Circle Indicators -->
        <div class="flex justify-center mt-4 space-x-2 absolute top-0 right-0 px-4">
          <span
            v-for="(image, index) in images"
            :key="image.id"
            class="w-3 h-3 rounded-full"
            :class="{
              'bg-blue-500': index === currentImageIndex,
              'bg-gray-300': index !== currentImageIndex,
            }"
          ></span>
        </div>
      </div>

      <div v-else>
        <p class="text-center text-gray-500">No images available for this PR Item.</p>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { BearToken, handleApiError } from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
});

const isViewModalOpen = ref(false);
const images = ref([]); // Array of image objects [{ id: 1, image: base64 }]
const currentImageIndex = ref(0);

const viewBehavior = async () => {
  resetCarousel();
  await fetchImages();
  isViewModalOpen.value = true;
};

const fetchImages = async () => {
  try {
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/pr-item-get-proof-images`,
      { pr_item_id: props.data.id },
      BearToken(token)
    );
    images.value = response.data.images || []; // Expecting [{ id: 1, image: base64 }]
  } catch (error) {
    console.error(error);
    handleApiError(error);
  }
};

const resetCarousel = () => {
  images.value = [];
  currentImageIndex.value = 0;
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const nextImage = () => {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++;
  }
};
</script>
