'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TimelineItem } from './timeline-item';

interface IBloggingConferenceProps {
  heading?: string;
  datetime?: string;
  image?: ReactNode;
  title?: string;
}

const ActivitiesBloggingConference = ({
  heading,
  datetime,
  image,
  title,
}: IBloggingConferenceProps) => {
  return (
    <TimelineItem icon={Printer} line={true}>
      <div className="flex flex-col pb-2.5">
        <span className="text-sm text-foreground">
          {heading ??
            'Attending the virtual blogging conference was an enriching experience'}
        </span>
        <span className="text-xs text-secondary-foreground">
          {datetime ?? '2 days ago, 4:07 PM'}
        </span>
      </div>
      <Card className="shadow-none">
        <CardContent className="lg:py-4">
          <div className="flex justify-center py-4">{image}</div>
          <div className="flex flex-col gap-1">
            <div className="text-base font-medium text-mono text-center">
              {title ?? 'Blogging Conference'}
            </div>
            <div className="flex items-center justify-center gap-1">
              <Button mode="link" asChild>
                <Link href="/public-profile/profiles/company">
                  Axio new release
                </Link>
              </Button>
              <span className="text-sm text-secondary-foreground me-2">
                email campaign
              </span>
              <Badge size="md" variant="success" appearance="outline">
                Public
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </TimelineItem>
  );
};

export { ActivitiesBloggingConference, type IBloggingConferenceProps };
