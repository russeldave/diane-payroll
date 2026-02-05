import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useSessionStore = defineStore('session', () => {
  const user = ref(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  const setSession = (userInfo) => {
    user.value = userInfo;
  };

  const clearUser = () => {
    user.value = null;
  };

  // 🔥 This is the KEY for new tabs
  const fetchSession = async () => {
    try {
      loading.value = true;
      const res = await axios.get('/api/me');
      user.value = res.data.user;
    } catch (e) {
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    setSession,
    clearUser,
    fetchSession
  };
});
