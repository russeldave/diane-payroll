<template>
  <button
    @click="(isViewModalOpen = true), editMRFBehavior()"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded-l text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-eye"></i>
    View
  </button>
  <Modal :show="isViewModalOpen" :maxWidth="'fullscreen'" title="View Purchase Order" @close="isViewModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4">
        <div class="grid grid-cols-5 gap-6">
          <div class="relative mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >PO No.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="poForm.po_number"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-300"
            />
            <CopyToClipboard
              :textToCopy="poForm.po_number"
              buttonText=""
              buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
            />
          </div>
          <div class="relative mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >PO Date.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="poForm.date_of_po"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-300"
            />
            <CopyToClipboard
              :textToCopy="poForm.date_of_po"
              buttonText=""
              buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
            />
          </div>
          <div class="relative mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >PO Manual No.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="poForm.po_manual_no"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-300"
            />
            <CopyToClipboard
              :textToCopy="poForm.po_manual_no"
              buttonText=""
              buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
            />
          </div>
          <div class="relative mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Supplier</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="poForm.supplier_name"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-300"
            />
            <CopyToClipboard
              :textToCopy="poForm.supplier_name"
              buttonText=""
              buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
            />
          </div>
          <div class="relative mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Our Company</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="poForm.our_company"
              disabled
              placeholder="Input Company Name"
              class="mt-1 p-2 border rounded-md w-full bg-gray-300"
            />
            <CopyToClipboard
              :textToCopy="poForm.our_company"
              buttonText=""
              buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="relative mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Delivery Instructions</label
            >
            <textarea
              v-model="poForm.delivery_instruction"
              placeholder="Input Building Remarks"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-300"
            ></textarea>
            <CopyToClipboard
              :textToCopy="poForm.delivery_instruction"
              buttonText=""
              buttonClass="absolute bottom-3 right-1 bg-gray-300 text-white"
            />
          </div>
          <div class="relative mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Remarks</label
            >
            <textarea
              v-model="poForm.remarks"
              placeholder="Input Building Remarks"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-300"
            ></textarea>
            <CopyToClipboard
              :textToCopy="poForm.remarks"
              buttonText=""
              buttonClass="absolute bottom-3 right-1 bg-gray-300 text-white"
            />
          </div>
        </div>
        <div class="flex w-full overflow-auto md:justify-between mb-4">
          <h5 class="text-lg font-bold">Items:</h5>
          <button @click.prevent="exportToCSV" class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
            Export to CSV
          </button>          
        </div>
        <div class="flex w-full overflow-auto">
          <!-- Table to display products -->
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class=" text-white shadow" :class="DEFAULT_BG">
              <tr class="border-b-2 border-solid">
                <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  PR No.
                </th>
                <!-- <th
                  scope="col"
                  class="px-2 py-3 border text-right text-sm font-medium uppercase tracking-wider"
                >
                  Units
                </th> -->
                <th
                  scope="col"
                  class="px-2 py-3 border text-right text-sm font-medium tracking-wider bg-yellow-500"
                >
                  PO'ed
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-right text-sm font-medium uppercase tracking-wider bg-blue-500"
                >
                  Unit Price
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-right text-sm font-medium uppercase tracking-wider bg-red-500"
                >
                  Discount
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-right text-sm font-medium uppercase tracking-wider bg-gray-500"
                >
                 VAT
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-right text-sm font-medium uppercase tracking-wider bg-green-500"
                >
                  Total Price
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-right text-sm font-medium uppercase tracking-wider"
                >
                  Tax Type
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Chart of Accounts
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Remark
                </th>
                <th
                  scope="col"
                  class="px-2 py-3  text-center text-sm font-medium uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-sm">
              <!-- Loop through products and display them -->
              <tr
                v-for="(pr, index) in items.poItems"
                v-if="items.poItems?.length > 0"
                :key="pr.id"
                :title="'Requested By: ' + pr.requestedByUserName"
                class="text-nowrap hover:bg-gray-300"
              >
                <td class="px-2 py-2 border relative">
                  <ItemTitle :item_id="pr.itemId" :item_name="pr.itemName" />
                  <CopyToClipboard
                    :textToCopy="pr.itemName"
                    buttonText=""
                    buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
                  />
                </td>
                <td class="px-2 py-2 border relative">
                  {{ pr.prNumber }}
                  <CopyToClipboard
                    :textToCopy="pr.prNumber"
                    buttonText=""
                    buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
                  />
                </td>
                <!-- <td class="px-2 py-2 border relative text-center">
                  {{ pr.quantityPerUnit ?? 0 }}/{{
                    pr.unitAbbre
                  }}
                  <CopyToClipboard
                  :textToCopy="pr.quantityPerUnit"
                  buttonText=""
                  buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
                />
                </td> -->
                <td class="px-2 py-2 border relative text-center">
                  {{ pr.quantity ?? 0 }} {{ pr.unitAbbre }}
                  <CopyToClipboard
                  :textToCopy="pr.quantity"
                  buttonText=""
                  buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
                />
                </td>
                <td class="px-2 py-2 border relative text-center">
                  {{ moneyFormatter(pr.price ?? 0) }}/{{ pr.unitAbbre }}
                  <CopyToClipboard
                  :textToCopy="pr.price"
                  buttonText=""
                  buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
                />
                </td>
                <td class="px-2 py-2 border relative text-center">
                  {{ moneyFormatter(pr.discountAmount ?? 0) }}
                  <CopyToClipboard
                    :textToCopy="pr.discountAmount"
                    buttonText=""
                    buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
                  />
                </td>
                <td class="px-2 py-2 border relative text-center">
                  {{ moneyFormatter(pr.taxAmount ?? 0) }}
                  <CopyToClipboard
                    :textToCopy="pr.taxAmount ?? '-'"
                    buttonText=""
                    buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
                  />
                </td>
                <td class="px-2 py-2 border relative text-center font-bold">
                  <small hidden>{{  pr.total_price = (pr.price * pr.quantity) - pr.discountAmount }}</small>
                  {{moneyFormatter(pr.total_price) }}
                  <CopyToClipboard
                    :textToCopy="pr.total_price"
                    buttonText=""
                    buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
                  />
                </td>
                <td class="px-2 py-2 border relative text-center">
                  {{pr.taxName ?? '-' }}
                  <CopyToClipboard
                    :textToCopy="pr.taxName ?? '-'"
                    buttonText=""
                    buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
                  />
                </td>
                <td class="px-2 py-2 border relative text-left font-bold">
                  {{pr.chartOfAccountName ?? '-' }}
                  <CopyToClipboard
                    :textToCopy="pr.chartOfAccountName ?? '-'"
                    buttonText=""
                    buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
                  />
                </td>
                <td class="px-2 py-2 border relative">
                  {{ pr.prRemarks === "null" ? "-" : pr.prRemarks }}
                  <CopyToClipboard
                    :textToCopy="pr.prRemarks"
                    buttonText=""
                    buttonClass="absolute bottom-1 right-1 bg-gray-300 text-white"
                  />
                </td>
                <!-- <td class="px-2 py-2 border relative">{{ mrfStatusFormatter(mrf.status) }}</td> -->
                <td class="px-2 py-2 border">
                  <div class="flex justify-center">
                    <Completed
                      v-if="hasPermission('PO_Slip_Completed_Item_Button')"
                      :data="pr"
                      @transaction_id="handleTransaction()"
                    />
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td
                  class="px-2 py-2 border text-center text-red-500 font-bold"
                  colspan="14"
                >
                  ***No PR Items Found***
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="col" class="px-2 py-3 border border-solid text-right" colspan="3">
                  Total
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border border-solid text-center"
                >
                  {{ moneyFormatter(totalPrice) }}
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border border-solid text-center"
                >
                  {{ moneyFormatter(totalDiscount) }}
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border border-solid text-center"
                >
                  {{ moneyFormatter(totalVat) }}
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border border-solid text-center"
                >
                  {{ moneyFormatter(totalAmount) }}
                </th>
                <th
                  colspan="5"
                  class="px-2 py-3 border border-solid text-center"
                >
                  
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="flex w-full overflow-auto">
          <Paginator
            v-if="items.totalrows"
            :page_number="search.page_num"
            :total_rows="items.totalrows ?? 0"
            :itemsperpage="search.itemsperpage"
            @page_num="handlePagination"
          />
        </div>
        <!-- <div class="flex justify-end">
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
import { computed, ref } from "vue";
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
  mrfStatusFormatter,
  moneyFormatter,
  handleApiError
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";

