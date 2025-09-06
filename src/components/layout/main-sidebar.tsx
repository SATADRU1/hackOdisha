
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Pickaxe,
  AreaChart,
  Wallet,
  Gem,
  Settings,
  FolderOpenDot,
  CreditCard,
  Image,
  BarChart3,
  Brain,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/mining', icon: Pickaxe, label: 'Mining' },
  { href: '/portfolio', icon: FolderOpenDot, label: 'Portfolio' },
  { href: '/analytics', icon: AreaChart, label: 'Analytics' },
  { href: '/pricing', icon: Gem, label: 'Pricing' },
];

const verbwireItems = [
  { href: '/verbwire/wallet', icon: Wallet, label: 'Wallet' },
  { href: '/verbwire/nft', icon: Image, label: 'NFTs' },
  { href: '/verbwire/payments', icon: CreditCard, label: 'Payments' },
];

const studioItems = [
  { href: '/studio/charts', icon: BarChart3, label: 'Charts' },
  { href: '/studio/ai', icon: Brain, label: 'AI Insights' },
];

const NavLink = ({
  item,
  isCollapsed,
}: {
  item: (typeof navItems)[0];
  isCollapsed: boolean;
}) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(item.href);

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                size="icon"
                className="h-10 w-10"
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link href={item.href}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className="w-full justify-start text-base"
      >
        <item.icon className="mr-4 h-5 w-5" />
        {item.label}
      </Button>
    </Link>
  );
};

export default function MainSidebar() {
  const isCollapsed = false; // Add state later for collapsibility
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col justify-between border-r bg-card h-screen sticky top-0 p-2 transition-all duration-300',
        isCollapsed ? 'w-16 items-center' : 'w-64'
      )}
    >
      <div>
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-4',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <Pickaxe className="h-8 w-8 text-primary" />
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-primary">MineR</h1>
          )}
        </div>
        <nav className={cn('flex flex-col gap-2', isCollapsed ? 'items-center' : 'px-2')}>
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}
          
          {/* Verbwire Section */}
          {!isCollapsed && (
            <div className="pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Verbwire
              </h3>
            </div>
          )}
          {verbwireItems.map((item) => (
            <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}
          
          {/* Studio Section */}
          {!isCollapsed && (
            <div className="pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Studio
              </h3>
            </div>
          )}
          {studioItems.map((item) => (
            <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>

      <div className={cn('flex flex-col gap-2', isCollapsed ? 'items-center' : 'px-2')}>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link href="/settings">
                <Button variant={pathname.startsWith('/settings') ? 'secondary' : 'ghost'} className={cn("w-full justify-start", isCollapsed && "w-10 h-10 p-0 justify-center")}>
                  <Settings className={cn("h-5 w-5", !isCollapsed && "mr-4")} />
                  {!isCollapsed && "Settings"}
                </Button>
              </Link>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
        
        <div className="border-t -mx-2 my-2"></div>

        <div className={cn("flex items-center gap-3 p-2", isCollapsed && "justify-center")}>
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://picsum.photos/100" alt="User" data-ai-hint="profile avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div>
              <p className="font-semibold">User</p>
              <p className="text-xs text-muted-foreground">user@simu.mine</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
