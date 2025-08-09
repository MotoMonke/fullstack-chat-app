import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async() => {
        try {
            set({isUsersLoading:true});
            const res = await axiosInstance.get('/messages/users');
            set({users: res.data});
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async(userId) => {
        try {
            set({isMessagesLoading:true});
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async(messageData)=>{
        try {
            const {selectedUser,messages} = get();
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]});
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    },

    setSelectedUser: (user) => {
        set({selectedUser:user});
    }
}))