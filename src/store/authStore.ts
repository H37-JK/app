import {Platform} from "react-native";
import * as SecureStore from 'expo-secure-store';
import {create} from 'zustand';
import {apiClient} from "@/src/api/apiClient";


interface User {
    id: string
    name: string
    email: string
}

interface AuthState {
    user: User | null
    accessToken: string | null
    isLoggedIn: boolean
    isLoading: boolean
}

interface AuthAction {
    login: (tokens: { accessToken: string, refreshToken: string }) => Promise<void>
    logout: () => Promise<void>
    verifyAuth: () => Promise<void>
    setIsLoading: (isLoading: boolean) => void
}

const useAuthStore = create<AuthState & AuthAction>((set, get) => ({
    accessToken: null,
    user: null,
    isLoggedIn: false,
    isLoading: true,

    setIsLoading: (isLoading) => set({ isLoading }),

    login: async (tokens) => {
        await setStorageItemAsync('accessToken', tokens.accessToken)
        await setStorageItemAsync('refreshToken', tokens.refreshToken)
        set({ accessToken: tokens.accessToken, isLoggedIn: true })
        await get().verifyAuth()
    },

    logout: async () => {
        await setStorageItemAsync('accessToken')
        await setStorageItemAsync('refreshToken')
        set({ accessToken: null, user: null, isLoggedIn: false });
    },

    verifyAuth: async () => {
        const accessToken = await getStorageItemAsync('accessToken')
        if (!accessToken) {
            return
        }

        try {
            const response = await apiClient.get<User>('/api/user/me')
            const user = response.data

            set ({ user, accessToken, isLoggedIn: true })
        } catch (error) {
            console.log('에러', error)
            await get().logout()
        }
    }
}))

export default useAuthStore

export async function getStorageItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
        try {
            return localStorage.getItem(key)
        } catch (e) {
            console.error(e)
            return null
        }
    } else {
        return await SecureStore.getItemAsync(key)
    }
}

export async function setStorageItemAsync(key: string, value: string | null = null) {
    if (Platform.OS === 'web') {
        try {
            if (value === null) {
                localStorage.removeItem(key)
            } else {
                localStorage.setItem(key, value)
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e)
        }
    } else {
        if (value === null) {
            await SecureStore.deleteItemAsync(key)
        } else {
            await SecureStore.setItemAsync(key, value)
        }
    }
}