import type { ReactNode } from "react";

export interface NavItem {
  id: string; 
  label: string;
  icon: ReactNode;
}

export interface NavbarProps {
  items: NavItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const Navbar = ({ items, selectedValue, onValueChange }: NavbarProps) => {
  const categoryStyling: string =
    "flex flex-col border-2 justify-center w-[85%] pt-4 pb-4 h-36 box-border items-center gap-1 text-sm font-medium rounded-l-lg transition-all duration-300 shadow-md";

  const defaultStyling: string = ` ${categoryStyling} bg-primary border-transparent text-light hover:bg-primary/80 hover:w-full hover:shadow-primary/50 cursor-pointer`;

  const selectedStyling: string = ` ${categoryStyling} border-primary border-r-transparent bg-light text-primary w-full shadow-primary/50`;

  return (
    <div className="bg-dark/80 z-10 flex h-screen w-24 fixed left-0 top-0 flex-col items-end justify-center gap-2 overflow-x-clip py-8">
      {items.map((item) => {
        const isSelected = selectedValue === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onValueChange(item.id)}
            className={`${isSelected ? selectedStyling : defaultStyling}`}
          >
            {item.icon}
            <span className="">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Navbar;