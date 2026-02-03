<template>
  <button
    @click.prevent="openEditModal"
    type="button"
    class="bg-yellow-500 text-white hover:opacity-70 focus:bg-yellow-300 rounded-l font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap"
  >
    <i class="fas fa-edit"></i>
    Edit
  </button>

  <!-- Edit Item Modal -->
  <Modal
    :show="isEditModalOpen"
    :maxWidth="'lg'"
    title="Edit Supplier"
    @close="closeModal"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="saveSupplier()" autocomplete="off">

         <!-- Zoho Supplier Search -->
         <div class="mb-6 border p-2 border-4 border-gray-500 rounded-md">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Search To Zoho Books:
            <span class="text-red-500 font-bold text-md">({{ suppliersForm.zohovendor_id }})</span>
          </label>
          <div class="relative">
            <input 
              class="w-full border rounded-lg border-2 p-2 mb-2 pr-10"
              type="text"
              @input="handleSearchInput"
              @focus="showZohoDropdown = true"
              @blur="handleInputBlur"
              v-model="searchQuery"
              placeholder="Search for supplier to Zoho..."
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
                <p class="text-sm text-green-700">{{ selectedZohoSupplier.contact_name }}</p>
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

        <!-- Action Buttons Header -->
        <!-- <div class="flex justify-between items-center mb-6 border-b pb-4">
          <h3 class="text-lg font-medium text-gray-900">Basic Information</h3>
          <button
            type="button"
            @click="addToZohoBooks"
            class="bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 flex items-center space-x-2 transition-colors duration-200"
          >
            <i class="fas fa-plus-circle"></i>
            <span>Add to Zoho Books</span>
          </button>
        </div> -->

        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
          <!-- Left Column -->
          <div>

            <div class="mb-4">
              <label for="company_name" class="block text-sm font-medium text-gray-700"
                >Supplier Name</label
              >
              <input
                type="text"
                id="company_name"
                v-model="suppliersForm.company_name"
                placeholder="Input Company Name"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>

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
              />
            </div>

            <div class="mb-4">
              <label for="tin" class="block text-sm font-medium text-gray-700">TIN</label>
              <input
                type="text"
                id="tin"
                v-model="suppliersForm.tin"
                placeholder="Input TIN"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
          </div>
      </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Address & Contact Details</h3>
          
          <div class="mb-4">
            <label for="address" class="block text-sm font-medium text-gray-700"
              >Complete Address</label
            >
            <textarea
              id="address"
              v-model="suppliersForm.address"
              placeholder="Input complete address (street, city, municipality, zip code, country)"
              class="mt-1 p-2 border rounded-md w-full"
              rows="4"
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="phone" class="block text-sm font-medium text-gray-700"
              >Phone Number</label
            >
            <input
              type="text"
              id="phone"
              v-model="suppliersForm.phone"
              placeholder="Phone Number"
              class="mt-1 p-2 border rounded-md w-full"
            />
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
          ></textarea>
        </div>

        <div class="mb-4">
          <label for="terms" class="block text-sm font-medium text-gray-700"
            >Terms</label
          >
          <textarea
            id="terms"
            v-model="suppliersForm.terms"
            placeholder="Input Terms and Condition"
            class="mt-1 p-2 border rounded-md w-full"
            rows="2"
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
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Update
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
import SyncSupplier from "@/views/Pages/Transactions/Tabs/PR/PRItemsReceiving/Actions/SyncSupplier.vue";

const emits = defineEmits(["transaction_id", "modal-closed"]);
const token = localStorage.getItem("token");
const searchLoading = ref(false);
const zohoSuppliers = ref([]);
const searchQuery = ref("");
const selectedZohoSupplier = ref(null);
const showZohoDropdown = ref(false);
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const isEditModalOpen = ref(false);
const currentSupplierId = ref(null);

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
  terms:""
});

