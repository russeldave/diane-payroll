<template>
  <div class="min-h-screen bg-green-200 overflow-auto">
    <div class="max-w-8xl mx-auto">
      <!-- <div class="text-center mb-10">
        <h1 
          class="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
          v-html="isLoggedIn 
            ? `Scan for <span class='text-blue-600'>Menus</span>`
            : 'Scan to Login'"
        >
        </h1>

        <p v-if="isLoggedIn && userData" class="text-gray-600">
          Welcome, {{ userData.name || 'User' }}
        </p>
      </div> -->

      <div class="bg-white rounded-2xl shadow-xl ">
        <!-- Login Component -->
        <LoginScanner
          v-if="!isLoggedIn"
          v-model:isLoggedIn="isLoggedIn"
          v-model:userData="userData"
          @login-success="handleLoginSuccess"
          ref="loginComponent"
        />
        
        <!-- Menu Scanner Component -->
        <MenuScannerComponent
          v-else
          :isLoggedIn="isLoggedIn"
          :userData="userData"
          @logout="handleLogout"
          @menu-selected="handleMenuSelected"
          ref="menuScannerComponent"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import LoginScanner from './LoginScanner.vue'
import MenuScannerComponent from './MenuScannerComponent.vue'
import { Alert } from '@/views/Utility/Helper'

// Refs
const isLoggedIn = ref(false)
const userData = ref(null)
const loginComponent = ref(null)
const menuScannerComponent = ref(null)

// Handle login success
const handleLoginSuccess = ({ user }) => {
  // Focus on menu scanner after login
  nextTick(() => {
    if (menuScannerComponent.value) {
      menuScannerComponent.value.focusInput()
    }
  })
}

// Handle menu selection
const handleMenuSelected = (menu) => {
  console.log('Menu selected:', menu)
  // Here you can handle the selected menu action
  // For example, you could navigate to different components based on menu
  Alert("success", "Menu Selected", `Selected: ${menu.name}`)
}

// Handle logout
const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    isLoggedIn.value = false
    userData.value = null
    Alert("success", "Logged Out", "Successfully logged out")
    
    // Focus on login input after logout
    nextTick(() => {
      if (loginComponent.value) {
        loginComponent.value.focusInput()
      }
    })
  }
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

// Auto-focus on appropriate input when mounted
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
      if (isLoggedIn.value && menuScannerComponent.value) {
        menuScannerComponent.value.focusInput()
      } else if (!isLoggedIn.value && loginComponent.value) {
        loginComponent.value.focusInput()
      }
    }
  })
})
</script>