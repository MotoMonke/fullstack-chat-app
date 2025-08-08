import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
export const useAuthStore = create((set) => ({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get('/auth/check');
            
            set({authUser:res.data});
        } catch (error) {
            console.log('error in checkAuth ',error);
            set({authUser:null});
        } finally {
            set({isCheckingAuth:false});
        }
    },

    signup: async (data,navigate) => {
        try {
            set({ isSigningUp: true });
            const res = await axiosInstance.post('/auth/signup', data);
            toast.success('Account created successfully');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        try {
            set({ isLoggingIn: true });
            const res = await axiosInstance.post('/auth/login', data);
            set({authUser:res.data});
            toast.success('Logged in successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            toast.success('Logged out successfully');
        } catch (error) {
            console.log(error);
             toast.error(error.response?.data?.message || 'Logout failed');
        }
    }
}))