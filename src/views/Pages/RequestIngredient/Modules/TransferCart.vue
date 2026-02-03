<template>
  <button
    v-if="hasPermission('Transactions_MRF_Create_Transfer_Item')"
    @click="addMRFBehavior()"
    class="bg-red-500 hover:opacity-70 focus:bg-red-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 ml-2 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-truck"></i>
    Transfer
  </button>
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="Create MRF(Transfer Item)"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addMRF()">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="">
            <div class="mb-4">
              <label for="LeagueName" class="block text-sm font-medium text-gray-500"
                >Requestor Warehouse:</label
              >
              <input
                type="text"
                id="itemImages"
                v-model="mrfForm.from_warehouse_name"
                disabled
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              />
              <!-- <select
                id="warehouse-select"
                placeholder="Select Warehouse"
                class="mt-1 p-2 border rounded-md w-full"
                v-model="mrfForm.from_warehouse_id"
              >
                <option
                  v-for="(w, index) in from_warehouse"
                  :key="index"
                  :value="w.warehouseId"
                >
                  {{ w.warehouseName }}
                </option>
                <option value="0">All</option>
              </select> -->
            </div>
            <!-- <div class="mb-4">
              <label
                for="LeagueName"
                 class="block text-sm font-medium text-gray-500"
                >Destination Location</label
              >
              <div class="flex items-center mt-1">
                <SearchDropdown
                  apiEndpoint="warehouses/list"
                  :searchModel="searchToWarehouse"
                  placeholder="Search Destination"
                  itemLabel="name"
                  itemId="id"
                  inputId="destinationName"
                  formatLabel="dashed_and_parenthesis"
                  @item-selected="(data) => fillToWarehouseForm(data)"
                  dataKey="employees"
                  returnName="['warehouseSku','name','buildingName']"
                />
              </div>
            </div> -->
            <div class="mb-4">
              <label for="LeagueName" class="block text-sm font-medium text-gray-500"
                >Requested From:
              </label>
              <div class="flex items-center mt-1">
                <SearchDropdown
                  apiEndpoint="employees/list"
                  :searchModel="searchUser"
                  placeholder="Search Employee"
                  itemLabel="name"
                  itemId="id"
                  :key="mrfForm.employee_name"
                  :defaultValue="mrfForm.employee_name"
                  inputId="employeeName"
                  @item-selected="(data) => fillUserForm(data)"
                  dataKey="employees"
                  returnName="['employeeCompleteName']"
                />
              </div>
            </div>
            <div class="mb-4">
              <label for="itemImages" class="block text-sm font-medium text-gray-500"
                >Upload Manual MRF:</label
              >
              <input
                type="file"
                id="itemImages"
                @change="handleImageUpload"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <div class="mb-4">
              <label for="LeagueName" class="block text-sm font-medium text-gray-500"
                >Remarks:</label
              >
              <textarea
                v-model="mrfForm.remarks"
                placeholder="Input MRF Remarks"
                class="mt-1 p-2 border rounded-md w-full"
              ></textarea>
            </div>
          </div>
          <div class="block col-span-2">
            <div class="mb-4 overflow-auto">
              <button
                @click.prevent="generateItemField()"
                type="button"
                class="px-4 py-2 font-bold hover:bg-blue-500 bg-blue-600 mb-2 rounded shadow text-white text-md float-right"
              >
                <i class="fa fa-plus"></i> Add Item
              </button>
            </div>
            <!-- Mobile view: Form-like layout -->
            <div class="block bg-gray-200 text-xs">
              <div
                v-for="(i, ii) in mrfForm.items"
                :key="i.id"
                class="bg-white my-2 p-3 block md:flex items-center border-2 rounded border-black"
              >
                <!-- Item Image Viewer (1/4 of the width) -->
                <div class="ml-4 flex-0 w-1/4 hidden lg:inline">
                  <ItemImageViewer
                    v-if="i.item_id"
                    :item_id="i.item_id"
                    :thumbnail="i.thumb_nail"
                    :canDeleteImage="false"
                    :title="i.item_name"
                  />
                </div>

                <!-- Details (remaining space, center) -->
                <div class="ml-4 flex-1">
                  <div class="grid grid-cols-1 gap-6">
                    <!-- Item -->
                    <div class="mb-2">
                      <label
                        for="itemsName"
                        class="block text-sm font-medium text-gray-500 mb-1"
                        >Item:</label
                      >
                      <div
                        class="w-full rounded px-2 py-2 border border-2 font-bold bg-gray-200"
                        >
                        {{i.itemNumber}} - {{ i.item_name }}
                      </div>
                      <!-- <SearchDropdown
                        apiEndpoint="items/list"
                        :searchModel="search"
                        placeholder="Search Items"
                        itemLabel="name"
                        itemId="id"
                        inputId="itemsName"
                        class="text-xs"
                        :defaultValue="i.item_name"
                        formatLabel="none"
                        @item-selected="(item) => fillItemsForm(item, ii)"
                        dataKey="items"
                        returnName="['itemCompleteName']"
                      /> -->
                    </div>
                  </div>
                  <div class="inline lg:hidden">
                    <label
                      for="itemsName"
                      class="block text-sm font-medium text-gray-500 mb-1"
                      >Image:</label
                    >
                    <ItemImageViewer
                      v-if="i.item_id"
                      :item_id="i.item_id"
                      :thumbnail="i.thumb_nail"
                      :canDeleteImage="false"
                      :title="i.item_name"
                    />
                  </div>
                  <!-- Proof -->
                  <div class="mb-2">
                    <label
                      for="proof"
                      class="block text-sm font-medium text-gray-500 mb-1"
                      >Sample/Damage Item/Comparison:</label
                    >
                    <input
                      type="file"
                      class="mt-1 p-2 border rounded-md w-full"
                      id="proof"
                      multiple
                      accept="image/*"
                      @change="(event) => handleItemImageUpload(event, ii)"
                    />
                  </div>
                  <!-- Remarks -->
                  <div class="mb-2">
                    <label
                      for="remarks"
                      class="block text-sm font-medium text-gray-500 mb-1"
                      >Remarks:</label
                    >
                    <textarea
                      v-model="i.remarks"
                      placeholder="Input Item Remarks"
                      class="mt-1 p-2 border rounded-md w-full"
                      id="remarks"
                    ></textarea>
                  </div>
                  <div class="flex items-center justify-between mb-4 mt-2">
                    <div>
                      <button
                        @click.prevent="changeQuantity(-1, ii)"
                        class="bg-transparent border-none cursor-pointer text-blue-500 hover:text-blue-700 text-xl"
                      >
                        <i class="fas fa-minus"></i>
                      </button>
                      <input
                        type="number"
                        v-model="i.quantity"
                        :title="`${i.quantity_per_unit}/${i.unit_abbre}`"
                        class="mx-2 w-20 text-center text-md md:text-lg text-gray-700 border border-gray-300 rounded-md p-1"
                      />
                      <button
                        @click.prevent="changeQuantity(1, ii)"
                        class="bg-transparent border-none cursor-pointer text-blue-500 hover:text-blue-700 text-xl"
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div
                    class="grid grid-cols-3 gap-6 px-3 border-y-2 mb-2 py-2"
                    v-if="i.unpack_ingredient_id"
                  >
                    <!-- Item -->
                    <div class="mb-2">
                      <label
                        for="itemsName"
                        class="block text-sm font-medium text-gray-500 mb-1"
                        >Unpack Item:</label
                      >
                      <input
                        type="text"
                        class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                        disabled
                        v-model="i.unpack_ingredient_name"
                      />
                    </div>
                    <div class="mb-2">
                      <label
                        for="itemsName"
                        class="block text-sm font-medium text-gray-500 mb-1"
                        >Unpack Quantity:</label
                      >
                      <div class="flex">
                        <input
                          type="text"
                          class="p-2 border rounded-l w-full bg-gray-200"
                          disabled
                          v-model="i.unpack_ingredient_quantity"
                        />
                        <button
                          type="button"
                          class="hover:animate-pulse shadow flex justify-center items-center rounded-r p-2 bg-blue-500 focus:outline-none text-white"
                        >
                          <span class="text-sm">{{ i.unpack_ingredient_unit }}</span>
                        </button>
                      </div>
                    </div>
                    <div class="mb-2">
                      <label
                        for="itemsName"
                        class="block text-sm font-medium text-gray-500 mb-1"
                        >Unpack Total:</label
                      >
                      <div class="flex">
                        <p class="hidden">
                          {{
                            (i.unpack_ingredient_quantity_total =
                              i.unpack_ingredient_quantity * (i.quantity ?? 0))
                          }}
                        </p>
                        <input
                          type="text"
                          class="p-2 border rounded-l w-full bg-gray-200"
                          disabled
                          v-model="i.unpack_ingredient_quantity_total"
                        />
                        <button
                          type="button"
                          class="hover:animate-pulse shadow flex justify-center items-center rounded-r p-2 bg-blue-500 focus:outline-none text-white"
                        >
                          <span class="text-sm">{{ i.unpack_ingredient_unit }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-end items-center">
                    <button
                      @click.prevent="removeItemField(ii)"
                      type="button"
                      class="hover:animate-pulse shadow flex justify-center items-center rounded-full p-2 bg-red-500 focus:outline-none text-white"
                    >
                      <i class="fas fa-trash-alt fa-2x"></i>
                      <span class="text-sm">&nbsp;Remove</span>
                    </button>
                  </div>
                </div>

                <!-- Button (1/8 of the width, right side) -->
                <!-- <div class="ml-4 flex-0 w-1/8">
                    <div class="flex flex-col items-center">
                      <button
                        @click.prevent="removeItemField(ii)"
                        type="button"
                        class="text-red-500 hover:text-red-700 rounded focus:outline-none"
                      >
                        <i class="fas fa-trash-alt fa-2x"></i>
                      </button>
                      <span class="text-sm text-red-500">Delete</span>
                    </div>
                    
                    
                  </div> -->
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end py-4">
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
  <Modal
    :show="isBrandModalOpen"
    :maxWidth="'md'"
    title="Brand List"
    @close="isBrandModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <div class="flex">
        <input
          type="search"
          v-model="searchBrand.search"
          @input.prevent="listBrands()"
          placeholder="Search Brand..."
          class="shadow shadow-gray-700 w-full flex font-bold text-lg py-2 px-4 rounded-lg mb-4 float-end"
        />
        <!-- <AddNewBrand
          :className="'border rounded-r-md mt-3 bg-red-500 text-white hover:bg-red-600 py-2 px-4'"
        /> -->
      </div>
      <div class="flex w-full overflow-auto">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="bg-gray-100 shadow">
            <tr class="border-b-2 border-solid border-yellow-500 text-nowrap">
              <th
                scope="col"
                class="px-2 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-2 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loop through products and display them -->
            <tr
              v-for="brand in data.itemHasBrands"
              v-if="data.itemHasBrands?.length > 0"
              :key="brand.id"
              class="text-nowrap"
            >
              <td class="px-2 py-3 border">
                {{ brand.itemBrandName }} ({{ brand.brandAbbre }})
              </td>
              <td class="px-2 py-3 border">
                <div class="flex justify-start">
                  <button
                    type="submit"
                    @click.prevent="selectedBrand(brand)"
                    class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                  >
                    Select
                  </button>
                </div>
              </td>
            </tr>
            <tr v-else>
              <td class="px-2 py-3 border text-center text-red-500 font-bold" colspan="5">
                ***No Brands Found***
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
  </Modal>
</template>
<script setup>
import { onMounted, ref, watch, onUnmounted } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import { VUE_APP_API_URL, DATE_NOW, COMPANIES, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import ItemImageViewer from "./ItemImageViewer.vue";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  warehouse_id: Number,
  data: Array,
});
const isAddModalOpen = ref(false);
const isBrandModalOpen = ref(false);
const items = ref([]);
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const from_warehouse = ref([]);
const users = ref([]);
const data = ref([]);
const activeItemIndex = ref(0);
const imageFiles = ref([]);
const mrfForm = ref({
  mrf_id: 0,
  date_now: DATE_NOW(),
  our_company_id: 0,
  remarks: "",
  mrf_manual_number: "",
  from_warehouse_id: 0,
  employee_id: 0,
  employee_name: "",
  proof_images: [],
  mrf_type: 2,
  items: [],
  // items: [
  //   {
  //     item_id: 0,
  //     item_name: "",
  //     quantity: 0,
  //     quantity_per_unit: 0,
  //     sub_quantity: 0,
  //     description: "",
  //     remarks: "",
  //     room_location_number: 0,
  //     room_location_name: "",
  //   },
  // ],
});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchToWarehouse = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchBrand = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  item_id: 0,
  supplier_id: 0,
});
//itemd dropdown
const listItems = async () => {
  try {
    items.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}items/list`,
      formData,
      BearToken(token)
    );
    items.value = response.data.items;
  } catch (error) {
    handleApiError(error);
  }
};
const searchItemBehavior = useDebounce(async (index, name) => {
  search.value.search = name;
  activeItemIndex.value = index;

  await listItems(); // Call listItems function after debounce delay
}, 500);
const fillItemsForm = (item, index) => {
  mrfForm.value.items[index].item_id = item.id;
  mrfForm.value.items[index].item_name = item.itemCompleteName;
  mrfForm.value.items[index].unit_abbre = item.unitAbbre;
  mrfForm.value.items[index].unit_id = item.unitId;

  search.value.search = "";
};
//location dropdown

const fillToWarehouseForm = (item) => {
  console.log(item);
  mrfForm.value.to_warehouse_id = item.id;
  mrfForm.value.to_warehouse_name = item.name;

  searchToWarehouse.value.search = "";
};

const warehouseDropdown = async () => {
  try {
    from_warehouse.value = [];
    const response = await axios.post(
      `${VUE_APP_API_URL}users/warehouses-dropdown`,
      { id: 0 }, // Assuming you want to fetch all warehouses
      BearToken(token)
    );

    from_warehouse.value = response.data.userWarehouses || [];
  } catch (error) {
    console.error("Error fetching warehouses:", error);
  }
};

const getMRFUserDefaultData = async () => {
  try {
    from_warehouse.value = [];
    const response = await axios.post(
      `${VUE_APP_API_URL}users/get-default-warehouse`,
      { id: 0 }, // Assuming you want to fetch all warehouses
      BearToken(token)
    );

    const { warehouseId, employeeId, employeeName, warehouseName } = response.data;

    mrfForm.value.from_warehouse_id = warehouseId || 0;
    mrfForm.value.from_warehouse_name = warehouseName || "none";
    mrfForm.value.employee_id = employeeId || 0;
    mrfForm.value.employee_name = employeeName || "";
  } catch (error) {
    console.error("Error fetching warehouses:", error);
  }
};
//users dropdown
const listUsers = async () => {
  try {
    users.value = [];
    const formData = FormDx(searchUser.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}employees/list`,
      formData,
      BearToken(token)
    );
    users.value = response.data.employees;
  } catch (error) {
    handleApiError(error);
  }
};
const searchUserBehavior = useDebounce(async (name) => {
  searchUser.value.search = name;
  if (searchUser.value.search?.length == 0) {
    mrfForm.value.employee_id = 0;
  }
  await listUsers(); // Call listUsers function after debounce delay
}, 500);
const fillUserForm = (user) => {
  mrfForm.value.employee_id = user.id;
  mrfForm.value.employee_name = user.employeeCompleteName;

  searchUser.value.search = "";
};

