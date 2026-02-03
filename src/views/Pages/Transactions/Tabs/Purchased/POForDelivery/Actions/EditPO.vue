<template>
  <button
    @click="(isAddModalOpen = true), addPRBehavior()"
    :disabled="props.data == 0"
    :class="props.data == 0 ? 'opacity-50' : ''"
    class="bg-yellow-500 hover:opacity-70 focus:bg-yellow-300 text-white font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-file-invoice"></i>
    Edit PO
  </button>
  <Modal :show="isAddModalOpen" :maxWidth="'fullscreen'" title="Edit Purchase Order" @close="isAddModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="editPO()">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-md font-medium text-gray-700"
              >PO Manual No.</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="poForm.po_manual_number"
              placeholder="Input PO Manual Number"
              required
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <!-- <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-md font-medium text-gray-700"
              >Requested By</label
            >
            <input
              type="text"
              placeholder="Input Requester"
              v-model="poForm.requested_to_user_name"
              @input.prevent="searchUserBehavior(poForm.requested_to_user_name)"
              required
              class="mt-1 p-2 border rounded-md w-full"
            />
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
                  {{ user.name }}
                </li>
              </ul>
            </div>
          </div> -->
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-md font-medium text-gray-700"
              >Supplier</label
            >
            <div class="flex items-center mt-1">
              <SearchDropdown
                apiEndpoint="suppliers/list"
                :searchModel="searchSupplier"
                placeholder="Search Supplier"
                itemLabel="name"
                itemId="id"
                inputId="supplierName"
                :defaultValue="poForm.supplier_name"
                @item-selected="(data) => fillSupplierForm(data)"
                dataKey="suppliers"
                returnName="['name','supplierNumber']"
              />
            </div>
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-md font-medium text-gray-700"
              >Deliver to Warehouse</label
            >
            <div class="flex items-center mt-1">
              <SearchDropdown
                apiEndpoint="warehouses/list"
                :searchModel="searchWarehouse"
                placeholder="Search Receiving Warehouse"
                itemLabel="name"
                itemId="id"
                inputId="warehouseName"
                :defaultValue="poForm.warehouse_name"
                formatLabel="dashed_and_parenthesis"
                @item-selected="(data) => fillWarehouseForm(data)"
                dataKey="employees"
                returnName="['warehouseSku','name','buildingName']"
              />
            </div>
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-md font-medium text-gray-700"
              >Our Company</label
            >
            <select
              placeholder="Select Building Name"
              class="mt-1 p-2 border rounded-md w-full"
              v-model="poForm.our_company_id"
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
        </div>
        <label
          for="LeagueName"
          class="block text-md font-medium mb-3 text-gray-700"
          >Items:
        </label>
                  <!-- Mobile view: Form-like layout -->
                  <div v-if="isMobile" class="block lg:hidden">
                    <div
                      v-for="(i, ii) in poForm.items"
                      v-if="poForm.items.length > 0"
                      :key="ii"
                      class="mb-4 p-4 border rounded-lg shadow"
                    >
                      <!-- Item Dropdown -->
                      <div class="mb-2">
                        <label
                          for="itemsName"
                          class="block text-md font-medium text-gray-700 mb-1"
                          >Item</label
                        >
                        <div class="mt-1 p-2 border rounded-md w-full">
                          <ItemTitle
                            :item_id="i.itemId"
                            :item_name="i.itemSku + ' - ' + i.itemName"
                          />
                        </div>
                      </div>
                      <!-- Item Dropdown -->
                      <!-- <div class="mb-2">
                      <label
                        for="itemsName"
                        class="block text-md font-medium text-gray-700 mb-1"
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
                          class="block text-md font-medium text-gray-700 mb-1"
                          >PR'ed Quantity</label
                        >
                        <div class="flex">
                          <input
                            type="number"
                            id="ProductName"
                            v-model="i.prQuantity"
                            autocomplete="off"
                            min="1"
                            placeholder="Input Item Quantity"
                            disabled
                            step="any"
                            class="p-2 border rounded-l-md w-full"
                          />
                          <button
                            type="button"
                            class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                          >
                            {{ i.unitAbbre ?? "-" }}
                          </button>
                        </div>
                      </div>
                      <!-- Quantity and Units -->
                      <div class="mb-2">
                        <label
                          for="quantity"
                          class="block text-md font-medium text-gray-700 mb-1"
                          >PO'ed Quantity</label
                        >
                        <div class="flex">
                          <input
                            type="number"
                            id="ProductName"
                            v-model="i.quantity"
                            min="1"
                            step="any"
                            placeholder="Input Item Quantity"
                            class="p-2 border border-red-500 rounded-l-md w-full"
                          />
                          <button
                            type="button"
                            class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                          >
                            {{ i.unitAbbre ?? "-" }}
                          </button>
                        </div>
                      </div>
                      <!-- Quantity and Units -->
                      <div class="mb-2">
                        <label
                          for="quantity"
                          class="block text-md font-medium text-gray-700 mb-1"
                          >Price</label
                        >
                        <div class="flex">
                          <input
                            type="number"
                            id="ProductName"
                            v-model="i.price"
                            min="1"
                            step="any"
                            placeholder="Input Item Price"
                            class="p-2 border border-red-500 rounded-l-md w-full"
                          />
                        </div>
                      </div>
                      <div class="mb-2">
                        <label
                          for="quantity"
                          class="block text-md font-medium text-gray-700 mb-1"
                          >Discount</label
                        >
                        <div class="flex">
                          <input
                            type="number"
                            v-model="i.discountAmount"
                            step="any"
                            placeholder="Discount"
                            class="mt-1 p-2 border rounded-md w-full"
                          />
                        </div>
                      </div>
                      <div class="mb-2">
                        <label
                          for="quantity"
                          class="block text-md font-medium text-gray-700 mb-1"
                          >Total</label
                        >
                        <div class="flex">
                          <small hidden>{{ i.total_price = i.price - i.discountAmount }}</small>
                          <input
                            type="number"
                            v-model="i.total_price"
                            step="any"
                            placeholder="Total Price"
                            disabled
                            :class="
                              i.total_price <= 0
                                ? 'animate-pulse border-green-500 border-2'
                                : 'border-red-500'
                            "
                            class="mt-1 p-2 border rounded-md w-full"
                          />
                        </div>
                      </div>
                      <div class="mb-2">
                        <label
                          for="quantity"
                          class="block text-md font-medium text-gray-700 mb-1"
                          >Select COA</label
                        >
                        <div class="flex">
                          <SearchDropdown
                            apiEndpoint="chart-of-accounts/list"
                            :searchModel="searchCOA"
                            placeholder="Search COA"
                            itemLabel="name"
                            itemId="id"
                            inputId="coaName"
                            :defaultValue="i.chartOfAccountName"
                            @item-selected="(item) => fillCOAForm(item, ii)"
                            dataKey="chartOfAccounts"
                            returnName="['name','chartOfAccountTypeName']"
                          />
                        </div>
                      </div>
                      <div class="mb-2">
                        <label
                          for="quantity"
                          class="block text-md font-medium text-gray-700 mb-1"
                          >TAX</label
                        >
                        <div class="flex">
                          <select
                            v-model="i.taxCodeId"
                            class="mt-1 p-2 border rounded-md w-full"
                          >
                            <option value="0">--Select TAX--</option>
                            <option
                              v-for="option in tax"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <!-- Remarks -->
                      <div class="mb-2">
                        <label
                          for="remarks"
                          class="block text-md font-medium text-gray-700 mb-1"
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
                        <div class="flex items-center">
                          <EditItems
                            :data="i"
                            @transaction_id="handleTransaction()"
                          />
                          <Delete :data="i" @transaction_id="handleTransaction()" />
                        </div>
                      </div>
                    </div>
        
                    <p
                      v-if="poForm.items.length === 0"
                      class="text-red-500 font-bold text-center"
                    >
                      **No items found**
                    </p>
                  </div>
                  <!-- Desktop view: table-like layout -->
        <div class="mb-4 flex w-full overflow-auto text-nowrap" v-else>
          <table class="min-w-full divide-y divide-gray-200 text-md">
            <!-- Table headers -->
            <thead class="text-white shadow" :class="DEFAULT_BG">
              <tr class="border border-solid">
                <th
                  scope="col"
                  width="15%"
                  class="px-1 py-2 text-left uppercase tracking-wider border border-solid"
                >
                  Item
                </th>
                <th
                  scope="col"
                  width="8%"
                  class="px-1 py-2 text-right uppercase tracking-wider border border-solid bg-blue-500"
                >
                  PR'ed Qty
                </th>
                <th
                  scope="col"
                  width="8%"
                  class="px-1 py-2 text-right uppercase tracking-wider border border-solid bg-red-500"
                >
                  PO'ed Qty
                </th>
                <!-- <th
                  scope="col"
                  width="10%"
                  class="px-1 py-2 text-left uppercase tracking-wider border border-solid bg-gray-500"
                >
                  Units
                </th> -->
                <th
                  scope="col"
                  width="8%"
                  class="px-1 py-2 text-right uppercase tracking-wider border border-solid bg-blue-500"
                >
                  Price
                </th>
                <th
                  scope="col"
                  width="5%"
                  class="px-1 py-2 text-right uppercase tracking-wider border border-solid bg-red-500"
                >
                  Discount
                </th>
                <th
                  scope="col"
                  width="5%"
                  class="px-1 py-2 text-right uppercase tracking-wider border border-solid bg-gray-500"
                >
                  Vat
                </th>
                <th
                  scope="col"
                  width="5%"
                  class="px-1 py-2 text-right uppercase tracking-wider border border-solid bg-emerald-500"
                >
                  Total
                </th>
                <th
                  scope="col"
                  width="12%"
                  class="px-1 py-2 text-left uppercase tracking-wider border border-solid"
                >
                  Chart of Accounts
                </th>
                <th
                  scope="col"
                  width="8%"
                  class="px-1 py-2 text-left uppercase tracking-wider border border-solid"
                >
                  Tax
                </th>
                <th
                  scope="col"
                  width="12%"
                  class="px-1 py-2 text-left uppercase tracking-wider border border-solid"
                >
                  Remarks
                </th>
                <th
                  scope="col"
                  width="10%"
                  class="px-1 py-2 text-left uppercase tracking-wider border border-solid"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(i, ii) in poForm.items"
                v-if="poForm.items.length > 0"
                :key="ii"
                class="border border-solid text-nowrap text-md"
              >
                <td class="px-1 py-2 border border-solid">
                  <div class="flex items-center">
                    <ItemTitle
                      :item_id="i.itemId"
                      :item_name="i.itemSku + ' - ' + i.itemName"
                    />
                  </div>
                </td>
                <td class="px-1 py-2 border border-solid">
                  <div class="flex items-center">
                    <input
                      type="number"
                      v-model="i.prQuantity"
                      min="0"
                      disabled
                      placeholder="Qty"
                       class="p-2 border rounded-md w-full text-lg bg-gray-200"
                    />
                    <button
                      type="button"
                       class="border border-l-0 rounded-r-md p-2 bg-blue-500 text-white"
                    >
                      {{ i.unitAbbre }}
                    </button>
                  </div>
                </td>
                <td class="px-1 py-2 border border-solid">
                  <div class="flex items-center">
                    <input
                      type="number"
                      v-model="i.quantity"
                      min="1"
                      placeholder="Qty"
                      class="p-2 border rounded-md w-full text-lg"
                    />
                    <button
                      type="button"
                      class="border border-l-0 rounded-r-md p-2 bg-red-500 text-white"
                    >
                      {{ i.unitAbbre }}
                    </button>
                  </div>
                </td>
                <!-- <td class="px-1 py-2 border border-solid text-center text-md">
                  {{ i.quantityPerUnit }} / {{ i.unitAbbre }}
                </td> -->
                <td class="px-1 py-2 border border-solid">
                  <input
                    type="number"
                    v-model="i.price"
                    step="any"
                    placeholder="Price"
                   class="p-2 border rounded-md w-full text-lg"
                  />
                </td>
                <td class="px-1 py-2 border border-solid">
                  <input
                    type="number"
                    v-model="i.discountAmount"
                    step="any"
                    placeholder="Discount"
                    class="p-2 border rounded-md w-full text-lg"
                  />
                </td>
                <td class="px-1 py-2 border border-solid">
                  <input
                    type="number"
                    v-model="i.vat"
                    step="any"
                    placeholder="Discount"
                    class="p-2 border rounded-md w-full text-lg"
                  />
                </td>
                <td class="px-1 py-2 border border-solid">
                  <small hidden>{{ i.total_price = i.price - i.discountAmount }}</small>
                  <input
                    type="number"
                    v-model="i.total_price"
                    step="any"
                    placeholder="Total"
                    disabled
                    :class="
                      i.total_price <= 0
                        ? 'animate-pulse border-green-500 border-2'
                        : 'border-red-500'
                    "
                    class="p-2 border rounded-md w-full text-lg"
                  />
                </td>
                <td class="px-1 py-2 border border-solid">
                  <SearchDropdown
                    apiEndpoint="chart-of-accounts/list"
                    :searchModel="searchCOA"
                    placeholder="Search COA"
                    itemLabel="name"
                    itemId="id"
                    inputId="coaName"
                    :defaultValue="i.chartOfAccountName"
                    @item-selected="(item) => fillCOAForm(item, ii)"
                    dataKey="chartOfAccounts"
                    returnName="['name', 'chartOfAccountTypeName']"
                    class="text-md"
                  />
                </td>
                <td class="px-1 py-2 border border-solid">
                  <select
                    v-model="i.taxCodeId"
                    class="p-2 border rounded-md w-full text-lg"
                  >
                    <option value="0">--Select TAX--</option>
                    <option
                      v-for="option in tax"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </td>
                <td class="px-1 py-2 border border-solid">
                  <textarea
                    v-model="i.remarks"
                    placeholder="Remarks"
                    class="p-2 border rounded-md w-full text-lg"
                  ></textarea>
                </td>
                <td class="px-1 py-2 border border-solid">
                  <div class="flex items-center">
                    <EditItems
                      :data="i"
                      @transaction_id="handleTransaction()"
                    />
                    <Delete :data="i" @transaction_id="handleTransaction()" />
                  </div>
                </td>
              </tr>
              <tr v-if="poForm.items.length == 0">
                <td
                  class="px-1 py-2 border border-solid text-center text-red-500 font-bold"
                  colspan="11"
                >
                  **No items found**
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th
                  scope="col"
                  colspan="3"
                  class="px-1 py-2 border border-solid text-right text-md"
                >
                  Total
                </th>
                <th class="px-1 py-2 border border-solid text-right text-md">
                  {{ moneyFormatter(totalPrice) }}
                </th>
                <th class="px-1 py-2 border border-solid text-right text-md">
                  {{ moneyFormatter(totalDiscount) }}
                </th>
                <th class="px-1 py-2 border border-solid text-right text-md">
                  {{ moneyFormatter(totalVat) }}
                </th>
                <th class="px-1 py-2 border border-solid text-right text-md">
                  {{ moneyFormatter(totalAmount) }}
                </th>
                <th
                  colspan="4"
                  class="px-1 py-2 border border-solid text-right text-md"
                ></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-md font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            v-model="poForm.remarks"
            placeholder="Input Remarks"
            class="mt-1 p-2 border flex rounded-md w-full"
          ></textarea>
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-md font-medium text-gray-700"
            >Delivery Instructions</label
          >
          <textarea
            v-model="poForm.delivery_instructions"
            placeholder="Input Delivery Instructions"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="poForm.items.length == 0"
            :class="poForm.items.length == 0 ? 'opacity-50' : ''"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </Modal>
  <Modal :show="isBrandModalOpen" :maxWidth="'4xl'">
    <button
      class="flex float-end bg-gray-100 p-3"
      @click.prevent="isBrandModalOpen = false"
    >
      <i class="fa fa-times text-black-600"></i>
    </button>
    <div class="grid grid-cols-1 gap-6 p-6">
      <h2 class="text-lg font-semibold text-gray-800">Brand List</h2>
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
            <tr class="border-b-2 border-solid text-nowrap">
              <th
                scope="col"
                class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
              >
                Supplier
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
              >
                Sub Price
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
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
              <td class="px-2 py-2 border">
                {{ brand.itemBrandName }} ({{ brand.brandAbbre }})
              </td>
              <td class="px-2 py-2 border">{{ brand.supplierName }}</td>
              <td class="px-2 py-2 border">
                {{ brand.price }}/{{ brand.unitAbbre }}
              </td>
              <td class="px-2 py-2 border">
                {{ brand.subPrice }}/{{ brand.subUnitAbbre }}
              </td>
              <td class="px-2 py-2 border">
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
            <tr v-if="data.itemHasBrands?.length == 0">
              <td
                class="px-2 py-2 border text-center text-red-500 font-bold"
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
import { onMounted, ref, watch, computed } from "vue";
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
  useDebounce,
  moneyFormatter,
  handleApiError
} from "@/views/Utility/Helper";

