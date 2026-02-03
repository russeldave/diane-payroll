<template>
  <button
    @click.prevent="openSyncModal"
    type="button"
    class="ml-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded flex items-center"
    title="Sync with Zoho"
  >
    <i class="fas fa-sync-alt mr-1"></i>
    Sync
  </button>

  <!-- Edit Item Modal -->
  <Modal
    :show="isSyncModalOpen"
    :maxWidth="'lg'"
    title="Sync Supplier to Zoho"
    @close="closeModal"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="saveSupplier()" autocomplete="off">
        <!-- Action Buttons Header -->
        <div class="flex justify-between items-center mb-6 border-b pb-4">
          <h3 class="text-lg font-medium text-gray-900">Sync Supplier to Zoho</h3>
        </div>

        <!-- Zoho Supplier Search -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Search Zoho Suppliers
          </label>
          <div class="relative">
            <input 
              class="w-full border rounded-lg border-2 p-2 mb-2 pr-10"
              type="text"
              @input="handleSearchInput"
              @focus="showZohoDropdown = true"
              @blur="handleInputBlur"
              v-model="searchQuery"
              placeholder="Search for supplier in Zoho..."
              name="zohoSupplierSearch"
            />
            <!-- Search Loader -->
            <div 
              v-if="searchLoading" 
              class="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-lime-500"></div>
            </div>
          </div>
          
          <!-- Zoho Suppliers Dropdown -->
          <div 
            v-if="showZohoDropdown && zohoSuppliers.length > 0" 
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            style="width: calc(100% - 3rem);"
          >
            <div 
              v-for="supplier in zohoSuppliers" 
              :key="supplier.contact_id"
              @mousedown="selectZohoSupplier(supplier)"
              class="px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
            >
              <div class="font-medium">{{ supplier.contact_name }}</div>
              <div class="text-sm text-gray-500">
                Company: {{ supplier.company_name || 'N/A' }}
              </div>
              <div class="text-sm text-gray-500">
                Email: {{ supplier.email || 'N/A' }} | Phone: {{ supplier.phone || 'N/A' }}
              </div>
              <div class="text-xs text-blue-600 mt-1">
                Zoho ID: {{ supplier.contact_id }}
              </div>
            </div>
          </div>
          
          <!-- No Results Message -->
          <div 
            v-if="showZohoDropdown && !searchLoading && zohoSuppliers.length === 0 && searchQuery.length >= 2" 
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
            style="width: calc(100% - 3rem);"
          >
            <div class="text-center text-gray-500">
              No suppliers found for "{{ searchQuery }}"
            </div>
          </div>
          
          <!-- Searching Message -->
          <div 
            v-if="showZohoDropdown && searchLoading" 
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
            style="width: calc(100% - 3rem);"
          >
            <div class="text-center text-gray-500">
              Searching for "{{ searchQuery }}"...
            </div>
          </div>

          <!-- Selected Zoho Supplier Info -->
          <div v-if="selectedZohoSupplier" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium text-green-800">Selected Zoho Supplier:</h4>
                <p class="text-sm text-green-700">Company name: {{ selectedZohoSupplier.company_name }}</p>
                <p class="text-sm text-green-600">Contact name: {{ selectedZohoSupplier.contact_name }}</p>
                <p class="text-xs text-green-500">Zoho ID: {{ selectedZohoSupplier.contact_id }}</p>
              </div>
              <button
                type="button"
                @click="clearSelectedSupplier"
                class="text-red-500 hover:text-red-700"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Display current supplier info -->
        <!-- <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 class="font-medium text-blue-800 mb-2">Current Supplier to Sync:</h4>
          <p class="text-sm text-blue-700"><strong>Name:</strong> {{ suppliersForm.supplier_name }}</p>
          <p class="text-sm text-blue-700"><strong>Company:</strong> {{ suppliersForm.company_name }}</p>
          <p class="text-sm text-blue-700"><strong>ID:</strong> {{ currentSupplierId }}</p>
        </div> -->

        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
          <!-- Left Column -->
          <div>
            <div class="mb-4">
              <label for="supplier_name" class="block text-sm font-medium text-gray-700"
                >Contact Name *</label
              >
              <input
                type="text"
                id="supplier_name"
                required
                v-model="suppliersForm.contact_name"
                placeholder="Input Contact Name"
                class="mt-1 p-2 border rounded-md w-full"
                disabled
              />
            </div>

            <div class="mb-4">
              <label for="company_name" class="block text-sm font-medium text-gray-700"
                >Company Name</label
              >
              <input
                type="text"
                id="company_name"
                v-model="suppliersForm.company_name"
                placeholder="Input Company Name"
                class="mt-1 p-2 border rounded-md w-full"
                disabled
              />
            </div>

            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email</label
              >
              <input
                type="email"
                id="email"
                v-model="suppliersForm.email"
                placeholder="Input Email"
                class="mt-1 p-2 border rounded-md w-full"
                disabled
              />
            </div>

            <div class="mb-4">
              <label for="tin" class="block text-sm font-medium text-gray-700">TIN</label
              >
              <input
                type="text"
                id="tin"
                v-model="suppliersForm.tin"
                placeholder="Input TIN"
                class="mt-1 p-2 border rounded-md w-full"
                disabled
              />
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Address & Contact Details</h3>
            
            <div class="mb-4">
              <label for="address" class="block text-sm font-medium text-gray-700"
                >Street Address</label
              >
              <input
                type="text"
                id="address"
                v-model="suppliersForm.address"
                placeholder="Input Street Address"
                class="mt-1 p-2 border rounded-md w-full"
                disabled
              />
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700"
                  >City</label
                >
                <input
                  type="text"
                  id="city"
                  v-model="suppliersForm.city"
                  placeholder="City"
                  class="mt-1 p-2 border rounded-md w-full"
                  disabled
                />
              </div>
              <div>
                <label for="state" class="block text-sm font-medium text-gray-700"
                  >Municipality</label
                >
                <input
                  type="text"
                  id="state"
                  v-model="suppliersForm.state"
                  placeholder="State"
                  class="mt-1 p-2 border rounded-md w-full"
                  disabled
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label for="zip" class="block text-sm font-medium text-gray-700"
                  >ZIP Code</label
                >
                <input
                  type="text"
                  id="zip"
                  v-model="suppliersForm.zip"
                  placeholder="ZIP Code"
                  class="mt-1 p-2 border rounded-md w-full"
                  disabled
                />
              </div>
              <div>
                <label for="country" class="block text-sm font-medium text-gray-700"
                  >Country</label
                >
                <input
                  type="text"
                  id="country"
                  v-model="suppliersForm.country"
                  placeholder="Country"
                  class="mt-1 p-2 border rounded-md w-full"
                  disabled
                />
              </div>
            </div>

            <div class="mb-4">
              <label for="contact_info" class="block text-sm font-medium text-gray-700"
                >Phone Number</label
              >
              <input
                type="text"
                id="contact_info"
                v-model="suppliersForm.contact_info"
                placeholder="Input Contact Info"
                class="mt-1 p-2 border rounded-md w-full"
                disabled
              />
            </div>

            <div class="mb-4">
              <label for="zohovendor_id" class="block text-sm font-medium text-gray-700"
                >Zoho Vendor ID <small class="text-red-600 italic">(auto-filled when selecting from search)</small></label
              >
              <input
                type="text"
                id="zohovendor_id"
                v-model="suppliersForm.zohovendor_id"
                placeholder="Zoho Vendor ID"
                class="mt-1 p-2 border rounded-md w-full bg-gray-100"
                readonly
              />
            </div>
          </div>
        </div>

        <!-- Full width fields -->
        <div class="mb-4">
          <label for="remarks" class="block text-sm font-medium text-gray-700"
            >Notes / Remarks</label
          >
          <textarea
            id="remarks"
            v-model="suppliersForm.remarks"
            placeholder="Input additional notes or remarks"
            class="mt-1 p-2 border rounded-md w-full"
            rows="3"
            disabled
          ></textarea>
        </div>

        <!-- Contact Persons Section -->
        <div class="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Primary Contact Person</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700"
                >First Name</label
              >
              <input
                type="text"
                id="first_name"
                v-model="suppliersForm.first_name"
                placeholder="First Name"
                class="mt-1 p-2 border rounded-md w-full"
                disabled
              />
            </div>
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700"
                >Last Name</label
              >
              <input
                type="text"
                id="last_name"
                v-model="suppliersForm.last_name"
                placeholder="Last Name"
                class="mt-1 p-2 border rounded-md w-full"
                disabled
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end">
          <button
            type="button"
            @click="closeModal"
            class="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!suppliersForm.zohovendor_id"
            :class="suppliersForm.zohovendor_id ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'"
            class="text-white font-bold py-2 px-4 rounded"
          >
            Sync Supplier
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  handleApiError,
  useDebounce,
} from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id", "modal-closed", "zoho-vendor-synced"]);
const token = localStorage.getItem("token");
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const isSyncModalOpen = ref(false);
const currentSupplierId = ref(null);
const searchQuery = ref("");
const searchLoading = ref(false);
const showZohoDropdown = ref(false);
const zohoSuppliers = ref([]);
const selectedZohoSupplier = ref(null);

