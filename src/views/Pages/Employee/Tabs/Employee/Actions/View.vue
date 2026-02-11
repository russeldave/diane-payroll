<template>
  <button
    @click.prevent="viewEmployeeBehavior()"
    class="bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 rounded-l mb-4 float-end"
  >
    <i class="fa fa-eye"></i> View
  </button>
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'4xl'"
    title="View Employee Information"
    @close="isViewModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-2 p-4">
      <form class="mt-4" @submit.prevent="editEmployee()">
        <div class="mb-4">
          <label for="EmployeeID" class="block text-sm font-medium text-gray-700"
            >Employee ID</label
          >
          <input
            type="text"
            v-model="form.employee_no"
            placeholder="Input Employee ID"
            required
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="mb-4">
            <label for="LastName" class="block text-sm font-medium text-gray-700"
              >Last Name</label
            >
            <input
              type="text"
              v-model="form.last_name"
              placeholder="Input Last Name"
              required
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label for="FirstName" class="block text-sm font-medium text-gray-700"
              >First Name</label
            >
            <input
              type="text"
              v-model="form.first_name"
              placeholder="Input First Name"
              required
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label for="MiddleName" class="block text-sm font-medium text-gray-700"
              >Middle Name</label
            >
            <input
              type="text"
              v-model="form.middle_name"
              placeholder="Input Middle Name"
              required
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
        </div>
        <div class="mb-4">
          <label for="ContactNo" class="block text-sm font-medium text-gray-700"
            >Position</label
          >
          <input
            type="text"
            v-model="form.position_name"
            required
            placeholder="Input Contact No."
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Supervisor</label
          >
          <select
            v-model="form.user_id"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          >
            <option value="0">None</option>
            <option v-for="(user, uu) in users" :value="user.value" :key="uu">
              {{ user.label }}
            </option>
          </select>
        </div>
        <div class="mb-4 md:col-span-2">
          <label for="Address" class="block text-sm font-medium text-gray-700"
            >Address</label
          >
          <textarea
            placeholder="Input Address"
            v-model="form.address"
            required
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          >
          </textarea>
        </div>
        <div class="mb-4">
          <label for="ContactNo" class="block text-sm font-medium text-gray-700"
            >Contact No.</label
          >
          <input
            type="text"
            v-model="form.contact_info"
            required
            placeholder="Input Contact No."
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>

        <!-- Barcode Section -->
        <div v-if="isViewModalOpen" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Employee Barcode
          </label>
          <div class="bg-white p-6 border-2 border-gray-200 rounded-lg shadow-sm">
            <!-- Barcode Display Container -->
            <div class="flex flex-col items-center justify-center">
              <!-- Clearer Barcode SVG -->
              <div
                class="barcode-container mb-4 p-4 bg-white border rounded-lg w-full max-w-md"
              >
                <svg
                  :id="'barcode-svg-' + props.data.id"
                  class="w-full h-28"
                  ref="barcodeSvg"
                ></svg>
                <div class="bg-rose-200 text-center font-bold rounded">
                  {{ form.first_name }} {{ form.last_name }}
                </div>
              </div>

              <div class="block mt-4 border-4 border-orange-200 rounded-lg">
                <Qr
                  :qrcodeValue="props.data.barCodeToken"
                  :addNewClassName="'w-60 h-60 md:w-80 md:h-80'"
                />
                <div class="bg-rose-200 text-center font-bold">
                  {{ form.first_name }} {{ form.last_name }}
                </div>
              </div>

              <!-- Barcode Details -->
              <div v-if="props.data.barCodeToken" class="text-center w-full max-w-md">
                <div class="bg-gray-50 p-3 rounded mb-3">
                  <p class="text-xs text-gray-500 mb-1">Barcode Token</p>
                  <p
                    class="text-sm font-mono text-gray-800 break-all p-2 bg-white rounded border"
                  >
                    {{ props.data.barCodeToken }}
                  </p>
                </div>

                <!-- <div class="grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div class="text-left">
                    <p class="font-medium">Format:</p>
                    <p>CODE128</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium">Type:</p>
                    <p>Employee ID</p>
                  </div>
                </div> -->

                <!-- Action Buttons -->
                <!-- <div class="flex justify-center gap-3 mt-4">
                  <button
                    @click="copyBarcode"
                    class="px-4 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded text-sm font-medium flex items-center gap-2"
                  >
                    <i class="fas fa-copy"></i> Copy Token
                  </button>
                  <button
                    @click="refreshBarcode"
                    class="px-4 py-2 bg-green-100 text-green-600 hover:bg-green-200 rounded text-sm font-medium flex items-center gap-2"
                    :disabled="refreshingBarcode"
                  >
                    <i :class="refreshingBarcode ? 'fas fa-spinner fa-spin' : 'fas fa-redo'"></i> 
                    {{ refreshingBarcode ? 'Refreshing...' : 'Refresh' }}
                  </button>
                </div> -->
              </div>

              <div v-else class="text-center py-6 text-gray-400">
                <i class="fas fa-barcode text-3xl mb-2"></i>
                <p>No barcode generated</p>
                <p class="text-sm mt-1">
                  Generate a barcode in the employee edit section
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-4 md:col-span-2">
          <label for="Remarks" class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            placeholder="Input Remarks"
            v-model="form.remarks"
            required
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          >
          </textarea>
        </div>
        <!-- <div class="block float-end">
          <button
            type="submit"
            class="bg-yellow-500 text-white font-bold py-2 px-4 rounded"
          >
            Update
          </button>
        </div> -->
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  handleApiError,
  barcodeConverter2,
  Alert,
} from "@/views/Utility/Helper";
import Qr from "@/views/Component/QRCode.vue";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const token = localStorage.getItem("token");
const users = ref([]);
const isViewModalOpen = ref(false);
const barcodeSvg = ref(null);
const barcodeGenerated = ref(false);
const refreshingBarcode = ref(false);
const form = ref({
  employee_id: 0,
  employee_no: "",
  first_name: "",
  last_name: "",
  middle_name: "",
  address: "",
  remarks: "",
  contact_info: "",
  user_id: 0,
});

