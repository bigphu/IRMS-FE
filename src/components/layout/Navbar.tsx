import { categoryItems as navItems } from "../../utils";
import { PowerCircleIcon } from "lucide-react";

import { useLogout } from "../../features";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { clearCart } from "../../store/slices/cartSlice";

export interface NavbarProps {
  selectedId: string;
}

export const NavBar = ({ selectedId, ...props }: NavbarProps) => {
  const dispatch = useAppDispatch();
  const { mutateAsync: logoutMutation, isPending } = useLogout();

  const handleLogout = async () => {
    if (isPending) {
      return;
    }

    try {
      await logoutMutation();

      dispatch(clearCart());
      localStorage.removeItem("irms_cart");
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const categoryStyling: string =
    "border-2 w-[90%] z-20 font-bold relative pt-4 pb-4 pl-2 pr-2 h-32 box-border items-center text-sm font-mono rounded-l-lg transition-all duration-300 shadow-md";

  const defaultStyling: string = `${categoryStyling} bg-primary border-transparent text-on-primary hover:bg-primary/80 hover:w-full hover:shadow-primary/50 cursor-pointer`;

  const selectedStyling: string = `${categoryStyling} border-primary border-r-transparent bg-neutral text-primary w-full shadow-primary/50`;

  const logOutStyling: string = `${categoryStyling} bg-danger border-transparent text-on-primary hover:bg-danger/80 hover:w-full hover:shadow-danger/50 cursor-pointer`;

  return (
    <>
      {/* Sits behind the menu, wide enough (w-36) to cover the gap left by the rounded corners */}
      <div className="bg-secondary fixed left-0 top-0 h-full w-36 z-0" />

      {/* The Navbar. Boosted to z-30 to stay above everything */}
      <nav className="z-30 flex no-scrollbar h-full w-24 fixed left-0 top-0 flex-col items-end justify-center gap-3 overflow-y-auto py-8">
        {navItems.map((item) => {
          const isSelected = selectedId == item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`${isSelected ? selectedStyling : defaultStyling}`}
              {...props}
            >
              <div className="h-full w-full z-20 relative flex flex-col gap-2 justify-center items-center">
                {item.icon}
                <span className="text-center leading-tight">{item.label}</span>
              </div>
            </a>
          );
        })}

        <a
          key="log-out"
          className={`${logOutStyling}`}
          onClick={() => handleLogout()}
          {...props}
        >
          <div className="h-full w-full z-20 relative flex flex-col gap-2 justify-center items-center">
            <PowerCircleIcon />
            <span className="text-center leading-tight">
              {isPending ? "Logging out..." : "Log out"}
            </span>
          </div>
        </a>

        {/* Original secondary background for the navbar itself (now restricted to w-full so it doesn't peek out) */}
        <div className="bg-secondary z-10 h-full w-full absolute inset-0" />
      </nav>
    </>
  );
};
