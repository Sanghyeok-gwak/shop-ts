import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { useCart } from "../context/CartContext";

// ProductCard 컴포넌트 타입 정의
interface ProductCard{
  product: Product;
}

// 이미지가 없는 상품에 보여 줄 기본 이미지
const NO_IMAGE = "/images/no-image.png";

const ProductCard = ({product}: ProductCard) => {
  const { addToCart } = useCart(); // 장바구니 추가 함수 가져오기

  return(
    <div className="product-card">
      {/* 이미지를 누르면 상세 페이지로 이동
          ?? - null 병합 연산자로, 왼쪽 값이 null이나 undefined일 때만
          오른쪽 값 반환
      */}
      <Link to={`/product/${product.id}`}>
        <img
          className="product-card_img"
          src={product.image ?? NO_IMAGE}
          alt={product.pName}
        />
      </Link>
      <span>{product.category}</span>
      <h3><Link to={`/product/${product.id}`}>{product.pName}</Link></h3>
      <p>{product.price.toLocaleString()}원</p>
      <button 
        onClick={() => {
          addToCart(product.id, 1);
          alert(`${product.pName} 상품이 장바구니에 담겼습니다.`);
        }}
      >
        담기
      </button>
    </div>
  )
}

export default ProductCard;