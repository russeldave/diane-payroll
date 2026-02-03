<template>
  <div>
    <!-- Warehouse Selection -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>

          <div class="flex items-center gap-10">
            <div>          
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Select Warehouse
              </label>
              <ChangeWarehouse 
                :warehouse_name="selectedWarehouseName || 'Select Warehouse'"
                @transaction_id="handleTransaction"
                :warehouses="warehouses"
                @warehouse-changed="handleWarehouseChanged"
              />
              </div>
              <h2 class="text-blue-600 font-bold text-2xl">------></h2>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Destination</label>
              <button
                type="button"
                class="font-bold text-2xl border border-2 border-red-300 bg-red-200 rounded-md p-2"
                >
                <i class="fa-duotone fa-solid fa-warehouse"></i>
                {{ userData.warehouseName}}
              </button>
            </div>
          </div>
          <div v-if="selectedWarehouse && selectedWarehouse !== '0'" class="mt-2">
            <p class="text-sm text-blue-600">
              Current Warehouse: <span class="font-semibold">{{ selectedWarehouseName }}</span>
            </p>
          </div>
        </div>

        <button>
          {{ deviceWarehouseName }}
        </button>
        
        <!-- User Info Display -->
        <div v-if="userData" class="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p class="text-sm font-medium text-blue-800">Logged in as:</p>
          <p class="font-semibold text-blue-900">{{ userData.userName }}</p>
          <p class="text-xs text-blue-700">{{ userData.employeeNumber }}</p>
        </div>
      </div>
    </div>

    <!-- Item Input Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-3">
        <label class="block text-lg font-semibold text-gray-700">
          Scan Item Barcode
        </label>
        <span v-if="selectedWarehouse === '0'" class="text-sm text-red-600 font-medium">
          ⚠️ Please select a warehouse first
        </span>
      </div>
      
      <div>
        <input
          ref="itemBarcodeInput"
          v-model="itemBarcode"
          type="text"
          class="w-full p-4 text-lg border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Scan item barcode here..."
          @keyup.enter="processItemBarcode"
          autofocus
          :disabled="selectedWarehouse === '0' || isTypingRemarks"
          :class="{
            'opacity-50 cursor-not-allowed': isTypingRemarks && selectedWarehouse !== '0'
          }"
        />

      </div>
      <p v-if="selectedWarehouse === '0'" class="text-sm text-gray-500 mt-2">
        Items will be assigned to the selected warehouse
      </p>
    </div>

    <!-- Scanned Items Grid -->
    <div class="mt-8">
      <div class="flex justify-between items-center mb-6">
        <div class="flex flex-col-reverse items-start">
          <h2 class="text-xl font-semibold text-gray-700">
            Scanned Items ({{ scannedItems.length }})
          </h2>
          <Search @ingredient-selected="handleIngredientSelected" /> 
         </div>
        <div class="text-sm text-gray-600">
          Total Items: {{ totalItems }}
          <span v-if="selectedWarehouse !== '0'" class="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Warehouse: {{ selectedWarehouseName }}
          </span>
        </div>
      </div>
      
      <div v-if="scannedItems.length === 0" class="text-center py-12 text-gray-500">
        <div class="text-4xl mb-4">📦</div>
        <p class="text-lg">No items scanned yet</p>
        <p class="text-sm mt-2">Scan items to add them to the list</p>
      </div>
      
      <!-- Grid of Cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="item in scannedItems" 
          :key="item.id"
          class="relative w-full rounded-2xl shadow-lg bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          :style="{ height: item.isNameExpanded ? 'auto' : '380px' }"
        >
          <!-- Overlay: Loading State -->
          <div
            v-if="item.isLoading"
            class="absolute inset-0 bg-black bg-opacity-80 text-white text-sm flex items-center justify-center z-50 font-semibold rounded-2xl backdrop-blur-sm"
          >
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
              Updating...
            </div>
          </div>

          <!-- Image Section -->
          <div class="relative w-full h-56 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden group">
            <!-- Thumbnail Image with ZoomOnView -->
            <div class="w-full h-full">
              <ZoomOnView
                :item_id="item.itemId"
                :thumbnail="item.thumbNail"
                :canDeleteImage="false"
                class="w-full h-full"
              />
              
            </div>
            
            <!-- Name Overlay (Full Screen on Click) -->
            <button
              v-if="item.isNameExpanded"
              @click="toggleNameExpanded(item)"
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white flex items-end justify-center p-6 z-20 transition-all duration-300"
            >
              <div class="text-center w-full">
                <span class="text-lg font-bold text-white drop-shadow-lg w-full text-wrap break-words line-clamp-4">
                  {{ item.itemName }}
                </span>
                <span class="italic text-orange-500">[{{item.unitAbbre }}]</span>
                <span class="text-gray-300 text-sm mt-2 block">Click to collapse</span>
              </div>
            </button>
            
            <!-- Quick Info Overlay -->
            <div class="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
              <span class="bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                Stocks: {{ item.floatStocks }}
              </span>
              <span class="bg-blue-600/80 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                SKU: {{ item.sku }}
              </span>
            </div>
          </div>

          <!-- Product Name (below image, truncated when not expanded) -->
          <div class="w-full flex flex-col items-center px-4 py-4">
            <button
              v-if="!item.isNameExpanded"
              @click="toggleNameExpanded(item)"
              class="text-sm font-bold text-white text-center w-full line-clamp-2 hover:text-blue-300 transition-colors duration-200 group"
              :title="item.itemName"
            >
              <span class="group-hover:underline">{{ item.itemName }}</span> 
              <span class="italic text-orange-500">[{{item.unitAbbre }}]</span>
              <span class="text-gray-400 text-xs block mt-1">Click to expand</span>
            </button>
            
            <!-- Additional Info -->
            <div v-if="item.category || item.description" class="mt-3 w-full">
              <div v-if="item.category" class="inline-flex items-center bg-gray-700/50 text-gray-300 text-xs px-3 py-1 rounded-full mr-2">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {{ item.category }}
              </div>
              
              <div v-if="item.description && !item.isNameExpanded" class="text-gray-400 text-xs mt-2 line-clamp-2">
                {{ item.description }}
              </div>
            </div>
          </div>

          <!-- Buttons Row -->
          <div class="flex justify-between flex-col-reverse items-center w-full px-2 py-4 gap-3 mt-auto border-t border-gray-700/50">
            <!-- Quantity Selector -->
            <div
              class="bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 w-full rounded-xl shadow-lg flex items-center justify-center gap-3 border border-white/20"
              :class="{ 'opacity-60 pointer-events-none': item.isLoading }"
            >
              <!-- Minus button -->
              <button
                @click="changeQuantity(item, -1)"
                class="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full text-lg font-bold transition-all duration-200 hover:scale-110 active:scale-95"
                :disabled="item.quantity <= 1"
                :class="{ 'opacity-50 cursor-not-allowed hover:scale-100': item.quantity <= 1 }"
              >
                −
              </button>

              <!-- NEW Quantity Input -->
              <input
                type="number"
                v-model.number="item.quantity"
                min="1"
                class="w-12 text-center bg-transparent text-white font-bold text-lg outline-none border w-[60%] border-white/20 rounded-md py-1
                      focus:border-white/40 focus:ring-0"
                @input="validateQuantity(item)"
              />

              <!-- Plus button -->
              <button
                @click="changeQuantity(item, 1)"
                class="w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full text-lg font-bold transition-all duration-200 hover:scale-110 active:scale-95"
              >
                +
              </button>
            </div>


            <!-- Action Buttons -->
            <div class="flex gap-2 w-full justify-end">
              <button
                @click="viewItemDetails(item)"
                class="w-9 h-9 flex items-center justify-center bg-blue-500/80 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm border border-blue-400/30"
                title="View details"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button
                @click="removeItem(item.id)"
                class="w-9 h-9 flex items-center justify-center bg-red-500/80 hover:bg-red-600 text-white rounded-full shadow-lg mr-2 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm border border-red-400/30"
                title="Remove item"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

        <div v-if="scannedItems.length > 0" class="mt-8">
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Remarks (Optional)
          </label>
          <textarea
            v-model="remarks"
            @focus="onRemarksFocus"
            @blur="onRemarksBlur"
            class="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows="3"
            placeholder="Add any remarks or notes for this transaction..."
            maxlength="500"
          ></textarea>
          <div class="text-xs text-gray-500 mt-1 text-right">
            {{ remarks.length }}/500 characters
          </div>
        </div>
      </div>


    </div>


    
    <!-- Summary and Actions -->
    <div class="mt-10 pt-8 border-t border-gray-200">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="text-gray-700">
          <div class="flex items-center gap-6">
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ totalItems }}</p>
              <p class="text-sm text-gray-600">Total Items</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ scannedItems.length }}</p>
              <p class="text-sm text-gray-600">Unique Items</p>
            </div>
            <div v-if="selectedWarehouse !== '0'">
              <p class="text-2xl font-bold text-gray-800">{{ selectedWarehouseName  }}</p>
              <p class="text-sm text-gray-600">Selected Warehouse</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-3">Scan more items to add to the list</p>
        </div>
        
        <div class="flex gap-4">
          <button
            @click="clearAllItems"
            class="px-5 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="scannedItems.length === 0"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </span>
          </button>
          
          <button
            @click="submitItems"
            class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="scannedItems.length === 0 || selectedWarehouse === '0'"
            :title="selectedWarehouse === '0' ? 'Please select a warehouse first' : 'Submit scanned items'"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Submit Items
            </span>
          </button>
          
          <button
            @click="logout"
            class="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import axios from 'axios'