import Completed from "./Completed.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";
import CopyToClipboard from "@/views/Component/CopyToClipboard.vue";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const isViewModalOpen = ref(false);
const companies = ref([]);
const items = ref([]);
const poForm = ref([]);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  po_id: 0,
});
const editMRFBehavior = () => {
  resetForm();
  companiesDropdown();
  fillForm(props.data);
};
const resetForm = () => {
  poForm.value.id = '';
  poForm.value.supplier_id = "";
  poForm.value.supplier_name = "";
  poForm.value.supplier_email = "";
  poForm.value.po_number = "";
  poForm.value.po_manual_no = "";
  poForm.value.po_requester = "";
  poForm.value.date_of_po = "";
  poForm.value.remarks = "";
  poForm.value.po_requester = "";
  poForm.value.delivery_date = "";
  poForm.value.warehouse_id = 0;
  poForm.value.warehouse_name = "";
  poForm.value.building_id = 0;
  poForm.value.building_name = "";
  poForm.value.delivery_instruction = "";
};
const fillForm = () => {
  const data = props.data;

  poForm.value.id = data.id;
  poForm.value.supplier_id = data.supplierId;
  poForm.value.supplier_name = data.suppliername;
  poForm.value.supplier_email = data.supplierEmail;
  poForm.value.po_number = data.poNumber;
  poForm.value.po_manual_no = data.poManualNumber;
  poForm.value.po_requester = data.poByUserName;
  poForm.value.date_of_po = data.dateOfPo;
  poForm.value.remarks = data.remarks;
  poForm.value.delivery_date = data.deliverDate;
  poForm.value.warehouse_id = data.warehouseId;
  poForm.value.warehouse_name = data.warehouseName;
  poForm.value.building_id = data.buildingId;
  poForm.value.building_name = data.warehouseBuildingName;
  poForm.value.delivery_instruction = data.deliveryInstruction;
  poForm.value.our_company = data.ourCompanyName;
  search.value.po_id = poForm.value.id;
  listItemsPerPO();
};

