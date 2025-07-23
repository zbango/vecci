'use client';

import { ClassicLayout } from './layouts/classic';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <ClassicLayout>{children}</ClassicLayout>;
}
