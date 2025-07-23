'use client';

import { Button } from '@/components/ui/button';

const MegaMenuFooter = () => {
  return (
    <div className="flex flex-wrap items-center lg:justify-between rounded-xl lg:rounded-t-none bg-accent/50 border border-border lg:border-0 lg:border-t lg:border-t-gray-100 dark:lg:border-t-gray-100 px-4 py-4 lg:px-7.5 lg:py-5 gap-2.5">
      <div className="flex flex-col gap-1.5">
        <div className="text-base font-semibold text-mono leading-none">
          Read to Get Started ?
        </div>
        <div className="text-sm fomt-medium text-secondary-foreground">
          Take your docs to the next level of Metronic
        </div>
      </div>
      <Button variant="mono" asChild>
        <a
          href="https://keenthemes.com/metronic"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read Documentation
        </a>
      </Button>
    </div>
  );
};

export { MegaMenuFooter };
