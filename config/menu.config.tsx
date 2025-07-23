import { Bolt, Home, Settings, UserCircle } from 'lucide-react';
import { type MenuConfig } from './types';

export const MENU_SIDEBAR: MenuConfig = [
  { title: 'Inicio', path: '/', icon: Home },
  {
    title: 'Comunidad',
    icon: UserCircle,
    children: [
      { title: 'Usuarios', path: '/community/users' },
      { title: 'Unidades', path: '/community/units' },
      { title: 'Sedes', path: '/community/headquarters' },
    ],
  },
  {
    title: 'Finanzas',
    icon: Settings,
    children: [
      { title: 'Cuotas', path: '/finance/fees' },
      { title: 'Pagos', path: '/finance/payments' },
      { title: 'Facturación', path: '/finance/billing' },
      { title: 'Presupuesto', path: '/finance/budget' },
    ],
  },
  {
    title: 'Instalaciones',
    icon: Bolt,
    disabled: true,
  },
  {
    title: 'Seguridad',
    icon: Bolt,
    disabled: true,
  },
  {
    title: 'Comunicación',
    icon: Bolt,
    disabled: true,
  },
  {
    title: 'Reportes',
    icon: Bolt,
    disabled: true,
  },
];
