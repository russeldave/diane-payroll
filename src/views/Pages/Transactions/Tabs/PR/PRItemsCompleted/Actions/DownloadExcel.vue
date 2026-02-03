<template>
  <button
    @click="downloadExcel"
    :disabled="isProcessing"
    title="Download PR Releasing Report Here!"
    class="bg-purple-500 ml-2 text-white hover:opacity-70 focus:bg-purple-300 font-bold text-sm md:text-md py-2 rounded px-4 float-end text-nowrap"
    
  >
  <!-- v-if="hasData" -->
    <i class="fas fa-download"></i> Download
    <span v-if="isProcessing" class="ml-2 text-xs">Processing...</span>
  </button>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { VUE_APP_API_URL, } from "@/views/Utility/Global";
import { BearToken, FormDx } from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const isProcessing = ref(false);
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});

// Reactive reference for mrf data with proofThumbNail unset
const pr = ref({
  completed: []
});

// Computed property to check if data is available
const hasData = computed(() => Array.isArray(pr.value.completed) && pr.value.completed.length > 0);

// Watch for changes in props.data and update mrf.completed, unsetting proofThumbNail
watch(() => props.data, (newData) => {
  if (Array.isArray(newData)) {
    pr.value.completed = newData.map(item => {
      const { proofThumbNail, thumbNail,...rest } = item; // Destructure to exclude proofThumbNail
      return rest;
    });
  } else {
    pr.value.completed = [];
  }
}, { immediate: true });

const downloadExcel = async () => {
    console.log('downloadExcel');
  console.log(props);
  // if (isProcessing.value || !hasData.value) return; // Avoid double clicks or download with no data
  // isProcessing.value = true;

  try {
    // const formData = FormDx(pr.value);
    const response = await axios.get(`${VUE_APP_API_URL}ingredient-reports-auth/download-excel-pr-receiving/${props.data.type}/${props.data.date}`, {
      ...BearToken(token),
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const dateNow = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replace(/[,\/: ]/g, '_');
    const fileName = `mrf_releasing_${dateNow}.xlsx`;

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Download error:", err);
    Swal.fire("Download Failed", "There was a problem downloading the report.", "error");
  } finally {
    isProcessing.value = false;
  }
};
</script>