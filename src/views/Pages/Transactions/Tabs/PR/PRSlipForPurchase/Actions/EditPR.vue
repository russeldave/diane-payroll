<template>
  <button
    @click="(isAddModalOpen = true), editPRBehavior()"
    class="bg-yellow-500 hover:opacity-70 focus:bg-yellow-300 text-white font-bold text-sm md:text-md py-2 px-4 mb-4 rounded-r float-end text-nowrap"
    >
    <i class="fas fa-edit"></i>
    Edit PR
  </button>
  <Modal :show="isAddModalOpen" :maxWidth="'fullscreen'" title="Edit Purchase Request" @close="closeModal()">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="editPR()">
        <div class="grid grid-cols-2 gap-6">
          <div class="mb-4 col-span-2 md:col-span-1">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Destination Location</label
            >
            <div class="flex items-center mt-1">
              <SearchDropdown
                apiEndpoint="mrfs/rooms-warehouses-list"
                :searchModel="searchLocation"
                placeholder="Search Location"
                itemLabel="name"
                itemId="id"
                :key="prForm.requested_destination_id"
                inputId="locationName"
                :defaultValue="prForm.requested_destination_name"
                formatLabel="none"
                @item-selected="(item) => fillLocationForm(item)"
                dataKey="roomsWarehouses"
                returnName="['completeName']"
              />
            </div>
          </div>
          <div class="mb-4 col-span-2 md:col-span-1">
            <label
              for="estimatedArrival"
              class="block text-sm font-medium text-gray-700"
              >Estimated Date of Arrival</label
            >
            <input
              type="date"
              id="estimatedArrival"
              v-model="prForm.estimated_arrival"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>
        
        <!-- Mobile view: Form-like layout -->
        <div v-if="isMobile" class="block lg:hidden">
          <div
            v-for="(i, ii) in prForm.items"
            v-if="prForm.items.length > 0"
            :key="ii"
            :class="['mb-4 p-4 border rounded-lg shadow', i.po_id ? 'bg-green-100 border-green-300' : '']"
          >
            <!-- Checkbox for mobile -->
            <div class="mb-2 flex items-center">
              <input
                type="checkbox"
                v-model="i.is_selected"
                :disabled="!i.conversions || i.conversions.length === 0 || i.po_id"
                class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="text-sm font-medium text-gray-700">Select Item</label>
              <span v-if="!i.conversions || i.conversions.length === 0" class="text-xs text-red-500 ml-2">
                (No conversions available)
              </span>
              <span v-if="i.po_id" class="text-xs text-green-600 ml-2 font-semibold">
                (Already in PO)
              </span>
            </div>
            
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
              <!-- Zoho ID for mobile -->
              <div v-if="i.zoho_item_id" class="text-xs text-gray-600 mt-1">
                Zoho ID: {{ i.zoho_item_id }}
              </div>
            </div>
            <!-- Item Dropdown -->
            <div class="mb-2">
              <label
                for="itemsName"
                class="block text-sm font-medium text-gray-700 mb-1"
                >MRF'ed Quantity</label
              >
              <div class="flex">
                <input
                  type="number"
                  id="ProductName"
                  v-model="i.mrf_quantity"
                  autocomplete="off"
                  min="1"
                  placeholder="Input Item Quantity"
                  step="any"
                  disabled
                  class="p-2 border rounded-l-md w-full bg-gray-200"
                />
                <button
                  type="button"
                  class="border border-l-0 rounded-r-md px-3 bg-red-500 text-white hover:bg-gray-300"
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
                >PR'ed Quantity</label
              >
              <div class="flex">
                <input
                  type="number"
                  id="ProductName"
                  v-model="i.quantity"
                  autocomplete="off"
                  min="1"
                  placeholder="Input Item Quantity"
                  step="any"
                  class="p-2 border rounded-l-md w-full"
                />
                <button
                  type="button"
                  class="border border-l-0 rounded-r-md px-3 bg-green-500 text-white hover:bg-gray-300"
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
                class="mt-1 p-2 border rounded-l-md w-full text-red-500"
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
                >Remarks</label
              >
              <textarea
                v-model="i.remarks"
                placeholder="Input Item Remarks"
                class="mt-1 p-2 border rounded-md w-full "
                id="remarks"
              ></textarea>
            </div>

            <!-- Remove Item Button -->
            <div class="flex justify-center">
              <EditPRItem v-if="hasPermission('PR_Slip_Item_Edit_Button')" :data="i" @transaction_id="handleTransaction" />
              <DeletePRItem v-if="hasPermission('PR_Slip_Item_Delete_Button')" :data="i" @transaction_id="handleTransaction" />
            </div>
          </div>

          <p
            v-if="prForm.items.length === 0"
            class="text-red-500 font-bold text-center"
          >
            **No items found**
          </p>
        </div>
        
        <div class="mb-4 overflow-auto" v-else>
          <label
            for="LeagueName"
            class="block text-sm font-medium mb-3 text-gray-700"
            >Items:</label
          >
          
          <!-- Selected Items Summary -->
          <div class="mb-4 p-3 bg-blue-50 rounded-md">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-blue-800">
                  Selected: {{ getSelectedCount() }} of {{ getSelectableItemsCount() }} items with Zoho ID
                </span>
                <div v-if="getSelectedCount() > 0" class="flex items-center gap-2">
                <PurchaseOrder
                  :data="pr_data"
                  :pr_item_array="getSelectedItems()"
                  :pr_estimate_date="prForm.estimated_arrival"
                  :pr_number="prForm.pr_number"
                  @transaction_id="handleTransaction"
                  @remove_pr_item="removeItemField"
                />
              </div>
              </div>
            </div>
          
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class=" text-white shadow" :class="DEFAULT_BG">
              <tr class="border border-solid text-nowrap">
                <!-- New Checkbox Column -->
                <th
                  scope="col"
                  class="px-2 py-3 text-center text-sm font-medium uppercase tracking-wider border border-solid"
                >
                  <div class="flex items-center justify-center">
                      <!-- @change="toggleSelectAll"
                      :indeterminate="isSomeSelected"
                      :disabled="getSelectableItemsCount() === 0" -->
                    <input
                      type="checkbox"
                      disabbled
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm font-medium uppercase tracking-wider border border-solid"
                >
                  Item Name
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm ont-medium uppercase tracking-wider border border-solid bg-red-500"
                >
                  MRF
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm font-medium tracking-wider border border-solid bg-green-500"
                >
                  PR'ed
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm font-medium tracking-wider border border-solid bg-green-500"
                  
                >
                  conversions
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm font-medium tracking-wider border border-solid bg-cyan-500"
                >
                  PR Price (<span class="text-xl font-bold">₱</span>)
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm font-medium tracking-wider border border-solid bg-gray-500"
                >
                  Total (<span class="text-xl font-bold">₱</span>)
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-center text-sm font-medium uppercase tracking-wider border border-solid"
                >
                  To Employee
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm font-medium uppercase tracking-wider border border-solid"
                >
                  Remarks
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-center text-sm font-medium uppercase tracking-wider border border-solid"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loop through products and display them -->
              <tr
                v-for="(i, ii) in prForm.items"
                v-if="prForm.items.length > 0"
                :key="ii"
                :class="['border border-solid text-sm hover:bg-gray-400', i.po_id ? 'bg-green-100 hover:bg-green-200' : '']"
                >
                
                <td class="px-2 py-3 border border-solid text-center">
                  <input
                    type="checkbox"
                    v-model="i.is_selected"
                    :disabled="!isItemSelectable(i)"
                    @change="selectedItemID(i)"
                    class="h-7 w-7 text-slate-600 border-gray-300 rounded-md hover:border-lime-500 hover:ring-2 hover:ring-lime-200"
                  />
                  <div v-if="i.po_id" class="text-xs text-green-600 mt-1 font-semibold">
                    In PO
                  </div>
                </td>
                
                <td class="px-2 py-3 border border-solid">
                  <div class="flex justify-between mt-1">
                    <div class="flex flex-col">
                      <!-- Item Name -->
                      <div class="flex items-center">
                        <ItemTitle :item_id="i.item_id" :key="i.item_id" :item_name="i.item_name" />
                        <span 
                          v-if="i.unit_abbre != i.to_unit_abbre"
                          class="italic text-red-500 ml-1"
                        >
                          &nbsp;({{i.conversion_rate }} {{i.unit_abbre }}/{{ i.to_unit_abbre ?? '' }})
                        </span>
                      </div>
                      
                      <!-- Zoho ID Display -->
                      <div v-if="i.zoho_item_id" class="text-xs text-gray-600 mt-1">
                        Zoho ID: {{ i.zoho_item_id }}
                      </div>
                    </div>
                    <AssignConversions v-if="i.isPurchase == 0" :data="i" :key="i.item_id"/>
                  </div>
                  <div
                    class="absolute bg-white shadow z-50"
                    v-if="search.search != '' && activeItemIndex == ii"
                  >
                    <ul class="">
                      <li
                        class="p-1 border-l-2 border-lime-200 flex py-2 font-bold shadow text-gray-600"
                        @click.prevent="fillItemsForm(item, ii)"
                        v-for="(item, index) in items"
                        :key="index"
                      >
                        {{ item.sku }} - {{ item.name }}
                      </li>
                    </ul>
                  </div>
                </td>
                
                <!-- Rest of your table cells remain the same -->
                <td class="px-2 border border-solid bg-gray-200">
                  <div class=" w-[80px]">
                    <span class="text-sm">
                      {{i.mrf_quantity}} {{ i.unit_abbre }}
                    </span>
                  </div>
                </td>
                <td class="pt-4 px-2 border border-solid bg-gray-200 hover:bg-gray-400">
                  <span class="text-sm">
                    {{i.quantity}} {{ i.unit_abbre }}
                  </span>
                  <span class="italic text-red-500 text-sm">
                    (₱{{ i.pr_price }}/{{ i.unit_abbre }})
                  </span>
                </td>
                <td class="px-2 pt-4 border border-solid bg-emerald-300">
                  <!-- -------------------Conversions Header----------------- -->
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.coversion_quantity"
                      @input.prevent="updatePrPrice(i, ii)"
                      placeholder="Input Item Quantity"
                      step="any"
                      class="p-2 border rounded-l-md w-[100px]"
                       :disabled="i.isPurchase == 1 "
                    />
                    {{ i.unitId }}
                    <select
                      v-model="i.to_unit_id"
                      @change="handleConversionChange(i)"
                      class="shadow shadow-gray-700 flex-1 font-bold rounded-r-md bg-amber-500 text-white"
                      
                      >
                      <option
                        v-for="(conversion, cIndex) in i.conversions"
                        :key="cIndex"
                        :value="conversion.toUnitId"
                      >
                        {{ conversion.toUnitAbbre ?? '' }}
                      </option>
                    </select>
                  </div>
                </td>
                <td class="px-2 py-3 border border-solid bg-emerald-300">
                  <!-- PR Price Header -->
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.pr_price_conversion"
                      @input.prevent="updatePrPrice(i, ii)"
                      step="any"
                      placeholder="Input pr item Price"
                      class="p-2 border border-cyan-500 rounded-md w-full"
                      :disabled="i.isPurchase == 1"
                      />
                  </div>
                </td>
                
                <td class="px-2 py-2 border border-solid bg-gray-200">
                  <!-- Total header -->
                  <div class="flex justify-center text-sm font-bold  italic rounded-lg">
                      <span 
                        class="bg-orange-600 underline text-white px-2 rounded-md"
                        v-if="i.isPurchase == 0">PR...
                      </span>
                      <span
                        class="bg-lime-600 underline text-white px-2 rounded-md"
                        v-if="i.isPurchase == 1">PO...
                      </span>
                      <span
                        class="bg-blue-600 underline text-white px-2 rounded-md"
                        v-if="i.isPurchase == 2">Arrived...
                      </span>
                    </div>
                  <div class="flex w-[100px] justify-center">
                    <span class="text-lg font-bold underline">
                      ₱{{(i.coversion_quantity * i.pr_price_conversion).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                    </span>
                  </div>
                </td>
                <td class="px-2 py-1 border border-solid  bg-emerald-300">
                  <div class="w-[10rem]">
                   
                    <p><strong>To: </strong>{{ i.to_employee_name }}</p>
                  </div>
                </td>
                <td class="px-2 py-3 border border-solid  bg-emerald-300">
                  <textarea
                    v-model="i.pr_remarks"
                    placeholder="Input Item Remarks"
                    class="mt-1 p-2 border rounded-md w-[120px]"
                    :disabled="i.isPurchase == 1"
                  ></textarea>
                </td>
                <td class="px-2 py-3 border border-solid">
                  <div class="flex justify-center items-start">
                    <Gallery :item_id_number="i.ingredient_id_number" :data="i"/>
                    <AssignWarehouse
                      v-if="hasPermission('Assign_Ingredient_Warehouse_Button')"
                      :data="i"
                      :unpack="false"
                      @transaction_id="handleTransaction"
                    />
                    <EditPRItemToNotPurchase v-if="i.isPurchase == 1" :data="i" @transaction_id="handleTransaction" />
                    <EditPRItemToPurchase v-if="i.isPurchase == 0" :data="i" @transaction_id="handleTransaction" />
                    <!-- <EditPRItemQuantity v-if="hasPermission('PR_Slip_Item_Edit_Button') && i.isPurchase == 0" :data="i" @transaction_id="handleTransaction" /> -->
                    <RejectPRItem v-if="hasPermission('PR_Slip_Item_Reject_Button')" :data="i" @transaction_id="handleTransaction" />
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td class="px-2 py-3 border border-solid" colspan="12">
                  <p class="text-red-500 font-bold text-center">
                    **No items found**
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Rest of your form remains the same -->
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            v-model="prForm.remarks"
            placeholder="Input Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="isAddModalOpen = false"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            :class="isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ isSubmitting ? 'Updating...' : 'Update PR' }}
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useDebounceFn } from '@vueuse/core'
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { VUE_APP_API_URL, DATE_NOW, COMPANIES, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError
} from "@/views/Utility/Helper";

