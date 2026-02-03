<template>
  <div v-if="!isLoggedIn">
    <!-- Menu Scanner Section -->
    <!-- <div class="mb-6">
      <div class="bg-white rounded-xl shadow-md p-6 mb-4 border border-gray-200">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">
            Scan for <span class="text-blue-600">Menus</span>
          </h2>
          <p class="text-gray-600">
            Scan your user barcode to access available menus
          </p>
        </div>
      </div>
    </div> -->

    <!-- User Barcode Scanner -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <label class="block text-lg font-semibold text-gray-700">
          Scan Your User Barcode
        </label>
        <span class="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
          Step 1 of 2
        </span>
      </div>
      
      <div class="flex">
        <!-- Search User Component -->
        <SearchUser
          @user-barcode="handleUserBarcode"
          class="flex-shrink-0"
        />
        
        <!-- Barcode Input -->
        <input
          ref="barcodeInput"
          v-model="currentBarcode"
          type="text"
          class="flex-1 p-4 text-lg border-2 border-l-0 border-blue-200 rounded-r-xl focus:border-blue-500 focus:outline-none transition-all"
          placeholder="Scan user barcode here..."
          @keyup.enter="processUserBarcode"
          autofocus
        />
      </div>
      
      <!-- Instructions -->
      <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p class="text-sm text-blue-700 flex items-start">
          <svg class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <span>
            Scan your user barcode first. After successful login, you'll be redirected to the Menu Scanner where you can scan menu QR codes to access different features.
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import axios from 'axios'
import { Alert, BearToken } from '@/views/Utility/Helper'
import { VUE_APP_API_URL } from '@/views/Utility/Global'
import Swal from 'sweetalert2'
import SearchUser from '../BarcodeScanner/Actions/SearchUser.vue'

// Props
const props = defineProps({
  isLoggedIn: Boolean,
  userData: Object
})

// Emits
const emit = defineEmits(['login-success', 'update:isLoggedIn', 'update:userData'])

// Refs
const barcodeInput = ref(null)
const currentBarcode = ref('')
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
      `${VUE_APP_API_URL}test-verify-barcode-2`,
      { barcode_token: currentBarcode.value.trim() }
    )
    console.log("processUserBarcode")
    console.log(response)

    closeProcessingPopup()

    if (response.data.error) {
      Alert("error", "Error", response.data.message)
    } else {
      const user = response.data.data
      
      // Login successful - user will be redirected to menu scanner
      Alert("success", "Login Successful!", `Welcome ${user.name || 'User'}! You can now scan menu QR codes.`)
      
      emit('update:userData', user)
      emit('update:isLoggedIn', true)
      emit('login-success', { user })
      
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

// Expose methods
defineExpose({
  focusInput: () => {
    if (barcodeInput.value) {
      barcodeInput.value.focus()
      barcodeInput.value.select()
    }
  }
})
</script>

<style scoped>
/* Add any custom styles if needed */
</style>