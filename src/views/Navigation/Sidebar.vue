<template>
  <nav
    class="fixed top-0 z-50 w-full shadow shadow-slate-900 overflow-hidden"
    :class="
      IS_DEV
        ? 'bg-red-500'
        : 'bg-gradient-to-l from-black via-red-600 via-red-700 via-[#800000] to-red-500'
    "
  >
    <div class="px-1 py-1 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end space-x-0">
          <button
            @click.prevent="toggleDrawer()"
            aria-controls="logo-sidebar"
            type="button"
            class="relative inline-flex items-center justify-center rounded-md p-2 text-yellow-500 hover:bg-red-700 hover:text-white border-2 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <svg
              class="block size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <svg
              class="hidden size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            class="flex items-center p-0 text-white font-bold ml-0 text-xs md:text-sm text-nowrap"
          >
            <!-- <RouterLink to="/system-information" class="flex items-start space-x-0">
              <CompanyLogo />
            </RouterLink> -->
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex items-center ms-3 gap-6">
            <!-- <div class="flex items-center text-white font-bold text-xs md:text-sm text-nowrap"> -->
            <!-- Digital Clock -->
            <!-- <p class="mr-4">{{ currentTime }}</p> -->
            <!-- </div> -->
            <!-- <div
              v-if="outOfStockCount > 0"
              class="bg-yellow-200 px-2 rounded shadow-lg animate-pulse"
            >
              <RouterLink to="/statistics">
                <p class="text-xs font-bold text-red-500">Out of Stock Alert!</p>
                <p class="text-xs">
                  There are {{ outOfStockCount }} item(s) out of stock.
                </p>
              </RouterLink>
            </div> -->
            <div class="flex space items-center space-x-1">
              <!-- <StoreDropdown /> -->
              <WarehouseDropdown @warehouseChanged="onWarehouseChange" />
              <div
                class="size-10 flex items-center justify-center rounded border border-lime-500 bg-gray-200"
              >
                <!-- <UserQr /> -->
              </div>
              <!-- <ZoomControls /> -->
              <button
                type="button"
                @click.prevent="reloadDefault"
                title="Reload Pre-process data"
                class="flex font-bold items-center text-xl p-2 text-red-500 rounded-l text-white rounded bg-purple-500 group"
              >
                <i class="fa fa-sync"></i> test
              </button>
              <button
                type="button"
                @click.prevent="logOut()"
                title="Logout Account"
                class="flex font-bold items-center text-xl p-2 text-red-500 rounded-l text-white rounded bg-red-500 group"
              >
                <i class="fa fa-power-off"></i>
              </button>
              <div class="border-l-2 border-l-2 pl-2 border-gray-500 ml-2 pr-2 text-end">
                <!-- <DirectoryButton /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <aside
    id="logo-sidebar"
    :class="{
      'translate-x-0': isDrawerOpen,
      '-translate-x-full': !isDrawerOpen,
      'bg-red-500': IS_DEV,
      'p-0': !IS_DEV,
    }"
    class="fixed top-10 left-0 z-40 w-64 pt-5 h-screen transition-transform border-r overflow-hidden border-gray-200"
    aria-label="Sidebar"
  >
    <div
      class="h-full px-3 pb-4 pr-0 mr-0 overflow-y-auto"
      :class="IS_DEV ? 'bg-red-500' : DEFAULT_BG"
    >
      <div class="flex items-center p-4 border-b border-gray-200">
        <img
          :src="profilePicture"
          alt="Profile Picture"
          class="w-12 h-12 rounded-full border-2 border-slate-500"
        />
        <div class="ms-4">
          <p class="text-lg font-bold text-white uppercase">{{ user?.name || 'User name not saved'}}</p>
          <!-- <p class="text-sm text-gray-300 text-white">{{ user.roleName }}</p> -->
          <p class="text-xs text-gray-300 text-white">{{ user?.email || 'User email not saved' }}</p>
          <div class="flex flex-row gap-2">
            <RouterLink to="/profile">
              <button
                type="button"
                class="inline-flex items-center px-2 py-1 text-xs mt-2 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <i class="fa fa-user-edit"></i>
                <span class="ms-2">Edit Profile</span>
              </button>
            </RouterLink>
            <div
              class="size-10 flex items-center justify-center rounded border border-lime-500 bg-gray-200"
            >
              <!-- <i class="fa-solid fa-qrcode text-3xl"></i> -->
              <!-- <UserBarcode /> -->
            </div>
            <div
              class="size-10 flex items-center justify-center rounded border border-lime-500 bg-gray-200"
            >
              <!-- <UserQr /> -->
            </div>
          </div>
        </div>
      </div>
      <ul class="space-y-2 font-medium">
        <template v-for="item in navigationConfig.mainNav" :key="item.id">
          <!-- If it's a simple link -->
          <li
            v-if="
              item && item.isLink && item.permission && hasPermission(item.permission)
            "
          >
            <RouterLink
              :to="item.route"
              class="flex items-center text-sm md:text-sm p-2 text-white rounded-l dark:text-white hover:bg-slate-700 dark:hover:bg-gray-700 group relative"
              :class="{
                'bg-slate-600 border-l-4 border-yellow-500': $route.path === item.route,
                'border-l-4 border-transparent': $route.path !== item.route,
              }"
            >
              <i :class="'fa ' + item.icon"></i>
              <span class="ms-3">{{ item.title }}</span>
            </RouterLink>
          </li>

          <!-- If it's a dropdown -->
          <li
            v-else-if="
              item && item.isDropdown && item.permission && hasPermission(item.permission)
            "
          >
            <a
              @click.prevent="toggleDropdown(item.id)"
              :data-dropdown="item.id"
              class="flex items-center justify-between text-sm md:text-sm p-2 text-white rounded-l dark:text-white hover:bg-slate-700 dark:hover:bg-gray-700 group cursor-pointer relative"
              :class="{
                'bg-slate-600 border-l-4 border-yellow-500':
                  isDropdownOpen[item.id] ||
                  item.items.some((subItem) => $route.path === subItem.route),
                'border-l-4 border-transparent':
                  !isDropdownOpen[item.id] &&
                  !item.items.some((subItem) => $route.path === subItem.route),
              }"
            >
              <div>
                <i :class="'fa ' + item.icon"></i>
                <span class="ms-3">{{ item.title }}</span>
              </div>
              <i
                :class="
                  isDropdownOpen[item.id]
                    ? 'fa fa-chevron-up ms-3'
                    : 'fa fa-chevron-down ms-3'
                "
              ></i>
            </a>
            <div v-if="isDropdownOpen[item.id]" class="pl-4 mt-1 space-y-1">
              <template v-for="(subItem, subIndex) in item.items" :key="subIndex">
                <RouterLink
                  v-if="
                    subItem && subItem.permission && hasPermission(subItem.permission)
                  "
                  :to="subItem.route"
                  class="flex items-center text-sm p-2 text-white rounded-l hover:bg-slate-700 dark:hover:bg-gray-700 group relative"
                  :class="{
                    'bg-slate-600 border-l-4 border-yellow-500':
                      $route.path === subItem.route,
                    'border-l-4 border-transparent': $route.path !== subItem.route,
                  }"
                  @click="isDropdownOpen[item.id] = false"
                >
                  <i :class="['fa', subItem.icon, 'mr-2']"></i>
                  {{ subItem.title }}
                </RouterLink>
              </template>
            </div>
          </li>
        </template>

        <!-- Logout button -->
        <li>
          <a
            href="#"
            @click.prevent="logOut()"
            class="flex font-bold items-center text-sm md:text-sm p-2 text-red-500 rounded-l dark:text-white hover:bg-slate-700 dark:hover:bg-gray-700 group"
          >
            <i class="fa fa-power-off"></i>
            <span class="ms-3">Log Out</span>
          </a>
        </li>
      </ul>
    </div>
    <!-- <small class="hover:text-white text-transparent absolute bottom-10 text-center"
      >&nbsp;&nbsp; &copy; Designed by: John The Great</small
    > -->
  </aside>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { RouterLink } from "vue-router";
