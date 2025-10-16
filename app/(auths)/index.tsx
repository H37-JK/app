import {
    ImageBackground,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function LoginScreen() {
    return (
        <ImageBackground
            source={require('@/assets/images/login-background.png')}
            className="flex-1 justify-center items-center"
        >
            <View className="w-4/5 max-w-sm">
                <Text className="text-4xl font-bold text-white text-center mb-8">
                    로그인
                </Text>

                <TextInput
                    className="w-full p-4 pl-2 text-white placeholder-white mb-4 border-b border-white"
                    placeholder="이메일"
                    placeholderTextColor="#eee"
                />

                <TextInput
                    className="w-full p-4 pl-2 text-white placeholder-white mb-6 border-b border-white"
                    placeholder="비밀번호"
                    placeholderTextColor="#eee"
                    secureTextEntry
                />

                <TouchableOpacity className="bg-sky-500 rounded-xl w-full p-4 mb-4">
                    <Text className="text-white text-center font-bold text-lg">
                        로그인
                    </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mb-6">
                    <Text className="text-white mr-1">계정이 없으신가요?</Text>
                    <TouchableOpacity>
                        <Text className="text-sky-400 font-bold">
                            계정 만들기
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-evenly items-center">
                    <TouchableOpacity>
                        <Text className="text-white">아이디</Text>
                    </TouchableOpacity>
                    <Text className="text-white/70">|</Text>
                    <TouchableOpacity>
                        <Text className="text-white">비밀번호찾기</Text>
                    </TouchableOpacity>
                    <Text className="text-white/70">|</Text>
                    <TouchableOpacity>
                        <Text className="text-white">문의하기</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ImageBackground>
    )
}