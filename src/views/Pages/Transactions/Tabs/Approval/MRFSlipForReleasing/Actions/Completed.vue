<template>
  <button
    @click.prevent="isCompletedModalOpen = true"
    type="button"
    class="bg-green-500 hover:opacity-70 focus:bg-green-300 text-white font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-check-circle text-lime-200"></i>
    Complete
  </button>
  <Modal
      :show="isCompletedModalOpen"
      :maxWidth="'lg'"
      title="Complete MRF"
      @close="isCompletedModalOpen = false"
    >
      <div class="p-6 rounded-md shadow-md">
        <form @submit.prevent="completeItem">
            <div class="mb-6">
                <label for="maintenance_employee_id" class="block text-sm font-medium text-gray-700">
                    Released By:
                </label>
                <SearchDropdown
                    apiEndpoint="employees/list"
                    :searchModel="searchReleaser"
                    placeholder="Search Releaser Name"
                    itemLabel="name"
                    itemId="id"
                    inputId="maintenanceName"
                    :defaultValue="completeForm.released_to_employee_name"
                    formatLabel="dashed_and_parenthesis"
                    @item-selected="(data) => fillReleaserForm(data)"
                    dataKey="employees"
                    returnName="['employeeNumber','firstName']"
                />
            </div>
            <div class="mb-6">
              <label
                for="itemImages"
                 class="block text-sm font-medium"
                >Upload Completion Proof:</label
              >
              <input
                type="file"
                id="itemImages"
                multiple
                @change="handleImageUpload"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <!-- Submit Button -->
            <div class="mt-6 text-right">
                <button
                type="submit"
                class="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
                >
                Submit
                </button>
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
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { VUE_APP_API_URL, PERMISSION, BUILDING } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const isCompletedModalOpen = ref(false);
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const imageFiles = ref(false);
const completeForm = ref({
  mrf_item_id: 0,
  released_to_employee_id: 0,
  released_to_employee_name: "",
  proof_images: [],
})
const searchReleaser = ref({
    search: "",
    page_num: 1,
    itemsperpage: 10,
});
const fillReleaserForm = (data) => {
  if(searchReleaser.value.search.length === 0){
    completeForm.value.released_to_employee_id = 0;
  }
  completeForm.value.released_to_employee_id = data.id;
}
const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};
const completeItem = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to complete this item. This action cannot be undone.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      completeForm.value.mrf_item_id = props.data.id;
      const formData = FormDx(completeForm.value);
      if (imageFiles.value && imageFiles.value.length > 0) {
          imageFiles.value.forEach((file) => {
              formData.append("proof_images[]", file); // Using array notation for multiple files
          });
      }
      const response = await axios.post(
        `${VUE_APP_API_URL}mrfs/to-complete-mrf-items`,
        formData,
        BearToken(token)
      );
      Swal.close();
      Alert("success", "Completed!", response.data.message);
      isCompletedModalOpen.value = false;
      emits('transaction_id',Math.random());
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
</script>
