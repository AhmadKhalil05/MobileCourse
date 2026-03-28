import {ScrollView, StyleSheet, Text, View} from "react-native";
import ProductCard from "@/components/product-card";
import {useState} from "react";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    return (
        <View>
            <Text>Product List</Text>
            <ScrollView>
                {products.map((product: any) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </ScrollView>
        </View>
    )
}

export default ProductList;
