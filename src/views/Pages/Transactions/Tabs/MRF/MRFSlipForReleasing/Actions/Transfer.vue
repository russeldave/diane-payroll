<template>
  <button
    @click="(isAddModalOpen = true), addMRFBehavior()"
    class="bg-red-500 hover:opacity-70 focus:bg-red-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-exchange me-2"></i>
    <span class="hidden md:inline">Create MRF(Transfer Item)</span>
    <span class="inline md:hidden" title="Pending Items for Transfer"
      >Transfer</span
    >
  </button>
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="Create MRF(Transfer Item)"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addMRF()">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF Manual No.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="mrfForm.mrf_manual_number"
              placeholder="Input MRF Manual Number"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4 md:col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Our Company</label
            >
            <select
              placeholder="Select Building Name"
              class="mt-1 p-2 border rounded-md w-full"
              v-model="mrfForm.our_company_id"
            >
              <option value="0">--Select Company--</option>
              <option
                v-for="(b, bb) in companies"
                :key="b.value"
                :value="b.value"
              >
                {{ b.label }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Source Location</label
            >
            <select
              id="warehouse-select"
              placeholder="Select Warehouse"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              v-model="mrfForm.from_warehouse_id"
            >
              <option
                v-for="(w, index) in from_warehouse"
                :key="index"
                :value="w.warehouseId"
              >
                {{ w.warehouseName }}
              </option>
              <option value="0">All</option>
            </select>
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Destination Location</label
            >
            <div class="flex items-center mt-1">
              <SearchDropdown
                apiEndpoint="warehouses/list"
                :searchModel="searchToWarehouse"
                placeholder="Search Destination"
                itemLabel="name"
                itemId="id"
                inputId="destinationName"
                formatLabel="dashed_and_parenthesis"
                @item-selected="(data) => fillToWarehouseForm(data)"
                dataKey="employees"
                returnName="['warehouseSku','name','buildingName']"
              />
            </div>
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Requested From</label
            >
            <div class="flex items-center mt-1">
              <SearchDropdown
                apiEndpoint="employees/list"
                :searchModel="searchUser"
                placeholder="Search Employee"
                itemLabel="name"
                itemId="id"
                inputId="employeeName"
                @item-selected="(data) => fillUserForm(data)"
                dataKey="employees"
                returnName="['firstName','middleName','lastName']"
              />
            </div>
          </div>
          <div class="mb-4">
            <label
              for="itemImages"
              class="block text-sm font-medium text-gray-700"
              >Upload Proof</label
            >
            <input
              type="file"
              id="itemImages"
              @change="handleImageUpload"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Remarks</label
            >
            <textarea
              v-model="mrfForm.remarks"
              placeholder="Input MRF Remarks"
              class="mt-1 p-2 border rounded-md w-full"
            ></textarea>
          </div>
        </div>
        <div class="mb-4 overflow-auto border-b border-dashed">
          <button
            @click.prevent="generateItemField()"
            type="button"
            class="px-4 py-2 font-bold hover:bg-blue-500 bg-blue-600 mb-2 rounded shadow text-white text-md float-right"
          >
            <i class="fa fa-plus"></i> Add Item
          </button>
        </div>
        <!-- Mobile view: Form-like layout -->
        <div v-if="isMobile" class="block lg:hidden">
          <div
            v-for="(i, ii) in mrfForm.items"
            :key="ii"
            class="mb-4 p-4 border rounded-lg shadow"
          >
            <!-- Item Dropdown -->
            <div class="mb-2">
              <label
                for="itemsName"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Item</label
              >
              <SearchDropdown
                apiEndpoint="items/list"
                :searchModel="search"
                placeholder="Search Items"
                itemLabel="name"
                itemId="id"
                inputId="itemsName"
                formatLabel="dashed_and_parenthesis"
                @item-selected="(item) => fillItemsForm(item, ii)"
                dataKey="items"
                returnName="['sku','name']"
              />
            </div>
            <!-- Quantity and Units -->
            <div class="mb-2">
              <label
                for="quantity"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Quantity</label
              >
              <div class="flex">
                <input
                  type="number"
                  id="ProductName"
                  v-model="i.quantity"
                  autocomplete="off"
                  min="1"
                  placeholder="Input Item Quantity"
                  class="mt-1 p-2 border rounded-l-md w-full"
                />
                <button
                  type="button"
                  class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                >
                  {{ i.unit_abbre ?? "-" }}
                </button>
              </div>
            </div>

            <!-- Quantity per Unit -->
            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Quantity per Unit</label
              >
              <div
                class="mt-1 p-2 border rounded-l-md w-full"
                v-if="i.item_id != 0"
              >
                {{ i.quantity_per_unit }} /{{ i.unit_abbre }}
              </div>
              <div
                class="mt-1 p-2 border rounded-l-md w-full text-red-500"
                v-else
              >
                Please select Item!
              </div>
            </div>

            <!-- Proof -->
            <div class="mb-2">
              <label
                for="proof"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Proof</label
              >
              <input
                type="file"
                class="mt-1 p-2 border rounded-md w-full"
                id="proof"
                multiple
                accept="image/*"
                @change="(event) => handleItemImageUpload(event, ii)"
              />
            </div>

            <!-- Remarks -->
            <div class="mb-2">
              <label
                for="remarks"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Remarks</label
              >
              <textarea
                v-model="i.remarks"
                placeholder="Input Item Remarks"
                class="mt-1 p-2 border rounded-md w-full"
                id="remarks"
              ></textarea>
            </div>

            <!-- Remove Item Button -->
            <div class="flex justify-center">
              <button
                @click.prevent="removeItemField(ii)"
                type="button"
                title="Remove Item"
                class="bg-red-500 text-white rounded font-bold text-md md:text-lg py-2 px-4"
              >
                <i class="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>

          <p
            v-if="mrfForm.items.length === 0"
            class="text-red-500 font-bold text-center"
          >
            **No items found**
          </p>
        </div>
        <div v-else class="mb-4 overflow-auto min-h-full">
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead
              class="text-white shadow border-b border-yellow-500"
              :class="DEFAULT_BG"
            >
              <tr class="text-nowrap text-md">
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-md font-medium uppercase border tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-md font-medium uppercase border tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-md font-medium uppercase border tracking-wider"
                >
                  Units
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-md font-medium uppercase border tracking-wider"
                >
                Sample/Damage Item/Comparison
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-md font-medium uppercase border tracking-wider"
                >
                  Remarks
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-center text-md font-medium uppercase border tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loop through products and display them -->
              <tr
                v-for="(i, ii) in mrfForm.items"
                v-if="mrfForm.items.length > 0"
                :key="ii"
              >
                <td class="px-2 py-3 border">
                  <!-- <select
                          placeholder="Select Building Name"
                          class="mt-1 p-2 border rounded-md w-full"
                          v-model="i.item_id"
                          >
                          <option value="0">--Select Item--</option>
                          <option v-for="(i,ii) in items" :key="i.value" :value="i.value">{{ i.label }}</option>
                          </select> -->
                  <div class="relative group">
                    <div class="z-900">
                      <SearchDropdown
                        apiEndpoint="items/list"
                        :searchModel="search"
                        placeholder="Search Items"
                        itemLabel="name"
                        itemId="id"
                        inputId="itemsName"
                        formatLabel="dashed_and_parenthesis"
                        @item-selected="(item) => fillItemsForm(item, ii)"
                        dataKey="items"
                        returnName="['sku','name']"
                      />
                    </div>
                  </div>
                  <div
                    class="absolute bg-white shadow z-50"
                    v-if="search.search != '' && activeItemIndex == ii"
                  >
                    <ul class="">
                      <li
                        class="p-1 border-l-2 border-lime-200 flex py-2 font-bold shadow text-gray-600"
                        @click.prevent="fillItemsForm(item, ii)"
                        v-for="(item, index) in items"
                        :key="index"
                      >
                        {{ item.name }} / {{ item.sku }}
                      </li>
                    </ul>
                  </div>
                </td>
                <td class="px-2 py-3 border">
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.quantity"
                      autocomplete="off"
                      min="1"
                      placeholder="Input Item Quantity"
                      class="mt-1 p-2 border rounded-l-md w-full"
                    />
                    <button
                      type="button"
                      class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                    >
                      {{ i.unit_abbre ?? "-" }}
                    </button>
                  </div>
                </td>
                <td class="px-2 py-3 border">
                  <div class="flex" v-if="i.item_id != 0">
                    {{ i.quantity_per_unit }} {{ i.sub_unit_abbre }}/{{
                      i.unit_abbre
                    }}
                  </div>
                  <div
                    class="flex text-red-500 font-bold text-xs justify-center"
                    v-else
                  >
                    Please select Item!
                  </div>
                </td>
                <td class="px-2 py-3 border">
                  <input
                    type="file"
                    class="mt-1 p-2 border rounded-md w-full"
                    id="proof"
                    multiple
                    accept="image/*"
                    @change="(event) => handleItemImageUpload(event, ii)"
                  />
                </td>
                <td class="px-2 py-3 border">
                  <textarea
                    v-model="i.remarks"
                    placeholder="Input Item Remarks"
                    class="mt-1 p-2 border rounded-md w-full"
                  ></textarea>
                </td>
                <td class="px-2 py-3 border">
                  <div class="flex justify-center">
                    <button
                      @click.prevent="removeItemField(ii)"
                      type="button"
                      title="Remove Item"
                      class="bg-red-500 text-white rounded font-bold rounded-r text-md md:text-lg py-2 px-4 mb-4 float-end text-nowrap"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td class="px-2 py-3 border" colspan="6">
                  <p class="text-red-500 font-bold text-center">
                    **No items found**
                  </p>
                </td>
              </tr>
              <!-- item_id: 0,
                    item_name: '',
                    quantity: 0,
                    description: '',
                    remarks: '',
                    room_location_number: 0, -->
            </tbody>
          </table>
        </div>
        <div class="flex justify-end">
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
import { onMounted, ref, watch, onUnmounted } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import {
  VUE_APP_API_URL,
  DATE_NOW,
  COMPANIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  useDebounce,
  handleApiError
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  warehouse_id: Number,
});
const isAddModalOpen = ref(false);
const isBrandModalOpen = ref(false);
const companies = ref([]);
const items = ref([]);
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const from_warehouse = ref([]);
const users = ref([]);
const data = ref([]);
const activeItemIndex = ref(0);
const imageFiles = ref([]);
const mrfForm = ref({
  mrf_id: 0,
  date_now: DATE_NOW(),
  our_company_id: 0,
  remarks: "",
  mrf_manual_number: "",
  employee_id: 0,
  employee_name: "",
  proof_images: [],
  mrf_type: 2,
  items: [],
  // items: [
  //   {
  //     item_id: 0,
  //     item_name: "",
  //     quantity: 0,
  //     quantity_per_unit: 0,
  //     sub_quantity: 0,
  //     description: "",
  //     remarks: "",
  //     room_location_number: 0,
  //     room_location_name: "",
  //   },
  // ],
});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchToWarehouse = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchBrand = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  item_id: 0,
  supplier_id: 0,
});
//itemd dropdown
const listItems = async () => {
  try {
    items.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}items/list`,
      formData,
      BearToken(token)
    );
    items.value = response.data.items;
  } catch (error) {
    handleApiError(error);
  }
};
const searchItemBehavior = useDebounce(async (index, name) => {
  search.value.search = name;
  activeItemIndex.value = index;

  await listItems(); // Call listItems function after debounce delay
}, 500);
const fillItemsForm = (item, index) => {
  mrfForm.value.items[index].item_id = item.id;
  mrfForm.value.items[index].item_name = item.sku + " / " + item.name;
  mrfForm.value.items[index].unit_abbre = item.unitAbbre;
  mrfForm.value.items[index].unit_id = item.unitId;
  mrfForm.value.items[index].description = item.description;
  mrfForm.value.items[index].quantity_per_unit = item.quantityPerUnit;

  search.value.search = "";
};
//location dropdown

const fillToWarehouseForm = (item) => {
  console.log(item);
  mrfForm.value.to_warehouse_id = item.id;
  mrfForm.value.to_warehouse_name = item.name;

  searchToWarehouse.value.search = "";
};
const warehouseDropdown = () => {
  from_warehouse.value = JSON.parse(localStorage.getItem("warehouses"));

  mrfForm.value.from_warehouse_id = props.warehouse_id;
};

//users dropdown

const fillUserForm = (user) => {
  mrfForm.value.employee_id = user.id;
  mrfForm.value.employee_name =
    user.employeeNumber +
    " - " +
    user.firstName +
    " " +
    user.middleName +
    " " +
    user.lastName;

  searchUser.value.search = "";
};

const brandBehavior = (item_id, index) => {
  searchBrand.value.item_id = item_id;
  searchBrand.value.active_index = index;
  listBrands();
};

// const selectedBrand = (brand) => {
//   const pr_items = mrfForm.value.items[searchBrand.value.active_index];

//   pr_items.brand_id = brand.itemBrandId;
//   pr_items.brand_name = brand.itemBrandName;
//   pr_items.brand_abbre = brand.brandAbbre;

//   isBrandModalOpen.value = false;
// };
const listBrands = async () => {
  try {
    data.value = [];
    const formData = FormDx(searchBrand.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}items/get-item-has-prices-per-item-id`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
  } catch (error) {
    handleApiError(error);
  }
};
// const handlePagination = (page_num) => {
//   console.log(page_num);
//   searchBrand.value.page_num = page_num ?? 1;
//   listBrands();
// };
//add
const addMRFBehavior = () => {
  resetForm();
  companiesDropdown();
  warehouseDropdown();
};
const resetForm = () => {
  mrfForm.value.mrf_id = 0;
  mrfForm.value.date_now = DATE_NOW();
  mrfForm.value.our_company_id = 0;
  mrfForm.value.remarks = "";
  mrfForm.value.mrf_manual_number = "";
  mrfForm.value.items = [
    {
      item_id: 0,
      item_name: "",
      brand_id: 0,
      quantity: 0,
      quantity_per_unit: 0,
      sub_quantity: 0,
      description: "",
      remarks: "",
      item_images: [],
      room_location_number: 0,
    },
  ];
};
const addMRF = async () => {
  try {
    // Validate that the destination location is different from the source location
    if (mrfForm.value.to_warehouse_id === mrfForm.value.from_warehouse_id) {
      Alert(
        "warning",
        "Warning!",
        "Destination Location must not be the same as the Source Location"
      );
      return false;
    }

    // Show the processing alert
    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Prepare the FormData object with the form fields
    const formData = FormDx(mrfForm.value);

    // Conditionally append item images if they exist
    mrfForm.value.items.forEach((item, index) => {
      if (item.item_images && item.item_images.length > 0) {
        item.item_images.forEach((file, i) => {
          formData.append(`items[${index}][item_images][${i}]`, file);
        });
      }
    });

    // Conditionally append proof images if they exist
    if (imageFiles.value && imageFiles.value.length > 0) {
      imageFiles.value.forEach((file) => {
        formData.append("proof_images[]", file); // Using array notation for multiple files
      });
    }

    // Send the request
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/add-transfer`,
      formData,
      BearToken(token)
    );

    // Close the processing dialog
    Swal.close();
    // Close modal and show success alert
    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);

    // Emit event with a unique transaction ID
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};
const generateItemField = async () => {
  let item_data = {
    item_id: 0,
    item_name: "",
    quantity: 0,
    quantity_per_unit: 0,
    sub_quantity: 0,
    description: "",
    remarks: "",
    room_location_number: 0,
    /* other charge properties */
  };

  // Assuming salesForm.charges is an array
  mrfForm.value.items.push(item_data);
};
const removeItemField = (index) => {
  // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
  mrfForm.value.items.splice(index, 1);
};
const handleItemImageUpload = (event, index) => {
  const files = event.target.files;
  if (files.length > 0) {
    // Add the files to the specific item in the form
    mrfForm.value.items[index].item_images = [...files];
  }
};
const companiesDropdown = async () => {
  companies.value = await COMPANIES();
};
// Watch for screen size changes
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};
watch(() => window.innerWidth, handleResize);
onMounted(() => {
  window.addEventListener("resize", handleResize);
});
</script>
