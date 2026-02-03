<template>
  <button
    @click.prevent="(assignBinModalOpen = true), cartBehavior()"
    type="button"
    title="Release From Bin"
    class="bg-green-500 hover:opacity-70 focus:bg-green-300 text-white font-bold rounded-l text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-handshake"></i>
    Release
  </button>
  <!-- Add Modal -->
  <Modal
    :show="assignBinModalOpen"
    :maxWidth="'6xl'"
    title="Release Item to Requester"
    @close="assignBinModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="releaseItem()">
        <!-- <div v-if="assignForm.all_stocks == 0 && assignForm.all_sub_stocks == 0" class="mb-2">
          <div class="bg-red-500 border border-red-600 text-white px-4 py-2 rounded-md block text-xl animate-pulse text-center shadow-lg">
            <i class="fas fa-exclamation-circle text-xl mr-2"></i>
            <span>Item {{ assignForm.item_name }} is out of Stocks</span>
          </div>
        </div> -->
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-6 border-b--2 border-dashed"
        >
          <div class="grid-cols-span-3 md:grid-cols-span-1">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >SKU</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              disabled
              v-model="assignForm.item_sku"
              placeholder="Input Rack Name"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4 grid-cols-span-3 md:col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Item</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              disabled
              v-model="assignForm.item_name"
              placeholder="Input Rack Name"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4 grid-cols-span-3 md:grid-cols-1">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Type</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <p class="mt-1 p-2 border rounded-md w-full bg-gray-200">
              {{ typeFormatter(assignForm.is_fixed) }}
            </p>
            <small
              class="mt-1 p-2 text-red-500 font-bold"
              v-if="assignForm.is_fixed == 1"
              >Autocreate serial number of fixed asset!</small
            >
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF Type</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <p
              v-if="assignForm.mrf_type == 1"
              class="text-teal-500 font-bold mt-1 p-2 border bg-gray-200 rounded-md w-full"
            >
              Request Item
            </p>
            <p
              v-else
              class="text-blue-500 font-bold mt-1 p-2 border bg-gray-200 rounded-md w-full"
            >
              Transfer Item
            </p>
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Warehouse</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <select
              placeholder="Select Building Name"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              disabled
              v-model="search.warehouse_id"
            >
              <option
                v-for="(w, ww) in warehouse"
                :key="w.id"
                :value="w.warehouseId"
              >
                {{ w.warehouseName }}
              </option>
            </select>
          </div>
        </div>
        <div
          v-if="assignForm.mrf_type == 2"
          class="grid grid-cols-1 md:grid-cols-2 gap-6 border-b--2 border-dashed mt-4 mb-4"
        >
          <div class="">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Source Location</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              disabled
              v-model="assignForm.from_warehouse_name"
              placeholder="Input Rack Name"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Destination Location</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              disabled
              v-model="assignForm.to_warehouse_name"
              placeholder="Input Rack Name"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
        </div>
        <div class="block w-full overflow-auto mb-4">
          <!-- Table to display products -->
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Item Locations</label
          >
          <table class="min-w-full divide-y divide-gray-200 text-nowrap">
            <!-- Table headers -->
            <thead class="shadow" :class="DEFAULT_BG">
              <tr class="border-b-2 border-solid border-yellow-500 text-white">
                <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Brand
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Warehouse
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-right text-sm font-medium uppercase tracking-wider"
                >
                  Units
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-right text-sm font-medium uppercase tracking-wider"
                >
                  Float Stocks
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loop through products and display them -->
              <tr
                v-for="cart in item_locations"
                v-if="item_locations?.length > 0"
                :key="cart.id"
              >
                <td class="px-2 py-2 border">
                  {{ cart.itemSku }} - {{ cart.itemName }}
                </td>
                <td class="px-2 py-2 border">
                  {{ cart.brandName ?? "No Brand" }}
                </td>
                <td class="px-2 py-2 border">{{ cart.warehouseName }}</td>
                <td class="px-2 py-2 border text-right">
                  {{ cart.quantityPerUnit }} /{{ cart.unitAbbre }}
                </td>
                <td class="px-2 py-2 border text-right">
                  {{ cart.floatStocks }} {{ cart.unitAbbre }}
                </td>
              </tr>
              <tr v-if="item_locations?.length == 0">
                <td
                  class="px-2 py-2 border text-center text-red-500 font-bold"
                  colspan="7"
                >
                  ***No Location Found***
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Current Quantity Input -->
          <div class="mb-4">
            <label
              for="currentQuantity"
              class="block text-sm font-medium text-gray-700"
              >Float Current Quantity</label
            >
            <div class="flex items-center mt-1">
              <input
                type="number"
                id="currentQuantity"
                v-model="assignForm.current_quantity"
                min="0"
                placeholder="Input Item Quantity"
                disabled
                class="p-2 border rounded-l-md w-full bg-gray-200"
              />
              <button
                type="button"
                :title="`${assignForm.quantity_per_unit} ${assignForm.sub_unit_abbre} / ${assignForm.unit_abbre}`"
                class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-12 flex items-center"
              >
                {{ assignForm.unit_abbre }}
              </button>
            </div>
          </div>
          <!-- Movable Quantity Input -->
          <div class="mb-4">
            <label
              for="newQuantity"
              class="block text-sm font-medium text-gray-700"
              >Release Quantity</label
            >
            <div class="flex items-center mt-1">
              <input
                type="number"
                id="newQuantity"
                v-model="assignForm.released_quantity"
                min="1"
                :max="assignForm.current_quantity"
                placeholder="Input Item Quantity"
                class="p-2 border rounded-l-md w-full"
              />
              <button
                type="button"
                :title="`${assignForm.quantity_per_unit} ${assignForm.sub_unit_abbre} / ${assignForm.unit_abbre}`"
                class="border border-l-0 rounded-r-md px-3 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 h-12 flex items-center"
              >
                {{ assignForm.unit_abbre }}
              </button>
            </div>
          </div>
          <!-- <div class="mb-4" v-if="assignForm.is_fixed == false">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Select Transfer Location</label
            >
            <div class="flex items-center mt-1">
              <SearchDropdown
                      apiEndpoint="mrfs/rooms-warehouses-list"
                      :searchModel="searchLocation"
                      placeholder="Search Location"
                      itemLabel="name"
                      itemId="id"
                      inputId="locationName"
                      :defaultValue="assignForm.location_name"
                      @item-selected="(data) => fillFixedAssetLocationForm(data)"
                      dataKey="roomsWarehouses"
                      returnName="['sku','name']"
                    />
            </div>
          </div>
          <div class="mb-4" v-if="assignForm.is_fixed == false">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Date to Deliver</label
            >
            <div class="flex items-center mt-1">
              <input
                type="date"
                placeholder="Input Location"
                v-model="assignForm.delivery_date"
                required
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
          </div> -->
        </div>
        <div
          class="block"
          v-if="assignForm.mrf_type == 1"
        >
        <div class="flex justify-end">
          <button
          @click.prevent="generateLocationField()"
          type="button"
          class="px-4 py-2 font-bold hover:bg-blue-500 bg-blue-600 mb-2 rounded shadow text-white text-md float-right"
        >
          <i class="fa fa-map-marker-alt"></i> Add Location
        </button>
        </div>  
          <!-- Mobile view: Form-like layout -->
          <div v-if="isMobile" class="block lg:hidden">
            <div
              v-for="(i, ii) in assignForm.item_locations"
              v-if="assignForm.item_locations.length > 0"
              :key="ii"
              class="mb-4 p-4 border rounded-lg shadow"
            >
              <!-- Item Dropdown -->
              <div class="block mb-2">
                <label
                  for="itemsName"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Location</label
                >
                <div class="flex w-full z-900">
                  <SearchDropdown
                    apiEndpoint="mrfs/rooms-warehouses-list"
                    :searchModel="searchLocation"
                    placeholder="Search Location"
                    itemLabel="name"
                    itemId="id"
                    inputId="locationName"
                    formatLabel="dashed_and_parenthesis"
                    @item-selected="(data) => fillLocationForm(data, ii)"
                    dataKey="roomsWarehouses"
                    returnName="['sku','name','buildingAbbre']"
                  />
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
                    @input.prevent="validateQuantity()"
                    autocomplete="off"
                    min="1"
                    placeholder="Input Item Quantity"
                    class="mt-1 p-2 border rounded-l-md w-full"
                  />
                  <button
                    type="button"
                    class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                  >
                    {{ assignForm.unit_abbre }}
                  </button>
                </div>
              </div>
              <!-- Remarks -->
              <div class="mb-2 border-t-2">
                <div class="flex justify-end">
                  <button
                    @click.prevent="removeLocationField(ii)"
                    type="button"
                    title="Remove Item"
                    class="bg-red-500 text-white rounded font-bold rounded-r text-sm md:text-md p-2 mt-1 float-end text-nowrap"
                  >
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>

            <p
              v-if="assignForm.item_locations.length === 0"
              class="text-red-500 font-bold text-center"
            >
              **No items found**
            </p>
          </div>
          <div class="flex" v-else>
            <table class="min-w-full divide-y divide-gray-200 text-nowrap">
              <!-- Table headers -->
              <thead
                class="border-b border-yellow-500 text-white shadow"
                :class="DEFAULT_BG"
              >
                <tr class="text-nowrap text-md">
                  <th
                    scope="col"
                    class="px-2 py-3 border text-left text-md font-medium uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    width="20%"
                    class="px-2 py-3 border text-left text-md font-medium uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    class="px-2 py-3 border text-center text-md font-medium uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 text-nowrap">
                <!-- Loop through products and display them -->
                <tr
                  v-for="(i, ii) in assignForm.item_locations"
                  v-if="assignForm.item_locations.length > 0"
                  :key="ii"
                >
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
                        @item-selected="(data) => fillLocationForm(data, ii)"
                        dataKey="roomsWarehouses"
                        returnName="['sku','name','buildingAbbre']"
                      />
                    </div>
                  </td>
                  <td class="px-2 py-3 border">
                    <div class="flex">
                      <input
                        type="number"
                        id="ProductName"
                        v-model="i.quantity"
                        @input.prevent="validateQuantity()"
                        autocomplete="off"
                        min="1"
                        placeholder="Input Item Quantity"
                        class="mt-1 p-2 border rounded-l-md w-full"
                      />
                      <button
                        type="button"
                        class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                      >
                        {{ assignForm.unit_abbre }}
                      </button>
                    </div>
                  </td>
                  <td class="px-2 py-3 border">
                    <div class="flex justify-center">
                      <button
                        @click.prevent="removeLocationField(ii)"
                        type="button"
                        title="Remove Item"
                        class="bg-red-500 text-white rounded font-bold rounded-r text-sm md:text-md p-2 mt-1 float-end text-nowrap"
                      >
                        <i class="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="assignForm.item_locations == 0">
                  <td class="px-2 py-3 border" colspan="6">
                    <p class="text-red-500 font-bold text-center">
                      **Assign Item Location*
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
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            v-model="assignForm.remarks"
            placeholder="Input Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Release
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, watch, onUnmounted, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, useDebounce, typeFormatter, handleApiError } from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

