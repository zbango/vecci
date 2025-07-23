'use client';

import { Fragment } from 'react';
import { Faq } from '@/partials/common/faq';
import { Help2 } from '@/partials/common/help2';
import { Starter } from '@/partials/common/starter';
import { toAbsoluteUrl } from '@/lib/helpers';

export function AccountTeamsStarterContent() {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <Starter
        image={
          <Fragment>
            <img
              src={toAbsoluteUrl('/media/illustrations/32.svg')}
              className="dark:hidden max-h-[230px]"
              alt="image"
            />
            <img
              src={toAbsoluteUrl('/media/illustrations/32-dark.svg')}
              className="light:hidden max-h-[230px]"
              alt="image"
            />
          </Fragment>
        }
        title="Swift Setup for New Teams"
        subTitle={
          <Fragment>
            Enhance team formation and management with easy-to-use tools for
            communication,
            <br />
            task organization, and progress tracking, all in one place.
          </Fragment>
        }
        engage={{
          path: '/public-profile/teams',
          label: 'Create New Team',
          btnColor: 'btn-primary',
        }}
      />
      <Faq />
      <Help2 />
    </div>
  );
}
