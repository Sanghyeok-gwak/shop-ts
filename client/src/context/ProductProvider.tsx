
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Product, NewProduct } from "../types/product";
import { ProductContext } from "./ProductContext";
import {
  createProduct,
  deleteProduct,
  getProducts,
  modifyProduct,
} from "../api/products";




const ProductProvider = ({children} : {children: React.ReactNode}) => {
  const [products, setProducts] = useState<Product[]>([]);
  // 처음에는 불러오는 중(true), 응답을 받으면(성공/실패 모두) false
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 상품 목록 불러오기(화면이 렌더링될때 한 번 가져옴)
  useEffect(() => {
      getProducts()
          .then(setProducts)
          .catch(err => console.log("상품 목록 조회 오류", err))
          .finally(() => setIsLoading(false));
  }, []);

  // 상품 추가
  const addProduct = async (newProduct: NewProduct) => {
    await createProduct(newProduct);
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
  };

  // 상품 삭제
  const removeProduct = async (productId: number) => {
    await deleteProduct(productId);

    setProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  // 상품 수정
  const updateProduct = async (updatedProduct: Product) => {
    await modifyProduct(updatedProduct);

    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        addProduct,
        removeProduct,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