import { hasPermission } from "@/views/Utility/Permissions";
import DeletePRItem from "./DeletePRItem.vue";
import EditPRItemToNotPurchase from "./EditPRItemToNotPurchase.vue";
import EditPRItemToPurchase from "./EditPRItemToPurchase.vue";
import EditPRItemQuantity from "./EditPRItemQuantity.vue";
import RejectPRItem from "./RejectPRItem.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";
import AssignConversions from "@/views/Pages/Ingredients/Actions/AssignConversions.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import AssignWarehouse from "../../../Requested/Pending/Actions/AssignWarehouse.vue";
import PurchaseOrder from "./PurchaseOrder.vue";
import Gallery from "@/views/Pages/Ingredients/Actions/Gallery.vue";
import { useLocalStorage } from '@vueuse/core';

const closeModal = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = true;
};
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

// Add pr_data ref
const pr_data = ref([]);
const pr_item_array = ref([]);

const isHydrated = ref(false)

const searchLocation = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const isAddModalOpen = ref(false);
const isSubmitting = ref(false);
const isMobile = ref(window.innerWidth < 768);
const items = ref([]);
const companies = ref([]);
const activeItemIndex = ref(0);
const prForm = ref({
  pr_id: 0,
  date_now: DATE_NOW(),
  requested_to_user_id: 0,
  requested_to_user_name: "",
  requested_by_user_id: 0,
  requested_by_user_name: "",
  requested_destination_name: "",
  requested_destination_id: 0,
  estimated_arrival: "",
  remarks: "",
  pr_manual_number: "",
  pr_number: "",
  pr_remarks: "",
  items: [],
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

// Computed properties for select all functionality - UPDATED for Zoho ID and PO ID
const getSelectableItemsCount = () => {
  return prForm.value.items.filter(item => 
    item.zoho_item_id && item.zoho_item_id !== '' && !item.po_id
  ).length;
};

const isAllSelected = computed(() => {
  const selectableItems = prForm.value.items.filter(item => 
    item.zoho_item_id && item.zoho_item_id !== '' && !item.po_id
  );
  return selectableItems.length > 0 && 
         selectableItems.every(item => item.is_selected);
});

const isSomeSelected = computed(() => {
  const selectableItems = prForm.value.items.filter(item => 
    item.zoho_item_id && item.zoho_item_id !== '' && !item.po_id
  );
  return selectableItems.some(item => item.is_selected) && 
         !isAllSelected.value;
});

// Helper function to check if item is selectable
const isItemSelectable = (item) => {
  return !item.po_id;
  // return item.zoho_item_id && item.zoho_item_id !== '' && !item.po_id;
};

//items dropdown
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
    handleApiError(error);
  }
};

