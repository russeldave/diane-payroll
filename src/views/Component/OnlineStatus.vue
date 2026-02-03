<template>
  
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Swal from "sweetalert2";

const isOnline = ref(navigator.onLine); // Track the online status

const checkOnlineStatus = () => {
  isOnline.value = navigator.onLine;

  Swal.fire({
    icon: isOnline.value ? "success" : "error",
    title: isOnline.value ? "System is Online" : "System is Offline",
    text: isOnline.value
      ? "The system is connected to the internet."
      : "The system is offline. Data will be cleared shortly.",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });

  // If offline, clear localStorage after a timeout
  if (!isOnline.value) {
    setTimeout(() => {
      const theme = localStorage.getItem('theme');
            
      // Clear everything in localStorage except for the theme
      localStorage.clear();
      if (theme) {
          localStorage.setItem('theme', theme); // Restore theme setting
      }

      // Clear session storage
      sessionStorage.clear();
      window.location.replace('/');
      console.warn("LocalStorage cleared because the system is offline.");
    }, 5000); // Customize timeout if needed
  }
  
};

// Add event listeners when the component mounts
onMounted(() => {
  window.addEventListener("online", checkOnlineStatus);
  window.addEventListener("offline", checkOnlineStatus);
});

// Clean up event listeners when the component unmounts
onBeforeUnmount(() => {
  window.removeEventListener("online", checkOnlineStatus);
  window.removeEventListener("offline", checkOnlineStatus);
});
</script>
