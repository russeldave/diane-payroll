<template>
    <button
        @click="(isEditModalOpen = true), editMRFBehavior()"
        class="bg-yellow-500 hover:opacity-70 focus:bg-yellow-300 text-white font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
    >
        <i class="fas fa-file-invoice"></i>
        Edit MRF
    </button>
    <Modal :show="isEditModalOpen" :maxWidth="'6xl'">
      <button
        class="flex float-end bg-gray-100 p-3"
        @click.prevent="isEditModalOpen = false"
      >
        <i class="fa fa-times text-black-600"></i>
      </button>
      <div class="grid grid-cols-1 gap-6 p-6">
        <h2 class="text-lg font-semibold text-gray-800">Edit MRF</h2>
        <form class="mt-4" @submit.prevent="editMRF()">
          <div class="grid grid-cols-2 gap-6">
              <div class="mb-4">
                  <label
                    for="LeagueName"
                    class="block text-sm font-medium text-gray-700"
                    >MRF No.</label
                  >
                  <!-- building_id,contact_info,address,geo_map,remarks. -->
                  <input
                    type="text"
                    id="ProductName"
                    v-model="mrfForm.mrf_manual_number"
                    placeholder="Input MRF Number"
                    class="mt-1 p-2 border rounded-md w-full"
                  />
                </div>
                <div class="mb-4">
                  <label
                    for="LeagueName"
                    class="block text-sm font-medium text-gray-700"
                    >Company</label
                  >
                  <select
                  placeholder="Select Building Name"
                  class="mt-1 p-2 border rounded-md w-full"
                  v-model="mrfForm.our_company_id"
                  >
                  <option value="0">--Select Company--</option>
                  <option v-for="(b,bb) in companies" :key="b.value" :value="b.value">{{ b.label }}</option>
                  </select>
                </div>
          </div>
          <div class="mb-4">
              <label
                  for="LeagueName"
                  class="block text-sm font-medium mb-3 text-gray-700"
                  >Items:</label
              >
              <button
                  @click.prevent="generateItemField()"
                  class="px-4 py-2 font-bold hover:bg-blue-500 bg-blue-600 mb-2 rounded shadow text-white text-md float-right"
              >
                  <i class="fa fa-plus"></i> Add Billing Row
              </button>
              <table class="min-w-full divide-y divide-gray-200">
                  <!-- Table headers -->
                  <thead class="bg-gray-100 shadow">
                    <tr class="border-b-2 border-solid border-yellow-500">
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Remarks
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <!-- Loop through products and display them -->
                    <tr v-for="(i,ii) in mrfForm.items" v-if="mrfForm.items.length > 0" :key="ii">
                      <td class="px-2 py-2 border">
                          <!-- <select
                          placeholder="Select Building Name"
                          class="mt-1 p-2 border rounded-md w-full"
                          v-model="i.item_id"
                          >
                          <option value="0">--Select Item--</option>
                          <option v-for="(i,ii) in items" :key="i.value" :value="i.value">{{ i.label }}</option>
                          </select> -->
                          <!-- <div class="flex items-center mt-1">
                            <input
                                type="text"
                                placeholder="Input Guest Name"
                                v-model="guest.guest_name"
                                @input.prevent="
                                    activeGuestIndex = gg
                                "
                                @keyup.prevent="
                                    (search.search =
                                        guest.guest_name),
                                        listGuests()
                                "
                                required
                                class="py-2 w-full rounded-l"
                            />
                            <button
                                type="button"
                                @click.prevent="clearGuestForm(gg)"
                                title="Clear Form"
                                class="btn-sm text-nowrap rounded-r text-sm bg-red-600 hover:bg-red-900 py-3 px-2 text-white"
                            >
                                <i class="fa fa-times"></i> Clear
                            </button>
                        </div> -->
                        <!-- <div
                        class="absolute bg-white shadow z-50"
                              v-if="search.search != ''"
                          >
                              <ul class="">
                                  <li
                                      class="p-1 border-l-2 border-lime-200 flex py-2 font-bold shadow text-gray-600"
                                      @click.prevent="
                                          fillGuestForm(gs, gg),
                                              (search.search = ''),
                                              (guests.guests = [])
                                      "
                                      v-if="
                                          guests.guests &&
                                          activeGuestIndex == gg
                                      "
                                      v-for="(
                                          gs, ggg
                                      ) in guests.guests"
                                      :key="ggg"
                                  >
                                      {{ gs.fullName }} -
                                      {{ gs.email }}
                                  </li>
                              </ul>
                          </div> -->
                      </td>
                      <td class="px-2 py-2 border">
                          <textarea
                              v-model="i.description"
                              placeholder="Input Item Description"
                              class="mt-1 p-2 border rounded-md w-full"
                          ></textarea>
                      </td>
                      <td class="px-2 py-2 border">
                          <input
                              type="number"
                              id="ProductName"
                              v-model="mrfForm.quantity"
                              placeholder="Input Item Quantity"
                              class="mt-1 p-2 border rounded-md w-full"
                          />
                      </td>
                      <td class="px-2 py-2 border">
                          <textarea
                              v-model="i.remarks"
                              placeholder="Input Item Remarks"
                              class="mt-1 p-2 border rounded-md w-full"
                          ></textarea>
                      </td>
                      <td class="px-2 py-2 border">
                        <div class="flex justify-start">
                          <button
                            @click="removeItemField(ii)"
                            class="bg-red-500 text-white rounded font-bold rounded-r text-md md:text-lg py-2 px-4 mb-4 float-end text-nowrap"
                          >
                            <i class="fas fa-trash"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-else>
                      <td class="px-2 py-2 border" colspan="5">
                          <p class="text-red-500 font-bold text-center">**No items found**</p>
                      </td>
                    </tr>
                    <!-- item_id: 0,
                    item_name: '',
                    quantity: 0,
                    description: '',
                    remarks: '',
                    room_location_number: 0, -->
                  </tbody>
              </table>
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
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import Swal from "sweetalert2";
  import axios from "axios";
  import Modal from "@/views/Component/Modal.vue";
  import Paginator from "@/views/Component/Pagination.vue";
  import { VUE_APP_API_URL,DATE_NOW,COMPANIES } from "@/views/Utility/Global";
  import {
    FormDx,
    BearToken,
    Alert,
    replaceUnderScore,
    handleApiError
  } from "@/views/Utility/Helper";
  
  const token = localStorage.getItem("token");
  const isEditModalOpen = ref(false);
  //emits
  const emits = defineEmits(["transaction_id"]);
  const props = defineProps({
    data: Object,
   });
   const deleteMRF = async (data) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this building. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show the processing alert
      Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      // Proceed with deletion using Axios
      const formData = FormDx({ mrf_id: props.data.id });
      const response = await axios.post(
        `${VUE_APP_API_URL}mrfs/delete`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Swal.close();
      Alert("warning", "Deleted!", response.data.message);
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
  </script>
  