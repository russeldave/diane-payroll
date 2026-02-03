<template>
    <div class="carousel-container relative w-full h-full">
      <!-- Carousel Images -->
      <div
        class="carousel-images w-full h-full overflow-hidden relative"
        :style="`height: ${height}`"
      >
        <div
          class="carousel-images-inner flex transition-all duration-500"
          :style="carouselStyle"
        >
          <div
            v-for="(image, index) in images"
            :key="index"
            class="carousel-image flex-shrink-0 w-full h-full relative"
          >
            <!-- Image Container -->
            <div class="image-container w-full h-50 relative">
              <!-- Image using object-cover to fit container while maintaining aspect ratio -->
              <img
                :src="`data:image/png;base64,${image}`"
                alt="Image"
                class="w-full h-full object-cover"
              />
            </div>
            
          </div>
        </div>
      </div>
  
      <!-- Navigation Dots -->
      <div v-if="dots" class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          v-for="(image, index) in images"
          :key="index"
          :class="{
            'bg-white': currentIndex === index, 
            'bg-gray-600': currentIndex !== index
          }"
          class="w-3 h-3 rounded-full"
          @click="goToSlide(index)"
        />
      </div>
  
      <!-- Left and Right Arrows -->
      <button
        v-if="arrows"
        class="absolute top-1/2 left-4 transform -translate-y-1/2 text-white font-bold text-3xl"
        @click="prevSlide"
      >
        &#10094;
      </button>
      <button
        v-if="arrows"
        class="absolute top-1/2 right-4 transform -translate-y-1/2 text-white font-bold text-3xl"
        @click="nextSlide"
      >
        &#10095;
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import { VUE_APP_API_URL } from '@/views/Utility/Global';
  // Props
  const props = defineProps({
    images: {
      type: Array,
      required: true,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    autoplaySpeed: {
      type: Number,
      default: 3000,
    },
    arrows: {
      type: Boolean,
      default: true,
    },
    dots: {
      type: Boolean,
      default: true,
    },
    height: {
      type: String,
      default: '100vh',
    },
  });
  
  // Internal state
  const currentIndex = ref(0);
  let autoplayInterval = null;
  
  // Start Autoplay
  const startAutoplay = () => {
    if (typeof window !== 'undefined') {
      autoplayInterval = setInterval(nextSlide, props.autoplaySpeed);
    }
  };
  
  // Stop Autoplay
  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  };
  
  // Go to the next slide
  const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
  };
  
  // Go to the previous slide
  const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
  };
  
  // Go to a specific slide
  const goToSlide = (index) => {
    currentIndex.value = index;
  };
  
  // Carousel Style for smooth transition
  const carouselStyle = computed(() => {
    return {
      transform: `translateX(-${currentIndex.value * 100}%)`,
    };
  });
  
  // Watch for changes in the `autoplay` prop
  watch(
    () => props.autoplay,
    (newVal) => {
      if (newVal) {
        startAutoplay();
      } else {
        stopAutoplay();
      }
    },
    { immediate: true }
  );
  
  // Start autoplay when the component is mounted
  onMounted(() => {
    if (props.autoplay) {
      startAutoplay();
    }
  });
  </script>
  
  <style scoped>
  .carousel-container {
    position: relative;
    width: 100%;
  }
  
  .carousel-images {
    overflow: hidden;
    position: relative;
    height: 100%; /* Ensure this takes full height from parent */
  }
  
  .carousel-images-inner {
    display: flex;
    transition: transform 0.5s ease-in-out;
    width: 100%;
  }
  
  .carousel-image {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    position: relative;
    background-color: rgba(0, 0, 0, 0.1); /* Temporary background color for testing */
  }
  
  .image-container {
    display: relative;
    width: 100%;
    height: 100vh;
  }
  
  button {
    cursor: pointer;
    background: transparent;
    border: none;
    outline: none;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  button:focus {
    outline: none;
  }
  
  /* Dots Navigation */
  .carousel-dots {
    position: absolute;
    bottom: 8px; /* Adjusted bottom margin for better visibility */
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
  }
  
  .carousel-dots button {
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    width: 12px;
    height: 12px;
  }
  
  .carousel-dots button.active {
    background-color: #ffffff;
  }
  
  /* Title and Subtitle Styling */
  .text-shadow-lg {
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  }
  </style>
  