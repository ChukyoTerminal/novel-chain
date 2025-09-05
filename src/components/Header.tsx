/* eslint-disable max-len */
import { Button } from './ui/button';
import { LuChevronLeft } from 'react-icons/lu';

interface HeaderProperties {
  label: string;
  onBackClick?: () => void;
  showBackButton?: boolean;
  isFixed?: boolean;
}

export function Header({ label, onBackClick, showBackButton = false, isFixed = false }: HeaderProperties) {
  return (
    <header className={`w-full p-4 border-b mb-4 flex items-center justify-between ${isFixed ? 'fixed top-0 left-0 right-0 bg-white shadow' : ''}`}>
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