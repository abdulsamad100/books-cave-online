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
    const { signin, isLoading } = useContext(AuthContext);  // Destructure isLoading from AuthContext

    const [user, setUser] = useState(null);  // Initialize user as null initially

    // When signin changes, update the user state
    useEffect(() => {
        if (signin.userLoggedIn) {
            setUser(signin.userLoggedIn.uid);  // Set user when logged in
        } else {
            setUser(null);  // Clear user if logged out
        }
    }, [signin]);

    // Fetch and listen for cart updates only if user is available
    useEffect(() => {
        if (!user) return;  // Don't fetch cart if there's no user

        const cartQuery = query(
            collection(db, 'Carts'),
            where('createdFor', '==', user)
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
    }, [user]);  // Dependency on user, to re-fetch cart when user changes

    // If the user is still loading, don't render children
    if (isLoading) {
        return <div>Loading...</div>;
    }

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
