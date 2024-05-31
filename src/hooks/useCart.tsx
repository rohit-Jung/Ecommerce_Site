import { CartProductType } from "@/app/Components/Products/ProductDetails";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";

type CartContextType = {
  cartTotalQty: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
};

interface Props {
  [propName: string]: any;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("CartItems") || "[]");
    setCartProducts(cartItems);
    setCartTotalQty(cartItems.length);
  }, []);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let newCartProducts;
      if (prev === null) {
        newCartProducts = [product];
      } else {
        newCartProducts = [...prev, product];
      }

      toast.success("Product added to cart");
      localStorage.setItem("CartItems", JSON.stringify(newCartProducts));
      return newCartProducts;
    });
  }, []);

  const value = {
    cartTotalQty,
    cartProducts,
    handleAddProductToCart,
  };

  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("Use cart must be used within cart context provider");
  }

  return context;
};
