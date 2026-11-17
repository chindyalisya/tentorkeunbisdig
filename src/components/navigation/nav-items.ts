export interface NavItem {
  label: string;
  icon: string;
  href: string;
  activeMatch: (pathname: string) => boolean;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Beranda',
    icon: 'home',
    href: '/beranda',
    activeMatch: (p) => p === '/beranda',
  },
  {
    label: 'Cari Tentor',
    icon: 'explore',
    href: '/tentor',
    activeMatch: (p) => p.startsWith('/tentor'),
  },
  {
    label: 'Jadwal',
    icon: 'calendar_today',
    href: '/jadwal',
    activeMatch: (p) => p.startsWith('/jadwal') || p.startsWith('/rapor'),
  },
  {
    label: 'Pesan',
    icon: 'chat_bubble',
    href: '/chat',
    activeMatch: (p) => p.startsWith('/chat'),
    badge: 1,
  },
  {
    label: 'Akun',
    icon: 'person',
    href: '/akun',
    activeMatch: (p) => p.startsWith('/akun'),
  },
];
