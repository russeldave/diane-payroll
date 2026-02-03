<template>
  <button
    @click="(isViewModalOpen = true), itemBehavior()"
    class="bg-blue-500 text-white font-bold rounded-l text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-eye"></i>
    View
  </button>
 <!-- Add Item Modal -->
 <Modal :show="isViewModalOpen" :maxWidth="'6xl'" title="View Brand Item" @close="isViewModalOpen = false">
  <div class="grid grid-cols-1 gap-6 p-6">
    <form class="" autocomplete="off">
      <div class="grid grid-cols-1 gap-6">
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Brand Name</label
          >
          <input
            type="text"
            id="ProductName"
            v-model="brandForm.item_brand_name"
            placeholder="Input Product Name"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="flex flex-col md:flex-row md:justify-between mb-4">
          <div class="flex">
            <input
              type="search"
              v-model="search.search"
              @input.prevent="searchInput()"
              placeholder="Search Items..."
              class="shadow shadow-gray-700 flex w-full md:w-full font-bold text-lg py-2 px-4 rounded-lg mb-4 float-end"
            />
          </div>
          <div class="flex gap-2">
           
          </div>
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
import { VUE_APP_API_URL, PERMISSION, BUILDING, CATEGORIES } from "@/views/Utility/Global";
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
  data: Object,
});
const items  = ref([]);
const isViewModalOpen = ref(false);
const brandForm = ref({
  brand_id: 0,
  item_brand_name: '',
  remarks: '',
});
const itemBehavior = () => {
  const data = props.data;

  brandForm.value.brand_id = data.id;
  brandForm.value.item_brand_name = data.name;
  brandForm.value.remarks = data.remarks;

  getBrandItem();
};
const getBrandItem = async () => {
  try{
    const formData = FormDx(brandForm.value);
    const response = await axios.post(VUE_APP_API_URL+'',formData,BearToken());
    items.value = response.data.brandItems;
  }catch(error){
    handleApiError(error);
  }
};
// Call listItems when component is mounted
onMounted(() => {
  
});
</script>
