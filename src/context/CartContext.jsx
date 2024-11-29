import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../JS Files/Firebase';
import { AuthContext } from './AuthContext';

// Create Cart Context
const CartContext = createContext();

// CartProvider Component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartItemCount, setCartItemCount] = useState(0);
    const { signin } = useContext(AuthContext);
    const [user, setUser] = useState(signin.userLoggedIn.uid);

    // Fetch and listen for cart updates
    useEffect(() => {
        const cartQuery = query(
            collection(db, 'Carts'),
            where('createdFor', '==', signin.userLoggedIn.uid)
        );

        const unsubscribe = onSnapshot(cartQuery, (querySnapshot) => {
            let items = [];
            let totalItemsCount = 0;

            querySnapshot.forEach((doc) => {
                const cartData = doc.data();
                items = [...items, ...(cartData.items || [])];
                totalItemsCount += cartData.items?.length || 0;
            });

            setCartItems(items);
            setCartItemCount(totalItemsCount);
        });

        return () => unsubscribe();
    }, [user]);

    // useEffect(() => {
    //     console.log('Cart Items Updated:', cartItems);
    //     console.log('Cart Item Count Updated:', cartItemCount);
    // }, [cartItems, cartItemCount]);

    return (
        <CartContext.Provider value={{ cartItems, cartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};

export default CartContext;
