<template>
  <div
    class="flex min-h-screen flex-col justify-center p-0 opacity-80 bg-gradient-to-l from-[#4B0082] via-blue-600 via-blue-700 via-blue-500 via-blue-700 to-[#4B0082]"
  >
    <div class="sm:mx-auto sm:w-full justify-center flex sm:max-w-sm">
      <RouterLink
        to="/system-information"
        class="flex items-center justify-center space-x-0"
      >
        <span class="hover:scale-110 animate-pulse">
          <!-- Inline SVG Logo with Transparent Background and White 3D Text -->
          <svg
            width="300"
            height="50"
            viewBox="0 0 150 50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="1"
                  dy="1"
                  stdDeviation="0.5"
                  flood-color="#CCCCCC"
                  flood-opacity="0.5"
                />
              </filter>
            </defs>
            <g font-family="Helvetica, Arial, sans-serif" text-anchor="start">
              <!-- Shadow text for 3D effect -->
              <text
                x="5"
                y="30"
                font-size="35"
                font-weight="bold"
                fill="#CCCCCC"
                letter-spacing="1"
                filter="url(#shadow)"
              >
                brixe
              </text>
              <text
                x="5"
                y="45"
                font-size="14"
                font-weight="lighter"
                fill="#CCCCCC"
                letter-spacing="1.5"
                filter="url(#shadow)"
              >
                bistro + cafe | multi-store
              </text>
              <!-- Main text -->
              <text
                x="4"
                y="29"
                font-size="35"
                font-weight="bold"
                fill="#FFFFFF"
                letter-spacing="1"
              >
                brixe
              </text>
              <text
                x="4"
                y="44"
                font-size="14"
                font-weight="lighter"
                fill="#FFFFFF"
                letter-spacing="1.5"
              >
                bistro + cafe | multi-store
              </text>
            </g>
          </svg>
        </span>
      </RouterLink>
    </div>

    <div
      class="mt-6 sm:mx-auto sm:w-full sm:max-w-md border-white border-t-2 border-l-2 shadow-[8px_8px_0_rgba(0,0,0,0.30)] rounded-lg p-6 bg-gradient-to-br from-amber-200 via-amber-300 via-amber-400 to-amber-500"
    >
      <form class="space-y-6" @submit.prevent="login">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm uppercase font-medium text-gray-700"
            >Username</label
          >
          <div class="mt-2">
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              autocomplete="username"
              placeholder="Enter your username"
              class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <p v-if="errors.username" class="text-red-500 text-xs mt-1">
            {{ errors.username[0] }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm uppercase font-medium text-gray-700"
            >Password</label
          >
          <div class="relative mt-2">
            <input
              id="password"
              v-model="form.password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Enter your password"
              class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              @click.prevent="togglePasswordVisibility"
              type="button"
              class="absolute inset-y-0 right-0 px-4 text-xl text-gray-600"
            >
              <i :class="showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">
            {{ errors.password[0] }}
          </p>
        </div>

        <!-- Error Message -->
        <!-- <small v-if="errors.message" class="text-red-500 mt-2 block text-center">
          {{ errors.message }}
        </small> -->

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            class="w-full border-white border-t-2 border-l-2 bg-gradient-to-br from-blue-400 via-blue-300 via-blue-400 via-blue-700 to-blue-950 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-200 transition duration-300"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import axios from "axios";
import { useSessionStore } from "@/stores/sessionStore";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { getPermissions } from "../Utility/PreProcess";

const sessionStore = useSessionStore();
const router = useRouter();

const errors = ref({}); // ✅ object, not boolean
const message = ref(""); // optional
const showPassword = ref(false);
const form = ref({
  username: "",
  password: "",
});

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  try {
    Swal.fire({
      title: "Processing...",
      text: "Checking credentials...",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    await sessionStore.login({
      username: form.value.username,
      password: form.value.password,
    });

    await nextTick(); // ✅ ensure reactivity has updated

    Swal.close();
    router.push("/users");

    window.location.reload();
  } catch (error) {
    console.error("Login error:", error);
    Swal.close();
  }
};

// Preload permissions or other data after login
const preProcess = async (token) => {
  await getPermissions();
  // await getRoles(token);
  // await getUnits(token);
};
</script>

<style scoped>
/* Styles for the loader */
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
