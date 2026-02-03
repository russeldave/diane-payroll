<template>
  <button
    @click="(isEditModalOpen = true), itemBehavior()"
    class="bg-green-500 hover:opacity-70 focus:bg-green-300 text-white font-bold text-sm md:text-md rounded-l py-2 px-4 mb-4 float-end text-nowrap"
  >
  <i class="fas fa-plus"></i>
  Create Item
  </button>
 <!-- Add Item Modal -->
 <Modal :show="isEditModalOpen" :maxWidth="'6xl'" title="Create Requested Item" @close="closeModal()">
  <div class="grid grid-cols-1 gap-6 p-6">
    <form class="" @submit.prevent="editItem()" autocomplete="off">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="block">
          <div class="flex md:col-span-2">
            <input
              type="checkbox"
               v-model="itemsForm.is_fixed"
               class="w-4 h-4 bg-red-500"
            />
            <label
              for="LeagueName"
              class="block text-md ml-2 font-medium text-red-500"
              >Is this item a fixed asset?</label
            >
          </div>
          <div class="mb-4 col-span-2">
            <ItemImageViewer :user_request_id="itemsForm.user_request_item_id" :thumbnail="itemsForm.thumb_nail"/>
          </div>
          
          <div class="mb-4 col-span-2">
            <label
              for="itemImages"
              class="block text-sm font-medium text-gray-700"
              >Item Images (<small class="text-red-500">Optional</small>)</label
            >
            <input
              type="file"
              id="itemImages"
              @change="handleImageUpload"
              multiple
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>
        <div class="block">
          <div class="mb-4 col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Item SKU (<small class="text-red-500">Optional</small>)</label
            >
            <div class="flex">
              <input
                type="text"
                id="ItemName"
                v-model="itemsForm.item_sku"
                placeholder="Input Item SKU"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
          </div>
          <div class="mb-4 col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Item Name</label
            >
            <div class="flex">
              <input
                type="text"
                id="ItemName"
                v-model="itemsForm.item_name"
                placeholder="Input Item Name"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <sup class="text-red-500 font-bold" v-if="duplicateItem.isDuplicated">{{ duplicateItem.message }}</sup>
          </div>
          <!-- <div class="mb-4 col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Select Sub Item (<small class="text-red-500">Optional</small>)</label
            >
            <div class="z-900 flex w-full">
              <SearchDropdown
                apiEndpoint="items/list"
                :searchModel="searchItem"
                placeholder="Search Items"
                itemLabel="name"
                itemId="id"
                inputId="itemsName"
                @item-selected="(data) => fillItemForm(data)"
                dataKey="items"
                returnName="['sku','name']"
              />
            </div>
          </div> -->
          <div class="mb-4 relative col-span-2">
            <label
              for="brandName"
              class="block text-sm font-medium text-gray-700"
            >
              Brand
            </label>
            <div class="flex">
              <SearchDropdown
                  apiEndpoint="item-brands/list"
                  :searchModel="searchBrand"
                  placeholder="Search Brand"
                  itemLabel="name"
                  itemId="id"
                  inputId="brandName"
                  formatLabel="parenthesis"
                  :defaultValue="itemsForm.brand_name"
                  @item-selected="(data) => fillBrandForm(data)"
                  dataKey="itemBrands"
                  returnName="['name','abbre']"
                />
                
            </div>
          </div>
          <div class="mb-4 col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Category</label
            >
            <select
            v-model="itemsForm.category_id"
            placeholder="Select Category"
            class="mt-1 p-2 border rounded-md w-full"
            >
              <option value="0">--Select Category--</option>
              <option v-for="category in categories" :key="category.value" :value="category.value">{{ category.label }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Unit</label
            >
            <select
            v-model="itemsForm.unit_id"
            placeholder="Select Unit"
            class="mt-1 p-2 border rounded-md w-full"
            >
              <option value="0">--Select Unit--</option>
              <option v-for="unit in units" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Quantity Per Unit</label
            >
            <input
              type="number"
              id="ProductName"
              min="0"
              step="any"
              v-model="itemsForm.quantity_per_unit"
              placeholder="Input Quantity per Unit"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4 relative col-span-2">
            <label
              for="brandName"
              class="block text-sm font-medium text-gray-700"
            >
              Assign Chart of Account (<small class="text-red-500">Optional</small>)
            </label>
            <div class="flex items-center">
              <SearchDropdown
                  apiEndpoint="chart-of-accounts/list"
                  :searchModel="searchCOA"
                  placeholder="Search COA"
                  itemLabel="name"
                  itemId="id"
                  inputId="coaName"
                  @item-selected="(data) => fillCOAForm(data)"
                  dataKey="chartOfAccounts"
                  returnName="['name','chartOfAccountTypeName']"
                />
            </div>
           
          </div>
        </div>
        <!-- <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Brand Name</label
          >
          <input
            type="text"
            id="BrandName"
            v-model="itemsForm.brand"
            placeholder="Input Brand Name"
            class="p-2 border rounded-md w-full"
          />
        </div> -->
      </div>
      <div class="mb-4 col-span-2">
        <label
          for="LeagueName"
          class="block text-sm font-medium text-gray-700"
          >Description (<small class="text-red-500">Optional</small>)</label
        >
        <textarea
         v-model="itemsForm.description"
        placeholder="Input Item Description"
        class="mt-1 p-2 border rounded-md w-full"
        ></textarea>
      </div>
      <div class="mb-4 col-span-2">
        <label
          for="LeagueName"
          class="block text-sm font-medium text-gray-700"
          >Remarks (<small class="text-red-500">Optional</small>)</label
        >
        <textarea
         v-model="itemsForm.remarks"
        placeholder="Input Item Remarks"
        class="mt-1 p-2 border rounded-md w-full"
        ></textarea>
      </div>
      <div class="flex items-center justify-end">
        <button
          type="submit"
          class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Save to Item
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
import defaultImage from '@/assets/images/default/imageNotAvailable.jpg';
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import { VUE_APP_API_URL, PERMISSION, UNITS, CATEGORIES } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  useDebounce,
  handleApiError
} from "@/views/Utility/Helper";

