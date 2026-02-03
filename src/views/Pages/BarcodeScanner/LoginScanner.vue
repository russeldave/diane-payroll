<template>
  <div v-if="!isLoggedIn">
    <!-- Mode Selection -->
    <div class="mb-6">
      <div class="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-200">
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Select Operation Mode
        </label>
        <div class="grid grid-cols-3 gap-3">
          <!-- Stock Out Checkbox -->
          <label class="flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                 :class="selectedMode === 'stock-out' 
                   ? 'border-blue-500 bg-blue-50' 
                   : 'border-gray-200 hover:border-gray-300'">
            <input 
              type="checkbox"
              class="sr-only"
              :checked="selectedMode === 'stock-out'"
              @change="changeMode('stock-out')"
            >
            <div class="flex items-center justify-center w-10 h-10 rounded-full mb-2"
                 :class="selectedMode === 'stock-out' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <span class="text-sm font-medium"
                  :class="selectedMode === 'stock-out' ? 'text-blue-700' : 'text-gray-700'">
              Stock Out
            </span>
            <span v-if="selectedMode === 'stock-out'" class="mt-1 text-xs text-blue-600 font-medium">
              ✓ Selected
            </span>
          </label>
          
          <!-- Stock In Checkbox -->
          <label class="flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                 :class="selectedMode === 'stock-in' 
                   ? 'border-green-500 bg-green-50' 
                   : 'border-gray-200 hover:border-gray-300'">
            <input 
              type="checkbox"
              class="sr-only"
              :checked="selectedMode === 'stock-in'"
              @change="changeMode('stock-in')"
            >
            <div class="flex items-center justify-center w-10 h-10 rounded-full mb-2"
                 :class="selectedMode === 'stock-in' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <span class="text-sm font-medium"
                  :class="selectedMode === 'stock-in' ? 'text-green-700' : 'text-gray-700'">
              Stock In
            </span>
            <span v-if="selectedMode === 'stock-in'" class="mt-1 text-xs text-green-600 font-medium">
              ✓ Selected
            </span>
          </label>
          
          <!-- Physical Count Checkbox -->
          <label class="flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                 :class="selectedMode === 'physical-count' 
                   ? 'border-purple-500 bg-purple-50' 
                   : 'border-gray-200 hover:border-gray-300'">
            <input 
              type="checkbox"
              class="sr-only"
              :checked="selectedMode === 'physical-count'"
              @change="changeMode('physical-count')"
            >
            <div class="flex items-center justify-center w-10 h-10 rounded-full mb-2"
                 :class="selectedMode === 'physical-count' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span class="text-sm font-medium"
                  :class="selectedMode === 'physical-count' ? 'text-purple-700' : 'text-gray-700'">
              Physical Count
            </span>
            <span v-if="selectedMode === 'physical-count'" class="mt-1 text-xs text-purple-600 font-medium">
              ✓ Selected
            </span>
          </label>
        </div>
        
        <!-- Mode Description -->
        <div class="mt-4 p-3 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-700 mb-1">
            Current Mode: 
            <span :class="getModeClass()">
              {{ getModeDescription() }}
            </span>
          </p>
          <p class="text-xs text-gray-600">
            {{ getModeInstructions() }}
          </p>
        </div>
      </div>
    </div>

    <div>
      <Search /> 
      <label class="block text-lg font-semibold text-gray-700 mb-3">
        Scan User Barcode
      </label>
    </div>
    <div class="flex">
      <SearchUser
        @user-barcode="handleUserBarcode"
      />
      <input
        ref="barcodeInput"
        v-model="currentBarcode"
        type="text"
        class="flex-1 p-4 text-lg border-2 border-l-0 border-blue-200 rounded-r-xl focus:border-blue-500 focus:outline-none"
        placeholder="Scan user barcode here..."
        @keyup.enter="processUserBarcode"
        autofocus
      />
    </div>

    <!-- Mode Indicator -->
    <div class="mt-3 text-center">
      <span class="px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2" 
            :class="getModeIndicatorClass()">
        <span v-if="selectedMode === 'stock-out'">
          📤 Stock Out Mode
        </span>
        <span v-else-if="selectedMode === 'stock-in'">
          📥 Stock In Mode
        </span>
        <span v-else>
          📋 Physical Count Mode
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import axios from 'axios'
import { Alert, BearToken } from '@/views/Utility/Helper'
import { VUE_APP_API_URL } from '@/views/Utility/Global'
import Swal from 'sweetalert2'
import Search from './Actions/Search.vue'
import SearchUser from './Actions/SearchUser.vue'

