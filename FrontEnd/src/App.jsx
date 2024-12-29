import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useRef } from 'react';
import Navbar from "./components/shop/Navbar.jsx";
import MainPage from "./components/shop/MainPage.jsx";
import ProductView from './components/shop/ProductView.jsx';
import ProductSearched from './components/shop/ProductSearched.jsx';
import Cart from './components/shop/Cart.jsx';
import Masuk from './components/shop/Masuk.jsx';
import Daftar from './components/shop/Daftar.jsx';
import LupaPassword from './components/shop/LupaPassword.jsx';
import PasswordBaru from './components/shop/PasswordBaru.jsx';
import Footer from './components/shop/Footer.jsx';
import Checkout from './components/shop/Checkout.jsx';
import Sidebar from './components/shop/Sidebar.jsx';
import Alert from './components/shop/Alert.jsx';

const AppWarper = () => {
  const fileRef = useRef(null);
  const alertRef = useRef(null);
  const trendingProductRef = useRef(null);
  const allProductRef = useRef(null);
  const location = useLocation();

  const handleAlert = () => {
    const alertContainer = alertRef.current;
    
    alertContainer.style.display = 'flex';
    setTimeout(() => {
      alertContainer.classList.remove('-translate-y-full')
    }, 100)
    setTimeout(() => {
      alertContainer.classList.add('-translate-y-full');
      setTimeout(() => {
        alertContainer.style.display = 'none'
      }, 300)
    }, 4000)
  }

  const hideNavbarPath = ['/masuk','/daftar','/lupapassword']
  const hideFooterPath = ['/cart', '/checkout'];

  const shouldShowNavbar = !hideNavbarPath.includes(location.pathname) && !location.pathname.startsWith('/passwordbaru/');
  const shouldShowFooter = !hideFooterPath.includes(location.pathname) && !location.pathname.startsWith('/product');

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {shouldShowNavbar && <Sidebar fileRef={fileRef} trendingProductRef={trendingProductRef} allProductRef={allProductRef}/>}
      <Alert alertRef={alertRef} />
      <Routes>
        <Route path="/" element={<MainPage trendingProductRef={trendingProductRef} allProductRef={allProductRef}/>} />
        <Route path="product/:id" element={<ProductView handleAlert={handleAlert}/>} />
        <Route path="search/:keyword" element={<ProductSearched />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path='masuk' element={<Masuk />}/>
        <Route path='daftar' element={<Daftar />}/>
        <Route path='lupapassword' element={<LupaPassword />}/>
        <Route path='passwordbaru/:id' element={<PasswordBaru />}/>
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      {shouldShowFooter && <Footer fileRef={fileRef}/>}
    </>
  )
}

const App = () => {
  return (
    <Router>
      <AppWarper />
    </Router>
  );
};

export default App;
