import { create } from 'zustand'
import { apiCall } from '../lib/axios'
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL;

export const useAuthStore = create((set, get) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await apiCall.get('/auth/check');
            set({ user: res.data.data })
            get.connectSocket();
        } catch (err) {
            set({ user: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res =await apiCall.post('/auth/register', data);
            toast.success('Account created successfully')
            set({ user: res.data.data })
            get.connectSocket();
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            await apiCall.post('/auth/logout');
            set({ user: null })
             toast.success('Logged out successfully')
            get().disconnectSocket();
        } catch (err) {
            toast.error(err.response.data.message)
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res =await apiCall.post('/auth/login', data);
            set({ user: res.data.data })
            toast.success('Logged in successfully')

            get().connectSocket();
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await apiCall.put('/auth/update-profile', data)
            set({ user: res.data.data})
            toast.success('Profile picture update successfully')
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: async () => {
        const { user } = get();
        
        if (!user || get().socket?.connected) return;

        const socket = io(socketUrl, {
            query: {
                userId: user.id
            }
        });
        socket.connect();

        set({ socket })

        socket.on('connected-users', (userIds) => {
            set({ onlineUsers: userIds })
        })
    },

    disconnectSocket: async () => {
        if (!get().socket) return;
        get().socket.disconnect();
    }
    
}))