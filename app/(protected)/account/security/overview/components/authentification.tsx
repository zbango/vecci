'use client';

import Link from 'next/link';
import { SquarePen } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const Authentification = () => {
  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto pb-3 p-0">
        <Table className="align-middle text-sm text-muted-foreground">
          <TableBody>
            <TableRow>
              <TableCell className="text-secondary-foreground font-normal">
                Password
              </TableCell>
              <TableCell className="text-secondary-foreground font-normal">
                Password last changed 2 months ago
              </TableCell>
              <TableCell className="text-end">
                <Button variant="ghost" mode="icon">
                  <SquarePen size={16} className="text-blue-500" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-secondary-foreground font-normal">
                2FA
              </TableCell>
              <TableCell className="text-secondary-foreground font-normal">
                To be set
              </TableCell>
              <TableCell className="text-end">
                <Button mode="link" underlined="dashed" asChild>
                  <Link href="#">Setup</Link>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sign-in with</TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Link
                    href="#"
                    className="flex items-center justify-center size-8 bg-background rounded-full border border-input"
                  >
                    <img
                      src={toAbsoluteUrl('/media/brand-logos/google.svg')}
                      className="size-4"
                      alt="image"
                    />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center size-8 bg-background rounded-full border border-input"
                  >
                    <img
                      src={toAbsoluteUrl('/media/brand-logos/facebook.svg')}
                      className="size-4"
                      alt="image"
                    />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center size-8 bg-background rounded-full border border-input"
                  >
                    <img
                      src={toAbsoluteUrl('/media/brand-logos/apple-black.svg')}
                      className="dark:hidden size-4"
                      alt="image"
                    />
                    <img
                      src={toAbsoluteUrl('/media/brand-logos/apple-white.svg')}
                      className="light:hidden size-4"
                      alt="image"
                    />
                  </Link>
                </div>
              </TableCell>
              <TableCell className="text-end">
                <Button variant="ghost" mode="icon">
                  <SquarePen size={16} className="text-blue-500" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { Authentification };
