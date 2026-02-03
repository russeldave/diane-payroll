<template>
  <button
    @click.prevent="convertBehavior()"
    type="button"
    class="text-xs bg-red-500 p-2 text-white rounded-r" 
  >
    {{ props.unit }}
  </button>

  <!-- Add Item Modal -->
  <Modal :show="isConvertModalOpen" :maxWidth="'md'" title="Convert Measurement" @close="isConvertModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <div class="grid grid-cols-1 gap-6">
            <div class="mb-4">
              <label
                for="ProductName"
                class="block text-sm font-medium text-gray-700"
                >Name</label
              >
              <input
                type="text"
                id="ProductName"
                required
                v-model="convertForm.receiving_ingredient_name"
                placeholder="Input Name"
                disabled
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              />
          </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="mb-4">
              <label
                for="ProductName"
                class="block text-sm font-medium text-gray-700"
                >Parent ({{ convertForm.parent_unit_abbre }})</label
              >
               <div class="flex">
                  <input
                    type="text"
                    id="ProductName"
                    required
                    v-model="convertForm.quantity"
                    placeholder="Input Name"
                    class="mt-1 p-2 border rounded-md w-full"
                  />
                  <!-- <button
                    type="button"
                    class="text-xs bg-red-500 p-2 text-white rounded-r" 
                  >
                    {{ convertForm.unit_abbre }}
                  </button> -->
               </div>
          </div>
          <div class="mb-4">
              <label
                for="ProductName"
                class="block text-sm font-medium text-gray-700"
                >Actual Unit ({{ convertForm.unit_abbre }})</label
              >
              <div class="flex">
                  <input
                    type="text"
                    id="ProductName"
                    required
                    v-model="convertForm.converted_quantity"
                    placeholder="Input Name"
                    class="mt-1 p-2 border rounded-md w-full"
                  />
                  <!-- <button
                    type="button"
                    class="text-xs bg-red-500 p-2 text-white rounded-r" 
                  >
                    {{ convertForm.parent_unit_abbre }}
                  </button> -->
               </div>
          </div>
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
import { VUE_APP_API_URL, UNITS} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError
} from "@/views/Utility/Helper";
const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  data: Object,
  unit: String,
});
const isConvertModalOpen = ref(false);
const units  = ref([]);
const imageFiles = ref([]);
const convertForm = ref({
  receiving_ingredient_id: 0,

});

onMounted(() => {
  
})

const convertBehavior = () => {
  resetForm();
  fillForm();
  // unitsDropdown();
  isConvertModalOpen.value = false;
}
const fillForm = () => {
  const data = props.data;

  console.log(data);
  convertForm.value.receiving_ingredient_id = data.id;
  convertForm.value.receiving_ingredient_name = data.name;
  convertForm.value.quantity = data.quantity;
  convertForm.value.unit = data.unitName;
  convertForm.value.unit_id = data.unitId;
  convertForm.value.unit_abbre = data.unitAbbre;
  convertForm.value.parent_unit_name = data.parentUnitName;
  convertForm.value.parent_unit_id = data.parentUnitId;
  convertForm.value.parent_unit_abbre = data.parentUnitAbbre;
  // convertForm.value.ingredient_category_abbre = data.abbre;
};
const resetForm = () => {
 
};

const unitsDropdown = async () => {
  units.value = await UNITS();
}
const convertMeasurement = async () => {
  try {
    const formData = FormDx(convertForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredient-categories/edit`,
      formData,
      BearToken(token)
    );

    isConvertModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};
</script>