const openEditModal = () => {
  if (!props.data) {
    Alert("error", "Error", "No supplier data provided");
    return;
  }
  
  // Populate form with supplier data directly from props
  suppliersForm.value = {
    supplier_id: props.data.id || 0,
    contact_name: props.data.contactPerson || "",
    supplier_name: props.data.supplier_name || "",
    company_name: props.data.name || "",
    email: props.data.email || "",
    website: props.data.website || "",
    tin: props.data.tin || "",
    address: props.data.address || "",
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
  isEditModalOpen.value = true;
};

const closeModal = () => {
  isEditModalOpen.value = false;
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
  selectedZohoSupplier.value = null;
  searchQuery.value = "";
  zohoSuppliers.value = [];
  showZohoDropdown.value = false;
};

const saveSupplier = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Updating...",
      text: "Please wait while we update the supplier.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Map the form data
    const formData = {
      ...suppliersForm.value,
      notes: suppliersForm.value.remarks || suppliersForm.value.notes,
      contact_name: suppliersForm.value.contact_name || suppliersForm.value.supplier_name,
    };

    // Add the supplier ID to the form data
    if (currentSupplierId.value) {
      formData.id = currentSupplierId.value;
    }

    const response = await axios.post(
      `${VUE_APP_API_URL}suppliers/edit`,
      FormDx(formData),
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isEditModalOpen.value = false;
    Alert("success", "Success", response.data.message ?? "Supplier updated successfully!");
    emits("transaction_id", Math.random());
    
    // Reset form after successful submission
    resetForm();
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

const handleZohoVendorSynced = (syncData) => {
  console.log("Zoho vendor synced:", syncData);
  suppliersForm.value.zohovendor_id = syncData.zohoVendorId;
};

const addToZohoBooks = async () => {
  try {
    // Validate required fields for Zoho
    if (!suppliersForm.value.company_name && !suppliersForm.value.contact_name) {
      Alert("error", "Validation Error", "Company Name or Contact Name is required to add to Zoho Books");
      return;
    }

    // Show processing state
    Swal.fire({
      title: "Adding to Zoho Books...",
      text: "Please wait while we add the supplier to Zoho Books.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Prepare data for Zoho Books
    const zohoData = {
      supplier_id: currentSupplierId.value || 0,
      contact_name: suppliersForm.value.contact_name,
      supplier_name: suppliersForm.value.supplier_name,
      company_name: suppliersForm.value.company_name,
      email: suppliersForm.value.email,
      website: suppliersForm.value.website,
      tin: suppliersForm.value.tin,
      address: suppliersForm.value.address,
      city: suppliersForm.value.city,
      state: suppliersForm.value.state,
      zip: suppliersForm.value.zip,
      country: suppliersForm.value.country,
      contact_info: suppliersForm.value.contact_info,
      first_name: suppliersForm.value.first_name,
      last_name: suppliersForm.value.last_name,
      remarks: suppliersForm.value.remarks,
      notes: suppliersForm.value.notes,
    };

    // Call the Zoho Books API endpoint
    const response = await axios.post(
      `${VUE_APP_API_URL}suppliers/add-to-zoho`, // Assuming the route is 'suppliers/add'
      FormDx(zohoData),
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    if (response.data.error) {
      Alert("error", "Zoho Books Error", response.data.message || "Failed to add supplier to Zoho Books");
      return;
    }

    isEditModalOpen.value = false;
    Alert("success", "Success", "Supplier added to Zoho Books successfully!");
    emits("transaction_id", Math.random());
    
    // Reset form after successful submission
    resetForm();

  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error, "Failed to add supplier to Zoho Books");
  }
};

// Initialize with the provided data
onMounted(() => {
  if (props.data) {
    console.log("Supplier data received:", props.data);
  }
});

const handleSearchInput = () => {
  if (searchQuery.value.length >= 2) {
    searchZohoSuppliers(searchQuery.value);
  } else {
    zohoSuppliers.value = [];
    searchLoading.value = false;
  }
};

const selectZohoSupplier = (supplier) => {
  selectedZohoSupplier.value = supplier;
  console.log(selectedZohoSupplier);
  
  // Populate form fields with Zoho supplier data
  suppliersForm.value = {
    ...suppliersForm.value,
    company_name: supplier.company_name || supplier.vendor_name || "",
    contact_name: supplier.contact_name || "",
    email: supplier.email || "",
    phone: supplier.phone || supplier.mobile,
    mobile: supplier.mobile || "",
    website: supplier.website || "",
    // address: this.extractAddress(supplier), // We'll create this helper function
    first_name: supplier.first_name,
    last_name: supplier.last_name,
    zohovendor_id: supplier.contact_id,
    terms: supplier.payment_terms_label
    // Add more mappings as needed
  };
  
  // Hide dropdown
  showZohoDropdown.value = false;
  searchQuery.value = "";
  zohoSuppliers.value = [];
};

// Add this helper function to extract address from Zoho supplier
const extractAddress = (supplier) => {
  // Zoho API might return address in different fields
  // You might need to adjust this based on your actual Zoho response structure
  if (supplier.billing_address) {
    return supplier.billing_address.street || supplier.billing_address.address || "";
  }
  return "";
};

const handleInputBlur = () => {
  // Use setTimeout to allow click event to fire first
  setTimeout(() => {
    showZohoDropdown.value = false;
  }, 200);
};

const clearSelectedSupplier = () => {
  selectedZohoSupplier.value = null;
  suppliersForm.value.zohovendor_id = "";
};
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
</script>