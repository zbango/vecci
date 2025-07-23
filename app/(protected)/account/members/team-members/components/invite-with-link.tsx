'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const InviteWithLink = () => {
  const [linkInput, setLinkInput] = useState(
    'https://www.ktstudio.com/RSVP?c=12345XYZt',
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite with Link</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-32">Link</Label>
          <div className="flex flex-col items-start grow gap-5">
            <InputWrapper>
              <Input
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
              />
              <Button variant="dim" mode="icon" className="-me-2">
                <Copy size={16} />
              </Button>
            </InputWrapper>
            <Button variant="outline">
              <RefreshCw size={12} />
              Reset Link
            </Button>
          </div>
        </div>
        <p className="text-foreground text-sm">
          Click below to RSVP for our exclusive event. Limited spaces available,
          so don't miss out. Reserve your spot now with this special invitation
          link!
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button>
          <Link href="#">Invite People</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { InviteWithLink };
