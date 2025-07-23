'use client';

import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimelineItem } from './timeline-item';

const ActivitiesInterview = () => {
  return (
    <TimelineItem icon={LogIn} line={true}>
      <div className="flex flex-col">
        <div className="text-sm text-foreground">
          I had the privilege of interviewing an industry expert for an{' '}
          <Button mode="link" asChild>
            <Link href="/public-profile/profiles/blogger">
              upcoming blog post
            </Link>
          </Button>
        </div>
        <span className="text-xs text-secondary-foreground">
          2 days ago, 4:07 PM
        </span>
      </div>
    </TimelineItem>
  );
};

export { ActivitiesInterview };
