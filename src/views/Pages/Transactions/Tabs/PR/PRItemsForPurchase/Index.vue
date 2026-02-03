<template>
  <div class="p-4 min-h-screen rounded-lg dark:border-gray-700">
    <!-- Add Product Button -->
    <div class="flex flex-col md:flex-row md:justify-between mb-4 mt-4">
     <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 mt-4">
          <!-- Search Text -->
          <input
            type="search"
            placeholder="Search Requested Item..."
            v-model="search.search"
            @input.prevent="searchInput()"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          />

          <!-- Type Select -->
           <select
            v-model="search.type"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
            @change="handleTypeChange"
          >
            <option value="0">All Dates</option>
            <!-- <option value="1">Hourly</option> -->
            <option value="2">Daily</option>  
            <option value="3">Weekly</option>
            <option value="4">Monthly</option>
          </select>


          <!-- Conditional Date Inputs -->
          <input
            v-if="search.type === '1'"
            type="datetime-local"
            v-model="search.date"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '2'"
            type="date"
            v-model="search.date"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '3'"
            type="week"
            v-model="search.date"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '4'"
            type="month"
            v-model="search.date"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
            @change="handleDateChange"
          />

          <!-- User Search Dropdown -->
          <div class= "w-full shadow shadow-gray-700 font-semibold text-base  px-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" >
            <SearchDropdown
              apiEndpoint="users/search-name-only"
              :searchModel="searchUser"
              placeholder="Search User"
              itemLabel="name"
              itemId="id"
              inputId="userName"
              @item-selected="(data) => fillUserForm(data)"
              dataKey="users"
              returnName="['name']"
            
              />
          </div>
      </div>

      <div class="flex justify-end">
        <PurchaseOrder
          v-if="hasPermission('Purchase_Order_Button')"
          :data="pr_data"
          :pr_item_array="pr_item_array"
          @transaction_id="handleTransaction()"
        />
      </div>
    </div>
    <div class="flex w-full overflow-auto">
      <!-- Table to display products -->
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Table headers -->
        <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
          <tr class="border border-solid text-nowrap">
                <th
                  scope="col"
                  class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
                >
                  <i class="fa fa-xl fa-check-square text-green-500"></i>
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
                <!-- <th
                  scope="col"
                  class="px-2 py-3 text-right text-sm font-medium tracking-wider border border-solid bg-yellow-500"
                >
                  PO'ed
                </th> -->
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
        <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm md:text-md">
          <!-- Loop through products and display them -->
          <tr
            v-if="prForm.items.length > 0 && loading == false"
            v-for="(i, ii) in prForm.items"
                :key="ii"
                class="border border-solid text-sm hover:bg-gray-400"
                >
                <td class="px-2 py-3 border">
                  <div class="text-center">
                    <input
                      type="checkbox"
                      v-model="i.selected"
                      class="h-7 w-7 text-slate-600 border-gray-300 rounded-md hover:border-lime-500 hover:ring-2 hover:ring-lime-200"
                      @change.prevent="selectedItemID(i)"
                    />
                  </div>
                </td>
                <td class="px-2 py-3 border border-solid">
                  <div class="flex justify-between mt-1">
                    <div class="flex flex-row flex-wrap">
                      <!-- <ItemTitle :item_id="i.item_id" :key="i.item_id" :item_name="i.item_name" /> -->
                       <span class="italic text-zinc-700">
                        {{ i.ingredient_id_number }} -&nbsp;
                       </span>
                       <span class="font-bold text-zinc-700">
                        {{ i.name }}
                       </span>
                      <span 
                        v-if="i.unit_abbre  != i.to_unit_abbre"
                        class="italic text-red-500"
                        >
                        &nbsp;({{i.conversion_rate }} {{i.unit_abbre }}/{{ i.to_unit_abbre ?? '' }})
                      </span>
                    </div>
                    <AssignConversions v-if="i.isPurchase == 0":data="i" :key="i.item_id"/>
                  </div>
                  <!-- <div
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
                  </div> -->
                </td>
                <td class="px-2 border border-solid bg-gray-200">
                  <div class=" w-[80px]">
                    <span class="text-md">
                      {{i.mrf_quantity}} {{ i.unit_abbre }}
                    </span>
                  </div>
                </td>
                <td class="pt-4 px-2 border border-solid bg-gray-200 hover:bg-gray-400">
                  <span class="text-lg">
                    {{i.quantity}} {{ i.unit_abbre }}
                  </span>
                  <span class="italic text-red-500">
                    (₱{{ i.pr_price }}/{{ i.unit_abbre }})
                  </span>
                </td>
                <td class="px-2 pt-4 border border-solid bg-emerald-300">
                  <!-- -------------------Conversions Header----------------- -->
                  <!-- @input="computePRMainQuantity(i, ii)" -->
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.coversion_quantity"
                      placeholder="Input Item Quantity"
                      step="any"
                      class="p-2 border rounded-l-md w-[70px]"
                       :disabled="i.isPurchase == 1"
                    />
                    {{ i.unitId }}
                    <!-- <select
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
                    </select> -->
                  </div>
                </td>
                <td class="px-2 py-3 border border-solid bg-emerald-300">
                  <!-- PR Price Header -->
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.pr_price_conversion"
                      min="1"
                      @input="computePRMainQuantity(i, ii)"
                      step="any"
                      placeholder="Input pr item Price"
                      class="p-2 border border-cyan-500 rounded-md w-full"
                      :disabled="i.isPurchase == 1"
                      />
                  </div>
                </td>
                
                <td class="px-2 py-3 border border-solid bg-gray-200">
                  <!-- Total header -->
                  <div class="flex w-[100px] justify-center">
                    <span class="text-lg font-bold underline">
                      ₱{{(i.coversion_quantity * i.pr_price_conversion).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                    </span>
                  </div>
                </td>
                <td class="px-2 py-3 border border-solid  bg-emerald-300">
                  <p><strong>To: </strong>{{ i.to_employee_name }}</p>
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
                  <div class="flex justify-center">
                    <!-- <AssignWarehouse
                      v-if="hasPermission('Assign_Ingredient_Warehouse_Button')"
                      :data="i"
                      :unpack="false"
                      @transaction_id="handleTransaction"
                    /> -->
                    <!-- <EditPRItemToNotPurchase v-if="i.isPurchase == 1" :data="i" @transaction_id="handleTransaction" /> -->
                    <!-- <EditPRItemToPurchase v-if="i.isPurchase == 0" :data="i" @transaction_id="handleTransaction" /> -->
                    <!-- <EditPRItemQuantity v-if="hasPermission('PR_Slip_Item_Edit_Button'), i.isPurchase == 0" :data="i" @transaction_id="handleTransaction" /> -->
                    <!-- <RejectPRItem v-if="hasPermission('PR_Slip_Item_Reject_Button')" :data="i" @transaction_id="handleTransaction" /> -->
                  </div>
                </td>
              </tr>
          <tr v-if="loading == true">
            <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="17">
              <Loader />
            </td>
          </tr>
          <tr v-if="data.totalrows == 0 && loading == false">
            <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="17">
              ***No PR Items found***
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex w-full overflow-auto">
      <Paginator
        v-if="data.totalrows"
        :page_number="search.page_num"
        :total_rows="data.totalrows ?? 0"
        :itemsperpage="search.itemsperpage"
        @page_num="handlePagination"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { VUE_APP_API_URL, DATE_NOW, COMPANIES, DEFAULT_BG } from "@/views/Utility/Global";

import AssignConversions from "@/views/Pages/Ingredients/Actions/AssignConversions.vue";
// import EditPRItemToNotPurchase from "@/views/Pages/Transactions/Tabs/PR/PRSlipForPurchase/Actions/EditPRItemToNotPurchase.vue";
// import EditPRItemToPurchase from "@/views/Pages/Transactions/Tabs/PR/PRSlipForPurchase/Actions/EditPRItemToPurchase.vue";
// import EditPRItemQuantity from "@/views/Pages/Transactions/Tabs/PR/PRSlipForPurchase/Actions/EditPRItemQuantity.vue";

import {
  FormDx,
  BearToken,
  Alert,
  mrfStatusFormatter,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import Loader from "@/views/Component/Loader.vue";
import PRISlip from "./Actions/PRISlip.vue";
//actions
import PurchaseOrder from "./Actions/PurchaseOrder.vue";
import Cancelled from "../PRSlipForPurchase/Actions/DeletePRItem.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";
import EditPR from "../PRSlipForPurchase/Actions/EditPR.vue";
import ReceiveItem from "./Actions/ReceiveItem.vue";
import RejectPRItem from "../PRSlipForPurchase/Actions/RejectPRItem.vue";
import EditPRItem from "../PRSlipForPurchase/Actions/EditPRItem.vue";
import { computed } from "vue"
const token = localStorage.getItem("token");
const data = ref({});
const loading = ref(false);

// 1. Initialize from LocalStorage (or empty array if none exists)
const pr_data = ref([]);
const pr_item_array = ref([]);

const props = defineProps({
  item_id: {
    type: Number,
    required: true
  },
  item_name: {
    type: String,
    default: "-" 
  
  },
  is_fixed: {
    type: Number,
    default: 0
  },
  is_repaired: {
    type: Number,
    default: 0
  }
})

const prForm = ref({
  items: [],
});

const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: 0, // Default to daily
  date: new Date().toISOString().split("T")[0], // Default to current date
  user_id: 0, // Default to current user
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listPRs();
  handlePagination(1);
}, 500);

const listPRs = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/pr-items-for-purchase`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;

    prForm.value.items = response.data.prItems.map((item) => ({
      pr_item_id: item.id,
      item_id: item.itemId,
      item_name: item.ingredientIdNumber + " - " + item.itemName,
      name:  item.itemName,
      ingredient_id_number: item.ingredientIdNumber,
      mrf_quantity: item.mrfItemQuantity ?? 0,
      po_quantity: item.poItemQuantity ?? 0,
      quantity: item.quantity ?? 0,
      unit_abbre: item.unitAbbre,
      quantity_per_unit: item.quantityPerUnit,
      pr_price: item.price,
      pr_remarks: item.prRemarks,
      conversions:item.conversions,
      unit_id:item.unitId,
      to_unit_id:item.toUnitId,
      to_employee_name:item.toEmployeeName,

      pr_price_conversion: parseFloat(item.prPriceConversion) || 0,
      to_unit_abbre:item.toUnitAbbre,
      conversion_rate: item.conversionRate,
      coversion_quantity:item.conversionQuantity,
      isPurchase:item.isPurchase
    }));

    checkSelected();
  } catch (error) {
    handleApiError(error);
  }
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listPRs();
};

const handleTransaction = (transaction_id) => {
  pr_data.value = [];
  listPRs();
};


const handleDateChange = () => {
  search.value.page_num = 1;
  listPRs();
};

const handleTypeChange = () => {
  // Reset date format based on type
  if (search.value.type === "2") {
    // For daily, use YYYY-MM-DD format
    search.value.date = new Date().toISOString().split("T")[0];
  } else {
    // For monthly, use YYYY-MM format
    search.value.date = new Date().toISOString().slice(0, 7);
  }
  listPRs();
};

const fillUserForm = (data) => {
  search.value.user_id = data.id;
  listPRs();
};

const checkSelected = () => {
  // Ensure we check against the mapped prForm items
  prForm.value.items.forEach((item) => {
    item.selected = pr_data.value.some(
      (pr) => pr.pr_item_id === item.pr_item_id
    );
  });
};

const selectedItemID = (item) => {
  if (item.selected) {
    // If selected is true, push the item to pr_data.value
    pr_data.value.push({
      pr_item_id: item.pr_item_id,
      item_id: item.item_id,
      item_name: item.item_name,
      quantity_per_unit: item.quantity_per_unit,
      quantity: item.quantity,
      requested_quantity: item.quantity,
      unit_abbre: item.unit_abbre,
      unit_id: item.unit_id,
      price: 0,
      brand_id: 0,
      brand_name: "",
      brand_abbre: '',
      requested_brand_id: 0,
      requested_brand_name: "",
      requested_brand_abbre: '',
      sub_price: 0,
      chart_of_account_name: "",
      chart_of_account_id: 0,
      sku_name: item.ingredient_id_number,
      discount_amount: 0,
      vat: 0,
      tax_type_id: 0,
      tax_percentage: 0,
      total_price: 0,
      remarks: "",
      tax_code_id: 0,
      total_quantity: 0,
    });

    if (!pr_item_array.value.includes(item.pr_item_id)) {
      pr_item_array.value.push(item.pr_item_id);
    }

    // console.log("selectedItemId in line: 547");
    // console.log(pr_data.value);
  } else {
      // Logic to remove items as fixed in previous step
      const index = pr_data.value.findIndex(i => i.pr_item_id === item.pr_item_id);
    if (index !== -1) pr_data.value.splice(index, 1);
    
    const idIndex = pr_item_array.value.indexOf(item.pr_item_id);
    if (idIndex !== -1) pr_item_array.value.splice(idIndex, 1);
  }
};

onMounted(() => {
  const savedData = localStorage.getItem("prData");
  const savedIds = localStorage.getItem("prItems");
  
  if (savedData) pr_data.value = JSON.parse(savedData);
  if (savedIds) pr_item_array.value = JSON.parse(savedIds);

  listPRs();
});

// 2. Watch for changes and save automatically
watch(pr_data, (newVal) => {
  localStorage.setItem("prData", JSON.stringify(newVal));
}, { deep: true });

watch(pr_item_array, (newVal) => {
  localStorage.setItem("prItems", JSON.stringify(newVal));
}, { deep: true });

</script>
