import MeetTheTeam from '@/ui-components/team/team';
import Buy from './_components/buy/buy';
import HeroSearch from './_components/filters';
import PersonalRealtorCta from './_components/personal-realtor';
import Promo from './_components/promo';
import Services from './_components/services';
import TopListings from './_components/top-listing/top-listings';

export default function Home() {
  return (
    <div className="bg-[#f6f7f8]">
      <HeroSearch />
      <Services />
      <TopListings />
      <Promo />
      <TopListings />
      <PersonalRealtorCta />
      <Buy />
      <div className="mb-14 md:mb-[85px] mx-auto md:px-4 sm:px-6 lg:px-8">
        <MeetTheTeam />
      </div>
    </div>
  );
}
