// src/stores/sessionStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null,
    loading: false
  }),
  getters: {
    authenticated: (state) => !!state.user,
  },
  actions: {
    async login(form) {
      // 1. Mandatory CSRF initialization for Sanctum
      await axios.get('/sanctum/csrf-cookie');
      
      // 2. Perform login
      await axios.post('/login', form);
      
      // 3. Fetch user data to verify session and update state
      return this.getUser();
    },
    async logout() {
      await axios.post('/logout');
      this.user = null;
    },
    async getUser() {
      try {
        const res = await axios.get('/api/me');
        this.user = res.data;
      } catch {
        this.user = null;
      }
    }
  }
})
