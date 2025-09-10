/* eslint-disable max-len */
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Logo from './logo';
import { Button } from './ui/button';
import { LuChevronLeft } from 'react-icons/lu';

interface HeaderProperties {
  label: string;
  onBackClick?: () => void;
  showBackButton?: boolean;
  isFixed?: boolean;
  showFunctionButton?: boolean;
  buttonLabel?: string;
  onFunctionButtonClick?: () => void;
}

const handleSignOut = async () => {
  await signOut({ callbackUrl: '/' });
};

export function Header({ label, onBackClick, showBackButton = false, isFixed = false, showFunctionButton = false, buttonLabel, onFunctionButtonClick }: HeaderProperties) {
  const { data: session, status } = useSession();

  const renderAuthButtons = () => {
    if (status === 'loading') {
      return null;
    }

    if (session) {
      return (
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          ログアウト
        </Button>
      );
    }

    return (
      <div className="flex gap-2">
        <Link href="/auth/signin">
          <Button variant="ghost" size="sm">
            サインイン
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button variant="outline" size="sm">
            サインアップ
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <header className={`w-full p-4 border-b mb-4 flex items-center justify-between z-50 ${isFixed ? 'fixed top-0 left-0 right-0 bg-white shadow' : ''}`}>
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
        {label === 'logo' ? (
          <div className='flex justify-center'>
            <Logo height={40} />
          </div>
        ) : (
          <h1 className="text-2xl font-bold">{label}</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showFunctionButton && (
          <Button variant="outline" size="sm" onClick={onFunctionButtonClick}>
            {buttonLabel}
          </Button>
        )}
        {renderAuthButtons()}
      </div>
    </header>
  );
}