const listItemsPerPO = async (id) => {
  try {
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}pos/get-items-per-po`,
      formData,
      BearToken(token)
    );
    items.value = response.data;
  } catch (error) {
    handleApiError(error);//
  }
};
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listItemsPerPO();
};
const handleTransaction = (transaction_id) => {
  isViewModalOpen.value = false;
  emits("transaction_id", Math.random());
};
const exportToCSV = () => {
  const rows = items.value.poItems.map(pr => [
    pr.itemName,
    pr.prNumber,
    pr.quantityPerUnit,
    pr.quantity,
    pr.price,
    pr.discountAmount,
    pr.total_price,
    pr.prRemarks
  ]);

  const csvContent = "data:text/csv;charset=utf-8,"
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "purchase_orders.csv");
  document.body.appendChild(link);
  link.click();
};

const companiesDropdown = async () => {
  companies.value = await COMPANIES();
};
const totalDiscount = computed(() => {
    return items.value.poItems?.reduce((acc, item) => acc + (parseFloat(item.discountAmount) || 0), 0);
});
const totalPrice = computed(() => {
    return items.value.poItems?.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
});
const totalVat = computed(() => {
    return items.value.poItems?.reduce((acc, item) => acc + (parseFloat(item.taxAmount) || 0), 0);
});
const totalAmount = computed(() => {
    return items.value.poItems?.reduce((acc, item) => acc + (parseFloat(item.total_price) || 0), 0);
});
</script>
