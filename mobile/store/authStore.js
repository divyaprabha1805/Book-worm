import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    token: null,
    isCheckingAuth: false,
    
    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${ API_URL }/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              email,
              password,
            }),
          });
      
          const data = await response.json();
          // 🔍 Log the user object received from backend
        console.log("Received user from server (register):", data.user);
          
          if (!response.ok) throw new Error(data.message || "Something went wrong");
          await AsyncStorage.setItem("user", JSON.stringify(data.user));
          await AsyncStorage.setItem("token", data.token);

          set({ user: data.user, token: data.token, isLoading: false });
          return {success: true };
            
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${ API_URL }/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });
      
          const data = await response.json();

          // 🔍 Log the user object received from backend
          console.log("Received user from server (login):", data.user);
      
        if (!response.ok) throw new Error(data.message || "Something went wrong");
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);
    
            set({ user: data.user, token: data.token, isLoading: false });
    
            return { success:true }; // Indicate successful login
          
        } catch (error) {
          console.error("Error during login:", error.message);
          set({ isLoading: false, error: "Network error or server not reachable" });
          return false; // Indicate failed login
        }
      },
    checkAuth: async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const userJson = await AsyncStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
    
        set({ token, user });
    } catch (error) {
        console.log("Auth check failed", error);
    } finally {
        set({ isCheckingAuth: false });
    }
   },

    logout: async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        set({ token: null, user: null });
    },
}));