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
        <footer className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 h-20" style={{
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            <div className="flex items-center justify-center h-full max-w-screen mx-auto">
                {/* 左側: ホームと執筆ボタン */}
                <div className="flex flex-1 pr-4 h-full">
                    {/* ホームボタン*/}
                    <Link href="/" className="flex-1 flex items-center h-full">
                        <Button
                            variant={isActive("/") ? "default" : "ghost"}
                            size="lg"
                            className="w-full h-full flex items-center justify-center space-y-1 rounded-none"
                        >
                            <LuHome size={20} />
                            <span className="text-lg">ホーム</span>
                        </Button>
                    </Link>

                    {/* 縦線区切り */}
                    <div className="w-px h-16 bg-border self-center mx-1"></div>

                    {/* 執筆ボタン*/}
                    <Link href="/write" className="flex-1 flex items-center h-full">
                        <Button
                            variant={isActive("/write") ? "default" : "ghost"}
                            size="lg"
                            className="w-full h-full flex items-center justify-center space-y-1 rounded-none"
                        >
                            <LuPenTool size={20} />
                            <span className="text-lg">執筆</span>
                        </Button>
                    </Link>
                </div>

                {/* 縦線区切り */}
                <div className="w-px h-12 bg-border self-center"></div>

                {/* 右側: プロフィールボタン */}
                <div className="flex items-center justify-center px-4 h-full">
                    <Link href="/profile">
                        <Button
                            variant={isActive("/profile") ? "default" : "outline"}
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
