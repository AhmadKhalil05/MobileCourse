import ApiBase from "@/api/ApiBase";

export const getProducts = async () => {
    const response = await ApiBase.get('/api/v1/products');
    return response.data;
}

export const getProductById = async (id: any) => {
    return await ApiBase.get(`/api/v1/products/${id}`);
}

export const addProduct = async (payload: any) => {
    return await ApiBase.post(`/api/v1/products`, payload);
}

export const deleteProduct = async (id: string) => {
    return await ApiBase.post(`/api/v1/products/${id}`);
}
