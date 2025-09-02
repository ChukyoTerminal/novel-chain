import { Button } from "@/components/ui/button";
import { LuHouse as LuHome, LuPenTool, LuUser } from "react-icons/lu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
      <div className="flex items-center max-w-screen-xl mx-auto">
        {/* ホームボタン（左半分） */}
        <Link href="/" className="flex-1">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="lg"
            className="w-full h-14 flex flex-col items-center justify-center space-y-1 rounded-none"
          >
            <LuHome size={20} />
            <span className="text-xs">ホーム</span>
          </Button>
        </Link>
        
        {/* 執筆ボタン（右半分） */}
        <Link href="/write" className="flex-1">
          <Button
            variant={isActive("/write") ? "default" : "ghost"}
            size="lg"
            className="w-full h-14 flex flex-col items-center justify-center space-y-1 rounded-none"
          >
            <LuPenTool size={20} />
            <span className="text-xs">執筆</span>
          </Button>
        </Link>

        {/* プロフィールボタン（右端） */}
        <div className="absolute right-4">
          <Link href="/profile">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <LuUser size={16} />
              <span className="text-xs">プロフィール</span>
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
