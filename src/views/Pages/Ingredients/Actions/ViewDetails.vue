<template>
  <div>
    <div class="flex flex-row flex-wrap">
      <p
        @click.prevent="openModal()"
        title="Click to view item details"
        class=" hover:text-blue-500 cursor-pointer flex items-center gap-2"
        >
        {{ title }}
        <!-- <span class="italic">
          {{ data.ingredientIdNumber ?? "-" }} 
        </span>

        - {{data.ingredientCategoryName}} - 
        <span class="font-bold">
          {{ datat.itemName }}
        </span>
        <i class="text-red-500">[{{ data.unitAbbre }}]</i> -->
      </p>
      <span class="text-red-600 italic ">
        [{{ data.unitAbbre ?? "" }}]
      </span>

    </div>

    <!-- View Details Modal -->
    <Modal
      :show="isModalOpen"
      :maxWidth="'4xl'"
      :title="title"
      @close="isModalOpen = false"
    >
      <div class="p-6">
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          ></div>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
          <p class="text-red-500">{{ error }}</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left Column: Image Viewer -->
          <div class="bg-gray-50 p-4 rounded-lg h-fit">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Image</h3>
            <div class="max-h-[400px] overflow-y-auto">
              <IngImageViewer
                v-if="props.id"
                :key="props.id"
                :ingredient_id="props.id"
                :thumbnail="details?.thumbNail"
                :canDeleteImage="true"
              />
            </div>

            <div class="bg-white rounded-lg shadow-sm">
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700">
                  Additional Information
                </h3>
              </div>
              <div class="p-4">
                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1"
                    >Description</label
                  >
                  <textarea
                    v-model="details.description"
                    disabled
                    rows="4"
                    class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Details -->
          <div class="space-y-6 h-fit">
            <div class="bg-white rounded-lg shadow-sm">
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700">Basic Information</h3>
              </div>
              <div class="p-4 space-y-4">
                <!-- Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    v-model="details.name"
                    disabled
                    class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                  />
                </div>

                <!-- Category -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1"
                    >Category</label
                  >
                  <input
                    type="text"
                    v-model="details.ingredientCategoryName"
                    disabled
                    class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                  />
                </div>

                <!-- Unit -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Unit</label>
                  <input
                    type="text"
                    v-model="details.unitName"
                    disabled
                    class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                  />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm">
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700">Inventory Details</h3>
              </div>
              <div class="p-4 space-y-4">
                <!-- Cost Price -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1"
                    >Cost Price</label
                  >
                  <input
                    type="number"
                    v-model="details.costPrice"
                    disabled
                    class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                  />
                </div>

                <!-- Stock Limit -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1"
                    >Stock Limit</label
                  >
                  <input
                    type="number"
                    v-model="details.stockLimit"
                    disabled
                    class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import IngImageViewer from "@/views/Pages/Ingredients/Actions/IngImageViewer.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { BearToken, Alert, handleApiError, FormDx } from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const unitAbbre = ref('');

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
  title: {
    type: String,
    default: "View Details",
  },
  type: {
    type: String,
    default: "ingredient",
  },
  className: {
    type: String,
    default: "",
  },
  data: Object,
});

const isModalOpen = ref(false);
const loading = ref(false);
const error = ref(null);
const details = ref({
  name: "",
  description: "",
  unitName: "",
  costPrice: 0,
  ingredient_id: 0,
  ingredientCategoryName: "",
  stockLimit: 0,
  thumb_nail: null,
});

const openModal = async () => {
  isModalOpen.value = true;
  await fetchDetails();
};

const fetchDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const formData = FormDx({ ingredient_id: props.id });
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/details`,
      formData,
      BearToken(token)
    );

    if (response.data) {
      details.value = response.data.ingredient;
      unitAbbre.value = details.value.unitAbbre;
    }
  } catch (err) {
    console.error(err);
    error.value = "Failed to load details. Please try again.";
    handleApiError(err);
  } finally {
    loading.value = false;
  }
};
</script>
