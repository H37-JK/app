import { SplashScreen } from "expo-router";
import useAuthStore from "@/src/store/authStore";

SplashScreen.preventAutoHideAsync()

export default function SplashScreenController() {
    const { isLoading } = useAuthStore()

    if (!isLoading) {
        SplashScreen.hide()
    }
    return null;
}