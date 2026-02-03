<template>
  <button
    @click="(isAddModalOpen = true), addPRBehavior()"
    :disabled="props.data == 0"
    :class="props.data == 0 ? 'opacity-50' : ''"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-receipt"></i>
    Receive Selected Item
  </button>
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="Receive Item"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="receiveItem()">
        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div
            class="mb-3"
            :class="
              fdForm.sku_type == 2 || fdForm.sku_type == 0 ? 'cols-span-3' : ''
            "
          >
            <!-- <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Assign Bin/Cart ({{ fdForm.bin_item_id }} =
              {{ fdForm.items[0].item_id }})</label
            > -->
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <!-- <div class="flex items-center mt-1">
              <input
                type="text"
                placeholder="Input/Scan Bin/Cart SKU"
                v-model="fdForm.sku"
                @input.prevent="searchCartBehavior()"
                :class="fdForm.cart_id != 0 ? 'rounded-l' : 'rounded-md'"
                class="mt-1 p-2 w-full border border-red-500"
              />
              <ItemInCarts v-if="fdForm.cart_id != 0" :data="fdForm"/>
            </div>
            <small
              :class="
                fdForm.cart_error == true ? 'text-red-500' : 'text-lime-500'
              "
              class="font-bold text-xs"
            >
              {{ fdForm.cart_message }}
            </small> -->
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Reference No.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="fdForm.reference_number"
              placeholder="Input Reference No."
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4" v-if="false">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Received By</label
            >
            <div class="flex items-center">
              <input
                type="text"
                placeholder="Input Receiver"
                v-model="fdForm.employee_name"
                @input.prevent="searchUserBehavior(fdForm.employee_name)"
                required
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <div
              class="absolute bg-white shadow z-50"
              v-if="searchUser.search != ''"
            >
              <ul class="">
                <li
                  class="p-1 border-l-2 border-lime-200 flex py-2 font-bold shadow text-gray-600"
                  @click.prevent="fillUserForm(user)"
                  v-for="(user, index) in users"
                  :key="index"
                >
                  {{ user.employeeNumber }} - {{ user.firstName }}
                  {{ user.middleName }} {{ user.lastName }}
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Receive Warehouse</label
            >
            <select
              placeholder="Select Building Name"
              class="mt-1 p-2 border rounded-md w-full"
              v-model="fdForm.warehouse_id"
              @change.prevent="updateReceivingWarehouse()"
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

        <!-- Mobile view: Form-like layout -->
        <div v-if="isMobile" class="block lg:hidden">
          <div
            v-for="(i, ii) in fdForm.items"
            v-if="fdForm.items.length > 0"
            :key="ii"
            :title="getItemTooltip(i.item_id)"
            class="mb-4 p-4 border rounded-lg shadow"
          >
            <!-- Item Dropdown -->
            <div class="mb-2">
              <label
                for="itemsName"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Item</label
              >
              <input
                type="text"
                placeholder="Input Item Name"
                v-model="i.item_name"
                required
                disabled
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              />
            </div>
            <!-- Item Dropdown -->
            <!-- <div class="mb-2">
              <label
                for="itemsName"
                class="block text-sm font-medium text-gray-700 mb-1"
                >View Supplier</label
              >
              <div class="flex justify-center">
                <button
                  class="p-1 border flex bg-blue-500 text-white rounded w-full"
                  @click.prevent="(isBrandModalOpen = i.item_id != 0), brandBehavior(i.item_id, ii)"
                >
                  <i class="fa fa-eye"></i>&nbsp;View
                </button>
              </div>
            </div> -->
            <!-- Quantity and Units -->
            <div class="mb-2">
              <label
                for="quantity"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Brand</label
              >
              <div class="flex">
                <input
                  type="text"
                  id="ProductName"
                  v-model="i.brand_name"
                  autocomplete="off"
                  min="1"
                  placeholder="Input Brand"
                  disabled
                  step="any"
                  class="p-2 border rounded-l-md w-full bg-gray-200"
                />
              </div>
            </div>
            <!-- Quantity and Units -->
            <div class="mb-2">
              <label
                for="quantity"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Current Stocks</label
              >
              <div class="flex">
                <input
                  type="number"
                  id="ProductName"
                  v-model="i.available_stocks"
                  min="1"
                  step="any"
                  placeholder="Input Item Quantity"
                  disabled
                  class="p-2 border bg-gray-200 rounded-l-md w-full"
                />
                <button
                  type="button"
                  class="border border-l-0 rounded-r-md px-3 bg-lime-500 text-white hover:bg-gray-300"
                >
                  {{ i.unit_abbre ?? "-" }}
                </button>
              </div>
            </div>
            <!-- Quantity and Units -->
            <div class="mb-2">
              <label
                for="quantity"
                class="block text-sm font-medium text-gray-700 mb-1"
                >PO'ed Quantity</label
              >
              <div class="flex">
                <input
                  type="number"
                  id="ProductName"
                  v-model="i.requested_quantity"
                  min="1"
                  step="any"
                  placeholder="Input Item Quantity"
                  disabled
                  class="p-2 border bg-gray-200 rounded-l-md w-full"
                />
                <button
                  type="button"
                  class="border border-l-0 rounded-r-md px-3 bg-yellow-500 text-white hover:bg-gray-300"
                >
                  {{ i.unit_abbre ?? "-" }}
                </button>
              </div>
            </div>
            <!-- Quantity and Units -->
            <div class="mb-2">
              <label
                for="quantity"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Received Quantity</label
              >
              <div class="flex">
                <input
                  type="number"
                  id="ProductName"
                  v-model="i.received_quantity"
                  min="1"
                  step="any"
                  placeholder="Input Item Quantity"
                  class="p-2 border border-red-500 rounded-l-md w-full"
                />
                <button
                  type="button"
                  class="border border-l-0 rounded-r-md px-3 bg-cyan-500 text-white hover:bg-gray-300"
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
                class="mt-1 p-2 border rounded-l-md w-full bg-gray-200"
                v-if="i.item_id != 0"
              >
                {{ i.quantity_per_unit }} /{{ i.unit_abbre }}
              </div>
              <div
                class="mt-1 p-2 border rounded-l-md w-full text-red-500 bg-gray-200"
                v-else
              >
                Please select Item!
              </div>
            </div>
            <!-- Remarks -->
            <div class="mb-2">
              <label
                for="remarks"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Item Remarks</label
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
                class="bg-red-500 text-white rounded font-bold text-sm md:text-md py-2 px-4"
              >
                <i class="fas fa-ban"></i> Void
              </button>
            </div>
          </div>

          <p
            v-if="fdForm.items.length === 0"
            class="text-red-500 font-bold text-center"
          >
            **No items found**
          </p>
        </div>
        <!-- Desktop view: table-like layout -->
        <div v-else class="mb-4 block w-full overflow-auto text-nowrap">
          <label
            for="LeagueName"
            class="block text-sm font-medium mb-3 text-gray-700"
            >Items:
          </label>
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class="text-white shadow" :class="DEFAULT_BG">
              <tr class="border border-solid text-nowrap">
                <th
                  scope="col"
                  width="30%"
                  class="px-2 py-3 text-left text-sm uppercase tracking-wider border border-solid"
                >
                  Item
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm uppercase tracking-wider border border-solid"
                >
                  Brand
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-center text-sm font-medium uppercase tracking-wider border border-solid bg-lime-500"
                >
                  Current Stocks
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-center text-sm font-medium uppercase tracking-wider border border-solid bg-yellow-500"
                >
                  PO'ed Quantity
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-center text-sm font-medium uppercase tracking-wider border border-solid bg-cyan-500"
                >
                  Received Quantity
                </th>
                <!-- <th
                  scope="col"
                  width="10%"
                  class="px-2 py-3  text-center text-sm font-medium  uppercase tracking-wider border border-solid "
                >
                  Price
                </th> -->
                <!-- <th
                  scope="col"
                  class="px-2 py-3 text-center text-sm uppercase tracking-wider border border-solid"
                >
                  Units
                </th> -->
                <!-- <th
                  scope="col"
                  width="10%"
                  class="px-2 py-3  text-center text-sm font-medium uppercase tracking-wider border border-solid "
                >
                 Discount (Amount)
                </th>
                <th
                  scope="col"
                  width="10%"
                  class="px-2 py-3  text-center text-sm font-medium uppercase tracking-wider border border-solid "
                >
                 Total Price
                </th> -->
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm uppercase tracking-wider border border-solid"
                >
                  INV Number
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm uppercase tracking-wider border border-solid"
                >
                  Remarks
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm uppercase tracking-wider border border-solid"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loop through products and display them -->
              <!-- @mouseover="viewInfo(i.item_id)" -->
              <tr
                v-for="(i, ii) in fdForm.items"
                v-if="fdForm.items.length > 0"
                :key="ii"
                :title="getItemTooltip(i.item_id)"
                class="border border-solid text-sm"
              >
                <td class="px-2 py-3 border border-solid">
                  <!-- <select
                          placeholder="Select Building Name"
                          class="mt-1 p-2 border rounded-md w-full"
                          v-model="i.item_id"
                          >
                          <option value="0">--Select Item--</option>
                          <option v-for="(i,ii) in items" :key="i.value" :value="i.value">{{ i.label }}</option>
                          </select> -->
                  <div class="flex">
                   
                    <input
                      type="text"
                      placeholder="Input Item Name"
                      v-model="i.item_name"
                      :title="i.item_name"
                      @input.prevent="searchItemBehavior(ii, i.item_name)"
                      required
                      disabled
                      class="p-2 border flex w-full rounded-l w-100 bg-gray-200"
                    />
                    <WarehouseList :key="ii" :data="i" />
                  </div>
                  <small class="text-xs text-red-500" v-if="!i.is_in_warehouse">{{ i.is_in_warehouse_message }}</small>
                </td>
                <td class="px-2 py-3 border border-solid">
                  <!-- <select
                          placeholder="Select Building Name"
                          class="mt-1 p-2 border rounded-md w-full"
                          v-model="i.item_id"
                          >
                          <option value="0">--Select Item--</option>
                          <option v-for="(i,ii) in items" :key="i.value" :value="i.value">{{ i.label }}</option>
                          </select> -->
                  <div class="flex">
                    <input
                      type="text"
                      placeholder="Input Item Name"
                      v-model="i.brand_name"
                      required
                      disabled
                      class="p-2 border flex w-full rounded-md w-100 bg-gray-200"
                    />
                  </div>
                </td>
                <td class="px-2 py-3 border border-solid">
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.available_stocks"
                      min="0"
                      placeholder="Input Item Quantity"
                      disabled
                      class="p-2 border flex w-full rounded-l-md w-100 bg-gray-200"
                    />
                    <button
                      type="button"
                      class="border border-l-0 rounded-r-md px-3 bg-lime-500 text-white hover:bg-gray-300"
                    >
                      {{ i.unit_abbre }}
                    </button>
                  </div>
                </td>
                <td class="px-2 py-3 border border-solid">
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.requested_quantity"
                      min="0"
                      placeholder="Input Item Quantity"
                      disabled
                      class="p-2 border flex w-full rounded-l-md w-100 bg-gray-200"
                    />
                    <button
                      type="button"
                      class="border border-l-0 rounded-r-md px-3 bg-yellow-500 text-white hover:bg-gray-300"
                    >
                      {{ i.unit_abbre }}
                    </button>
                  </div>
                </td>
                <td class="px-2 py-3 border border-solid">
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.received_quantity"
                      min="0"
                      placeholder="Input Item Quantity"
                      class="p-2 border flex w-full border-red-500 rounded-l-md w-100"
                    />
                    <button
                      type="button"
                      class="border border-l-0 rounded-r-md px-3 bg-cyan-500 text-white hover:bg-gray-300"
                    >
                      {{ i.unit_abbre }}
                    </button>
                  </div>
                </td>
                <!-- <td class="px-2 py-3  border border-solid ">
                  <input
                    type="number"
                    id="ProductName"
                    v-model="i.price"
                    placeholder="Input Item Quantity"
                    class="p-2 border flex w-full rounded-md w-100"
                  />
                </td> -->
                <!-- <td class="px-2 py-3 border border-solid">
                  <div class="flex justify-center" v-if="i.item_id != 0">
                    {{ i.quantity_per_unit }} /{{ i.unit_abbre }}
                  </div>
                </td> -->
                <!-- <td class="px-2 py-3  border border-solid ">
                  <input
                    type="number"
                    id="ProductName"
                    v-model="i.discount"
                    placeholder="Input Item Quantity"
                    class="p-2 border flex w-full rounded-md w-100"
                  />
                </td>    
                <td class="px-2 py-3  border border-solid ">
                  <small hidden>
                    {{ i.total_price  = (i.price * i.quantity) + (i.sub_price * i.sub_quantity) - i.discount }}
                  </small>
                  <input
                    type="number"
                    id="ProductName"
                    v-model="i.total_price"
                    disabled
                    placeholder="Input Item Quantity"
                    class="p-2 border flex w-full rounded-md w-100 bg-gray-200"
                  />
                </td> -->
                <td class="px-2 py-3  border border-solid ">
                  <input
                    type="text"
                    id="invoiceNumber"
                    v-model="i.invoice_number"
                    placeholder="Input Item Invoice Number"
                    class="p-2 border flex w-full rounded-md w-100"
                  />
                </td>
                <td class="px-2 py-3 border border-solid">
                  <textarea
                    v-model="i.remarks"
                    placeholder="Input Item Remarks"
                    class="p-2 border flex w-full rounded-md"
                  ></textarea>
                </td>
                <td class="px-2 py-3 border border-solid">
                  <div class="flex justify-start">
                    <button
                      @click.prevent="removeItemField(ii)"
                      type="button"
                      class="bg-red-500 text-white rounded font-bold rounded-r text-sm md:text-sm py-2 px-4 mb-4 float-end text-nowrap"
                    >
                      <i class="fas fa-ban"></i>
                      Void
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="fdForm.items.length == 0">
                <td class="px-2 py-3 border border-solid" colspan="14">
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
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            v-model="fdForm.remarks"
            placeholder="Input Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
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
  <Modal :show="isViewCartModalOpen" :maxWidth="'6xl'">
    <div class="flex justify-between p-4">
      <h2 class="text-lg font-semibold text-gray-800">View Items</h2>
      <button
        class="flex float-end bg-gray-100 p-3"
        @click.prevent="isViewCartModalOpen = false"
      >
        <i class="fa fa-times text-black-600"></i>
      </button>
    </div>
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
            >
              Location</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="locationForm.location_sku"
              placeholder="Input Product Name"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Building</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="locationForm.building_name"
              placeholder="Input Product Name"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Warehouse</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="locationForm.warehouse_name"
              placeholder="Input Product Name"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
        </div>
        <div class="flex w-full overflow-auto">
          <!-- Table to display products -->
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class="bg-yellow-900 text-white shadow">
              <tr class="border-b-2 border-solid border-yellow-500">
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium uppercase tracking-wider"
                >
                  Transfer Date
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium uppercase tracking-wider"
                >
                  SKU/Barcode
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-md font-medium uppercase tracking-wider"
                >
                  Cost
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium uppercase tracking-wider"
                >
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loop through products and display them -->
              <tr
                v-for="item in data.fixedAssets"
                v-if="data.fixedAssets?.length > 0"
                :key="item.id"
                :title="
                  'Inputted By: ' +
                  item.createdByUserName +
                  'Inputted Date: ' +
                  item.dateCreated
                "
              >
                <td class="px-2 py-2 border">{{ item.dateCreated }}</td>
                <td class="px-2 py-2 border">{{ item.serialNumber }}</td>
                <td class="px-2 py-2 border">{{ item.itemName }}</td>
                <td class="px-2 py-2 border">{{ item.description }}</td>
                <td class="px-2 py-2 border text-right">{{ item.cost }}</td>
                <td class="px-2 py-2 border">{{ item.remarks }}</td>
              </tr>
              <tr v-if="data.fixedAssets?.length == 0">
                <td
                  class="px-2 py-2 border text-center text-red-500 font-bold"
                  colspan="6"
                >
                  ***No Item Found***
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
        <!-- <div class="flex items-center justify-end">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div> -->
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import {
  VUE_APP_API_URL,
  DATE_NOW,
  WAREHOUSE,
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

import WarehouseList from "./WarehouseList.vue";
const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
// Define props with a default value
const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
  po_item_array: {
    type: Object,
    default: [],
  },
  item_array: {
    type: Object,
    default: [],
  },
  warehouse_id: {
    type: Number,
    default: 0,
  },
});
const isAddModalOpen = ref(false);
const isViewCartModalOpen = ref(false);
const users = ref([]);
const items = ref([]);
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const activeItemIndex = ref(0);
const fdForm = ref({
  mrf_id: 0,
  date_now: DATE_NOW(),
  warehouse_id: 0,
  warehouse_name: "",
  received_by_user_id: 0,
  received_by_user_name: "",
  remarks: "",
  reference_number: "",
  sku: "",
  sku_type: 0,
  cart_error: false,
  cart_available: false,
  cart_name: "",
  cart_id: 0,
  bin_item_id: 0,
  submit: false,
  items: [],
  items_in_location: [],
});

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchUser = ref({
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

//add
const addPRBehavior = () => {
  resetForm();
  // allowSubmit();
  // companiesDropdown();
  fdForm.value.items = props.data;
  fdForm.value.po_item_array = props.po_item_array;
  fdForm.value.item_array = props.item_array;
  fdForm.value.warehouse_id = props.warehouse_id;

  listBinCart();
};
const updateReceivingWarehouse = () => {
  listBinCart();
}
// const allowSubmit = () => {
//   console.log('working');
//   (fdForm.value.sku_type);
//   if(fdForm.value.sku_type === 0){
//     fdForm.value.submit = true;
//   }
//   if(fdForm.value.sku_type === 1){
//     fdForm.value.submit = fdForm.value.items.length != 0 && fdForm.value.sku_type == 1;
//   }
//   if(fdForm.value.sku_type === 2){
//     fdForm.value.submit = fdForm.value.sku_type == 1 && fdForm.items.length == 1 && fdForm.value.bin_item_id == fdForm.value.items[0].item_id;
//   }

// };
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
    handleApiError(error);//
  }
};
const searchItemBehavior = useDebounce(async (index, name) => {
  search.value.search = name;
  activeItemIndex.value = index;
  if (search.value.search?.length == 0) {
    fdForm.value.items[index].mrf_item_id = 0;
  }
  listItems();
}, 500);
const fillItemsForm = (item, index) => {
  fdForm.value.items[index].po_item_id = item.id;
  fdForm.value.items[index].po_item_name = item.name + " - " + item.itemSku;

  search.value.search = "";
};
//user dropdown
const listUsers = async () => {
  try {
    items.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}employees/list`,
      formData,
      BearToken(token)
    );
    users.value = response.data.employees;
  } catch (error) {
    handleApiError(error);//
  }
};
const searchUserBehavior = useDebounce(async (name) => {
  searchUser.value.search = name;
  if (searchUser.value.search?.length == 0) {
    fdForm.value.received_by_user_id = 0;
  }
  listUsers();
}, 500);
const fillUserForm = (user) => {
  fdForm.value.employee_id = user.id;
  fdForm.value.employee_name =
    user.employeeNumber +
    " - " +
    user.firstName +
    " " +
    user.middleName +
    " " +
    user.lastName;

  searchUser.value.search = "";
};
//warehouse dropdown
const resetForm = () => {
  fdForm.value = {
    mrf_id: 0,
    date_now: DATE_NOW(),
    warehouse_id: 0,
    warehouse_name: "",
    received_by_user_id: 0,
    received_by_user_name: "",
    remarks: "",
    reference_number: "",
    sku: "",
    sku_type: 0,
    cart_error: false,
    cart_available: false,
    cart_name: "",
    cart_id: 0,
    bin_item_id: 0,
    submit: false,
    items: [],
    items_in_location: [],
    item_array: [],
    item_array: [],
  };
  // emits("transaction_id", Math.random());
};
const receiveItem = async () => {
  if (fdForm.value.sku_type == 0) {
    Alert("warning", "Warning!", "Please add cart or bins!.");
    return false;
  }
  if (fdForm.value.sku_type == 2 && fdForm.value.items.length > 1) {
    Alert(
      "warning",
      "Warning!",
      "Item count must be only one when receiving from bin! Please remove other items."
    );
    return false;
  }
  try {
    const RECEIVING_URL =
      fdForm.value.sku_type == 1
        ? "warehouse-item-in/po-in"
        : fdForm.value.sku_type == 2
        ? "bin-in/add-item-in-bin-array"
        : "";
    const formData = FormDx(fdForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL + RECEIVING_URL}`,
      formData,
      BearToken(token)
    );

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);//
  }
};
const removeItemField = (index) => {
  // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
  fdForm.value.items.splice(index, 1);
};
const searchCartBehavior = useDebounce(async () => {
  await listBinCart(); // Call listBinCart function after debounce delay
}, 500);
const listBinCart = async () => {
  try {
    // Prepare form data
    const formData = createFormData();

    // Make the API request
    const response = await axios.post(
      `${VUE_APP_API_URL}scan-codes/search`,
      formData,
      BearToken(token)
    );

    // Handle response data
    handleResponse(response.data);
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};

// Create Form Data
const createFormData = () => {
  return FormDx({
    sku: fdForm.value.sku,
    warehouse_id: fdForm.value.warehouse_id,
    item_ids_array: fdForm.value.item_array,
    po_item_ids_array: fdForm.value.po_item_array,
  });
};

// Handle API Response
const handleResponse = ({ error, message, poItems, skus }) => {
  // Update form values
  Object.assign(fdForm.value, {
    cart_error: error,
    cart_message: message,
    bin_id: 0,
    cart_id: 0,
    bin_item_id: 0,
    submit: false,
  });

  // Check for errors
  if (!error) {
    const sku = skus[0];
    fdForm.value.sku_type = sku.skuType;
    fdForm.value.current_quantity = 0;
    fdForm.value.current_sub_quantity = 0;
    fdForm.value.cart_message = message;
    // Handle based on sku_type
    handleSkuType(sku, poItems);
  }
  fillAvailableStocks(poItems);
};
const fillAvailableStocks = (poItems) => {
  // Ensure items array and poItems are defined
  if (!Array.isArray(fdForm.value.items) || !Array.isArray(poItems)) {
    console.error("Items or poItems is not an array");
    return;
  }

  // Ensure there is at least one item in fdForm.value.items
  if (fdForm.value.items.length === 0) {
    console.error("No items found in fdForm.value.items");
    return;
  }

  // Track if any items have been updated
  let anyItemUpdated = false;

  // Update available_stocks in fdForm.value.items based on poItems
  fdForm.value.items.forEach((item) => {
    // Find the poItem with the matching po_item_id
    const matchingPoItem = poItems.find(
      (poItem) => poItem.id === item.po_item_id
    );

    if (matchingPoItem) {
      // Set available_stocks to poQuantity from the matching poItem
      item.available_stocks = matchingPoItem.poQuantity;
      item.is_in_warehouse = matchingPoItem.isInWarehouse;
      item.is_in_warehouse_message = matchingPoItem.isInWarehouseMessage;
      anyItemUpdated = true;
    } else {
      // Optionally handle cases where no matching poItem is found
      item.available_stocks = 0; // or any default value as needed
    }
  });

  // If no items were updated, set all available_stocks to 0
  if (!anyItemUpdated) {
    fdForm.value.items.forEach((item) => {
      item.available_stocks = 0;
    });
  }
};

// Handle SKU Type
const handleSkuType = (sku, poItems) => {
  switch (sku.skuType) {
    case 1:
      Object.assign(fdForm.value, {
        submit: true,
        cart_id: sku.id,
      });
      break;

    case 2:
      const itemIdMatches =
        parseFloat(sku.itemId) === parseFloat(fdForm.value.items[0].item_id);
      Object.assign(fdForm.value, {
        submit: itemIdMatches || parseFloat(sku.itemId) === 0,
        bin_id: sku.id,
        bin_item_id: sku.itemId,
        po_items: poItems,
      });
      break;

    default:
      fdForm.value.submit = false;
      // Handle unexpected skuType if necessary
      break;
  }
};

// Handle API Error
const handleError = (error) => {
  Object.assign(fdForm.value, {
    cart_error: true,
    submit: false,
    bin_item_id: 0,
    cart_id: 0,
    bin_id: 0,
    cart_message: error.response?.data?.message || "An error occurred",
  });
};

const getItemTooltip = (item_id) => {
  // Find the item with the given item_id
  if (fdForm.value.items_in_location.length > 0) {
    const location = fdForm.value.items_in_location.find(
      (item) => item.itemId === item_id
    );

    if (location) {
      // Return the tooltip text
      if (location.subUnitId > 0) {
        return `Current Stock: ${
          location.quantity + location.unitAbbre
        }, Current Substocks: ${location.subQuantity + location.subUnitAbbre}`;
      } else {
        return `Current Stock: ${location.quantity + location.unitAbbre}`;
      }
    } else {
      return "Item information not available";
    }
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
