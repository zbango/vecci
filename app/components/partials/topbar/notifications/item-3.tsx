'use client';

import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Item3Props {
  userName: string;
  avatar: string;
  badgeColor: 'online' | 'offline' | 'busy' | 'away' | null | undefined;
  description: string;
  link: string;
  day: string;
  date: string;
  info: string;
}

export default function Item3({
  userName,
  avatar,
  badgeColor,
  description,
  link,
  day,
  date,
  info,
}: Item3Props) {
  return (
    <div className="flex grow gap-2.5 px-5">
      <Avatar>
        <AvatarImage src={`/media/avatars/${avatar}`} alt="avatar" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-1.5 -bottom-1.5">
          <AvatarStatus variant={badgeColor} className="size-2.5" />
        </AvatarIndicator>
      </Avatar>

      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium mb-px">
            <Link
              href="#"
              className="hover:text-primary text-mono font-semibold"
            >
              {userName}
            </Link>
            <span className="text-secondary-foreground"> {description} </span>
            <Link href="#" className="hover:text-primary text-primary">
              {link}
            </Link>
            <span className="text-secondary-foreground"> {day}</span>
          </div>
          <span className="flex items-center text-xs font-medium text-muted-foreground">
            {date}
            <span className="rounded-full size-1 bg-mono/30 mx-1.5"></span>
            {info}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button size="sm" variant="outline">
            Decline
          </Button>
          <Button size="sm" variant="mono">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
