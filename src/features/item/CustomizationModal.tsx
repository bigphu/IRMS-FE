import { useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button, InputBox } from "../../components";
import { MenuItemCard } from "../menu/MenuItemCard";
import { useAppDispatch } from "../../store/hooks";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  type CartItem,
} from "../../store/slices/cartSlice";
import { type MenuItem } from "../../types/api";
import { QuantityInput } from "./QuantityInput";
import {
  HashIcon,
  // NotebookPenIcon,
  AlertTriangleIcon,
  CircleQuestionMark,
  NotebookTextIcon,
  ShoppingCartIcon,
  DoorOpenIcon,
} from "lucide-react";
import { formatCurrency } from "../../utils";

gsap.registerPlugin(useGSAP);

export interface CustomizationModalProps {
  menuItem: MenuItem;
  existingItem: CartItem | null;
  onExit: () => void;
}

export const CustomizationModal = ({
  menuItem,
  existingItem = null,
  onExit,
}: CustomizationModalProps) => {
  const dispatch = useAppDispatch();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const blackOutRef = useRef<HTMLDivElement | null>(null);
  const popUpRef = useRef<HTMLDivElement | null>(null);

  const [quantity, setQuantity] = useState(existingItem?.quantity || 1);
  const [customization, setCustomization] = useState(existingItem?.customization || "");
  const [allergyNotes, setAllergyNotes] = useState(existingItem?.allergyNotes || "");
  const [specialInstructions, setSpecialInstructions] = useState(existingItem?.specialInstructions || "");

  const totalPrice = menuItem.price! * quantity;

  // 1. Grab contextSafe from useGSAP to safely create our exit animation function
  const { contextSafe } = useGSAP(() => {
    // Mount animations
    gsap.from(blackOutRef.current, {
      opacity: 0,
      duration: 0.3,
    });

    gsap.from(popUpRef.current, {
      scale: 0.7,
      opacity: 0,
      y: 30,
      duration: 0.4,
      delay: 0.15,
      ease: "back.out(1.5)"
    });
  }, { scope: containerRef });

  const animateOut = useCallback(() => {
    // Fade out the background
    gsap.to(blackOutRef.current, {
      opacity: 0,
      duration: 0.25, 
    });
    
    // Shrink and fade out the popup, then call onExit when done
    gsap.to(popUpRef.current, {
      scale: 0.7,
      opacity: 0,
      y: 30,
      duration: 0.3,
      ease: "back.in(1.5)",
      onComplete: () => {
        onExit(); 
      }
    });
  }, [onExit]); // Included in dependency array for best practices

  // Helper that invokes the animation safely within GSAP context
  const triggerExit = () => contextSafe(animateOut)();

  const handleSave = () => {
    if (existingItem && quantity === 0) {
      handleRemoveFromCart();
    } else if (existingItem) {
      handleUpdateCartItem();
    } else {
      handleAddToCart();
    }

    animateOut();
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(existingItem!.cartItemId));
  };

  const handleUpdateCartItem = () => {
    dispatch(
      updateCartItem({
        cartItemId: existingItem!.cartItemId,
        update: {
          ...existingItem!,
          quantity,
          specialInstructions,
          allergyNotes,
          customization,
        },
      })
    );
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        menuItem,
        quantity,
        customization,
        allergyNotes,
        specialInstructions,
      })
    );
  };

  return (
    <div
      ref={containerRef} 
      className="fixed inset-0 z-50 flex justify-center items-center h-screen w-screen"
    >
      {/* 4. Update the onClick to use animateOut */}
      <div 
        ref={blackOutRef} 
        className="absolute inset-0 bg-secondary/95"
        onClick={triggerExit} 
      />

      <div 
        ref={popUpRef} 
        className="relative z-10 bg-surface w-[70%] h-fit p-12 rounded-tr-4xl rounded-bl-4xl shadow-2xl"
      >
        <div className="w-full h-full flex flex-col gap-4">
          <h2 className="flex gap-6 items-center text-7xl text-primary">
            {/* <NotebookPenIcon size={64} /> */}
            {existingItem ? "Edit Your Order" : "Customize Your Order"}
          </h2>

          <div className="w-full h-auto flex gap-12">
            <div className="w-fit flex flex-col justify-center">
              <MenuItemCard item={menuItem} forceHover onClick={() => {}} />
            </div>
            
            <div className="flex flex-col gap-1 h-full w-full items-center justify-center">
              <p className="font-mono text-md line-clamp-2 w-full text-center my-2">
                {menuItem.description}
              </p>

              <InputBox
                icon={<AlertTriangleIcon />}
                label="Allergy Notes"
                value={allergyNotes}
                onChange={(e) => setAllergyNotes(e.target.value)}
                variant="danger"
                multiline
                rows={1}
              />
              
              <div className="grid w-full gap-6 grid-cols-2">
                <InputBox
                  icon={<NotebookTextIcon />}
                  label="Special Instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  multiline
                  rows={6}
                />

                <InputBox
                  icon={<CircleQuestionMark />}
                  label="Customizations"
                  value={customization}
                  variant="secondary"
                  onChange={(e) => setCustomization(e.target.value)}
                  multiline
                  rows={6}
                />
              </div>

              <div className="flex w-full gap-6 justify-between items-end mt-4">
                <div className="w-fit shrink-0">
                  <QuantityInput
                    icon={<HashIcon />}
                    label="Quantity"
                    min={0}
                    max={100}
                    value={quantity}
                    onChange={(val) => setQuantity(Number(val))}
                  />
                </div>

                <div className="flex-1 min-w-0 flex justify-end flex-wrap gap-4 text-4xl">
                  <span className="shrink-0 text-secondary">Total:</span>
                  <span className="truncate text-primary">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end w-full pt-6 gap-4 text-xl">
                {/* <Button type="submit" variant="full-primary">
                  {existingItem ? "Update Cart" : "Add to Cart"}
                </Button> */}
                <Button variant="full-primary" onClick={handleSave}>
                  <div className="flex items-center justify-center gap-4">
                    <ShoppingCartIcon />
                    <p>
                      {existingItem ? "Update Cart" : "Add to Cart"}
                    </p>
                  </div>
                </Button>

                <Button variant="outline-danger" onClick={triggerExit}>
                  <div className="flex items-center justify-center gap-4">
                    <DoorOpenIcon />
                    <p>
                      Back
                    </p>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};