<template>
  <div v-if="hasPermission('Navigation_Buffet_List')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Buffet'" /> -->
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-1">Buffet</h1>

      <!-- Tabs -->
      <div class="mb-4">
        <ul class="flex gap-4 border-b font-bold text-gray-500">
          <li>
            <a
              href="#"
              @click.prevent="activeTab = 'List'"
              :class="
                activeTab === 'List'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'hover:text-blue-500'
              "
            >
              <i class="fas fa-list me-2"></i>
              List
            </a>
          </li>
          <li>
            <a
              href="#"
              @click.prevent="activeTab = 'Events'"
              :class="
                activeTab === 'Events'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'hover:text-blue-500'
              "
            >
              <i class="fas fa-calendar-alt me-2"></i>
              Events
            </a>
          </li>
          <li
            >
            <a
              href="#"
              @click.prevent="activeTab = 'Packages'"
              :class="
                activeTab === 'Packages'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'hover:text-blue-500'
              "
            >
              <i class="fa-solid fa-box-open"></i>
              Packages
            </a>
          </li>
        </ul>
      </div>

      <!-- Tab Content -->
      <div>
        <BuffetList v-if="activeTab === 'List'" />
        <BuffetEvents v-else-if="activeTab === 'Events'" />
        <!-- <Packages
         v-else-if="activeTab === 'Packages' && hasPermission('Buffet_Packages_Tab')" /> -->
         <Packages
         v-else-if="activeTab === 'Packages'" />
      </div>
    </div>
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>

<script setup>
import { ref } from "vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import Error403 from "@/views/Error/403.vue";
import { hasPermission } from "@/views/Utility/Permissions";

// Import your tab components
import BuffetList from "./Tabs/List/Index.vue";
import BuffetEvents from "./Tabs/Events/Index.vue";
import Packages from "./Tabs/Packages/Index.vue";

const activeTab = ref("List");
</script>