import { useSessionStore } from "@/stores/sessionStore";
import { hasPermission } from "../Utility/Permissions";
// import { IS_DEV, VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import { getPermissions } from "../Utility/PreProcess";
import { BearToken, FormDx, handleApiError } from "../Utility/Helper";
import { navigationConfig } from "../Utility/NavigationConfig";

// import ZoomControls from "@/views/Component/ZoomControls.vue";
// import DirectoryButton from "@/views/Pages/Directory/DirectoryButton.vue";
// import CompanyLogo from "@/views/Component/CompanyLogo.vue";
// import WarehouseDropdown from "@/views/Component/WarehouseDropdown.vue";
// import StoreDropdown from "@/views/Component/StoreDropdown.vue";
// import UserQr from "@/views/Component/modals/UserQr.vue";
// import UserBarcode from "@/views/Component/modals/UserBarcode.vue";

import profilePicture from "@/assets/images/profile/profile.png";
// Define the emits for this component
const emits = defineEmits(["openDrawer", "warehouseChanged"]);

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
const outOfStockCount = ref(13);
const sessionStore = useSessionStore();
const isDrawerOpen = ref(false);
const currentTime = ref(false);
const isDropdownOpen = ref(
  navigationConfig.mainNav
    .filter((item) => item && item.isDropdown)
    .reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {})
);

