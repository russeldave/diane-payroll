<template>
  <div>
    <!-- Button to open the modal -->
     <u
    class="font-bold hover:text-blue-500 uppercase text-nowrap"
    :title="is_fixed === 1 ? 'Fixed Asset/Movable' : 'Consumable Item'"
    @click="openEditModal"
  >
    <!-- Item Name -->
    <p>
      {{ itemMainName }}
      <!-- Optional: Show pack info -->
    <span v-if="itemPack" class="italic text-red-500">[{{ itemPack }}]</span>      
    </p>

      <!-- <sup :class="is_fixed == 1 ? 'text-red-500' : 'text-blue-500'" v-if="item_name">{{  is_fixed == 1 ? 'F' : is_fixed == 0 ? 'C' : '' }}</sup> -->
      <!-- <sup :class="is_repaired == 1 ? 'text-red-500 p-1 bg-red-100 rounded font-bold' : ''">
        {{ is_repaired == 1 ? 'R' : '' }}
      </sup> -->
    </u>
    <!-- Add Item Modal -->
    <Modal :show="isEditModalOpen" :maxWidth="'6xl'" title="View Item Information" @close="isEditModalOpen = false">
      <div class="grid grid-cols-1 gap-6 p-6">
        <!-- Show loading indicator if loading -->
        <div v-if="loading" class="flex items-center justify-center w-full h-full">
          <div class="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
        </div>

        <!-- Display item information when not loading -->
          <div v-else>
            <form class="mt-4 space-y-6">
            <!-- Item Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Image Upload -->
              <div class="space-y-3">
                <ItemImageVIewer 
                  :key="itemsForm.thumb_nail" 
                  :ingredient_id_number="props.item_id" 
                  :thumbnail="itemsForm.thumb_nail" 
                  :canDeleteImage="false" 
                />
                <UploadItemImage 
                  :key="itemsForm.thumb_nail" 
                  :item_id="itemsForm.item_id" 
                  @transaction_id="handleTransaction" 
                />
              </div>

              <!-- Item Details -->
              <div class="space-y-4">
                <!-- SKU -->
                <div>
                  <label for="sku" class="block text-sm font-medium text-gray-700">Item SKU</label>
                  <input
                    type="text"
                    id="sku"
                    v-model="itemsForm.sku"
                    disabled
                    aria-disabled="true"
                    placeholder="Item SKU"
                    class="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 p-2 shadow-sm"
                  />
                </div>

                <!-- Name -->
                <div>
                  <label for="itemName" class="block text-sm font-medium text-gray-700">Item Name</label>
                  <input
                    type="text"
                    id="itemName"
                    v-model="itemsForm.item_name"
                    :title="itemsForm.item_name"
                    disabled
                    aria-disabled="true"
                    placeholder="Item Name"
                    class="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 p-2 shadow-sm"
                  />
                </div>

                <!-- Brand -->
                <div>
                  <label for="brand" class="block text-sm font-medium text-gray-700">Brand</label>
                  <input
                    type="text"
                    id="brand"
                    v-model="itemsForm.brand_name"
                    disabled
                    aria-disabled="true"
                    placeholder="Brand Name"
                    class="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 p-2 shadow-sm"
                  />
                </div>

                <!-- Type -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Type</label>
                  <div class="mt-1 p-2 rounded-md bg-gray-200">
                    {{ itemsForm.is_fixed ? "Fixed Asset" : "Movable Asset" }}
                  </div>
                </div>

                <!-- Category -->
                <div>
                  <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="category"
                    v-model="itemsForm.category_id"
                    disabled
                    aria-disabled="true"
                    class="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 p-2 shadow-sm"
                  >
                    <option value="0">--Select Category--</option>
                    <option 
                      v-for="category in categories" 
                      :key="category.value" 
                      :value="category.value"
                    >
                      {{ category.label }}
                    </option>
                  </select>
                </div>

                <!-- Chart of Account -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Chart of Account</label>
                  <div class="mt-1 p-2 rounded-md bg-gray-200">
                    {{ itemsForm.chart_of_account_name }}
                  </div>
                </div>

                <!-- Description -->
                <div class="col-span-2">
                  <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    v-model="itemsForm.description"
                    disabled
                    aria-disabled="true"
                    placeholder="Description"
                    class="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 p-2 shadow-sm"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Supplier Table -->
            <div class="mb-4 overflow-auto">
              <label class="block text-sm font-medium text-gray-700 mb-2">Sub-item</label>
              <table class="min-w-full divide-y divide-gray-200 border rounded-md shadow-sm">
                <thead class="text-white text-nowrap" :class="DEFAULT_BG">
                  <tr class="border-b-2 border-yellow-500">
                    <th class="px-6 py-3 text-left text-md font-medium uppercase">Code</th>
                    <th class="px-6 py-3 text-left text-md font-medium uppercase">Supplier</th>
                    <th class="px-6 py-3 text-right text-md font-medium uppercase">Discount</th>
                    <th class="px-6 py-3 text-right text-md font-medium uppercase">Price</th>
                  </tr>
                </thead>
                <tbody v-if="suppliers.itemSuppliers?.length > 0" class="bg-white divide-y divide-gray-200">
                  <tr v-for="supplier in suppliers.itemSuppliers" :key="supplier.id">
                    <td class="px-2 py-2 border">{{ supplier.supplierCode }}</td>
                    <td class="px-2 py-2 border">{{ supplier.supplierName }}</td>
                    <td class="px-2 py-2 border text-right">{{ supplier.discountAmount }}</td>
                    <td class="px-2 py-2 border text-right">{{ supplier.price }}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="4" class="px-2 py-4 text-center text-red-500 font-bold">
                      *** No Supplier Found ***
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Remarks -->
            <div>
              <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                id="remarks"
                v-model="itemsForm.remarks"
                disabled
                aria-disabled="true"
                placeholder="Remarks"
                class="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 p-2 shadow-sm"
              ></textarea>
            </div>
          </form>
        </div>
      </div>
    </Modal>
    <!-- Image Enlargement Modal -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "@/views/Component/Modal.vue";
