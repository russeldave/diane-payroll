<template>
  <button
    @click.prevent="(assignBinModalOpen = true), cartBehavior()"
    type="button"
     title="Release From Bin"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded-l text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-shopping-cart"></i>
   Cart
  </button>
  <!-- Add Modal -->
  <Modal :show="assignBinModalOpen" :maxWidth="'6xl'" title="Release From Cart" @close="assignBinModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="releaseItemFromCart()">
        <!-- <div v-if="assignForm.all_stocks == 0 && assignForm.all_sub_stocks == 0" class="mb-2">
          <div class="bg-red-500 border border-red-600 text-white px-4 py-2 rounded-md block text-xl animate-pulse text-center shadow-lg">
            <i class="fas fa-exclamation-circle text-xl mr-2"></i>
            <span>Item {{ assignForm.item_name }} is out of Stocks</span>
          </div>
        </div> -->
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-6 border-b--2 border-dashed"
        >
          <div class="">
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
          <div class="mb-4 col-span-2">
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
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Type</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <p  class="mt-1 p-2 border rounded-md w-full bg-gray-200"> {{ assignForm.is_fixed == 1 ? 'Fixed Asset' : 'Movable Asset' }}</p>
            <small  class="mt-1 p-2 text-red-500 font-bold" v-if="assignForm.is_fixed == 1">Autocreate serial number of fixed asset!</small>
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF Type</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <p  class="mt-1 p-2 border rounded-md w-full bg-gray-200"> {{ assignForm.mrf_type == 1 ? 'Request Item' : 'Transfer Item' }}</p>
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
        <div class="block w-full overflow-auto mb-4">
          <!-- Table to display products -->
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Item Locations</label
          >
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class="bg-gray-100 shadow">
              <tr class="border-b-2 border-solid border-yellow-500 bg-yellow-900 text-white">
                <th
                  scope="col"
                 class="px-1 py-1 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                 class="px-1 py-1 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Cart
                </th>
                <th
                  scope="col"
                 class="px-1 py-1 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Warehouse
                </th>
                <th
                  scope="col"
                 class="px-1 py-1 border text-right text-sm font-medium uppercase tracking-wider"
                >
                  Units
                </th>
                <th
                  scope="col"
                  class="px-1 py-1 border text-right text-sm font-medium uppercase tracking-wider"
                >
                  Stocks
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loop through products and display them -->
              <tr v-for="cart in cart_locations" v-if="cart_locations?.length > 0" :key="cart.id">
                <td class="px-2 py-2 border">{{  cart.itemSku }} - {{ cart.itemName }}</td>
                <td class="px-2 py-2 border">{{ cart.cartSku }}</td>
                <td class="px-2 py-2 border">{{ cart.warehouseName }}</td>
                <td class="px-2 py-2 border text-right">{{ cart.quantityPerUnit }} /{{ cart.unitAbbre }}</td>
                <td class="px-2 py-2 border text-right">{{ cart.quantity }} {{ cart.unitAbbre }}</td>
              </tr>
              <tr v-else>
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
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-red-500"
            >Scan Cart For Confirmation</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <div class="flex items-center mt-1">
            <input
              type="text"
              placeholder="Input/Scan Cart SKU"
              v-model="assignForm.cart_name"
              @input.prevent="searchcartBehavior()"
              required
              class="mt-1 p-2 border rounded-md w-full border-red-500"
            />
          </div>
          <small v-if="cart_error" class="text-red-500 font-bold text-xs">{{
            cart_error
          }}</small>
          <small
            v-if="assignForm.cart_id != 0"
            class="text-lime-500 font-bold text-xs"
            ><i class="fa fa-check-circle text-lime-500"></i> Cart
            Available</small
          >
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Current Quantity Input -->
          <div class="mb-4">
            <label
              for="currentQuantity"
              class="block text-sm font-medium text-gray-700"
              >Current Cart Quantity</label
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
              >Movable Cart Quantity</label
            >
            <div class="flex items-center mt-1">
              <input
                type="number"
                id="newQuantity"
                v-model="assignForm.released_quantity"
                :disabled="assignForm.cart_id == 0"
                min="0"
                :max="assignForm.current_quantity"
                :class="assignForm.cart_id == 0 ? 'bg-gray-200' : ''"
                placeholder="Input Item Quantity"
                class="p-2 border rounded-l-md w-full"
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
          <!-- Current Sub Quantity Input -->
          <div class="mb-4" v-if="assignForm.sub_unit_abbre != null">
            <label
              for="currentSubQuantity"
              class="block text-sm font-medium text-gray-700"
              >Current Cart Sub Quantity</label
            >
            <div class="flex items-center mt-1">
              <input
                type="number"
                id="currentSubQuantity"
                v-model="assignForm.current_sub_quantity"
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
                {{ assignForm.sub_unit_abbre }}
              </button>
            </div>
          </div>
          <!-- Movable Sub Quantity Input -->
          <div class="mb-4" v-if="assignForm.sub_unit_abbre != null">
            <label
              for="newSubQuantity"
              class="block text-sm font-medium text-gray-700"
              >Movable Cart Sub Quantity</label
            >
            <div class="flex items-center mt-1">
              <input
                type="number"
                id="newSubQuantity"
                min="0"
                v-model="assignForm.released_sub_quantity"
                :max="assignForm.quantity_per_unit - 1"
                :disabled="assignForm.cart_id == 0 || assignForm.sub_unit_abbre == null"
                :class="assignForm.cart_id == 0 || assignForm.sub_unit_abbre == null? 'bg-gray-200' : ''"
                placeholder="Input Item Quantity"
                class="p-2 border rounded-l-md w-full"
              />
              <button
                type="button"
                :title="`${assignForm.quantity_per_unit} ${assignForm.sub_unit_abbre} / ${assignForm.unit_abbre}`"
                class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-12 flex items-center"
              >
                {{ assignForm.sub_unit_abbre }}
              </button>
            </div>
          </div>
        </div>
        <div class="mb-4" v-if="false">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Select Transfer Location</label
          >
          <div class="flex items-center mt-1">
            <input
              type="text"
              placeholder="Input Location"
              v-model="assignForm.location_name"
              @input.prevent="searchLocationBehavior(assignForm.location_name)"
              required
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div
            class="absolute bg-white shadow z-50"
            v-if="searchLocation.search != ''"
          >
            <ul class="">
              <li
                class="p-1 border-l-2 border-lime-200 flex py-2 font-bold shadow text-gray-600"
                @click.prevent="fillLocationForm(location, ii)"
                v-for="(location, index) in locations"
                :key="index"
              >
                {{ location.buildingAbbre }} - {{ location.name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="mb-4" v-if="assignForm.mrf_type == false">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Select Transfer To Warehouse</label
          >
          <input
              type="text"
              placeholder="Input Warehouse"
              v-model="assignForm.to_warehouse_name"
              @input.prevent="searchWarehouseBehavior(assignForm.to_warehouse_name)"
              required
              class="mt-1 p-2 border rounded-md w-full"
            />
            <div
              class="absolute bg-white shadow z-50"
              v-if="searchWarehouse.search != ''"
            >
              <ul class="">
                <li
                  class="p-1 border-l-2 border-lime-200 flex py-2 font-bold shadow text-gray-600"
                  @click.prevent="fillWarehouseForm(wh)"
                  v-for="(wh, index) in to_warehouse"
                  :key="index"
                >
                  {{ wh.name }}
                </li>
              </ul>
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
            :disabled="assignForm.cart_id == 0"
            :class="assignForm.cart_id == 0 ? 'opacity-50' : ''"
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
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { VUE_APP_API_URL, PERMISSION, BUILDING } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  useDebounce,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Array,
  mrf_id: Number,
  warehouse_id: Number,
});
const assignBinModalOpen = ref(false);
const bins = ref([]);
const locations = ref([]);
const cart_locations = ref([]);
const to_warehouse = ref([]);
const bin_error = ref("");
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
  current_sub_quantity: 0,
  sub_unit_abbre: "",
  released_sub_quantity: 0,
  quantity_per_unit: 0,
  is_fixed: 0,
  location_sku: "",
  location_name: "",
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
  assignForm.value.item_name = `${data.itemName} (${data.brandAbbre})`;
  assignForm.value.warehouse_id = props.warehouse_id;
  assignForm.value.warehouse_name = data.warehouseName;
  assignForm.value.new_stocks = 0;

  assignForm.value.released_quantity = data.unpaidQuantity ?? 0;
  assignForm.value.unit_abbre = data.unitAbbre;

  assignForm.value.released_sub_quantity = data.unpaidSubQuantity ?? 0;
  assignForm.value.sub_unit_abbre = data.subUnitAbbre;

  assignForm.value.quantity_per_unit = data.quantityPerUnit;
  assignForm.value.brand_id = data.brandId;
  assignForm.value.brand_name = data.brandName;
  assignForm.value.brand_abbre = data.brandAbbre;
  assignForm.value.is_fixed = data.isFixed;

  assignForm.value.all_stocks = data.allStocks ?? 0;
  assignForm.value.all_sub_stocks = data.allSubStocks ?? 0;
  assignForm.value.mrf_type = data.mrfType;
  search.value.warehouse_id = props.warehouse_id ?? 0;
  
  getBinLocation();
};
const resetForm = () => {
  assignForm.value = {
    receive_item_id: 0,
    item_id: 0,
    item_name: "",
    warehouse_id: 0,
    warehouse_name: "",
    cart_id: 0,
    cart_name: "",
    brand_id: 0,
    brand_name: "",
    current_quantity: 0,
    unit_abbre: "",
    released_quantity: 0,
    current_sub_quantity: 0,
    sub_unit_abbre: "",
    released_sub_quantity: 0,
    quantity_per_unit: 0,
    is_fixed: 0,
    location_sku: "",
    location_name: "",
    remarks: "",
  };
 
};
const subQuantityEstimator = () => {
  if (assignForm.value.released_sub_quantity > assignForm.value.quantity_per_unit) {
      assignForm.value.released_quantity = Math.floor(assignForm.value.released_sub_quantity / assignForm.value.quantity_per_unit);
      assignForm.value.released_sub_quantity %= assignForm.value.quantity_per_unit;
  }else{
    assignForm.value.released_quantity = 0;
  }
}
const ensureNegativeValue = () => {
  // Convert the value to negative if it's not zero or negative
  if (assignForm.value.released_sub_quantity && Number(assignForm.value.released_sub_quantity) >= 0) {
    assignForm.value.released_sub_quantity = -Math.abs(assignForm.value.released_sub_quantity);
  }
  if (assignForm.value.released_quantity && Number(assignForm.value.released_quantity) >= 0) {
  }
};
const releaseItemFromCart = async () => {
  try {
    // Show confirmation dialog
    const link_url = assignForm.value.is_fixed == 1 ? 'out-item-from-cart-fixed-asset' : 'out-item-from-cart-fast-moving';
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to release this item from the bin?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, release it!',
      cancelButtonText: 'No, cancel'
    });

    // Proceed if user confirms
    if (result.isConfirmed) {
      // Show the processing alert
      Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      assignForm.value.released_quantity = -Math.abs(assignForm.value.released_quantity);
      assignForm.value.released_sub_quantity = -Math.abs(assignForm.value.released_sub_quantity);
      const formData = FormDx(assignForm.value);
      const response = await axios.post(
        `${VUE_APP_API_URL}carts/${link_url}`,
        formData,
        BearToken(token)
      );

      // Close the processing dialog
      Swal.close();
      assignBinModalOpen.value = false;
      Alert("success", "Success", response.data.message);
      emits("transaction_id", Math.random());
    }
  } catch (error) {
    Swal.close();
     // Revert quantities to positive after a successful response
    assignForm.value.released_quantity = Math.abs(assignForm.value.released_quantity);
    assignForm.value.released_sub_quantity = Math.abs(assignForm.value.released_sub_quantity);
    emits("transaction_id", Math.random());
    handleApiError(error);
  }
};
const getBinLocation = async () => {
  try {
    cart_locations.value = [];
    const formData = FormDx({
      warehouse_id: search.value.warehouse_id,
      item_id: assignForm.value.item_id,
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}carts/view-item-cart-locations`,
      formData,
      BearToken(token)
    );
    // bins.value = response.data.bin;
    if (!response.data.error) {
     cart_locations.value = response.data.carts;
    }
  } catch (error) {
    console.log('Error'+error.response.data.message);
    handleApiError(error);
  }
};

const searchcartBehavior = useDebounce(async () => {
  search.value.search = assignForm.value.cart_name;
  if (search.value.search?.length == 0) {
    assignForm.value.cart_id = 0;
  }
  await listCarts();
}, 500);
const listCarts = async () => {
  try {
    bins.value = [];
    const formData = FormDx({
      cart_sku: search.value.search,
      warehouse_id: search.value.warehouse_id,
      item_id: assignForm.value.item_id,
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}scan-codes/search-item-in-carts`,
      formData,
      BearToken(token)
    );
    // bins.value = response.data.bin;
    if (!response.data.error) {
      console.log(response.data);
      assignForm.value.cart_id = response.data.itemInCart.cartId;
      assignForm.value.cart_name = response.data.itemInCart.cartSku;
      assignForm.value.current_quantity = response.data.itemInCart.quantity ?? 0;
      assignForm.value.current_sub_quantity = response.data.itemInCart.subQuantity ?? 0;
      bin_error.value = false;
    }
  } catch (error) {
    bin_error.value = error.response.data.message;
    assignForm.value.bin_id = 0;
    handleApiError(error);
  }
};

