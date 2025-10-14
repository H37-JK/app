import {FlatList, Pressable} from 'react-native';
import {Link} from 'expo-router';
import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import useAppStore from "@/store/userStore";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";


const users = [
    {id: '1', name: '호종규'},
    {id: '2', name: '호종규2'},
    {id: '3', name: '호종규3'},
    {id: '4', name: '호종규4'},
]

export default function UserListScreen() {
    const user = useAppStore(state => state.user)
    return (
        <ThemedView>
            <ThemedText>{user.email}</ThemedText>
            <FontAwesome name="comments" size={30} color="white" />;

            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <Link href={`/users/${item.id}`} asChild>
                        <Pressable>
                            <ThemedText>{item.name}</ThemedText>
                        </Pressable>
                    </Link>
                )}
            />
        </ThemedView>
    );
}
