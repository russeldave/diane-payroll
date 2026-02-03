<template>
  <!-- v-if="false" -->
  <button
    @click.prevent="(isAddModalOpen = true), addPRBehavior()"
    :disabled="props.data == 0"
    :class="props.data == 0 ? 'opacity-50' : ''"
    type="button"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-file-invoice"></i>
    Add Item to PO
  </button>
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="Create Purchase Order"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4 p-3">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >PO Manual No.</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="poForm.po_manual_number"
              placeholder="Input PO Manual Number"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <!-- <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
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
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Supplier: <small v-if="poForm.supplierZohoId" class="text-red-600 italic">({{ poForm.zohoVendorId }})</small></label
            >
            <div class="flex items-center mt-1">
              <SearchDropdown
                apiEndpoint="suppliers/list"
                :searchModel="searchSupplier"
                placeholder="Search Supplier"
                itemLabel="name"
                itemId="id"
                inputId="supplierName"
                @item-selected="(data) => fillSupplierForm(data)"
                dataKey="suppliers"
                returnName="['name','supplierNumber']"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Deliver to Warehouse</label
            >
            <div class="flex items-center mt-1">
              <!-- <SearchDropdown
                apiEndpoint="warehouses/list"
                :searchModel="searchWarehouse"
                placeholder="Search Receiving Warehouse"
                itemLabel="name"
                itemId="id"
                inputId="warehouseName"
                @item-selected="(data) => fillWarehouseForm(data)"
                dataKey="warehouses"
                returnName="['name']"
              /> -->
               <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected>Diane Warehouse</option>
              </select>
            </div>
          </div>
          <!-- <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Our Company</label
            >
            <select
              placeholder="Select Building Name"
              class="mt-1 p-2 border rounded-md w-full"
              v-model="poForm.our_company_id"
            >
              <option value="0">--Select Company--</option>
              <option v-for="(b, bb) in companies" :key="b.value" :value="b.value">
                {{ b.label }}
              </option>
            </select>
          </div> -->
        </div>
        <label for="LeagueName" class="block text-sm font-medium mb-3 text-gray-700"
          >Items:
        </label>
        <div class="mb-4 w-full min-h-full overflow-auto text-nowrap">
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
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1"
                  >PR'ed Quantity</label
                >
                <div class="flex">
                  <input
                    type="number"
                    id="ProductName"
                    v-model="i.requested_quantity"
                    autocomplete="off"
                    min="1"
                    placeholder="Input Item Quantity"
                    disabled
                    step="any"
                    class="p-2 border rounded-l-md w-full bg-gray-200"
                  />
                  <button
                    type="button"
                    class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                  >
                    {{ i.unit_abbre ?? "-" }}
                  </button>
                </div>
              </div>
              <!-- Quantity and Units -->
              <div class="mb-2">
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1"
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
                    {{ i.unit_abbre ?? "-" }}
                  </button>
                </div>
              </div>
              <!-- Quantity per Unit -->
              <!-- <div class="mb-2">
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
              </div> -->
              <!-- Quantity and Units -->
              <div class="mb-2">
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1"
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
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1"
                  >Discount</label
                >
                <div class="flex">
                  <input
                    type="number"
                    v-model="i.discount_amount"
                    step="any"
                    placeholder="Discount"
                    class="mt-1 p-2 border rounded-md w-full"
                  />
                </div>
              </div>
              <div class="mb-2">
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1"
                  >VAT</label
                >
                <div class="flex">
                  <input
                    type="number"
                    v-model="i.vat"
                    step="any"
                    placeholder="VAT"
                    class="mt-1 p-2 border rounded-md w-full"
                  />
                </div>
              </div>
              <div class="mb-2">
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1"
                  >Total</label
                >
                <div class="flex">
                  <small hidden>{{
                    (i.total_price = i.price * i.quantity - i.discount_amount)
                  }}</small>
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
                    class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                  />
                </div>
              </div>
              <div class="mb-2">
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1"
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
                    :defaultValue="i.chart_of_account_name"
                    @item-selected="(item) => fillCOAForm(item, ii)"
                    dataKey="chartOfAccounts"
                    returnName="['name','chartOfAccountTypeName']"
                  />
                </div>
              </div>
              <div class="mb-2">
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1"
                  >TAX</label
                >
                <div class="flex">
                  <select
                    v-model="i.tax_type_id"
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
                <label for="remarks" class="block text-sm font-medium text-gray-700 mb-1"
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
                  class="bg-red-500 text-white rounded font-bold text-lg md:text-lg py-2 px-4"
                >
                  <i class="fas fa-trash"></i> Remove
                </button>
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
          <div class="overflow-auto" v-else>
            <table class="min-w-full divide-y divide-gray-200 text-sm">
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
                  <!-- <th
                    scope="col"
                    width="10%"
                    class="px-1 py-2 text-center uppercase tracking-wider border border-solid bg-emerald-500"
                  >
                    Supplier
                  </th> -->
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
                    class="px-1 py-2 text-center uppercase tracking-wider border border-solid bg-gray-500"
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
                  <!-- <th
                    scope="col"
                    width="5%"
                    class="px-1 py-2 text-right uppercase tracking-wider border border-solid bg-red-500"
                  >
                    Discount
                  </th>
                  <th
                    scope="col"
                    width="5%"
                    class="px-1 py-2 text-right uppercase tracking-wider border border-solid bg-gray-600"
                  >
                    VAT
                  </th> -->
                  <th
                    scope="col"
                    width="8%"
                    class="px-1 py-2 text-right uppercase tracking-wider border border-solid bg-emerald-500"
                  >
                    Total
                  </th>
                  <!-- <th
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
                  </th> -->
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
                    class="px-1 py-2 text-center uppercase tracking-wider border border-solid"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(i, ii) in poForm.items"
                  :key="ii"
                  class="border border-solid text-sm"
                >
                  <td class="px-1 py-2 border border-solid">
                    <div class="flex">
                      <input
                        type="text"
                        v-model="i.item_name"
                        placeholder="Item Name"
                        :title="i.item_name"
                        required
                        disabled
                        class="p-1 border rounded-md w-full bg-gray-200 text-lg"
                      />
                      <!-- <SuppliersList
                        :key="ii"
                        :data="i"
                        className="px-2 py-2 border flex bg-stone-500 text-white rounded"
                        :iconOnly="true"
                      /> -->
                    </div>
                  </td>
                  <!-- <td class="px-1 py-2 border border-solid">
                    <div class="flex justify-center">
                      <button
                        class="px-2 py-2 border flex bg-blue-500 text-white rounded"
                        @click.prevent="
                          (isBrandModalOpen = i.item_id != 0),
                            brandBehavior(i.item_id, ii)
                        "
                      >
                        <i class="fa fa-eye"></i>&nbsp;View
                      </button>
                    </div>
                  </td> -->
                  <td class="px-1 py-2 border border-solid">
                    <div class="flex">
                      <input
                        type="number"
                        v-model="i.requested_quantity"
                        min="0"
                        placeholder="Qty"
                        disabled
                        class="p-1 border rounded-l-md w-full bg-gray-200 text-lg"
                      />
                      <button
                        type="button"
                        class="border border-l-0 rounded-r-md px-2 bg-blue-500 text-white"
                      >
                        {{ i.unit_abbre }}
                      </button>
                    </div>
                  </td>
                  <td class="px-1 py-2 border border-solid">
                    <div class="flex">
                      <input
                        type="number"
                        v-model="i.quantity"
                        min="0"
                        placeholder="Qty"
                        class="p-1 border rounded-l-md w-full text-lg"
                      />
                      <button
                        type="button"
                        class="border border-l-0 rounded-r-md px-2 bg-red-500 text-white"
                      >
                        {{ i.unit_abbre }}
                      </button>
                    </div>
                  </td>
                  <!-- <td class="px-1 py-2 border border-solid text-lg">
                    <div class="flex justify-center">
                      {{ i.quantity_per_unit }}/{{ i.unit_abbre }}
                    </div>
                  </td> -->
                  <td class="px-1 py-2 border border-solid">
                    <input
                      type="number"
                      @change.prevent="calculateTotalPrice(ii)"
                      v-model="i.price"
                      :class="
                        i.price <= 0
                          ? 'animate-pulse border-blue-500 border-2'
                          : 'border-red-500'
                      "
                      step="any"
                      placeholder="Price"
                      class="p-1 border rounded-md w-full text-lg"
                    />
                  </td>
                  <!-- <td class="px-1 py-2 border border-solid">
                    <input
                      type="number"
                      @change.prevent="calculateTotalPrice(ii)"
                      v-model="i.discount_amount"
                      step="any"
                      placeholder="Discount"
                      class="p-1 border rounded-md w-full text-lg"
                    />
                  </td>
                  <td class="px-1 py-2 border border-solid">
                    <input
                      type="number"
                      v-model="i.vat"
                      step="any"
                      placeholder="VAT"
                      disbaled
                      class="p-1 border rounded-md w-full text-lg bg-gray-200"
                    />
                  </td> -->
                  <td class="px-1 py-2 border border-solid">
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
                      class="p-1 border rounded-md w-full bg-gray-200 text-lg"
                    />
                  </td>
                  <!-- <td class="px-1 py-2 border border-solid">
                    <SearchDropdown
                      apiEndpoint="chart-of-accounts/list"
                      :searchModel="searchCOA"
                      placeholder="Search COA"
                      itemLabel="name"
                      itemId="id"
                      inputId="coaName"
                      :defaultValue="i.chart_of_account_name"
                      @item-selected="(item) => fillCOAForm(item, ii)"
                      dataKey="chartOfAccounts"
                      returnName="['name','chartOfAccountTypeName']"
                      class="text-lg"
                    />
                  </td>
                  <td class="px-1 py-2 border border-solid">
                    <select
                      v-model="i.tax_type_id"
                      @change.prevent="calculateTotalPrice(ii)"
                      class="mt-1 p-1 border rounded-md w-full text-lg"
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
                  </td> -->
                  <td class="px-1 py-2 border border-solid">
                    <textarea
                      v-model="i.remarks"
                      placeholder="Remarks"
                      class="p-1 border rounded-md w-full text-lg"
                    ></textarea>
                  </td>
                  <td class="px-1 py-2 border border-solid text-center">
                    <button
                      @click.prevent="removeItemField(ii)"
                      type="button"
                      class="bg-red-500 text-white rounded py-2 px-2 text-sm md:text-md"
                    >
                      <i class="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
                <tr v-if="poForm.items?.length == 0">
                  <td
                    colspan="13"
                    class="px-1 py-2 border border-solid text-center text-red-500 font-bold"
                  >
                    **No items found**
                  </td>
                </tr>
              </tbody>
              <tfoot class="text-lg">
                <tr>
                  <th
                    scope="col"
                    colspan="3"
                    class="px-1 py-2 border border-solid text-right"
                  >
                    Total
                  </th>
                  <th class="px-1 py-2 border border-solid text-right">
                    {{ moneyFormatter(totalPrice) }}
                  </th>
                  <!-- <th class="px-1 py-2 border border-solid text-right">
                    {{ moneyFormatter(totalDiscount) }}
                  </th> -->
                  <!-- <th class="px-1 py-2 border border-solid text-right">
                    {{ moneyFormatter(totalVat ?? 0) }}
                  </th> -->
                  <th class="px-1 py-2 border border-solid text-right">
                    {{ moneyFormatter(totalAmount) }}
                  </th>
                  <th colspan="5" class="px-1 py-2 border border-solid"></th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="mb-4 mt-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Remarks</label
            >
            <textarea
              v-model="poForm.remarks"
              placeholder="Input Remarks"
              class="mt-1 p-2 border flex rounded-md w-full"
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
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
              type="button"
              @click.prevent="addToPO()"
              :disabled="poForm.items.length == 0"
              :class="poForm.items.length == 0 ? 'opacity-50' : ''"
              class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { VUE_APP_API_URL, DATE_NOW, COMPANIES, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";
import { moneyFormatter } from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

import SuppliersList from "@/views/Pages/Items/Actions/SuppliersList.vue";
const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
// Define props with a default value
const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
  pr_item_array: {
    type: Object,
    default: [],
  },
});
const isAddModalOpen = ref(false);
const isBrandModalOpen = ref(false);
const data = ref([]);
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const companies = ref([]);
const activeItemIndex = ref(0);
const tax = ref([]);
const poForm = ref({
  mrf_id: 0,
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
  supplierZohoId: '',
  tax_type_id: 0,
  remarks: "",
  items: [],
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
const searchItemBehavior = useDebounce(async (index, name) => {
  search.value.search = name;
  activeItemIndex.value = index;
  if (search.value.search?.length == 0) {
    poForm.value.items[index].mrf_item_id = 0;
    poForm.value.items[index].brand_id = 0;
  }
  listItems();
}, 500);
// const fillItemsForm = (item, index) => {
//   poForm.value.items[index].mrf_item_id = item.id;
//   poForm.value.items[index].mrf_item_name = item.name;

//   search.value.search = "";
// };
//supplier dropdown
const fillSupplierForm = (item) => {
  poForm.value.supplier_id = item.id;
  poForm.value.supplier_name = item.name + " " + item.supplierNumber;
  searchSupplier.value.search = "";
  poForm.value.supplier_id = item.zohoVendorId;
  
  supplierForm.value.supplier_id = item.id;
  supplierForm.value.tax_percentage = item.taxPercentage ?? 0;
  supplierForm.value.tax_type_id = item.taxTypeId ?? 0;
  supplierForm.value.pr_item_ids = props.pr_item_array;

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
    handleApiError(error);
  }
};
const calculateTotalPrice = (index) => {
  const rowData = poForm.value.items[index];

  // Ensure rowData exists and has valid properties
  if (!rowData) {
    console.error(`Invalid index: ${index}`);
    return;
  }

  // Safely parse numbers
  const price = parseFloat(rowData.price) || 0;
  const quantity = parseFloat(rowData.quantity) || 0;
  const taxPercentage = getVatDropdownPercentage(rowData.tax_type_id);
  const discount = parseFloat(rowData.discount_amount) || 0;

  // Calculate VAT
  const vatRate = taxPercentage;
  rowData.vat = price * vatRate;

  // Calculate total price (base total + VAT - discount)
  const baseTotal = price * quantity;
  rowData.total_price = baseTotal + rowData.vat - discount;
};
const getVatDropdownPercentage = (tax_id) => {
  // Assuming tax.value is an array of tax objects
  const matchingTax = tax.value.find((row) => row.value === tax_id);
  if (matchingTax) {
    return matchingTax.percentage; // Get the percentage
  } else {
    console.error("No matching tax type found.");
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
    const matchingPoItem = poItems.find((poItem) => poItem.id === item.pr_item_id);

    if (matchingPoItem) {
      // Set properties from the matching PO item
      item.price = matchingPoItem.price || 0;
      item.tax_type_id = supplierForm.value.tax_type_id || 0;
      item.discount_amount = matchingPoItem.discountAmount || 0;

      // Calculate VAT
      item.tax_percentage = supplierForm.value.tax_percentage || 0;
      item.vat = item.price * item.tax_percentage;

      // Calculate total price
      // Assuming VAT is not included in the price and discount is applied before VAT
      const baseTotal = matchingPoItem.price * (item.quantity || 0);

      item.total_price = baseTotal - item.discount_amount + item.vat; // Add VAT if it's excluded from the price

      anyItemUpdated = true;
    } else {
      // Handle cases where no matching PO item is found
      item.price = 0; // Default value
      item.tax_type_id = 0; // Default tax type
      item.discount_amount = 0;
      item.vat = 0;
      item.total_price = 0; // Default total price
    }
  });

  // If no items were updated, set all available_stocks to 0
  if (!anyItemUpdated) {
    poForm.value.items.forEach((item) => {
      item.price = 0;
      item.tax_type_id = 0;
    });
  }
};
const fillCOAForm = (item, index) => {
  poForm.value.items[index].chart_of_account_id = item.id;
  poForm.value.items[index].chart_of_account_name =
    item.name + " - " + item.chartOfAccountTypeName + "(" + item.reportCodeName + ")";

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
    handleApiError(error);
  }
};
const fillWarehouseForm = (item) => {
  poForm.value.warehouse_id = item.id;
  poForm.value.warehouse_name = item.name;

  searchWarehouse.value.search = "";
};
const addPRBehavior = () => {
  resetForm();
  // warehouseDropdown();
  companiesDropdown();
  taxDropDown();

  // Assuming `props.data` is the original array and you want to update `poForm.value.items`
  poForm.value.items = props.data;
};
const resetForm = () => {
  poForm.value.mrf_id = 0;
  poForm.value.date_now = DATE_NOW();
  poForm.value.remarks = "";
  poForm.value.po_manual_number = "";
  poForm.value.requested_to_user_id = 0;
  poForm.value.items = [];
};
const addToPO = async () => {
  try {
    const formData = FormDx(poForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}pos/add`,
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
const removeItemField = (index) => {
  // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
  poForm.value.items.splice(index, 1);
};
const brandBehavior = (item_id, index) => {
  searchBrand.value.item_id = item_id;
  searchBrand.value.active_index = index;
  listBrands();
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
  searchBrand.value.page_num = page_num ?? 1;
  listBrands();
};
const totalDiscount = computed(() => {
  return poForm.value.items.reduce(
    (acc, item) => acc + (parseFloat(item.discount) || 0),
    0
  );
});
const totalPrice = computed(() => {
  return poForm.value.items.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
});
const totalVAT = computed(() => {
  return poForm.value.items.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
});
const totalAmount = computed(() => {
  return poForm.value.items.reduce((acc, item) => acc + (parseFloat(item.vat) || 0), 0);
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
