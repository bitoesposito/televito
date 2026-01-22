import TitleBox from "../utility/TitleBox";
import { useNavigation } from "../../hooks/useNavigation";
import type { NavigationProps } from "../../types/televideo";

function Navigation({ onNavigate }: NavigationProps) {
	const { navigationItems } = useNavigation();

    return (
      <>
        <nav
          className="flex md:hidden w-full p-3 px-4 gap-3 flex-wrap max-w-screen-lg mx-auto bg-black"
        >
          {navigationItems.filter((item) => item.targetPage !== undefined).map((item) => (
            <TitleBox
              key={item.label}
              color={item.color}
              title={item.label}
              centerText={true}
              className={`min-w-[6rem] flex-1 cursor-pointer whitespace-nowrap`}
              onClick={() => onNavigate?.(item.targetPage!)}
            />
          ))}
        </nav>

        <nav
          className="hidden md:flex w-full p-3 px-4 gap-3 flex-wrap max-w-screen-lg mx-auto bg-black"
        >
          {navigationItems.filter((item) => item.targetPage !== undefined).map((item) => (
            <TitleBox
              key={item.label}
              color={item.color}
              title={item.label}
              size="md"
              centerText={true}
              className={`min-w-[6rem] flex-1 cursor-pointer whitespace-nowrap`}
              onClick={() => onNavigate?.(item.targetPage!)}
            />
          ))}
        </nav>
      </>
    );
}

export default Navigation;