import { Alert, AlertHtml, BearToken } from '@/views/Utility/Helper'
import { VUE_APP_API_URL } from '@/views/Utility/Global'
import ZoomOnView from '../RequestIngredient/Modules/zoomOnView.vue'
import Swal from 'sweetalert2'
import ChangeWarehouse from './ChangeWarehouse.vue'
import Search from './Actions/Search.vue'

// Props
const props = defineProps({
  isLoggedIn: Boolean,
  userData: Object
})

// Emits
const emit = defineEmits(['logout', 'update:selectedWarehouse', 'warehouses-loaded'])

// Refs
const itemBarcodeInput = ref(null)
const itemBarcode = ref('')
const scannedItems = ref([])
const selectedWarehouse = ref('0')
const warehouses = ref([])
const loadingWarehouses = ref(false)
const token = localStorage.getItem('token')
const deviceWarehouseId = localStorage.getItem('device_warehouse_id')
const remarks = ref('')
const isTypingRemarks = ref(false)

// Computed
const totalItems = computed(() => {
  return scannedItems.value.reduce((total, item) => total + item.quantity, 0)
})

const selectedWarehouseName = computed(() => {
  if (selectedWarehouse.value === '0') return ''
  const warehouse = warehouses.value.find(w => w.value == selectedWarehouse.value)
  return warehouse ? warehouse.label : 'Unknown Warehouse'
})

