'use client';

import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { NetworkVisitorsContent } from '@/app/(protected)/network/user-table/visitors/content';

export default function NetworkVisitorsPage() {
  const { settings } = useSettings();

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-base text-secondary-foreground">
                    All Members:
                  </span>
                  <span className="text-base text-mono font-semibold me-2">
                    49,053
                  </span>
                  <span className="text-base text-secondary-foreground">
                    Pro Licenses
                  </span>
                  <span className="text-base text-mono font-semibold">
                    1724
                  </span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline">Import CSV</Button>
              <Button variant="primary">Add Member</Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <NetworkVisitorsContent />
      </Container>
    </Fragment>
  );
}