const onWarehouseChange = (warehouseId) => {
  // Handle warehouse change logic here
  console.log("Selected Warehouse ID:", warehouseId);
  // You can also emit an event if needed
  emits("warehouseChanged", warehouseId);
};

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
  emits("openDrawer", !isDrawerOpen.value);
};

const toggleDropdown = (dropdown) => {
  // Close all other dropdowns
  for (const key in isDropdownOpen.value) {
    if (key !== dropdown) {
      isDropdownOpen.value[key] = false;
    }
  }
  // Toggle the selected dropdown
  isDropdownOpen.value[dropdown] = !isDropdownOpen.value[dropdown];
};

const logOut = async () => {
  try {
    // Show processing Swal
    Swal.fire({
      title: "Logging out...",
      text: "Please wait a moment",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await axios.post("logout");

    if (response) {
      // Preserve theme in localStorage
      const theme = localStorage.getItem("theme");

      // Clear everything in localStorage except for the theme
      localStorage.clear();
      if (theme) {
        localStorage.setItem("theme", theme); // Restore theme setting
      }

      // Clear session storage
      sessionStore.clearUser();

      // Close the Swal and reload
      Swal.close();
      window.location.replace("/login");
      location.reload();
    }
  } catch (error) {
    console.error("Error logging out:", error);
    Swal.fire("Error", "Failed to log out. Please try again.", "error");
  } finally {
    // Close the Swal if it is still open
    if (Swal.isVisible()) {
      const theme = localStorage.getItem("theme");

      // Clear everything in localStorage except for the theme
      localStorage.clear();
      if (theme) {
        localStorage.setItem("theme", theme); // Restore theme setting
      }

      // Clear session storage
      sessionStorage.clear();

      // Close the Swal and reload
      Swal.close();
      location.reload();
    }
  }
};

const updateClock = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Determine AM or PM
  const amPm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12 || 12; // Convert '0' to '12'
  hours = String(hours).padStart(2, "0");

  // Set the time
  currentTime.value = `${hours}:${minutes}:${seconds} ${amPm}`;
};

const startClock = () => {
  updateClock();
  setInterval(updateClock, 1000);
};

// Preprocess necessary data after successful login
const reloadDefault = async () => {
  console.log("relaodDefault"); // Show processing Swal2
  Swal.fire({
    title: "Processing...",
    text: "Please wait while the data is being reloaded.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    // Reload all default data
    // await getDefaultWarehouse(token);
    await getPermissions();
    // await getRoles(token);
    // await getUnits(token);

    // Close the loading Swal2 and show success alert
    Swal.close();
    Swal.fire("Success!", "Default data reloaded successfully.", "success");

    // Reload the page
    window.location.reload();
  } catch (error) {
    // Close the loading Swal2 and show error alert
    Swal.close();
    console.error(error);
    Swal.fire(
      "Error",
      "An error occurred while reloading data. Please try again.",
      "error"
    );
  }
};

// Add click outside handler to close dropdowns
const handleClickOutside = (event) => {
  const dropdowns = document.querySelectorAll("li");
  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector("a[data-dropdown]");
    const menu = dropdown.querySelector("ul");
    if (button && menu && !dropdown.contains(event.target)) {
      const dropdownId = button.getAttribute("data-dropdown");
      if (dropdownId) {
        isDropdownOpen.value[dropdownId] = false;
      }
    }
  });
};

onMounted(() => {
  startClock();
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>
<style scoped>
/* Adjust the clock style */
nav .clock {
  font-size: 1rem;
  color: #ffffff;
  margin-right: 1rem;
}
aside {
  transition: transform 0.3s ease;
}
</style>
