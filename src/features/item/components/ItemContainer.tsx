import { default as BaseModal } from "./modals/BaseModal";
import EditModal from "./modals/EditModal";
import { useState, useMemo } from "react";
import type { MenuItem, CustomizationOption, OrderItem } from "@/types";
import { ItemContext } from "../context/ItemContext";

import { useCartContext } from "@/features/cart/contexts/CartContext"; 

interface ItemContainerProps {
  item: MenuItem;
  initialOrder?: OrderItem; 
  onClose: () => void;
}

const ItemContainer = ({ item, initialOrder, onClose }: ItemContainerProps) => {
  // 2. Grab the addToCart function
  const { addToCart } = useCartContext(); 

  const [quantity, setQuantity] = useState(initialOrder ? initialOrder.quantity : 1);
  const [opts, setOpts] = useState<CustomizationOption[]>(
    initialOrder?.selectedOptions ?? []
  );

  const handleToggleOption = (option: CustomizationOption) => {
    setOpts((prev) => {
      const isCurrentlySelected = prev.some((o) => o.id === option.id);
      if (isCurrentlySelected) {
        return prev.filter((o) => o.id !== option.id);
      } else {
        return [...prev, option];
      }
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

  return (
    <ItemContext.Provider value={contextValue}>
      {initialOrder ? (
        <EditModal onClose={onClose} />
      ) : (
        <BaseModal
          onAction={() => {
            // 3. Actually dispatch the item to the global cart!
            addToCart({
              menuItem: item, // Ensure this matches your MenuItem type ID field
              orderItemId: Date.now(), // Generate a unique ID for the cart row
              quantity: quantity,
              selectedOptions: opts,
              totalPrice: totalPrice,
            } as OrderItem);
            
            onClose(); // Close the modal after adding
          }}
          onClose={onClose}
          actionLabel="Add to Cart"
        />
      )}
    </ItemContext.Provider>
  );
};

export default ItemContainer;