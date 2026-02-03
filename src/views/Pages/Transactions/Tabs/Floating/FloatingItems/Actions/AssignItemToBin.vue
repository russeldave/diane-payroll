<template>
  <button
    @click.prevent="(assignBinModalOpen = true), binBehavior()"
    type="button"
    title="Release From Bin"
    class="bg-red-500 hover:opacity-70 focus:bg-red-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-trash"></i>
    Assign Item to Bin
  </button>
  <!-- Add Modal -->
  <Modal :show="assignBinModalOpen" :maxWidth="'6xl'" title="Assign Item To Bin" @close="assignBinModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="releaseItemFromBin()">
        <div
          v-if="assignForm.floating_stocks == 0"
          class="mb-2"
        >
          <div
            class="bg-red-500 border border-red-600 text-white px-4 py-2 rounded-md block text-xl animate-pulse text-center shadow-lg"
          >
            <i class="fas fa-exclamation-circle text-xl mr-2"></i>
            <span>Item {{ assignForm.item_name }} is out of Stocks in Bin</span>
          </div>
        </div>
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
          <div class="mb-4">
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
            <p class="mt-1 p-2 border rounded-md w-full bg-gray-200">
              {{ typeFormatter(assignForm.is_fixed) }}
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
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Rack</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              disabled
              v-model="assignForm.rack_name"
              placeholder="Input Rack Name"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-red-700"
              >Floating Stocks</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <div class="flex items-center mt-1">
              <input
                type="number"
                id="newQuantity"
                v-model="assignForm.floating_stocks"
                disabled
                placeholder="Input Item Quantity"
                class="p-2 border rounded-l-md w-full bg-gray-200 text-green-700 font-extrabold"
              />
              <button
                type="button"
                :title="`${assignForm.quantity_per_unit} / ${assignForm.unit_abbre}`"
                class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-12 flex items-center"
              >
                {{ assignForm.unit_abbre }}
              </button>
            </div>
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
            <thead class=" shadow" :class="DEFAULT_BG">
              <tr class="border-b-2 border-solid border-yellow-500  text-white">
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
                  Bin
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Rack
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
                  Stocks
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loop through products and display them -->
              <tr
                v-for="bin in bin_locations"
                v-if="bin_locations?.length > 0"
                :key="bin.id"
              >
                <td class="px-2 py-2 border text-left">{{ bin.itemSku }} - {{ bin.itemName }}</td>
                <td class="px-2 py-2 border text-left">{{ bin.binSku }}</td>
                <td class="px-2 py-2 border text-left">{{ bin.rackName }}</td>
                <td class="px-2 py-2 border text-left">
                  {{ bin.warehouseName }}
                </td>
                <td class="px-2 py-2 border text-right">
                  {{ bin.quantityPerUnit }} /{{
                    bin.unitAbbre
                  }}
                </td>
                <td class="px-2 py-2 border text-right">
                  {{ bin.stocks }} {{ bin.unitAbbre }}
                </td>
              </tr>
              <tr v-else>
                <td
                  class="px-2 py-2 border text-center text-red-500 font-bold"
                  colspan="8"
                >
                  ***No Location Found***
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-red-500"
            >Scan Bin For Confirmation</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <div class="flex items-center mt-1">
            <input
              type="text"
              placeholder="Input Bin SKU"
              v-model="assignForm.bin_name"
              @input.prevent="searchBinBehavior()"
              required
              class="mt-1 p-2 border rounded-md w-full border-red-500"
            />
          </div>
          <small v-if="bin_error" class="text-red-500 font-bold text-xs">{{
            bin_error
          }}</small>
          <small
            v-if="assignForm.bin_id != 0"
            class="text-lime-500 font-bold text-xs"
            ><i class="fa fa-check-circle text-lime-500"></i> Bin
            Available</small
          >
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Current Quantity Input -->
          <div class="mb-4">
            <label
              for="currentQuantity"
              class="block text-sm font-medium text-gray-700"
              >Current Bin Quantity</label
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
                :title="`${assignForm.quantity_per_unit}/ ${assignForm.unit_abbre}`"
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
              >Movable Bin Quantity</label
            >
            <div class="flex items-center mt-1">
              <input
                type="number"
                id="newQuantity"
                v-model="assignForm.added_quantity"
                :disabled="assignForm.bin_id == 0"
                min="0"
                :max="assignForm.floating_stocks"
                :class="assignForm.bin_id == 0 ? 'bg-gray-200' : ''"
                placeholder="Input Item Quantity"
                class="p-2 border rounded-l-md w-full"
              />
              <button
                type="button"
                :title="`${assignForm.quantity_per_unit}/ ${assignForm.unit_abbre}`"
                class="border border-l-0 rounded-r-md px-3 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 h-12 flex items-center"
              >
                {{ assignForm.unit_abbre }}
              </button>
            </div>
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
            :disabled="assignForm.bin_id == 0"
            :class="assignForm.bin_id == 0 ? 'opacity-50' : ''"
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
import { VUE_APP_API_URL, PERMISSION, BUILDING, DEFAULT_BG } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, useDebounce, typeFormatter, handleApiError } from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
  mrf_id: Number,
  warehouse_id: Number,
});
const assignBinModalOpen = ref(false);
const bins = ref([]);
const locations = ref([]);
const bin_error = ref("");
const bin_locations = ref("");
const assignForm = ref({
  item_id: 0,
  item_name: "",
  warehouse_id: 0,
  warehouse_name: "",
  bin_id: 0,
  bin_name: "",
  brand_id: 0,
  brand_name: "",
  current_quantity: 0,
  unit_abbre: "",
  added_quantity: 0,
  quantity_per_unit: 0,
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
const binBehavior = () => {
  const data = props.data;
  resetForm();
  console.log
  assignForm.value.float_item_id = data.id ?? 0;
  assignForm.value.item_id = data.itemId;
  assignForm.value.item_sku = data.itemSku;
  assignForm.value.item_name = `${data.itemName} (${data.brandAbbre})`;
  assignForm.value.warehouse_id = props.warehouse_id;
  assignForm.value.warehouse_name = data.warehouseName;
  assignForm.value.bin_id = 0;
  assignForm.value.bin_name = "";
  assignForm.value.rack_id = 0;
  assignForm.value.rack_name = "";

  assignForm.value.added_quantity = data.unpaidQuantity ?? 0;
  assignForm.value.floating_stocks = data.floatStocks ?? 0;
  assignForm.value.unit_abbre = data.unitAbbre;


  assignForm.value.quantity_per_unit = data.quantityPerUnit;
  assignForm.value.brand_id = data.brandId;
  assignForm.value.brand_name = data.brandName;
  assignForm.value.brand_abbre = data.brandAbbre;

  search.value.warehouse_id = props.warehouse_id ?? 0;
  getBinLocation();
};
const resetForm = () => {
  assignForm.value = {
    item_id: 0,
    item_name: "",
    warehouse_id: 0,
    warehouse_name: "",
    bin_id: 0,
    bin_name: "",
    brand_id: 0,
    brand_name: "",
    current_quantity: 0,
    unit_abbre: "",
    added_quantity: 0,
    quantity_per_unit: 0,
    remarks: "",
  };
};
const releaseItemFromBin = async () => {
  try {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this item from the bin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
      cancelButtonText: "No, cancel",
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
      const formData = FormDx(assignForm.value);
      const response = await axios.post(
        `${VUE_APP_API_URL}warehouse-has-items/move-to-bin`,
        formData,
        BearToken(token)
      );

      Swal.close();
      assignBinModalOpen.value = false;
      Alert("success", "Success", response.data.message);
      emits("transaction_id", Math.random());
    }
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
const getBinLocation = async () => {
  try {
    bin_locations.value = [];
    const formData = FormDx({
      warehouse_id: search.value.warehouse_id,
      item_id: assignForm.value.item_id,
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}items/view-item-bin-locations`,
      formData,
      BearToken(token)
    );
    // bins.value = response.data.bin;
    if (!response.data.error) {
      bin_locations.value = response.data.bins;
    }
  } catch (error) {
    handleApiError(error);
  }
};
const searchBinBehavior = useDebounce(async (index, name) => {
  search.value.search = assignForm.value.bin_name;
  if (search.value.search?.length == 0) {
    assignForm.value.bin_id = 0;
  }
  await listBins();
}, 500);
const listBins = async () => {
  try {
    bins.value = [];
    const formData = FormDx({
      bin_sku: search.value.search,
      warehouse_id: search.value.warehouse_id,
      item_id: assignForm.value.item_id,
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}bins/search-bin-with-warehouse`,
      formData,
      BearToken(token)
    );
    // bins.value = response.data.bin;
    if (!response.data.error) {
      assignForm.value.bin_id = response.data.bin.id;
      assignForm.value.bin_name = response.data.bin.binSku;
      assignForm.value.current_quantity = response.data.bin.stocks ?? 0;
      assignForm.value.rack_name = response.data.bin.rackName ?? "-";
      bin_error.value = false;
    }
  } catch (error) {
    bin_error.value = error.response.data.message;
    assignForm.value.bin_id = 0;
    handleApiError(error);
  }
};
</script>
