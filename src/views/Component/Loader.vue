<template>
  <div class="flex flex-col justify-center items-center min-h-full p-4">
    <!-- Circular Bouncing Dots Loader with Glow -->
    <!-- <div class="flex space-x-2">
          <div class="w-4 h-4 rounded-full animate-bounce-dot delay-0" :class="DEFAULT_BG"></div>
          <div class="w-4 h-4 rounded-full animate-bounce-dot delay-200" :class="DEFAULT_BG"></div>
          <div class="w-4 h-4 rounded-full animate-bounce-dot delay-400" :class="DEFAULT_BG"></div>
      </div> -->

    <!-- Randomized Loading Message with Dynamic Fade and Scale Effect -->
    <!-- <p class="text-amber-500 font-medium mt-4 text-xs sm:text-sm md:text-lg text-center">{{ loadingMessage }}</p> -->

    <div class="text-center">
      <i class="fa fa-spinner fa-2x text-blue-500 fa-spin"></i>
      <p
        class="text-slate-950 font-medium mt-4 text-xs sm:text-sm md:text-lg text-center"
      >
        Loading data...
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { DEFAULT_BG, loadingMessages } from "../Utility/Global";

const loadingMessage = ref(loadingMessages[0]);
// Function to update the loading message at random intervals
const updateLoadingMessage = () => {
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  loadingMessage.value = loadingMessages[randomIndex];
};

// Change message every 3 seconds
onMounted(() => {
  setInterval(updateLoadingMessage, 3000);
  updateLoadingMessage();
});
</script>

<style scoped>
/* Keyframes for circular bouncing dots with color transition */
@keyframes bounceDot {
  0%,
  100% {
    transform: translateY(0) translateX(0);
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
  }
  25% {
    transform: translateY(-10px) translateX(10px);
    box-shadow: 0 0 10px rgba(255, 87, 34, 0.8);
  }
  50% {
    transform: translateY(0) translateX(10px);
    box-shadow: 0 0 10px rgba(255, 235, 59, 0.8);
  }
  75% {
    transform: translateY(-10px) translateX(0);
    box-shadow: 0 0 10px rgba(33, 150, 243, 0.8);
  }
}

.animate-bounce-dot {
  animation: bounceDot 1.5s infinite ease-in-out;
}

.delay-0 {
  animation-delay: 0s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-400 {
  animation-delay: 0.4s;
}

/* Smooth fade-in and scale-up text animation */
@keyframes fadeInScaleUp {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.loading-message {
  animation: fadeInScaleUp 1.5s ease-out forwards;
  font-size: 1.25rem;
  font-weight: bold;
  letter-spacing: 1px;
}
</style>
