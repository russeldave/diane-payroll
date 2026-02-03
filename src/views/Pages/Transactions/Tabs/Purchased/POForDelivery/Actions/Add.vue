<template>
  <button
    @click="(isAddModalOpen = true), addMRFBehavior()"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-file-invoice"></i>
    Create MRF
  </button>
  <Modal :show="isAddModalOpen" :maxWidth="'6xl'">
 
    <div class="flex justify-between p-3">
      <h2 class="text-lg font-semibold text-gray-800">Create MRF</h2>
      <button
      class="flex float-end bg-gray-100 p-3"
      @click.prevent="isAddModalOpen = false"
    >
      <i class="fa fa-times text-black-600"></i>
    </button>
    </div>
    <div class="grid grid-cols-1 gap-6 p-6">
     
      <form class="mt-4" @submit.prevent="addMRF()">
        <div class="grid grid-cols-2 gap-6">
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF Manual No.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="mrfForm.mrf_manual_number"
              placeholder="Input MRF Manual Number"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Company</label
            >
            <select
              placeholder="Select Building Name"
              class="mt-1 p-2 border rounded-md w-full"
              v-model="mrfForm.our_company_id"
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
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium mb-3 text-gray-700"
            >Items:</label
          >
          <button
            @click.prevent="generateItemField()"
            type="button"
            class="px-4 py-2 font-bold hover:bg-blue-500 bg-blue-600 mb-2 rounded shadow text-white text-md float-right"
          >
            <i class="fa fa-plus"></i> Add Billing Row
          </button>
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class="bg-gray-100 shadow">
              <tr class="border-b-2 border-solid border-yellow-500">
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Remarks
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
                v-for="(i, ii) in mrfForm.items"
                v-if="mrfForm.items.length > 0"
                :key="ii"
              >
                <td class="px-2 py-2 border">
                  <!-- <select
                          placeholder="Select Building Name"
                          class="mt-1 p-2 border rounded-md w-full"
                          v-model="i.item_id"
                          >
                          <option value="0">--Select Item--</option>
                          <option v-for="(i,ii) in items" :key="i.value" :value="i.value">{{ i.label }}</option>
                          </select> -->
                  <div class="flex items-center mt-1">
                    <input
                      type="text"
                      placeholder="Input Item Name"
                      v-model="i.item_name"
                      @input.prevent="searchItemBehavior(ii,i.item_name)"
                      required
                      class="mt-1 p-2 border rounded-md w-full"
                    />
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
                <td class="px-2 py-2 border">
                  <textarea
                    v-model="i.description"
                    placeholder="Input Item Description"
                    class="mt-1 p-2 border rounded-md w-full"
                  ></textarea>
                </td>
                <td class="px-2 py-2 border">
                  <input
                    type="number"
                    id="ProductName"
                    v-model="i.quantity"
                    placeholder="Input Item Quantity"
                    class="mt-1 p-2 border rounded-md w-full"
                  />
                </td>
                <td class="px-2 py-2 border">
                    <div class="flex items-center mt-1">
                    <input
                        type="text"
                        placeholder="Input Location"
                        v-model="i.room_location_name"
                        @input.prevent="searchLocationBehavior(ii,i.room_location_name)"
                        required
                        class="mt-1 p-2 border rounded-md w-full"
                    />
                    </div>
                    <div
                    class="absolute bg-white shadow z-50"
                    v-if="searchLocation.search != '' && activeLocationIndex == ii"
                    >
                    <ul class="">
                        <li
                        class="p-1 border-l-2 border-lime-200 flex py-2 font-bold shadow text-gray-600"
                        @click.prevent="fillLocationForm(location, ii)"
                        v-for="(location, index) in locations"
                        :key="index"
                        >
                        {{ location.name }}
                        </li>
                    </ul>
                    </div>
                </td>

                <td class="px-2 py-2 border">
                  <textarea
                    v-model="i.remarks"
                    placeholder="Input Item Remarks"
                    class="mt-1 p-2 border rounded-md w-full"
                  ></textarea>
                </td>
                <td class="px-2 py-2 border">
                  <div class="flex justify-start">
                    <button
                      @click.prevent="removeItemField(ii)"
                       type="button"
                      class="bg-red-500 text-white rounded font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
                    >
                      <i class="fas fa-trash"></i>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td class="px-2 py-2 border" colspan="6">
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
            v-model="mrfForm.remarks"
            placeholder="Input Building Remarks"
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
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { VUE_APP_API_URL, DATE_NOW, COMPANIES } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const isAddModalOpen = ref(false);
const companies = ref([]);
const items = ref([]);
const locations = ref([]);
const activeLocationIndex = ref(0);
const activeItemIndex = ref(0);
const mrfForm = ref({
  mrf_id: 0,
  date_now: DATE_NOW(),
  our_company_id: 0,
  remarks: "",
  mrf_manual_number: "",
  items: [
    {
      item_id: 0,
      item_name: "",
      quantity: 0,
      description: "",
      remarks: "",
      room_location_number: 0,
      room_location_name: "",
    },
  ],
});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchLocation = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

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
const searchItemBehavior = (index,name) => {
  search.value.search = name;
  activeItemIndex.value = index;
  if (search.value.search?.length == 0) {
    mrfForm.value.items[index].item_id = 0;
  }
  listItems();
};
const fillItemsForm = (item, index) => {
  mrfForm.value.items[index].item_id = item.id;
  mrfForm.value.items[index].item_name = item.name;

  search.value.search = '';
};
//location dropdown
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
const searchLocationBehavior = (index,name) => {
  searchLocation.value.search = name;
  activeLocationIndex.value = index;
  if (searchLocation.value.search?.length == 0) {
    mrfForm.value.items[index].item_id = 0;
  }
  listLocation();
};
const fillLocationForm = (item, index) => {
  console.log();
  mrfForm.value.items[index].room_location_number = item.id;
  mrfForm.value.items[index].room_location_name = item.name;

  searchLocation.value.search = '';
};
//add
const addMRFBehavior = () => {
  resetForm();
  companiesDropdown();
};
const resetForm = () => {
  mrfForm.value.mrf_id = 0;
  mrfForm.value.date_now = DATE_NOW();
  mrfForm.value.our_company_id = 0;
  mrfForm.value.remarks = "";
  mrfForm.value.mrf_manual_number = "";
  mrfForm.value.items = [
    {
      item_id: 0,
      item_name: "",
      quantity: 0,
      description: "",
      remarks: "",
      room_location_number: 0,
    },
  ];
};
const addMRF = async () => {
  try {
    const formData = FormDx(mrfForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/add`,
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
const generateItemField = async () => {
  let item_data = {
    item_id: 0,
    item_name: "",
    quantity: 0,
    description: "",
    remarks: "",
    room_location_number: 0,
    /* other charge properties */
  };

  // Assuming salesForm.charges is an array
  mrfForm.value.items.push(item_data);
};
const removeItemField = (index) => {
  // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
  mrfForm.value.items.splice(index, 1);
};
const companiesDropdown = async () => {
  companies.value = await COMPANIES();
};
</script>
