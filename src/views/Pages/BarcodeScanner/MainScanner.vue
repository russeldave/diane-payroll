<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8 overflow-auto">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-10">
        <h1 
          class="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
          v-html="isLoggedIn 
            ? (currentMode === 'stock-out' 
                ? `Stock <span class='text-blue-600'>Out</span>` 
                : currentMode === 'stock-in'
                  ? `Stock <span class='text-green-600'>In</span>`
                  : `Physical <span class='text-purple-600'>Count</span>`)
            : 'Scan to Login'"
        >
        </h1>

        <p v-if="isLoggedIn && userData" class="text-gray-600">
          Welcome, {{ userData.name || 'User' }}
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Login Component -->
        <LoginScanner
          v-if="!isLoggedIn"
          v-model:isLoggedIn="isLoggedIn"
          v-model:userData="userData"
          @login-success="handleLoginSuccess"
          @update:mode="currentMode = $event"
          ref="loginComponent"
        />
        
        <!-- Stock Out Component -->
        <StockOutComponent
          v-else-if="currentMode === 'stock-out'"
          :isLoggedIn="isLoggedIn"
          :userData="userData"
          @logout="handleLogout"
          @update:selectedWarehouse="selectedWarehouse = $event"
          @warehouses-loaded="handleWarehousesLoaded"
          ref="stockOutComponent"
        />
        
        <!-- Stock In Component -->
        <StockInComponent
          v-else-if="currentMode === 'stock-in'"
          :isLoggedIn="isLoggedIn"
          :userData="userData"
          @logout="handleLogout"
          @update:selectedWarehouse="selectedWarehouse = $event"
          ref="stockInComponent"
        />
        
        <!-- Physical Count Component -->
        <PhysicalCountComponent
          v-else
          :isLoggedIn="isLoggedIn"
          :userData="userData"
          @logout="handleLogout"
          @update:selectedWarehouse="selectedWarehouse = $event"
          ref="physicalCountComponent"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import LoginScanner from './LoginScanner.vue'
import StockOutComponent from './StockOutComponent.vue'
import StockInComponent from './StockInComponent.vue'
import PhysicalCountComponent from './PhysicalCountComponent.vue'
import { Alert } from '@/views/Utility/Helper'

// Refs
const isLoggedIn = ref(false)
const userData = ref(null)
const selectedWarehouse = ref('0')
const loginComponent = ref(null)
const stockOutComponent = ref(null)
const stockInComponent = ref(null)
const physicalCountComponent = ref(null)
const currentMode = ref('stock-out') // Default mode

// Handle login success
const handleLoginSuccess = ({ user, mode }) => {
  currentMode.value = mode
  
  // Focus on appropriate component input after login
  nextTick(() => {
    if (currentMode.value === 'stock-out' && stockOutComponent.value) {
      stockOutComponent.value.initWarehouses()
    } else if (currentMode.value === 'stock-in' && stockInComponent.value) {
      stockInComponent.value.initWarehouses()
    } else if (currentMode.value === 'physical-count' && physicalCountComponent.value) {
      physicalCountComponent.value.initWarehouses()
    }
  })
}

// Handle logout
const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    isLoggedIn.value = false
    userData.value = null
    selectedWarehouse.value = '0'
    currentMode.value = 'stock-out' // Reset to default mode
    Alert("success", "Logged Out", "Successfully logged out")
    
    // Focus on login input after logout
    nextTick(() => {
      if (loginComponent.value) {
        loginComponent.value.focusInput()
      }
    })
  }
}

// Handle warehouses loaded
const handleWarehousesLoaded = (warehouses) => {
  console.log('Warehouses loaded:', warehouses)
}

// Check if element is a dropdown or select element
const isDropdownElement = (element) => {
  if (!element) return false
  
  // Check the element itself
  const tagName = element.tagName.toLowerCase()
  if (tagName === 'select' || 
      tagName === 'option' || 
      element.getAttribute('role') === 'combobox' ||
      element.closest('[role="listbox"]') ||
      element.closest('.select-dropdown') ||
      tagName === 'textarea'||
      element.closest('.dropdown') ||
      element.closest('.q-select') ||
      element.closest('.v-select')) {
    return true
  }
  
  // Check for common dropdown classes (add more if needed)
  const classList = element.classList
  if (classList.contains('select') || 
      classList.contains('dropdown') ||
      classList.contains('select__dropdown') ||
      classList.contains('select-options') ||
      classList.contains('searchUser') ||
      classList.contains('dropdown-menu') ||
      classList.contains('dropdown-content')) {
    return true
  }
  
  return false
}

// Auto-focus on login input when mounted
onMounted(() => {
  nextTick(() => {
    if (loginComponent.value && !isLoggedIn.value) {
      loginComponent.value.focusInput()
    }
  })
  
  // Modified auto-focus logic
  document.addEventListener('click', (e) => {
    // Don't run auto-focus if clicking on dropdown/select elements
    if (isDropdownElement(e.target)) {
      return
    }
    
    // Also check if the click target is inside a dropdown
    if (e.target.closest('select') || 
        e.target.closest('[role="listbox"]') ||
        e.target.closest('.dropdown-menu') ||
        e.target.closest('.select-dropdown')) {
      return
    }
    
    // Don't run auto-focus if clicking on mode toggle checkboxes
    if (e.target.type === 'checkbox' || e.target.closest('label')) {
      return
    }
    
    // Original logic for non-dropdown elements
    if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('.zoom-on-view')) {
      if (isLoggedIn.value && selectedWarehouse.value !== '0') {
        if (currentMode.value === 'stock-out' && stockOutComponent.value) {
          stockOutComponent.value.focusInput()
        } else if (currentMode.value === 'stock-in' && stockInComponent.value) {
          stockInComponent.value.focusInput()
        }
      } else if (!isLoggedIn.value && loginComponent.value) {
        loginComponent.value.focusInput()
      }
    }
  })
})
</script>