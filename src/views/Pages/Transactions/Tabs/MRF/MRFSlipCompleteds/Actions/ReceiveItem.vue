<template>
  <button
    @click.prevent="(isAddModalOpen = true), addPRBehavior()"
    :disabled="props.data == 0"
    :class="props.data == 0 ? 'opacity-50' : ''"
    type="button"
    class="bg-red-500 hover:opacity-70 focus:bg-red-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-receipt"></i>
    Return Selected Item
  </button>
  <Modal :show="isAddModalOpen" :maxWidth="'fullscreen'" title="Return Item" @close="isAddModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="returnItem()">
        <div class="grid grid-cols-3 gap-6">
          <div class="mb-4" :class="returnForm.sku_type == 2 || returnForm.sku_type == 0 ? 'cols-span-3' : ''">
            <!-- <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Assign Bin/Cart ({{  returnForm.bin_item_id }} = {{ returnForm.items[0].item_id}})</label
            > -->
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <!-- <div class="flex items-center mt-1">
              <input
                type="text"
                placeholder="Input/Scan Bin/Cart SKU"
                v-model="returnForm.sku"
                @input.prevent="searchCartBehavior()"
                required
                class="mt-1 p-2 rounded-md w-full border border-red-500"
              />
            </div> -->
            <!-- <div class="flex">
              <small v-if="returnForm.bin_item_id != 0 && returnForm.bin_item_id != returnForm.items[0].item_id"  class="font-bold text-xs text-red-500">
                  Bin is occupied!
              </small>
              <small v-else :class="returnForm.cart_error == true ? 'text-red-500':'text-lime-500'" class="font-bold text-xs">{{
                returnForm.cart_message
              }}</small>
            </div> -->
          </div>
          <div class="mb-4" v-if="returnForm.sku_type == 2 && returnForm.unit_abbre != ''">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Current Quantity.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <div class="flex">
              <input
                type="text"
                id="ProductName"
                v-model="returnForm.current_quantity"
                placeholder="Current Quantity."
                disabled
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              />
              <button type="button" class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300">
                {{ returnForm.unit_abbre }} 
              </button>
            </div>
            
          </div>
          <div class="mb-4" v-if="returnForm.sku_type == 2 && returnForm.sub_unit_abbre != ''">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Current Subquantity.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <div class="flex">
              <input
                type="text"
                id="ProductName"
                v-model="returnForm.current_sub_quantity"
                disabled
                placeholder="Current Subquantity"
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              />
              <button type="button" class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300">
                {{ returnForm.sub_unit_abbre }} 
              </button>
            </div>
          </div>
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
              v-model="returnForm.reference_number"
              placeholder="Input Reference No."
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Received By</label
            >
            <div class="flex items-center">
              <input
                type="text"
                placeholder="Input Receiver"
                v-model="returnForm.employee_name"
                @input.prevent="searchUserBehavior(returnForm.employee_name)"
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
                {{ user.employeeNumber }} -  {{ user.firstName }}  {{ user.middleName }} {{ user.lastName }}
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Assign Warehouse</label
            >
            <select
              placeholder="Select Building Name"
              disabled
              class="mt-1 p-2 border rounded-md w-full"
              v-model="returnForm.warehouse_id"
            >
              <option v-for="(w, ww) in warehouse" :key="w.id" :value="w.warehouseId">
                {{ w.warehouseName }}
              </option>
            </select>
          </div>
        </div>
        <label
          for="LeagueName"
          class="block text-sm font-medium mb-3 text-gray-700"
          >Items:
        </label>
        <div class="mb-4 flex w-full overflow-auto text-nowrap">
          <!-- <button
            @click.prevent="generateItemField()"
            type="button"
            class="px-4 py-2 font-bold hover:bg-blue-500 bg-blue-600 mb-2 rounded shadow text-white text-md float-right"
          >
            <i class="fa fa-plus"></i> Add Billing Row
          </button> -->
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class="bg-stone-700 text-white shadow">
              <tr class="border border-solid text-nowrap">
                <th
                  scope="col"
                  rowspan="2"
                  class="px-6 py-2 text-left text-sm uppercase tracking-wider border border-solid "
                >
                  Item
                </th>
                <th
                  scope="col"
                  colspan="2"
                  class="px-6 py-2 text-center text-sm font-medium  uppercase tracking-wider border border-solid "
                >
                  Quantity
                </th>
                <!-- <th
                  scope="col"
                  rowspan="2"
                  width="10%"
                  class="px-6 py-2 text-center text-sm font-medium  uppercase tracking-wider border border-solid "
                >
                  Price
                </th> -->
                <th
                  scope="col"
                  rowspan="2"
                  class="px-6 py-2 text-center text-sm uppercase tracking-wider border border-solid "
                >
                  Units
                </th>
                <th
                  scope="col"
                  colspan="2"
                  class="px-6 py-2 text-center text-sm font-medium uppercase tracking-wider border border-solid "
                >
                  Sub quantity
                </th>
                <!-- <th
                  scope="col"
                  rowspan="2"
                  width="10%"
                  class="px-6 py-2 text-center text-sm font-medium uppercase tracking-wider border border-solid "
                >
                  Sub Price
                </th> -->
                  <th
                  scope="col"
                  colspan="2"
                  class="px-6 py-2 text-center text-sm font-medium  uppercase tracking-wider border border-solid "
                >
                  Total quantity
                </th>
                <!-- <th
                  scope="col"
                  rowspan="2"
                  width="10%"
                  class="px-6 py-2 text-center text-sm font-medium uppercase tracking-wider border border-solid "
                >
                 Discount (Amount)
                </th>
                <th
                  scope="col"
                  rowspan="2"
                  width="10%"
                  class="px-6 py-2 text-center text-sm font-medium uppercase tracking-wider border border-solid "
                >
                 Total Price
                </th> -->
                <th
                  scope="col"
                   rowspan="2"
                  class="px-6 py-2 text-left text-sm uppercase tracking-wider border border-solid "
                >
                  Remarks
                </th>
                <th
                  scope="col"
                  rowspan="2"
                  class="px-6 py-2 text-left text-sm uppercase tracking-wider border border-solid "
                >
                  Actions
                </th>
              </tr>
              <tr class="border border-solid text-nowrap">
                <th
                  scope="col"
                  class="px-6 py-2 text-center text-sm font-medium  uppercase tracking-wider border border-solid "
                >
                  Requested
                </th>
                <th
                  scope="col"
                  class="px-6 py-2 text-center text-sm font-medium  uppercase tracking-wider border border-solid "
                >
                  Received
                </th>
                <th
                  scope="col"
                  class="px-6 py-2 text-center text-sm font-medium uppercase tracking-wider border border-solid "
                >
                 Requested
                </th>
                <th
                  scope="col"
                  class="px-6 py-2 text-center text-sm font-medium uppercase tracking-wider border border-solid "
                >
                  Received
                </th>
                  <th
                  scope="col"
                  class="px-6 py-2 text-center text-sm font-medium uppercase tracking-wider border border-solid "
                >
                  Requested
                </th>
                <th
                scope="col"
                class="px-6 py-2 text-center text-sm font-medium uppercase tracking-wider border border-solid "
              >
                Received
              </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loop through products and display them -->
              <!-- @mouseover="viewInfo(i.item_id)" -->
              <tr
                v-for="(i, ii) in returnForm.items"
                v-if="returnForm.items.length > 0"
                :key="ii"
                :title="getItemTooltip(i.item_id)"
                class="border border-solid text-sm"
              >
                <td class="px-2 py-2 border border-solid ">
                  <!-- <select
                          placeholder="Select Building Name"
                          class="mt-1 p-2 border rounded-md w-full"
                          v-model="i.item_id"
                          >
                          <option value="0">--Select Item--</option>
                          <option v-for="(i,ii) in items" :key="i.value" :value="i.value">{{ i.label }}</option>
                          </select> -->
                  <div class="flex">
                    {{  }}
                    <input
                      type="text"
                      placeholder="Input Item Name"
                      v-model="i.item_name"
                      :title="i.item_name"
                      @input.prevent="searchItemBehavior(ii,i.item_name)"
                      required
                      disabled
                      class="p-2 border flex w-full rounded-md w-100 bg-gray-200"
                    />
                    <button type="button" @click.prevent="isBrandModalOpen = true,brandBehavior(i.item_id,ii)" class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300">
                     <i class="fa fa-tag" v-if="i.brand_id == 0"></i> {{ i.brand_abbre }} 
                    </button>
                  </div>
                </td>
                <td class="px-2 py-2 border border-solid ">
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
                    <button type="button" class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300">
                      {{ i.unit_abbre }}
                    </button>
                  </div>
                </td>
                <td class="px-2 py-2 border border-solid bg-gray-500">
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.received_quantity"
                      min="0"
                      placeholder="Input Item Quantity"
                      class="p-2 border flex w-full border-red-500 rounded-l-md w-100"
                    />
                    <button type="button" class="border border-l-0 rounded-r-md px-3 bg-red-500 text-white hover:bg-gray-300">
                      {{ i.unit_abbre }}
                    </button>
                  </div>
                </td>
                <!-- <td class="px-2 py-2 border border-solid ">
                  <input
                    type="number"
                    id="ProductName"
                    v-model="i.price"
                    placeholder="Input Item Quantity"
                    class="p-2 border flex w-full rounded-md w-100"
                  />
                </td> -->
                <td class="px-2 py-2 border border-solid ">
                  <div class="flex justify-center" v-if="i.item_id != 0">
                  {{ i.quantity_per_unit }} {{ i.sub_unit_abbre }}/{{ i.unit_abbre }}
                  </div>
                </td>
                <td class="px-2 py-2 border border-solid ">
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.requested_sub_quantity"
                      min="0"
                      placeholder="Input Item Quantity"
                      disabled
                      class="p-2 border flex w-full rounded-l-md w-100 bg-gray-200"
                    />
                    <button type="button" class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300">
                      {{ i.sub_unit_abbre ?? '-' }}
                    </button>
                  </div>
                </td>
                <td class="px-2 py-2 border border-solid bg-gray-500">
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.received_sub_quantity"
                      min="0"
                      :max="i.quantity_per_unit"
                      autocomplete="off"
                      placeholder="Input Item Quantity"
                      class="p-2 border flex w-full border-red-500 rounded-l-md w-100"
                    />
                    <button type="button" class="border border-l-0 rounded-r-md px-3 bg-red-500 text-white hover:bg-gray-300">
                      {{ i.sub_unit_abbre ?? '-' }}
                    </button>
                  </div>
                </td>
                <!-- <td class="px-2 py-2 border border-solid ">
                  <input
                    type="number"
                    id="ProductName"
                    v-model="i.sub_price"
                    placeholder="Input Item Quantity"
                    class="p-2 border flex w-full rounded-md w-100"
                  />
                </td> -->
                <td class="px-2 py-2 border border-solid ">
                  <div class="flex">
                    <small hidden>
                      {{ i.requested_total_quantity  = (i.quantity_per_unit * i.requested_quantity) + i.requested_sub_quantity }}
                    </small>
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.requested_total_quantity"
                      min="0"
                      disabled
                      placeholder="Input Item Quantity"
                      class="p-2 border flex w-full w-100 bg-gray-200"
                    />
                    <button type="button" class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300">
                      {{ i.sub_unit_abbre ?? '-' }}
                    </button>
                  </div>
                </td>
                <td class="px-2 py-2 border border-solid ">
                  <div class="flex">
                    <small hidden>
                      {{ i.total_quantity  = (i.quantity_per_unit * i.received_quantity) + i.received_sub_quantity }}
                    </small>
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.total_quantity"
                      min="0"
                      disabled
                      placeholder="Input Item Quantity"
                      class="p-2 border flex w-full border-red-500 rounded-l w-100 bg-gray-200"
                    />
                    <button type="button" class="border border-l-0 rounded-r-md px-3 bg-red-500 text-white hover:bg-gray-300">
                      {{ i.sub_unit_abbre ?? '-' }}
                    </button>
                  </div>
                </td>  
                <!-- <td class="px-2 py-2 border border-solid ">
                  <input
                    type="number"
                    id="ProductName"
                    v-model="i.discount"
                    placeholder="Input Item Quantity"
                    class="p-2 border flex w-full rounded-md w-100"
                  />
                </td>    
                <td class="px-2 py-2 border border-solid ">
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
                <td class="px-2 py-2 border border-solid ">
                  <textarea
                    v-model="i.remarks"
                    placeholder="Input Item Remarks"
                    class="p-2 border flex w-full rounded-md"
                  ></textarea>
                </td>
                <td class="px-2 py-2 border border-solid ">
                  <div class="flex justify-start">
                    <button
                      @click.prevent="removeItemField(ii)"
                       type="button"
                      class="bg-red-500 text-white rounded font-bold rounded-r text-sm md:text-sm py-2 px-4 mb-4 float-end text-nowrap"
                    >
                      <i class="fas fa-trash"></i>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td class="px-2 py-2 border border-solid " colspan="14">
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
            v-model="returnForm.remarks"
            placeholder="Input Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="!returnForm.submit"
            :class="!returnForm.submit ? 'opacity-50' : ''"
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
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { VUE_APP_API_URL, DATE_NOW, WAREHOUSE } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  useDebounce,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
// Define props with a default value
const props = defineProps({
  data: {
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
const isBrandModalOpen = ref(false);
const users = ref([]);
const items = ref([]);
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const activeItemIndex = ref(0);
const returnForm = ref({
  mrf_item_id: 0,
  date_now: DATE_NOW(),
  warehouse_id: 0,
  warehouse_name: '',
  received_by_user_id: 0,
  received_by_user_name: "",
  remarks: "",
  reference_number: "",
  sku: '',
  sku_type: 0,
  cart_error: false,
  cart_available: false,
  cart_name: '',
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
  const data = props.data;
  if(data.length == 1){
    returnForm.value.mrf_item_id = data[0].mrf_item_id;
  }
  returnForm.value.items = data;
  returnForm.value.item_array = props.item_array;
  returnForm.value.warehouse_id = props.warehouse_id;
  
};
// const allowSubmit = () => {
//   console.log('working');
//   (returnForm.value.sku_type);
//   if(returnForm.value.sku_type === 0){
//     returnForm.value.submit = true;
//   }
//   if(returnForm.value.sku_type === 1){
//     returnForm.value.submit = returnForm.value.items.length != 0 && returnForm.value.sku_type == 1;
//   }
//   if(returnForm.value.sku_type === 2){
//     returnForm.value.submit = returnForm.value.sku_type == 1 && returnForm.items.length == 1 && returnForm.value.bin_item_id == returnForm.value.items[0].item_id;
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
      handleApiError(error);
    }
};
const searchItemBehavior = useDebounce(async (index,name) => {
  search.value.search = name;
  activeItemIndex.value = index;
  if (search.value.search?.length == 0) {
    returnForm.value.items[index].mrf_item_id = 0;
  }
  listItems();
}, 500);
const fillItemsForm = (item, index) => {
  returnForm.value.items[index].po_item_id = item.id;
  returnForm.value.items[index].po_item_name = item.name;

  search.value.search = '';
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
    handleApiError(error);
  }
};
const searchUserBehavior = useDebounce(async (name) => {
  searchUser.value.search = name;
  if (searchUser.value.search?.length == 0) {
    returnForm.value.received_by_user_id = 0;
  }
  listUsers();
}, 500);
const fillUserForm = (user) => {
  returnForm.value.employee_id = user.id;
  returnForm.value.employee_name =  user.employeeNumber+' - ' +user.firstName+' '+user.middleName+' '+user.lastName;

  searchUser.value.search = '';
};
//warehouse dropdown
const resetForm = () => {
  returnForm.value = {
    mrf_id: 0,
    date_now: DATE_NOW(),
    warehouse_id: 0,
    warehouse_name: '',
    received_by_user_id: 0,
    received_by_user_name: "",
    remarks: "",
    reference_number: "",
    sku: '',
    sku_type: 0,
    cart_error: false,
    cart_available: false,
    cart_name: '',
    cart_id: 0,
    bin_item_id: 0,
    submit: false,
    items: [],
    items_in_location: [],
  };
  // emits("transaction_id", Math.random());
};
const returnItem = async () => {
  if(returnForm.value.sku_type == 0){
    Alert("warning", "Warning!", "Please add cart or bins!.");
    return false;
  }
  if(returnForm.value.sku_type == 2 && returnForm.value.items.length > 1){
    Alert("warning", "Warning!", "Item count must be only one when receiving from bin! Please remove other items.");
    return false;
  }
  try {
    const RETURN_URL = returnForm.value.sku_type == 1 ? 'warehouse-item-in/po-in-return' : returnForm.value.sku_type == 2 ? 'bin-in/add-item-in-bin-array-return' : '';
    const formData = FormDx(returnForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL+RETURN_URL}`,
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
  returnForm.value.items.splice(index, 1);
};
const searchCartBehavior = useDebounce(async () => {
    await listBinCart(); // Call listBinCart function after debounce delay
}, 500);
const listBinCart = async () => {

  try {
    const formData = FormDx({
      sku: returnForm.value.sku,
      warehouse_id: returnForm.value.warehouse_id,
      item_ids_array: returnForm.value.item_array,
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}scan-codes/search`,
      formData,
      BearToken(token)
    );
   // Update form values based on the response data
   const { error, message, skus, cartHasItems, currentQuantity, currentSubQuantity, unitAbbre, subUnitAbbre } = response.data;
    console.log(error);
    returnForm.value.cart_error = error;
    returnForm.value.cart_message = message;
    returnForm.value.items_in_location = cartHasItems;
    returnForm.value.bin_id = 0;
    returnForm.value.cart_id = 0;
    returnForm.value.bin_item_id = 0;
    returnForm.value.submit = false;

    // Check if there's no error
    if (!error) {
      const sku = skus[0];
      returnForm.value.sku_type = sku.skuType;
      returnForm.value.current_quantity = 0;
      returnForm.value.current_sub_quantity = 0;
      // Handle based on sku_type
      switch (sku.skuType) {
        case 1:
          returnForm.value.submit = true;
          returnForm.value.cart_id = sku.id;
          break;

        case 2:
        const itemIdMatches = parseFloat(sku.itemId) === parseFloat(returnForm.value.items[0].item_id);
          returnForm.value.submit = itemIdMatches || parseFloat(sku.itemId) === 0;
          returnForm.value.bin_id = sku.id;
          returnForm.value.bin_item_id = sku.itemId;
          returnForm.value.current_quantity = currentQuantity;
          returnForm.value.current_sub_quantity = currentSubQuantity;
          returnForm.value.unit_abbre = unitAbbre;
          returnForm.value.sub_unit_abbre = subUnitAbbre;
          break;

        default:
          returnForm.value.submit = false;
          // Handle unexpected skuType if necessary
          break;
      }
    }

      
  } catch (error) {
    // console.log(error);
    // returnForm.value.submit = false;
    // returnForm.value.bin_item_id  = 0;
    returnForm.value.cart_error = true;
    returnForm.value.cart_id = 0;
    returnForm.value.bin_id = 0;
    returnForm.value.cart_message = error.response.data.message;
    handleApiError(error);
  }
};
const getItemTooltip = (item_id) => {
  // Find the item with the given item_id
  if(returnForm.value.items_in_location.length > 0){
    const location = returnForm.value.items_in_location.find(item => item.itemId === item_id);
    
    if (location) {
      // Return the tooltip text
      if(location.subUnitId > 0){
        return `Current Stock: ${location.quantity+location.unitAbbre}, Current Substocks: ${location.subQuantity+location.subUnitAbbre}`;
      }else{
        return `Current Stock: ${location.quantity+location.unitAbbre}`;
      }
    
    } else {
      return 'Item information not available';
    }
  }
};

</script>
