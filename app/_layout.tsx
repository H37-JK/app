import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import {useColorScheme} from '@/src/hooks/use-color-scheme';
import "../global.css"
import useAuthStore from "@/src/store/authStore";
import {useEffect, useState} from "react";
import SplashScreenController from "@/app/SplashScreenController";
import {supabase} from "@/src/lib/supabase";
import {setEngine} from "node:crypto";

export const unstable_settings = {
    anchor: '(tabs)',
};

interface User {
    id: number
    email: string
    password: string
}

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const {isLoggedIn, verifyAuth, setIsLoading} = useAuthStore();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const {data, error} = await supabase.from('user').select('*')

                if (error) {
                    console.error(error)
                    setError(error.message)
                } else {
                    console.log(data)
                    setUsers(data)
                }
            } catch(e: any) {
                setError(e.message)
            } finally {
                setIsLoading(false)
            }
        }
        getUsers().then(r => console.log(r));
    }, [setIsLoading]);

    useEffect(() => {
        const bootstrapAsync = async () => {
            await verifyAuth()
            setIsLoading(false)
        };
        bootstrapAsync();
    }, [setIsLoading, verifyAuth])


    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <SplashScreenController/>
            <Stack>
                <Stack.Protected guard={!isLoggedIn}>
                    <Stack.Screen name="(auths)" options={{headerShown: false}}/>
                </Stack.Protected>
                <Stack.Protected guard={isLoggedIn}>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                </Stack.Protected>
                <Stack.Screen name="modal" options={{presentation: 'modal', title: 'Modal'}}/>
            </Stack>
            <StatusBar style="auto"/>
        </ThemeProvider>
    );
}