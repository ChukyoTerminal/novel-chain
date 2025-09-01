import { Button } from "./ui/button";
import { LuChevronLeft } from "react-icons/lu";

interface HeaderProps {
  label: string;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export function Header({ label, onBackClick, showBackButton = false }: HeaderProps) {
  return (
    <header className="w-full p-4 border-b mb-4 flex items-center justify-between">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={onBackClick}>
              <LuChevronLeft size={20} />
          </Button>
        )}
        {!showBackButton && (
          <Button variant="ghost" size="sm" style={{ visibility: 'hidden' }}>
              <LuChevronLeft size={20} />
          </Button>
        )}
        <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">{label}</h1>
        </div>
    </header>
  );
}