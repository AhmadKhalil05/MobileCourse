import React from "react";
import {
    Text,
    StyleSheet,
    Alert,
    Pressable,
    View,
    TextInput,
} from "react-native";
import {Controller, useForm} from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormInput } from "@/components/ui/FormInput";
import { router } from "expo-router";
import {Image} from "expo-image";
import { login } from "@/api/UsersService"
type FormData = {
    email: string;
    password: string;
};

export default function LoginScreen() {
    const { control, handleSubmit } = useForm<FormData>({ mode: "all" });

    const onSubmit = async (data: FormData) => {
        router.push('/products')
    };
    const handleOnPress = () => {
        router.back();
    }


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login Page</Text>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.reactLogo} />
            <Controller
                control={control}
                name={"email"}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <View>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, error && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                )}
            ></Controller>
            <Pressable
                onPress={handleSubmit(onSubmit)}
                style={({ pressed }) => [
                    styles.button,
                    pressed && { opacity: 0.7 },
                ]}
            >
                <Text style={styles.buttonText}>Products</Text>
            </Pressable>
            <Pressable onPress={handleOnPress}>back</Pressable>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#f9fafb",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 32,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#2563eb",
        paddingVertical: 14,
        borderRadius: 10,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
    },
    reactLogo: {
        height: 178,
        width: 290,
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: "500",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
    },
    errorInput: {
        borderColor: "#ff4d4f",
    },
    errorText: {
        color: "#ff4d4f",
        marginTop: 4,
        fontSize: 12,
    },
});
