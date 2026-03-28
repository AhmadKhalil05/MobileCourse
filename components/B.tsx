import {StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import C from "@/components/C";

const B = ({onChange, email}: any) => {

    return (
        <View>
            <Text>B</Text>
            <C onChange={onChange} email={email}></C>
        </View>

    )
}
export default B;
