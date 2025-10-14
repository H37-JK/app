import {Platform} from "react-native";
import * as SecureStore from 'expo-secure-store';
import {create} from 'zustand';


interface User {
    id: string
    name: string
    email: string
}

interface AuthState {
    user: User | null
    accessToken: string | null
    isLoggedIn: boolean
}

interface AuthAction {
    login: (tokens: { accessToken: string, refreshToken: string }) => Promise<void>
    logout: () => Promise<void>
    verifyAuth: () => Promise<void>
}

const useAuthStore = create<AuthState & AuthAction>((set, get) => ({
    accessToken: null,
    user: null,
    isLoggedIn: false,

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
        const accessToken = await SecureStore.getItemAsync('accessToken')
        if (accessToken) {
            return
        }

        set({ user, accessToken, isLoggedIn: true })
    }
}))


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