import ItemImageViewer from "./ItemImageViewer.vue";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);

const props = defineProps({
  data: Object,
});
const categories  = ref([]);
const imageFiles = ref([]);
const images = ref([]);
const brands = ref([]);
const units = ref([]);
const duplicateItem = ref([]);

const isEditModalOpen = ref(false);
const searchBrand = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const searchCOA = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchItem = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const itemsForm = ref({
  user_request_item_id: 0,
  sub_item_id: 0,
  image_ids: [],
  item_name: '',
  description: '',
  remarks: '',
  category_id: '',
  is_fixed: false,
  quantity_per_unit: 1,
  unit_id: 0,
  brand_id: 0,
  chart_of_account_id: 0,
  });
const itemBehavior = () => {
  const data = props.data;
  console.log(data);
  itemsForm.value.user_request_item_id = data.id;
  itemsForm.value.item_name = data.itemName;
  itemsForm.value.item_sku = "";
  itemsForm.value.description = data.description;
  itemsForm.value.brand_id = data.brandId;
  itemsForm.value.brand_name = `${data.brandName}(${data.brandAbbre ?? '-'})`;
  itemsForm.value.remarks = data.remarks;
  itemsForm.value.category_id = data.categoryId;
  itemsForm.value.unit_id = data.unitId ?? 0;
  itemsForm.value.is_fixed = data.isFixed ? true : false;
  itemsForm.value.quantity_per_unit = data.quantityPerUnit ?? 1;
  itemsForm.value.thumb_nail = data.thumbNail;

  unitsDropdown();
  categoryDropdown();
  checkDuplicateItems(itemsForm.value.item_name);
};
const resetForm = () => {
  itemsForm.value.user_request_item_id = 0;
  itemsForm.value.item_name = '';
  itemsForm.value.description = '';
  itemsForm.value.type = '';
  itemsForm.value.remarks = '';
  itemsForm.value.category_id = 0;
  itemsForm.value.unit_id = 0;
  itemsForm.value.sub_unit_id = 0;
  itemsForm.value.is_fixed = false;
  itemsForm.value.quantity_per_unit = 0;
};
const checkDuplicateItems = async (item_name) => {
  try {
    duplicateItem.value = [];
    const formData = FormDx({ item_name: item_name});
    const response = await axios.post(
      `${VUE_APP_API_URL}items/check-item-name-duplicate`,
      formData,
      BearToken(token)
    );
    duplicateItem.value = response.data;
  } catch (error) {
    handleApiError(error);
  }
};
const editItem = async () => {
  try {
    itemsForm.value.is_fixed = itemsForm.value.is_fixed ? 1 : 0;
    const formData = FormDx(itemsForm.value);
    Object.keys(itemsForm.value).forEach(key => {
      formData.append(key, itemsForm.value[key]);
    });

    // Append image files
    imageFiles.value.forEach(file => {
      formData.append('item_images[]', file);  // Using array notation for multiple files
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}items/add-from-request-item`,
      formData,
      BearToken(token)
    );

    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};

const overrideItemName = async () => {
  // Show SweetAlert2 confirmation dialog
  const { isConfirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to submit the changes?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, submit!',
    cancelButtonText: 'No, cancel'
  });

  if (!isConfirmed) {
    return; // Exit if not confirmed
  }

  try {
    const formData = FormDx({
      item_id: itemsForm.value.item_id,
      item_name: itemsForm.value.item_name,
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}overrides/item-name`,
      formData,
      BearToken(token)
    );

    Swal.fire('Success', response.data.message, 'success');
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};
const overrideItemSku = async () => {
  // Show SweetAlert2 confirmation dialog
  const { isConfirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to submit the changes?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, submit!',
    cancelButtonText: 'No, cancel'
  });

  if (!isConfirmed) {
    return; // Exit if not confirmed
  }

  try {
    const formData = FormDx({
      item_id: itemsForm.value.item_id,
      new_item_sku: itemsForm.value.item_sku,
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}overrides/item-sku`,
      formData,
      BearToken(token)
    );

    isEditModalOpen.value = false;
    Swal.fire('Success', response.data.message, 'success');
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};
const fillBrandForm = (item) => {
  itemsForm.value.brand_id = item.id;
  itemsForm.value.brand_name = item.name;

  searchBrand.value.search = "";
};
const fillItemForm = (item) => {

itemsForm.value.sub_item_id = item.id ?? 0;
itemsForm.value.sub_item_name = (item.name + '  '+item.sku) ?? 'None';

searchItem.value.search = "";
};
// coa dropwdown
const fillCOAForm = (item) => {
  itemsForm.value.chart_of_account_id = item.id;
  itemsForm.value.chart_of_account_name = item.name+' - '+item.chartOfAccountTypeName+'('+item.reportCodeName+')';

  searchCOA.value.search = "";
};
const ingredientsCategoryDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}ingredient-categories/dropdown`,
      BearToken(token)
    );
    categories.value = response.data.ingredientCategories;
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};
const unitsDropdown = async () => {
  units.value = await UNITS();
}
const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
}
const closeModal = () => {
  isEditModalOpen.value = false;
  emits("transaction_id", Math.random());
  // brandDropdown();
};
const handleTransaction = (transaction_id) => {

  // brandDropdown();
};
const subUnitChecker = () => {
    itemsForm.value.sub_unit_id = 0;
}
onMounted(() => {
  ingredientsCategoryDropdown();
});
// Call listItems when component is mounted
</script>