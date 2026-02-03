<template>
    <button
      @click.prevent="viewJOBehavior()"
      class="bg-stone-500 hover:opacity-70 focus:bg-stone-300 text-white font-bold text-sm md:text-md rounded-r py-2 px-4 mb-4 float-end text-nowrap"
    >
     <i class="fas fa-eye"></i>
     View JO
    </button>
    <Modal
      :show="isViewJOModalOpen"
      :maxWidth="'4xl'"
      title="View Job Order"
      @close="isViewJOModalOpen = false"
    >
      <div class="p-6 rounded-md shadow-md">
        <form v-if="data">
            <!-- Work Schedule -->
            <div class="mb-6">
                <label for="date_started" class="block text-sm font-medium text-gray-700">
                    Job Order No.
                </label>
                <input
                    type="text"
                    id="date_started"
                    v-model="data.jobOrderNumber"
                    disabled
                    class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                />
            </div>
            <div class="grid grid-cols-2 gap-6">
                <div class="mb-6">
                    <label for="date_started" class="block text-sm font-medium text-gray-700">
                        Date Started
                    </label>
                    <input
                        type="datetime-local"
                        id="date_started"
                        v-model="data.dateStarted"
                        disabled
                        class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                    />
                </div>
                <div class="mb-6">
                    <label for="work_schedule" class="block text-sm font-medium text-gray-700">
                        Work Schedule <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="work_schedule"
                        v-model="data.workSchedule"
                        disabled
                        class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                    />
                </div>
            </div>
            <!-- Problem Description -->
            <div class="mb-6">
                <label for="problem" class="block text-sm font-medium text-gray-700">
                Problem <span class="text-red-500">*</span>
                </label>
                <textarea
                id="problem"
                v-model="data.problem"
                disabled
                placeholder="Describe the problem in detail"
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-6">
                 <!-- Job Order Details -->
                <div class="mb-6">
                    <label for="manual_job_order_number" class="block text-sm font-medium text-gray-700">
                        Manual Job Order Number
                    </label>
                    <input
                        type="text"
                        id="manual_job_order_number"
                        v-model="data.manualJobOrderNumber"
                        disabled
                        placeholder="Enter Manual Job Order Number"
                        class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                    />
                </div>
            
                <!-- Location SKU -->
                <div class="mb-6">
                    <label for="location_sku" class="block text-sm font-medium text-gray-700">
                        Location SKU
                    </label>
                    <input
                        type="text"
                        id="manual_job_order_number"
                        v-model="data.locationName"
                        disabled
                        placeholder="Enter Locatin SKU"
                        class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                    />
                </div>
                 <!-- Maintenance Employee -->
                <div class="mb-6">
                    <label for="maintenance_employee_id" class="block text-sm font-medium text-gray-700">
                        Maintenance:
                    </label>
                    <input
                        type="text"
                        id="manual_job_order_number"
                        v-model="data.maintenanceEmpFirstName"
                        disabled
                        placeholder="Enter Locatin SKU"
                        class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                    />
                </div>
                <!-- Checked By Employee -->
                <div class="mb-6">
                    <label for="checked_by_employeeId" class="block text-sm font-medium text-gray-700">
                        Checked By:
                    </label>
                    <input
                        type="text"
                        id="manual_job_order_number"
                        v-model="data.checkByFirstName"
                        disabled
                        placeholder="Enter Locatin SKU"
                        class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                    />
                </div>
            </div>
        </form>
        <div v-else class="text-center flex justify-center text-red-500">
           <Loader />
        </div>
      </div>
    </Modal>
    </template>
    
    <script setup>
     import { onMounted, ref, onUnmounted, watch } from "vue";
    import Swal from "sweetalert2";
    import axios from "axios";
    import Modal from "@/views/Component/Modal.vue";
    import SearchDropdown from "@/views/Component/SearchDropdown.vue";
    import {
      VUE_APP_API_URL,
    } from "@/views/Utility/Global";
    import {
      FormDx,
      BearToken,
      Alert,
      replaceUnderScore,
      useDebounce,
      handleApiError,
      typeFormatter,
    } from "@/views/Utility/Helper";
    import { hasPermission } from "@/views/Utility/Permissions";
import Loader from "@/views/Component/Loader.vue";
    
    const token = localStorage.getItem("token");
    const emits = defineEmits(["transaction_id"]);
    const props = defineProps({
        mrf_id: Number,
    });
    const isViewJOModalOpen = ref(false);
    const data = ref([]);
    const viewJOBehavior = () => {
        isViewJOModalOpen.value = true;
        getJOInfo(); 
    }
    const getJOInfo = async () => {
        try {
            const formData = FormDx({mrf_id: props.mrf_id});
            data.value = false;
            const response = await axios.post(VUE_APP_API_URL+'mrfs/get-job-order-of-mrf',formData,BearToken(token));
            
            data.value = response.data.jobOrder ?? [];
        } catch (error) {
            console.log(error);
            handleApiError(error);
        }
    }
    onMounted(() => {
        
    });
    </script>
    