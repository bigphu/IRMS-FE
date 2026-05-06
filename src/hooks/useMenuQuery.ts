import { useContext } from "react";
import { MenuContext } from "@/contexts/MenuContext";

export const useMenuQuery = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenuQuery must be used within a MenuProvider");
  return context;
};
