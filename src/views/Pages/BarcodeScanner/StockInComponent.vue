<template>
  <div>
    <!-- Warehouse Selection -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <!-- Use the ChangeWarehouse component -->
          <ChangeWarehouse 
            :warehouse_name="selectedWarehouseName || 'Select Warehouse'"
            :warehouses="warehouses"
            @warehouse-changed="handleWarehouseChanged"
            @transaction_id="handleTransaction"
          />
          
          <!-- Current Warehouse Info -->
          <div v-if="selectedWarehouse && selectedWarehouse !== '0'" class="mt-2">
            <p class="text-sm text-green-600">
              Current Warehouse: <span class="font-semibold">{{ selectedWarehouseName }}</span>
            </p>
          </div>
        </div>
        
        <!-- User Info Display -->
        <div v-if="userData" class="bg-green-50 p-4 rounded-xl border border-green-100">
          <p class="text-sm font-medium text-green-800">Logged in as:</p>
          <p class="font-semibold text-green-900">{{ userData.userName }}</p>
          <p class="text-xs text-green-700">{{ userData.employeeNumber }}</p>
          <p class="text-xs text-green-600 mt-1">📥 Stock In Mode</p>
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
        <span v-else class="text-sm text-green-600 font-medium">
          ✅ Ready for Stock In
        </span>
      </div>
      
      <div>
        <input
          ref="itemBarcodeInput"
          v-model="itemBarcode"
          type="text"
          class="w-full p-4 text-lg border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Scan item barcode here..."
          @keyup.enter="processItemBarcode"
          autofocus
          :disabled="selectedWarehouse === '0'"
        />
      </div>
      <p v-if="selectedWarehouse === '0'" class="text-sm text-gray-500 mt-2">
        Items will be added to the selected warehouse
      </p>
      <p v-else class="text-sm text-green-600 mt-2">
        Scanning items to add to inventory at {{ selectedWarehouseName }}
      </p>
    </div>

    <!-- Scanned Items Grid -->
    <div class="mt-8">
      <div class="flex justify-between items-center mb-6">
        <div class="flex flex-col-reverse items-start">
          <h2 class="text-xl font-semibold text-gray-700">
            Scanned Items ({{ scannedItems.length }})
          </h2>
          <Search /> 
         </div>
        <div class="text-sm text-gray-600">
          Total Items: {{ totalItems }}
          <span v-if="selectedWarehouse !== '0'" class="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Warehouse: {{ selectedWarehouseName }}
          </span>
        </div>
      </div>
      
      <div v-if="scannedItems.length === 0" class="text-center py-12 text-gray-500">
        <div class="text-4xl mb-4">📥</div>
        <p class="text-lg">No items scanned yet</p>
        <p class="text-sm mt-2">Scan items to add them to stock in list</p>
      </div>
      
      <!-- Grid of Cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="item in scannedItems" 
          :key="item.id"
          class="relative w-full rounded-2xl shadow-lg bg-gradient-to-br from-emerald-800 to-green-900 flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
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
          <div class="relative w-full h-56 flex items-center justify-center bg-gradient-to-br from-green-900 to-emerald-800 overflow-hidden group">
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
                <span class="text-gray-300 text-sm mt-2 block">Click to collapse</span>
              </div>
            </button>
            
            <!-- Quick Info Overlay -->
            <div class="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
              <span class="bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                stocks: {{ item.floatStocks }}
              </span>
              <span class="bg-emerald-600/80 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                SKU: {{ item.itemSku || item.sku }}
              </span>
            </div>
          </div>

          <!-- Product Name (below image, truncated when not expanded) -->
          <div class="w-full flex flex-col items-center px-4 py-4">
            <button
              v-if="!item.isNameExpanded"
              @click="toggleNameExpanded(item)"
              class="text-sm font-bold text-white text-center w-full line-clamp-2 hover:text-emerald-300 transition-colors duration-200 group"
              :title="item.itemName"
            >
              <span class="group-hover:underline">{{ item.itemName }}</span>
              <span class="text-gray-400 text-xs block mt-1">Click to expand</span>
            </button>
            
            <!-- Additional Info -->
            <div v-if="item.category || item.description" class="mt-3 w-full">
              <div v-if="item.category" class="inline-flex items-center bg-emerald-700/50 text-gray-300 text-xs px-3 py-1 rounded-full mr-2">
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
                min="0"
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
              <p class="text-2xl font-bold text-gray-800">{{ selectedWarehouseName }}</p>
              <p class="text-sm text-gray-600">Destination Warehouse</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-3">Scan more items to add to stock in list</p>
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
            @click="submitStockIn"
            class="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="scannedItems.length === 0 || selectedWarehouse === '0'"
            :title="selectedWarehouse === '0' ? 'Please select a warehouse first' : 'Submit stock in items'"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Stock In
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
import ChangeWarehouse from './ChangeWarehouse.vue' // Import the ChangeWarehouse component
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

// Computed
const totalItems = computed(() => {
  return scannedItems.value.reduce((total, item) => total + item.quantity, 0)
})

