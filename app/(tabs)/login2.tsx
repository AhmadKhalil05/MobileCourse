import React, { useState } from "react";
import {
    Text,
    StyleSheet,
    Alert,
    Pressable, View, TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Image} from "expo-image";
import NewComponent from "@/components/new-component";
import {router} from "expo-router";

export default function Login2Screen() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (text: any) => {
        setEmail(text);
    }

    const handlePasswordChange = (text: any) => {
        setPassword(text);
    }

    const onSubmit = () => {
        router.back()
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login Page</Text>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.reactLogo} />
            <View style={styles.container}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={[styles.input]}
                    onChangeText={handleEmailChange}
                    value={email}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={[styles.input]}
                    onChangeText={handlePasswordChange}
                    value={password}
                    placeholder="Password"
                    autoCapitalize="none"
                    secureTextEntry={true}
                />
            </View>
            <NewComponent name={"test"} email={email} password={password} />
            <Pressable
                onPress={onSubmit}
                style={({ pressed }) => [
                    styles.button,
                    pressed && { opacity: 0.7 },
                ]}
            >
                <Text style={styles.buttonText}>Back</Text>
            </Pressable>
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
