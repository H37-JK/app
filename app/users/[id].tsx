import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router'
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";

const users = [
    { id: '1', name: '호종규' }
]

export default function UserDetailScreen() {
    const { id } = useLocalSearchParams()
    const user = users.find(u => u.id === id)

    if (!user) {
        return (
            <ThemedView>
                <ThemedView>사용자를 찾을 수 없습니다.</ThemedView>
            </ThemedView>
        )
    }

    return (
        <ThemedView>
            <Stack.Screen options={{ title: user.name }} />
            <ThemedText>{user.name}</ThemedText>
            <ThemedText>{user.id}</ThemedText>
        </ThemedView>
    );
}