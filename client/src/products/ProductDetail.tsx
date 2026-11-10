import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useProduct } from "../context/ProductContext"
import { useCart } from "../context/CartContext"

const NO_IMAGE = "/images/no-image.png"

const ProductDetail = () => {
  const {id} = useParams<{id: string}>()
  const {products} = useProduct();
  const { addToCart } = useCart(); // 장바구니 추가 함수 가져오기

  // id에 해당하는 상품을 찾음
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <article className="product-detail">
      <Link to='/'>← 상품 목록</Link>
      <img
        className="product-detail_img"
        src={product.image ?? NO_IMAGE}
        alt={product.pName}
      />
      <span className="product-detail_category">{product.category}</span>
      <h2>{product.pName}</h2>
      <p className="product-detail_price">{product.price.toLocaleString()}원</p>
      <p className="product-detail_desc">{product.description}</p>
      <button 
        className="product-detail_cart"
        onClick={() => {
          addToCart(product.id, 1);
          alert(`${product.pName} 상품이 장바구니에 담겼습니다.`);
        }}
      >
        장바구니
      </button>
    </article>
  )
}

export default ProductDetail