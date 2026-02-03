<template>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >PR No.</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="poForm.pr_number"
              disabled
              placeholder="Input PO Manual Number"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div> -->
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Supplier: <small v-if="poForm.supplierZohoId" class="text-red-600 italic">({{ poForm.supplierZohoId }})</small></label
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
                returnName="['name','supplierNumber','terms']"
              />
              <SyncSupplier
                :data="selectedSupplier"
                @zoho-vendor-synced="handleZohoVendorSynced"
                @transaction_id="handleTransaction"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
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
                @item-selected="(data) => fillWarehouseForm(data)"
                dataKey="warehouses"
                returnName="['name']"
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
              @change.prevent="updateDeliveryDate"
              id="estimatedArrival"
              v-model="poForm.estimate_date"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Exesting PO: <small v-if="poForm.supplierZohoId" class="text-red-600 italic">({{ poForm.supplierZohoId }})</small></label
            >
            <div class="flex items-center mt-1">
              <SearchDropdown
                apiEndpoint="pos/list"
                :searchModel="searchPos"
                placeholder="Search Existing PO's"
                itemLabel="name"
                itemId="id"
                inputId="existingPo"
                @item-selected="(data) => fillPoForm(data)"
                dataKey="POS"
                returnName="['poNumber']"
              />
            </div>
          </div>

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

              <!-- PR'ed Quantity -->
              <div class="mb-2">
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1"
                  >PR'ed Quantity</label
                >
                <div class="flex">
                  <input
                    type="number"
                    id="ProductName"
                    :value="i.requested_quantity"
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
              
              <!-- PO'ed Quantity -->
              <div class="mb-2">
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1"
                  >PO'ed Quantity</label
                >
                <div class="flex">
                  <input
                    type="number"
                    id="ProductName"
                    :value="i.coversion_quantity"
                    min="1"
                    step="any"
                    placeholder="Input Item Quantity"
                    disabled
                    class="p-2 border border-red-500 rounded-l-md w-full bg-gray-200"
                  />
                  <button
                    type="button"
                    class="border border-l-0 rounded-r-md px-3 bg-red-500 text-white hover:bg-gray-300"
                  >
                    {{ i.to_unit_abbre ?? "-" }}
                  </button>
                </div>
              </div>

              <!-- Price -->
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

              <!-- Total -->
              <div class="mb-2">
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1"
                  >Total</label
                >
                <div class="flex">
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
                  @click.prevent="removeItemField(i,ii)"
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
                  <th
                    scope="col"
                    width="8%"
                    class="px-1 py-2 text-right uppercase tracking-wider border border-solid bg-blue-500"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    width="8%"
                    class="px-1 py-2 text-right uppercase tracking-wider border border-solid bg-emerald-500"
                  >
                    Total
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
                    class="px-1 py-2 text-center uppercase tracking-wider border border-solid"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr
                  v-for="(i, ii) in poForm.items"
                  :key="ii"
                  class="border border-solid text-sm"
                >
                  <td class="p-1 border border-solid">
                    <div class="flex flex-col w-full">
                      <span
                        v-if="i.zoho_item_id"
                        class="p-1 border rounded-md w-full bg-gray-200 text-lg"
                        >
                        {{  i.conversion_name}}
                      </span>
                      <span
                        v-else
                        class="p-1 border rounded-md w-full bg-gray-200 text-lg">
                        {{ i.item_name }}
                      </span>
                      <div>
                        <span>ZohoID:</span>
                        <span class="text-red-500">{{ i.zoho_item_id }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-1 py-2 border border-solid">
                    <div class="flex justify-center bg-gray-200 p-2 rounded-md">
                      <span class="text-lg">{{ i.quantity }}</span>
                      <span class="text-red-500 italic">{{ i.unit_abbre }}</span>
                      <!-- <input
                        type="number"
                        :value="i.quantity"
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
                      </button> -->
                    </div>
                  </td>
                  <td class="px-1 py-1 border border-solid">
                    <div class="flex justify-center bg-gray-200 p-2 rounded-md">
                      <span class="text-lg">{{ i.coversion_quantity }}</span>
                      <span class="text-red-500 italic">{{ i.to_unit_abbre }}</span>

                      <!-- <input
                        type="number"
                        :value="i.coversion_quantity"
                        min="0"
                        placeholder="Qty"
                        disabled
                        class="p-1 border rounded-l-md w-full bg-gray-200 text-lg"
                      />
                      <button
                        type="button"
                        class="border border-l-0 rounded-r-md px-2 bg-red-500 text-white"
                      >
                        {{ i.to_unit_abbre }}
                      </button> -->
                    </div>
                  </td>
                  <td class="px-1 py-1 border border-solid">
                    <div class="flex justify-center bg-gray-200 p-2 rounded-md">
                      <span class="text-lg">₱</span>
                      <span class="text-lg">{{ i.pr_price }}</span>
                    </div>

                        <!-- <input
                          type="number"
                          @input="calculateTotalPrice(ii)"
                          v-model="i.pr_price"
                          :class="
                            i.pr_price <= 0
                              ? 'animate-pulse border-blue-500 border-2'
                              : 'border-red-500'
                          "
                          step="any"
                          disabled
                          placeholder="Price"
                          class="p-1 border rounded-md w-full text-lg"
                        /> -->
                  </td>
                  <td class="px-1 py-2 border border-solid">
                    <div class="flex justify-center bg-gray-200 p-2 rounded-md">
                      <span class="text-lg underline font-semibold">₱</span>
                      <span class="text-lg underline font-semibold">{{ i.total_price }}</span>
                    </div>

                    <!-- <input
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
                    /> -->
                  </td>
                  <td class="px-1 py-2 border border-solid">
                    <textarea
                      v-model="i.remarks"
                      placeholder="Remarks"
                      class="p-1 border rounded-md w-full text-lg"
                    ></textarea>
                  </td>
                  <td class="px-1 py-2 border border-solid text-center">
                    <button
                      @click.prevent="removeItemField(i, ii)"
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
                    colspan="4"
                    class="px-1 py-2 border border-solid text-right"
                  >
                    Total
                  </th>
                  <th class="px-1 py-2 border border-solid text-right">
                    {{ moneyFormatter(totalAmount) }}
                  </th>
                  <th colspan="2" class="px-1 py-2 border border-solid"></th>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="mb-4 mt-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Remarks</label
            >
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-sm italic text-gray-600">{{ initialNotes }}</span>
            <textarea
              v-model="poForm.remarks"
              placeholder="Input Remarks"
              rows="3"
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
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Terms & Condition</label
            >
            <textarea
              v-model="poForm.terms"
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
import { moneyFormatter} from "@/views/Utility/Helper";
import {formatDate} from "@/views/Utility/Formatter.js"
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import SuppliersList from "@/views/Pages/Items/Actions/SuppliersList.vue";
import SyncSupplier from "../../PRItemsReceiving/Actions/SyncSupplier.vue";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits([
  'transaction_id',
  'remove_pr_item'
]);
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
  pr_estimate_date: Date,
  pr_number: String,
});