// Add this method to handle ingredient selection from Search modal
const handleIngredientSelected = (ingredient) => {
  console.log('Ingredient selected from modal:', ingredient)
  
  // Check if warehouse is selected
  if (selectedWarehouse.value === '0') {
    Alert("error", "Error", "Please select a warehouse first")
    return
  }
  
  // Check if ingredient already exists in scanned items
  const existingIndex = scannedItems.value.findIndex(item => 
    item.id === ingredient.id || item.itemId === ingredient.id || item.sku === ingredient.sku
  )
  
  if (existingIndex >= 0) {
    // Increase quantity if item already exists
    scannedItems.value[existingIndex].isLoading = true
    nextTick(() => {
      setTimeout(() => {
        scannedItems.value[existingIndex].quantity++
        scannedItems.value[existingIndex].isLoading = false
        Alert("success", "Success", `Increased quantity of ${ingredient.name || ingredient.itemName}`)
      }, 300)
    })
  } else {
    // Add new item with proper structure
    const newItem = {
      id: ingredient.id || Date.now(),
      itemId: ingredient.id,
      sku: ingredient.sku || ingredient.code,
      itemName: ingredient.name || ingredient.itemName || ingredient.description,
      barcode: ingredient.barcode || ingredient.sku || ingredient.code,
      quantity: 1,
      isLoading: false,
      isNameExpanded: false,
      thumbNail: ingredient.thumbNail || ingredient.image || null,
      floatStocks: ingredient.stocks || ingredient.quantity || ingredient.available_stocks || 0,
      category: ingredient.category || ingredient.type || '',
      description: ingredient.description || '',
      warehouseId: selectedWarehouse.value,
      warehouseName: selectedWarehouseName.value,
      // Add any other properties from ingredient that might be useful
      price: ingredient.price || 0,
      unit: ingredient.unit || ingredient.measurement_unit || '',
      bgColor: ingredient.bgColor || '#3b82f6' // Default blue color
    }
    
    scannedItems.value.unshift(newItem)
    
    Alert("success", "Success", `Added ${newItem.itemName} to ${selectedWarehouseName.value}`)
  }
  
  // Focus back on barcode input
  nextTick(() => {
    if (itemBarcodeInput.value) {
      itemBarcodeInput.value.focus()
    }
  })
}