// Props
const props = defineProps({
  isLoggedIn: Boolean,
  userData: Object
})

// Emits
const emit = defineEmits(['login-success', 'update:isLoggedIn', 'update:userData', 'update:mode'])

// Refs
const barcodeInput = ref(null)
const currentBarcode = ref('')
const selectedMode = ref('stock-out') // Default mode
const isFromSearchUser = ref(false)

// Handle emitted barcode from SearchUser component
const handleUserBarcode = async (barcode) => {
  if (barcode && barcode.trim()) {
    // Mark that this barcode is from SearchUser (not manual typing)
    isFromSearchUser.value = true
    
    // Set the barcode value
    currentBarcode.value = barcode
    
    // Focus on input to show the barcode
    await nextTick()
    barcodeInput.value?.focus()
    
    // Submit immediately since it's from SearchUser
    processUserBarcode()
  }
}

// Change mode function
const changeMode = (mode) => {
  if (selectedMode.value === mode) return // Already selected
  
  selectedMode.value = mode
  emit('update:mode', mode)
}

// Get mode class for styling
const getModeClass = () => {
  switch (selectedMode.value) {
    case 'stock-out': return 'text-blue-600 font-semibold'
    case 'stock-in': return 'text-green-600 font-semibold'
    case 'physical-count': return 'text-purple-600 font-semibold'
    default: return 'text-gray-700'
  }
}

// Get mode description
const getModeDescription = () => {
  switch (selectedMode.value) {
    case 'stock-out': return 'Stock Out (Remove items from inventory)'
    case 'stock-in': return 'Stock In (Add items to inventory)'
    case 'physical-count': return 'Physical Count (Count physical inventory)'
    default: return 'Select a mode'
  }
}

// Get mode instructions
const getModeInstructions = () => {
  switch (selectedMode.value) {
    case 'stock-out': return 'Scan items to remove them from warehouse inventory. Use for sales, transfers, or wastage.'
    case 'stock-in': return 'Scan items to add them to warehouse inventory. Use for receiving, returns, or production.'
    case 'physical-count': return 'Scan items to count physical inventory. Compare actual counts with system records.'
    default: return 'Please select an operation mode above'
  }
}

// Get mode indicator class
const getModeIndicatorClass = () => {
  switch (selectedMode.value) {
    case 'stock-out': return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'stock-in': return 'bg-green-100 text-green-800 border border-green-200'
    case 'physical-count': return 'bg-purple-100 text-purple-800 border border-purple-200'
    default: return 'bg-gray-100 text-gray-800'
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

// Process user barcode
const processUserBarcode = async () => {
  if (!currentBarcode.value.trim()) {
    Alert("error", "Error", "Please scan a barcode")
    return
  }

  // Show processing popup for user verification
  showProcessingPopup("Verifying User", "Checking user credentials...")

  try {
    const response = await axios.post(
      `${VUE_APP_API_URL}test-verify-barcode`,
      { barcode_token: currentBarcode.value.trim() }
    )
    console.log("processUserBarcode")
    console.log(response)

    closeProcessingPopup()

    if (response.data.error) {
      Alert("error", "Error", response.data.message)
    } else {
      const user = response.data.data
      
      // Check user permissions if needed
      // You can add permission checks here based on selectedMode
      // localStorage.setItem('device_warehouse_id', 0);

      Alert("success", "Success", `Login successful! Mode: ${
        selectedMode.value === 'stock-out' ? 'Stock Out' : 
        selectedMode.value === 'stock-in' ? 'Stock In' : 'Physical Count'
      }`)
      emit('update:userData', user)
      emit('update:isLoggedIn', true)
      emit('login-success', { user, mode: selectedMode.value })
      
      // Clear barcode after successful login
      currentBarcode.value = ''
    }
  } catch (error) {
    closeProcessingPopup()
    Alert("error", "Error", error.response?.data?.message || 'Login failed')
    // Don't clear barcode on error so user can try again
  }
  
  // Reset the flag
  isFromSearchUser.value = false
}

// Expose methods if needed
defineExpose({
  focusInput: () => barcodeInput.value?.focus(),
  selectedMode,
  handleUserBarcode
})
</script>