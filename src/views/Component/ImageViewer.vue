<template>
    <div>
      <!-- Display Image -->
      <img 
        @click.prevent="openImageViewer" 
        :src="imageSource" 
        alt="View Image" 
        class="w-full h-32 object-contain rounded-md cursor-pointer hover:shadow" 
      />
      
      <!-- Modal for Image Viewer -->
      <Modal 
        :show="isImageModalOpen" 
        :maxWidth="'6xl'" 
        title="View Image" 
        @close="isImageModalOpen = false"
      >
        <div class="p-6 rounded-md shadow-md text-center">
          <!-- Display Image in Modal -->
          <img 
            :src="imageSource" 
            alt="Accomplishment Image" 
            class="w-full h-full object-contain rounded-md"
          />
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import Modal from '@/views/Component/Modal.vue';
  import defaultImage from '@/assets/images/default/imageNotAvailable.jpg';

  const props = defineProps({
    image: String,     // The image source (either base64 or URL)
    isBase64: Boolean // Whether the image is base64 encoded or not
  });
  
  const isImageModalOpen = ref(false);
  const imageSource = computed(() => {
    if (props.image && props.image.trim() !== '') {
      // If the image prop is not empty, use it (Base64 or URL)
      if (props.isBase64) {
        return `data:image/png;base64,${props.image}`; // Base64 image
      }
      return props.image; // Regular URL image
    }
    // If the image is empty, use the default image
    return defaultImage;
  });
  
  // Function to handle modal opening
  const openImageViewer = () => {
    isImageModalOpen.value = true; // Open the image modal
  };
  
  </script>
  
  <style scoped>
  /* Optional: Styles for the modal and image display */
  .cursor-pointer {
    cursor: pointer;
  }
  </style>
  