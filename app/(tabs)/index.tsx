import {StyleSheet, View} from "react-native";
import A from "@/components/A";
import B from "@/components/B";
import D from "@/components/D";
import {useState} from "react";

function HomeScreen () {
    const [email, setEmail] = useState<string>("");

    const onChange = (text: string) => {
        setEmail(text)
    }

    return (
        <View style={styles.container}>
            <A email={email}></A>
            <B onChange={onChange} email={email}></B>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
})
export default HomeScreen;