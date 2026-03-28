import {Text, View} from "react-native";

const NewComponent = ({name, email, password}: any) => {
    return (
        <View>
            <Text>Your name is: {name}</Text>
            <Text>Your email is: {email}</Text>
            <Text>Your email is: {password}</Text>
        </View>
    );
}

export default NewComponent;