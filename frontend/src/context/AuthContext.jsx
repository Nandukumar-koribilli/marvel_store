import { createContext, useContext, useReducer, useEffect } from 'react';
import { getUserProfile } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  cart: [],
  wishlist: [],
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        cart: [],
        wishlist: [],
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        cart: action.payload.cart || [],
        wishlist: action.payload.wishlist || [],
        isAuthenticated: true,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'UPDATE_CART':
      return {
        ...state,
        cart: action.payload,
      };
    case 'UPDATE_WISHLIST':
      return {
        ...state,
        wishlist: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await getUserProfile();
          dispatch({ type: 'SET_USER', payload: data });
        } catch (error) {
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadUser();
  }, []);

  const login = (userData) => {
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateCart = (cart) => {
    dispatch({ type: 'UPDATE_CART', payload: cart });
  };

  const updateWishlist = (wishlist) => {
    dispatch({ type: 'UPDATE_WISHLIST', payload: wishlist });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateCart,
        updateWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
