// store.js
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

// ✅ Add these constants to silence non-serializable warnings from redux-persist
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const initialState = { 
  data: [],
};

// ✅ Safe localStorage write
const saveState = (state) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem("reduxState", JSON.stringify(state.data));
  } catch (e) {
    // ignore storage errors (quota, private mode, etc.)
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_DATA": {
      const existingProductIndex = state.data.findIndex(
        (item) =>
          item._id === action.payload._id &&
          item.selectedVariant?.label === action.payload.selectedVariant?.label
      );

      let newState;

      if (existingProductIndex !== -1) {
        const updatedData = [...state.data];
        const oldItem = updatedData[existingProductIndex];

        const newQty = (oldItem.quantity || 0) + (action.payload.quantity || 1);

        updatedData[existingProductIndex] = {
          ...oldItem,
          ...action.payload,
          quantity: newQty,
          totalPrice: (oldItem.unitPrice || action.payload.unitPrice || 0) * newQty,
        };

        newState = { ...state, data: updatedData };
      } else {
        const qty = action.payload.quantity || 1;
        const unitPrice = action.payload.unitPrice || 0;

        newState = {
          ...state,
          data: [
            ...state.data,
            {
              ...action.payload,
              quantity: qty,
              totalPrice: action.payload.totalPrice ?? unitPrice * qty,
            },
          ],
        };
      }

      saveState(newState);
      return newState;
    }

    case "UPDATE_QUANTITY": {
      const { productId, variantLabel, quantity } = action.payload;

      const updatedData = state.data.map((product) => {
        if (
          product._id === productId &&
          product.selectedVariant?.label === variantLabel
        ) {
          return {
            ...product,
            quantity,
            totalPrice: (product.unitPrice || 0) * quantity,
          };
        }
        return product;
      });

      const newState = { ...state, data: updatedData };
      saveState(newState);
      return newState;
    }

    case "DELETE_PRODUCT": {
      const newState = {
        ...state,
        data: state.data.filter((product) => product._id !== action.payload),
      };
      saveState(newState);
      return newState;
    }

    case "CLEAR_PRODUCT": {
      const newState = { ...state, data: action.payload };
      saveState(newState);
      return newState;
    }

    case "CLEAR_ALLPRODUCT": {
      const newState = { ...state, data: [] };
      saveState(newState);
      return newState;
    }

    case "UPDATE_DATA": {
      const updatedData = state.data.map((product) =>
        product._id === action.payload._id ? action.payload : product
      );
      const newState = { ...state, data: updatedData };
      saveState(newState);
      return newState;
    }

    default:
      return state;
  }
};

// Combine reducers
const root = combineReducers({
  app: rootReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, root);

const store = configureStore({
  reducer: persistedReducer,

  // ✅ THIS fixes: "A non-serializable value was detected in an action..."
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
