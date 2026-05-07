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

  // Group items by category for section-based display
  const itemsByCategory = useMemo(() => {
    const grouped: Record<Category, MenuItemType[]> = {
      APPETIZER: [],
      MAIN_COURSE: [],
      DESSERT: [],
      BEVERAGE: [],
    };

    menuItems.forEach((item) => {
      if (item.category in grouped) {
        grouped[item.category as Category].push(item);
      }
    });

    return grouped;
  }, [menuItems]);

  const getCartCountForItem = (menuItemId: number) => {
    return cartItems
      .filter((cartItem) => cartItem.menuItemId === menuItemId)
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

  // Determine which categories to show based on filter
  const categoriesToDisplay: Category[] = selectedCategory === "ALL"
    ? (["APPETIZER", "MAIN_COURSE", "DESSERT", "BEVERAGE"] as Category[])
    : [selectedCategory as Category];

  const displayCategories = categories.filter(
    (cat) =>
      cat.category !== "ALL" &&
      categoriesToDisplay.includes(cat.category as Category)
  );

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
        
        {/* Scrollable Category Sections */}
        <div className="flex-1 overflow-y-auto pl-10 pr-4">
          <div className="py-8 space-y-8">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                Loading menu...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                No items found in this category.
              </div>
            ) : (
              displayCategories.map((categoryDetail) => {
                const items = itemsByCategory[categoryDetail.category as Category] || [];
                if (items.length === 0) return null;

                return (
                  <div key={categoryDetail.category} className="space-y-4">
                    {/* Category Header */}
                    <div className="flex items-center gap-3">
                      <div className="text-highlight">{categoryDetail.icon}</div>
                      <h2 className="text-2xl font-bold text-dark">
                        {categoryDetail.label}
                      </h2>
                      <div className="flex-1 h-0.5 bg-gray-200/50 ml-4"></div>
                    </div>

                    {/* Horizontal Scroll Section */}
                    <ScrollArea
                      className="w-full"
                      direction="horizontal"
                    >
                      <div className="flex gap-4 pb-4">
                        {items.map((item) => (
                          <div key={item.menuItemId} className="shrink-0">
                            <MenuItem
                              item={item}
                              cartCount={getCartCountForItem(item.menuItemId)}
                              onClick={(clickedItem) => setActiveItem(clickedItem)}
                            />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* --- FOOTER: TOTAL & VIEW CART --- */}
        <div className="flex h-28 w-full shrink-0 items-center justify-end gap-16s border-t-2 border-gray-200/50 pt-6 pr-12 pb-6 pl-10 bg-surface z-10">
          
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
            variant="full-secondary"
            onClick={() => navigate("/orders")}
            className="rounded-tr-4xl rounded-bl-4xl px-6 py-4 shadow-xl"
          >
            ALL ORDERS
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