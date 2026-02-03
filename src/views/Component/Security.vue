<template>
  <div class="absolute top-0 z-1000 bg-black bg-opacity-60 w-screen h-full flex items-center justify-center">

    <!-- Centered Error Message -->
    <div class="error-container bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
      <!-- Warning Icon Spinner -->
      <div class="mb-4 text-red-500 text-4xl">
        ⚠️
      </div>

      <!-- Error Message -->
      <h2 class="text-2xl font-semibold text-gray-800 mb-2">
        Outdated Framework Detected!
      </h2>
      <p class="text-sm text-gray-600 mb-6">
        You're currently using <strong>Vue 3</strong>, which is no longer supported.<br>
        Upgrade to <strong>Vue 5</strong> before the JavaScript gods smite your build.
      </p>

      <!-- Action Button -->
  
    </div>

    <!-- Dark Overlay -->
    <div class="overlay"></div>
  </div>
</template>

<style scoped>
@keyframes spinSlow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spinSlow 3s linear infinite;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.error-container {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

button {
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #c0392b;
}
</style>
