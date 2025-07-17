'use client';

import MeetTheTeam from '@/ui-components/team/team';
import Buy from './_components/buy/buy';
import { MainBanner } from './_components/banner';
import PersonalRealtorCta from './_components/personal-realtor';
import Promo from './_components/promo';
import Services from './_components/services';
import TopListings from './_components/top-listing/top-listings';
import VipListings from '@/app/_components/top-listing/vip-listings';
import { useGetPropertiesQuery } from '@/services/properties/hooks';

export default function Home() {
  const { data: properties, isLoading } = useGetPropertiesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MainBanner title="Недвижимость в Таджикистане" />
      <div className="lg:container mx-auto mb-10 md:mb-20">
        <Services />
      </div>
      <VipListings properties={properties} />
      <Promo />
      <TopListings properties={properties} />
      <PersonalRealtorCta />
      <div className="mt-10 md:mt-20">
        <Buy properties={properties} />
      </div>
      <div className="mb-14 md:mb-[85px] mx-auto md:px-4 sm:px-6 lg:px-8">
        <MeetTheTeam />
      </div>
    </>
  );
}
