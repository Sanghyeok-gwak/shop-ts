import api from './api';
import type { Category, NewProduct, Product } from '../types/product';

interface ProductRow {
  id: number;
  p_name: string;
  category: Category;
  price: number;
  description: string;
  image: string | null;  
}



const toProduct = (row: ProductRow): Product => ({
  id: row.id,
  pName: row.p_name,
  category: row.category,
  price: row.price,
  description: row.description,
  image: row.image ?? undefined,  
});

// 상품 목록 조회
export const getProducts = async () => {
  const response = await api.get<ProductRow[]>('/products');
  return response.data.map(toProduct);
}

// 상품 등록: 서버의 req.body에서 꺼내는 이름에 맞춰 보냅니다.
export const createProduct = async (product: NewProduct) => {
  await api.post('/products', {
    pName: product.pName,
    category: product.category,
    price: product.price,
    description: product.description,
    image: product.image,  // 없으면(undefined) 보내지 않음 → 서버에서 null
  });
}

// 상품 삭제: 주소에 상품 번호를 붙여 DELETE 요청
export const deleteProduct = async (productId: number) => {
  await api.delete(`/products/${productId}`);
}

// 상품 수정: 주소에 상품 번호, 본문에 바뀐 값을 담아 PUT 요청
export const modifyProduct = async (product: Product) => {
  await api.put(`/products/${product.id}`, {
    pName: product.pName,
    category: product.category,
    price: product.price,
    description: product.description,
    image: product.image,  // 기존 이미지 경로도 함께 보내야 지워지지 않음
  });
}