<template>
  <button
    @click.prevent="copyToClipboard"
    type="button"
    :class="buttonClass"
    title="Copy Text"
    class="flex items-center justify-center p-2 rounded-md"
  >
    <i class="fas fa-copy"></i>
  </button>

  <Toast 
    :key="textToCopy" 
    :message="toastMessage" 
    :type="toastType" 
    :duration="3000" 
    :position="'top-center'" 
  />
</template>

<script setup>
import { ref } from "vue";
import Toast from "./Toast.vue";

const toastMessage = ref("");
const toastType = ref("");

// Define props
const props = defineProps({
  textToCopy: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: "Copy",
  },
  buttonClass: {
    type: String,
    default: "bg-blue-500 text-white",
  },
});

// Fallback method to copy text using document.execCommand if Clipboard API is unavailable
const copyToClipboard = () => {
  if (!navigator.clipboard) {
    // Clipboard API not available, fallback using textarea
    const textArea = document.createElement('textarea');
    textArea.value = props.textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      toastMessage.value = "The information has been copied to clipboard.";
      toastType.value = "success";
    } else {
      toastMessage.value = "Failed to copy the information to clipboard.";
      toastType.value = "error";
    }

    return;
  }

  // Clipboard API method
  navigator.clipboard
    .writeText(props.textToCopy)
    .then(() => {
      toastMessage.value = "The information has been copied to clipboard.";
      toastType.value = "success";
    })
    .catch((err) => {
      console.error("Failed to copy text:", err);
      toastMessage.value = "Failed to copy the information to clipboard.";
      toastType.value = "error";
    });
};
</script>

<style scoped>
/* Additional styling if necessary */
</style>
