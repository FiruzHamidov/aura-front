import MeetTheTeam from '@/ui-components/team/team';
import Buy from './_components/buy/buy';
import HeroSearch from './_components/filters';
import PersonalRealtorCta from './_components/personal-realtor';
import Promo from './_components/promo';
import Services from './_components/services';
import TopListings from './_components/top-listing/top-listings';
import VipListings from "@/app/_components/top-listing/vip-listings";

export default function Home() {
  return (
    <>
      <HeroSearch title="Недвижимость в Таджикистане" />
      <div className="lg:container mx-auto mb-10 md:mb-20">
        <Services />
      </div>
      <VipListings />
      <Promo />
      <TopListings />
      <PersonalRealtorCta />
      <div className="mt-16 md:mt-20">
        <Buy />
      </div>
      <div className="mb-14 md:mb-[85px] mx-auto md:px-4 sm:px-6 lg:px-8">
        <MeetTheTeam />
      </div>
    </>
  );
}
