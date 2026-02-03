<template>
  <button
    v-if="hasPermission('Transactions_MRF_Create_Request_Item')"
    @click="(isAddModalOpen = true), addMRFBehavior()"
    class="bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold rounded text-sm md:text-md py-2 px-4 ml-2 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-box me-2"></i>
    <span class="hidden md:inline">Create MRF(Request Item)</span>
    <span class="inline md:hidden" title="Pending Items for Transfer"
      >Request</span
    >
  </button>
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="Create MRF(Request Item)"
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
          <div class="mb-4">
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
                :defaultValue="mrfForm.employee_name"
                @item-selected="fillUserForm"
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

            <!-- Brand -->
            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Brand</label
              >
              <div class="p-2 border rounded-l-md w-full">
                {{
                  i.brand_id == 0 || i.brand_id == null
                    ? "No Brand"
                    : `${i.brand_name} (${i.brand_abbre})`
                }}
              </div>
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

            <!-- Location -->
            <div class="mb-2">
              <label
                for="locationName"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Location</label
              >
              <SearchDropdown
                apiEndpoint="mrfs/rooms-warehouses-list"
                :searchModel="searchLocation"
                placeholder="Search Location"
                itemLabel="name"
                itemId="id"
                inputId="locationName"
                formatLabel="dashed_and_parenthesis"
                @item-selected="(item) => fillLocationForm(item, ii)"
                dataKey="roomsWarehouses"
                returnName="['sku','name','buildingAbbre']"
              />
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
        <!-- Desktop view: Table layout -->
        <div class="mb-4 overflow-auto min-h-full" v-else>
          <table class="min-w-full divide-y divide-gray-200 text-nowrap">
            <!-- Table headers -->
            <thead
              class="border-b border-yellow-500 text-white shadow"
              :class="DEFAULT_BG"
            >
              <tr class="text-nowrap text-md">
                <th
                  scope="col"
                  width="20%"
                  class="px-2 py-3 text-left text-md font-medium uppercase border tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-md font-medium uppercase border tracking-wider"
                >
                  Brand
                </th>
                <th
                  scope="col"
                  width="10%"
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
                  Location
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
            <tbody class="bg-white divide-y divide-gray-200 text-nowrap">
              <!-- Loop through products and display them -->
              <tr
                v-for="(i, ii) in mrfForm.items"
                v-if="mrfForm.items.length > 0"
                :key="ii"
              >
                <td class="px-2 py-3 border" width="20%">
                  <div class="z-900 flex w-full">
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
                </td>
                <td class="px-2 py-3 border">
                  <!-- <select
                          placeholder="Select Building Name"
                          class="mt-1 p-2 border rounded-md w-full"
                          v-model="i.item_id"
                          >
                          <option value="0">--Select Item--</option>
                          <option v-for="(i,ii) in items" :key="i.value" :value="i.value">{{ i.label }}</option>
                          </select> -->
                  <div class="mt-1 p-2 border rounded-l-md w-full">
                    {{
                      i.brand_id == 0 || i.brand_id == null
                        ? "No Brand"
                        : `${i.brand_name} (${i.brand_abbre})`
                    }}
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
                  <div class="mt-1 p-2 border rounded-l-md w-full" v-if="i.item_id != 0">
                    {{ i.quantity_per_unit }} /{{ i.unit_abbre }}
                  </div>
                  <div
                  class="mt-1 p-2 border text-red-500 rounded-l-md w-full"
                    v-else
                  >
                    Please select Item!
                  </div>
                </td>
                <td class="px-2 py-3 border">
                  <div class="z-900">
                    <SearchDropdown
                      apiEndpoint="mrfs/rooms-warehouses-list"
                      :searchModel="searchLocation"
                      placeholder="Search Location"
                      itemLabel="name"
                      itemId="id"
                      inputId="locationName"
                      formatLabel="dashed_and_parenthesis"
                      @item-selected="(item) => fillLocationForm(item, ii)"
                      dataKey="roomsWarehouses"
                      returnName="['sku','name','buildingAbbre']"
                    />
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
              <tr v-if="mrfForm.items.length == 0">
                <td class="px-2 py-3 border" colspan="8">
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
  <Modal :show="isBrandModalOpen" :maxWidth="'md'">
    <div class="flex justify-between p-6">
      <h2 class="text-lg font-semibold text-gray-800">Brand List</h2>
      <button
        class="flex float-end bg-gray-100 p-3"
        @click.prevent="isBrandModalOpen = false"
      >
        <i class="fa fa-times text-black-600"></i>
      </button>
    </div>
    <div class="grid grid-cols-1 gap-6 p-6">
      <div class="flex">
        <input
          type="search"
          v-model="searchBrand.search"
          @input.prevent="listBrands()"
          placeholder="Search Brand..."
          class="shadow shadow-gray-700 w-full flex font-bold text-lg py-2 px-4 rounded-lg mb-4 float-end"
        />
        <!-- <AddNewBrand
          :className="'border rounded-r-md mt-3 bg-red-500 text-white hover:bg-red-600 py-2 px-4'"
        /> -->
      </div>
      <div class="flex w-full overflow-auto">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="bg-gray-100 shadow">
            <tr class="border-b-2 border-solid border-yellow-500 text-nowrap">
              <th
                scope="col"
                class="px-2 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-2 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loop through products and display them -->
            <tr
              v-for="brand in data.itemHasBrands"
              v-if="data.itemHasBrands?.length > 0"
              :key="brand.id"
              class="text-nowrap"
            >
              <td class="px-2 py-3 border">
                {{ brand.itemBrandName }} ({{ brand.brandAbbre }})
              </td>
              <td class="px-2 py-3 border">
                <div class="flex justify-start">
                  <button
                    type="submit"
                    @click.prevent="selectedBrand(brand)"
                    class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                  >
                    Select
                  </button>
                </div>
              </td>
            </tr>
            <tr v-else>
              <td
                class="px-2 py-3 border text-center text-red-500 font-bold"
                colspan="5"
              >
                ***No Brands Found***
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex w-full overflow-auto">
        <Paginator
          v-if="data.totalrows"
          :page_number="search.page_num"
          :total_rows="data.totalrows"
          :itemsperpage="search.itemsperpage"
          @page_num="handlePagination"
        />
      </div>
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
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
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
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const data = ref([]);
const imageFiles = ref([]);
const mrfForm = ref({
  mrf_id: 0,
  date_now: DATE_NOW(),
  our_company_id: 0,
  remarks: "",
  mrf_manual_number: "",
  employee_id: 0,
  employee_name: "",
  mrf_type: 1,
  proof_images: [],
  items: [
    {
      item_id: 0,
      item_name: "",
      quantity: 0,
      quantity_per_unit: 0,
      sub_quantity: 0,
      description: "",
      remarks: "",
      room_location_number: 0,
      item_images: [],
    },
  ],
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
const searchLocation = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
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
const fillItemsForm = (item, index) => {
  mrfForm.value.items[index].item_id = item.id;
  mrfForm.value.items[index].item_name = item.sku + " / " + item.name;
  mrfForm.value.items[index].unit_abbre = item.unitAbbre;
  mrfForm.value.items[index].unit_id = item.unitId;
  mrfForm.value.items[index].description = item.description;
  mrfForm.value.items[index].quantity_per_unit = item.quantityPerUnit;
  mrfForm.value.items[index].brand_id = item.brandId;
  mrfForm.value.items[index].brand_name = item.brandName;
  mrfForm.value.items[index].brand_abbre = item.brandAbbre;
  search.value.search = "";
};
//location dropdown
const fillLocationForm = (item, index) => {
  const buildingAbbre = item.buildingAbbre ? `(${item.buildingAbbre})` : "";
  mrfForm.value.items[index].room_location_number = item.sku;
  mrfForm.value.items[index].room_location_name =
    item.sku + "-" + item.name + " " + buildingAbbre;

  searchLocation.value.search = "";
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

const handleItemImageUpload = (event, index) => {
  const files = event.target.files;
  if (files.length > 0) {
    // Add the files to the specific item in the form
    mrfForm.value.items[index].item_images = [...files];
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  searchBrand.value.page_num = page_num ?? 1;
  listBrands();
};
//add
const addMRFBehavior = () => {
  resetForm();
  companiesDropdown();
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
    const invalidBrandItems = mrfForm.value.items.filter(
      (item) => item.brand_id === 0
    );
    const invalidLocationItems = mrfForm.value.items.filter(
      (item) => item.room_location_number === 0
    );

    // if (invalidBrandItems.length > 0) {
    //   // Display error for items with brand_id === 0
    //   Alert("error", "Error", "Some items have invalid Brand selections (Brand ID is 0).");
    //   return;
    // }

    if (invalidLocationItems.length > 0) {
      // Display error for items with empty room_location_number
      Alert("error", "Error", "Some items have empty Item Location.");
      return;
    }

    // If no invalid items, proceed with form submission
    const formData = FormDx(mrfForm.value);

    // upload item images
    mrfForm.value.items.forEach((item, index) => {
      item.item_images.forEach((file, i) => {
        formData.append(`items[${index}][item_images][${i}]`, file);
      });
    });

    // Append proof image files
    // Conditionally append proof images if they exist
    if (imageFiles.value && imageFiles.value.length > 0) {
      imageFiles.value.forEach((file) => {
        formData.append("proof_images[]", file); // Using array notation for multiple files
      });
    }
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/add`,
      formData,
      BearToken(token)
    );

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
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
    item_images: [],
    /* other charge properties */
  };

  // Assuming salesForm.charges is an array
  mrfForm.value.items.push(item_data);
};
const removeItemField = (index) => {
  // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
  mrfForm.value.items.splice(index, 1);
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
