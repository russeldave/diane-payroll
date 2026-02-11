<template>
  <div
    class="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 opacity-80"
    :class="
      IS_DEV
        ? 'bg-red-500'
        : 'bg-gradient-to-l from-black via-red-600 via-red-700 via-red-500 via-red-700 to-[#800000]'
    "
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        Register account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm shadow">
      <form
        class="space-y-10 bg-slate-800 p-4 rounded text-white"
        @submit.prevent="register"
      >
        <div>
          <label for="email" class="block text-xl font-medium leading-6 text-gray-200"
            >Name</label
          >
          <div class="mt-2">
            <input
              id="email"
              v-model="form.name"
              name="email"
              type="text"
              autocomplete="email"
              required
              placeholder="Input Name"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label for="email" class="block text-xl font-medium leading-6 text-gray-200"
            >Email address</label
          >
          <div class="mt-2">
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              placeholder="Input Email Address"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-xl font-medium leading-6 text-gray-200"
            >Password</label
          >
          <div class="relative flex w-full">
            <input
              id="password"
              v-model="form.password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Input Password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <button
              @click.prevent="togglePasswordVisibility"
              type="button"
              class="absolute font-extrabold text-yellow-500 inset-y-0 right-0 px-4 rounded-r shadow"
            >
              <i :class="showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
            </button>
          </div>
          <small v-if="error" class="text-red-500 mt-2">{{ error }}</small>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useSessionStore } from "@/stores/sessionStore";
import { useRouter } from "vue-router";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { getPermissions, getRoles } from "../Utility/PreProcess";
import { FormDx, Hydra, Alert } from "../Utility/Helper";
const sessionStore = useSessionStore();
const router = useRouter();

const error = ref("");
const showPassword = ref(false);
const form = ref({
  name: "",
  email: "",
  password: "",
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const register = async () => {
  try {
    const formData = FormDx(form.value);
    const response = await axios.post(`${VUE_APP_API_URL}/register`, formData);

    if (response.data && response.data.token && response.data.userInfo) {
      const { token, userInfo } = response.data;

      // Save the session in Pinia store
      sessionStore.setSession(userInfo, token);
      // Fetch necessary data after successful login
      await preProcess();

      // Redirect to dashboard or desired route
      window.location.replace("mrf");
    } else {
      error.value = response.data.message;
      setTimeout(() => {
        error.value = "";
      }, 1000);
      // Alert('warning','Warning',response.data.message);
    }
  } catch (e) {
    error.value = e.response.data.message;
    setTimeout(() => {
      error.value = "";
    }, 1000);
    // Alert('error','Error!',e.response.data.message);
  }
};

const preProcess = async () => {
  await getPermissions();
  await getRoles();
};
</script>

<style scoped>
/* Your scoped styles */
</style>
