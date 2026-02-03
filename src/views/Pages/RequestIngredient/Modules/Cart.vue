<template>
  <div class="cart-container p-1 bg-white max-h-full w-full max-sm:w-[350px]">
    <div class="flex items-center justify-between w-full mb-4 border-b-2 border-gray-500">
      <div class="space-x-2">
        <input
          type="checkbox"
          :checked="allSelected"
          @change="toggleSelectAll"
          class="ml-2"
        />
        <label class="font-bold text-red-500">Select All</label>
      </div>
    </div>
    <!-- Scrollable items -->
    <div class="block bg-white">
      <div class="block w-full h-[680px] p-2 rounded overflow-auto">
        <div v-if="items?.length > 0 && !loading" class="cart-items">
          <div
            v-for="(item, ii) in items"
            :key="item.id"
            class="cart-item flex items-center border-b pb-4 mb-4"
          >
            <!-- Select Item Checkbox -->
            <input
              type="checkbox"
              v-model="item.selected"
              @change="updateSelectedItems"
              class="lg:mr-4"
            />
            <div class="ml-4 flex-1">
              <div class="w-36 h-36 lg:w-48 lg:h-48">
                <ItemImageViewer
                  v-if="item.itemId"
                  :item_id="item.itemId"
                  :thumbnail="item.thumbNail"
                  :canDeleteImage="false"
                />
              </div>
            </div>
           <div class="ml-4 flex-1">
                <h3 class="text-sm lg:text-md uppercase font-semibold" :title="item.name">
                  {{ truncateText(item.ingredientCompleteName ?? "No Item", 40) }}
                </h3>
                <!-- <p class="text-xs lg:text-sm text-gray-700">Units: {{ item.unitAbbre }}</p> -->
                <hr class="mt-4" />
              <div class="flex items-center mt-2 space-x-3">
 
            <button
              @click.prevent="changeQuantity(ii, -1, item.id)"
              title="Reduce Quantity"
              class="text-red-500 hover:text-red-700 text-xl focus:outline-none rounded-full bg-red-200 px-2 py-1"
            >
              <i class="fas fa-minus"></i>
            </button>

            <div class="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm">
              <div class="relative flex items-center">
                <input
                  type="text"
                  v-model="item.quantity" 
                  @input="typeInput(ii, item.id)"
                  @focus="item.showArrows = true"
                  @blur="item.showArrows = false"
                  class="w-24 px-3 py-2 text-sm font-semibold text-center text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400 pr-6"
                />

                <div
                  v-if="item.showArrows"
                  class="absolute right-0 top-0 bottom-0 flex flex-col justify-center items-center bg-white"
                >
                  <button
                    @click.prevent="changeQuantity(ii, 1, item.id)"
                    class="text-gray-500 hover:text-blue-600 text-[15px] leading-none"
                    title="Increase"
                  >
                    <i class="fas fa-caret-up"></i>
                  </button>
                  <button
                    @click.prevent="changeQuantity(ii, -1, item.id)"
                    class="text-gray-500 hover:text-red-600 text-[15px] leading-none mt-[1px]"
                    title="Decrease"
                  >
                    <i class="fas fa-caret-down"></i>
                  </button>
                </div>
              </div>

              <span class="px-3 py-2 bg-orange-600 text-white text-sm font-semibold">
                {{ item.unitAbbre }}
              </span>
            </div>

            <button
              @click.prevent="changeQuantity(ii, 1, item.id)"
              title="Add Quantity"
              class="text-blue-500 hover:text-blue-700 text-xl focus:outline-none rounded-full bg-blue-200 px-2 py-1"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>

           </div>
            <button
              @click.prevent="removeFromCart(item)"
              type="button"
              title="Remove Item"
              class="text-red-500 bg-red-200 hover:text-red-700 focus:outline-none ml-4 border-2 shadow-black hover:bg-red-100 p-2 rounded-full"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
        <div v-if="items?.length == 0 && !loading" class="text-center text-gray-600 mt-4">
          <p>No items in the cart</p>
        </div>
        <div v-if="loading" class="min-h-screen">
          <Loader />
        </div>
      </div>
      <div class="flex items-center bg-white justify-between border-t-2 pt-4">
        <RequestCart
          v-if="hasPermission('MRF_Request_Items_Button')"
          :data="cartItems"
          :warehouse_id="warehouse_id"
          :key="updatekey"
          @transaction_id="handleTransaction"
        />
        <!-- <TransferCart
          v-if="hasPermission('MRF_Transfer_Items_Button')"
          :data="cartItems"
          :warehouse_id="warehouse_id"
          :key="updatekey"
          @transaction_id="handleTransaction"
        /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, onMounted } from "vue";
import axios from "axios";
import {
  truncateText,
  Alert,
  FormDx,
  BearToken,
  handleApiError,
  useDebounce,
} from "@/views/Utility/Helper";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { hasPermission } from "@/views/Utility/Permissions";
import Loader from "@/views/Component/Loader.vue";
import Swal from "sweetalert2";
// Components
import RequestCart from "./RequestCart.vue";
import TransferCart from "./TransferCart.vue";
import ItemImageViewer from "./ItemImageViewer.vue";
// Define props

