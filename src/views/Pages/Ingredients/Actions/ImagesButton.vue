<template>
  <button
    @click.prevent="addImagesBehavior()"
    type="button"
    :class="[
      'bg-lime-700 text-white hover:opacity-60 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap hover:scale-110',
      className,
    ]"
  >
    Images
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="Edit Ingredient Images"
    @close="closeIngredient()"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addNewIngredientImages()" autocomplete="off">
        <div class="grid grid-cols-1 gap-6">
          <div class="bg-orange-100 p-2 rounded-md border border-4">
            <span class="italic ">
              {{ props.data.ingredientIdNumber ?? '' }}-
            </span>
            <span class="font-bold">
              {{ props.data.itemName ?? '' }}
            </span>
            <span class="italic text-red-500">
              [{{ props.data.unitAbbre }}]
            </span>
          </div>
          <div class="mb-1">
            <label for="itemImages" class="block text-sm font-medium text-gray-700"
              >Upload Image</label
            >
            <input
              type="file"
              id="itemImages"
              @change="handleImageUpload"
              multiple
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div> 
        <div class="flex items-center justify-end">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
          
        </div>
        
      </form>
       <div class=" bg-gray-500 rounded-md p-2 flex flex-wrap overflow-x-auto space-x-2">
          <div v-if="images.images?.length > 0" v-for="(img, index) in images.images" :key="index" class="relative hover:scale-110">
            <!-- Thumbnail Image -->
            <img
              :src="'data:image/jpeg;base64,' + img.image"
              class="w-24 h-24 object-cover rounded-lg cursor-pointer transition-transform transform"
              @click="currentIndex = index"
              alt="Gallery Image"
            />
            <!-- Remove Button -->
            <input type="checkbox" v-model="img.isPrimaryImage" @change.prevent="setPrimaryImage(img.id)" title="Set Image as Primary" class="absolute top-2 left-2 hover:scale-[1.5] hover:bg-orange-500 p-2 z-2000 border border-4 border-red-500" />
            
            <!-- v-if="canDeleteImage" -->
            <button
              type="button"
              @click.prevent="removeImage(img.id)"
              class="absolute top-2 right-2 py-0 px-1 text-red-500 font-bold bg-gray-200 cursor-pointer z-1000 text-sm hover:scale-[1.5] hover:text-red-800 rounded-md"
              title="Remove Item Image"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <!-- Default Thumbnail Image -->
          <div v-else class="relative hover:scale-110">
          <h4 class="text-white align-middle">No image found</h4>
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
import { VUE_APP_API_URL, UNITS } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  handleApiError,
} from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const images = ref([]);
const props = defineProps({
  className: String,
  ingredient_id_number: String,
  data:Object
});
const isAddModalOpen = ref(false);
const imageFiles = ref([]);

const ingredientForm = ref({
  item_name: "",
  ingredient_name:"",
  ingredient_id:0,
  ingredient_id_number: "",
  unit_id: 0,
  ingredient_images: [],
  unit_abbre: "", // New field for unit abbreviation
});
const addImagesBehavior = () => {
  console.log("addImagesBehavior in line: 110")
  console.log(props.data)
  resetForm();
  getItemImages();
  fillForm();
  isAddModalOpen.value = true;
};

const closeIngredient = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = false;
};
const fillForm = () => {
  const data = props.data;
  console.log("fillform in line: 125")
  console.log(data.ingredientIdNumber);
  // ingredientForm.value.ingredient_name = data.itemName ;
  ingredientForm.value.ingredient_id_number = data.ingredientIdNumber ?? "";
  ingredientForm.value.ingredient_images = [];
  // ingredientForm.value.unit_abbre = data.unitAbbre;
};

const resetForm = () => {
  ingredientForm.value = {
    item_name:"",
    ingredient_name: "",
    ingredient_id_number: "",
    unit_id: 0,
    ingredient_id: 0,
    ingredient_images: [],
    unit_abbre: "",
  };
  imageFiles.value = [];
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const setPrimaryImage = async (image_id) => {
  try {

   const confirmed = await Swal.fire({
    title: "Set as Primary Image?",
    text: "This image will be set as the primary display image.",
    icon: "question", // or "info" depending on your style preference
    showCancelButton: true,
    confirmButtonText: "Yes, set it!",
    cancelButtonText: "No, cancel",
    reverseButtons: true,
  });

    if (confirmed.isConfirmed) {
      // Proceed with deletion using Axios
      const formData = FormDx({ 
        item_image_id: image_id, 
        ingredient_id_number: props.data.ingredientIdNumber
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}items/set-primary-image`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Alert("warning", "Success!", response.data.message);
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    getItemImages();
  } catch (error) {
    console.log(error);
    // Handle Axios or other errors
    handleApiError(error);
  }
};
const getItemImages  = async() =>{
  images.value = [];
  try {
    const formData = FormDx({ item_id_number:  props.ingredient_id_number});
    const response = await axios.post(
        `${VUE_APP_API_URL}items/get-item-images`,
        formData,
        BearToken(token)
    );
    images.value = response.data;

    console.log("getItemImages in line: 194");
    console.log(images.value)
  } catch (error) {
      // Handle Axios or other errors
      console.log(error);
      // handleApiError(error);
  }
}

const removeImage = async (id) => {
    try {
      const confirmed = await Swal.fire({
        title: "Are you sure Delete Image?",
        text: "You are about to delete this image. This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
        reverseButtons: true,
      });

      if (confirmed.isConfirmed) {
        // Proceed with deletion using Axios
        const formData = FormDx({ ingredient_image_id: id });
        const response = await axios.post(
          `${VUE_APP_API_URL}ingredients/delete-image`,
          formData,
          BearToken(token)
        );

        // Handle success response
        Alert("warning", "Deleted!", response.data.message);
        // Optionally, update any local state or UI after deletion
      } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
        // Handle cancellation
        Alert("info", "Cancelled!", "Your action has been cancelled.");
      }
      getItemImages();
      // emits("transaction_id", Math.random());
    } catch (error) {
      // Handle Axios or other errors
      console.log(error);
      // handleApiError(error);
    }
  };
  
const addNewIngredientImages = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we upload Images.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const formData = FormDx(ingredientForm.value);

    // Append image files
    imageFiles.value.forEach((file) => {
      formData.append("ingredient_images[]", file);
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/add-new-images`,
      formData,
      BearToken(token)
    );
    // Close processing alert
    Swal.close();
    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

onMounted(() => {

// console.log(props.data.id)
});
</script>
