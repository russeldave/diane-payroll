<template>
  <div class="min-h-screen">
    <!-- Menu Type Selection (Serve/Leftover) -->
    <div class="mb-6">
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4 text-center">
          Select Menu Type
        </h2>
        
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Serve Option -->
          <div class="flex-1">
            <label class="flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg"
                   :class="selectedMenuType === 'serve' 
                     ? 'border-blue-500 bg-blue-50' 
                     : 'border-gray-200 hover:border-gray-300'">
              <input 
                type="radio"
                v-model="selectedMenuType"
                value="serve"
                class="sr-only"
                @change="handleMenuTypeChange"
              >
              <div class="flex items-center justify-center w-16 h-16 rounded-full mb-4"
                   :class="selectedMenuType === 'serve' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-center mb-2"
                  :class="selectedMenuType === 'serve' ? 'text-blue-700' : 'text-gray-700'">
                Serve
              </h3>
              <p class="text-sm text-center text-gray-600">
                Items to be served to customers
              </p>
              <span v-if="selectedMenuType === 'serve'" class="mt-3 text-xs text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full">
                ✓ Active
              </span>
            </label>
          </div>
          
          <!-- Leftover Option -->
          <div class="flex-1">
            <label class="flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg"
                   :class="selectedMenuType === 'leftover' 
                     ? 'border-orange-500 bg-orange-50' 
                     : 'border-gray-200 hover:border-gray-300'">
              <input 
                type="radio"
                v-model="selectedMenuType"
                value="leftover"
                class="sr-only"
                @change="handleMenuTypeChange"
              >
              <div class="flex items-center justify-center w-16 h-16 rounded-full mb-4"
                   :class="selectedMenuType === 'leftover' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-center mb-2"
                  :class="selectedMenuType === 'leftover' ? 'text-orange-700' : 'text-gray-700'">
                Leftover
              </h3>
              <p class="text-sm text-center text-gray-600">
                Items remaining after service
              </p>
              <span v-if="selectedMenuType === 'leftover'" class="mt-3 text-xs text-orange-600 font-medium bg-orange-100 px-3 py-1 rounded-full">
                ✓ Active
              </span>
            </label>
          </div>
        </div>
        
        <!-- Selected Type Info -->
        <div v-if="selectedMenuType" 
                class="mt-6 py-2 px-4 rounded-lg text-center"
                :class="[
                  selectedMenuType === 'serve' 
                    ? 'bg-blue-100 text-blue-700 border border-4 border-blue-200' 
                    : 'bg-orange-100 text-orange-700 border border-4  border-orange-200',
                  isMobile ? 'fixed top-0 right-4 z-50 p-2 mt-0 animate-pulse ' : ''
                ]">
              
              <!-- Desktop/Tablet View -->
              <div v-if="!isMobile">
                <p class="font-semibold text-lg">
                  Mode: <span class="capitalize">{{ selectedMenuType }}</span>
                </p>
                <p class="text-sm mt-1">
                  {{ selectedMenuType === 'serve' 
                      ? 'Scanning items to serve to customers' 
                      : 'Scanning leftover items after service' }}
                </p>
              </div>
              
              <!-- Mobile View - Only shows the span -->
              <div v-else class="flex items-center">
                <span class="font-bold text-[2rem] capitalize">{{ selectedMenuType }}</span>
              </div>
          </div>
      </div>
    </div>

    <!-- Room Selection Header -->
    <div class="mb-8 bg-red-200">
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4 text-center">
          Select Room to Scan (One Item per Room)
        </h2>
        <div class="flex justify-center md:justify-end">
          <button
            @click="refreshRooms"
            class="px-4 py-2.5 text-sm mb-3 font-medium bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors flex items-center gap-2"
            :disabled="isLoadingRooms"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span v-if="isLoadingRooms">Refreshing...</span>
            <span v-else>Refresh Rooms</span>
          </button>
        </div>
        <!-- Room Checkboxes -->
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <!-- Rafah -->
        <label class="flex flex-col items-center p-4 rounded-xl transition-all duration-200"
            :class="getRoomClass('rafah')"
            :style="{ cursor: hasEvent('rafah') ? 'pointer' : 'not-allowed' }">
        <input 
            type="checkbox"
            v-model="selectedRooms.rafah"
            class="sr-only"
            @change="hasEvent('rafah') ? handleRoomToggle('rafah') : null"
            :disabled="!hasEvent('rafah')"
        >
        <div class="flex items-center justify-center w-auto h-auto p-3 rounded-full mb-3 relative"
            :class="getRoomIconClass('rafah')">
            <span class="text-lg font-bold">Rafah ({{ roomIds.rafah }})</span>
        </div>
        <span class="text-sm font-semibold text-center"
                :class="getRoomTextClass('rafah')">
            <div v-if="getEventName('rafah')" class="mt-1 text-xs font-normal max-w-[120px] truncate" 
                :title="getEventName('rafah')">
            {{ getEventName('rafah') }}
            </div>
            <div v-else class="text-xs text-gray-500 mt-1">
            No event
            </div>
        </span>
        <span v-if="selectedRooms.rafah" class="mt-1 text-sm text-blue-600 font-bold">
            Active
        </span>
        </label>

        <!-- Leonne1 -->
        <label class="flex flex-col items-center p-4 rounded-xl transition-all duration-200"
            :class="getRoomClass('leonne1')"
            :style="{ cursor: hasEvent('leonne1') ? 'pointer' : 'not-allowed' }">
        <input 
            type="checkbox"
            v-model="selectedRooms.leonne1"
            class="sr-only"
            @change="hasEvent('leonne1') ? handleRoomToggle('leonne1') : null"
            :disabled="!hasEvent('leonne1')"
        >
        <div class="flex items-center justify-center w-auto h-auto p-3 rounded-full mb-3 relative"
            :class="getRoomIconClass('leonne1')">
            <span class="text-lg font-bold">Leonne1</span>
        </div>
        <span class="text-sm font-semibold text-center"
                :class="getRoomTextClass('leonne1')">
            <div v-if="getEventName('leonne1')" class="mt-1 text-xs font-normal max-w-[120px] truncate" 
                :title="getEventName('leonne1')">
            {{ getEventName('leonne1') }}
            </div>
            <div v-else class="text-xs text-gray-500 mt-1">
            No event
            </div>
        </span>
        <span v-if="selectedRooms.leonne1" class="mt-1 text-sm text-blue-600 font-bold">
            Active
        </span>
        </label>

        <!-- Arianne -->
        <label class="flex flex-col items-center p-4 rounded-xl transition-all duration-200"
            :class="getRoomClass('arianne')"
            :style="{ cursor: hasEvent('arianne') ? 'pointer' : 'not-allowed' }">
        <input 
            type="checkbox"
            v-model="selectedRooms.arianne"
            class="sr-only"
            @change="hasEvent('arianne') ? handleRoomToggle('arianne') : null"
            :disabled="!hasEvent('arianne')"
        >
        <div class="flex items-center justify-center w-auto h-auto p-3 rounded-full mb-3 relative"
            :class="getRoomIconClass('arianne')">
            <span class="text-lg font-bold">Arianne</span>
        </div>
        <span class="text-sm font-semibold text-center"
                :class="getRoomTextClass('arianne')">
            <div v-if="getEventName('arianne')" class="mt-1 text-xs font-normal max-w-[120px] truncate" 
                :title="getEventName('arianne')">
            {{ getEventName('arianne') }}
            </div>
            <div v-else class="text-xs text-gray-500 mt-1">
            No event
            </div>
        </span>
        <span v-if="selectedRooms.arianne" class="mt-1 text-sm text-blue-600 font-bold">
            Active
        </span>
        </label>

        <!-- Leonne2 -->
        <label class="flex flex-col items-center p-4 rounded-xl transition-all duration-200"
            :class="getRoomClass('leonne2')"
            :style="{ cursor: hasEvent('leonne2') ? 'pointer' : 'not-allowed' }">
        <input 
            type="checkbox"
            v-model="selectedRooms.leonne2"
            class="sr-only"
            @change="hasEvent('leonne2') ? handleRoomToggle('leonne2') : null"
            :disabled="!hasEvent('leonne2')"
        >
        <div class="flex items-center justify-center w-auto h-auto p-3 rounded-full mb-3 relative"
            :class="getRoomIconClass('leonne2')">
            <span class="text-lg font-bold">Leonne2</span>
        </div>
        <span class="text-sm font-semibold text-center"
                :class="getRoomTextClass('leonne2')">
            <div v-if="getEventName('leonne2')" class="mt-1 text-xs font-normal max-w-[120px] truncate" 
                :title="getEventName('leonne2')">
            {{ getEventName('leonne2') }}
            </div>
            <div v-else class="text-xs text-gray-500 mt-1">
            No event
            </div>
        </span>
        <span v-if="selectedRooms.leonne2" class="mt-1 text-sms text-blue-600 font-bold">
            Active
        </span>
        </label>

        <!-- Leah 1 -->
        <label class="flex flex-col items-center p-4 rounded-xl transition-all duration-200"
            :class="getRoomClass('leah1')"
            :style="{ cursor: hasEvent('leah1') ? 'pointer' : 'not-allowed' }">
        <input 
            type="checkbox"
            v-model="selectedRooms.leah1"
            class="sr-only"
            @change="hasEvent('leah1') ? handleRoomToggle('leah1') : null"
            :disabled="!hasEvent('leah1')"
        >
        <div class="flex items-center justify-center w-auto h-auto p-3 rounded-full mb-3 relative"
            :class="getRoomIconClass('leah1')">
            <span class="text-lg font-bold">Leah 1</span>
        </div>
        <span class="text-sm font-semibold text-center"
                :class="getRoomTextClass('leah1')">
            <div v-if="getEventName('leah1')" class="mt-1 text-xs font-normal max-w-[120px] truncate" 
                :title="getEventName('leah1')">
            {{ getEventName('leah1') }}
            </div>
            <div v-else class="text-xs text-gray-500 mt-1">
            No event
            </div>
        </span>
        <span v-if="selectedRooms.leah1" class="mt-1 text-sm text-blue-600 font-medium">
            Active
        </span>
        </label>

        <!-- Leah 2 -->
        <label class="flex flex-col items-center p-4 rounded-xl transition-all duration-200"
            :class="getRoomClass('leah2')"
            :style="{ cursor: hasEvent('leah2') ? 'pointer' : 'not-allowed' }">
        <input 
            type="checkbox"
            v-model="selectedRooms.leah2"
            class="sr-only"
            @change="hasEvent('leah2') ? handleRoomToggle('leah2') : null"
            :disabled="!hasEvent('leah2')"
        >
        <div class="flex items-center justify-center w-auto h-auto p-3 rounded-full mb-3 relative"
            :class="getRoomIconClass('leah2')">
            <span class="text-lg font-bold">Leah 2</span>
        </div>
        <span class="text-sm font-semibold text-center"
                :class="getRoomTextClass('leah2')">
            <div v-if="getEventName('leah2')" class="mt-1 text-xs font-normal max-w-[120px] truncate" 
                :title="getEventName('leah2')">
            {{ getEventName('leah2') }}
            </div>
            <div v-else class="text-xs text-gray-500 mt-1">
            No event
            </div>
        </span>
        <span v-if="selectedRooms.leah2" class="mt-1 text-sm text-blue-600 font-medium">
            Active
        </span>
        </label>

        <!-- Buffet -->
        <label class="flex flex-col items-center p-4 rounded-xl transition-all duration-200"
            :class="getRoomClass('buffet')"
            :style="{ cursor: hasEvent('buffet') ? 'pointer' : 'not-allowed' }">
        <input 
            type="checkbox"
            v-model="selectedRooms.buffet"
            class="sr-only"
            @change="hasEvent('buffet') ? handleRoomToggle('buffet') : null"
            :disabled="!hasEvent('buffet')"
        >
        <div class="flex items-center justify-center w-auto h-auto p-3 rounded-full mb-3 relative"
            :class="getRoomIconClass('buffet')">
            <span class="text-lg font-bold">Buffet</span>
        </div>
        <span class="text-sm font-semibold text-center"
                :class="getRoomTextClass('buffet')">
            <div v-if="getEventName('buffet')" class="mt-1 text-xs font-normal max-w-[120px] truncate" 
                :title="getEventName('buffet')">
            {{ getEventName('buffet') }}
            </div>
            <div v-else class="text-xs text-gray-500 mt-1">
            No event
            </div>
        </span>
        <span v-if="selectedRooms.buffet" class="mt-1 text-sm text-blue-600 font-medium">
            Active
        </span>
        </label>
        </div>
        
        <!-- Room Status Indicators -->
        <!-- <div class="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <div v-for="room in Object.keys(selectedRooms)" :key="room" 
               class="text-center p-2 rounded-lg bg-gray-50">
            <span class="text-xs font-semibold capitalize">{{ room }}</span>
            <div class="flex justify-center gap-1 mt-1">
              <span v-if="filteredSubmittedItems.some(item => item.room === room && item.menuType === 'serve')" 
                    class="text-xs px-1 bg-blue-100 text-blue-800 rounded">
                S✓
              </span>
              <span v-if="filteredSubmittedItems.some(item => item.room === room && item.menuType === 'leftover')" 
                    class="text-xs px-1 bg-orange-100 text-orange-800 rounded">
                L✓
              </span>
            </div>
          </div>
        </div> -->
        
        <!-- Selected Room Info -->
        <div v-if="activeRoom" 
              class="mt-6  me-2 p-4 rounded-lg text-center border border-4"
              :class="[
                getActiveRoomClass(),
                isMobile ? 'fixed top-0 right-36 z-50 p-2 mt-0 animate-pulse' : ''
              ]">
            
            <template v-if="!isMobile">
              <p class="font-semibold text-lg">
                {{ selectedMenuType === 'serve' ? 'Serving to' : 'Leftover in' }}: 
                <span class="capitalize">{{ activeRoom }}</span>
                <span class="text-sm font-normal ml-2">(Room ID: {{ getRoomId(activeRoom) }})</span>
              </p>
              <p class="text-sm mt-1">
                Scan one item for this room
              </p>
            </template>
            
            <template v-else>
              <!-- Very compact mobile view -->
              <div class="flex items-center gap-1">
                <span class="font-semibold text-[2rem] capitalize truncate max-w-[30rem]">
                  Serving to: {{ activeRoom }}
                </span>
                <!-- <span class="text-xs opacity-75">({{ getRoomId(activeRoom) }})</span> -->
              </div>
            </template>
          </div>
        <div v-else class="mt-6 p-4 bg-gray-100 rounded-lg text-center">
          <p class="text-gray-600">Please select a room to scan an item</p>
        </div>
        
        <!-- Progress Indicator -->

      </div>
    </div>

    <!-- Full Width Scanner and User Info -->
    <div class="mb-1">
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div class="grid grid-cols-1">
          <!-- Scanner Input (Full Width) -->
          <div class="lg:col-span-2">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Scan Item Barcode
              </h3>
              <div class="flex items-center gap-2 mb-2">
                <span v-if="!activeRoom || !selectedMenuType" class="text- text-red-600 font-medium">
                  ⚠️ Select menu type and room first
                </span>
                <span v-else class="text-sm text-green-600 font-medium">
                  ✅ {{ selectedMenuType === 'serve' ? 'Serving to' : 'Leftover in' }} 
                  <span class="font-bold text-2xl underline italic text-red-600">
                    {{ activeRoom }} 
                  </span>
                  (Event: 
                  <span class="text-orange-500 text-2xl bold underline">
                    {{ getEventName(activeRoom) }}
                  </span>
                  )
                </span>
              </div>
            </div>
            
            <input
              ref="itemBarcodeInput"
              v-model="itemBarcode"
              type="text"
              class="w-full p-5 text-xl border-2 rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              :class="!activeRoom || !selectedMenuType 
                ? 'border-gray-300' 
                : 'border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200'"
              placeholder="Scan item barcode here..."
              @keyup.enter="processItemBarcode"
              autofocus
              :disabled="!activeRoom || !selectedMenuType"
            />
            
            <!-- <p v-if="!activeRoom || !selectedMenuType" class="text-sm text-gray-500 mt-3">
              Select menu type and room from above to start scanning
            </p> -->
            <!-- <p v-else class="text-sm text-blue-600 mt-3">
              {{ selectedMenuType === 'serve' ? 'Serving' : 'Scanning leftover' }} one item for {{ activeRoom }} room (Room ID: {{ getRoomId(activeRoom) }})
            </p> -->
          </div>
          
          <!-- User Info (Right Side) -->
          <!-- <div class="lg:col-span-1">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 h-full">
              <div class="flex flex-col h-full">
                <div class="mb-4">
                  <h3 class="text-lg font-semibold text-blue-800 mb-3">User Information</h3>
                  <div class="space-y-2">
                    <div>
                      <p class="text-sm font-medium text-blue-700">Name:</p>
                      <p class="text-xl font-bold text-blue-900">{{ userData?.userName || 'User' }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-blue-700">Employee ID:</p>
                      <p class="text-lg font-semibold text-blue-800">{{ userData?.employeeNumber || '' }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium" 
                         :class="selectedMenuType === 'serve' ? 'text-blue-600' : 'text-orange-600'">
                        Current Mode:
                      </p>
                      <p class="text-lg font-bold capitalize"
                         :class="selectedMenuType === 'serve' ? 'text-blue-700' : 'text-orange-700'">
                        {{ selectedMenuType || 'Not selected' }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div class="mt-auto pt-4 border-t border-blue-200">
                  <button
                    @click="logout"
                    class="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Split Layout: Current Item & Submitted Menus -->
    <div class="grid grid-cols-1 gap-1">
      <!-- LEFT: Current Room Item -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">
              Item for {{ activeRoom || 'Selected Room' }}
            </h3>
            <span class="text-sm text-gray-600">
              {{ currentItem ? '1 item' : 'No item' }}
            </span>
          </div>
          
          <div v-if="!activeRoom || !selectedMenuType" class="text-center py-8 text-gray-400">
            <div class="text-3xl mb-3">📋</div>
            <p>Select menu type and room to scan an item</p>
          </div>
          
          <div v-else-if="!currentItem" class="text-center py-8 text-gray-400">
            <div class="text-3xl mb-3">📦</div>
            <p>No item scanned yet</p>
            <p class="text-sm mt-2">Scan one item for this room</p>
          </div>
          
          <div v-else class="p-4 border rounded-lg hover:shadow-md transition-shadow"
               :class="getItemBorderClass()">
            <div class="flex items-start gap-4">
              <!-- Item Image -->
              <div class="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <div v-if="currentItem.thumbNail" class="w-full h-full">
                  <ZoomOnView
                    :item_id="currentItem.itemId"
                    :thumbnail="currentItem.thumbNail"
                    :canDeleteImage="false"
                    class="w-full h-full"
                  />
                </div>
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  📦
                </div>
              </div>
              
              <!-- Item Details -->
              <div class="flex-1 min-w-0">
                <div class="flex">
                <p class="font-semibold text-gray-800" :title="currentItem.itemName">
                  {{ currentItem.itemName }}
                </p>
                <button
                    @click="removeCurrentItem"
                    class="ml-auto px-3 py-1 bg-red-500 hover:bg-red-200 text-red-700 text-sm font-medium rounded-full transition-colors"
                >
                    <i class="fa-solid fa-trash-can text-white"></i>
                </button>
                </div>
                <p class="text-sm text-gray-600 mt-1">SKU: {{ currentItem.itemSku || currentItem.sku }}</p>
                <p class="text-sm text-gray-600">Unit: {{ currentItem.unitAbbre || 0 }}</p>
                
                <!-- Quantity Input -->
                <div class="mt-3 flex items-center gap-3">
                  <button
                    @click="decreaseQuantity(currentItem)"
                    class="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-lg font-bold transition-colors"
                    :disabled="(currentItem.quantity || 0) <= 1"
                  >
                    −
                  </button>
                  
                  <input
                    type="number"
                    v-model.number="currentItem.quantity"
                    min="1"
                    @input="validateQuantity(currentItem)"
                    class="w-full text-center bg-white border border-gray-300 rounded-md py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="1"
                  />
                  
                  <button
                    @click="increaseQuantity(currentItem)"
                    class="w-8 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full text-lg font-bold transition-colors"
                  >
                    +
                  </button>
                  
                  <!-- Remove Button -->

                </div>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div v-if="activeRoom && currentItem" class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex gap-3">
              <button
                @click="removeCurrentItem"
                class="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Clear Item
              </button>
              <button
                @click="submitCurrentRoom"
                class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                :disabled="!selectedMenuType"
              >
                Submit {{ activeRoom }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Submitted Menus Table -->
      <div class="space-y-3">
        <div class="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-800">
              Submitted Items
              <span class="text-sm font-normal text-gray-600 ml-2">
                ({{ activeRoom ? `Room: ${activeRoom}` : '' }} {{ selectedMenuType ? `Type: ${selectedMenuType}` : '' }})
              </span>
            </h3>
                <div class="text-sm text-gray-600 text-center">
                  Showing {{ ((search.page_num - 1) * search.itemsperpage) + 1 }} to 
                  {{ Math.min(search.page_num * search.itemsperpage, data.totalrows) }} 
                  of {{ data.totalrows }} items
                </div>
            <!-- Refresh Button Only -->
            <div class="flex flex-wrap gap-2">
              <button
                @click="refreshSubmittedItems"
                class="px-3 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
          
          <div class="text-sm text-gray-600 mb-4 flex items-center gap-2">
            <span>Showing: {{ selectedMenuType ? selectedMenuType : 'All types' }} {{ activeRoom ? `for ${activeRoom}` : 'for all rooms' }}</span>
            <span class="ml-auto">Total: {{ filteredSubmittedItems.length }} items</span>
          </div>
          
          <div v-if="filteredSubmittedItems.length === 0" class="text-center py-12 text-gray-400">
            <div class="text-4xl mb-4">📝</div>
            <p class="text-lg">No items submitted yet</p>
            <p v-if="selectedMenuType && activeRoom" class="text-sm mt-2">
              No {{ selectedMenuType }} items submitted for {{ activeRoom }}
            </p>
            <p v-else-if="selectedMenuType" class="text-sm mt-2">
              No {{ selectedMenuType }} items submitted for any room
            </p>
            <p v-else class="text-sm mt-2">Scan and submit items to see them here</p>
          </div>
          
          <div v-else>
            <!-- Container for arrows and grid -->
            <div class="flex items-start gap-4">
              <!-- Left Arrow -->
              <div class="flex self-center">
                <button
                  @click="handlePagination(Math.max(1,  search.page_num - 1))"
                  :disabled="search.page_num <= 1"
                  class="px-4 py-8 bg-gray-200 text-gray-700 hover:bg-gray-400 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  title="Previous Page"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              <!-- Two Column Grid for Items -->
              <div class="flex-1">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="item in filteredSubmittedItems" :key="item.id"
                      class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div class="flex justify-between items-start">
                      <!-- Item Name -->
                      <div class="flex-1 min-w-0">
                        <p class="font-semibold text-xs text-gray-800 truncate" :title="item.dishesName">
                          {{ item.dishesName }}
                        </p>
                        <!-- <p class="text-xs text-gray-500 mt-1">SKU: {{ item.sku || item.itemSku }}</p> -->
                      </div>
                      
                      <!-- Quantity Section -->
                      <div class="ml-4 flex items-center gap-2">
                        <div class="flex items-center gap-2">
                          <span class="text-sm text-gray-600 font-medium">Qty:</span>
                          <input
                            type="number"
                            v-model.number="item.editableQuantity"
                            min="1"
                            @input="validateEditableQuantity(item)"
                            class="w-28 px-2 py-1 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-center"
                          />
                        </div>
                        <UpdateMenuQuantity
                          :item-id="item.id"
                          :quantity="item.quantity"
                          :new-quantity="item.editableQuantity"
                          @update-success="handleQuantityUpdateSuccess"
                          @update-error="handleQuantityUpdateError"
                          class="shrink-0"
                        />
                      </div>
                    </div>
                    
                    <!-- Additional Info (optional) -->
                    <!-- <div v-if="item.room || item.timestamp" class="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span v-if="item.room" class="capitalize">{{ item.room }}</span>
                      <span v-if="item.timestamp">{{ formatTime(item.timestamp) }}</span>
                    </div> -->
                  </div>
                </div>
              </div>

              <!-- Right Arrow -->
              <div class="flex self-center">
                <button
                  @click="handlePagination(search.page_num + 1)"
                  :disabled="search.page_num >= Math.ceil(data.totalrows / search.itemsperpage)"
                  class="px-4 py-8 bg-gray-200 text-gray-700 font-bold hover:bg-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  title="Next Page"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <!-- <CompleteProcess
              :menu-type="selectedMenuType"
              :room="activeRoom"
              :room-id="getRoomId(activeRoom)"
              :item-count="filteredSubmittedItems.length"
              :user-id="userData?.id || ''"
              :user-name="userData?.userName || ''"
              @completed="handleComplete"
              :on-refresh="refreshSubmittedItems"
              class="mt-6"
            /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import axios from 'axios'
import { Alert, AlertHtml } from '@/views/Utility/Helper'
import { VUE_APP_API_URL } from '@/views/Utility/Global'
import ZoomOnView from '../RequestIngredient/Modules/zoomOnView.vue'
import Swal from 'sweetalert2'
import Pagination from '@/views/Component/Pagination.vue'
import CompleteProcess from './Actions/CompleteProcess.vue'
import UpdateMenuQuantity from './Actions/UpdateMenuQuantity.vue'

// Props
const props = defineProps({
  isLoggedIn: Boolean,
  userData: Object
})

// Emits
const emit = defineEmits(['logout'])

// Refs
const itemBarcodeInput = ref(null)
const itemBarcode = ref('')
const scannedItems = ref([])
const submittedRooms = ref([])
const allSubmittedItems = ref([])
const isLoading = ref(false)
const isMobile = ref(window.innerWidth < 1285);
// Pagination refs
const search = ref({
  page_num: 1,
  itemsperpage: 20
})

const data = ref({
  totalrows: 0
})

const selectedRooms = ref({
  rafah: false,
  leonne1: false,
  arianne: false,
  leonne2: false,
  leah1: false,
  leah2: false,
  buffet: false
})
const selectedMenuType = ref('serve')

// Room ID mapping for the API
const roomIds = {
  rafah: 410,
  leonne1: 400,
  arianne: 402,
  leonne2: 401,
  leah1: 408,
  leah2: 409,
  buffet: 1000,
};

// Room name mapping from ID
const roomNames = {
  410: 'rafah',
  400: 'leonne1',
  402: 'arianne',
  401: 'leonne2',
  408: 'leah1',
  409: 'leah2',
  1000: 'buffet',
};


// Computed
const activeRoom = computed(() => {
  const active = Object.keys(selectedRooms.value).find(key => selectedRooms.value[key])
  return active || null
})

const currentItem = computed(() => {
  if (!activeRoom.value || !selectedMenuType.value) return null
  return scannedItems.value.find(item => 
    item.room === activeRoom.value && 
    item.menuType === selectedMenuType.value
  )
})

// Get room ID number from room name
const getRoomId = (roomName) => {
  return roomIds[roomName] || 0
}

// Get room name from room ID
const getRoomName = (roomId) => {
  return roomNames[roomId] || 'unknown'
}

// Filtered submitted items - now using paginated data
const filteredSubmittedItems = computed(() => {
  return allSubmittedItems.value || []
})

// Helper methods
const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now'
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getRoomClass = (roomName) => {
  const hasValidEvent = hasEvent.value(roomName);
  const isSelected = selectedRooms.value[roomName];
  
  // Check if room has any submitted items for the current menu type
  const hasSubmittedItems = allSubmittedItems.value.some(item => 
    item.room === roomName && item.type === selectedMenuType.value
  )
  
  if (isSelected) {
    const baseClass = 'border-4 rounded-xl cursor-pointer scale-110';
    if (hasValidEvent) {
      return `${baseClass} border-red-600 bg-amber-200`;
    }
    switch(roomName) {
      case 'rafah': return `${baseClass} border-blue-500 bg-blue-50`
      case 'leonne1': return `${baseClass} border-green-500 bg-green-50`
      case 'arianne': return `${baseClass} border-purple-500 bg-purple-50`
      case 'leonne2': return `${baseClass} border-yellow-500 bg-yellow-50`
      case 'leah1': return `${baseClass} border-pink-500 bg-pink-50`
      case 'leah2': return `${baseClass} border-rose-500 bg-rose-50`
      case 'buffet': return `${baseClass} border-teal-500 bg-teal-50`
      default: return `${baseClass} border-gray-200`
    }
  }
  
  // Room has an event - make it red and thicker border
  if (hasValidEvent) {
    const baseClass = 'border-2 rounded-xl cursor-pointer hover:shadow-lg';
    return `${baseClass} border-red-300 hover:border-red-300`;
  }
  
  // Show special styling if room has submitted items for current menu type
  if (hasSubmittedItems && selectedMenuType.value) {
    const baseClass = 'border-2 rounded-xl cursor-pointer opacity-75';
    return selectedMenuType.value === 'serve' 
      ? `${baseClass} border-blue-300 bg-blue-50` 
      : `${baseClass} border-orange-300 bg-orange-50`;
  }
  
  // Default: no event, not selected - dimmed and not clickable
  return 'border-2 border-gray-200 rounded-xl opacity-50 cursor-not-allowed';
}
const getRoomIconClass = (roomName) => {
  const baseClasses = 'flex items-center justify-center w-12 h-12 rounded-full mb-3 relative';
  const hasValidEvent = hasEvent.value(roomName);
  
  // Check if room has any submitted items for the current menu type
  const hasSubmittedItems = allSubmittedItems.value.some(item => 
    item.room === roomName && item.type === selectedMenuType.value
  )
  
  if (selectedRooms.value[roomName]) {
    if (hasValidEvent) {
      return `${baseClasses} bg-red-100 text-red-600`;
    }
    switch(roomName) {
      case 'rafah': return `${baseClasses} bg-blue-100 text-blue-600`
      case 'leonne1': return `${baseClasses} bg-green-100 text-green-600`
      case 'arianne': return `${baseClasses} bg-purple-100 text-purple-600`
      case 'leonne2': return `${baseClasses} bg-yellow-100 text-yellow-600`
      case 'leah1': return `${baseClasses} bg-pink-100 text-pink-600`
      case 'leah2': return `${baseClasses} bg-rose-100 text-rose-600`
      case 'buffet': return `${baseClasses} bg-teal-100 text-teal-600`
      default: return `${baseClasses} bg-gray-100 text-gray-500`
    }
  }
  
  // Room has an event - red styling
  if (hasValidEvent) {
    return `${baseClasses} bg-red-100 text-red-600`;
  }
  
  // Show checkmark if room has submitted items
  if (hasSubmittedItems && selectedMenuType.value) {
    return selectedMenuType.value === 'serve' 
      ? `${baseClasses} bg-blue-50 text-blue-400`
      : `${baseClasses} bg-orange-50 text-orange-400`;
  }
  
  // Default: no event - gray and disabled
  return `${baseClasses} bg-gray-100 text-gray-300`;
}

const getRoomTextClass = (roomName) => {
  const hasValidEvent = hasEvent.value(roomName);
  
  // Check if room has any submitted items for the current menu type
  const hasSubmittedItems = allSubmittedItems.value.some(item => 
    item.room === roomName && item.type === selectedMenuType.value
  )
  
  if (selectedRooms.value[roomName]) {
    if (hasValidEvent) {
      return 'text-red-700 font-bold';
    }
    switch(roomName) {
      case 'rafah': return 'text-blue-700'
      case 'leonne1': return 'text-green-700'
      case 'arianne': return 'text-purple-700'
      case 'leonne2': return 'text-yellow-700'
      case 'leah1': return 'text-pink-700'
      case 'leah2': return 'text-rose-700'
      case 'buffet': return 'text-teal-700'
      default: return 'text-gray-700'
    }
  }
  
  if (hasValidEvent) {
    return 'text-red-600 font-semibold';
  }
  
  if (hasSubmittedItems && selectedMenuType.value) {
    return selectedMenuType.value === 'serve' ? 'text-blue-600' : 'text-orange-600';
  }
  
  return 'text-gray-400';
}

const getActiveRoomClass = () => {
  const room = activeRoom.value
  if (!room) return 'bg-gray-100 text-gray-600'
  
  // Check if room has any submitted items for the current menu type
  const hasSubmittedItems = allSubmittedItems.value.some(item => 
    item.room === room && item.type === selectedMenuType.value
  )
  
  if (hasSubmittedItems && selectedMenuType.value) {
    return selectedMenuType.value === 'serve' 
      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
      : 'bg-orange-100 text-orange-700 border border-orange-200'
  }
  
  switch(room) {
    case 'rafah': return 'bg-blue-100 text-blue-700 border border-blue-200'
    case 'leonne1': return 'bg-green-100 text-green-700 border border-green-200'
    case 'arianne': return 'bg-purple-100 text-purple-700 border border-purple-200'
    case 'leonne2': return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
    case 'leah1': return 'bg-pink-100 text-pink-700 border border-pink-200'
    case 'leah2': return 'bg-rose-100 text-rose-700 border border-rose-200'
    case 'buffet': return 'bg-teal-100 text-teal-700 border border-teal-200'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getItemBorderClass = () => {
  const room = activeRoom.value
  if (!room) return 'border-gray-200'
  
  switch(room) {
    case 'rafah': return 'border-blue-200'
    case 'leonne1': return 'border-green-200'
    case 'arianne': return 'border-purple-200'
    case 'leonne2': return 'border-yellow-200'
    case 'leah1': return 'border-pink-200'
    case 'leah2': return 'border-rose-200'
    case 'buffet': return 'border-teal-200'
    default: return 'border-gray-200'
  }
}

// Fetch submitted items with pagination support
const fetchSubmittedItems = async (menuType = null, roomId = null) => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    const formData = new FormData()
    const buffetId = getBuffetIdForRoom(activeRoom.value);
    const bookingId = getBookingIdForRoom(activeRoom.value);
    // Add menuType if provided (should be 'serve' or 'leftover')
    if (menuType) {
      formData.append('menuType', menuType)
    }
    
    // Add room ID if provided (should be number like 1, 2, 3, etc.)
    if (roomId) {
      formData.append('forRoom', roomId.toString())
    }
    
    // Add pagination parameters
    formData.append('buffet_id', buffetId)
    formData.append('booking_id', bookingId)
    formData.append('page_num', search.value.page_num.toString())
    formData.append('itemsperpage', search.value.itemsperpage.toString())
    
    // Always include userId
    formData.append('userId', props.userData?.id || '')
    
    const response = await axios.post(
      `${VUE_APP_API_URL}pub-stock-get-submitted-items`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    if (response.data.error) {
      Alert("error", "Load Failed", response.data.message)
      return
    }
    
    if (response.data.data && Array.isArray(response.data.data)) {
      // Transform API response to match our expected format
      allSubmittedItems.value = response.data.data.map(item => ({
        id: item.left_over_id || item.id,
        itemId: item.ingredientId,
        itemName: item.itemName || item.name,
        sku: item.sku,
        quantity: parseFloat(item.quantity) || 1,
        editableQuantity: parseFloat(item.quantity) || 1,
        menuType: item.type, // 'serve' or 'leftover' from API
        type: item.type, // Keep original type field
        room: getRoomName(item.roomDestination), // Convert room ID to room name
        roomDestination: item.roomDestination, // Keep original room ID
        timestamp: item.dateOfServe,
        dateOfServe: item.dateOfServe,
        serveQuantity: item.serveQuantity,
        thumbNail: null,
        floatStocks: item.stocks || 0,
        ...item
      }))
      
      // Set total rows from API response
      data.value.totalrows = response.data.totalrows || 0 

      console.log('Fetched items:', allSubmittedItems.value, 'Total rows:', data.value.totalrows)
    } else {
      allSubmittedItems.value = []
      data.value.totalrows = 0
    }
    
  } catch (error) {
    console.error("Error fetching submitted items:", error)
    Alert("error", "Load Failed", "Failed to fetch submitted items")
  } finally {
    isLoading.value = false
  }
}
// Pagination handler
const handlePagination = (pageNumber) => {
  console.log("handlePagination");
  console.log(pageNumber)
  search.value.page_num = pageNumber
  fetchSubmittedItems(selectedMenuType.value, activeRoom.value ? getRoomId(activeRoom.value) : null)
}

// Menu Type Change Handler
const handleMenuTypeChange = () => {
  // Reset to first page when changing menu type
  search.value.page_num = 1
  
  // Store the current item before clearing (if any)
  const currentScannedItem = currentItem.value
  
  // Clear all selected rooms when menu type changes
  Object.keys(selectedRooms.value).forEach(key => {
    selectedRooms.value[key] = false
  })
  
  // Clear scanned items for current menu type
  scannedItems.value = scannedItems.value.filter(item => item.menuType !== selectedMenuType.value)
  
  // If there was a current item for the PREVIOUS menu type, submit it automatically
  if (currentScannedItem && currentScannedItem.menuType !== selectedMenuType.value) {
    const previousRoom = currentScannedItem.room
    const previousMenuType = currentScannedItem.menuType
    
    // Temporarily set the room and menu type back to submit
    selectedRooms.value[previousRoom] = true
    selectedMenuType.value = previousMenuType
    
    // Submit the item
    submitCurrentRoom(true).then(() => {
      // After submission, switch to new menu type
      selectedMenuType.value = selectedMenuType.value === 'serve' ? 'leftover' : 'serve'
      
      // IMPORTANT: DO NOT auto-select any room after submission
      // Keep all rooms unselected
      Object.keys(selectedRooms.value).forEach(key => {
        selectedRooms.value[key] = false
      })
      
      // Fetch items for the new menu type (no specific room)
      fetchSubmittedItems(selectedMenuType.value, null)
      
      // Focus on barcode input
      nextTick(() => {
        if (itemBarcodeInput.value) {
          itemBarcodeInput.value.focus()
        }
      })
    })
    return
  }
  
  // DO NOT auto-select any room
  // Keep all rooms unselected
  
  // Fetch items based on selected menu type (no specific room)
  fetchSubmittedItems(selectedMenuType.value, null)
  
  // Focus on barcode input
  nextTick(() => {
    if (itemBarcodeInput.value) {
      itemBarcodeInput.value.focus()
    }
  })
}

// Room Toggle Handler - FIXED: Now fetches when room is clicked
const handleRoomToggle = async (roomName) => {
  // Reset to first page when changing room
  search.value.page_num = 1
  
  const previousRoom = activeRoom.value
  
  // If switching from a room with an item, submit it first
  if (previousRoom && currentItem.value) {
    await submitCurrentRoom(true)
  }
  
  // Uncheck all other rooms
  Object.keys(selectedRooms.value).forEach(key => {
    selectedRooms.value[key] = false
  })
  
  // Check the new room
  selectedRooms.value[roomName] = true
  
  // Fetch items based on selected menu type and room
  if (selectedMenuType.value) {
    const roomId = getRoomId(roomName)
    fetchSubmittedItems(selectedMenuType.value, roomId)
  } else {
    // If no menu type selected yet, just fetch all items for this room
    const roomId = getRoomId(roomName)
    fetchSubmittedItems(null, roomId)
  }
  
  // Focus on barcode input
  nextTick(() => {
    if (itemBarcodeInput.value) {
      itemBarcodeInput.value.focus()
    }
  })
}

// Item Scanning
const processItemBarcode = async () => {
  if (!activeRoom.value || !selectedMenuType.value) {
    Alert("error", "Error", "Please select menu type and room first")
    return
  }
  
  if (!itemBarcode.value.trim()) {
    Alert("error", "Error", "Please scan an item barcode")
    return
  }
  
  // Check if there's already an item scanned for the CURRENT menu type in a DIFFERENT room
  const existingItemForCurrentType = scannedItems.value.find(item => 
    item.menuType === selectedMenuType.value && 
    item.room !== activeRoom.value
  )
  
  if (existingItemForCurrentType) {
    // There's an item in a different room for the SAME menu type
    const result = await Swal.fire({
      title: 'Item in Another Room',
      text: `You already have an item for ${existingItemForCurrentType.room} (${selectedMenuType.value}). Submit it first?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Submit and Continue',
      cancelButtonText: 'Cancel Scan'
    })
    
    if (result.isConfirmed) {
      // Submit the existing item first
      const itemRoom = existingItemForCurrentType.room
      
      // Temporarily switch to the room with the item
      Object.keys(selectedRooms.value).forEach(key => {
        selectedRooms.value[key] = false
      })
      selectedRooms.value[itemRoom] = true
      
      // Submit that item
      await submitCurrentRoom(true)
      
      // Switch back to the original room
      Object.keys(selectedRooms.value).forEach(key => {
        selectedRooms.value[key] = false
      })
      selectedRooms.value[activeRoom.value] = true
    } else {
      itemBarcode.value = ''
      return
    }
  } else if (currentItem.value) {
    // Current room already has an item for this menu type, submit it
    await submitCurrentRoom(true)
  }
  
  // Show processing popup
  Swal.fire({
    title: "Looking up Item",
    text: "Searching for item...",
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading()
  })
  
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}pub-stock-find-by-barcode-production/${itemBarcode.value.trim()}/1`,
    )
    
    Swal.close()
    
    if (response.data.error) {
      Alert("error", "Not Found", response.data.message || 'Item not found')
      return
    }
    
    const item = response.data.data
    
    scannedItems.value.push({
      ...item,
      room: activeRoom.value,
      menuType: selectedMenuType.value,
      quantity: item.count || 1,
      id: `${selectedMenuType.value}-${activeRoom.value}-${Date.now()}-${item.id}`,
      originalId: item.id,
      forRoom: getRoomId(activeRoom.value)
    })
    
    Alert("success", "Added", 
      `Added ${item.itemName} to ${activeRoom.value} (${selectedMenuType.value})`)
    
  } catch (error) {
    Swal.close()
    console.error('Error processing item:', error)
    Alert("error", "Error", "Failed to load item. Please try again.")
  }
  
  itemBarcode.value = ''
  nextTick(() => {
    if (itemBarcodeInput.value) {
      itemBarcodeInput.value.focus()
    }
  })
}

const increaseQuantity = (item) => {
  item.quantity = (item.quantity || 0) + 1
}

const decreaseQuantity = (item) => {
  if ((item.quantity || 0) > 1) {
    item.quantity = (item.quantity || 0) - 1
  }
}

const validateQuantity = (item) => {
  if (!item.quantity || item.quantity < 1) {
    item.quantity = 0
  }
}

const removeCurrentItem = () => {
  if (currentItem.value) {
    scannedItems.value = scannedItems.value.filter(item => 
      !(item.room === activeRoom.value && item.menuType === selectedMenuType.value)
    )
    Alert("success", "Removed", "Item removed from current room")
  }
}

const submitCurrentRoom = async (autoSubmit = false) => {
  if (!currentItem.value || !selectedMenuType.value) {
    if (!autoSubmit) {
      Alert("warning", "No Item", "Please scan an item before submitting")
    }
    return
  }
  
  const roomItem = {
    ...currentItem.value,
    room: activeRoom.value,
    menuType: selectedMenuType.value,
    forRoom: getRoomId(activeRoom.value),
    timestamp: new Date().toISOString()
  }
  
  if (!autoSubmit) {
    Swal.fire({
      title: "Submitting Item",
      text: `Submitting item for ${activeRoom.value} (${selectedMenuType.value})...`,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    })
  }
  
  try {
    const formData = new FormData()
    
    // Get buffetId for the current room
    const booking_id = getBookingIdForRoom(activeRoom.value);
    const buffet_id = getBuffetIdForRoom(activeRoom.value);

    console.log("Submit Current Room IN line: 1313");
    console.log(roomItem);
    formData.append('itemId', roomItem.itemId)
    formData.append('sku', roomItem.sku || roomItem.itemSku)
    formData.append('itemName', roomItem.itemName)
    formData.append('quantity', roomItem.quantity || 1)
    formData.append('room', activeRoom.value)
    formData.append('forRoom', getRoomId(activeRoom.value).toString())
    formData.append('menuType', selectedMenuType.value)
    formData.append('userId', props.userData?.userId || '')
    formData.append('employeeId', props.userData?.id || '')
    formData.append('timestamp', new Date().toISOString())
    
    // Add booking_id to the payload if it exists
    // if (booking_id) {
      formData.append('buffet_id', buffet_id)
      formData.append('booking_id', booking_id)
      console.log(`Adding booking_id ${booking_id} for room ${activeRoom.value}`)
    // } else {
    //   console.log(`No buffetId found for room ${activeRoom.value}`)
    // }
    
    const response = await axios.post(
      `${VUE_APP_API_URL}pub-submit-selected-menu`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    if (autoSubmit) {
        Swal.close()
        Alert("success", "Success", response.data.message)
      }

      if (response.data.error) {
        Alert("error", "Submission Failed", response.data.message)
        return
      }

    
    // Add to submitted rooms for local tracking
    submittedRooms.value.unshift({
      id: `${selectedMenuType.value}-${activeRoom.value}-${Date.now()}`,
      roomName: activeRoom.value,
      menuType: selectedMenuType.value,
      items: [roomItem],
      totalItems: 1,
      totalQuantity: roomItem.quantity || 1,
      timestamp: new Date().toISOString()
    })
    
    // Add to all submitted items (transformed to match API format)
    const newItem = {
      id: response.data.data?.[0]?.left_over_id || Date.now(),
      itemId: roomItem.itemId,
      itemName: roomItem.itemName,
      sku: roomItem.sku || roomItem.itemSku,
      quantity: roomItem.quantity || 1,
      menuType: selectedMenuType.value,
      type: selectedMenuType.value,
      room: activeRoom.value,
      roomDestination: getRoomId(activeRoom.value),
      timestamp: new Date().toISOString(),
      dateOfServe: new Date().toISOString(),
      serveQuantity: (roomItem.quantity || 1).toString(),
      floatStocks: roomItem.floatStocks || 0,
      buffetId: buffet_id || null  // Also store buffetId in local item data
    }
    
    allSubmittedItems.value.unshift(newItem)
    
    // Clear current item for this room and menu type
    scannedItems.value = scannedItems.value.filter(item => 
      !(item.room === activeRoom.value && item.menuType === selectedMenuType.value)
    )
    
    // IMPORTANT: DO NOT uncheck the room or auto-select next room
    // Keep the current room selected so user can scan another item for same room
    
    // After successful submission, reset to first page and refresh
    search.value.page_num = 1
    const currentRoomId = getRoomId(activeRoom.value)
    fetchSubmittedItems(selectedMenuType.value, currentRoomId)
    
    if (!autoSubmit) {
      Alert("success", "Submitted!", 
        `Item submitted for ${activeRoom.value} (${selectedMenuType.value})${buffet_id ? ` with buffetId: ${buffet_id}` : ''}`)
    }
    
    nextTick(() => {
      if (itemBarcodeInput.value) {
        itemBarcodeInput.value.focus()
      }
    })
    
  } catch (error) {
    if (!autoSubmit) {
      Swal.close()
    }
    console.error("Error submitting item:", error)
    Alert("error", "Submission Failed", "Failed to submit item. Please try again.")
  }
}
const roomNumber = {
  rafah: 410,
  leonne1: 400,
  arianne: 402,
  leonne2: 401,
  leah1: 408,
  leah2: 409,
  buffet: 1000,
}

// remove rooms with 0
const roomsPayload = Object.fromEntries(
  Object.entries(roomNumber).filter(([_, value]) => value > 0)
)
const getVisiblePageNumbers = () => {
  const totalPages = Math.ceil(data.value.totalrows / search.value.itemsperpage)
  const currentPage = search.value.page_num
  const maxVisible = 5 // Number of visible page dots
  
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  return Array.from({ length: Math.min(maxVisible, totalPages) }, (_, i) => start + i)
}
const tmsRoomsData = ref({}); // Store TMS data by room ID

const fetchTmsRooms = async () => {
  try {
    // 'http://10.0.0.101:8091/api/pub-bookings/get-current-rooms-occupied',
    const response = await axios.post(
      `${VUE_APP_API_URL}productions/get-current-rooms-occupied`,
      {
        rooms: roomsPayload
      }
    );
    
    // console.log('TMS Response:', response.data.rooms);

    if (response.data && response.data.rooms) {
      // The response.rooms is an array of objects
      processTmsArrayResponse(response.data.rooms);
      response.data.rooms.forEach(room => {
        // console.log("fetTmsRooms");
        // console.log(roomIdBookings.value[room.roomId])
        roomIdBookings.value[room.roomId] = room.booking.bookingId ?? 2;
      })
    }
  } catch (error) {
    console.error("Error fetching tms rooms:", error)
    Alert("error", "Load Failed", "Failed to fetch tms rooms")
  } finally {
    isLoading.value = false
  }
}

const getEventName = computed(() => (roomName) => {
  // Get the room ID for this room name
  const roomId = roomIds[roomName];
  
  if (!roomId) {
    // console.log(`No room ID found for ${roomName}`);
    return '';
  }
  
  // Get TMS data for this room ID
  const roomData = tmsRoomsData.value[roomId];
  
//   console.log(`TMS data for ${roomName} (ID: ${roomId}):`, roomData);

  if (!roomData || !roomData.booking) {
    // console.log(`No booking data for ${roomName} (ID: ${roomId})`);
    return '';
  }
  
  // Check what properties the booking object has
//   console.log('Booking object keys:', Object.keys(roomData.booking));
  
  // The property is eventName (capital N), not eventname
  const eventName = roomData.booking.eventName || roomData.booking.eventname;
  
//   console.log(`Found event for ${roomName}: "${eventName}"`);
  return eventName || '';
});

// Helper function to get buffetId for a room
const getBuffetIdForRoom = (roomName) => {
  const roomId = roomIds[roomName];
  if (!roomId) return 0;
  
  const roomData = tmsRoomsData.value[roomId];
  if (!roomData || !roomData.booking) return 0;
  
  return roomData.booking.buffetId || 0;
}

const hasEvent = computed(() => (roomName) => {
  const eventName = getEventName.value(roomName);
  return eventName && eventName.trim() !== '';
});


const getBookingIdForRoom = (roomName) => {
  const roomId = roomIds[roomName];
  if (!roomId) return 0;
  
  const roomData = tmsRoomsData.value[roomId];
  if (!roomData || !roomData.booking) return 0;
  
  return roomData.booking.bookingId || 0;
}


// Remove this function or keep it empty since we're processing differently
const updateRoomIdsFromTmsResponse = (roomsData) => {
  // This function is no longer needed since we handle array format differently
  console.log('TMS response format changed to array, using processTmsArrayResponse instead');
};

const processTmsArrayResponse = (roomsArray) => {
  // Clear existing data
  tmsRoomsData.value = {};
  
  console.log('Processing TMS array:', roomsArray);
  
  // Convert array to object with roomId as key
  roomsArray.forEach(roomItem => {
    if (roomItem && roomItem.roomId) {
      // Store the room data using roomId as the key
      tmsRoomsData.value[roomItem.roomId] = roomItem;
    }
  });
  
  console.log('Processed TMS data (object format):', tmsRoomsData.value);
  
  // Log what we found for each room
  Object.entries(roomIds).forEach(([roomName, roomId]) => {
    const roomData = tmsRoomsData.value[roomId];
    console.log(`${roomName} (ID: ${roomId}):`, 
      roomData ? (roomData.booking ? `Event: ${roomData.booking.eventname}` : 'No booking') : 'No data');
  });
}


// Refresh submitted items (with current filters)
const refreshSubmittedItems = async () => {
  try {
    Swal.fire({
      title: "Refreshing",
      text: "Updating submitted items...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    })
    
    const menuType = selectedMenuType.value
    const roomId = activeRoom.value ? getRoomId(activeRoom.value) : null
    
    await fetchSubmittedItems(menuType, roomId)
    
    Swal.close()
    Alert("success", "Refreshed", "Submitted items list has been updated")
    
  } catch (error) {
    Swal.close()
    console.error("Error refreshing submitted items:", error)
  }
}

const isLoadingRooms = ref(false)

// Update the refreshRooms function
const refreshRooms = async () => {
  try {
    isLoadingRooms.value = true
    Swal.fire({
      title: "Refreshing Rooms",
      text: "Fetching latest room events...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    })
    
    await fetchTmsRooms()
    handlePagination(search.page_num);
    Swal.close()
    Alert("success", "Rooms Refreshed", "Room events have been updated")
    
  } catch (error) {
    Swal.close()
    console.error("Error refreshing rooms:", error)
    Alert("error", "Refresh Failed", "Failed to refresh room events")
  } finally {
    isLoadingRooms.value = false
  }
}

// Fetch all submitted items (initial load)
const fetchAllSubmittedItems = async () => {
  try {
    Swal.fire({
      title: "Loading",
      text: "Fetching submitted items...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    })
    
    // Pass null for both params to get all items initially
    await fetchSubmittedItems(null, null)
    
    Swal.close()
    
  } catch (error) {
    Swal.close()
    console.error("Error fetching all items:", error)
  }
}

const viewItemDetails = (item) => {
  AlertHtml("info", "Item Details", `
    <div class="text-left space-y-3">
      <p><strong>Item Name:</strong> ${item.itemName || item.name}</p>
      <p><strong>SKU:</strong> ${item.sku}</p>
      <p><strong>Quantity:</strong> ${item.quantity || item.serveQuantity || 1}</p>
      <p><strong>Room:</strong> <span class="capitalize">${item.room || getRoomName(item.roomDestination)}</span></p>
      <p><strong>Room ID:</strong> ${item.roomDestination}</p>
      <p><strong>Type:</strong> <span class="capitalize">${item.menuType || item.type}</span></p>
      <p><strong>System Stock:</strong> ${item.floatStocks || item.stocks || 0}</p>
      <p><strong>Submitted:</strong> ${item.timestamp || item.dateOfServe ? new Date(item.timestamp || item.dateOfServe).toLocaleString() : 'Just now'}</p>
    </div>
  `)
}

const logout = () => {
  const unsavedItemsExist = scannedItems.value.some(item => 
    item.menuType === selectedMenuType.value
  );

  if (unsavedItemsExist) {
    Swal.fire({
      title: 'Unsaved Items',
      text: 'You have unsaved items for the current menu type. Logout anyway?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then((result) => {
      if (result.isConfirmed) {
        emit('logout')
      }
    })
  } else {
    emit('logout')
  }
}

// Initialize on mount
onMounted(async () => {
  // Fetch all submitted items initially to populate the table
  await fetchAllSubmittedItems()
  
  // Focus on barcode input after initial setup
  nextTick(() => {
    if (itemBarcodeInput.value) {
      itemBarcodeInput.value.focus()
    }
  })
})
const handleComplete = (data) => {
  console.log('Process completed:', data)
  Alert("success", "Completed", 
    `${selectedMenuType.value} process completed for ${activeRoom.value}`)
}

// Watch for changes to automatically fetch new data
watch([selectedMenuType, activeRoom], ([newMenuType, newActiveRoom]) => {
  // Reset to first page when filters change
  search.value.page_num = 1
  
  // If we're not currently loading, fetch items based on current selection
  if (!isLoading.value) {
    const menuType = newMenuType
    const roomId = newActiveRoom ? getRoomId(newActiveRoom) : null
    fetchSubmittedItems(menuType, roomId)
  }
})

const validateEditableQuantity = (item) => {
  // Allow empty value temporarily while typing
  if (item.editableQuantity === '' || item.editableQuantity === null || item.editableQuantity === undefined) {
    return;
  }

  // Convert to number
  const numericValue = Number(item.editableQuantity);
  
  // Check if it's a valid number
  if (isNaN(numericValue)) {
    // If invalid, revert to original quantity
    item.editableQuantity = item.quantity;
    return;
  }
  
  // Ensure it's at least 1
  if (numericValue < 1) {
    item.editableQuantity = 1;
    Alert("warning", "Invalid Quantity", "Quantity must be at least 1");
    return;
  }
  
  // For leftover items, ensure it doesn't exceed available stock
  if (item.menuType === 'leftover' && item.floatStocks && numericValue > item.floatStocks) {
    Alert("warning", "Quantity Exceeds Stock", `Available stock: ${item.floatStocks}. Setting to maximum available.`);
    item.editableQuantity = Math.min(numericValue, item.floatStocks);
    return;
  }
  
  // Ensure it's a whole number (no decimals)
  item.editableQuantity = Math.floor(numericValue);
  
  console.log(`Validated quantity for item ${item.id}: ${item.editableQuantity}`);
}

const handleQuantityUpdateSuccess = (updateData) => {
  // Find and update the item in the list
  const index = allSubmittedItems.value.findIndex(item => item.id == updateData.id)
  if (index !== -1) {
    // Update both quantity and editableQuantity
    allSubmittedItems.value[index].quantity = updateData.quantity
    allSubmittedItems.value[index].editableQuantity = updateData.quantity
    allSubmittedItems.value[index].serveQuantity = updateData.quantity.toString()
    
    // Show success message
    Alert("success", "Updated!", `Quantity updated to ${updateData.quantity}`)
  }
  
  // Optionally refresh the list to ensure data consistency
  // refreshSubmittedItems()
}


const handleQuantityUpdateError = (errorMessage) => {
  console.error("Quantity update failed:", errorMessage)
  
  // Show error to user
  Alert("error", "Update Failed", errorMessage || "Failed to update quantity")
  
  // Revert all items' editableQuantity to their original quantity
  allSubmittedItems.value.forEach(item => {
    if (item.editableQuantity !== undefined && item.editableQuantity !== item.quantity) {
      // Store the failed change value for reference
      const failedValue = item.editableQuantity
      
      // Revert to original quantity
      item.editableQuantity = item.quantity
      
      // Log for debugging
      console.log(`Reverted item ${item.id} from ${failedValue} back to ${item.quantity}`)
    }
  })
  
  // Optional: Focus on the first input that had a change
  nextTick(() => {
    const firstChangedInput = document.querySelector('input[type="number"]:focus')
    if (firstChangedInput) {
      firstChangedInput.focus()
      firstChangedInput.select()
    }
  })
}


onMounted(async () => {
  // Fetch TMS data first
  await fetchTmsRooms();
  
  // Fetch all submitted items initially to populate the table
  await fetchAllSubmittedItems()
  
  // Fetch items for the default menu type (serve) with no specific room
  fetchSubmittedItems('serve', null)
  
  // Focus on barcode input after initial setup
  nextTick(() => {
    if (itemBarcodeInput.value) {
      itemBarcodeInput.value.focus()
    }
  })
})
// Expose methods
defineExpose({
  focusInput: () => {
    if (itemBarcodeInput.value) {
      itemBarcodeInput.value.focus()
    }
  }
})
</script>

<style scoped>
/* Same styles as before */
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Table styles */
table {
  border-collapse: separate;
  border-spacing: 0;
}

th {
  position: sticky;
  top: 0;
  background-color: #f9fafb;
  z-index: 10;
}

td, th {
  border-bottom: 1px solid #e5e7eb;
}

/* Disabled state styles */
input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

label:has(input:disabled) {
  cursor: not-allowed;
}

label:has(input:disabled):hover {
  border-color: inherit;
  box-shadow: none;
}
</style>