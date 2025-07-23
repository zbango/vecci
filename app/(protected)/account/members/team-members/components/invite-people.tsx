'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const InvitePeople = () => {
  const [emailInput, setEmailInput] = useState('jason@studio.io');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite People</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-32">Email</Label>
          <Input
            type="text"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </div>
        <div className="flex items-baseline flex-wrap gap-2.5">
          <Label className="flex w-full max-w-32">Role</Label>
          <div className="flex flex-col items-start grow gap-5">
            <Select defaultValue="1">
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Member</SelectItem>
                <SelectItem value="2">Editor</SelectItem>
                <SelectItem value="3">Designer</SelectItem>
                <SelectItem value="4">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <SquarePlus size={12} />
              Add more
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button>
          <Link href="#">Invite People</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { InvitePeople };