const listLocation = async () => {
  try {
    locations.value = [];
    const formData = FormDx(searchLocation.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/rooms-warehouses-list`,
      formData,
      BearToken(token)
    );
    locations.value = response.data.roomsWarehouses;
  } catch (error) {
    handleApiError(error);
  }
};
const searchLocationBehavior = useDebounce(async (name) => {
  searchLocation.value.search = name;
  listLocation();
}, 500);
const fillLocationForm = (item, index) => {
  console.log();
  assignForm.value.location_sku = item.sku;
  assignForm.value.location_name = item.buildingAbbre+' '+item.name;

  searchLocation.value.search = '';
};

const searchWarehouseBehavior = useDebounce(async (name) => {
  searchWarehouse.value.search = name;
  if (searchWarehouse.value.search?.length == 0) {
    assignForm.value.to_warehouse_id = 0;
  }
  listWarehouse();;
}, 500);
const fillWarehouseForm = (item) => {
  assignForm.value.to_warehouse_id = item.id;
  assignForm.value.to_warehouse_name = item.name;

  searchWarehouse.value.search = "";
};
const listWarehouse = async () => {
  try {
    to_warehouse.value = [];
    const formData = FormDx(searchWarehouse.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}warehouses/list`,
      formData,
      BearToken(token)
    );
    to_warehouse.value = response.data.warehouses;
  } catch (error) {
    handleApiError(error);
  }
};
</script>
