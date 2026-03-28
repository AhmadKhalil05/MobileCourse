import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
} from "react-native";
import { Controller, Control, FieldValues, RegisterOptions } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
    name: string;
    control: Control<T>;
    rules?: any;
    label?: string;
} & TextInputProps;

export function FormInput<T extends FieldValues>({
     name,
     control,
     rules,
     label,
     ...inputProps
 }: FormInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name as any}
            rules={rules}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View style={styles.container}>
                    {label && <Text style={styles.label}>{label}</Text>}

                    <TextInput
                        style={[styles.input, error && styles.errorInput]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        {...inputProps}
                    />

                    {error && (
                        <Text style={styles.errorText}>{error.message}</Text>
                    )}
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
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