// Handle warehouse change from ChangeWarehouse component
const handleWarehouseChanged = (warehouseId) => {
  console.log('Warehouse changed to:', warehouseId)
  selectedWarehouse.value = warehouseId
  emit('update:selectedWarehouse', warehouseId)
  
  // Focus on barcode input when warehouse is selected
  if (warehouseId !== '0') {
    nextTick(() => {
      if (itemBarcodeInput.value) {
        itemBarcodeInput.value.focus()
      }
    })
  }
}

const onRemarksFocus = () => {
  isTypingRemarks.value = true
}

const onRemarksBlur = () => {
  setTimeout(() => {
    isTypingRemarks.value = false
  }, 150)
}

// Show processing popup
const showProcessingPopup = (title = "Processing...", text = "Please wait...") => {
  Swal.fire({
    title: title,
    text: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    showCancelButton: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

// Close processing popup
const closeProcessingPopup = () => {
  Swal.close()
}

// Fetch warehouses
const getWarehouses = async () => {
  try {
    loadingWarehouses.value = true
    warehouses.value = []
    const response = await axios.post(
      `${VUE_APP_API_URL}pub-stock-warehouses-dropdown`,{}
    )
    warehouses.value = response.data.warehouses || []
    
    // Check if there's a device warehouse in localStorage
    if (deviceWarehouseId) {
      console.log(deviceWarehouseId);
      
      const deviceWarehouse = warehouses.value.find(w => w.value == deviceWarehouseId)
      if (deviceWarehouse) {
        selectedWarehouse.value = deviceWarehouseId
        emit('update:selectedWarehouse', deviceWarehouseId)
      }
    }
    
    // If there's only one warehouse, auto-select it
    if (warehouses.value.length === 1 && !selectedWarehouse.value) {
      selectedWarehouse.value = warehouses.value[0].value
      emit('update:selectedWarehouse', warehouses.value[0].value)
    }
    
    loadingWarehouses.value = false
    emit('warehouses-loaded', warehouses.value)
  } catch (error) {
    console.error("Error fetching warehouses:", error)
    loadingWarehouses.value = false
    Alert("error", "Error", "Failed to load warehouses")
  }
}

// Helper functions for thumbnails - SIMPLIFIED
const hasThumbnail = (item) => {
  return item.thumbNail && item.thumbNail !== false && item.thumbNail !== 'false' && item.thumbNail.trim() !== ''
}

// Process item barcode
const processItemBarcode = async () => {
  if (selectedWarehouse.value === '0') {
    Alert("error", "Error", "Please select a warehouse first")
    return
  }
  
  if (!itemBarcode.value.trim()) {
    Alert("error", "Error", "Please scan an item barcode")
    return
  }

  // Show processing popup for item lookup
  showProcessingPopup("Looking up Item", "Searching for item in database...")

  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}pub-stock-find-by-barcode/${itemBarcode.value.trim()}/${selectedWarehouse.value}`,
    )

    closeProcessingPopup()

    if (response.data.error) {
      Alert("error", "Not Found", response.data.message || 'Item not found')
      return
    }

    const item = response.data.data
    
    // Check if item already exists
    const existingIndex = scannedItems.value.findIndex(i => i.id === item.id)
    
    if (existingIndex >= 0) {
      scannedItems.value[existingIndex].isLoading = true
      await nextTick()
      
      setTimeout(() => {
        scannedItems.value[existingIndex].quantity++
        scannedItems.value[existingIndex].isLoading = false
        Alert("success", "Success", `Increased quantity of ${item.itemName}`)
      }, 300)
    } else {
      // Add new item with card properties
      scannedItems.value.unshift({
        ...item,
        quantity: 1,
        isLoading: false,
        isNameExpanded: false,
        thumbNail: item.thumbNail || null,
        warehouseId: selectedWarehouse.value,
        warehouseName: selectedWarehouseName.value
      })
      Alert("success", "Success", `Added ${item.itemName} to ${selectedWarehouseName.value}`)
    }
    
  } catch (error) {
    closeProcessingPopup()
    console.error('Error processing item:', error)
    
    if (error.response && error.response.status === 404) {
      Alert("error", "Not Found", "Item not found in database")
    } else if (error.response && error.response.data && error.response.data.message) {
      Alert("error", "Error", error.response.data.message)
    } else {
      Alert("error", "Error", "Failed to load item. Please try again.")
    }
  }

  itemBarcode.value = ''
  nextTick(() => {
    if (itemBarcodeInput.value) {
      itemBarcodeInput.value.focus()
    }
  })
}

// Submit items to API
const submitItems = async () => {
  if (scannedItems.value.length === 0) {
    Alert("warning", "No Items", "Please scan items before submitting")
    return
  }
  
  if (selectedWarehouse.value === '0') {
    Alert("error", "Error", "Please select a warehouse first")
    return
  }
  
  if (!props.userData || !props.userData.id) {
    Alert("error", "Error", "User information not available")
    return
  }

  // Prepare data for submission
  const submissionData = {
    userId: props.userData.userId,
    employeeId: props.userData.id,
    warehouseId: selectedWarehouse.value,
    warehouseName: selectedWarehouseName.value,
    remarks: remarks.value.trim(),
    items: scannedItems.value.map(item => ({
      itemId: item.itemId,
      sku: item.sku,
      itemName: item.itemName,
      quantity: item.quantity,
      barcode: item.barcode || item.sku
    })),
    totalItems: totalItems.value,
    totalUniqueItems: scannedItems.value.length,
    scanTimestamp: new Date().toISOString()
  }

  try {
    // Show processing popup for submission
    showProcessingPopup("Submitting Items", `Submitting ${scannedItems.value.length} items to warehouse...`)

    const response = await axios.post(
      `${VUE_APP_API_URL}pub-stock-submit-stock-out-items`,
      submissionData
    )

    closeProcessingPopup()  

    if (response.data.error) {
      Alert("error", "Submission Failed", response.data.message || "Failed to submit items")
    } else {
      Alert("success", "Success", `
        ${scannedItems.value.length} items (${totalItems.value} total) 
        submitted successfully to ${selectedWarehouseName.value}!
      `)
      
      // Clear scanned items after successful submission
      scannedItems.value = []
      
      // Optionally: Show submission details
      AlertHtml("success", "Submission Details", `
        <div class="text-left space-y-2">
          <p><strong>Warehouse:</strong> ${selectedWarehouseName.value}</p>
          <p><strong>User:</strong> ${props.userData.name}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `)
      
      // Focus back on barcode input after submission
      nextTick(() => {
        if (itemBarcodeInput.value) {
          itemBarcodeInput.value.focus()
        }
      })
    }
  } catch (error) {
    closeProcessingPopup()
    console.error("Error submitting items:", error)
    Alert("error", "Submission Failed", 
      error.response?.data?.message || "An error occurred while submitting items. Please try again."
    )
    
    // Still focus back on barcode input even if error
    nextTick(() => {
      if (itemBarcodeInput.value) {
        itemBarcodeInput.value.focus()
      }
    })
  }
}

const validateQuantity = (item) => {
  if (!item.quantity || item.quantity < 1) {
    item.quantity = 1;
  }
};

// Watch for warehouse selection changes
watch(selectedWarehouse, (newValue) => {
  console.log('Warehouse changed to:', newValue)
  emit('update:selectedWarehouse', newValue)
})

// Card Methods
const toggleNameExpanded = (item) => {
  item.isNameExpanded = !item.isNameExpanded
}

const changeQuantity = async (item, change) => {
  const newQuantity = item.quantity + change
  
  if (newQuantity < 1) {
    removeItem(item.id)
    return
  }
  
  item.isLoading = true
  await nextTick()
  
  setTimeout(() => {
    item.quantity = newQuantity
    item.isLoading = false
  }, 200)
}

const viewItemDetails = (item) => {
  const hasImage = hasThumbnail(item)
  const thumbLength = item.thumbNail?.length || 0
  
  AlertHtml("info", "Item Details", `
    <div class="text-left space-y-2">
      <p><strong>Name:</strong> ${item.itemName}</p>
      <p><strong>SKU:</strong> ${item.sku}</p>
      <p><strong>Item ID:</strong> ${item.id}</p>
      <p><strong>Quantity:</strong> ${item.quantity}</p>
      <p><strong>Warehouse:</strong> ${item.warehouseName || 'Not assigned'}</p>
      ${item.category ? `<p><strong>Category:</strong> ${item.category}</p>` : ''}
      ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
    </div>
  `)
}

const removeItem = (itemId) => {
  scannedItems.value = scannedItems.value.filter(item => item.id !== itemId)
  Alert("success", "Removed", "Item removed from list")
}

const clearAllItems = () => {
  if (scannedItems.value.length > 0) {
    if (confirm('Are you sure you want to clear all items?')) {
      scannedItems.value = []
      remarks.value = '' // Also clear remarks when clearing all items
      Alert("success", "Cleared", "All items cleared")
    }
  }
}

const handleTransaction = (id) => {
  console.log("Transaction handled:", id)
  
  // Refresh warehouses to pick up any changes, including device_warehouse_id
  getWarehouses().then(() => {
    // After warehouses are loaded, check if device warehouse exists
    const currentDeviceWarehouseId = localStorage.getItem('device_warehouse_id')
    if (currentDeviceWarehouseId && currentDeviceWarehouseId !== deviceWarehouseId.value) {
      const deviceWarehouse = warehouses.value.find(w => String(w.value) === String(currentDeviceWarehouseId));
      if (deviceWarehouse) {
        selectedWarehouse.value = String(currentDeviceWarehouseId);
        emit('update:selectedWarehouse', selectedWarehouse.value);
        console.log("Updated to new device warehouse:", deviceWarehouse.label);
      }
    }
  })
}

const logout = () => {
  if (scannedItems.value.length > 0) {
    if (!confirm('You have items in your list. Logout anyway?')) {
      return
    }
  }
  
  emit('logout')
}

// Initialize warehouses when component is mounted
const initWarehouses = async () => {
  await getWarehouses();
}

// Expose methods
defineExpose({
  focusInput: () => {
    if (itemBarcodeInput.value) {
      itemBarcodeInput.value.focus()
    }
  },
  getWarehouses,
  initWarehouses
})
</script>

<style scoped>
/* Custom styles */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-all {
  transition-property: all;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

:deep(.zoom-on-view) {
  width: 100%;
  height: 100%;
}

:deep(.zoom-on-view img) {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

.active\:scale-95:active {
  transform: scale(0.95);
}
</style>