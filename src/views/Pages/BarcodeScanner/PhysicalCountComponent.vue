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
          />
          
          <!-- Current Warehouse Info -->
          <div v-if="selectedWarehouse && selectedWarehouse !== '0'" class="mt-2">
            <p class="text-sm text-purple-600">
              Current Warehouse: <span class="font-semibold">{{ selectedWarehouseName }}</span>
            </p>
          </div>
        </div>
        
        <!-- User Info Display -->
        <div v-if="userData" class="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <p class="text-sm font-medium text-purple-800">Logged in as:</p>
          <p class="font-semibold text-purple-900">{{ userData.userName }}</p>
          <p class="text-xs text-purple-700">{{ userData.employeeNumber }}</p>
          <p class="text-xs text-purple-600 mt-1">📋 Physical Count Mode</p>
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
        <span v-else class="text-sm text-purple-600 font-medium">
          ✅ Ready for Physical Count
        </span>
      </div>
      
      <div>
        <input
          ref="itemBarcodeInput"
          v-model="itemBarcode"
          type="text"
          class="w-full p-4 text-lg border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Scan item barcode here..."
          @keyup.enter="processItemBarcode"
          autofocus
          :disabled="selectedWarehouse === '0'"
        />
      </div>
      <p v-if="selectedWarehouse === '0'" class="text-sm text-gray-500 mt-2">
        Items will be counted at the selected warehouse
      </p>
      <p v-else class="text-sm text-purple-600 mt-2">
        Scanning items for physical count at {{ selectedWarehouseName }}
      </p>
    </div>

    <!-- Scanned Items Grid -->
    <div class="mt-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-700">
          Items for Physical Count ({{ scannedItems.length }})
        </h2>
        <div class="text-sm text-gray-600">
          Total Counted: {{ totalCounted }}
          <span v-if="selectedWarehouse !== '0'" class="ml-4 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            Warehouse: {{ selectedWarehouseName }}
          </span>
        </div>
      </div>
      
      <div v-if="scannedItems.length === 0" class="text-center py-12 text-gray-500">
        <div class="text-4xl mb-4">📋</div>
        <p class="text-lg">No items scanned yet</p>
        <p class="text-sm mt-2">Scan items to add them to physical count list</p>
      </div>
      
      <!-- Grid of Cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="item in scannedItems" 
          :key="item.id"
          class="relative w-full rounded-2xl shadow-lg bg-gradient-to-br from-purple-800 to-indigo-900 flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          :style="{ height: item.isNameExpanded ? 'auto' : '480px' }"
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
          <div class="relative w-full h-56 flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-800 overflow-hidden group">
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
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent text-white flex items-end justify-center p-6 z-20 transition-all duration-300"
            >
              <div class="text-center w-full">
                <!-- <span class="text-lg font-bold text-white drop-shadow-lg w-full text-wrap break-words line-clamp-4">
                  {{ item.itemName }}
                </span> -->
                <span class="text-gray-300 text-sm mt-2 block">Click to collapse</span>
              </div>
            </button>
            
            <!-- Quick Info Overlay -->
            <div class="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
              <span class="bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                System Stock: {{ item.floatStocks }} 
              </span>
              <span class="bg-purple-600/80 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                SKU: {{ item.itemSku || item.sku }}
              </span>
            </div>
          </div>

          <!-- Product Name (below image, truncated when not expanded) -->
          <div class="w-full flex flex-col items-center px-4 py-2">
            <span class="group-hover:underline text-white">{{ item.itemName }}</span>
            <span class="text-gray-300 italic font-bold">[{{ item.unitAbbre }}]</span>
            <!-- <button
              v-if="!item.isNameExpanded"
              @click="toggleNameExpanded(item)"
              class="text-sm font-bold text-white text-center w-full line-clamp-2 hover:text-purple-300 transition-colors duration-200 group"
              :title="item.itemName"
            >
              <span class="text-gray-400 text-xs block mt-1">Click to expand</span>
            </button> -->
            
            <!-- Additional Info -->
            <!-- <div v-if="item.category || item.description" class="mt-3 w-full">
              <div v-if="item.category" class="inline-flex items-center bg-purple-700/50 text-gray-300 text-xs px-3 py-1 rounded-full mr-2">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {{ item.category }}
              </div>
              
              <div v-if="item.description && !item.isNameExpanded" class="text-gray-400 text-xs mt-2 line-clamp-2">
                {{ item.description }}
              </div>
            </div> -->
          </div>

          <!-- Physical Count Input Section -->
          <div class="mt-2 px-4 space-y-2">
            <!-- System vs Physical Count -->
            <div class="grid grid-cols-2 gap-2">
              <div class="text-center bg-indigo-900/50 rounded-lg p-2 border border-indigo-700/50">
                <p class="text-xs text-gray-300 mb-1">System Stock</p>
                <p class="text-xl font-bold text-white">{{ item.floatStocks || 0 }}</p>
              </div>
              <div class="text-center bg-purple-900/50 rounded-lg p-2 border border-purple-700/50">
                <p class="text-xs text-gray-300 mb-1">Physical Count</p>
                <p class="text-xl font-bold text-white">{{ item.physicalCount || 0 }}</p>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div
              class="bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 w-full rounded-xl shadow-lg flex items-center justify-center gap-3 border border-white/20"
              :class="{ 'opacity-60 pointer-events-none': item.isLoading }"
            >
              <!-- Minus button -->
              <!-- <button
                @click="changePhysicalCount(item, -1)"
                class="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full text-lg font-bold transition-all duration-200 hover:scale-110 active:scale-95"
                :disabled="(item.physicalCount || 0) <= 0"
                :class="{ 'opacity-50 cursor-not-allowed hover:scale-100': (item.physicalCount || 0) <= 0 }"
              >
                −
              </button> -->

              <!-- Physical Count Input -->
              <input
                type="number"
                v-model.number="item.physicalCount"
                min="0"
                @input="validatePhysicalCount(item)"
                class="w-12 text-center bg-transparent text-white font-bold text-lg outline-none border w-[60%] border-white/20 rounded-md py-1
                      focus:border-white/40 focus:ring-0"
                placeholder="0"
              />

              <!-- Plus button -->
              <!-- <button
                @click="changePhysicalCount(item, 1)"
                class="w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full text-lg font-bold transition-all duration-200 hover:scale-110 active:scale-95"
              >
                +
              </button> -->
            </div>

            <!-- Remarks Textarea -->
            <div class="mt-0">
              <!-- <label class="block text-xs font-medium text-gray-300 mb-1">
                Remarks / Notes:
              </label> -->
              <textarea
                v-model="item.remarks"
                @input="trimRemarks(item)"
                rows="2"
                maxlength="200"
                placeholder="Add notes about this count (damaged, misplaced, etc.)"
                class="w-full p-2 text-sm bg-black/20 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none resize-none"
                :class="{ 'border-yellow-400': item.remarks && item.remarks.length > 0 }"
              ></textarea>
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span v-if="item.remarks" class="text-yellow-300">
                  ✓ Notes added
                </span>
                <span>{{ item.remarks?.length || 0 }}/200</span>
              </div>
            </div>
          </div>

          <!-- Buttons Row -->
          <div class="flex justify-between items-center w-full px-2 py-4 gap-3 mt-auto border-t border-gray-700/50">
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
                class="w-9 h-9 p-4 flex items-center justify-center bg-red-500/80 hover:bg-red-600 text-white font-bold rounded-full shadow-lg mr-2 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm border border-red-400/30"
                title="Remove item"
              >
                OK
                <!-- <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg> -->
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
              <p class="text-2xl font-bold text-gray-800">{{ totalCounted }}</p>
              <p class="text-sm text-gray-600">Total Counted</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ scannedItems.length }}</p>
              <p class="text-sm text-gray-600">Unique Items</p>
            </div>
            <!-- <div>
              <p class="text-2xl font-bold" :class="discrepancyCount > 0 ? 'text-red-600' : 'text-green-600'">
                {{ discrepancyCount }}
              </p>
              <p class="text-sm text-gray-600">Discrepancies</p>
            </div> -->
            <div v-if="selectedWarehouse !== '0'">
              <p class="text-2xl font-bold text-gray-800">{{ selectedWarehouseName }}</p>
              <p class="text-sm text-gray-600">Warehouse</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-3">Scan more items to add to physical count list</p>
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
          
          <!-- <button
            @click="submitPhysicalCount"
            class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="scannedItems.length === 0 || selectedWarehouse === '0'"
            :title="selectedWarehouse === '0' ? 'Please select a warehouse first' : 'Submit physical count'"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submit Count
            </span>
          </button> -->
          
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
import { Alert, AlertHtml,
  useDebounce, } from '@/views/Utility/Helper'
