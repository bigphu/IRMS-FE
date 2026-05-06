// src/features/menu/MenuPage.tsx
import { useState, useMemo } from "react";
import type { Category, MenuItem as MenuItemType } from "@/types";

// Components
import Navbar from "@/components/layout/Navbar";
import type { NavItem } from "@/components/layout/Navbar";
import { ScrollArea, Button } from "@/components";
import { useAuth } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "@/features/menu/components/MenuItem";
import { default as ItemContainer } from "@/features/item/components/ItemContainer";
import { CartModal } from "@/features/cart/components/CardModal";

// Context & Data
import { useCartContext } from "@/contexts/CartContext";
import { useMenuContext } from "@/contexts/MenuContext";
import { formatCurrency } from "@/utils/formatters";

const MenuPage = () => {
  // --- STATE ---
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">("ALL");
  const [activeItem, setActiveItem] = useState<MenuItemType | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false); 

  // --- GLOBAL CONTEXT ---
  const { items: cartItems, totalItems, totalPrice } = useCartContext();

  const { menuItems, categories, isLoading } = useMenuContext();

  // --- DERIVED DATA ---
  const filteredItems = useMemo(() => {
    return menuItems.filter(
      (item) =>
        selectedCategory === "ALL" || item.category === selectedCategory,
    );
  }, [menuItems, selectedCategory]);

  const getCartCountForItem = (menuItemId: number) => {
    return cartItems
      .filter((cartItem) => cartItem.menuItemId === menuItemId) // Flattened check
      .reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  };

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  // Map application categories to the generic NavItem format
  const menuNavItems: NavItem[] = categories.map((cat) => ({
    id: cat.category,
    label: cat.label,
    icon: cat.icon,
  }));

  return (
    <div className="bg-surface flex h-screen w-screen overflow-hidden">
      
      {/* --- 1. SIDEBAR NAVBAR --- */}
      <Navbar
        items={menuNavItems}
        selectedValue={selectedCategory}
        onValueChange={(val) => setSelectedCategory(val as Category | "ALL")} 
      />

      {/* --- 2. MAIN CONTENT AREA --- */}
      <div className="flex flex-col flex-1 h-full ml-24 relative bg-surface">
        
        {/* Scrollable Item List */}
        <div className="flex-1 overflow-hidden pl-10">
          <ScrollArea
            className="h-full w-[90%] overflow-x-visible"
            direction="horizontal"
          >
            <div className="flex h-full items-center gap-4 py-10 pl-4">
              {filteredItems.map((item) => (
                <div key={item.menuItemId} className="shrink-0">
                  <MenuItem
                    item={item}
                    cartCount={getCartCountForItem(item.menuItemId)}
                    onClick={(clickedItem) => setActiveItem(clickedItem)}
                  />
                </div>
              ))}

              {isLoading ? (
              <div className="w-full text-center text-xl font-bold text-gray-400">
                Loading menu...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="w-full text-center text-xl font-bold text-gray-400">
                No items found in this category.
              </div>
            ) : null}
            </div>
          </ScrollArea>
        </div>

        {/* --- FOOTER: TOTAL & VIEW CART --- */}
        <div className="flex h-28 w-full shrink-0 items-center justify-end gap-24 border-t-2 border-gray-200/50 pt-6 pr-12 pb-6 pl-10 mt-auto bg-surface z-10">
          
          <div className="flex items-end gap-2">
            <span className="text-dark text-xl font-black tracking-wider">
              TOTAL:
            </span>
            <span className="text-highlight text-4xl font-black">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          <Button
            variant="full-primary"
            onClick={() => setIsCartOpen(true)} 
            className="flex items-center gap-6 rounded-tr-4xl rounded-bl-4xl px-6 py-4 shadow-xl"
          >
            <span className="text-xl font-black tracking-wider">VIEW CART</span>
            <div className="bg-surface text-primary border-primary rounded-full border-2 px-4 py-1 text-lg font-bold">
              {totalItems}
            </div>
          </Button>
          <Button
            variant="outline-danger"
            onClick={handleLogout}
            className="rounded-tr-4xl rounded-bl-4xl px-6 py-4"
          >
            LOG OUT
          </Button>
        </div>
      </div>

      {/* --- 3. OVERLAYS & MODALS --- */}
      {activeItem && (
        <ItemContainer 
          item={activeItem} 
          onClose={() => setActiveItem(null)} 
        />
      )}

      {isCartOpen && (
        <CartModal onClose={() => setIsCartOpen(false)} />
      )}
      
    </div>
  );
};

export default MenuPage;