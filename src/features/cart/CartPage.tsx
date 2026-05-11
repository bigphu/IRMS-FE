import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItemCard } from "./CartItemCard";
import { CustomizationModal } from "../item";

import { formatCurrency } from "../../utils";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { removeFromCart, clearCart, type CartItem } from "../../store/slices/cartSlice";
import { useCart } from "./useCart";
import { type CreateOrderPayload, type CreateOrderItemPayload } from "../../types/api";

import {
  ShoppingCartIcon,
  DoorOpenIcon,
  BadgeDollarSignIcon,
  CheckCircle,
  XCircleIcon,
  Loader2Icon,
  HashIcon
} from "lucide-react";

import { ScrollArea, Button, DisplayBox, InputBox } from "../../components";

export const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.cart.items);
  const totalPrice = items.reduce<number>((sum, item) => sum + item.quantity * item.menuItem.price!, 0);

  const [activeCartItem, setActiveCartItem] = useState<CartItem | null>(null);
  // Changed to string | number to handle backspacing/empty inputs gracefully
  const [tableId, setTableId] = useState<number | "">(""); 
  const [errorMessage, setErrorMessage] = useState("");

  const { mutateAsync: orderMutation, isSuccess, isPending, isError } = useCart();

  const handleCheckout = async () => {
    // 1. Add basic validation
    if (tableId === "" || tableId <= 0) {
      setErrorMessage("Please enter a valid Table Number.");
      return;
    }

    try {
      setErrorMessage(""); // Clear previous errors

      const orderItems: CreateOrderItemPayload[] = items.map((item) => ({
        menuItemId: item.menuItem.id!,
        quantity: item.quantity,
        allergyNotes: item.allergyNotes,
        specialInstructions: item.specialInstructions,
        customization: item.customization,
      }));
      
      const order: CreateOrderPayload = {
        tableId: Number(tableId),
        items: orderItems
      };

      await orderMutation(order);
      dispatch(clearCart());

    } catch (error) {
      console.error("Checkout failed: ", error);
      setErrorMessage("Failed to Checkout! Please try again.");
    }
  };

  // 2. Extracted the complex rendering logic into a clean helper function
  const renderStatusBox = (variant: string, icon: React.ReactNode, value: string) => (
    <div className="flex flex-col justify-center items-center rounded-2xl w-full flex-1 h-full bg-neutral">
      <div className="w-fit h-fit">
        <DisplayBox variant={variant} icon={icon} value={value} />
      </div>
    </div>
  );

  const renderContent = () => {
    if (isSuccess) return renderStatusBox("primary", <CheckCircle />, "Order completed!");
    if (isPending) return renderStatusBox("loading-secondary", <Loader2Icon />, "Submitting your order!");
    if (isError || errorMessage) return renderStatusBox("danger", <XCircleIcon />, errorMessage || "An error occurred!");
    if (items.length === 0) return renderStatusBox("secondary", <ShoppingCartIcon />, "Your cart is empty!");

    // 3. Removed the wrapper <div> so GSAP can properly animate the gaps!
    return items.map((item) => (
      <CartItemCard
        key={item.cartItemId}
        cartItem={item}
        onEdit={() => setActiveCartItem(item)}
        onDelete={() => dispatch(removeFromCart(item.cartItemId))}
      />
    ));
  };

  return (
    <div className="flex flex-col h-screen w-screen px-15 py-10 gap-4">
      <div className="flex justify-between pr-13 w-full">
        <h2 className="flex gap-6 items-center text-7xl text-primary">
          <ShoppingCartIcon size={64} />
          Manage Your Cart
        </h2>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea direction="vertical" className="h-full">
          <div className="flex flex-col gap-4 px-6 py-6 flex-1">
            {/* 4. The main render block is now super clean */}
            {renderContent()}
          </div>
        </ScrollArea>
      </div>

      <div className="flex shrink-0 items-end justify-end pr-13 gap-8 text-2xl">
        <div className="text-xl w-fit">
          <InputBox
            label="Table"
            icon={<HashIcon />}
            value={tableId}
            onChange={(e) => setTableId(e.target.value ? parseInt(e.target.value) : "")}
          />
        </div>

        <div className="flex-1 min-w-0 flex justify-end flex-wrap gap-4 text-4xl">
          <span className="shrink-0 text-secondary">Total:</span>
          <span className="truncate text-primary">
            {formatCurrency(totalPrice)}
          </span>
        </div>

        <Button variant="full-accent" onClick={handleCheckout} disabled={isPending || items.length === 0}>
          <div className="flex items-center justify-center gap-4">
            <BadgeDollarSignIcon />
            <p>Checkout</p>
          </div>
        </Button>

        <Button variant="outline-danger" onClick={() => navigate("/")} disabled={isPending}>
          <div className="flex items-center justify-center gap-4">
            <DoorOpenIcon />
            <p>Back</p>
          </div>
        </Button>
      </div>

      {activeCartItem && (
        <CustomizationModal
          menuItem={activeCartItem.menuItem}
          existingItem={activeCartItem}
          onExit={() => setActiveCartItem(null)}
        />
      )}
    </div>
  );
};