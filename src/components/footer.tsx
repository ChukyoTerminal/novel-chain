/* eslint-disable max-len */
import { Button } from '@/components/ui/button';
import { LuHouse as LuHome, LuPenTool, LuUser } from 'react-icons/lu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <footer className='fixed bottom-0 left-0 right-0 bg-background border-t z-50 h-20' style={{
      boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <div className='flex items-center justify-center h-full max-w-screen mx-auto'>
        <div className='flex flex-1 pr-4 h-full'>
          <Link href='/' className='flex-1 flex items-center h-full'>
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size='lg'
              className='w-full h-full flex items-center justify-center space-y-1 rounded-none'
            >
              <LuHome size={20} />
              <span className='text-lg'>ホーム</span>
            </Button>
          </Link>

          <div className='w-px h-16 bg-border self-center mx-1'></div>

          <Link href="/write" className='flex-1 flex items-center h-full'>
            <Button
              variant={isActive('/write') ? 'default' : 'ghost'}
              size='lg'
              className='w-full h-full flex items-center justify-center space-y-1 rounded-none'
            >
              <LuPenTool size={20} />
              <span className='text-lg'>執筆</span>
            </Button>
          </Link>
        </div>

        <div className='w-px h-12 bg-border self-center'></div>

        <div className='flex items-center justify-center px-4 h-full'>
          <Link href='/profile'>
            <Button
              variant={isActive('/profile') ? 'default' : 'ghost'}
              size='lg'
              className='flex items-center justify-center px-3 py-2 h-full rounded-none relative'
            >
              <div className='relative'>
                <div className='w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center'>
                  <LuUser size={48} />
                </div>
                <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-background border border-border rounded px-2 py-1'>
                  <span className='text-xs whitespace-nowrap'>ユーザー名</span>
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
