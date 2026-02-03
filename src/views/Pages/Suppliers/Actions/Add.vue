<template>
  <button
    @click.prevent="addBehavior()"
    type="button"
    :class="[
      'bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-plus"></i>
    Add Suppliers
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'lg'"
    title="New Supplier"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addSupplier()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
          <!-- Left Column -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <label class="inline-flex items-center float-end cursor-pointer">
              <input type="checkbox" v-model="addToZoho" class="sr-only peer">
              <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              <span class="ms-3 text-sm font-medium">Link to zoho</span>
            </label>
            <br>
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
              <label for="company_name" class="block text-sm font-medium text-gray-700"
                >Company Name</label
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

            <!-- <div class="mb-4">
              <label for="website" class="block text-sm font-medium text-gray-700"
                >Website</label
              >
              <input
                type="url"
                id="website"
                v-model="suppliersForm.website"
                placeholder="https://example.com"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div> -->

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
              />
            </div>

            <!-- <div class="mb-4">
              <label for="payment_terms" class="block text-sm font-medium text-gray-700"
                >Payment Terms (Days)</label
              >
              <input
                type="number"
                id="payment_terms"
                v-model="suppliersForm.payment_terms"
                placeholder="30"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div> -->

            <div class="mb-4">
              <label for="zohovendor_id" class="block text-sm font-medium text-gray-700"
                >Zoho Vendor ID <small class="text-red-600 italic">(optional)</small></label
              >
              <input
                type="text"
                id="zohovendor_id"
                v-model="suppliersForm.zohovendor_id"
                placeholder="Zoho Vendor ID"
                class="mt-1 p-2 border rounded-md w-full"
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
            @click="isAddModalOpen = false"
            class="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { VUE_APP_API_URL, UNITS } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";
const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
});
const isAddModalOpen = ref(false);
const units = ref([]);
const addToZoho = ref(false); 
const imageFiles = ref([]);
const suppliersForm = ref({
  // Basic Information
  contact_name: "", // Required field for Zoho
  supplier_name: "", // Keep original field for your system
  company_name: "",
  email: "",
  website: "",
  tin: "",
  
  // Address Information
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  
  // Contact & Payment
  contact_info: "",
  payment_terms: 30,
  payment_terms_label: "Net 30",
  zohovendor_id: "",
  
  // Contact Person
  first_name: "",
  last_name: "",
  
  // Notes
  remarks: "",
  notes: "", // Zoho field
});

const addBehavior = () => {
  resetForm();
  isAddModalOpen.value = true;
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
  addToZoho.value = false;
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const unitsDropdown = async () => {
  units.value = await UNITS();
};

const addSupplier = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we create the supplier.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Map the form data to match both your system and Zoho requirements
    const formData = {
      ...suppliersForm.value,
      // Ensure both notes fields are populated
      notes: suppliersForm.value.remarks || suppliersForm.value.notes,
      // Map supplier_name to contact_name if contact_name is empty
      contact_name: suppliersForm.value.contact_name || suppliersForm.value.supplier_name,
      add_to_zoho: addToZoho.value,
    };

    const response = await axios.post(
      `${VUE_APP_API_URL}suppliers/add`,
      FormDx(formData),
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};
</script>