import { VUE_APP_API_URL, CATEGORIES, DEFAULT_BG } from "@/views/Utility/Global";
import { FormDx, BearToken, barcodeConverter, handleApiError } from "@/views/Utility/Helper";
import axios from "axios";
import { computed } from "vue"
import UploadItemImage from "./UploadItemImage.vue";
import ItemImageVIewer from "./ItemImageViewer.vue";
const token = localStorage.getItem("token");
const props = defineProps({
  item_id: {
    type: String,
    required: true
  },
item_name: {
    type: String,
    default: "-" 
  
  },
  is_fixed: {
    type: Number,
    default: 0
  },
  is_repaired: {
    type: Number,
    default: 0
  }
})

// Extract main name (everything before [ ... ])
const itemMainName = computed(() => {
  return props.item_name?.replace(/\s*\[.*?\]$/, "").trim() || "-"
})

// Extract pack (inside [ ... ])
const itemPack = computed(() => {
  const match = props.item_name?.match(/\[(.*?)\]$/)
  return match ? match[1] : null
})

const categories = ref([]);
const suppliers = ref([]);
const images = ref([]);
const item_name = ref(props.item_name);
const isEditModalOpen = ref(false);
const isViewImageModalOpen = ref(false);
const selectedImage = ref(null);
const searchBrand = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  item_id: 0,
});
const itemsForm = ref({
  item_id: 0,
  item_name: "",
  description: "",
  brand: "",
  type: "",
  remarks: "",
  category_id: 0,
  category_name: "",
  is_fixed: false,
});
const loading = ref(false); // Add this line

const openEditModal = () => {
  // console.log("openeditModal in line: 264")
  // console.log(props)
  isEditModalOpen.value = true;
  itemBehavior();
};

const closeModal = () => {
  selectedImage.value = null;
};

const enlargeImage = (base64) => {
  selectedImage.value = base64;
};

const itemBehavior = async () => {
  try{
    loading.value = true; // Set loading to true when starting
    searchBrand.value.item_id = props.item_id;

    await getItemInformation();
    await listBrandPrices();
    await categoryDropdown();
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false; // Set loading to false when done
  }
};
const handleTransaction = async () => {
  await getItemInformation();
}
const getItemInformation = async () => {
  try {
    const formData = FormDx({ item_id_number: props.item_id });
    const response = await axios.post(VUE_APP_API_URL + 'items/item-details', formData, BearToken(token));

    const data = response.data.item[0];
    if (data) {
      itemsForm.value.item_id = data.id;
      itemsForm.value.item_name = data.name;
      itemsForm.value.item_name = data.itemName;
      itemsForm.value.sku = data.sku;
      itemsForm.value.description = data.description;
      itemsForm.value.brand_id = data.brandId;
      itemsForm.value.brand_name = `${data.brandName ?? 'No Brand'}(${data.brandAbbre ?? 'NO'})`;
      itemsForm.value.type = data.type;
      itemsForm.value.remarks = data.remarks;
      itemsForm.value.category_id = data.categoryId;
      itemsForm.value.is_fixed = data.isFixed;
      itemsForm.value.thumb_nail = data.thumbNail;
      itemsForm.value.chart_of_account_name = data.chartOfAccountName ?? 'None';
    }
  } catch (error) {
    handleApiError(error);
  }
}


const categoryDropdown = async () => {
  categories.value = await CATEGORIES();
};

const listBrandPrices = async () => {
  try {
    suppliers.value = [];
    const formData = FormDx(searchBrand.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}items/get-item-has-prices-per-item-id`,
      formData,
      BearToken(token)
    );
    suppliers.value = response.data;
  } catch (error) {
    handleApiError(error);
  }
};
</script>

<style scoped>
.carousel-image {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.carousel-image:hover {
  transform: scale(1.05);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}
</style>