const brandBehavior = (item_id, index) => {
  searchBrand.value.item_id = item_id;
  searchBrand.value.active_index = index;
  listBrands();
};

const selectedBrand = (brand) => {
  const pr_items = mrfForm.value.items[searchBrand.value.active_index];

  pr_items.brand_id = brand.itemBrandId;
  pr_items.brand_name = brand.itemBrandName;
  pr_items.brand_abbre = brand.brandAbbre;

  isBrandModalOpen.value = false;
};
const listBrands = async () => {
  try {
    data.value = [];
    const formData = FormDx(searchBrand.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}items/get-item-has-prices-per-item-id`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
  } catch (error) {
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  searchBrand.value.page_num = page_num ?? 1;
  listBrands();
};
//add
const addMRFBehavior = () => {
  // console.log(props)
  resetForm();
  // companiesDropdown();
  warehouseDropdown();
  getMRFUserDefaultData();
  mrfForm.value.items = props.data;

  isAddModalOpen.value = true;
};
const resetForm = () => {
  mrfForm.value.mrf_id = 0;
  mrfForm.value.date_now = DATE_NOW();
  mrfForm.value.our_company_id = 0;
  mrfForm.value.remarks = "";
  mrfForm.value.mrf_manual_number = "";
  mrfForm.value.items = [
    {
      item_id: 0,
      item_name: "",
      brand_id: 0,
      quantity: 0,
      quantity_per_unit: 0,
      sub_quantity: 0,
      description: "",
      remarks: "",
      item_images: [],
      room_location_number: 0,
    },
  ];
};

const addMRF = async () => {
  try {
    // Show processing alert
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we process your request.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Validate that the destination location is different from the source location
    if (mrfForm.value.to_warehouse_id === mrfForm.value.from_warehouse_id) {
      Swal.close(); // Close the loading Swal
      Alert(
        "warning",
        "Warning!",
        "Destination Location must not be the same as the Source Location"
      );
      return false;
    }
    // remove thumb_nail from items array
    mrfForm.value.items = mrfForm.value.items.map((item) => {
      const newItem = { ...item };
      delete newItem.thumb_nail;
      return newItem;
    });
    // Prepare the FormData object with the form fields
    const formData = FormDx(mrfForm.value);

    // Conditionally append item images if they exist
    mrfForm.value.items.forEach((item, index) => {
      if (item.item_images && item.item_images.length > 0) {
        item.item_images.forEach((file, i) => {
          formData.append(`items[${index}][item_images][${i}]`, file);
        });
      }
    });

    // Conditionally append proof images if they exist
    if (imageFiles.value && imageFiles.value.length > 0) {
      imageFiles.value.forEach((file) => {
        formData.append("proof_images[]", file); // Using array notation for multiple files
      });
    }

    // Send the request
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/add-transfer`,
      formData,
      BearToken(token)
    );

    // Close the loading Swal once the request is completed
    Swal.close();

    // Close modal and show success alert
    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);

    // Emit event with a unique transaction ID
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close the loading Swal on error
    Swal.close();
    handleApiError(error);
  }
};