// Watch for modal open/close
watch(isViewModalOpen, async (isOpen) => {
  if (isOpen && props.data.barCodeToken && !barcodeGenerated.value) {
    // Wait for modal to be fully rendered
    await nextTick();

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      generateBarcodeWithRetry();
    }, 300);
  } else if (!isOpen) {
    barcodeGenerated.value = false;
  }
});

// Watch for data changes
watch(
  () => props.data.barCodeToken,
  (newToken) => {
    if (newToken && isViewModalOpen.value && !barcodeGenerated.value) {
      setTimeout(() => {
        generateBarcodeWithRetry();
      }, 300);
    }
  }
);

const viewEmployeeBehavior = async () => {
  isViewModalOpen.value = true;
  viewForm();
  getUsersDropdown();
  barcodeGenerated.value = false;
};

const viewForm = () => {
  const data = props.data;
  form.value = {
    employee_id: data.id,
    first_name: data.firstName,
    last_name: data.lastName,
    middle_name: data.middleName,
    address: data.address,
    remarks: data.remarks,
    contact_info: data.contactInfo,
    employee_no: data.employeeNumber,
    position_name: data.employeePositionName,
    user_id: data.userId ?? 0,
  };
};

const generateBarcodeWithRetry = async (retryCount = 0) => {
  if (!props.data.barCodeToken) {
    console.log("No barcode token to generate");
    return;
  }

  // Max 3 retries
  if (retryCount > 3) {
    console.error("Max retries reached for barcode generation");
    Alert("error", "Barcode Error", "Failed to generate barcode. Please try again.");
    return;
  }

  const barcodeId = `barcode-svg-${props.data.id}`;
  const textToEncode = props.data.barCodeToken;

  try {
    console.log(`Generating barcode (attempt ${retryCount + 1}) for ID: ${barcodeId}`);

    // Wait for Vue to update DOM
    await nextTick();

    // Check if element exists
    const element = document.getElementById(barcodeId);

    if (!element) {
      console.log(`Element #${barcodeId} not found, retrying...`);
      setTimeout(() => {
        generateBarcodeWithRetry(retryCount + 1);
      }, 200 * (retryCount + 1));
      return;
    }

    // Clear any existing content
    element.innerHTML = "";

    // Generate clearer barcode with optimized settings
    const success = await barcodeConverter2(`#${barcodeId}`, textToEncode, {
      format: "CODE128",
      displayValue: true, // Show the text below barcode
      fontSize: 14,
      fontOptions: "bold",
      textAlign: "center",
      textPosition: "bottom",
      textMargin: 6,
      lineColor: "#000000",
      background: "#ffffff",
      width: 3, // Wider lines for better scanning
      height: 120, // Taller barcode
      margin: 20, // More margin around barcode
      marginTop: 10,
      marginBottom: 15,
      marginLeft: 10,
      marginRight: 10,
      flat: true, // Creates barcode with clearer lines
    });

    if (success) {
      barcodeGenerated.value = true;
      console.log("Barcode generated successfully");

      // Apply additional styling for clarity
      setTimeout(() => {
        const svg = document.getElementById(barcodeId);
        if (svg) {
          // Ensure good contrast
          svg.style.filter = "contrast(1.2)";
          svg.style.border = "none";
        }
      }, 100);
    } else {
      console.error("barcodeConverter returned false");
      if (retryCount < 2) {
        setTimeout(() => {
          generateBarcodeWithRetry(retryCount + 1);
        }, 500);
      }
    }
  } catch (error) {
    console.error("Error generating barcode:", error);

    if (retryCount < 2) {
      setTimeout(() => {
        generateBarcodeWithRetry(retryCount + 1);
      }, 500);
    }
  }
};

const copyBarcode = () => {
  if (!props.data.barCodeToken) return;

  navigator.clipboard
    .writeText(props.data.barCodeToken)
    .then(() => {
      Alert("success", "Copied!", "Barcode token copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      Alert("error", "Copy Failed", "Could not copy to clipboard");
    });
};

const refreshBarcode = async () => {
  if (!props.data.barCodeToken) return;

  refreshingBarcode.value = true;
  barcodeGenerated.value = false;

  try {
    await generateBarcodeWithRetry();
  } finally {
    refreshingBarcode.value = false;
  }
};

const getUsersDropdown = async () => {
  try {
    const formData = FormDx({ id: 0 });
    users.value = [];
    const response = await axios.post(
      VUE_APP_API_URL + "/users/dropdown",
      formData,
      BearToken(token)
    );
    users.value = response.data.users;
  } catch (error) {
    handleApiError(error);
  }
};
</script>

<style scoped>
.barcode-container {
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.barcode-container svg {
  filter: contrast(1.1) brightness(1.05);
}

/* Ensure good print quality */
@media print {
  .barcode-container {
    background: white !important;
    border: 1px solid #000 !important;
  }

  .barcode-container svg {
    filter: none !important;
  }
}
</style>