const items = ref([]);
const updatekey = ref(0);
const token = localStorage.getItem("token");
const warehouse_id = ref(parseFloat(localStorage.getItem("defaultWarehouse") || 0));
const allSelected = ref(false);
const loading = ref(false);
const cartItems = ref([]); // Array to hold selected items
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px

const toggleSelectAll = (event) => {
  const isSelected = event.target.checked;
  items.value.forEach((item) => (item.selected = isSelected));
  allSelected.value = isSelected;
  updateCartItems(); // Update cartItems when all items are selected/deselected
};
const toggleSelectAllAuto = (event) => {
  const isSelected = true;
  items.value.forEach((item) => (item.selected = isSelected));
  allSelected.value = true;
  updateCartItems(); // Update cartItems when all items are selected/deselected
};
const handleTransaction = (transaction_id) => {
  // Logic for handling transactions
  getCartItems();
};
const changeQuantity = async (index, delta, cartId) => {
  const newQuantity = (items.value[index].quantity ?? 0) + delta;
  if (newQuantity < 1) return; // Prevent quantity from going below 1

  items.value[index].quantity = newQuantity;
  updateCartItems(); // Update cartItems after removing an item
  updatekey.value = Math.random();

    const formData = FormDx({
      user_cart_id: cartId,
      quantity: newQuantity,
    });

     const response = await axios.post(
      `${VUE_APP_API_URL}user-carts/update-quantity`,
      formData,
      BearToken(token)
    );
};

const typeInput = useDebounce(async (index,cartId) => {
  // console.log("debounce");
  // console.log(cartId);
  await typeQuantity(index,cartId);
}, 300);


const typeQuantity = async (index,cartId) =>{
  try {
      const formData = FormDx({
      user_cart_id: cartId,
      quantity: items.value[index].quantity ?? 0,
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}user-carts/update-quantity`,
      formData,
      BearToken(token)
    );
  } catch (error) {
    console.log(error.response.data.message)
    Swal.fire("Error", error.response.data.message, "error");
  }


}

const updateSelectedItems = () => {
  const selectedCount = items.value.filter((item) => item.selected).length;
  allSelected.value = selectedCount === items.value.length;
  updateCartItems(); // Update cartItems whenever selection changes
};

const getCartItems = async () => {
  try {
    loading.value = true;
    const formData = FormDx({ item_id: 0 });
    const response = await axios.post(
      `${VUE_APP_API_URL}user-carts/list-per-user`,
      formData,
      BearToken(token)
    );
    if (response && !response.error) {
      items.value = response.data?.cartItems;
      // console.log('Success in getCartItems');
      // console.log (response.data.cartItems)
      loading.value = false;
      toggleSelectAllAuto();
    }
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};

const removeFromCart = async (item) => {
  // Show confirmation dialog using SweetAlert2
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, remove it!",
  });

  if (!result.isConfirmed) {
    return; // Exit if the user cancels
  }

  try {
    // Show the processing alert
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx({ cart_item_id: item.id });
    const response = await axios.post(
      `${VUE_APP_API_URL}user-carts/delete`,
      formData,
      BearToken(token)
    );
    Swal.close();
    if (response && !response.error) {
      items.value = response.data.cartItems;
      Alert("success", "Success!", response.data.message);
      getCartItems();
      updateCartItems(); // Update cartItems after removing an item
    }
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
// Update cartItems based on selected items
const updateCartItems = () => {
  cartItems.value = items.value?.filter((item) => item.selected)
    .map((item) => ({
      cart_id: item.id,
      item_id: item.itemId,
      item_name: item.name,
      quantity: item.quantity || 0,
      unit_abbre: item.unitAbbre,
      is_auto_unpack: false,
      unpack_ingredient_name: item.unpackIngredientName ?? "",
      unpack_ingredient_id: item.unpackIngredientId ?? 0,
      unpack_ingredient_unit: item.unpackIngredientUnitAbbre ?? "",
      unpack_ingredient_quantity: item.unpackQuantity ?? 0,
      unit_id: item.unitId,
      thumb_nail: item.thumbNail,
      item_images: item.item_images || [],
      selected: true,
      item_number: item.itemNumber,
      item_complete_name: item.itemNumber+' - '+item.name+' ['+item.unitAbbre+']'
    }));
  // console.log('updateCartItems');
  // console.log(cartItems.value);

  updatekey.value = Math.random();
};

const addToCartItem = async (item) => {
  if (quantity.value <= 0 || isLoading.value) return;

  try {
    isLoading.value = true;
    const formData = FormDx({
      ingredient_id: item.id,
      quantity: quantity.value,
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}user-carts/add`,
      formData,
      BearToken(token)
    );

    if (response && !response.error) {
      Swal.fire("Success", response.data.message, "success");
      emits("transaction_id", Math.random());
    }
  } catch (error) {
    console.error("Add to Cart Error:", error);
    Swal.fire("Error", "Something went wrong.", "error");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getCartItems(); // Initial fetch
});
</script>

<style scoped>
.cart-container {
}

.cart-content {
  max-height: calc(100vh - 240px); /* Adjust based on header/footer height */
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
