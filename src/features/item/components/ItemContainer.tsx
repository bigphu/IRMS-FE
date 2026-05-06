// src/features/item/components/ItemContainer.tsx
import { default as BaseModal } from "./modals/BaseModal";
import { useState, useMemo } from "react";
import type { MenuItem, CustomizationOption, OrderItem } from "@/types";
import { ItemContext } from "../context/ItemContext";
import { useCartContext } from "@/contexts/CartContext"; 

interface ItemContainerProps {
  item: MenuItem;
  initialOrder?: OrderItem; 
  onClose: () => void;
}

const ItemContainer = ({ item, initialOrder, onClose }: ItemContainerProps) => {
  const { addToCart } = useCartContext(); 

  const [quantity, setQuantity] = useState(initialOrder ? initialOrder.quantity : 1);
  
  // Hydrate options based on IDs
  const [opts, setOpts] = useState<CustomizationOption[]>(
    initialOrder && item.customizationOptions
      ? item.customizationOptions.filter(o => initialOrder.selectedOptionIds?.includes(o.id))
      : []
  );

  const handleToggleOption = (option: CustomizationOption) => {
    setOpts((prev) => {
      const isCurrentlySelected = prev.some((o) => o.id === option.id);
      return isCurrentlySelected 
        ? prev.filter((o) => o.id !== option.id) 
        : [...prev, option];
    });
  };

  const totalPrice = useMemo(() => {
    const basePrice = item.price;
    const optionsPrice = opts.reduce((sum, o) => sum + o.price, 0);
    return (basePrice + optionsPrice) * quantity;
  }, [item.price, opts, quantity]);

  const contextValue = {
    item, 
    quantity, 
    orderItemId: initialOrder?.orderItemId,
    setQuantity, 
    opts, 
    handleToggleOption, 
    totalPrice
  };

  // Centralized save handler for both ADD and EDIT
  const handleSave = () => {
    addToCart({
      // Keep the existing ID if editing, otherwise generate a new one
      orderItemId: initialOrder?.orderItemId || Date.now(), 
      menuItemId: item.menuItemId,
      quantity: quantity,
      selectedOptionIds: opts.map(o => o.id),
      totalPrice: totalPrice,
    } as OrderItem);
    
    onClose(); 
  };

  return (
    <ItemContext.Provider value={contextValue}>
      <BaseModal
        onAction={handleSave}
        onClose={onClose}
        actionLabel={initialOrder ? "Save Changes" : "Add to Cart"}
      />
    </ItemContext.Provider>
  );
};

export default ItemContainer;