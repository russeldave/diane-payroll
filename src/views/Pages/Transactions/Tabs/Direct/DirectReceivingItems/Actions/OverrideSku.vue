<template>
  <button
    v-if="hasPermission('Override_Ingredient_Sku')"
    @click.prevent="overrideSkuBehavior()"
    type="button"
    :class="[
      'bg-red-400 text-white hover:opacity-70 focus:bg-red-600 font-bold text-sm md:text-md p-2 text-nowrap hover:scale-110 rounded-e-md',
    ]"
  >
    <!-- <i class="fas fa-warehouse"></i> -->
    Edit SKU
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="Override SKU"
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4 w-full col-span-2">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >SKU</label
            >
            <div class="flex p-2 border border-3 border-gray-500 bg-gray-100 rounded-lg">
              <span class="font-bold">
                {{ ingredientForm.sku ?? 'N/A'}}
              </span>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <div class="inline-block border-4 border-lime-200 rounded px-0">
            <!-- Barcode determines width -->
            <div class="flex justify-center">
              <Barcode :barcodeValue="ingredientForm.sku" />
            </div>
            <!-- Text constrained to barcode width -->
            <div class="max-w-[20rem] break-words text-center mt-0 font-bold bg-teal-100 pt-1">
              {{ ingredientForm.ingredient_name }}
            </div>
          </div>
        </div>
      </form>
      <div class="block mt-4 border-t-2 border-dashed">
        <form class="mt-0 grid grid-cols-2 gap-6" @submit.prevent="overrideSku()">
          <div class="mb-4 col-span-2 ">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >New SKU</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
             <div class="flex flex-row">
              <button
                type="submit"
                class="bg-lime-500 text-white font-bold py-2 px-4 rounded-2xl rounded-s hover:bg-lime-700"
                @dblclick="pasteSku()"
                >
                Paste
              </button>
              <input
                type="text"
                id="ProductName"
                v-model="ingredientForm.new_sku"
                placeholder="Input New SKU"
                class="mt-1 p-2 border rounded-md w-full"
              />
              <button
                type="submit"
                class="bg-yellow-500 text-white font-bold py-2 px-4 rounded-e hover:bg-yellow-600"
                >
                Edit
              </button>
             </div>
          </div>
          <div class="flex justify-end md:col-span-2">
          
        </div>
      </form>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import {
  VUE_APP_API_URL,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  handleApiError,
} from "@/views/Utility/Helper";
import Barcode from "@/views/Component/Barcode.vue";
import { hasPermission } from "@/views/Utility/Permissions";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const ingredientForm = ref({
  ingredient_id: 0,
  ingredient_name: "",
  warehouse_id: 0,
  ingredient_name: '',
  ingredient_id_number: '',
  unit_abbre: '',
  new_sku: '',
  sku: '0000',
});

const overrideSkuBehavior = () => {
  isAddModalOpen.value = true;
  // console.log('overrideSkuBehavior in line: 171');
  // console.log(props.data);

  resetForm();
  fillForm();
};

const pasteSku = () => {
  console.log("pasteSku");
  ingredientForm.value.new_sku = ingredientForm.value.ingredient_id_number ?? '';
}

const resetForm = () => {
  ingredientForm.value.ingredient_id = 0;
  ingredientForm.value.ingredient_name = "";
  ingredientForm.value.warehouse_id = "";
};
const fillForm = () => {
  const data = props.data;
  ingredientForm.value.ingredient_name = data.itemName ?? "";
  ingredientForm.value.ingredient_id_number = data.ingredientIdNumber ?? "";
  ingredientForm.value.unit_abbre = data.unitAbbre ?? "";
  ingredientForm.value.sku = data.sku.length == 0 ? '00' : data.sku;
};
const overrideSku = async () => {
  if (props.data.sku && props.data.sku.length > 0) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to override the ingredient SKU.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, override SKU!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      Swal.fire("Cancelled", "Your action has been cancelled.", "info");
      return;
    }
  }

  try {
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const formData = FormDx({
      sku : ingredientForm.value.new_sku,
      ingredient_id : ingredientForm.value.ingredient_id_number
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}override-food/ingredient-sku`,
      formData,
      BearToken(token)
    );
    Swal.close();
    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};

</script>
