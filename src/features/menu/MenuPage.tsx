import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar, ScrollArea, DisplayBox, Button } from "../../components";
import { MenuItemCard } from "../../features";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { useMenu } from "./useMenu";
import { categoryItems } from "../../utils";
import { LoaderCircleIcon, XCircleIcon, ShoppingCartIcon, NotebookPenIcon } from "lucide-react";

import backGroundPattern from "../../assets/background-pattern.webp";

import { CustomizationModal } from "../item";
import type { MenuItem } from "../../types/api";

import { useAppSelector } from "../../store/hooks";

const categories = categoryItems.map((cat) => cat.id);

export const MenuPage = () => {
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);

  const itemCount = cartItems.reduce<number>((sum, item) => sum + item.quantity, 0)

  const selectedCategory = useScrollSpy(categories);
  const categoryQueries = useMenu(categories);

  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem | null>(null);

  return (
    <div className="relative">
      <div className="z-10 relative w-full h-full">
        <NavBar selectedId={selectedCategory!} />

        {/* Added overflow-hidden to ensure the background image respects the rounded-l-3xl corners */}
        <div className="relative z-10 ml-24 rounded-l-2xl h-screen w-auto bg-white overflow-hidden">
          {/* Moved background pattern here, with z-0 so it sits behind the ScrollArea */}
          <div
            className="absolute inset-0 h-full w-full z-0 opacity-8 bg-repeat pointer-events-none"
            style={{ backgroundImage: `url(${backGroundPattern})` }}
          />

          <ScrollArea direction="vertical">
            {/* Inner wrapper to push content down and cause vertical overflow */}
            {/* Added relative z-10 to ensure content stays above the background pattern */}
            <div className="relative z-10 flex flex-col gap-8 pt-15 pb-30 pl-16">
              {categoryItems.map((cat, index) => {
                const query = categoryQueries[index];

                return (
                  <section
                    id={cat["id"]}
                    key={`cat-${cat["id"]}`}
                    className="flex flex-col scroll-mt-10"
                  >
                    <div className="flex justify-start pr-30 w-full h-full">
                      <h2 className="flex gap-12 items-center text-7xl text-primary">
                        <div>
                          {`${cat["label"]}`}
                        </div>
                        <div className="scale-250">
                          {cat["icon"]}
                        </div>
                      </h2>
                    </div>

                    <div className="h-125 w-full">
                      {query!.isLoading ? (
                        <div className="flex flex-col justify-center items-center rounded-2xl w-full h-full bg-neutral">
                          <div className="w-fit h-fit">
                            <DisplayBox
                              variant="loading-secondary"
                              icon={<LoaderCircleIcon />}
                              value={`Loading ${cat["label"]}...`}
                            />
                          </div>
                        </div>
                      ) : query!.isError ? (
                        <div className="flex flex-col justify-center items-center rounded-2xl w-full h-full bg-neutral">
                          <div className="w-fit h-fit">
                            <DisplayBox
                              variant="danger"
                              icon={<XCircleIcon />}
                              value={`Failed to load ${cat["label"]}`}
                            />
                          </div>
                        </div>
                      ) : (
                        <ScrollArea direction="horizontal">
                          <div className="flex gap-4 pt-8 px-10">
                            {query!.data?.map((item, index) => (
                              <MenuItemCard
                                key={`dish-${index}`}
                                item={item}
                                onClick={() => setActiveMenuItem(item)}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </ScrollArea>
          
          {/* View Order and View Cart buttons */}
          <div className="absolute flex justify-center items-center gap-8 z-10 bottom-1/20 right-1/20 text-2xl">
            <Button onClick={() => navigate("/cart")}>
              <div className="flex items-center justify-center gap-4">
                <ShoppingCartIcon />
                <p>
                  View Cart
                </p>
                <p className="bg-surface text-primary px-2 rounded-2xl flex justify-center items-center">
                  {itemCount}
                </p>
              </div>
            </Button>

            <Button variant="outline-accent">
              <div className="flex items-center justify-center gap-4">
                <NotebookPenIcon />
                <p>
                  Track Orders
                </p>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {activeMenuItem && (
        <CustomizationModal
          menuItem={activeMenuItem}
          existingItem={null}
          onExit={() => setActiveMenuItem(null)}
        />
      )}
    </div>
  );
};
