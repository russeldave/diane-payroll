<template>
  <button
    @click="generateBarcode"
    class=" bg-blue-500 hover:bg-blue-700 text-white font-bold rounded text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
    title="Generate Barcode"
    :disabled="loading"
  >
    <i v-if="loading" class="fa-solid fa-circle-notch animate-spin mr-2"></i>
    <i v-else class="fa-solid fa-gears mr-2"></i>
    <span>Generate Barcode</span>
  </button>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { BearToken, handleApiError } from "@/views/Utility/Helper";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["transaction_id"]);

const loading = ref(false);
const token = localStorage.getItem("token");

const generateBarcode = async () => {
  try {
    // Show confirmation dialog
    const confirmation = await Swal.fire({
      title: 'Generate New Barcode?',
      text: 'This will create a new barcode and invalidate any existing one.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, generate it!',
      cancelButtonText: 'Cancel'
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    loading.value = true;

    // Prepare the data
    const barcodeData = {
      employee_id: props.data.id,
      employee_number: props.data.employeeNumber,
    };

    // Send request to backend
    const response = await axios.post(
      `${VUE_APP_API_URL}employees/generate-barcode`,
      barcodeData,
      BearToken(token)
    );

    if (response.data.error) {
      // Handle backend error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data.message || 'Failed to generate barcode',
      });
      return;
    }

    // Show success message with barcode details
    Swal.fire({
      icon: "success",
      title: "Barcode Generated!",
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Barcode Token:</strong></p>
          <div class="bg-gray-100 p-3 rounded mb-3">
            <code class="text-lg font-mono">${response.data.barcode_token}</code>
          </div>
          <p class="mb-1"><strong>Expires:</strong> ${new Date(response.data.expires_at).toLocaleString()}</p>
          <p class="mt-2 text-sm text-gray-600">This barcode will expire in 24 hours.</p>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "Copy Barcode",
      cancelButtonText: "Close",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      preConfirm: () => {
        // Copy barcode to clipboard
        navigator.clipboard.writeText(response.data.barcode_token).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Copied!',
            text: 'Barcode copied to clipboard',
            timer: 1500,
            showConfirmButton: false
          });
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      }
    });
    
    // Emit event to refresh employee data if needed
    emit("transaction_id", Math.random());
    
  } catch (error) {
    console.error("Error generating barcode:", error);
    
    if (error.response) {
      // Handle HTTP error responses
      switch (error.response.status) {
        case 404:
          Swal.fire({
            icon: 'error',
            title: 'Employee Not Found',
            text: 'The employee record could not be found.',
          });
          break;
        case 400:
          // This should no longer happen with the updated backend
          // but keep it for compatibility
          Swal.fire({
            icon: "info",
            title: "Barcode Information",
            html: `
              <div class="text-left">
                <p>${error.response.data.message || 'A barcode already exists'}</p>
                ${error.response.data.barcode_token ? 
                  `<p class="mt-2"><strong>Current Barcode:</strong> ${error.response.data.barcode_token}</p>` : ''}
                ${error.response.data.expires_at ? 
                  `<p><strong>Expires:</strong> ${new Date(error.response.data.expires_at).toLocaleString()}</p>` : ''}
              </div>
            `,
            confirmButtonText: "OK",
          });
          break;
        case 500:
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'An internal server error occurred. Please try again later.',
          });
          break;
        default:
          handleApiError(error);
      }
    } else {
      // Handle network or other errors
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Unable to connect to the server. Please check your connection.',
      });
    }
  } finally {
    loading.value = false;
  }
};
</script>