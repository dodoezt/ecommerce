import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartData = async () => {
    const response = await axios.get('http://localhost:3001/cart');
    setCartItems(response.data);
  };

  const addToCart = async (item) => {
    await axios.post('http://localhost:3001/cart', item);
    fetchCartData();
  };

  return (
    <CartContext.Provider value={{ cartItems, fetchCartData, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