const suppliersForm = ref({
  supplier_id: 0,
  contact_name: "",
  supplier_name: "",
  company_name: "",
  email: "",
  website: "",
  tin: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  contact_info: "",
  payment_terms: 30,
  payment_terms_label: "Net 30",
  zohovendor_id: "",
  first_name: "",
  last_name: "",
  remarks: "",
  notes: "",
});

// Debounced search function
const searchZohoSuppliers = useDebounce(async (query) => {
  if (!query || query.length < 2) {
    zohoSuppliers.value = [];
    searchLoading.value = false;
    return;
  }

  try {
    searchLoading.value = true;
    const formData = FormDx({
      search: query
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}zoho-books/search-vendors`,
      formData,
      BearToken(token)
    );
    
    console.log("Zoho suppliers response:", response.data);
    
    // Assuming the API returns an array of suppliers
    zohoSuppliers.value = response.data.zohoItems;
    
  } catch (error) {
    console.error("Error fetching Zoho suppliers:", error);
    zohoSuppliers.value = [];
    // Don't show error alert for search functionality to avoid being intrusive
  } finally {
    searchLoading.value = false;
  }
}, 500);

const handleSearchInput = () => {
  if (searchQuery.value.length >= 2) {
    searchZohoSuppliers(searchQuery.value);
  } else {
    zohoSuppliers.value = [];
    searchLoading.value = false;
  }
};

const handleInputBlur = () => {
  // Delay hiding dropdown to allow for item selection
  setTimeout(() => {
    showZohoDropdown.value = false;
  }, 200);
};

const selectZohoSupplier = (supplier) => {
  selectedZohoSupplier.value = supplier;
  
  // Auto-populate the search field with the selected vendor's name
  searchQuery.value = supplier.contact_name || supplier.company_name || "";
  
  // Auto-fill the form with Zoho supplier data
  suppliersForm.value.zohovendor_id = supplier.contact_id;
  // suppliersForm.value.contact_name = supplier.contact_name || "";
  // suppliersForm.value.company_name = supplier.company_name || "";
  // suppliersForm.value.email = supplier.email || "";
  
  // Fill address information if available
  // if (supplier.billing_address) {
  //   suppliersForm.value.address = supplier.billing_address.street || "";
  //   suppliersForm.value.city = supplier.billing_address.city || "";
  //   suppliersForm.value.state = supplier.billing_address.state || "";
  //   suppliersForm.value.zip = supplier.billing_address.zip || "";
  //   suppliersForm.value.country = supplier.billing_address.country || "";
  // }
  
  // suppliersForm.value.contact_info = supplier.phone || "";
  
  // Hide dropdown after selection
  showZohoDropdown.value = false;
};

const clearSelectedSupplier = () => {
  selectedZohoSupplier.value = null;
  suppliersForm.value.zohovendor_id = "";
  searchQuery.value = ""; // Clear the search field when clearing selection
};

const openSyncModal = () => {
  if (!props.data) {
    Alert("error", "Error", "No supplier data provided");
    return;
  }
  
  // Reset search state
  searchQuery.value = "";
  zohoSuppliers.value = [];
  selectedZohoSupplier.value = null;
  showZohoDropdown.value = false;
  
  // Populate form with supplier data directly from props
  suppliersForm.value = {
    supplier_id: props.data.id || 0,
    contact_name: props.data.contactPerson || "",
    supplier_name: props.data.supplier_name || "",
    company_name: props.data.name || "",
    email: props.data.email || "",
    website: props.data.website || "",
    tin: props.data.tin || "",
    address: props.data.street || "",
    city: props.data.city || "",
    state: props.data.municipality || props.data.state || "",
    zip: props.data.zip || "",
    country: props.data.country || "",
    contact_info: props.data.contactInfo || "",
    payment_terms: props.data.payment_terms || 30,
    payment_terms_label: props.data.payment_terms_label || "Net 30",
    zohovendor_id: props.data.zohoVendorId || "",
    first_name: props.data.firstName || "",
    last_name: props.data.lastName || "",
    remarks: props.data.remarks || "",
    notes: props.data.notes || "",
  };

  currentSupplierId.value = props.data.id;
  isSyncModalOpen.value = true;
};

const closeModal = () => {
  isSyncModalOpen.value = false;
  nextTick(() => {
    currentSupplierId.value = null;
    resetForm();
    emits('modal-closed');
  });
};

const resetForm = () => {
  suppliersForm.value = {
    contact_name: "",
    supplier_name: "",
    company_name: "",
    email: "",
    website: "",
    tin: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    contact_info: "",
    payment_terms: 30,
    payment_terms_label: "Net 30",
    zohovendor_id: "",
    first_name: "",
    last_name: "",
    remarks: "",
    notes: "",
  };
  searchQuery.value = "";
  zohoSuppliers.value = [];
  selectedZohoSupplier.value = null;
};

const saveSupplier = async () => {
  if (!suppliersForm.value.zohovendor_id) {
    Alert("error", "Error", "Please select a Zoho supplier first");
    return;
  }

  if (!currentSupplierId.value) {
    Alert("error", "Error", "No supplier ID found");
    return;
  }

  try {
    // Show processing state
    Swal.fire({
      title: "Syncing Supplier...",
      text: "Please wait while we sync the supplier with Zoho.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Create minimal payload with only supplier ID and Zoho vendor ID
    const formData = {
      id: currentSupplierId.value, // Local supplier ID
      zoho_vendor_id: suppliersForm.value.zohovendor_id // Zoho vendor ID
    };

    console.log("Sync payload:", formData);

    const response = await axios.post(
      `${VUE_APP_API_URL}suppliers/sync-supplier`, // Changed endpoint to sync-zoho
      FormDx(formData),
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isSyncModalOpen.value = false;
    Alert("success", "Success", response.data.message ?? "Supplier synced successfully with Zoho!");

    emits("zoho-vendor-synced", {
      zohoVendorId: suppliersForm.value.zohovendor_id,
      zohoVendorName: selectedZohoSupplier.value?.contact_name || selectedZohoSupplier.value?.company_name || suppliersForm.value.company_name,
      supplierId: currentSupplierId.value
    });
    
    emits("transaction_id", Math.random());
    // Reset form after successful submission
    resetForm();
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

// Initialize with the provided data
onMounted(() => {
  if (props.data) {
    console.log("Supplier data received:", props.data);
  }
});
</script>