import { useCartContext } from "@/features/cart/contexts/CartContext";
import { useItemContext } from "../../context/ItemContext";
import BaseModal from "./BaseModal"; 

import type { OrderItem } from "@/types";

interface EditModalProps {
  onClose: () => void;
}

const EditModal = ({ onClose }: EditModalProps) => {
  const { addToCart } = useCartContext();
  const { item, orderItemId, quantity, opts, totalPrice } = useItemContext();

  const handleUpdate = () => {
    addToCart({
      menuItem: item, // Ensure this matches your MenuItem type ID field
      orderItemId: orderItemId!, // Use existing ID to replace the correct item in the cart
      quantity: quantity,
      selectedOptions: opts,
      totalPrice: totalPrice,
    } as OrderItem);
    
    onClose();
  };

  return (
    <BaseModal
      actionLabel="Update Cart" 
      onAction={handleUpdate}   
      onClose={onClose}         
    />
  );
};

export default EditModal;