<template>
  <!-- Complete Button -->
  <button
    @click="openModal"
    class="px-4 py-2.5 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg float-end transition-colors flex items-center gap-2"
    :disabled="!isEnabled"
    :class="{ 'opacity-50 cursor-not-allowed': !isEnabled }"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    Complete Process
  </button>

  <!-- Complete Modal -->
  <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>
      
      <!-- Modal -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Scan User Barcode
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-600 mb-4">
                  Scan user barcode to complete 
                  <span class="font-semibold capitalize">{{ menuType }}</span> for 
                  <span class="font-semibold capitalize">{{ room }}</span>
                </p>
                
                <!-- Debug info (remove in production) -->
                <!-- <div v-if="debug" class="mb-2 p-2 bg-yellow-50 text-xs text-yellow-800 rounded">
                  <p>menuType: "{{ menuType }}"</p>
                  <p>room: "{{ room }}"</p>
                  <p>itemCount: {{ itemCount }}</p>
                  <p>isEnabled: {{ isEnabled }}</p>
                </div> -->
                
                <!-- Barcode Input -->
                <div class="mb-4">
                  <input
                    ref="barcodeInput"
                    v-model="barcode"
                    type="text"
                    class="w-full p-4 text-xl border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-600"
                    placeholder="Scan barcode here..."
                    @keyup.enter="processBarcode"
                    :disabled="isProcessing"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="processBarcode"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="!barcode.trim() || isProcessing"
            :class="{ 'opacity-50 cursor-not-allowed': !barcode.trim() || isProcessing }"
          >
            <span v-if="isProcessing">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Complete</span>
          </button>
          <button
            type="button"
            @click="closeModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="isProcessing"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import axios from 'axios'
import { Alert } from '@/views/Utility/Helper'
import { VUE_APP_API_URL } from '@/views/Utility/Global'
import Swal from 'sweetalert2'

const props = defineProps({
  menuType: {
    type: String,
    default: ''
  },
  room: {
    type: String,
    default: ''
  },
  roomId: {
    type: [String, Number],
    default: 0
  },
  itemCount: {
    type: Number,
    default: 0
  },
  userId: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  },
  onComplete: {
    type: Function,
    default: () => {}
  },
  onRefresh: {
    type: Function,
    default: () => {}
  },
  debug: { // Add debug prop for troubleshooting
    type: Boolean,
    default: true // Set to false in production
  }
})

const emit = defineEmits(['completed'])

// State
const showModal = ref(false)
const barcode = ref('')
const isProcessing = ref(false)
const barcodeInput = ref(null)

// Computed
const isEnabled = computed(() => {
  return props.menuType && props.room && props.itemCount > 0
})

// Methods
const openModal = () => {
  console.log('Open modal called', {
    menuType: props.menuType,
    room: props.room,
    itemCount: props.itemCount,
    isEnabled: isEnabled.value
  })
  
  if (!isEnabled.value) {
    Alert("warning", "Cannot Complete", 
      props.menuType && props.room 
        ? "No items to complete for this room and type"
        : "Please select menu type and room first"
    )
    return
  }
  
  showModal.value = true
  barcode.value = ''
  isProcessing.value = false
  
  // Focus on barcode input
  nextTick(() => {
    if (barcodeInput.value) {
      barcodeInput.value.focus()
    }
  })
}

const closeModal = () => {
  if (!isProcessing.value) {
    showModal.value = false
    barcode.value = ''
  }
}

const processBarcode = async () => {
  if (!barcode.value.trim()) {
    Alert("error", "Error", "Please scan a barcode")
    return
  }
  
  isProcessing.value = true
  
  try {
    // Show loading
    Swal.fire({
      title: "Processing...",
      text: "Completing the process",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    })
    
    // Call complete API
    const formData = new FormData()
    formData.append('userBarcode', barcode.value.trim())
    formData.append('menuType', props.menuType)
    formData.append('room', props.room)
    formData.append('roomId', props.roomId.toString())
    formData.append('userId', props.userId)
    formData.append('completedBy', props.userName)
    formData.append('itemCount', props.itemCount.toString())
    
    // For testing, comment this out and use mock response
    const response = await axios.post(
      `${VUE_APP_API_URL}complete-selected-menu`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    // Mock response for testing (remove in production)
    // const response = { data: { success: true, message: "Process completed" } }
    
    Swal.close()
    
    if (response.data.error) {
      Alert("error", "Failed", response.data.message)
      return
    }
    
    // Success
    await Swal.fire({
      title: "Success!",
      text: `Process completed for ${props.room}`,
      icon: "success",
      confirmButtonText: "OK"
    })
    
    // Close modal
    closeModal()
    
    // Emit event
    emit('completed', {
      barcode: barcode.value.trim(),
      menuType: props.menuType,
      room: props.room,
      roomId: props.roomId,
      timestamp: new Date().toISOString()
    })
    
    // Call callbacks
    if (typeof props.onComplete === 'function') {
      props.onComplete()
    }
    
    if (typeof props.onRefresh === 'function') {
      await props.onRefresh()
    }
    
  } catch (error) {
    Swal.close()
    console.error("Complete process error:", error)
    Alert("error", "Error", "Failed to complete process")
  } finally {
    isProcessing.value = false
  }
}

// Expose methods
defineExpose({
  open: openModal,
  close: closeModal
})
</script>