<template>
  <button
    @click="(assignBinModalOpen = true), binBehavior()"
    class="bg-red-500 hover:opacity-70 focus:bg-red-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-hand-paper"></i>
    Move to Bin
  </button>
  <!-- Add Modal -->
  <Modal :show="assignBinModalOpen" :maxWidth="'4xl'">
    <div class="flex justify-between p-3">
      <h2 class="text-lg font-semibold text-gray-800">Assign Bin</h2>
      <button
        class="flex float-end bg-gray-100 p-3"
        @click.prevent="assignBinModalOpen = false"
      >
        <i class="fa fa-times text-black-600"></i>
      </button>
    </div>
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="" @submit.prevent="assignBin()">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 border-b--2 border-dashed">
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
              >Brand</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              disabled
              v-model="assignForm.brand_name"
              placeholder="Input Rack Name"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
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
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Assign Bin</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <div class="flex items-center mt-1">
            <input
              type="text"
              placeholder="Input Bin SKU"
              v-model="assignForm.bin_name"
              @input.prevent="searchBinBehavior()"
              required
              class="mt-1 p-2 border rounded-md w-full"
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
              >Movable Bin Quantity</label
            >
            <div class="flex items-center mt-1">
              <input
                type="number"
                id="newQuantity"
                v-model="assignForm.new_quantity"
                min="0"
                :disabled="assignForm.bin_id == 0"
                :class="assignForm.bin_id == 0 ? 'bg-gray-200' : ''"
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
              >Current Bin Sub Quantity</label
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
          <div class="mb-4"  v-if="assignForm.sub_unit_abbre != null">
            <label
              for="newSubQuantity"
              class="block text-sm font-medium text-gray-700"
              >Movable Bin Sub Quantity</label
            >
            <div class="flex items-center mt-1">
              <input
                type="number"
                id="newSubQuantity"
                v-model="assignForm.new_sub_quantity"
                min="0"
                :disabled="assignForm.bin_id == 0"
                :class="assignForm.bin_id == 0 ? 'bg-gray-200' : ''"
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
import { VUE_APP_API_URL, PERMISSION, BUILDING } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Array,
});
const assignBinModalOpen = ref(false);
const bins = ref([]);
const bin_error = ref("");
const assignForm = ref({
  receive_item_id: 0,
  item_id: 0,
  item_name: "",
  warehouse_id: "",
  warehouse_name: "",
  bin_id: 0,
  bin_name: "",
  brand_id: 0,
  brand_name: '',
  quantity: 0,
  current_quantity: 0,
  new_quantity: 0,
  unit_abbre: "",
  sub_quantity: 0,
  current_sub_quantity: 0,
  new_sub_quantity: 0,
  sub_unit_abbre: "",
  quantity_per_unit: 0,
  new_stocks: 0,
  old_stocks: 0,
  remarks: '',
});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  warehouse_id: 0,
});
const binBehavior = () => {
  const data = props.data;
  console.log(data);

  assignForm.value.receive_item_id = data.id;
  assignForm.value.item_id = data.itemId;
  assignForm.value.item_name = data.itemName;
  assignForm.value.warehouse_id = data.warehouseId;
  assignForm.value.warehouse_name = data.warehouseName;
  assignForm.value.bin_id = 0;
  assignForm.value.bin_name = "";
  assignForm.value.new_stocks = 0;

  assignForm.value.new_quantity = data.quantity;
  assignForm.value.unit_abbre = data.unitAbbre;

  assignForm.value.new_sub_quantity = data.subQuantity;
  assignForm.value.sub_unit_abbre = data.subUnitAbbre;

  assignForm.value.quantity_per_unit = data.quantityPerUnit;
  assignForm.value.brand_id = data.brandId;
  assignForm.value.brand_name = data.brandName;
  search.value.warehouse_id = data.warehouseId ?? 0;
};
const resetForm = () => {
  assignForm.value.receive_item_id = 0;
  assignForm.value.item_id = 0;
  assignForm.value.item_name = "";
  assignForm.value.warehouse_id = 0;
  assignForm.value.warehouse_name = "";
  assignForm.value.bin_id = 0;
  assignForm.value.bin_name = "";
  assignForm.value.quantity = 0;
  assignForm.value.new_stocks = 0;
};
const assignBin = async () => {
  try {
    const formData = FormDx(assignForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}bin-in/add-item-in-bin`,
      formData,
      BearToken(token)
    );

    assignBinModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);//
  }
};
const searchBinBehavior = () => {
  search.value.search = assignForm.value.bin_name;
  if (search.value.search?.length == 0) {
    assignForm.value.bin_id = 0;
  }
  listBins();
};
const fillBinForm = (item) => {
  assignForm.value.bin_id = item.id;
  assignForm.value.bin_name = item.binName;

  search.value.search = "";
};
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
      assignForm.value.current_sub_quantity =
        response.data.bin.subStocks ?? 0;
      bin_error.value = false;
    }
  } catch (error) {
    bin_error.value = error.response.data.message;
    assignForm.value.bin_id = 0;
    handleApiError(error);//
  }
};
</script>
