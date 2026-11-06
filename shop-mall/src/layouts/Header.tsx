import {Link} from 'react-router-dom'
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Header = () => {
    const {totalQuantity} = useCart();
    const { currentUser, logout } = useUser();

    // 관리자인지 확인 (로그아웃 상태면 currentUser가 null이므로 ?.로 접근)
    const isAdmin = currentUser?.role === 'admin';

    // 상품 등록은 관리자만 : 관리자가 아니면 링크 이동을 막고 안내
    const handleAddClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isAdmin) {
            e.preventDefault();
            alert('상품 등록은 관리자만 가능합니다.');
        }
    };

    return(
        <header className='header'>
            <h1>
                <Link to='/'>SPACE SHOP</Link>
            </h1>
            <nav>
                <Link to='/'>상품 목록</Link>
                <Link to='/product/new' onClick={handleAddClick}>상품 등록</Link>
                <Link to='/cart'>장바구니({totalQuantity})</Link>
                {/* 관리자에게만 관리자 메뉴 표시 */}
                {isAdmin && <Link to='/admin'>관리자</Link>}
                {currentUser ? (
                    <>
                        <span>{currentUser.name}님</span>
                        <button onClick={logout}>로그아웃</button>
                    </>
                ) : (
                    <Link to='/signin'>로그인</Link>
                )}
            </nav>
        </header>
    )
}

export default Header;