const isAddModalOpen = ref(false);
const isBrandModalOpen = ref(false);
const data = ref([]);
const isMobile = ref(window.innerWidth < 768);
const companies = ref([]);
const activeItemIndex = ref(0);
const selectedSupplier = ref(null);
const deliveryDate = ref('');
const initialNotes = ref('');

// Add pr_data ref
// const pr_data = ref([]);
// const pr_item_array = ref([]);

// const isHydrated = ref(false)

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
  existing_po_id: "",
  warehouse_id: 0,
  warehouse_name: "",
  supplier_id: 0,
  estimate_date: props.pr_estimate_date,
  pr_number: props.pr_number,
  supplier_name: "",
  supplierZohoId: '',
  conversion_id: 0,
  remarks: "",
  items: [],
});
console.log(props.data);

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

const searchPos = ref({
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

// Computed properties
const showSyncButton = computed(() => {
  return !poForm.value.supplierZohoId || poForm.value.supplierZohoId.toString().trim() === '';
});

const totalAmount = computed(() => {
  return poForm.value.items.reduce((acc, item) => {
    return acc + (parseFloat(item.pr_price) || 0) * (parseFloat(item.coversion_quantity) || 0);
  }, 0);
});

// Methods
const companiesDropdown = async () => {
  companies.value = await COMPANIES();
};

const updateDeliveryDate = () =>{
  deliveryDate.value = poForm.value.estimate_date;
  const user = JSON.parse(localStorage.getItem('user'));
  initialNotes.value = 
    'Prepared by: ' + user[0].employeeName + '\n' +
    'Delivery Date: ' + formatDate(deliveryDate.value) + '\n';
}

const calculateTotalPrice = (index) => {
  const rowData = poForm.value.items[index];

  if (!rowData) {
    console.error(`Invalid index: ${index}`);
    return;
  }

  // Safely parse numbers
  const pr_price = parseFloat(rowData.pr_price) || 0;
  const quantity = parseFloat(rowData.coversion_quantity) || 0;
  
  // Calculate total price
  rowData.total_price = pr_price * quantity;

  console.log(`Calculated total: ${pr_price} * ${quantity} = ${rowData.total_price}`);
};

const handleZohoVendorSynced = (syncData) => {
  console.log("Zoho vendor synced:", syncData);
  poForm.value.supplierZohoId = syncData.zohoVendorId;
};

const fillSupplierForm = (item) => {
  
  poForm.value.supplier_id = item.id;
  poForm.value.supplier_name = item.name + " " + item.supplierNumber;
  searchSupplier.value.search = "";
  poForm.value.supplierZohoId = item.zohoVendorId;
  poForm.value.terms = item.terms;

  selectedSupplier.value = item;
  supplierForm.value.supplier_id = item.id;
  supplierForm.value.pr_item_ids = props.pr_item_array;

};

const fillPoForm = (item) => {
  poForm.value.existing_po_id = item.zohoPoId;
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

const fillSupplierPrice = (poItems) => {
  if (!Array.isArray(poForm.value.items) || !Array.isArray(poItems)) {
    console.error("Items or poItems is not an array");
    return;
  }

  if (poForm.value.items.length === 0) {
    console.error("No items found in poForm.value.items");
    return;
  }

  let anyItemUpdated = false;

  poForm.value.items.forEach((item) => {
    const matchingPoItem = poItems.find((poItem) => poItem.id === item.pr_item_id);

    if (matchingPoItem) {
      item.pr_price = matchingPoItem.price || 0;
      item.total_price = matchingPoItem.price * item.coversion_quantity;
      anyItemUpdated = true;
    }
  });

  if (!anyItemUpdated) {
    poForm.value.items.forEach((item) => {
      item.pr_price = 0;
    });
  }
};

const fillCOAForm = (item, index) => {
  poForm.value.items[index].chart_of_account_id = item.id;
  poForm.value.items[index].chart_of_account_name =
    item.name + " - " + item.chartOfAccountTypeName + "(" + item.reportCodeName + ")";
  searchCOA.value.search = "";
};

const fillWarehouseForm = (item) => {
  poForm.value.warehouse_id = item.id;
  poForm.value.warehouse_name = item.name;
  searchWarehouse.value.search = "";
};

const addPRBehavior = () => {
  resetForm();
  companiesDropdown();
  deliveryDate.value = props.pr_estimate_date;
  const user = JSON.parse(localStorage.getItem('user'));
  initialNotes.value = 
    'Prepared by: ' + user[0].employeeName + '\n' +
    'Delivery Date: ' + formatDate(deliveryDate.value) + '\n';
  
  // Assuming `props.data` is the original array and you want to update `poForm.value.items`
  poForm.value.items = props.data.map(item => ({
    ...item,
    pr_price: item.pr_price || 0, // Ensure pr_price exists
    total_price: (item.pr_price * item.coversion_quantity).toFixed(2) // Ensure total_price exists
  }));
};

const resetForm = () => {
  poForm.value.mrf_id = 0;
  poForm.value.date_now = DATE_NOW();
  poForm.value.remarks = "";
  poForm.value.po_manual_number = "";
  poForm.value.existing_po_id = "";
  poForm.value.requested_to_user_id = 0;
  poForm.value.items = [];
  poForm.value.supplierZohoId = '';
};

const addToPO = async () => {
  try {
    poForm.value.remarks =  initialNotes.value + poForm.value.remarks;
    const formData = FormDx(poForm.value);

    console.log(poForm.value);
    
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

const removeItemField = (item, index) => {
  poForm.value.items.splice(index, 1);
  item.is_selected = false;
  emits("remove_pr_item",item);

  //  // Remove item from pr_data when deselected
  //  const indexToRemove = pr_data.value.findIndex((prItem) => prItem.pr_item_id === item.pr_item_id);
  //   if (indexToRemove !== -1) {
  //     pr_data.value.splice(indexToRemove, 1);
  //   }
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

// Watch for screen size changes
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

watch(() => window.innerWidth, handleResize);

onMounted(() => {
  // const savedData = localStorage.getItem("prData")
  // const savedIds = localStorage.getItem("prItems")

  // if (savedData) pr_data.value = JSON.parse(savedData)
  // if (savedIds) pr_item_array.value = JSON.parse(savedIds)

  // isHydrated.value = true

  window.addEventListener("resize", handleResize);
});

// 2. Watch for changes and save automatically
// watch(pr_data, (newVal) => {
//   // if (!isHydrated) return
//   localStorage.setItem("prData", JSON.stringify(newVal))
// }, { deep: true })

// watch(pr_item_array, (newVal) => {
//   // if (!isHydrated.value) return
//   localStorage.setItem("prItems", JSON.stringify(newVal))
// }, { deep: true })

</script>