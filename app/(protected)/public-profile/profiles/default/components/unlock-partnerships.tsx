'use client';

import Link from 'next/link';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const UnlockPartnerships = () => {
  return (
    <Card>
      <CardContent className="px-10 py-7.5 lg:pe-12.5">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-mono">
              Unlock Creative <br />
              Partnerships on Our Blog
            </h2>
            <p className="text-sm text-secondary-foreground leading-5.5">
              Explore exciting collaboration opportunities with our blog. We're
              open to partnerships, guest posts, and more. Join us to share your
              insights and grow your audience.
            </p>
          </div>
          <img
            src={toAbsoluteUrl('/media/illustrations/1.svg')}
            className="dark:hidden max-h-[160px]"
            alt="image"
          />
          <img
            src={toAbsoluteUrl('/media/illustrations/1-dark.svg')}
            className="light:hidden max-h-[160px]"
            alt="image"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button mode="link" underlined="dashed" asChild>
          <Link href="/network/get-started">Get Started</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { UnlockPartnerships };
