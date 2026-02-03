<template>
  <button
    @click.prevent="(isEditModalOpen = true), itemBehavior()"
    type="button"
    class="bg-green-500 hover:opacity-70 focus:bg-green-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-arrow-right"></i>
    Release
  </button>
  <!-- Add Item Modal -->
  <Modal :show="isEditModalOpen" :maxWidth="'8xl'" title="Item Releasing" @close="isEditModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4">
        <div class="grid grid-cols-2 gap-6">
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF No.</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="itemsForm.mrf_number"
              placeholder="Input Product Name"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Item Name</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="itemsForm.item_name"
              placeholder="Input Product Name"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
        </div>
        <div class="flex justify-between">
          <!-- <input
            type="search"
            v-model="search.search"
            @input.prevent="listItems()"
            placeholder="Search Items..."
            class="shadow shadow-gray-700 flex w-1/4 font-bold text-lg py-2 px-4 rounded-lg mb-4 float-end"
          />
          <Add @transaction_id="handleTransaction" /> -->
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Items</label
          >
        </div>

        <div class="flex w-full overflow-auto">
          <!-- Table to display products -->
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class="bg-gray-100 shadow">
              <tr class="border-b-2 border-solid border-yellow-500">
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Item SKU
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Item Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Warehouse
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rack Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bin SKU
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stocks
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sub Stocks
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Qty Per Unit
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Stocks
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loop through products and display them -->
              <tr
                v-for="item in data.items"
                v-if="data.items?.length > 0"
                :key="item.id"
              >
                <td class="px-2 py-2 border">{{ item.itemSku }}</td>
                <td class="px-2 py-2 border">{{ item.itemName }}</td>
                <td class="px-2 py-2 border">{{ item.warehouseName }}</td>
                <td class="px-2 py-2 border">{{ item.rackName }}</td>
                <td class="px-2 py-2 border">{{ item.binSku }}</td>
                <td class="px-2 py-2 border text-right">
                  {{ item.stocks }} {{ item.unitAbbre }}
                </td>
                <td class="px-2 py-2 border text-right">
                  {{ item.stocks }} {{ item.subUnitAbbre }}
                </td>
                <td class="px-2 py-2 border text-right">
                  {{ item.quantityPerUnit }} {{ item.subUnitAbbre }} /{{
                    item.unitAbbre
                  }}
                </td>
                <td class="px-2 py-2 border text-right">
                  {{
                    parseFloat(item.stocks) * parseFloat(item.quantityPerUnit) +
                    parseFloat(item.stocks)
                  }}
                  {{ item.subUnitAbbre }}
                </td>
                <td class="px-2 py-2 border">
                  <div class="flex justify-center">
                    <ReleaseItemToBin :mrf_id="itemsForm.id" :data="item" />
                    <Completed
                      :data="item"
                      @transaction_id="handleTransaction"
                    />
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td
                  class="px-2 py-2 border text-center text-red-500 font-bold"
                  colspan="10"
                >
                  ***No Items Found***
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
import ReleaseItemToBin from "./ReleaseItemToBin.vue";
import Completed from "./Completed.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  CATEGORIES,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Array,
});
const categories = ref([]);
const data = ref([]);
const isEditModalOpen = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  warehouse_has_item_id: 0,
});
const itemsForm = ref({
  id: 0,
  item_id: 0,
  item_name: 0,
});
const itemBehavior = () => {
  const data = props.data;

  itemsForm.value.id = data.id;
  itemsForm.value.item_id = data.itemId;
  itemsForm.value.item_name = data.itemName;
  itemsForm.value.mrf_number = data.mrfNumber;

  search.value.item_id = data.itemId;
  listItems();
};
const resetForm = () => {
  itemsForm.value.id = 0;
  itemsForm.value.item_id = 0;
  itemsForm.value.mrf_number = "";
  itemsForm.value.item_name = "";
};
const listItems = async () => {
  try {
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}items/view-item-locations`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
  } catch (error) {
    handleApiError(error);
  }
};
const handleTransaction = (transaction_id) => {};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listItems();
};
const categoryDropdown = async () => {
  categories.value = await CATEGORIES();
};
// Call listItems when component is mounted
onMounted(() => {
  categoryDropdown();
});
</script>
