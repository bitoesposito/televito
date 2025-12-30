import TitleBox from "../utility/TitleBox";
import { useNavigation } from "../../hooks/useNavigation";
import { forwardRef } from "react";

export interface NavigationProps {
  onNavigate?: (page: number) => void;
}

const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ onNavigate }, ref) => {
    const { navigationItems } = useNavigation();

    return (
      <nav 
        ref={ref}
        className="flex w-full p-3 px-4 gap-3 flex-wrap max-w-screen-lg mx-auto" 
        style={{ backgroundColor: 'var(--black)' }}
      >
        {navigationItems.filter((item) => item.targetPage !== undefined).map((item) => (
          <TitleBox
            key={item.label}
            color={item.color}
            title={item.label}
            centerText={true}
            className={`min-w-[6rem] flex-1 cursor-pointer`}
            onClick={() => onNavigate?.(item.targetPage!)}
          />
        ))}
      </nav>
    );
  }
);

Navigation.displayName = "Navigation";

export default Navigation;
