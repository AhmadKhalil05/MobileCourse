import {View, Text, StyleSheet, Pressable} from "react-native";
import {useEffect, useState} from "react";
import {getProductById} from "@/api/ProductsService";
import {Image} from "expo-image";
import {router, useLocalSearchParams} from "expo-router";

const ProductDetails = () => {
    const [productDetails, setProductDetails] = useState<any>({});
    const { id } = useLocalSearchParams();

    const handleOnPress = () => {
        router.replace('/login2');
    }

    const fetchData = async () => {
        const response = await getProductById(id);
        console.log(response.data);
        setProductDetails(response.data);
    }
    useEffect(() => {
        fetchData()
    }, []);

    return (
        <View>
            <Image style={styles.image} source={{uri: productDetails?.imageUrl}} />
            <Text style={styles.text}>{productDetails?.description}</Text>
            <Pressable onPress={handleOnPress}>Go to login2</Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    image: {
        height: 178,
        width: 500,
    },
    text: {
        fontSize: 16,
        marginTop: 32,
        textAlign: "center",
    },
});

export default ProductDetails;