import Delete from "./Delete.vue";
import EditItems from "./EditItems.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
// Define props with a default value
const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
});
const isAddModalOpen = ref(false);
const isBrandModalOpen = ref(false);
const data = ref([]);
const tax = ref([]);
const companies = ref([]);
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const poForm = ref({
  po_id: 0,
  date_now: DATE_NOW(),
  our_company_id: 0,
  our_company_name: "",
  delivery_date: DATE_NOW(),
  requested_to_user_id: 0,
  requested_to_user_name: "",
  delivery_instructions: "",
  po_manual_number: "",
  warehouse_id: 0,
  warehouse_name: "",
  supplier_id: 0,
  supplier_name: "",
  remarks: "",
});
const supplierForm = ref({
  supplier_id: 0,
  pr_item_ids: [],
});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchCOA = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchSupplier = ref({
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
const searchWarehouse = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
//itemd dropdown
const companiesDropdown = async () => {
  companies.value = await COMPANIES();
};
//supplier dropdown
const fillSupplierForm = (item) => {
  poForm.value.supplier_id = item.id;
  poForm.value.supplier_name = item.name + " / " + item.supplierNumber;
  searchBrand.value.supplier_id = item.id;
  searchSupplier.value.search = "";

  supplierForm.value.supplier_id = item.id;
  supplierForm.value.pr_item_ids = poForm.value.items.map((item) => item.id);

  getItemSupplierPrice();
};
const getItemSupplierPrice = async () => {
  try {
    const formData = FormDx(supplierForm.value);
    const response = await axios.post(
      VUE_APP_API_URL + "pos/select-supplier-price",
      formData,
      BearToken(token)
    );

    fillSupplierPrice(response.data.prItems);
  } catch (error) {
    handleApiError(error);//
  }
};
const fillSupplierPrice = (poItems) => {
  // Ensure items array and poItems are defined
  if (!Array.isArray(poForm.value.items) || !Array.isArray(poItems)) {
    console.error("Items or poItems is not an array");
    return;
  }

  // Ensure there is at least one item in poForm.value.items
  if (poForm.value.items.length === 0) {
    console.error("No items found in poForm.value.items");
    return;
  }

  // Track if any items have been updated
  let anyItemUpdated = false;

  // Update available_stocks in poForm.value.items based on poItems
  poForm.value.items.forEach((item) => {
    // Find the poItem with the matching po_item_id
    const matchingPoItem = poItems.find(
      (poItem) => poItem.id === item.prItemId
    );

    if (matchingPoItem) {
      // Set available_stocks to poQuantity from the matching poItem
      item.price = matchingPoItem.price;
      anyItemUpdated = true;
    } else {
      // Optionally handle cases where no matching poItem is found
      item.price = 0; // or any default value as needed
    }
  });

  // If no items were updated, set all available_stocks to 0
  if (!anyItemUpdated) {
    poForm.value.items.forEach((item) => {
      item.price = 0;
    });
  }
};
const fillWarehouseForm = (item) => {
  poForm.value.warehouse_id = item.id;
  poForm.value.warehouse_name = item.name;

  searchWarehouse.value.search = "";
};
const fillCOAForm = (item, index) => {
  poForm.value.items[index].charOfAccountId = item.id;
  poForm.value.items[index].chartOfAccountName =
    item.name +
    " - " +
    item.chartOfAccountTypeName +
    "(" +
    item.reportCodeName +
    ")";

  searchCOA.value.search = "";
};
const taxDropDown = async () => {
  try {
    const response = await axios.get(
      VUE_APP_API_URL + "chart-of-accounts/dropdown-tax-code",
      BearToken(token)
    );
    if (response) {
      tax.value = response.data.taxCodes;
    }
  } catch (error) {
    handleApiError(error);//
  }
};
//location dropdown
//add
const addPRBehavior = () => {
  resetForm();
  fillForm();
  listItemsPerPO();
  companiesDropdown();
  taxDropDown();
};
const handleTransaction = (transaction_id) => {
  console.log(transaction_id);
  listItemsPerPO();
};
const fillForm = () => {
  const po_data = props.data;
  console.log(po_data);
  poForm.value = {
    po_id: po_data.id,
    date_now: DATE_NOW(),
    our_company_id: po_data.ourCompanyId,
    our_company_name: po_data.ourCompanyName,
    delivery_date: po_data.deliverDate,
    requested_to_user_id: po_data.poByUserId,
    requested_to_user_name: po_data.poByUserName,
    delivery_instructions: po_data.deliveryInstruction,
    po_manual_number: po_data.poManualNumber,
    warehouse_id: po_data.warehouseId,
    warehouse_name: po_data.warehouseBuildingName,
    supplier_id: po_data.supplierId,
    supplier_name: po_data.suppliername,
    remarks: po_data.remarks,
    items: [],
  };
};
const resetForm = () => {
  poForm.value = {
    po_id: 0,
    date_now: DATE_NOW(),
    our_company_id: 0,
    our_company_name: "",
    delivery_date: DATE_NOW(),
    requested_to_user_id: 0,
    requested_to_user_name: "",
    delivery_instructions: "",
    po_manual_number: "",
    warehouse_id: 0,
    warehouse_name: "",
    supplier_id: 0,
    supplier_name: "",
    remarks: "",
    items: [],
  };
};
const editPO = async () => {
  const invalidBrandId = poForm.value.items.filter(
    (item) => item.brand_id === 0
  );

  // if (invalidBrandItems.length > 0) {
  //   // Display error for items with brand_id === 0
  //   Alert("error", "Error", "Some items have invalid Brand selections (Brand ID is 0).");
  //   return;
  // }

  if (invalidBrandId.length > 0) {
    // Display error for items with empty room_location_number
    Alert("error", "Error", "Some items have empty Brands.");
    return;
  }
  try {
    const formData = FormDx(poForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}pos/edit-po`,
      formData,
      BearToken(token)
    );

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    console.log(error);
    Alert("error", "Error", error.response.data.message);
  }
};
const removeItemField = (index) => {
  // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
  poForm.value.items.splice(index, 1);
};

const brandBehavior = (item_id, index) => {
  searchBrand.value.item_id = item_id;
  searchBrand.value.active_index = index;
  listBrands();
};

const selectedBrand = (brand) => {
  const pr_items = poForm.value.items[searchBrand.value.active_index];

  pr_items.brand_id = brand.itemBrandId;
  pr_items.brand_name = brand.itemBrandName;
  pr_items.brand_abbre = brand.brandAbbre;
  pr_items.supplier_id = brand.supplierId;
  pr_items.supplier_name = brand.supplierName;
  pr_items.price = brand.price;
  pr_items.sub_price = brand.subPrice;

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
    console.error("Error fetching data:", error);
  }
};

const listItemsPerPO = async () => {
  try {
    data.value = [];
    const formData = FormDx({ po_id: poForm.value.po_id });
    const response = await axios.post(
      `${VUE_APP_API_URL}pos/get-items-per-po`,
      formData,
      BearToken(token)
    );
    poForm.value.items = response.data.poItems;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const handlePagination = (page_num) => {
  console.log(page_num);
  searchBrand.value.page_num = page_num ?? 1;
  listBrands();
};

const totalDiscount = computed(() => {
  return poForm.value.items.reduce(
    (acc, item) => acc + (parseFloat(item.discountAmount) || 0),
    0
  );
});
const totalPrice = computed(() => {
  return poForm.value.items.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0),
    0
  );
});
const totalAmount = computed(() => {
  return poForm.value.items.reduce(
    (acc, item) => acc + (item.total_price || 0),
    0
  );
});
// Watch for screen size changes
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};
watch(() => window.innerWidth, handleResize);
onMounted(() => {
  window.addEventListener("resize", handleResize);
});
</script>