const searchItemBehavior = (index, name) => {
  search.value.search = name;
  activeItemIndex.value = index;
  if (search.value.search?.length == 0) {
    prForm.value.items[index].mrf_item_id = 0;
  }
  listItems();
};

const fillItemsForm = (item, index) => {
  data.prItems.value[index] = item;
  search.value.search = "";
};

//add
const editPRBehavior = () => {
  resetForm();
  fillForm();
  companiesDropdown();
};

const fillForm = () => {
  const data = props.data;

  // console.log(data);
  prForm.value.pr_id = data.id;
  prForm.value.date_now = data.dateOfPr;
  prForm.value.remarks = data.prRemarks;
  prForm.value.pr_manual_number = data.prManualNumber;
  prForm.value.pr_number = data.prNumber;
  prForm.value.estimated_arrival = data.estimatedArrival || "";
  prForm.value.items = [];

  listItemsPerPR(prForm.value.pr_id);
};

const fillLocationForm = (item) => {
  prForm.value.requested_destination_id = item.id;
  prForm.value.requested_destination_name = item.completeName || item.name;
  searchLocation.value.search = "";
};

const listItemsPerPR = async (id) => {
  try {
    search.value.pr_id = id;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/get-items-per-pr`,
      formData,
      BearToken(token)
    );
    console.log('Item conversions:', response.data.prItems);
    prForm.value.items = response.data.prItems.map((item) => {
      // Set the first conversion as default if conversions exist
      const defaultConversion = item.conversions && item.conversions.length > 0 
        ? item.conversions[0] 
        : null;
      
      console.log('Default conversion:', defaultConversion);
      
      return {
        pr_item_id: item.id,
        item_id: item.itemId,
        item_name: item.ingredientIdNumber + " - " + item.itemName,
        ingredient_id_number: item.ingredientIdNumber,
        mrf_quantity: item.mrfItemQuantity ?? 0,
        po_quantity: item.poItemQuantity ?? 0,
        quantity: item.quantity ?? 0,
        unit_abbre: item.unitAbbre,
        quantity_per_unit: item.quantityPerUnit,
        pr_price: parseFloat(item.price),
        brand_id: item.brandId,
        pr_remarks: item.prRemarks,
        conversions: item.conversions,
        unit_id: item.unitId,
        to_unit_id: defaultConversion ? defaultConversion.toUnitId : item.toUnitId,
        to_employee_name: item.toEmployeeName,
        pr_price_conversion: parseFloat(item.prPriceConversion) || 0,
        to_unit_abbre: defaultConversion ? defaultConversion.toUnitAbbre : item.toUnitAbbre,
        conversion_rate: defaultConversion ? defaultConversion.conversionRate : item.conversionRate,
        coversion_quantity: item.conversionQuantity,
        isPurchase: item.isPurchase,
        zoho_item_id: defaultConversion ? defaultConversion.zohoItemId : null,
        conversion_id: defaultConversion ? defaultConversion.id : null,
        po_id: item.poId, // Add po_id to track if item is already in PO
        is_selected: false
      };
    });
    
    prForm.value.remarks = response.data.pr.remarks;
    prForm.value.requested_destination_name = response.data.pr.fullDestination;
    prForm.value.requested_destination_id = response.data.pr.destinationWarehouseId;
    prForm.value.estimated_arrival = response.data.pr.estimateTimeArrival || "";

    checkSelected();
  } catch (error) {
    handleApiError(error);
  }
};

// Checkbox functions
const getSelectedItems = () => {
  return prForm.value.items.filter(item => item.is_selected);
};

const getSelectedCount = () => {
  // console.log("getSelectedCount in line: 740")
  // console.log(pr_data.value.length);
  return pr_data.value.length;
};

const toggleSelectAll = () => {
  const selectableItems = prForm.value.items.filter(item => 
    item.zoho_item_id && item.zoho_item_id !== '' && !item.po_id
  );
  
  const newValue = !isAllSelected.value;
  
  selectableItems.forEach(item => {
    item.is_selected = newValue;
    selectedItemID(item);
  });
};

const checkSelected = () => {
  // Ensure we check against the mapped prForm items
  prForm.value.items.forEach((item) => {
    item.is_selected = pr_data.value.some(
      (pr) => pr.pr_item_id === item.pr_item_id
    );
  });
};

// Function to handle item selection and populate pr_data
const selectedItemID = (item) => {
  console.log('selectedItemId line: 774');
  console.log(item)
  if (item.is_selected) {
    // Check if item already exists to avoid duplicates
    const existingIndex = pr_data.value.findIndex((prItem) => prItem.pr_item_id === item.pr_item_id);
    
    if (existingIndex === -1) {
      // Add item to pr_data when selected with all conversion data
      pr_data.value.push({
        pr_item_id: item.pr_item_id,
        item_id: item.item_id,
        item_name: item.item_name,
        ingredient_id_number: item.ingredient_id_number,
        quantity: item.quantity,
        unit_abbre: item.unit_abbre,
        pr_price: item.pr_price_conversion,
        pr_remarks: item.pr_remarks,
        zoho_item_id: item.zoho_item_id,
        quantity_per_unit: item.quantity_per_unit,
        brand_id: item.brand_id,
        unit_id: item.unit_id,
        to_unit_id: item.to_unit_id,
        to_employee_name: item.to_employee_name,
        pr_price_conversion: item.pr_price_conversion,
        to_unit_abbre: item.to_unit_abbre,
        conversion_rate: item.conversion_rate,
        coversion_quantity: item.coversion_quantity,
        isPurchase: item.isPurchase,
        conversion_id: item.conversion_id,
        conversion_name: getConversionName(item.conversions,item.conversion_id),
      });
    } else {
      // Update existing item with current conversion data
      pr_data.value[existingIndex] = {
        ...pr_data.value[existingIndex],
        to_unit_id: item.to_unit_id,
        to_unit_abbre: item.to_unit_abbre,
        conversion_rate: item.conversion_rate,
        zoho_item_id: item.zoho_item_id,
        conversion_id: item.conversion_id,
        pr_price_conversion: item.pr_price_conversion,
        coversion_quantity: item.coversion_quantity,
        pr_price: item.pr_price,
        quantity: item.quantity,
        conversion_name: getConversionName(item.conversions,item.conversion_id),
      };
    }
  } else {
    // Remove item from pr_data when deselected
    const indexToRemove = pr_data.value.findIndex((prItem) => prItem.pr_item_id === item.pr_item_id);
    if (indexToRemove !== -1) {
      pr_data.value.splice(indexToRemove, 1);
    }
  }
  
  // console.log('Current pr_data:', pr_data.value);
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listItemsPerPR(prForm.value.pr_id);
};

const handleTransaction = (transaction_id) => {
  // Reset pr_data when transaction is completed
  pr_data.value = [];
  listItemsPerPR(prForm.value.pr_id);
};

// Rest of your existing functions remain the same...
const computeTotalPrPrice = (quantity, pr_price, index) => {
  const q = parseFloat(quantity) || 0;
  const p = parseFloat(pr_price) || 0;
  const totalPrPrices = (q * p).toFixed(2); 
  console.log("computeTotalPrPrice quantity: "+quantity+ "Pr Price" + pr_price + "index"+index);
  console.log(totalPrPrices);

  prForm.value.items[index].conversion_pr_total_price = totalPrPrices;
};


const computePRMainQuantity = (item, index) => {
  console.log('computePrMainQuantity')
  // Store the current selection state
  const wasSelected = item.is_selected;
  
  const c_r = parseFloat(item.conversion_rate) || 0;
  const c_q = parseFloat(item.coversion_quantity) || 0;
  const mainQuantity = (c_r * c_q).toFixed(2); 

  prForm.value.items[index].quantity = mainQuantity;

  const c_p = parseFloat(item.pr_price_conversion) || 0;
  const q = parseFloat(item.conversion_rate) || 0;
  const mainPrPrice = (c_p / q).toFixed(4); 
  prForm.value.items[index].pr_price = mainPrPrice;

  // Restore the selection state
  prForm.value.items[index].is_selected = wasSelected;

  // Automatically update pr_data when price or quantity changes
  if (wasSelected) {
    updatePRDataItem(item);
  }
};

const editPR = async () => {
  if (!prForm.value.requested_destination_id) {
    Alert("error", "Error", "Please select a destination location");
    return;
  }

  isSubmitting.value = true;
  
  try {
    const formData = new FormData();
    formData.append('pr_id', prForm.value.pr_id);
    formData.append('remarks', prForm.value.remarks);
    formData.append('requested_destination_id', prForm.value.requested_destination_id);
    formData.append('estimated_arrival', prForm.value.estimated_arrival);

    const response = await axios.post(
      `${VUE_APP_API_URL}prs/update-remarks-destination`,
      formData,
      BearToken(token)
    );

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
    
  } catch (error) {
    handleApiError(error);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  prForm.value.mrf_id = 0;
  prForm.value.date_now = DATE_NOW();
  prForm.value.remarks = "";
  prForm.value.pr_manual_number = "";
  prForm.value.requested_to_user_id = 0;
  prForm.value.estimated_arrival = "";
  prForm.value.items = [];
  // pr_data.value = []; // Reset pr_data when form is reset
};

const removeItemField = (item) => {
  // Optional: existing logic
  selectedItemID(item)

  // 1️⃣ Set is_selected = false in prForm.items
  const formItem = prForm.value.items.find(
    i => i.pr_item_id === item.pr_item_id
  )

  if (formItem) {
    formItem.is_selected = false
  }

  // 2️⃣ Remove item from pr_data
  pr_data.value = pr_data.value.filter(
    i => i.pr_item_id !== item.pr_item_id
  )
}

const companiesDropdown = async () => {
  companies.value = await COMPANIES();
};

const handleConversionChange = (item) => {
  console.log("handleConversionChange in line: 943");
  console.log(item)
  // Store the current selection state before changing conversion
  const wasSelected = item.is_selected;
  
  const selectedConversion = item.conversions.find(
    (c) => c.toUnitId === item.to_unit_id
  );
  
  if (selectedConversion) {
    // Update all the conversion-related properties
    item.conversion_rate = selectedConversion.conversionRate;
    item.to_unit_abbre = selectedConversion.toUnitAbbre;
    item.zoho_item_id = selectedConversion.zohoItemId;
    item.conversion_id = selectedConversion.id;
    conversion_name: getConversionName(item.conversions,item.conversion_id)
    
    // Recalculate main quantity and price based on new conversion
    if (item.coversion_quantity && item.pr_price_conversion) {
      computePRMainQuantity(item, prForm.value.items.findIndex(i => i.pr_item_id === item.pr_item_id));
    }
    
    // Restore the selection state
    item.is_selected = wasSelected;
    
    // Also update the pr_data if this item is selected
    if (wasSelected) {
      updatePRDataItem(item);
    }
  }
  console.log('Selected conversion:', selectedConversion);
  console.log('Updated item:', item);
};

const getConversionName = (conversions, conversion_id) => {
  const conversion = conversions.find(
    c => c.id === conversion_id
  )

  return conversion ? conversion.name : 'n/a'
}

// Helper function to update pr_data when conversion changes
const updatePRDataItem = (item) => {
  const index = pr_data.value.findIndex(prItem => prItem.pr_item_id === item.pr_item_id);
  if (index !== -1) {
    console.log('UpdatePRDataItem in line 991');
    console.log(item);
    pr_data.value[index] = {
      ...pr_data.value[index],
      conversion_rate: item.conversion_rate,
      to_unit_abbre: item.to_unit_abbre,
      zoho_item_id: item.zoho_item_id,
      to_unit_id: item.to_unit_id,
      conversion_id: item.conversion_id,
      pr_price_conversion: item.pr_price_conversion,
      coversion_quantity: item.coversion_quantity,
      pr_price: item.pr_price,
      quantity: item.quantity,
      conversion_name: getConversionName(item.conversions,item.conversion_id)
    };
    console.log('Updated pr_data item:', pr_data.value[index]);
  }
};

const updatePrPrice = useDebounceFn((item, index) => {
  // console.log("updatePrPrice: "+ index)
  computePRMainQuantity(item, index) 
  editPrItem(item)
}, 900)

const editPrItem = async (item) => {
  console.log("editPrItem");
  // console.log(props.data);
  try {
      const formData = FormDx({ 
        pr_item_id: item.pr_item_id,
        pr_item_price: item.pr_price,
        pr_price_conversion: item.pr_price_conversion,
        quantity: item.quantity,
        remarks: item.pr_remarks,
        unit_id: item.unit_id,
        to_unit_id: item.to_unit_id,
        conversion_rate: item.conversion_rate,
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}prs/edit-pr-item`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Alert("success", "PR Items Updated!", response.data.message);
    // emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};

// Watch for screen size changes
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};
watch(() => window.innerWidth, handleResize);


onMounted(() => {
  const savedData = localStorage.getItem("prData")
  const savedIds = localStorage.getItem("prItems")

  if (savedData) pr_data.value = JSON.parse(savedData)
  if (savedIds) pr_item_array.value = JSON.parse(savedIds)

  checkSelected();
  // allow saving AFTER load
  isHydrated.value = true
  // console.log('onMounted in line: 995')
  // console.log(pr_data.value);
  window.addEventListener("resize", handleResize);
});

// 2. Watch for changes and save automatically
watch(pr_data, (newVal) => {
  // if (!isHydrated) return
  localStorage.setItem("prData", JSON.stringify(newVal))
}, { deep: true })

watch(pr_item_array, (newVal) => {
  // if (!isHydrated.value) return
  localStorage.setItem("prItems", JSON.stringify(newVal))
}, { deep: true })
</script>