import Link from 'next/link';
import { Settings } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface IIntegrationsItem {
  logo: string;
  title: string;
  email: string;
  description: string;
  checkbox: boolean;
}
type IIntegrationsItems = Array<IIntegrationsItem>;

const Integrations = () => {
  const items: IIntegrationsItems = [
    {
      logo: 'google-webdev.svg',
      title: 'Google web.dev',
      email: 'webdev@webdevmail.com',
      description: 'Integrate for enhanced collaboration in web development.',
      checkbox: true,
    },
    {
      logo: 'evernote.svg',
      title: 'Evernote',
      email: 'evernote@noteexample.com',
      description:
        'Streamline cryptocurrency transactions securely and efficiently.',
      checkbox: true,
    },
    {
      logo: 'inferno.svg',
      title: 'Inferno',
      email: 'inferno@dataexample.com',
      description: 'Robust email integration for data management.',
      checkbox: true,
    },
  ];

  const renderItem = (item: IIntegrationsItem, index: number) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 p-3.5"
      >
        <div className="flex items-center flex-wrap gap-3.5">
          <img
            src={toAbsoluteUrl(`/media/brand-logos/${item.logo}`)}
            className="size-8 shrink-0"
            alt="image"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Link
                href="#"
                className="text-sm font-semibold text-mono hover:text-primary-active"
              >
                {item.title}
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-secondary-foreground hover:text-primary-active"
              >
                {item.email}
              </Link>
            </div>
            <span className="text-sm font-medium text-secondary-foreground">
              {item.description}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-5">
          {item.checkbox ? (
            <Switch id="size-sm" size="sm" defaultChecked />
          ) : (
            <Switch id="size-sm" size="sm" />
          )}
          <Button variant="ghost" mode="icon">
            <Settings />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader id="external_services_integrations">
        <CardTitle>Integrations</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 lg:gap-7.5 lg:py-7.5 py-5">
        <div className="grid gap-5">
          {items.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export { Integrations, type IIntegrationsItem, type IIntegrationsItems };
