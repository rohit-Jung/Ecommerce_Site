import { CartProductType } from "@/components/Products/ProductDetails";
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
  cartTotalPrice: number;
  cartProducts: CartProductType[] | null;
  paymentIntent: string | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleQtyIncrease: (product: CartProductType) => void;
  handleQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  handleSetPaymentIntent: (value: string | null) => void;
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
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);


  useEffect(() => {
    console.log(localStorage.getItem("CartItems"));
    const cartItems = JSON.parse(localStorage.getItem("CartItems") || "[]");
    const eShopPaymentIntent: any = localStorage.getItem("eshopPaymentIntent");
    const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);

    setCartProducts(cartItems);
    setCartTotalQty(cartItems.length);
    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotalItems = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;
            acc.total += itemTotal;
            acc.qty += item.quantity;

            return acc;
          },
          {
            total: 0,
            qty: 0,
          }
        );
        setCartTotalQty(qty);
        setCartTotalPrice(total);
      }
    };
    getTotalItems();
  }, [cartProducts]);

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

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter(
          (p) => p.id !== product.id
        );
        setCartProducts(filteredProducts);

        toast.success("Product removed");
        localStorage.setItem("CartItems", JSON.stringify(filteredProducts));
      }
    },
    [cartProducts]
  );

  const handleQtyIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCartProducts;
      if (product.quantity === 99) {
        return toast.error("Oops! Maximum reached");
      }

      if (cartProducts) {
        updatedCartProducts = [...cartProducts];

        const existingIndex = cartProducts.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          updatedCartProducts[existingIndex].quantity = ++updatedCartProducts[
            existingIndex
          ].quantity;
        }

        setCartProducts(updatedCartProducts);
        localStorage.setItem("CartItems", JSON.stringify(updatedCartProducts));
      }
    },
    [cartProducts]
  );

  const handleQtyDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCartProducts;
      if (product.quantity === 1) {
        return toast.error("Oops! Minimum reached");
      }

      if (cartProducts) {
        updatedCartProducts = [...cartProducts];

        const existingIndex = cartProducts.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          updatedCartProducts[existingIndex].quantity = --updatedCartProducts[
            existingIndex
          ].quantity;
        }

        setCartProducts(updatedCartProducts);
        localStorage.setItem("CartItems", JSON.stringify(updatedCartProducts));
      }
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    localStorage.removeItem("CartItems");
    toast.success("Cart cleared");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartProducts]);

  const handleSetPaymentIntent = useCallback(
    (value: string | null) => {
      setPaymentIntent(value);
      localStorage.setItem("eshopPaymentIntent", JSON.stringify(value));
    },
    [setPaymentIntent]
  );

  const value = {
    cartTotalQty,
    cartTotalPrice,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleQtyIncrease,
    handleQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent,
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
