<template>
    <button
      v-if="hasPermission('Transactions_MRF_Create_Request_Item')"
      @click="addMRFBehavior()"
      class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 ml-2 rounded-r mb-4 float-end text-nowrap"
    >
      <i class="fas fa-clipboard-list"></i>
      MRF
    </button>
    <Modal
      :show="isAddModalOpen"
      :maxWidth="'fullscreen'"
      title="Create MRF(Request Item)"
      @close="isAddModalOpen = false"
    >
      <div class="grid grid-cols-1 gap-6 p-6 max-h-screen">
        <form class="mt-4" @submit.prevent="addMRF()">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="">
              <!-- <div class="mb-4">
                <label for="LeagueName" class="block text-sm font-medium text-gray-500"
                  >MRF Manual No.</label
                >
                <input
                  type="text"
                  id="ProductName"
                  v-model="mrfForm.mrf_manual_number"
                  placeholder="Input MRF Manual Number"
                  class="mt-1 p-2 border rounded-md w-full"
                />
              </div> -->
               <div class="mb-4">
                <label for="LeagueName" class="block text-sm font-medium text-gray-500"
                  >Estimated Date of Arrival(ETA) <span class="text-red-500 font-bold text-lg">*</span></label
                >
                <input
                  type="date"
                  id="ProductName"
                  v-model="mrfForm.estimated_date_arrival"
                  placeholder="Input MRF Manual Number"
                  class="mt-1 p-2 border rounded-md w-full"
                />
              </div>
              <!-- <div class="mb-4">
                <label
                  for="LeagueName"
                  class="block text-sm font-medium text-gray-500"
                  >Our Company:</label
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
              </div> -->
              <div class="mb-4">
                <label for="LeagueName" class="block text-sm font-medium text-gray-500"
                  >Requested From (Employee Name): <span class="text-red-500 font-bold text-lg">*</span></label
                >
                <div class="flex items-center mt-1">
                  <SearchDropdown
                    apiEndpoint="employees/list"
                    :searchModel="searchUser"
                    placeholder="Search Employee"
                    itemLabel="name"
                    itemId="id"
                    inputId="employeeName"
                    :key="mrfForm.employee_name"
                    :defaultValue="mrfForm.employee_name"
                    @item-selected="(data) => fillUserForm(data)"
                    dataKey="employees"
                    returnName="['firstName','middleName','lastName']"
                  />
                </div>
              </div>
              <!-- <div class="mb-4">
                <label for="itemImages" class="block text-sm font-medium text-gray-500"
                  >Upload Manual MRF:</label
                >
                <input
                  type="file"
                  id="itemImages"
                  @change="handleImageUpload"
                  class="mt-1 p-2 border rounded-md w-full"
                />
              </div> -->
              <div class="mb-4">
                <label for="LeagueName" class="block text-sm font-medium text-gray-500"
                  >Remarks:</label
                >
                <textarea
                  v-model="mrfForm.remarks"
                  placeholder="Input MRF Remarks"
                  class="mt-1 p-2 border rounded-md w-full"
                ></textarea>
              </div>
            </div>
            <div class="block col-span-2 max-h-screen overflow-auto">
            <div class="flex mb-4 overflow-auto max-sm:flex-wrap justify-between">
              <div class="flex justify-center items-center w-full py-4">
                <label
                  class="flex flex-col items-center gap-3 cursor-pointer select-none transition-all duration-300 
                        hover:scale-[1.02] hover:drop-shadow-[0_0_6px_rgba(249,115,22,0.3)]"
                >
                  <!-- Hidden Checkbox -->
                  <input
                    type="checkbox"
                    v-model="mrfForm.is_stock"
                    true-value="1"
                    false-value="0"
                    class="sr-only peer"
                  />
                  <!-- Toggle Track -->
                  <div
                    class="relative w-12 h-7 bg-gray-200 rounded-full peer dark:bg-gray-700 
                          peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800
                          peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                          peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 
                          after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                          after:h-6 after:w-6 after:transition-all dark:border-gray-600 
                          peer-checked:bg-orange-500 dark:peer-checked:bg-orange-500
                          transition-all duration-300 shadow-inner"
                  ></div>
                  <div class="flex items-center justify-center text-lg font-semibold space-x-3 transition-all duration-300 text-center">
                    <!-- Create MRF -->
                    <div
                      class="flex items-center gap-1 transition-all duration-300"
                      :class="mrfForm.is_stock == 1
                        ? 'text-gray-300 scale-90'
                        : 'text-gray-900 font-bold dark:text-blue-900 scale-110'"
                    >
                      <span
                        class="text-xl transition-transform duration-300"
                        :class="mrfForm.is_stock == 1 ? 'scale-90 opacity-60' : 'scale-110 text-orange-500'"
                      >🧾</span>
                      <span class="text-xl">Create MRF</span>
                    </div>

                    <span class="text-gray-400">/</span>

                    <!-- For PR-->
                    <div
                      class="flex justify-center items-center gap-1 transition-all duration-500 ease-in-out transform"
                      :class="mrfForm.is_stock == 0
                        ? 'text-gray-300 scale-90'
                        : 'text-gray-900 font-bold dark:text-orange-700 scale-110'"
                    >
                      <span
                        class="text-2xl transition-transform duration-500 ease-in-out"
                        :class="mrfForm.is_stock == 0
                          ? 'scale-90 opacity-60'
                          : 'scale-110 text-orange-500'"
                      >
                        📦
                      </span>
                      <span class="text-2xl font-bold">For PR</span>
                    </div>
                  </div>
                </label>
              </div>
              
                <!-- Commented-out SearchDropdown -->
                <!-- <div>
                  <SearchDropdown
                    apiEndpoint="mrfs/rooms-warehouses-list"
                    :searchModel="searchLocation"
                    placeholder="Search Location"
                    itemLabel="name"
                    itemId="id"
                    inputId="locationName"
                    formatLabel="dashed_and_parenthesis"
                    @item-selected="(item) => fillPrincipalLocationForm(item)"
                    dataKey="roomsWarehouses"
                    returnName="['sku','name','buildingAbbre']"
                  />
                </div> -->
                <!-- <div class="flex justify-end items-center gap-6 py-4 max-sm:w-full ">
                  <button
                    @click.prevent="generateItemField"
                    type="button"
                    class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 
                          text-white font-medium rounded text-sm px-6 py-2
                          shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <i class="fa fa-plus text-lg"></i>
                    Add Items
                  </button>
                </div> -->
              </div>
              <!-- Mobile view: Form-like layout -->
              <div class="block bg-gray-200 text-xs">
                <div
                  v-for="(i, ii) in mrfForm.items"
                  :key="i.item_id"
                  class="bg-white my-2 p-3 block md:flex items-center border-2 rounded border-black"
                >
                  <!-- Item Image Viewer (1/4 of the width) -->
                  <div class="ml-4 flex-0 w-1/4 hidden lg:inline">
                    <ItemImageViewer
                      v-if="i.item_id"
                      :item_id="i.item_id"
                      :thumbnail="i.thumb_nail"
                      :canDeleteImage="false"
                      :title="i.item_name"
                    />
                  </div>

                  <!-- Details (remaining space, center) -->
                  <div class="ml-4 flex-1">
                    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Item -->
                      <div class="mb-2">
                        <label
                          for="itemsName"
                          class="block text-sm font-medium text-gray-500 mb-1"
                          >Item:</label
                        >
                        <div
                          class="w-full rounded px-2 py-2 border border-2 font-bold bg-gray-200"
                          >
                          {{i.item_number}} - {{ i.item_name }} [{{ i.unit_abbre }}]
                        </div>
                        <!-- <SearchDropdown
                          apiEndpoint="items/list"
                          :searchModel="searchItem"
                          placeholder="Search Items"
                          itemLabel="name"
                        itemId="id"
                          inputId="itemsName"
                          class="text-xs"
                          :defaultValue="i.item_name"
                          formatLabel="none"
                          @item-selected="(item) => fillItemsForm(item, ii)"
                          dataKey="items"
                          returnName="['itemCompleteName']"
                        /> -->
                      </div>
                      <div class="inline lg:hidden">
                        <label
                          for="itemsName"
                          class="block text-sm font-medium text-gray-500 mb-1"
                          >Image:</label
                        >
                        <ItemImageViewer
                          v-if="i.item_id"
                          :item_id="i.item_id"
                          :thumbnail="i.thumb_nail"
                          :canDeleteImage="false"
                          :title="i.item_name"
                        />
                      </div>
                      <!-- Location -->
                      <div class="mb-2">
                        <label
                          for="locationName"
                          class="block text-sm font-medium text-gray-500 mb-1"
                          >Stock to Warehouse: <span class="text-red-500 italic">(Optional)</span></label
                        >
                        <SearchDropdown
                          apiEndpoint="mrfs/rooms-warehouses-list"
                          :searchModel="searchLocation"
                          placeholder="Search Location"
                          itemLabel="name"
                          itemId="id"
                          :key="i.room_location_name"
                          inputId="locationName"
                          :defaultValue="i.room_location_name"
                          formatLabel="none"
                          @item-selected="(item) => fillLocationForm(item, ii)"
                          dataKey="roomsWarehouses"
                          returnName="['completeName']"
                        />
                        <!-- Checkbox to apply selected location to all entries -->
                      <div class="mt-2">
                        <label class="flex items-center text-sm font-medium text-red-500">
                          <input
                            type="checkbox"
                            v-model="i.apply_location_to_all"
                            @change="applyLocationToAll(i)"
                            class="mr-2"
                          />
                          Apply this location to all items
                        </label>
                      </div>
                      </div>
                    </div>
                    <!-- Proof -->
                    <div class="ml-4 flex-1">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <!-- Left Column: Sample/Damage Item/Comparison -->
                          <div class="mb-2">
                            <label
                              for="proof"
                              class="block text-sm font-medium text-gray-500 mb-1"
                              >Sample/Damage Item/Comparison:</label
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

                          <!-- Right Column: To Employee -->
                        <div class="mb-4">
                              <label for="LeagueName" class="block text-sm font-medium text-gray-500">
                                To Purchaser: <span class="text-red-500 italic">(Optional)</span>
                              </label>

                              <div class="flex items-center mt-1">
                                <SearchDropdown
                                  apiEndpoint="employees/list"
                                  :searchModel="searchUser"
                                  placeholder="Search Employee"
                                  itemLabel="to_employee_name"
                                  itemId="id"
                                  inputId="employeeName"
                                  :key="i.to_employee_id"
                                  :defaultValue="i.to_employee_name"
                                  @item-selected="(data) => fillToEmployeeForm(data, ii)"
                                  dataKey="employees"
                                  returnName="['firstName','lastName']"
                                />
                              </div>

                              <label class="flex items-center text-sm font-medium text-red-500 mt-2">
                                <input
                                  type="checkbox"
                                  v-model="i.apply_to_all_item"
                                  @change="applyLocationToAllOptimized(i)"
                                  class="mr-2"
                                />
                                Apply to all items
                              </label>
                            </div>
                        </div>
                      </div>
                    <!-- Remarks -->
                    <div class="mb-2">
                      <label
                        for="remarks"
                        class="block text-sm font-medium text-gray-500 mb-1"
                        >Remarks:</label
                      >
                      <textarea
                        v-model="i.remarks"
                        placeholder="Input Item Remarks"
                        class="mt-1 p-2 border rounded-md w-full"
                        id="remarks"
                      ></textarea>
                    </div>
                      <div class="flex items-center justify-between space-x-2">
                        <div class="flex items-center space-x-2">
                          <button
                            @click.prevent="changeQuantity(-1, ii)"
                            title="Reduce Quantity"
                            class="text-red-500 hover:text-red-700 text-md focus:outline-none"
                          >
                            <i class="fas fa-minus"></i>
                          </button>
                            <div class="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
                              <input
                                type="text"
                                :value="i.quantity ? Number(i.quantity).toLocaleString() : ''"
                                @input="i.quantity = $event.target.value.replace(/,/g, '')"
                                :title="`${i.quantity_per_unit}/${i.unit_abbre}`"
                                class="w-24 text-center text-md md:text-lg text-gray-800 px-2 py-1 focus:ring-1 focus:ring-white focus:outline-none"
                              />
                              <span
                                class="px-3 py-2 bg-orange-600 text-white font-semibold text-sm md:text-base"
                              >
                                {{ i.unit_abbre }}
                              </span>
                            </div>
                              <button
                                @click.prevent="changeQuantity(1, ii)"
                                title="Add Quantity"
                                class="text-blue-500 hover:text-blue-700 text-md focus:outline-none"
                              >
                                <i class="fas fa-plus"></i>
                              </button>
                          </div>
                          <button
                            @click.prevent="removeItemField(ii)"
                            type="button"
                            class="hover:animate-pulse flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-2 rounded-md shadow focus:outline-none"
                            title="Remove Item"
                          >
                            <i class="fas fa-trash-alt text-base"></i>
                            <span class="text-sm">Remove</span>
                          </button>
                      </div>
                  </div>
                      <!-- Button (1/8 of the width, right side) -->
                      <!-- <div class="ml-4 flex-0 w-1/8">
                      </div> -->
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end py-4">
            <button
              type="submit"
              class="bg-green-500 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </Modal>
  <Modal
    :show="isBrandModalOpen"
    :maxWidth="'md'"
    title="Brand List"
    @close="isBrandModalOpen = false"
  >
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
              <td class="px-2 py-3 border text-center text-red-500 font-bold" colspan="5">
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
import { onMounted, ref, onUnmounted, watch } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import {
  VUE_APP_API_URL,
  DATE_NOW,
  COMPANIES,
  CATEGORIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import ItemImageViewer from "./ItemImageViewer.vue";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  warehouse_id: Number,
  data: Array,
});
const isAddModalOpen = ref(false);
const isBrandModalOpen = ref(false);
const companies = ref([]);
const categories = ref([]);
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const data = ref([]);
const imageFiles = ref([]);
const mrfForm = ref({
  mrf_id: 0,
  date_now: DATE_NOW(),
  our_company_id: 0,
  remarks: "",
  job_order_id: 0,
  job_order_number: "-",
  mrf_manual_number: "",
  employee_id: 0,
  employee_name: "",
  mrf_type: 1,
  is_stock: 0,
  estimated_date_arrival: '',
  proof_images: [],
  items: [
    {
      item_id: 0,
      item_name: "",
      quantity: 0,
      to_employee_id: 0,
      to_employee_name: "",
      quantity_per_unit: 0,
      sub_quantity: 0,
      description: "",
      remarks: "",
      room_location_number: 0,
      thumb_nail: "",
      item_number:'',
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
const searchItem = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchJO = ref({
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
  console.log(item);
  mrfForm.value.items[index].item_id = item.id;
  mrfForm.value.items[index].item_name = item.itemCompleteName ?? "-";
  mrfForm.value.items[index].to_employee_name = item.to_employee_name;
  mrfForm.value.items[index].unit_abbre = item.unitAbbre;
  mrfForm.value.items[index].unit_id = item.unitId;
  mrfForm.value.items[index].description = item.description;
  mrfForm.value.items[index].quantity_per_unit = item.quantityPerUnit;
  mrfForm.value.items[index].brand_id = item.brandId;
  mrfForm.value.items[index].brand_name = item.brandName;
  mrfForm.value.items[index].thumb_nail = item.thumb_nail;
  mrfForm.value.items[index].brand_abbre = item.brandAbbre;
  search.value.search = "";
};
const applyLocationToAll = (item) => {
  const { apply_location_to_all, room_location_number, room_location_name } = item;

  // Loop through all items
  mrfForm.value.items.forEach((locationItem) => {
    // Sync checkbox state
    locationItem.apply_location_to_all = apply_location_to_all;

    // If checked, copy the location to all
    if (apply_location_to_all) {
      locationItem.room_location_number = room_location_number;
      locationItem.room_location_name = room_location_name;
    }
  });
};

const applyLocationToAllOptimized = (item) => {
  const { apply_to_all_item, to_employee_id, to_employee_name } = item;

  // Prevent redundant updates if already synced
  if (!apply_to_all_item && mrfForm.value.items.every(i => !i.apply_to_all_item)) return;

  mrfForm.value.items.forEach((locationItem) => {
    if (locationItem !== item) {
      locationItem.apply_to_all_item = apply_to_all_item;

      if (apply_to_all_item) {
        locationItem.to_employee_id = to_employee_id;
        locationItem.to_employee_name = to_employee_name;
      }
    }
  });
};

const fillLocationForm = (item, index) => {
  const buildingAbbre = item.buildingAbbre ? `(${item.buildingAbbre})` : "";
  mrfForm.value.items[index].room_location_number = item.sku;
  mrfForm.value.items[index].room_location_name = item.completeName;

  searchLocation.value.search = "";
};
// const fillJobOrder = (data) => {
//   console.log(data);
//   mrfForm.value.job_order_id = data.jobOrderId;
//   mrfForm.value.job_order_number = data.jobOrderNumber;
// }
const fillJobOrder = (data) => {
  console.log(searchJO.value.search.length);
  if (searchJO.value.search.length == 0) {
    mrfForm.value.job_order_id = 0;
    mrfForm.value.job_order_number = "-";
  }
  mrfForm.value.job_order_id = data.id;
  mrfForm.value.job_order_number = data.jobOrderNumber;
};

const clearJobOrder = () => {
  mrfForm.value.job_order_id = 0;
  mrfForm.value.job_order_number = "-";
};

const handleItemImageUpload = (event, index) => {
  const files = event.target.files;
  if (files.length > 0) {
    // Add the files to the specific item in the form
    mrfForm.value.items[index].item_images = [...files];
  }
};

const fillUserForm = (user) => {
  mrfForm.value.employee_id = user.id;
  mrfForm.value.employee_name =
    user.employeeNumber +
    " - " +
    user.firstName +
    " " +
    user.lastName;

  searchUser.value.search = "";
};

const fillToEmployeeForm = (user, index) => {
  const item = mrfForm.value.items[index];
  item.to_employee_name = `${user.firstName} ${user.lastName}`;
  item.to_employee_id = user.id;
  searchUser.value.search = "";
  if (item.apply_to_all_item) {
    applyLocationToAllOptimized(item);
  }
};

const brandBehavior = (item_id, index) => {
  searchBrand.value.item_id = item_id;
  searchBrand.value.active_index = index;
  listBrands();
};
const changeQuantity = (delta, index) => {
  const newQuantity = (mrfForm.value.items[index].quantity ?? 0) + delta;
  if (newQuantity < 1) return; // Prevent quantity from going below 1

  mrfForm.value.items[index].quantity = newQuantity;
};
const selectedBrand = (brand) => {
  const pr_items = mrfForm.value.items[searchBrand.value.active_index];

  pr_items.brand_id = brand.itemBrandId;
  pr_items.brand_name = brand.itemBrandName;
  pr_items.brand_abbre = brand.brandAbbre;

  isBrandModalOpen.value = false;
};
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
const handlePagination = (page_num) => {
  console.log(page_num);
  searchBrand.value.page_num = page_num ?? 1;
  listBrands();
};
//add
const addMRFBehavior = () => {
  resetForm();
  companiesDropdown();
  categoryDropdown();
  getMRFUserDefaultData();
  mrfForm.value.items = props.data;

  isAddModalOpen.value = true;
  // console.log('from addMRFBehavior');
  // console.log(props.data);
};
const resetForm = () => {
  mrfForm.value.mrf_id = 0;
  mrfForm.value.date_now = DATE_NOW();
  mrfForm.value.our_company_id = 0;
  mrfForm.value.remarks = "";
  mrfForm.value.mrf_manual_number = "";
  mrfForm.value.items = [
    {
      cart_id: 0,
      item_id: 0,
      item_name: "",
      to_employee_name: "",
      brand_id: 0,
      quantity: 0,
      quantity_per_unit: 0,
      sub_quantity: 0,
      description: "",
      remarks: "",
      item_images: [],
      room_location_number: 0,
      room_location_name: "",
      apply_location_to_all: false,
      apply_to_all_item: false,
    },
  ];
};
const addMRF = async () => {
  try {
    // Show processing alert
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we process your request.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const invalidLocationItems = mrfForm.value.items.filter(
      (item) => item.room_location_number === 0
    );

    if (invalidLocationItems.length > 0) {
      Swal.close();
      Alert("error", "Error", "Some items have empty Item Location.");
      return;
    }

    // Create a deep copy of mrfForm and remove thumb_nail from items
    const formDataObj = JSON.parse(JSON.stringify(mrfForm.value));
    formDataObj.items = formDataObj.items.map((item) => {
      const { thumb_nail, ...itemWithoutThumbNail } = item;
      return itemWithoutThumbNail;
    });

    // Create FormData from the cleaned object
    const formData = FormDx(formDataObj);

    // Upload item images
    mrfForm.value.items.forEach((item, index) => {
      item.item_images.forEach((file, i) => {
        formData.append(`items[${index}][item_images][${i}]`, file);
      });
    });

    // Append proof image files
    if (imageFiles.value?.length > 0) {
      imageFiles.value.forEach((file) => {
        formData.append("proof_images[]", file);
      });
    }

    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/add`,
      formData,
      BearToken(token)
    );

    Swal.close();
    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};

const getMRFUserDefaultData = async () => {
  try {
    const response = await axios.post(
      `${VUE_APP_API_URL}users/get-default-warehouse`,
      { id: 0 }, // Assuming you want to fetch all warehouses
      BearToken(token)
    );

    const { warehouseId, employeeId, employeeName } = response.data;

    mrfForm.value.from_warehouse_id = warehouseId || 0;
    mrfForm.value.employee_id = employeeId || 0;
    mrfForm.value.employee_name = employeeName || "";
  } catch (error) {
    console.error("Error fetching warehouses:", error);
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
  if (mrfForm.value.items.length > 1) {
  mrfForm.value.items.splice(index, 1);
  }
};
const companiesDropdown = async () => {
  companies.value = await COMPANIES();
};
const categoryDropdown = async () => {
  categories.value = await CATEGORIES();
};
const getCategoryLabel = (categoryId) => {
  const category = categories.value.find((c) => c.value === categoryId);
  return category ? category.label : "--Select Category--";
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
<style scoped>
.cart-container {
}

.cart-content {
  max-height: calc(100vh - 160px); /* Adjust based on header/footer height */
}

.cart-items {
  padding-right: 16px; /* To handle scrollbar width */
}

.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.cart-item img {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.cart-item h3 {
  margin: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
}

.quantity-display {
  min-width: 2rem;
  text-align: center;
}
</style>