const token = localStorage.getItem("token");
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
  mrf_id: Number,
  warehouse_id: Number,
});
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const assignBinModalOpen = ref(false);
const item_locations = ref([]);
const assignForm = ref({
  receive_item_id: 0,
  item_id: 0,
  item_name: "",
  warehouse_id: 0,
  to_warehouse_id: 0,
  to_warehouse_name: "",
  warehouse_name: "",
  cart_id: 0,
  cart_name: "",
  brand_id: 0,
  brand_name: "",
  current_quantity: 0,
  unit_abbre: "",
  released_quantity: 0,
  quantity_per_unit: 0,
  is_fixed: 0,
  location_sku: "",
  location_name: "",
  item_locations: [
    {
      location_sku: 0,
      quantity: 0,
    },
  ],
  remarks: "",
});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  warehouse_id: 0,
});
const searchLocation = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchWarehouse = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const cartBehavior = () => {
  const data = props.data;
  resetForm();
  console.log(data);
  assignForm.value.mrf_item_id = data.id;
  assignForm.value.mrf_id = data.mrfId;
  assignForm.value.item_id = data.itemId;
  assignForm.value.item_sku = data.itemSku;
  assignForm.value.item_name = data.itemName;
  assignForm.value.warehouse_id = props.warehouse_id;
  assignForm.value.warehouse_name = data.warehouseName;
  assignForm.value.new_stocks = 0;

  const released_qty =
    data.quantity - data.releasedQuantity < 0
      ? 0
      : data.quantity - data.releasedQuantity;
  assignForm.value.released_quantity = released_qty ?? 0;
  assignForm.value.unit_abbre = data.unitAbbre;

  assignForm.value.quantity_per_unit = data.quantityPerUnit;
  assignForm.value.brand_id = data.brandId;
  assignForm.value.brand_name = data.brandName;
  assignForm.value.brand_abbre = data.brandAbbre;
  assignForm.value.is_fixed = data.isFixed;

  assignForm.value.all_stocks = data.allStocks ?? 0;
  assignForm.value.all_sub_stocks = data.allSubStocks ?? 0;
  assignForm.value.mrf_type = data.mrfType;
  search.value.warehouse_id = props.warehouse_id ?? 0;

  assignForm.value.to_warehouse_id = data.toWarehouseId;
  assignForm.value.to_warehouse_name = data.toWarehouseName;

  assignForm.value.from_warehouse_id = data.fromWarehouseId;
  assignForm.value.from_warehouse_name = data.fromWarehouseName;

  getItemLocation();
};
const resetForm = () => {
  assignForm.value = {
    receive_item_id: 0,
    item_id: 0,
    item_name: "",
    warehouse_id: 0,
    to_warehouse_id: 0,
    to_warehouse_name: "",
    warehouse_name: "",
    cart_id: 0,
    cart_name: "",
    brand_id: 0,
    brand_name: "",
    current_quantity: 0,
    unit_abbre: "",
    released_quantity: 0,
    quantity_per_unit: 0,
    is_fixed: 0,
    location_sku: "",
    location_name: "",
    item_locations: [
      {
        location_sku: 0,
        quantity: 0,
      },
    ],
    remarks: "",
  };
};
const releaseItem = async () => {
  try {
    // Show confirmation dialog
    const MAIN_URL =
      assignForm.value.is_fixed == 1
        ? "out-item-from-floatstocks-fixed-asset"
        : "out-item-from-floatstocks-fastmoving";
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to release this item from the bin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, release it!",
      cancelButtonText: "No, cancel",
    });

    // Proceed if user confirms
    if (result.isConfirmed) {
      assignForm.value.released_quantity = -Math.abs(
        assignForm.value.released_quantity
      );
      const formData = FormDx(assignForm.value);
      const response = await axios.post(
        `${VUE_APP_API_URL + "warehouse-has-items/" + MAIN_URL}`,
        formData,
        BearToken(token)
      );

      assignBinModalOpen.value = false;
      Alert("success", "Success", response.data.message);
      emits("transaction_id", Math.random());
    }
  } catch (error) {
    // Revert quantities to positive after a successful response
    assignForm.value.released_quantity = Math.abs(
      assignForm.value.released_quantity
    );
    emits("transaction_id", Math.random());
    handleApiError(error);
  }
};
const isQuantityExceeded = computed(() => {
  const totalQuantity = assignForm.value.item_locations.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  return totalQuantity > assignForm.value.released_quantity;
});
const validateQuantity = () => {
  if (isQuantityExceeded.value) {
    // Show an alert if the quantity exceeds the released quantity
    Swal.fire({
      icon: "error",
      title: "Quantity Exceeded",
      text: "The total quantity cannot exceed the released quantity.",
      confirmButtonText: "OK",
    });
  }
};
const getItemLocation = async () => {
  try {
    item_locations.value = [];
    const formData = FormDx({
      warehouse_id: search.value.warehouse_id,
      item_id: assignForm.value.item_id,
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}warehouse-has-items/get-item-in-warehouses`,
      formData,
      BearToken(token)
    );
    // bins.value = response.data.bin;
    if (!response.data.error) {
      item_locations.value = response.data.itemInWarehouses;
      assignForm.value.current_quantity = response.data.floatStocks ?? 0;
    }
  } catch (error) {
    handleApiError(error);
  }
};
const generateLocationField = async () => {
  let location_data = {
    location_sku: "",
    quantity: 0,
  };

  // Assuming salesForm.charges is an array
  assignForm.value.item_locations.push(location_data);
};
const removeLocationField = (index) => {
  // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
  assignForm.value.item_locations.splice(index, 1);
};

//location dropdown
const fillLocationForm = (item, index) => {
  const buildingAbbre = item.buildingAbbre ? `(${item.buildingAbbre})` : "";
  assignForm.value.item_locations[index].location_sku = item.sku;
  assignForm.value.item_locations[index].location_name =
    item.sku + "-" + item.name + " " + buildingAbbre;

  searchLocation.value.search = "";
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
