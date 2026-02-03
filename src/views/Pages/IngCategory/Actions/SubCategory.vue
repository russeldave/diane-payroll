<template>
  <button
    @click.prevent="subCategoryBehavior()"
    class="bg-green-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-folder-tree"></i>
    SubCategory List
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isSubCatModalOpen"
    :maxWidth="'6xl'"
    title="View Subcategory List"
    @close="isSubCatModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="" autocomplete="off">
        <div class="grid grid-cols-1 gap-6">
          <h1 class="text-lg lg:text-xl font-bold mb-1 mt-1">Sub Category</h1>
          <div class="flex flex-col lg:flex-row md:justify-between mb-1">
            <input
              type="search"
              v-model="search.search"
              @input.prevent="searchInput()"
              placeholder="Search Category..."
              class="shadow shadow-gray-700 flex w-full focus-visible:bg-yellow-100 lg:w-1/4 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
            />
            <Add
              v-if="hasPermission('Add_Ingredient_Button')"
              @transaction_id="handleTransaction"
            />
          </div>
          <div class="flex w-full overflow-auto">
            <!-- Table to display products -->
            <table class="min-w-full divide-y divide-gray-200">
              <!-- Table headers -->
              <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
                <tr class="border-b-2 border-solid border-yellow-500">
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
                <!-- Loop through products and display them -->
                <tr
                  v-for="ing in data.subCategories"
                  class="hover:bg-gray-200"
                  v-if="data.subCategories?.length > 0 && loading == false"
                  :key="ing.id"
                >
                  <td class="px-2 py-2 border">{{ ing.name }} ({{ ing.abbre }})</td>
                  <td class="px-2 py-2 border">
                    <div class="flex justify-center flex-nowrap">
                      <Edit :data="ing" @transaction_id="handleTransaction" />
                      <!-- <SubCategory :data="ing" @transaction_id="handleTransaction" /> -->
                      <Delete :data="ing" @transaction_id="handleTransaction" />
                    </div>
                  </td>
                </tr>
                <tr v-if="loading == true">
                  <td
                    class="px-2 py-2 border text-center text-red-500 font-bold"
                    colspan="8"
                  >
                    <Loader />
                  </td>
                </tr>
                <tr v-if="data.totalrows == 0 && loading == false">
                  <td
                    class="px-2 py-2 border text-center text-red-500 font-bold"
                    colspan="8"
                  >
                    ***No Ingredient Categories found***
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
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
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
import { hasPermission } from "@/views/Utility/Permissions";

import Add from "./AddSub.vue";
import Edit from "./EditSub.vue";
import Delete from "./DeleteSub.vue";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});

const isSubCatModalOpen = ref(false);
const loading = ref(false);
const data = ref({});
const categories = ref([]);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listCategories();
  handlePagination(1);
}, 500);

const listCategories = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredient-sub-categories/list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listCategories();
};
const handleTransaction = (transaction_id) => {
  listCategories();
};

const subCategoryBehavior = () => {
  listCategories();

  isSubCatModalOpen.value = true;
};

// Call listItems when component is mounted
onMounted(() => {});
</script>
