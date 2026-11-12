import { Link, useNavigate, useParams } from "react-router-dom"
import { useProduct } from "../context/ProductContext"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"

// 이미지가 없는 상품에 보여 줄 기본 이미지
const NO_IMAGE = "/images/no-image.png";

const ProductDetail = () => {
  const {id} = useParams<{id: string}>();
  const {products, isLoading, removeProduct} = useProduct();
  const {addToCart, removeFromCart} = useCart();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  // 상품 목록을 불러오는 동안에는 로딩 문구 표시
  if(isLoading){
      return <div>불러오는 중...</div>
  }

 
  // 관리자에게만 수정 · 삭제 버튼을 보여 줍니다.
  const isAdmin = currentUser?.role === 'admin';

  // id에 해당하는 상품을 찾음
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  // 상품 삭제 핸들러
  const handleDelete = async () => {
    // 되돌릴 수 없으므로 한 번 더 묻습니다.
    if (!window.confirm(`${product.pName} 상품을 삭제할까요?`)) return;
    try {
      await removeProduct(product.id);
      removeFromCart(product.id);  // 장바구니에 담겨 있던 상품도 뺍니다.
      alert("상품이 삭제되었습니다.");
      navigate('/');
    } catch {
      alert("상품 삭제 중 오류가 발생했습니다.");
    }
  };

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
          // 로그인하지 않은 경우 로그인 페이지로 이동
          if (!currentUser) {
            alert("로그인이 필요합니다.");
            navigate("/signin");
            return;
          }
          addToCart(product.id, 1);
          alert("상품이 장바구니에 담겼습니다.")
        }}
      >
        담기
      </button>
      {/* 관리자 메뉴: 수정 화면으로 이동 · 삭제 */}
      {isAdmin && (
        <div className="product-detail_admin">
          <Link to={`/product/${product.id}/edit`} className="product-detail_edit">수정</Link>
          <button type="button" className="product-detail_delete" onClick={handleDelete}>삭제</button>
        </div>
      )}
    </article>
  )
}

export default ProductDetail