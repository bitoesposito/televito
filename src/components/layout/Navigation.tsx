import TitleBox from "../utility/TitleBox";
import { useNavigation } from "../../hooks/useNavigation";

export interface NavigationProps {
  onNavigate: (page: number) => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const { navigationItems } = useNavigation();

  const handleClick = (targetPage: number) => {
    if (onNavigate) {
      onNavigate(targetPage);
    }
  };

  return (
    <nav className="flex w-full p-3 px-4 gap-2 flex-wrap" style={{ backgroundColor: 'var(--black)' }}>
      {navigationItems.filter((item) => item.targetPage !== undefined).map((item) => (
        <TitleBox
          key={item.label}
          color={item.color}
          title={item.label}
          centerText={true}
          className={`cursor-pointer min-w-[6rem] flex-1`}
          onClick={() => handleClick(item.targetPage ?? 100)}
        />
      ))}
    </nav>
  );
}
