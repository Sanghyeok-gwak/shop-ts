import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Header from './layouts/Header';
import UserProvider from './context/UserProvider';
import ProductProvider from './context/ProductProvider';
import CartProvider from './context/CartProvider';
import ProductList from './products/ProductList';
import ProductDetail from './products/ProductDetail';
import AddProduct from './products/AddProduct';
import Cart from './products/Cart';
import SignIn from './users/SignIn';
import SignUp from './users/SignUp';
import AdminPage from './admin/AdminPage';

function App() {

  return (
    // UserProvider를 최상위 컴포넌트로 감싸서 로그인 상태를 전역으로 관리
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <BrowserRouter>
            <Header />
            <main>
              <Routes>
                <Route path='/' element={<ProductList />} />
                <Route path='/product/new' element={<AddProduct />} />
                <Route path='/product/:id' element={<ProductDetail />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/signin' element={<SignIn />} />
                <Route path='/signup' element={<SignUp />} />
                {/* 관리자 페이지 */}
                <Route path='/admin' element={<AdminPage />} />
              </Routes>
            </main>
          </BrowserRouter>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  )
}

export default App;