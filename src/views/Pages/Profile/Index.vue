<template>
  <div>
    <div class="p-4 min-h-screen rounded-lg dark:border-gray-700">
      <BreadCrumbs :page="'Profile Management'" />
      <h1 class="text-2xl font-bold mb-4 mt-4">Profile Management</h1>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Profile Details -->

        <div class="w-full md:w-1/2 bg-white h-full">
          <div class="mb-8 border rounded-lg shadow-xs p-4">
            <h2 class="text-xl font-semibold mb-4">Profile Details</h2>

            <div class="mb-4">
              <img 
                  :src="profilePicture" 
                  alt="Profile Picture" 
                  class="w-24 h-24 rounded-full border-2 border-slate-500"
              />
            </div>
            <div class="mb-4">
              <strong>Name:</strong> {{ profile[0].name }}
            </div>
            <div class="mb-4">
              <strong>Email:</strong> {{ profile[0].email }}
            </div>
            <div class="">
              <strong>Role:</strong> {{ profile[0].roleName }}
            </div>
          </div>
          <!-- <div class="mb-8 border rounded-lg shadow-xs p-4">
            <h2 class="text-xl font-semibold mb-4">Company</h2>
            <form @submit.prevent="updateUserCompany" class="space-y-4 bg-white">
              <div class="mb-4">
                <label for="new-password" class="block text-sm font-medium text-gray-700">Select Company</label>
                <select
                  v-model="companyForm.our_company_id"
                  class="shadow shadow-gray-700 w-full font-bold text-lg py-2 px-4 rounded-lg border border-gray-300"
                >
                  <option value="0">--Select Company--</option>
                  <option v-for="(c,cc) in companies" :key="cc" :value="c.value">{{ c.label }}</option>
                </select>
              </div>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <i class="fa fa-save"></i>
                <span class="ms-2">Update</span>
              </button>
            </form>
          </div> -->
          <div class="mb-8 border rounded-lg shadow-xs p-4">
            <h2 class="text-xl font-semibold mb-4">System Theme</h2>
            <form class="space-y-4 bg-white">
              <div class="mb-4">
                <label for="new-password"  class="block text-sm font-medium text-gray-700">Select Theme</label>
                <select v-model="selectedBg" @change.prevent="changeBackground" class="shadow shadow-gray-700 w-full font-bold text-lg py-2 px-4 rounded-lg border border-gray-300">
                  <option disabled value="">Select a background</option>
                  <option v-for="(bgClass, index) in BG_OPTIONS" :key="index" :value="bgClass.value">
                    {{ bgClass.label }}
                  </option>
                </select>
              </div>
            </form>
          </div>
          <!-- Add more profile details as needed -->
        </div>

        <!-- Forms -->
        <div class="w-full md:w-1/2">
          <!-- Update Profile Form -->
          <div class="mb-8 shadow-xs border rounded-lg p-4">
            <h2 class="text-xl font-semibold mb-4">Update Profile Information</h2>
            <form @submit.prevent="updateProfile" class="space-y-4 bg-white">
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  placeholder="Enter your name"
                  class="shadow shadow-gray-700 w-full font-bold text-lg py-2 px-4 rounded-lg border border-gray-300"
                />
              </div>
              <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  placeholder="Enter your email"
                  class="shadow shadow-gray-700 w-full font-bold text-lg py-2 px-4 rounded-lg border border-gray-300"
                />
              </div>
              <!-- Add more fields as needed -->
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <i class="fa fa-save"></i>
                <span class="ms-2">Save Changes</span>
              </button>
            </form>
          </div>

          <!-- Reset Password Form -->
          <div class="mb-8 shadow-xs p-4 border rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Reset Password</h2>
            <form @submit.prevent="resetPassword" class="space-y-4 bg-white">
              <div class="mb-4">
                <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="new-password"
                  v-model="resetForm.new_password"
                   minlength="8"
                  placeholder="Enter a new password"
                  class="shadow shadow-gray-700 w-full font-bold text-lg py-2 px-4 rounded-lg border border-gray-300"
                />
              </div>
              <div class="mb-4">
                <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  v-model="resetForm.confirm_password"
                  minlength="8"
                  placeholder="Confirm your new password"
                  class="shadow shadow-gray-700 w-full font-bold text-lg py-2 px-4 rounded-lg border border-gray-300"
                />
              </div>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <i class="fa fa-lock"></i>
                <span class="ms-2">Reset Password</span>
              </button>
            </form>
          </div>
          
          <!-- Reset Password Form -->
          <div class="mb-8 shadow-xs p-4 border rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Zoho Books</h2>
            <form @submit.prevent="setZohoBooksToken" class="space-y-4 bg-white">
              <div class="mb-4">
                <label for="new-password" class="block text-sm font-medium text-gray-700">Client ID</label>
                <input
                  type="text"
                  id="new-password"
                  v-model="zohoTokens.client_id"
                   minlength="8"
                  placeholder="Enter a Client ID"
                  class="shadow shadow-gray-700 w-full font-bold text-lg py-2 px-4 rounded-lg border border-gray-300"
                />
              </div>
              <div class="mb-4">
                <label for="confirm-password" class="block text-sm font-medium text-gray-700">Client Secret</label>
                <input
                  type="text"
                  id="confirm-password"
                  v-model="zohoTokens.client_secret"
                  minlength="8"
                  placeholder="Confirm your Client Secret"
                  class="shadow shadow-gray-700 w-full font-bold text-lg py-2 px-4 rounded-lg border border-gray-300"
                />
              </div>
              <div class="mb-4">
                <label for="confirm-password" class="block text-sm font-medium text-gray-700">Refresh Token</label>
                <input
                  type="text"
                  id="confirm-password"
                  v-model="zohoTokens.refresh_token"
                  minlength="8"
                  placeholder="Confirm your Refresh Token"
                  class="shadow shadow-gray-700 w-full font-bold text-lg py-2 px-4 rounded-lg border border-gray-300"
                />
              </div>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <i class="fa fa-lock"></i>
                <span class="ms-2">Set Token</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from 'sweetalert2';
