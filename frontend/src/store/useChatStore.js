import { create } from 'zustand'
import { apiCall } from '../lib/axios'
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await apiCall.get('/messages/users');
            set({ users: res.data.data })
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await apiCall.get(`/messages/${userId}`);
            set({ messages: res.data.data })
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },
    sendMessage: async (data) => {
        const { messages, selectedUser } = get()
        set({ isSendingMessage: true })
        try {
            const res = await apiCall.post(`/messages/send/${selectedUser?._id}`, data);
            set({ messages: [...messages, res.data.data] })
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ isSendingMessage: false })
        }
    },
    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },

    subscribeToMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on('new-message', (message) => {
            console.log('new-message', message)
            set({ messages: [...get().messages, message] })
        })
    },
    unsubscribeFromMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.off('new-message');
    }
}))