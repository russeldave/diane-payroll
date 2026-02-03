// sessionStore.js
import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null,
    token: null,
    warehouses: null
  }),

  actions: {
    setSession(user, token, userHasWarehouses) {
      this.user = user;
      this.token = token;
      this.warehouses = userHasWarehouses;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('warehouses', JSON.stringify(userHasWarehouses));
    },

    clearSession() {
      this.user = null;
      this.token = null;
      this.warehouses = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('warehouses');
    },

    restoreSession() {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      const storedWarehouse = localStorage.getItem('warehouses');
      if (storedUser && storedToken) {
        this.user = JSON.parse(storedUser);
        this.warehouses = JSON.parse(storedWarehouse);
        this.token = storedToken;
      }
    },
  },
});