const selectedWarehouseName = computed(() => {
  if (selectedWarehouse.value === '0') return ''
  const warehouse = warehouses.value.find(w => w.value == selectedWarehouse.value)
  return warehouse ? warehouse.label : 'Unknown Warehouse'
})

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
        Alert("success", "Success", `Increased quantity of ${item.itemName} for stock in`)
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
      Alert("success", "Success", `Added ${item.itemName} to stock in list for ${selectedWarehouseName.value}`)
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

// Submit stock in items
const submitStockIn = async () => {
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

  // Prepare data for submission - STOCK IN
  const submissionData = {
    userId: props.userData.userId,
    employeeId: props.userData.id,
    warehouseId: selectedWarehouse.value,
    warehouseName: selectedWarehouseName.value,
    items: scannedItems.value.map(item => ({
      itemId: item.itemId,
      sku: item.sku,
      itemName: item.itemName,
      quantity: item.quantity,
      barcode: item.barcode || item.sku
    })),
    totalItems: totalItems.value,
    totalUniqueItems: scannedItems.value.length,
    scanTimestamp: new Date().toISOString(),
    operationType: 'stock-in'
  }

  try {
    // Show processing popup for submission
    showProcessingPopup("Processing Stock In", `Adding ${scannedItems.value.length} items to warehouse inventory...`)

    const response = await axios.post(
      `${VUE_APP_API_URL}pub-stock-submit-stock-in-items`,
      submissionData
    )

    closeProcessingPopup()

    if (response.data.error) {
      Alert("error", "Submission Failed", response.data.message || "Failed to stock in items")
    } else {
      Alert("success", "Success", `
        ${scannedItems.value.length} items (${totalItems.value} total) 
        successfully stocked in to ${selectedWarehouseName.value}!
      `)
      
      // Clear scanned items after successful submission
      scannedItems.value = []
      
      // Optionally: Show submission details
      AlertHtml("success", "Stock In Details", `
        <div class="text-left space-y-2">
          <p><strong>Warehouse:</strong> ${selectedWarehouseName.value}</p>
          <p><strong>User:</strong> ${props.userData.name}</p>
          <p><strong>Operation:</strong> Stock In</p>
          <p><strong>Total Items Added:</strong> ${totalItems.value}</p>
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
    console.error("Error submitting stock in items:", error)
    
    if (error.response && error.response.status === 404) {
      Alert("error", "Submission Failed", response.data.message || "Failed to stock in items")
    } else {
      Alert("error", "Submission Failed", 
        error.response?.data?.message || "An error occurred while processing stock in. Please try again."
      )
      
      // Still focus back on barcode input even if error
      nextTick(() => {
        if (itemBarcodeInput.value) {
          itemBarcodeInput.value.focus()
        }
      })
    }
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

const handleTransaction = (id) => {
  console.log("Transaction handled:", id)
  
  // Refresh warehouses to pick up any changes, including device_warehouse_id
  getWarehouses().then(() => {
    // After warehouses are loaded, check if device warehouse exists
    const currentDeviceWarehouseId = localStorage.getItem('device_warehouse_id')
    if (currentDeviceWarehouseId && currentDeviceWarehouseId !== deviceWarehouseId.value) {
      const deviceWarehouse = warehouses.value.find(w => String(w.value) === String(currentDeviceWarehouseId))
      if (deviceWarehouse) {
        selectedWarehouse.value = String(currentDeviceWarehouseId)
        emit('update:selectedWarehouse', selectedWarehouse.value)
        console.log("Updated to new device warehouse:", deviceWarehouse.label)
      }
    }
  })
}

const viewItemDetails = (item) => {
  const hasImage = hasThumbnail(item)
  const thumbLength = item.thumbNail?.length || 0
  
  AlertHtml("info", "Item Details", `
    <div class="text-left space-y-2">
      <p><strong>Name:</strong> ${item.itemName}</p>
      <p><strong>SKU:</strong> ${item.sku || item.itemSku}</p>
      <p><strong>Item ID:</strong> ${item.id}</p>
      <p><strong>Quantity:</strong> ${item.quantity}</p>
      <p><strong>Destination Warehouse:</strong> ${item.warehouseName || 'Not assigned'}</p>
      <p><strong>Operation:</strong> Stock In</p>
    </div>
  `)
}

const removeItem = (itemId) => {
  scannedItems.value = scannedItems.value.filter(item => item.id !== itemId)
  Alert("success", "Removed", "Item removed from stock in list")
}

const clearAllItems = () => {
  if (scannedItems.value.length > 0) {
    if (confirm('Are you sure you want to clear all items from stock in list?')) {
      scannedItems.value = []
      Alert("success", "Cleared", "All items cleared from stock in list")
    }
  }
}

const logout = () => {
  if (scannedItems.value.length > 0) {
    if (!confirm('You have items in your stock in list. Logout anyway?')) {
      return
    }
  }
  
  emit('logout')
}

// Initialize warehouses when component is mounted
const initWarehouses = async () => {
  await getWarehouses()
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
/* Custom styles for Stock In */
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