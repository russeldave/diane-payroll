<template>
  <div
    v-if="
      hasPermission('Navigation_Configurations') && hasPermission('Navigation_Settings')
    "
  >
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'System Configuration'" /> -->
      <h1 class="text-lg md:text-2xl font-bold mb-4 mt-1">System Configuration</h1>

      <!-- Tabs -->
      <div class="mb-2">
        <ul
          class="flex flex-nowrap gap-4 -mb-px text-lg text-nowrap overflow-auto font-bold text-center text-gray-500 dark:text-gray-400"
        >
          <!-- Roles Tab -->
          <li class="me-2" v-if="hasPermission('Configurations_Role_Tab')">
            <a
              href="#"
              @click.prevent="activateTab('Roles')"
              title="Roles"
              :class="getTabClass('Roles')"
            >
              <i class="fas fa-user-shield me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
                >Roles</span
              >
            </a>
          </li>

          <!-- Permissions Tab -->
          <li class="me-2" v-if="hasPermission('Configurations_Permissions_Tab')">
            <a
              href="#"
              @click.prevent="activateTab('Permissions')"
              title="Permissions"
              :class="getTabClass('Permissions')"
            >
              <i class="fas fa-shield-alt me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
                >Permissions</span
              >
            </a>
          </li>

          <!-- Payment Method Tab -->
          <li class="me-2" v-if="hasPermission('Configurations_Payment_Method_Tab')">
            <a
              href="#"
              @click.prevent="activateTab('Payment_Method')"
              title="Payment Method"
              :class="getTabClass('Payment_Method')"
            >
              <i class="fas fa-credit-card me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
                >Payment Method</span
              >
            </a>
          </li>

          <!-- Discounts Tab -->
          <li class="me-2" v-if="hasPermission('Configurations_Discounts_Tab')">
            <a
              href="#"
              @click.prevent="activateTab('Discount')"
              title="Discount"
              :class="getTabClass('Discount')"
            >
              <i class="fas fa-percentage me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
                >Discount</span
              >
            </a>
          </li>

          <!-- Discounts Tab -->
          <li class="me-2" v-if="hasPermission('Configurations_Stores_Tab')">
            <a
              href="#"
              @click.prevent="activateTab('Stores')"
              title="Stores"
              :class="getTabClass('Stores')"
            >
              <i class="fas fa-store"></i>
              <span class="ml-2 text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
                >Stores</span
              >
            </a>
          </li>

          <!-- Warehouse Tab -->
          <li class="me-2" v-if="hasPermission('Configurations_Warehouses_Tab')">
            <a
              href="#"
              @click.prevent="activateTab('Warehouses')"
              title="Warehouses"
              :class="getTabClass('Warehouses')"
            >
              <i class="fas fa-warehouse"></i>
              <span class="ml-2 text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
                >Warehouses</span
              >
            </a>
          </li>

          <!-- Units Tab -->
          <li class="me-2" v-if="hasPermission('Configurations_Units_Tab')">
            <a
              href="#"
              @click.prevent="activateTab('Units')"
              title="Units"
              :class="getTabClass('Units')"
            >
              <i class="fas fa-ruler"></i>
              <span class="ml-2 text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
                >Units</span
              >
            </a>
          </li>
        </ul>
      </div>

      <!-- Tab content -->
      <div class="py-6 h-full rounded">
        <PaymentMethod
          v-if="
            activeTab === 'Payment_Method' &&
            hasPermission('Configurations_Payment_Method_Tab')
          "
        />
        <Role v-if="activeTab === 'Roles' && hasPermission('Configurations_Role_Tab')" />
        <Permissions
          v-if="
            activeTab === 'Permissions' && hasPermission('Configurations_Permissions_Tab')
          "
        />
        <Discounts
          v-if="activeTab === 'Discount' && hasPermission('Configurations_Discounts_Tab')"
        />
        <Stores
          v-if="activeTab === 'Stores' && hasPermission('Configurations_Stores_Tab')"
        />
        <Warehouse
          v-if="
            activeTab === 'Warehouses' && hasPermission('Configurations_Warehouses_Tab')
          "
        />
        <Units
          v-if="activeTab === 'Units' && hasPermission('Configurations_Units_Tab')"
        />
      </div>
    </div>
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import { DEFAULT_BG } from "@/views/Utility/Global.js";
import Error403 from "@/views/Error/403.vue";

// Tab components
import Permissions from "@/views/Pages/Configuration/Tabs/Permission/Index.vue";
import Role from "@/views/Pages/Configuration/Tabs/Role/Index.vue";
import PaymentMethod from "@/views/Pages/Configuration/Tabs/PaymentMethod/Index.vue";
import Discounts from "@/views/Pages/Configuration/Tabs/Discount/Index.vue";
import Stores from "@/views/Pages/Configuration/Tabs/Stores/Index.vue";
import Warehouse from "@/views/Pages/Configuration/Tabs/Warehouse/Index.vue";
import Units from "@/views/Pages/Configuration/Tabs/Units/Index.vue";

// Active tab state
const activeTab = ref("Roles");

// Tab activation handler
const activateTab = (tabName) => {
  activeTab.value = tabName;
};

// Reusable class generator for tabs
const getTabClass = (tabName) =>
  activeTab.value === tabName
    ? `inline-flex text-white border-b-2 p-2 border-yellow-600 ${DEFAULT_BG.value} rounded-t-lg active dark:text-blue-500 dark:border-blue-500`
    : `inline-flex items-center justify-center p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group`;
</script>
