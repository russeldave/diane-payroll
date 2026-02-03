<template>
  <button
    @click.prevent="assignButtonBehavior()"
    type="button"
    class="relative bg-green-500 text-white hover:opacity-70 font-bold text-sm md:text-md p-2 float-end text-nowrap rounded-md"
  >
    Available
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'6xl'"
    title="Available Stocks"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-0 p-6">
      <div class="block mt-4 border-t-2 border-dashed">
        <div class="flex w-full items-start justify-center ">
          <input
            type="search"
            v-model="searchWarehouse.search"
            @input.prevent="searchInput()"
            placeholder="Search Ingredients..."
            class="shadow shadow-gray-700 w-full focus-visible:bg-yellow-100 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
          />
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <th
                scope="col"
                class="px-6 py-3 text-left text-md font-medium uppercase tracking-wider"
              >
                Warehouse Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-md font-medium uppercase tracking-wider"
              >
                Ingredient Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-md font-medium uppercase tracking-wider"
              >
                Stocks
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loop through products and display them -->
            <tr
              v-for="(i, ii) in warehouseItems?.ingredients"
              v-if="warehouseItems?.ingredients?.length > 0"
              :key="ii"
              :class="i.warehouseItemStatus === 7 ? 'bg-slate-400' : ''"
            >
              <td class="px-2 py-2 border">
                {{ i.warehouseName }}
              </td>
              <td class="px-2 py-2 border text-left">
                <span class="italic ">
                  {{ i.ingredientIdNumber }}-
                </span>
                <span class="font-bold">
                  {{ i.itemName }}
                </span>
                <span class="text-red-500 italic">
                  [{{ i.unitAbbre }}]
                </span>
              </td>
              <td class="px-2 py-2 border text-right  bg-red-100">
                <span class="font-extrabold">
                  {{ i.floatStocks }}
                </span>
                <span class="italic text-red-500">
                  {{ i.unitAbbre }}
                </span>
              </td>
            </tr>
            <tr v-else>
              <td class="px-2 py-2 border" colspan="6">
                <p class="text-red-500 font-bold text-center">
                  **No Warehouse Assigned**
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex w-full overflow-auto mt-0">
        <Paginator
          v-if="warehouseItems.totalrows"
          :page_number="searchWarehouse.page_num"
          :total_rows="warehouseItems.totalrows"
          :itemsperpage="searchWarehouse.itemsperpage"
          @page_num="handlePagination"
        />
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  WAREHOUSE,
  CATEGORIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
  useDebounce,
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { hasPermission } from "@/views/Utility/Permissions";
//modules
import OverrideStocks from "@/views/Pages/Ingredients/Actions/OverrideStocks.vue";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const store = ref([]);
const warehouseItems = ref([]);
const totalLowStocks = ref(0);
const ingredientForm = ref({
  ingredient_id: 0,
  ingredient_name: "",
  warehouse_id: 0,
});
const searchWarehouse = ref({
  search: "",
  page_num: 1,
  itemsperpage: 12,
  ingredient_id_number: 0,
  is_full_text_search: 0,
  stat_id: 3, // low stock
  sort_by: 'id',
  sort_type:'DESC',
  type_id:1,// 1 is ingredient, 2 is production, 3 is Butchery, 4 is Unpack
  category_id:0,
});
const assignButtonBehavior = () => {
  // console.log("assignButtonBehavior");
  // console.log(props.data);
  isAddModalOpen.value = true;

  listLowStocks();
};

const fillForm = () => {
  const data = props.data;

  ingredientForm.value.ingredient_id = data.id;
  ingredientForm.value.ingredient_name = data.name;
  ingredientForm.value.ingredient_id_number = data.ingredientIdNumber ?? "";
  ingredientForm.value.unit_abbre = data.unitAbbre ?? "";
  ingredientForm.value.warehouse_id = 0;

  searchWarehouse.value.ingredient_id_number = data.ingredientIdNumber ?? 0;
};
const listLowStocks = async () => {
  try {
    warehouseItems.value = [];
    const formData = FormDx(searchWarehouse.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/available-stocks`,
      formData,
      BearToken(token)
    );
    warehouseItems.value = response.data;
  } catch (error) {
    handleApiError(error); //
  }
};

const countLowStocks = async () => {
  try {
    warehouseItems.value = [];
    const formData = FormDx(searchWarehouse.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/count-low-stocks`,
      formData,
      BearToken(token)
    );
    totalLowStocks.value = response.data.totalrows;
  } catch (error) {
    handleApiError(error); //
  }
};


const handleTransaction = (transactionId) => {
  emits("transaction_id", transactionId);
};

// Pagination handler
const handlePagination = (page_num) => {
  searchWarehouse.value.page_num = page_num;
  listLowStocks();
};

const fillWarehouseForm = (item) => {
  ingredientForm.value.warehouse_id = item.value;
  ingredientForm.value.name = item.label;

  searchWarehouse.value.search = "";
};

const searchInput = useDebounce(async () => {
    searchWarehouse.value.page_num = 1;
    await listLowStocks();
  }, 500);

onMounted(() =>{
  console.log('Low Stocks On mounted');
  countLowStocks();
});
</script>
