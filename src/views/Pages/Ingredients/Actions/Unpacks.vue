<template>
  <button
    @click.prevent="unpacksBehavior()"
    type="button"
    :class="[
      'bg-[#C66E52] text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap hover:scale-110',
      className,
    ]"
  >
    <!-- <i class="fas fa-warehouse"></i> -->
    Unpacks
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'6xl'"
    title="Ingredient Unpacks"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4 w-full col-span-2">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Ingredient Name</label
            >
            <div class="flex p-2 border border-3 border-gray-500 bg-gray-100 rounded-lg">
              <span class="text-gray-700 text-sm italic">
                {{ ingredientForm.ingredient_id_number }} -&nbsp;
              </span>
              <span class="font-bold">
                {{ ingredientForm.ingredient_name }}
              </span>
              <span class="text-red-500 italic">
                [{{ ingredientForm.unit_abbre }}]
              </span>
            </div>
          </div>
        </div>
      </form>
      <div class="block mt-4 border-t-2 border-dashed">
        <label for="LeagueName" class="block text-md font-medium mb-3 text-gray-700"
          >Menus:</label
        >
        <!-- <button
          @click.prevent="generateItemField()"
          type="button"
          class="px-4 py-2 font-bold hover:bg-blue-500 bg-blue-600 mb-2 rounded shadow text-white text-md float-right"
        >
          <i class="fa fa-plus"></i> Add Billing Row
        </button> -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <th
                scope="col"
                class="px-6 py-3 text-left text-md font-medium uppercase tracking-wider"
              >
                Parent Ingredient Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-md font-medium uppercase tracking-wider"
                >
                Unpack Quantity
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-md font-medium uppercase tracking-wider"
                >
                Cost
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loop through products and display them -->
            <tr
              v-for="(i, ii) in parentIngredients?.parentIngredients"
              v-if="parentIngredients?.parentIngredients?.length > 0"
              :key="ii"
              :class="i.itemStatus === 7 ? 'bg-slate-400' : ''"
            >
              <td class="px-2 py-2 border">
                <span class="italic text-gray-600 text-sm">
                  {{ i.ingredientIdNumber }} -&nbsp;
                </span>
                <span class="font-bold">
                  {{ i.name }}
                </span>
                <span class="text-red-500 italic">
                  [{{ i.unitAbbre }}]
                </span>
              </td>
              <td class=" flex justify-center px-2 py-2 border text-right font-bold">
                <span class="text-sm text-gray-700">
                  {{ i.unpackQuantity }}
                </span>
                <span class="text-red-500 text-sm italic">
                  {{ ingredientForm.unit_abbre }}
                </span>
              </td>
              <td class="px-2 py-2 border text-red-600">
                ₱{{ i.costPrice }}
              </td>
            </tr>
            <tr v-else>
              <td class="px-2 py-2 border" colspan="6">
                <p class="text-red-500 font-bold text-center">
                  **No Parent Ingredients Found**
                </p>
              </td>
            </tr>
          </tbody>
        </table>
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
const parentIngredients = ref([]);
const ingredientForm = ref({
  ingredient_id: 0,
  ingredient_name: "",
  warehouse_id: 0,
  ingredient_name: '',
  ingredient_id_number: '',
  unit_abbre: '',
});
const searchWarehouse = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  ingredient_id_number: 0,
});
const unpacksBehavior = () => {
  isAddModalOpen.value = true;
  // console.log('unpacksBehavior');
  // console.log(props.data.itemName);

  resetForm();
  fillForm();
  listUnpacks();
};
const resetForm = () => {
  ingredientForm.value.ingredient_id = 0;
  ingredientForm.value.ingredient_name = "";
  ingredientForm.value.warehouse_id = "";

  // emits("transaction_id", Math.random());
};
const fillForm = () => {
  const data = props.data;
  ingredientForm.value.ingredient_name = data.itemName ?? "";
  ingredientForm.value.ingredient_id_number = data.ingredientIdNumber ?? "";
  ingredientForm.value.unit_abbre = data.unitAbbre ?? "";

  searchWarehouse.value.ingredient_id_number = data.ingredientIdNumber ?? '';
};
const listUnpacks = async () => {
  try {
    parentIngredients.value = [];
    const formData = FormDx(searchWarehouse.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/get-unpacks`,
      formData,
      BearToken(token)
    );
    parentIngredients.value = response.data;
  } catch (error) {
    handleApiError(error); //
  }
};


// const handleTransaction = (transactionId) => {
//   emits("transaction_id", transactionId);
// };

// const fillWarehouseForm = (item) => {
//   ingredientForm.value.warehouse_id = item.value;
//   ingredientForm.value.name = item.label;

//   searchWarehouse.value.search = "";
// };
</script>
