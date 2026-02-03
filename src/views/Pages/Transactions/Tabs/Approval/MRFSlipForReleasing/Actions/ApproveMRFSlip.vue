<template>
  <button
    @click="(isAddModalOpen = true), fillForm()"
    class="bg-green-500 hover:opacity-70 focus:bg-green-300 text-white font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-thumbs-up"></i>
    Approve
  </button>
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="Approve MRF SLip"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6 overflow-auto">
      <form class="mt-4" @submit.prevent="editMRF">
        <div class="flex items-center justify-center">
          <span 
         v-if="mrf?.forStocking  === 1"
          class="text-4xl font-extrabold text-orange-600 tracking-widest drop-shadow-md">
            FOR PR
          </span>
        <div v-else class="h-10"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF Manual No. <span class="italic text-red-500">(optional)</span></label
            >
            <input
              type="text"
              id="ProductName"
              v-model="mrfForm.mrf_manual_number"
              placeholder="Input MRF Manual Number"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div> -->
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Estimted Date Arrival</label
            >
            <input
              type="date"
              id="ProductName"
              v-model="mrfForm.estimated_arrival"
              placeholder="Input MRF Manual Number"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <!-- <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Our Company</label
            >
            <select
              placeholder="Select Building Name"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              v-model="mrfForm.our_company_id"
            >
              <option value="0">--Select Company--</option>
              <option
                v-for="(b, bb) in companies"
                :key="b.value"
                :value="b.value"
              >
                {{ b.label }}
              </option>
            </select>
          </div> -->
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Requested From</label
            >
            <div class="flex items-center mt-1">
              <input
                type="text"
                placeholder="Input Requester"
                v-model="mrfForm.employee_name"
                disabled
                @input.prevent="searchUserBehavior(mrfForm.employee_name)"
                required
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              />
            </div>
            <div
              class="absolute bg-white shadow z-50"
              v-if="searchUser.search != ''"
            >
              <ul class="">
                <li
                  class="p-1 border-l-2 border-lime-200 flex py-2 font-bold shadow text-gray-600"
                  @click.prevent="fillUserForm(user)"
                  v-for="(user, index) in users"
                  :key="index"
                >
                  {{ user.employeeNumber }} - {{ user.firstName }}
                  {{ user.middleName }} {{ user.lastName }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mb-4 overflow-auto border-b-2">
          <!-- <h5 class="text-lg font-bold mb-4 mt-4 text-red-600 uppercase">Items:</h5> -->
          <!-- <button
            @click.prevent="generateItemField()"
            type="button"
            class="px-4 py-2 font-bold hover:bg-blue-500 bg-blue-600 mb-2 rounded shadow text-white text-md float-right"
          >
            <i class="fa fa-plus"></i> Add Item
          </button> -->
        </div>
        <!-- Mobile view: Form-like layout -->
        <div class="flex w-full overflow-auto p-2" v-if="isMobile">
          <div v-if="isMobile" class="block lg:hidden">
            <div
              v-for="(i, ii) in mrfForm.items"
              v-if="mrfForm.items.length > 0"
              :key="ii"
              class="border-2 p-4 rounded border-black"
            >
              <!-- Item Dropdown -->
              <div class="mb-2">
                <label
                  for="itemsName"
                  :class="
                    i.mrf_item_id == 0
                      ? 'text-green-500 hover:text-lime-50'
                      : 'text-red-500 hover:text-red-50'
                  "
                  class="block text-sm font-medium  mb-1"
                  >Item</label
                >
                <SearchDropdown
                  v-if="i.mrf_item_id == 0"
                  apiEndpoint="items/list"
                  :searchModel="search"
                  placeholder="Search Items"
                  itemLabel="name"
                  itemId="id"
                  inputId="itemsName"
                  :defaultValue="i.item_name"
                  @item-selected="(item) => fillItemsForm(item, ii)"
                  dataKey="items"
                  returnName="['sku','name']"
                />
                <p class="p-2 border rounded-l-md w-full">{{ i.item_name }}</p>
              </div>
              <!-- Item -->
              <div class="mb-2">
                <label
                  for="proof"
                  class="block text-sm font-medium text-gray-700 mb-1"sa
                  >Image</label
                >
                <div class="flex">
                  <ItemImageViewer v-if="i.item_id" :item_id="i.item_id" :thumbnail="i.thumb_nail" :canDeleteImage="false"/>
                </div>
              </div>
              <!-- Brand -->
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Brand</label
                >
                <div class="p-2 border rounded-l-md w-full">
                  {{
                    i.brand_id == 0 || i.brand_id == null
                      ? "No Brand"
                      : `${i.brand_name} (${i.brand_abbre})`
                  }}
                </div>
              </div>

              <!-- Quantity and Units -->
              <div class="mb-2">
                <label
                  for="quantity"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Quantity</label
                >
                <div class="flex">
                  <input
                    type="number"
                    id="ProductName"
                    v-model="i.quantity"
                    autocomplete="off"
                    min="1"
                    placeholder="Input Item Quantity"
                    class="mt-1 p-2 border rounded-l-md w-full"
                  />
                  <button
                    type="button"
                    class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                  >
                    {{ i.unit_abbre ?? "-" }}
                  </button>
                </div>
              </div>
              <!-- Quantity and Units -->
              <div class="mb-2">
                <label
                  for="quantity"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >PR'ed Quantity</label
                >
                <div class="flex">
                  <input
                    type="number"
                    id="ProductName"
                    v-model="i.quantity"
                    autocomplete="off"
                    min="1"
                    placeholder="Input Item Quantity"
                    class="mt-1 p-2 border rounded-l-md w-full"
                  />
                  <button
                    type="button"
                    class="border border-l-0 rounded-r-md px-3 bg-green-500 text-white hover:bg-gray-300"
                  >
                    {{ i.unit_abbre ?? "-" }}
                  </button>
                </div>
              </div>
              <!-- Quantity and Units -->
              <div class="mb-2">
                <label
                  for="quantity"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Released Quantity</label
                >
                <div class="flex">
                  <input
                    type="number"
                    id="ProductName"
                    v-model="i.quantity"
                    autocomplete="off"
                    min="1"
                    placeholder="Input Item Quantity"
                    class="mt-1 p-2 border rounded-l-md w-full"
                  />
                  <button
                    type="button"
                    class="border border-l-0 rounded-r-md px-3 bg-lime-500 text-white hover:bg-gray-300"
                  >
                    {{ i.unit_abbre ?? "-" }}
                  </button>
                </div>
              </div>
              <!-- Quantity per Unit -->
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Quantity per Unit</label
                >
                <div
                  class="mt-1 p-2 border rounded-l-md w-full"
                  v-if="i.item_id != 0"
                >
                  {{ i.quantity_per_unit }} /{{ i.unit_abbre }}
                </div>
                <div
                  class="mt-1 p-2 border rounded-l-md w-full text-red-500"
                  v-else
                >
                  Please select Item!
                </div>
              </div>

              <!-- Location -->
              <div class="mb-2">
                <label
                  for="locationName"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Location</label
                >
                <SearchDropdown
                  v-if="i.mrf_item_id == 0"
                  apiEndpoint="mrfs/rooms-warehouses-list"
                  :searchModel="searchLocation"
                  placeholder="Search Location"
                  itemLabel="name"
                  itemId="id"
                  inputId="locationName"
                  :defaultValue="i.room_location_name"
                  @item-selected="(item) => fillLocationForm(item, ii)"
                  dataKey="roomsWarehouses"
                  returnName="['sku','name']"
                />
                <p class="p-2 border rounded-l-md w-full" v-else>
                  {{ i.room_location_name }}
                </p>
              </div>

              <!-- Proof -->
              <div class="mb-2">
                <label
                  for="proof"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Proof</label
                >
                <div class="flex">
                  <ProofImageViewer
                    v-if="i.mrf_item_id"
                    :mrf_id="i.mrf_item_id"
                    :thumbnail="i.thumbnail ?? false"
                    :canDeleteImage="false"
                  />
                  <input
                    v-else
                    type="file"
                    class="mt-1 p-2 border rounded-md w-full"
                    id="proof"
                    multiple
                    accept="image/*"
                    @change="(event) => handleItemImageUpload(event, ii)"
                  />
                </div>
              </div>
              <!-- Remarks -->
              <div class="mb-2">
                <label
                  for="remarks"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Remarks</label
                >
                <textarea
                  v-model="i.remarks"
                  placeholder="Input Item Remarks"
                  class="mt-1 p-2 border rounded-md w-full"
                  :disabled="i.mrf_item_id != 0"
                  :class="i.mrf_item_id != 0 ? 'bg-gray-200' : ''"
                  id="remarks"
                ></textarea>
              </div>

              <!-- Remove Item Button -->
              <div class="flex justify-center">
                <!-- <AddMRFItem
                  v-if="
                    hasPermission('MRF_Slip_Add_Item_Button') &&
                    i.mrf_item_id == 0
                  "
                  :data="i"
                  @transaction_id="handleTransaction()"
                /> -->
                <DeleteMRFItem
                  v-if="
                    hasPermission('MRF_Slip_Delete_Item_Button') &&
                    i.mrf_item_id != 0
                  "
                  :data="i"
                  @transaction_id="handleTransaction()"
                />
                <!-- <button
                  v-else
                  @click.prevent="removeItemField(ii)"
                  type="button"
                  title="Remove Item"
                  class="bg-red-500 text-white font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
                >
                  <i class="fas fa-trash"></i>
                  Delete
                </button> -->
              </div>
            </div>
          </div>
          <p
            v-if="mrfForm.items.length === 0"
            class="text-red-500 font-bold text-center"
          >
            **No items found**
          </p>
        </div>
        <!-- Desktop view: Table layout -->
        <div class="mb-4 overflow-x-auto relative">
          <div class="align-middle inline-block min-w-full">
            <div class="overflow-hidden shadow-sm">
              <table class="min-w-full divide-y divide-gray-200 table-auto">
                <!-- Keep existing thead but add these classes -->
                <thead class="border-b border-yellow-500 text-white shadow sticky top-0 z-10" 
                      :class="DEFAULT_BG">
                  <!-- Keep existing tr and th content but add these classes to th -->
                  <tr class="text-md whitespace-nowrap">
                    <th scope="col" 
                        class="px-3 py-3 text-center border text-md font-medium uppercase tracking-wider sticky left-0 z-20"
                        :class="DEFAULT_BG">
                      Item
                    </th>
                    <th
                      scope="col"
                      class="px-2 py-3 text-center border text-md font-medium uppercase tracking-wider"
                    >
                      Item Image
                    </th>
                    <!-- <th
                      scope="col"
                      class="px-2 py-3 text-left border text-md font-medium uppercase tracking-wider"
                    >
                      Brand
                    </th> -->
                    <th
                      scope="col"
                      class="px-2 py-3 text-center border text-md font-medium uppercase"
                    >
                      MRF Quantity
                    </th>
                    <!-- <th
                      scope="col"
                      class="px-2 py-3 text-right border text-md font-medium tracking-wider"
                    >
                      PR'ed
                    </th> -->
                    <!-- <th
                      scope="col"
                      class="px-2 py-3 text-right border text-md font-medium uppercase"
                    >
                      Released
                    </th> -->
                    <th
                      scope="col"
                      class="px-2 py-3 text-center border text-md font-medium uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <!-- <th
                      scope="col"
                      class="px-2 py-3 text-left border text-md font-medium uppercase tracking-wider"
                    >
                      Proof
                    </th> -->
                    <th
                      scope="col"
                      class="px-2 py-3 text-center border text-md font-medium uppercase tracking-wider"
                    >
                      Remark
                    </th>
                    <th
                      scope="col"
                      class="px-2 py-3 text-center border text-md font-medium uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <!-- Keep existing tbody but add these classes -->
                <tbody class="bg-white divide-y divide-gray-200">
                  <!-- Add these classes to td elements -->
                  <tr v-for="(i, ii) in mrfForm.items" 
                      v-if="mrfForm.items.length > 0"
                      :key="ii"
                      class="hover:bg-gray-50 whitespace-nowrap"
                      :class="i.mrf_item_id == 0 ? 'bg-lime-200' : 'bg-red-200'">
                      <td class="px-3 py-3 border sticky left-0"
                          :class="i.mrf_item_id == 0 ? 'bg-lime-200' : 'bg-red-200'">
                          <SearchDropdown
                            v-if="i.mrf_item_id == 0"
                            apiEndpoint="items/list"
                            :searchModel="search"
                            placeholder="Search Items"
                            itemLabel="name"
                            itemId="id"
                            inputId="itemsName"
                            :defaultValue="i.item_name"
                            @item-selected="(item) => fillItemsForm(item, ii)"
                            dataKey="items"
                            returnName="['sku','name']"
                          />
                          <p v-else><span class="italic">{{ i.ingredientIdNumber }}</span> <span class="font-bold">{{ i.item_name }}</span> <sub class="italic text-red-500">[{{ i.unit_abbre ?? "-" }}]</sub></p>
                      </td>
                      <td class="px-2 py-1 border text-center">
                        <div class="w-20 h-20 mx-auto">
                          <ItemImageViewer 
                            v-if="i.item_id"
                            :ingredient_id_number="i.ingredientIdNumber"
                            :thumbnail="i.thumb_nail"
                            :canDeleteImage="false"
                          />
                        </div>
                      </td>
                    <!-- <td class="px-2 py-3 border">
                      <select
                              placeholder="Select Building Name"
                              class="mt-1 p-2 border rounded-md w-full"
                              v-model="i.item_id"
                              >
                              <option value="0">--Select Item--</option>
                              <option v-for="(i,ii) in items" :key="i.value" :value="i.value">{{ i.label }}</option>
                              </select>
                      <div class="mt-1 p-2 border rounded-l-md w-full">
                        {{
                          i.brand_id == 0 || i.brand_id == null
                            ? "No Brand"
                            : `${i.brand_name} (${i.brand_abbre})`
                        }}
                      </div>
                    </td> -->
                    <td class="px-2 py-3 border">
                      <div class="flex justify-center text-lg font-bold">
                        {{ Number(i.quantity).toLocaleString() }}  <span class="text-red-500 italic">{{  i.unit_abbre ?? "-"  }}</span>
                        
                        <!-- <input
                          type="number"
                          id="ProductName"
                          v-model="i.quantity"
                          autocomplete="off"
                          min="1"
                          placeholder="Input Item Quantity"
                          :disabled="i.mrf_item_id != 0"
                          :class="i.mrf_item_id != 0 ? 'bg-gray-200' : ''"
                          class="mt-1 p-2 border rounded-l-md"
                        />
                        <button
                          type="button"
                          class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                        >
                          {{ i.unit_abbre ?? "-" }}
                        </button> -->
                      </div>
                    </td>
                    <!-- <td
                      class="px-2 py-3 border text-right hover:bg-green-200 border-white bg-green-500"
                    >
                      <div class="flex">
                        <input
                          type="number"
                          id="ProductName"
                          v-model="i.pr_quantity"
                          autocomplete="off"
                          min="1"
                          placeholder="Input Item Quantity"
                          disabled
                          class="mt-1 p-2 border rounded-l-md bg-gray-200"
                        />
                        <button
                          type="button"
                          class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                        >
                          {{ i.unit_abbre ?? "-" }}
                        </button>
                      </div>
                    </td> -->
                    <!-- <td
                      class="px-2 py-3 border text-right hover:bg-green-200 border-white bg-lime-500"
                    >
                      <div class="flex">
                        {{ i.released_quantity }} {{  i.unit_abbre ?? "-"  }}
                        <input
                          type="number"
                          id="ProductName"
                          v-model="i.released_quantity"
                          autocomplete="off"
                          min="1"
                          placeholder="Input Item Quantity"
                          disabled
                          class="mt-1 p-2 border rounded-l-md bg-gray-200"
                        />
                        <button
                          type="button"
                          class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                        >
                          {{ i.unit_abbre ?? "-" }}
                        </button>
                      </div>
                    </td> -->
                    <td class="px-2 py-3 border">
                      <SearchDropdown
                        v-if="i.mrf_item_id == 0"
                        apiEndpoint="mrfs/rooms-warehouses-list"
                        :searchModel="searchLocation"
                        placeholder="Search Location"
                        itemLabel="name"
                        itemId="id"
                        inputId="locationName"
                        :defaultValue="i.room_location_name"
                        @item-selected="(item) => fillLocationForm(item, ii)"
                        dataKey="roomsWarehouses"
                        returnName="['sku','name']"
                      />
                      <p v-else>{{ i.room_location_name }}</p>
                    </td>
                    <!-- <td class="px-2 py-3 border">
                      <ProofImageViewer
                        v-if="i.mrf_item_id"
                        :mrf_id="i.mrf_item_id"
                        :thumbnail="i.proof ?? false"
                        :canDeleteImage="false"
                      />
                      <input
                        v-else
                        type="file"
                        class="mt-1 p-2 border rounded-md w-full"
                        id="proof"
                        multiple
                        accept="image/*"
                        @change="(event) => handleItemImageUpload(event, ii)"
                      />
                    </td> -->
                    <td class="px-2 py-3 border">
                      <textarea
                        v-model="i.remarks"
                        placeholder="Input Item Remarks"
                        :disabled="i.mrf_item_id != 0"
                        :class="i.mrf_item_id != 0 ? 'bg-gray-200' : ''"
                        class="mt-1 p-2 border rounded-md w-full"
                      ></textarea>
                    </td>
                    <td class="px-2 py-3 border">
                      <div class="flex justify-center">
                        <AddMRFItem
                          v-if="
                            hasPermission('MRF_Slip_Add_Item_Button') &&
                            i.mrf_item_id == 0
                          "
                          :data="i"
                          @transaction_id="handleTransaction()"
                        />

                        <AssignWarehouse
                          v-if="hasPermission('Assign_Ingredient_Warehouse_Button')"
                          :data="i"
                          :unpack="false"
                          @transaction_id="handleTransaction"
                        />

                        <DeleteMRFItem
                          v-if="
                            hasPermission('MRF_Slip_Delete_Item_Button') &&
                            i.mrf_item_id != 0
                          "
                          :data="i"
                          @transaction_id="handleTransaction()"
                        />
                        <button
                          v-else
                          @click.prevent="removeItemField(ii)"
                          type="button"
                          title="Remove Item"
                          class="bg-red-500 text-white font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
                        >
                          <i class="fas fa-trash"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="mrfForm.items.length == 0">
                    <td class="px-2 py-3 border" colspan="6">
                      <p class="text-red-500 font-bold text-center">
                        **No items found**
                      </p>
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
          </div>
        </div>
        <div class="mb-4" v-if="false">
          <label
            for="itemImages"
            class="block text-sm font-medium text-gray-700"
            >Upload Proof</label
          >
          <input
            type="file"
            id="itemImages"
            @change="handleImageUpload"
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
            placeholder="Input MRF Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>
        <div class="flex justify-between border-t-2 py-3 px-1">
          <DisapproveMRF
            v-if="
              hasPermission('MRF_Slip_Disapprove_Button')
            "
            :mrf_id="mrfForm.mrf_id"
            @transaction_id="handleTransaction()"
          />
          <ApproveMRF
            v-if="
              hasPermission('MRF_Slip_Approve_Button')
            "
            :mrf_id="mrfForm.mrf_id"
            @transaction_id="handleTransaction()"
          />
        </div>
      </form>
    </div>
  </Modal>
  <Modal :show="isBrandModalOpen" :maxWidth="'md'">
    <div class="flex justify-between p-6">
      <h2 class="text-lg font-semibold text-gray-800">Brand List</h2>
      <button
        class="flex float-end bg-gray-100 p-3"
        @click.prevent="isBrandModalOpen = false"
      >
        <i class="fa fa-times text-black-600"></i>
      </button>
    </div>
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
              <td
                class="px-2 py-3 border text-center text-red-500 font-bold"
                colspan="5"
              >
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
import { onMounted, ref, watch, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import {
  VUE_APP_API_URL,
  DATE_NOW,
  COMPANIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  useDebounce,
  handleApiError
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";

import ProofImageViewer from "@/views/Pages/Items/Actions/ProofImageViewer.vue";
import ItemImageViewer from "@/views/Pages/Items/Actions/ItemImageViewer.vue";

import DeleteMRFItem from "./DeleteMRFItem.vue";
import DisapproveMRF from "./DisapproveMRF.vue";
import ApproveMRF from "./ApproveMRF.vue";
import AddMRFItem from "./AddMRFItem.vue";
import AssignWarehouse from "../../../Requested/Pending/Actions/AssignWarehouse.vue";
const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
  mrf_id: Number,
  warehouse_id: Number,
});
const isAddModalOpen = ref(false);
const isBrandModalOpen = ref(false);
const companies = ref([]);
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const users = ref([]);
const data = ref([]);
const imageFiles = ref([]);
const mrfForm = ref({
  mrf_id: 0,
  date_now: DATE_NOW(),
  our_company_id: 0,
  remarks: "",
  mrf_manual_number: "",
  employee_id: 0,
  employee_name: "",
  mrf_type: 1,
  proof_images: [],
  estimated_arrival: '',
  items: [
    {
      item_id: 0,
      item_name: "",
      quantity: 0,
      quantity_per_unit: 0,
      sub_quantity: 0,
      description: "",
      remarks: "",
      onHandStock: 0,
      room_location_number: 0,
      item_images: [],
    },
  ],
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
const mrf = computed(() => props.data);

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchLocation = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
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

const fillForm = () => {
  resetForm();
  const data = props.data;

  console.log(data);
  mrfForm.value.mrf_id = data.id;
  mrfForm.value.date_now = data.dateOfmrf;
  mrfForm.value.our_company_id = data.ourCompanyId;
  mrfForm.value.our_company_name = data.ourCompanyName;
  mrfForm.value.remarks = data.remarks;
  mrfForm.value.mrf_manual_number = data.mrfManualNumber;
  mrfForm.value.mrf_number = data.mrfNumber;
  mrfForm.value.mrf_type = data.mrfType;
  mrfForm.value.employee_name = data.requestedByEmployeeName;
  mrfForm.value.employee_id = data.requestedByEmployeeName;
  mrfForm.value.estimated_arrival = data.estimatedArrival;

  companiesDropdown();
  listItemsPerMRF(mrfForm.value.mrf_id);
};
const listItemsPerMRF = async (id) => {
  try {
    search.value.mrf_id = id;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/get-items-per-mrf`,
      formData,
      BearToken(token)
    );

    // Transform the response data to match the required format
    mrfForm.value.items = response.data.mrfItems.map((item) => ({
      mrf_item_id: item.id || 0,
      mrf_id: item.mrfId || 0,
      item_id: item.itemId || 0,
      item_name: item.itemName || "",
      ingredientIdNumber: item.ingredientIdNumber || 0,
      thumb_nail: item.thumbNail || "",
      brand_id: item.brandId || 0,
      brand_abbre: item.brandAbbre || "",
      brand_name: item.brandName || "No Brand",
      quantity: parseFloat(item.quantity) || 0,
      pr_quantity: parseFloat(item.prQuantity) || 0,
      released_quantity: parseFloat(item.releasedQuantity) || 0,
      quantity_per_unit: item.quantityPerUnit || 0,
      onHandStock: item.onHandStock || 0,
      description: item.description || "",
      remarks: item.remarks || "",
      item_images: [], // Initialize as empty array or modify as needed
      room_location_number: item.roomLocationNumber || "",
      room_location_name:
        (item.roomLocationNumber || "") + " " + (item.locationName || ""),
      unit_abbre: item.unitAbbre,
      is_exist: true,
    }));
  } catch (error) {
    handleApiError(error);
  }
};

const handleTransaction = (transaction_id) => {
  listItemsPerMRF(mrfForm.value.mrf_id);
  emits('transaction_id',transaction_id);
};

//itemd dropdown
const fillItemsForm = (item, index) => {
  mrfForm.value.items[index].item_id = item.id;
  mrfForm.value.items[index].item_name = item.sku + "  " + item.name;
  mrfForm.value.items[index].unit_abbre = item.unitAbbre;
  mrfForm.value.items[index].unit_id = item.unitId;
  mrfForm.value.items[index].description = item.description;
  mrfForm.value.items[index].quantity_per_unit = item.quantityPerUnit;
  mrfForm.value.items[index].brand_id = item.brandId;
  mrfForm.value.items[index].brand_name = item.brandName;
  mrfForm.value.items[index].brand_abbre = item.brandAbbre;
  search.value.search = "";
};
//location dropdown
const fillLocationForm = (item, index) => {
  const buildingAbbre = item.buildingAbbre ? `(${item.buildingAbbre})` : "";
  mrfForm.value.items[index].room_location_number = item.sku;
  mrfForm.value.items[index].room_location_name =
    item.roomLocationNumber + "-" + item.name + " " + buildingAbbre;

  searchLocation.value.search = "";
};

const handleItemImageUpload = (event, index) => {
  const files = event.target.files;
  if (files.length > 0) {
    // Add the files to the specific item in the form
    mrfForm.value.items[index].item_images = [...files];
  }
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
const resetForm = () => {
  mrfForm.value.mrf_id = 0;
  mrfForm.value.date_now = DATE_NOW();
  mrfForm.value.our_company_id = 0;
  mrfForm.value.remarks = "";
  mrfForm.value.mrf_manual_number = "";
  mrfForm.value.items = [
    {
      mrf_id: 0,
      mrf_item_id: 0,
      item_id: 0,
      item_name: "",
      brand_id: 0,
      quantity: 0,
      released_quantity: 0,
      pr_quantity: 0,
      quantity_per_unit: 0,
      description: "",
      remarks: "",
      item_images: [],
      room_location_number: 0,
    },
  ];

  console.log("resetted");
};

const editMRF = async () => {
  try {
    const invalidBrandItems = mrfForm.value.items.filter(
      (item) => item.brand_id === 0
    );
    const invalidLocationItems = mrfForm.value.items.filter(
      (item) => item.room_location_number === 0
    );
    
    // if (invalidBrandItems.length > 0) {
    //   // Display error for items with brand_id === 0
    //   Alert("error", "Error", "Some items have invalid Brand selections (Brand ID is 0).");
    //   return;
    // }

    if (invalidLocationItems.length > 0) {
      // Display error for items with empty room_location_number
      Alert("error", "Error", "Some items have empty Item Location.");
      return;
    }

    // Show the processing alert
    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // If no invalid items, proceed with form submission
    const formData = FormDx({
      mrf_id: mrfForm.value.mrf_id,
      mrf_manual_number: mrfForm.value.mrf_manual_number,
      remarks: mrfForm.value.remarks,
    });

    // upload item images
    mrfForm.value.items.forEach((item, index) => {
      item.item_images.forEach((file, i) => {
        formData.append(`items[${index}][item_images][${i}]`, file);
      });
    });

    // Append proof image files
    imageFiles.value.forEach((file) => {
      formData.append("proof_images[]", file); // Using array notation for multiple files
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/edit-mrf`,
      formData,
      BearToken(token)
    );

    Swal.close();
    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};
const generateItemField = async () => {
  let item_data = {
    mrf_item_id: 0,
    mrf_id: mrfForm.value.mrf_id,
    item_id: 0,
    item_name: "",
    quantity: 0,
    released_quantity: 0,
    pr_quantity: 0,
    quantity_per_unit: 0,
    sub_quantity: 0,
    description: "",
    remarks: "",
    room_location_number: 0,
    item_images: [],
    is_exist: false,
    /* other charge properties */
  };

  // Assuming salesForm.charges is an array
  mrfForm.value.items.push(item_data);
};
const removeItemField = (index) => {
  // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
  mrfForm.value.items.splice(index, 1);
};
const companiesDropdown = async () => {
  companies.value = await COMPANIES();
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
