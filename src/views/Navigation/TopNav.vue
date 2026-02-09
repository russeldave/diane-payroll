<template>
  <nav class="-z-3 fixed top-0 left-0 w-full z-50 shadow-md">
    <div class="mx-auto max-w-8xl p-0">
      <!-- Primary Navigation -->
      <div
        class="flex justify-between items-center gap-6 p-2 primary-nav bg-gradient-to-l from-black via-red-600 via-red-700 via-red-500 via-red-700 to-[#800000]"
        :class="{ hidden: hideNav }"
      >
        <!-- Logo -->
        <div class="flex justify-start flex-col ml-3">
          <RouterLink
            to="/system-information"
            class="flex justify-end items-center space-x-0"
          >
            <!-- <CompanyLogo /> -->
          </RouterLink>
        </div>

        <div class="flex justify-center flex-col">
          <!-- <label for="Warehouse" class="text-sm text-white">Select Outlet:</label> -->
          <WarehouseDropdown @warehouseChanged="onWarehouseChange" />
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-1 items-center">
          <div
            class="size-10 flex items-center justify-center rounded border border-lime-500 bg-gray-200"
          >
            <!-- <i class="fa-solid fa-qrcode text-3xl"></i> -->
            <!-- <UserBarcode /> -->
          </div>
          <div
            class="size-10 flex items-center justify-center rounded border border-lime-500 bg-gray-200"
          >
            <!-- <i class="fa-solid fa-qrcode text-3xl"></i> -->
            <!-- <UserQr /> -->
          </div>
          <div class="border-r-2 pl-2 border-gray-500 ml-2 pr-2 text-end">
            <p class="text-sm text-gray-200 font-bold text-white uppercase">
              {{ user?.name || "Not save name" }}
            </p>
            <p class="text-xs text-yellow-600 text-nowrap first-letter:uppercase">
              {{ user?.roleName || "note save roleName" }}
            </p>
          </div>
          <RouterLink
            to="/profile"
            title="My Profile"
            class="bg-blue-700 text-white p-2 rounded-full shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <i class="fa fa-user"></i>
          </RouterLink>
          <RouterLink
            to="/logs"
            title="User Logs"
            class="bg-yellow-700 text-white p-2 rounded-full shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <i class="fa fa-history"></i>
          </RouterLink>
          <button
            type="button"
            @click.prevent="reloadDefault()"
            title="Reload Pre-process data"
            class="bg-purple-700 text-white p-2 rounded-full shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <i class="fa fa-sync"></i>
          </button>
          <!-- <span class="text-white font-bold">
            test
          </span> -->
          <button
            type="button"
            @click.prevent="logOut()"
            title="Logout Account"
            class="bg-red-700 text-white p-2 rounded-full shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <i class="fa fa-power-off"></i>
          </button>
          <div class="border-l-2 border-l-2 pl-2 border-gray-500 ml-2 pr-2 text-end">
            <!-- <DirectoryButton /> -->
          </div>
        </div>
      </div>
      <div
        class="relative flex h-full p-1 items-center justify-center min-w-screen secondary-nav"
        :class="DEFAULT_BG"
      >
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button
            type="button"
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>
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
        </div>
        <div
          class="flex flex-row items-center justify-center sm:items-stretch sm:justify-between z-10 px-1"
        >
          <div class="flex justify-end hidden sm:ml-6 sm:block z-9000 navigation">
            <div class="flex items-center space-x-4">
              <template v-for="item in navigationConfig.mainNav" :key="item.id">
                <!-- If it's a simple link -->
                <RouterLink
                  v-if="
                    item &&
                    item.isLink &&
                    item.permission &&
                    hasPermission(item.permission)
                  "
                  :to="item.route"
                  class="text-white hover:bg-gray-700 hover:text-white px-1 py-1 rounded-md text-sm font-medium flex items-center"
                  :class="{ 'bg-gray-700 text-white': currentPath === item.route }"
                >
                  <i :class="'fa ' + item.icon"></i>
                  <span class="ml-2 text-nowrap">{{ item.title }}</span>
                </RouterLink>

                <!-- If it's a dropdown -->
                <div
                  v-else-if="
                    item &&
                    item.isDropdown &&
                    item.permission &&
                    hasPermission(item.permission)
                  "
                  class="relative"
                >
                  <button
                    @click="toggleDropdown(item.id)"
                    :data-dropdown="item.id"
                    class="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    :class="{ 'bg-gray-700 text-white': isDropdownActive(item.items) }"
                  >
                    <i :class="'fa ' + item.icon"></i>
                    <span class="ml-2">{{ item.title }}</span>
                    <i
                      :class="
                        'fa fa-chevron-' +
                        (isDropdownOpen[item.id] ? 'up' : 'down') +
                        ' ml-2'
                      "
                    ></i>
                  </button>
                  <!-- Dropdown menu -->
                  <div
                    v-if="isDropdownOpen[item.id]"
                    :id="`dropdown-menu-${item.id}`"
                    :style="
                      dropdownPosition[item.id]
                        ? {
                            left: dropdownPosition[item.id].left,
                            top: dropdownPosition[item.id].top,
                            position: 'fixed',
                            zIndex: 9999,
                          }
                        : {}
                    "
                    :class="`w-auto rounded-md shadow-[4px_4px_0_rgba(0,0,0,0.25)] bg-white ring-1 ring-black ring-opacity-5 ${getDropdownWidthClass(
                      item
                    )}`"
                  >
                    <!-- Arrow -->
                    <div
                      v-if="dropdownPosition[item.id]"
                      :style="getDropdownArrowStyle(item.id)"
                      class="w-4 h-4 bg-white border-t border-l border-gray-200 z-50"
                    ></div>

                    <div
                      class="py-1 relative bg-white rounded-md"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <!-- Grouped items -->
                      <template v-if="item.groupBy">
                        <div :class="getGroupGridClass(getGroupedItems(item.items))">
                          <template
                            v-for="(group, groupName) in getGroupedItems(item.items)"
                            :key="groupName"
                          >
                            <!-- Group box -->
                            <div
                              class="bg-gray-50 rounded-lg border border-gray-200 shadow-sm w-full"
                            >
                              <!-- Group header -->
                              <div
                                :class="DEFAULT_BG"
                                class="text-white px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 rounded-t-lg"
                              >
                                {{ groupName }}
                              </div>
                              <!-- Group items -->
                              <div class="p-1">
                                <template
                                  v-for="(subItem, subIndex) in group"
                                  :key="subIndex"
                                >
                                  <RouterLink
                                    v-if="
                                      subItem &&
                                      subItem.permission &&
                                      hasPermission(subItem.permission)
                                    "
                                    :to="subItem.route"
                                    class="block px-3 border mt-1 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center transition-colors break-words"
                                    :class="{
                                      'bg-blue-100 text-blue-900':
                                        currentPath === subItem.route,
                                    }"
                                    role="menuitem"
                                    @click="closeDropdown(item.id)"
                                  >
                                    <i :class="['fas', subItem.icon, 'mr-2']"></i>
                                    {{ subItem.title }}
                                  </RouterLink>
                                </template>
                              </div>
                            </div>
                          </template>
                        </div>
                      </template>
                      <!-- Non-grouped items (fallback) -->
                      <template v-else>
                        <template
                          v-for="(subItem, subIndex) in item.items"
                          :key="subIndex"
                        >
                          <RouterLink
                            v-if="
                              subItem &&
                              subItem.permission &&
                              hasPermission(subItem.permission)
                            "
                            :to="subItem.route"
                            class="block px-4 py-2 text-sm text-nowrap text-gray-700 hover:bg-gray-100 flex items-center"
                            :class="{
                              'bg-gray-100 text-gray-900': currentPath === subItem.route,
                            }"
                            role="menuitem"
                            @click="closeDropdown(item.id)"
                          >
                            <i :class="['fas', subItem.icon, 'mr-2']"></i>
                            {{ subItem.title }}
                          </RouterLink>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        ></div>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { RouterLink } from "vue-router";
import Swal from "sweetalert2";
import { useSessionStore } from "@/stores/sessionStore";
import { hasPermission } from "../Utility/Permissions";
// import { IS_DEV, VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
// import { BearToken, FormDx, handleApiError, Alert } from "../Utility/Helper";
import { getPermissions, getRoles, getUnits } from "../Utility/PreProcess";
import { navigationConfig } from "../Utility/NavigationConfig";

import WarehouseDropdown from "@/views/Component/WarehouseDropdown.vue";
// import CompanyLogo from "@/views/Component/CompanyLogo.vue";
// import DirectoryButton from "@/views/Pages/Directory/DirectoryButton.vue";
// import UserQr from "@/views/Component/modals/UserQr.vue";
// import UserBarcode from "@/views/Component/modals/UserBarcode.vue";

const emits = defineEmits(["openDrawer", "warehouseChanged"]);
const route = useRoute();
const currentPath = computed(() => route.path);
const user = ref(null);
const lastScrollY = ref(0);
const hideNav = ref(localStorage.getItem("primaryNavHidden") === "true" || false);
const hasShownAlert = ref(false);
const sessionStore = useSessionStore();
const isDrawerOpen = ref(true);
const currentTime = ref(false);
const outOfStockCount = ref(13);
const isDropdownOpen = ref({});
const dropdownPosition = ref({});

const getGroupedItems = (items) => {
  const grouped = {};
  items.forEach((item) => {
    if (item && item.permission && hasPermission(item.permission)) {
      const group = item.group || "Other";
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(item);
    }
  });
  return grouped;
};

const getGroupGridClass = (groups) => {
  const groupCount = Object.keys(groups).length;
  if (groupCount <= 3) {
    return `grid grid-cols-1 gap-2 p-2 w-full`;
  }
  return "grid grid-cols-2 gap-2 p-2 w-full";
};

const getDropdownWidthClass = (item) => {
  const groupCount = Object.keys(getGroupedItems(item.items)).length;
  if (groupCount > 3) {
    return "min-w-[40rem]";
  }
  return "min-w-64";
};

const togglePrimaryNav = () => {
  hideNav.value = !hideNav.value;
  emits("navShowingChanged", hideNav.value);

  localStorage.setItem("primaryNavHidden", hideNav.value);
};

onMounted(() => {
  navigationConfig.mainNav.forEach((item) => {
    if (item && item.isDropdown) {
      isDropdownOpen.value[item.id] = false;
    }
  });
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("click", handleClickOutside);
  startClock();
});

const toggleDropdown = (dropdown) => {
  if (isDropdownOpen.value[dropdown]) {
    isDropdownOpen.value[dropdown] = false;
    return;
  }
  Object.keys(isDropdownOpen.value).forEach((key) => {
    isDropdownOpen.value[key] = false;
  });
  isDropdownOpen.value[dropdown] = true;
  adjustDropdownPosition(dropdown);
};

const closeDropdown = (dropdown) => {
  isDropdownOpen.value[dropdown] = false;
};

const onWarehouseChange = (warehouseId) => {
  console.log("Selected Warehouse ID:", warehouseId);
  emits("warehouseChanged", warehouseId);
};

const handleClickOutside = (event) => {
  const dropdowns = document.querySelectorAll(".relative");
  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector("button");
    const menu = dropdown.querySelector(".absolute");
    if (button && menu && !dropdown.contains(event.target)) {
      const dropdownId = button.getAttribute("data-dropdown");
      if (dropdownId) {
        isDropdownOpen.value[dropdownId] = false;
      }
    }
  });
};

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
  emits("openDrawer", !isDrawerOpen.value);
};

const logOut = async () => {
  try {
    Swal.fire({
      title: "Logging out...",
      text: "Please wait a moment",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await sessionStore.logout();
    // window.location.reload();
    if (response) {
      const theme = localStorage.getItem("theme");
      localStorage.clear();
      if (theme) {
        localStorage.setItem("theme", theme);
      }
      sessionStorage.clear();
      Swal.close();
      location.reload();
    }
  } catch (error) {
    console.error("Error logging out:", error);
    Swal.fire("Error", "Failed to log out. Please try again.", "error");
  } finally {
    if (Swal.isVisible()) {
      const theme = localStorage.getItem("theme");
      localStorage.clear();
      if (theme) {
        localStorage.setItem("theme", theme);
      }
      sessionStorage.clear();
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
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, "0");
  currentTime.value = `${hours}:${minutes}:${seconds} ${amPm}`;
};

const startClock = () => {
  updateClock();
  setInterval(updateClock, 1000);
};

const reloadDefault = async () => {
  Swal.fire({
    title: "Processing...",
    text: "Please wait while the data is being reloaded.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    await getPermissions();
    // await getRoles(token);
    // await getUnits(token);
    Swal.close();
    Swal.fire("Success!", "Default data reloaded successfully.", "success");
    window.location.reload();
  } catch (error) {
    Swal.close();
    console.error(error);
    Swal.fire(
      "Error",
      "An error occurred while reloading data. Please try again.",
      "error"
    );
  }
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  const isHiddenByUser = localStorage.getItem("primaryNavHidden") === "true";
  if (!isHiddenByUser) {
    // Only apply scroll-based hiding if the user hasn't explicitly hidden the nav
    hideNav.value = currentScrollY > lastScrollY.value;
  } else {
    // Respect the user's explicit toggle choice
    hideNav.value = isHiddenByUser;
  }
  lastScrollY.value = currentScrollY;
};

const isDropdownActive = (items) => {
  return items.some((item) => currentPath.value === item.route);
};

const adjustDropdownPosition = async (dropdownId) => {
  await nextTick();
  const button = document.querySelector(`[data-dropdown="${dropdownId}"]`);
  const dropdown = document.getElementById(`dropdown-menu-${dropdownId}`);
  if (!button || !dropdown) return;

  const buttonRect = button.getBoundingClientRect();
  const dropdownRect = dropdown.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = buttonRect.left;
  let top = buttonRect.bottom + 8;
  let arrowDirection = "down";

  if (left + dropdownRect.width > viewportWidth) {
    left = buttonRect.right - dropdownRect.width;
    if (left < 0) left = 0;
  }
  if (top + dropdownRect.height > viewportHeight) {
    top = buttonRect.top - dropdownRect.height - 8;
    if (top < 0) top = 0;
    arrowDirection = "up";
  }

  const arrowLeft = buttonRect.left + buttonRect.width / 2 - left;

  dropdownPosition.value[dropdownId] = {
    left: `${left}px`,
    top: `${top}px`,
    arrowLeft: `${arrowLeft}px`,
    arrowDirection,
  };
};

const getDropdownArrowStyle = (dropdownId) => {
  const pos = dropdownPosition.value[dropdownId];
  if (!pos) return {};
  const style = {
    position: "absolute",
    left: pos.arrowLeft,
    transform:
      pos.arrowDirection === "down"
        ? "translateX(-50%) rotate(45deg)"
        : "translateX(-50%) rotate(225deg)",
  };
  if (pos.arrowDirection === "down") {
    style.top = "-8px";
  } else {
    style.bottom = "-8px";
  }
  return style;
};

const checkPrimaryHidden = () => {
  const checkPrimary = localStorage.getItem("primaryNavHidden");
  if (checkPrimary === null) {
    localStorage.setItem("primaryNavHidden", false);
    return false;
  }
};

onMounted(() => {
  // 1. Ensure we have the latest data from the server
  // 2. Assign the state value to your local ref
  user.value = sessionStore.user.user;
  console.log("topNav ");
  console.log(user.value.name);

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("click", handleClickOutside);
  startClock();
  checkPrimaryHidden();
  window.addEventListener("resize", () => {
    const openDropdown = Object.keys(isDropdownOpen.value).find(
      (id) => isDropdownOpen.value[id]
    );
    if (openDropdown) adjustDropdownPosition(openDropdown);
  });
  window.addEventListener("scroll", () => {
    const openDropdown = Object.keys(isDropdownOpen.value).find(
      (id) => isDropdownOpen.value[id]
    );
    if (openDropdown) adjustDropdownPosition(openDropdown);
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", () => {});
  window.removeEventListener("scroll", () => {});
});
</script>
<style scoped>
nav .clock {
  font-size: 1rem;
  color: #ffffff;
  margin-right: 1rem;
}
aside {
  transition: transform 0.3s ease;
}
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.z-\[9999\] {
  z-index: 9999;
}
.rounded-md {
  transition: all 0.2s ease-in-out;
}
.hover\:bg-gray-100:hover {
  transition: background-color 0.2s ease-in-out;
}
</style>
