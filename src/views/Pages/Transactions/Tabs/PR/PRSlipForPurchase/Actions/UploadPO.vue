<!-- <template>
  <button
    @click="uploadPOBehavior()"
    class="bg-orange-500 hover:opacity-70 focus:bg-orange-300 text-white font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-upload"></i>
    Upload PO
  </button>
  <Modal :show="isUploadModalOpen" :maxWidth="'md'"  title="Upload PO" @close="isUploadModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="uploadPO()">
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Upload Purchase Order Slip</label
          >
          <input
            type="file"
            id="itemImages"
            @change="handleImageUpload"
            multiple
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            v-model="mrfForm.remarks"
            placeholder="Input Building Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template> -->

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { VUE_APP_API_URL, DATE_NOW, COMPANIES } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const isUploadModalOpen = ref(false);
const locations = ref([]);
const imageFiles = ref([]);

 const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
});

const mrfForm = ref({
  pr_id: 0,
  remarks: '',
});

const uploadPOBehavior = () => {
  // console.log("uploadBehavoir");
  // console.log(props.data);
  mrfForm.value.pr_id = props.data.id
  isUploadModalOpen.value = true;
  resetForm();
  companiesDropdown();
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const uploadPO = async () => {
  try {
    // const formData = FormDx(mrfForm.value);
    const formData = FormDx(mrfForm.value);
    imageFiles.value.forEach((file) => {
      formData.append("po_images[]", file); // Using array notation for multiple files
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/upload-po-images`,
      formData,
      BearToken(token)
    );

    isUploadModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};
</script>
