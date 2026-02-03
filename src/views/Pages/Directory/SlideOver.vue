<template>
  <!-- Overlay -->
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click.self="close"
    ></div>
  </transition>

  <!-- SlideOver Panel -->
  <transition name="slide-over">
    <aside
      v-if="isOpen"
      :class="DEFAULT_BG"
      class="fixed top-0 right-0 w-80 max-w-full h-full bg-white shadow-xl z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
    >
      <header
        class="flex items-center justify-between p-4 border-b bg-red-900 text-white"
      >
        <h2 class="text-lg font-semibold">Company Apps Directory</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>

      <main class="flex-1 overflow-auto p-4">
        <ul>
          <li
            v-for="app in apps"
            :key="app.id"
            class="mb-4 p-3 rounded hover:bg-gray-100 text-white hover:text-blue-800 cursor-pointer flex justify-between border-b-2 items-center space-x-3"
            @click="openApp(app)"
          >
            <img
              :src="app.icon"
              :alt="app.name"
              class="w-12 h-12 object-cover bg-white"
            />
            <div>
              <div class="font-semibold">
                {{ app.name }}
              </div>
              <!-- <div class="text-sm text-gray-600">{{ app.description }}</div> -->
            </div>
          </li>
        </ul>

        <div v-if="loading" class="text-center text-gray-500 mt-4">Loading...</div>
        <div v-if="error" class="text-center text-red-500 mt-4">{{ error }}</div>
      </main>
    </aside>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { IS_DEV, VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";
const isOpen = ref(false);
const apps = ref([]);
const loading = ref(false);
const error = ref("");

// Sample static data fallback with valid Flaticon image URLs
const sampleApps = [
  {
    id: 2,
    name: "Tancor Management System (TMS)",
    description: "Book rooms, manage bookings and payment",
    icon: "https://www.flaticon.com/free-icons/hotel", // hotel bell icon
    url: "https://hotel.example.com",
  },
  {
    id: 3,
    name: "Condo Corp Management System (CCMS)",
    description: "Manage condo units, payments, and maintenance requests",
    icon: "https://www.flaticon.com/free-icons/hotel", // hotel bell icon
    url: "https://condo.example.com",
  },
  {
    id: 4,
    name: "Tancor Inventory System (TIS)",
    description: "Track stock levels, suppliers, and order fulfillment",
    icon: "https://cdn-icons-png.flaticon.com/512/1995/1995526.png", // warehouse icon
    url: "https://inventory.example.com",
  },
  {
    id: 5,
    name: "Food Inventory System (FIS)",
    description: "Manage food stock, expiry dates, and supplier orders",
    icon: "https://cdn-icons-png.flaticon.com/512/3514/3514489.png", // burger icon
    url: "https://foodinventory.example.com",
  },
];

// Methods to open/close the SlideOver
const open = () => {
  isOpen.value = true;
  loadApps();
};

const close = () => {
  isOpen.value = false;
};

// Stub for axios fetch - replace with real API URL
const loadApps = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await axios.get(`${VUE_APP_API_URL}our-system-links/list`);
    apps.value = response.data.ourSystemLinks;

    // Use sample fallback for now:
  } catch (e) {
    error.value = "Failed to load apps directory.";
  } finally {
    loading.value = false;
  }
};

// Example function when clicking an app
const openApp = (app) => {
  window.open(app.url, "_blank");
};

// Expose methods so parent can call open/close
defineExpose({
  open,
  close,
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-over-enter-active {
  transition: transform 0.3s ease;
}
.slide-over-leave-active {
  transition: transform 0.2s ease;
}
.slide-over-enter-from {
  transform: translateX(100%);
}
.slide-over-leave-to {
  transform: translateX(100%);
}
</style>