import { VUE_APP_API_URL, PERMISSION, BG_OPTIONS } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError
} from "@/views/Utility/Helper";
import BreadCrumbs from '@/views/Component/BreadCrumbs.vue';
import profilePicture from '../../../assets/images/profile/profile.png';

const token = localStorage.getItem("token");
const profile = ref(JSON.parse(localStorage.getItem('user')));
const companies = ref([]);
const selectedBg = ref(localStorage.getItem('theme'))

const form = ref({
  name: '',
  email: ''
});

const resetForm = ref({
  new_password: '',
  confirm_password: ''
});

const companyForm = ref({
  our_company_id: 0,
});

const zohoTokens = ref({
  client_id: '*****',
  client_secret: '*****',
  refresh_token: '*****',
});

const updateProfile = async () => {
  try {
    const formData = FormDx(form.value);
    const response = await axios.post(`${VUE_APP_API_URL}users/update`, formData, BearToken(token));
    Alert("success", "Success", response.data.message);

    //set new user info in localStorage users and profile info
    profile.value = response.data.userInfo;
    localStorage.setItem('user',JSON.stringify(response.data.userInfo));
   
    // Reload the current page
    window.location.reload();
  } catch (error) {
    handleApiError(error);
  }
};

const resetPassword = async () => {
  if (resetForm.value.new_password !== resetForm.value.confirm_password) {
    Alert("warning", "Warning!", 'Passwords do not match!');
    return;
  }

  try {
    const formData = FormDx(resetForm.value);
    const response = await axios.post(`${VUE_APP_API_URL}users/change-password-in-user`, formData, BearToken(token));
    // Alert("success", "Success", response.data.message);
    logOut();
  } catch (error) {
    handleApiError(error);
  }
};

const setZohoBooksToken = async () => {
  try {
    const formData = FormDx(zohoTokens.value);
    const response = await axios.post(`${VUE_APP_API_URL}zoho-books/set-token`, formData, BearToken(token));
    Alert("success", "Success", response.data.message);
  } catch (error) {
    handleApiError(error);
  }
};

const getZohoBooksToken = async () => {
  try {
    const response = await axios.post(`${VUE_APP_API_URL}zoho-books/get-token`, {}, BearToken(token));
    zohoTokens.value.client_id = response.data.tokens.clientId;
    zohoTokens.value.client_secret = response.data.tokens.clientSecret;
    zohoTokens.value.refresh_token = response.data.tokens.refreshToken;
    Alert("success", "Success", response.data.message);
  } catch (error) {
    handleApiError(error);
  }
};

const logOut = async () => {
    try {
        // Reload the page after successful login
        const response = axios.post(VUE_APP_API_URL+'logout',{id: 0},BearToken(token));
        if (response) {
            // Preserve theme in localStorage
            const theme = localStorage.getItem('theme');
            
            Swal.fire({
                title: 'Successfully changed the password!',
                text: 'We need to log you out to test the password correctness.',
                didOpen: () => {
                  Swal.showLoading();
                },
                timer: 2000,
                timerProgressBar: true, 
                allowOutsideClick: false, // Disable click outside to dismiss
            });
            // Clear everything in localStorage except for the theme
            localStorage.clear();
            if (theme) {
                localStorage.setItem('theme', theme); // Restore theme setting
            }

            // Clear session storage
            sessionStorage.clear();

            // Reload the page to reflect changes
            location.reload();
        }

       
    } catch (error) {
        console.error('Error logging out:', error);
    }
};
const defaultValue = async () => {
  form.value = {
    email: profile.value[0].email ?? 'No Name',
    name: profile.value[0].name ?? 'Test@gmail.com',
  }

  await getDefaultTheme();
  await getDefaultCompany();
  await getCompanyDropdown();
}
const updateUserCompany = async () => {
  try {
        const formData = FormDx(companyForm.value);
        const response = await axios.post(VUE_APP_API_URL+'users/set-our-company-id',formData,BearToken(token));
        
        Alert("success", "Success", response.data.message);
        getDefaultCompany();
  } catch (error) {
        handleApiError(error);
  }
}
const changeBackground = () => {
  // Set the theme in localStorage
  localStorage.setItem('theme', selectedBg.value);

  // Check localStorage value
  console.log('Theme in localStorage:', localStorage.getItem('theme'));

  window.location.reload();
};

const getCompanyDropdown = async () => {
  try {
        const formData = FormDx(companyForm.value);
        const response = await axios.post(VUE_APP_API_URL+'our-companies/dropdown',formData,BearToken(token));
        
        companies.value = response.data.ourcompanies;
  } catch (error) {
        handleApiError(error);
  }
}
const getDefaultCompany = async () => {
  try {
        const response = await axios.get(VUE_APP_API_URL+'users/get-selected-our-company-id',BearToken(token));
        
        companyForm.value.our_company_id = response.data.ourCompanyId;
  } catch (error) {
        handleApiError(error);
  }
}
const getDefaultTheme = () => {
  selectedBg.value = localStorage.getItem('theme') ?? 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900';
}
// Call fetchProfile when component is mounted
onMounted(() => {
  defaultValue();
  getZohoBooksToken();
});
</script>
<style>
.profile-picture-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem; /* Adjust as needed */
}

.profile-picture {
  width: 6rem; /* Adjust as needed */
  height: 6rem; /* Adjust as needed */
  border-radius: 50%;
  border: 2px solid #fbbf24; /* Adjust border color as needed */
}

</style>