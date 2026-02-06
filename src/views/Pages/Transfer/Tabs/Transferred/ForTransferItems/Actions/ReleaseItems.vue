<template>
  <button
    @click.prevent="cartBehavior()"
    type="button"
    title="Transfer Item"
    class="bg-yellow-500 hover:opacity-70 focus:bg-yellow-300 text-white font-bold rounded-l text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i :class="props.isReleasing ? 'fas fa-truck' : 'fa fa-edit'"></i>
    <span v-if="props.isReleasing">&nbsp;Transfer</span>
    <span v-else>&nbsp;Edit</span>
  </button>
  <!-- Add Modal -->
  <Modal
    :show="assignBinModalOpen"
    :maxWidth="'6xl'"
    title="Direct Release"
    @close="assignBinModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="directReleaseItem()">
        <!-- <div v-if="assignForm.all_stocks == 0 && assignForm.all_sub_stocks == 0" class="mb-2">
            <div class="bg-red-500 border border-red-600 text-white px-4 py-2 rounded-md block text-xl animate-pulse text-center shadow-lg">
              <i class="fas fa-exclamation-circle text-xl mr-2"></i>
              <span>Item {{ assignForm.item_name }} is out of Stocks</span>
            </div>
          </div> -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 border-b--2 border-dashed">
          <div class="grid-cols-span-3 md:grid-cols-span-1">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
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
          <div class="mb-4 grid-cols-span-2">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
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
        </div>
        <div
          v-if="assignForm.mrf_type == 2"
          class="grid grid-cols-1 md:grid-cols-2 gap-6 border-b--2 border-dashed mt-4 mb-4"
        >
          <div class="md:cols-span-2">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Requestor Warehouse</label
              >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <div class="flex">
              <input
                type="text"
                id="ProductName"
                disabled
                v-model="assignForm.from_warehouse_name"
                placeholder="Input Rack Name"
                class="mt-1 p-2 border rounded-l w-full bg-gray-200"
              />
              <button
                type="button"
                disabled
                class="mt-1 p-2 text-green-500 bg-gray-200 rounded-r"
              >
                <i
                  class="fa fa-2xl animate__animated animate__fadeInLeft fa-arrow-right"
                ></i>
              </button>
            </div>
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Releasing Warehouse</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <select
              placeholder="Select Building Name"
              class="mt-1 p-2 border rounded-md w-full"
              v-model="search.warehouse_id"
              @change.prevent="updateWarehouseStocks()"
            >
              <option v-for="(w, ww) in warehouses" :key="w.id" :value="w.warehouseId">
                {{ w.warehouseName }}
              </option>
            </select>
          </div>
        </div>
        <div class="block w-full overflow-auto mb-4">
          <!-- Table to display products -->
          <label for="LeagueName" class="block text-sm font-medium text-gray-700 mb-2"
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
                  Warehouse
                </th>
                <!-- <th
                    scope="col"
                    class="px-2 py-3 border text-right text-sm font-medium uppercase tracking-wider"
                  >
                    Units
                  </th> -->
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
                <td class="px-2 py-2 border">{{ cart.warehouseName }}</td>
                <!-- <td class="px-2 py-2 border text-right">
                    {{ cart.quantityPerUnit }} /{{ cart.unitAbbre }}
                  </td> -->
                <td class="px-2 py-2 border text-right">
                  {{ cart.floatStocks }} {{ cart.unitAbbre }}
                </td>
              </tr>
              <tr v-if="item_locations?.length == 0">
                <td
                  class="px-2 py-2 border text-center text-red-500 font-bold"
                  colspan="2"
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
            <label for="currentQuantity" class="block text-sm font-medium text-gray-700"
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
            <label for="newQuantity" class="block text-sm font-medium text-gray-700"
              >Release Quantity</label
            >
            <div class="flex items-center mt-1">
              <input
                type="number"
                id="newQuantity"
                v-model="assignForm.released_quantity"
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
          class="grid grid-cols-3 gap-6 px-3 border-y-2 mb-2 py-2"
          v-if="assignForm.unpack_ingredient_id"
          >
          <!-- Item -->
          <div class="mb-2">
            <label for="itemsName" class="block text-sm font-medium text-gray-500 mb-1"
              >Unpack Item:</label
            >
            <input
              type="text"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              disabled
              v-model="assignForm.unpack_ingredient_name"
            />
          </div>
          <div class="mb-2">
            <label for="itemsName" class="block text-sm font-medium text-gray-500 mb-1"
              >Unpack Quantity:</label
            >
            <div class="flex">
              <input
                type="text"
                class="p-2 border rounded-l w-full bg-gray-200"
                disabled
                v-model="assignForm.unpack_ingredient_quantity"
              />
              <button
                type="button"
                class="hover:animate-pulse shadow flex justify-center items-center rounded-r p-2 bg-blue-500 focus:outline-none text-white"
              >
                <span class="text-sm">{{ assignForm.unpack_ingredient_unit }}</span>
              </button>
            </div>
          </div>
          <div class="mb-2">
            <label for="itemsName" class="block text-sm font-medium text-gray-500 mb-1"
              >Unpack Total:</label
            >
            <div class="flex">
              <p class="hidden">
                {{
                  (assignForm.unpack_ingredient_quantity_total =
                    assignForm.unpack_ingredient_quantity *
                    (assignForm.released_quantity ?? 0))
                }}
              </p>
              <input
                type="text"
                class="p-2 border rounded-l w-full bg-gray-200"
                disabled
                v-model="assignForm.unpack_ingredient_quantity_total"
              />
              <button
                type="button"
                class="hover:animate-pulse shadow flex justify-center items-center rounded-r p-2 bg-blue-500 focus:outline-none text-white"
              >
                <span class="text-sm">{{ assignForm.unpack_ingredient_unit }}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
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
            :disabled="isLoading"
            :class="isLoading ? 'opacity-50' : ''"
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
import {
  FormDx,
  BearToken,
  Alert,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

//modules

const token = localStorage.getItem("token");
const warehouses = ref([]);
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
  mrf_item_id: Number,
  warehouse_id: Number,
  isReleasing: {
    type: Boolean,
    default: false,
  },
});
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const isLoading = ref(false);
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
  is_assign_serial_number: true,
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

  assignForm.value.mrf_item_id = data.id;
  assignForm.value.mrf_id = data.mrfId;
  assignForm.value.item_id = data.itemId;
  assignForm.value.item_sku = data.itemSku ?? "Not Set";
  assignForm.value.item_name = data.itemName;
  assignForm.value.warehouse_id = props.warehouse_id;
  assignForm.value.warehouse_name = data.warehouseName;
  assignForm.value.new_stocks = 0;

  const released_qty =
    data.quantity - data.releasedQuantity < 0 ? 0 : data.quantity - data.releasedQuantity;
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

  assignForm.value.location_name = data.locationName ?? "-";
  assignForm.value.is_assign_serial_number = true;

  assignForm.value.unpack_ingredient_name = data.unpackIngredientName ?? "";
  assignForm.value.unpack_ingredient_id = data.unpackIngredientId ?? 0;
  assignForm.value.unpack_ingredient_unit = data.unpackIngredientUnitAbbre ?? "";
  assignForm.value.unpack_ingredient_quantity = data.unpackQuantity ?? 0;

  getItemLocation();
  getUserWarehouses();

  assignBinModalOpen.value = true;
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
const updateWarehouseStocks = async () => {
  try {
    isLoading.value = true;
    assignForm.value.warehouse_id = search.value.warehouse_id;
    const response = await axios.post(
      VUE_APP_API_URL + "warehouse-has-items/get-item-in-warehouses",
      { warehouse_id: search.value.warehouse_id, item_id: assignForm.value.item_id },
      BearToken(token)
    );
    assignForm.value.current_quantity = response.data.floatStocks ?? 0;
    isLoading.value = false;
    assignForm.value.warehouse_id = search.value.warehouse_id;
    // console.log('Test in Update waerhouse stocks function '+assignForm.value.warehouse_id +' --> '+search.value.warehouse_id)
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};
const directReleaseItem = async () => {
  try {
    // Show confirmation dialog
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
      Swal.fire({
        title: "Processing...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      assignForm.value.released_quantity = -Math.abs(assignForm.value.released_quantity);

      assignForm.value.is_assign_serial_number = assignForm.value.is_assign_serial_number
        ? 1
        : 0;
      const formData = FormDx(assignForm.value);
      const response = await axios.post(
        `${VUE_APP_API_URL}warehouse-has-items/out-item-from-float-stocks-mrf-transfer`,
        formData,
        BearToken(token)
      );

      assignBinModalOpen.value = false;
      Swal.close();
      Alert("success", "Success", response.data.message);
      emits("transaction_id", Math.random());
    }
  } catch (error) {
    Swal.close();
    // Revert quantities to positive after a successful response
    assignForm.value.released_quantity = Math.abs(assignForm.value.released_quantity);
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

const getUserWarehouses = async () => {
  try {
    warehouses.value = [];
    const response = await axios.post(
      `api/users/warehouses-dropdown`,
      { id: 0 }
    );
    warehouses.value = response.data.userWarehouses || [];
    assignForm.value.warehouse_id = response.data.userAssignedWarehouseId
    search.value.warehouse_id = response.data.userAssignedWarehouseId
    console.log('WarehosueId '+ assignForm.value.warehouse_id)
  } catch (error) {
    console.error("Error fetching warehouses:", error);
  }
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
