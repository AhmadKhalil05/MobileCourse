import {StyleSheet, Text, View} from "react-native";
import {Link} from "expo-router";
import {Image} from "expo-image";

const ProductCard = ({id, name, price, imageUrl}: any) => {

    return (
        <View style={styles.productCard} key={id}>
            <Link href={"/product-details/" + id }>
                <Image style={styles.image} source={{uri: imageUrl}} />
                <View style={styles.title}>
                    <Text>{name}</Text>
                    <Text>${price}</Text>
                </View>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    productCard: {
        flex: 1,
        padding: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        margin: 20,
        textAlign: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 32,
        textAlign: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        width: '100%',
    },
    image: {
        height: 178,
        width: 290,
    },
});

export default ProductCard;