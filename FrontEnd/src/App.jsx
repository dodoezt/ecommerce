import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

const AppWarper = () => {
  const location = useLocation();

  const hideNavbarPath = ['/masuk','/daftar','/lupapassword','/passwordbaru/:id']

  const shouldShowNavbarAndFooter = !hideNavbarPath.includes(location.pathname) && !location.pathname.startsWith('/passwordbaru/');
  return (
    <>
      {shouldShowNavbarAndFooter && <Navbar/>}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="product/:id" element={<ProductView />} />
        <Route path="search/:keyword" element={<ProductSearched />} />
        <Route path="cart" element={<Cart />} />
        <Route path='masuk' element={<Masuk />}/>
        <Route path='daftar' element={<Daftar />}/>
        <Route path='lupapassword' element={<LupaPassword />}/>
        <Route path='passwordbaru/:id' element={<PasswordBaru />}/>
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      {shouldShowNavbarAndFooter && <Footer/>}
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
