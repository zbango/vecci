'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface IDoNotDistrubProps {
  title?: string;
  icon?: ReactNode;
  text?: string;
}

const DoNotDistrub = ({ title, icon, text }: IDoNotDistrubProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Do Not Disturb'}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        <p className="text-sm text-secondary-foreground">
          Activate 'Do Not Disturb' to silence all notifications and focus
          without interruptions during specified hours or tasks.
        </p>
        <div>
          <Button mode="link" underlined="dashed">
            <Link href="#">Learn more</Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="outline">
          <Link href="#" className="flex items-center gap-1.5">
            <div>{icon || <Bell size={16} />}</div>
            {text || 'Pause Notifications'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { DoNotDistrub, type IDoNotDistrubProps };