import { VUE_APP_API_URL } from '@/views/Utility/Global'
import ZoomOnView from '../RequestIngredient/Modules/zoomOnView.vue'
import Swal from 'sweetalert2'
import ChangeWarehouse from './ChangeWarehouse.vue' // Import the ChangeWarehouse component

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
const isLoading = ref(false)
const token = localStorage.getItem('token')
const deviceWarehouseId = localStorage.getItem('device_warehouse_id')

// Computed
const totalCounted = computed(() => {
  return scannedItems.value.reduce((total, item) => total + (item.physicalCount || 0), 0)
})

// const discrepancyCount = computed(() => {
//   return scannedItems.value.reduce((count, item) => {
//     const systemStock = item.floatStocks || 0
//     const physicalCount = item.physicalCount || 0
//     return count + (systemStock !== physicalCount ? 1 : 0)
//   }, 0)
// })

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
      `${VUE_APP_API_URL}pub-physical-count/get-item/${itemBarcode.value.trim()}/${selectedWarehouse.value}`,
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
      // console.log("existingIndex in line: 498");
      // console.log(existingIndex);
      // console.log(item.count);
      scannedItems.value[existingIndex].isLoading = true
      await nextTick()
      
      setTimeout(() => {
        scannedItems.value[existingIndex].physicalCount = item.count;//(scannedItems.value[existingIndex].physicalCount || 0) + 1
        scannedItems.value[existingIndex].remarks = item.remarks;//(scannedItems.value[existingIndex].physicalCount || 0) + 1
        scannedItems.value[existingIndex].isLoading = false
        Alert("success", "Success", `Increased physical count of ${item.itemName}`)
      }, 300)
    } else {
      // Add new item with physical count properties
      scannedItems.value.unshift({
        ...item,
        physicalCount: item.count,
        isLoading: false,
        isNameExpanded: false,
        thumbNail: item.thumbNail || null,
        warehouseId: selectedWarehouse.value,
        warehouseName: selectedWarehouseName.value,
        remarks: item.remarks, // Initialize remarks field
        discrepancy: 0 // Initialize discrepancy
      })
      Alert("success", "Success", `Added ${item.itemName} to physical count list for ${selectedWarehouseName.value}`)
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

// Submit physical count
const submitPhysicalCount = async () => {
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

  // Calculate discrepancies for each item
  const itemsWithDiscrepancies = scannedItems.value.map(item => ({
    ...item,
    systemStock: item.floatStocks || 0,
    discrepancy: (item.physicalCount || 0) - (item.floatStocks || 0)
  }))
  console.log(itemsWithDiscrepancies);
  
  // Prepare data for submission - PHYSICAL COUNT
  const submissionData = {
    userId: props.userData.userId,
    employeeId: props.userData.id,
    warehouseId: selectedWarehouse.value,
    warehouseName: selectedWarehouseName.value,
    items: itemsWithDiscrepancies.map(item => ({
      itemId: item.itemId,
      WhiId: item.id,
      sku: item.sku,
      itemName: item.itemName,
      systemStock: item.systemStock,
      physicalCount: item.physicalCount || 0,
      discrepancy: item.discrepancy,
      remarks: item.remarks || '',
      barcode: item.barcode || item.sku
    })),
    totalCounted: totalCounted.value,
    totalUniqueItems: scannedItems.value.length,
    // discrepancyCount: discrepancyCount.value,
    // scanTimestamp: new Date().toISOString(),
    operationType: 'physical-count'
  }

  try {
    // Show processing popup for submission
    showProcessingPopup("Processing Physical Count", `Submitting ${scannedItems.value.length} items...`)

    const response = await axios.post(
      `${VUE_APP_API_URL}pub-stock-submit-physical-count`,
      submissionData
    )

    closeProcessingPopup()

    if (response.data.error) {
      Alert("error", "Submission Failed", response.data.message || "Failed to submit physical count")
    } else {
      Alert("success", "Success", `
        ${scannedItems.value.length} items successfully counted!
      `)
      
      // Clear scanned items after successful submission
      scannedItems.value = []
      
      // Optionally: Show submission details
      AlertHtml("success", "Physical Count Details", `
        <div class="text-left space-y-2">
          <p><strong>Warehouse:</strong> ${selectedWarehouseName.value}</p>
          <p><strong>User:</strong> ${props.userData.name}</p>
          <p><strong>Operation:</strong> Physical Count</p>
          <p><strong>Total Items Counted:</strong> ${totalCounted.value}</p>
          <p><strong>Unique Items:</strong> ${submissionData.totalUniqueItems}</p>
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
    console.error("Error submitting physical count:", error)
    
    // For demo/testing purposes if API doesn't exist yet
    Alert("error", "Submission Failed", error || "Failed to submit physical count")
    scannedItems.value = []
    
    // Focus back on barcode input even if error
    nextTick(() => {
      if (itemBarcodeInput.value) {
        itemBarcodeInput.value.focus()
      }
    })
  }
}

const validatePhysicalCount = useDebounce(async (item) => {
  if (!item.physicalCount || item.physicalCount < 0) {
    item.physicalCount = 0;
  }
  // Calculate discrepancy
  item.discrepancy = (item.physicalCount || 0) - (item.floatStocks || 0);
  const item2 = {
      'new_count' : item.physicalCount,
      'physical_count_id' : item.physicalCountId,
      'remarks': item.remarks,
      'userId': props.userData.userId,
    }
  updateCount(item2);
}, 600);

  // Fetch list of ingredients
  const updateCount = async (item) => {
    // Prevent duplicate calls
    if (isLoading.value) {
      console.log('already in progress, skipping...');
      return;
    }
    
    try {
      isLoading.value = true;
      
      const response = await axios.post(
        `${VUE_APP_API_URL}pub-physical-count/add-new-count`,
       item
      )
    } catch (err) {
      Alert("error", "ERROR",err.message)
    } finally {
      isLoading.value = false;
    }
  };

const trimRemarks = useDebounce(async (item) => {
  if (item.remarks && item.remarks.length > 200) {
    item.remarks = item.remarks.substring(0, 200);
  }

  const item2 = {
      'new_count' : item.physicalCount,
      'physical_count_id' : item.physicalCountId,
      'remarks': item.remarks,
      'userId': props.userData.userId,
    }
  updateCount(item2);
}, 600);

const onRemarksFocus = () => {
  isTypingRemarks.value = true
}
const onRemarksBlur = () => {
  setTimeout(() => {
    isTypingRemarks.value = false
  }, 150)
}

// Change physical count
const changePhysicalCount = async (item, change) => {
  const newCount = (item.physicalCount || 0) + change
  
  if (newCount < 0) {
    return // Don't allow negative counts
  }
  
  item.isLoading = true
  const response = await axios.post(
    `${VUE_APP_API_URL}pub-physical-count/add-new-count`,
    {
      'new_count' : newCount,
      'physical_count_id' : item.physicalCountId,
      'remarks': item.remarks
    }
  )

  await nextTick()
  
  setTimeout(() => {
    item.physicalCount = newCount
    item.discrepancy = newCount - (item.floatStocks || 0)
    item.isLoading = false
  }, 200)
}

// Watch for warehouse selection changes
watch(selectedWarehouse, (newValue) => {
  console.log('Warehouse changed to:', newValue)
  emit('update:selectedWarehouse', newValue)
})

// Card Methods
const toggleNameExpanded = (item) => {
  item.isNameExpanded = !item.isNameExpanded
}

const viewItemDetails = (item) => {
  const discrepancy = (item.physicalCount || 0) - (item.floatStocks || 0)
  
  AlertHtml("info", "Item Details", `
    <div class="text-left space-y-2">
      <p><strong>Name:</strong> ${item.itemName}</p>
      <p><strong>SKU:</strong> ${item.sku || item.itemSku}</p>
      <p><strong>Item ID:</strong> ${item.id}</p>
      <p><strong>System Stock:</strong> ${item.floatStocks || 0}</p>
      <p><strong>Physical Count:</strong> ${item.physicalCount || 0}</p>
      <p><strong>Discrepancy:</strong> 
        <span class="${discrepancy > 0 ? 'text-green-600' : discrepancy < 0 ? 'text-red-600' : 'text-gray-600'} font-semibold">
          ${discrepancy > 0 ? '+' : ''}${discrepancy}
        </span>
      </p>
      <p><strong>Warehouse:</strong> ${item.warehouseName || 'Not assigned'}</p>
      <p><strong>Operation:</strong> Physical Count</p>
      ${item.remarks ? `<p><strong>Remarks:</strong> ${item.remarks}</p>` : ''}
    </div>
  `)
}

const removeItem = (itemId) => {
  scannedItems.value = scannedItems.value.filter(item => item.id !== itemId)
  Alert("success", "Removed", "Item removed from physical count list")
}

const clearAllItems = () => {
  if (scannedItems.value.length > 0) {
    if (confirm('Are you sure you want to clear all items from physical count list?')) {
      scannedItems.value = []
      Alert("success", "Cleared", "All items cleared from physical count list")
    }
  }
}

const logout = () => {
  if (scannedItems.value.length > 0) {
    if (!confirm('You have items in your physical count list. Logout anyway?')) {
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
/* Custom styles for Physical Count */
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