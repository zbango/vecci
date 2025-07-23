'use client';

import Link from 'next/link';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';

const GettingStarted = () => {
  return (
    <Card>
      <CardContent className="lg:py-9">
        <div className="flex justify-center pb-5">
          <img
            src={toAbsoluteUrl('/media/illustrations/11.svg')}
            className="dark:hidden max-h-[170px]"
            alt="image"
          />
          <img
            src={toAbsoluteUrl('/media/illustrations/11-dark.svg')}
            className="light:hidden max-h-[170px]"
            alt="image"
          />
        </div>
        <div className="text-lg font-medium text-mono text-center">
          Upload Item to Get Started
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="text-sm text-secondary-foreground">
            Begin by crafting your inaugural list in minutes.
          </span>
          <Link
            href="/account/billing/plans"
            className="text-sm font-medium link"
          >
            Get Started!
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export { GettingStarted };
