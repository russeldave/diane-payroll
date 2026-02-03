<template>
  <div class="flex flex-col min-h-screen relative">
    <!-- Overlay: Applying Changes -->
    <transition name="fade">
      <div
        v-if="isApplyingChanges"
        class="absolute inset-0 bg-blue-800 bg-opacity-60 flex items-center justify-center z-50 text-white text-lg font-bold"
        aria-live="polite"
      >
        Applying changes...
      </div>
    </transition>

    <!-- Top Navigation -->
    <div class="block">
      <Sidebar
        v-if="isMobile && hasToken"
        :is-open="isDrawerOpen"
        @openDrawer="handleDrawer"
        @warehouseChanged="handleWarehouseChange"
      />

      <!-- Top Navigation (Desktop) -->
      <TopNav
        v-if="!isMobile && hasToken"
        @toggleSidebar="handleDrawer(true)"
        @warehouseChanged="handleWarehouseChange"
        @navShowingChanged="handleNavShowingChanged"
      />
    </div>

    <!-- Page Content -->
    <main class="flex-1 transition-all duration-300 pt-16 lg:pt-32">
      <RouterView :key="routerKey" />
      {{ isNavShowing }} {{ paddingTop }}
    </main>
  </div>
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { IS_DEV, VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";

import Sidebar from "@/views/Navigation/Sidebar.vue";
import TopNav from "@/views/Navigation/TopNav.vue";

const route = useRoute();

// Token check
const hasToken = !!localStorage.getItem("token");

// Reactive states
const isDrawerOpen = ref(false);
const isMobile = ref(window.innerWidth < 1285);
const keyChar = ref(false);
const routerKey = ref(0);
const isApplyingChanges = ref(false);
const isNavShowing = ref(localStorage.getItem("primaryNavHidden") !== "true");
const paddingTop = ref(isMobile.value ? "30px" : isNavShowing.value ? "100px" : "80px"); // Initialize padding

// Screen resize
const handleResize = () => {
  isMobile.value = window.innerWidth < 1285;
  // Update padding on resize to ensure mobile/desktop consistency
  paddingTop.value = isMobile.value ? "30px" : isNavShowing.value ? "60px" : "80px";
};

// Key press display
const handleKeyPress = (event) => {
  keyChar.value = event.key;
  setTimeout(() => {
    keyChar.value = false;
  }, 3000);
};

// Is login route
const isLoginRoute = computed(() => {
  return route.name === "login" || route.path === "/";
});

// Drawer control
const handleDrawer = (open) => {
  isDrawerOpen.value = open;
};

// Handle navShowingChanged event
const handleNavShowingChanged = (isShowing) => {
  isNavShowing.value = isShowing;
  paddingTop.value = isMobile.value ? "30px" : isShowing ? "60px" : "20px"; // Update padding
};

// Warehouse change logic
const handleWarehouseChange = () => {
  isApplyingChanges.value = true;
  routerKey.value++;
  setTimeout(() => {
    isApplyingChanges.value = false;
  }, 1000);
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener("resize", handleResize);
  window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("keydown", handleKeyPress);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
