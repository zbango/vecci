'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const DisableDefaultBrand = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center flex-wrap lg:flex-nowrap gap-1.5">
          <CardTitle>Disable default Branding</CardTitle>
          <Badge size="sm" variant="primary" appearance="outline">
            Pro
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm text-secondary-foreground">
            Remove any ktstudio.io branding and media. I.e. powered by
            ktstudio.io
          </p>
          <div>
            <Button mode="link" underlined="dashed">
              <Link href="#">View Plans</Link>
            </Button>
          </div>
        </div>
        <Switch size="sm" disabled />
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="outline" disabled>
          Update
        </Button>
      </CardFooter>
    </Card>
  );
};

export { DisableDefaultBrand };