const changeQuantity = (delta, index) => {
  const newQuantity = (mrfForm.value.items[index].quantity ?? 0) + delta;
  if (newQuantity < 1) return; // Prevent quantity from going below 1

  mrfForm.value.items[index].quantity = newQuantity;
};
const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};
const generateItemField = async () => {
  let item_data = {
    item_id: 0,
    item_name: "",
    quantity: 0,
    quantity_per_unit: 0,
    sub_quantity: 0,
    description: "",
    remarks: "",
    room_location_number: 0,
    /* other charge properties */
  };

  // Assuming salesForm.charges is an array
  mrfForm.value.items.push(item_data);
};
const removeItemField = (index) => {
  // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
  mrfForm.value.items.splice(index, 1);
};
const handleItemImageUpload = (event, index) => {
  const files = event.target.files;
  if (files.length > 0) {
    // Add the files to the specific item in the form
    mrfForm.value.items[index].item_images = [...files];
  }
};
// Watch for screen size changes
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};
watch(() => window.innerWidth, handleResize);
onMounted(() => {
  window.addEventListener("resize", handleResize);
});
</script>
<style scoped>
.cart-container {
  max-width: 500px;
}

.cart-content {
  max-height: calc(100vh - 160px); /* Adjust based on header/footer height */
}

.cart-items {
  padding-right: 16px; /* To handle scrollbar width */
}

.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.cart-item img {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.cart-item h3 {
  margin: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
}

.quantity-display {
  min-width: 2rem;
  text-align: center;
}
</style>
