import Buy from './_components/buy/buy';
import HeroSearch from './_components/filters';
import PersonalRealtorCta from './_components/personal-realtor';
import Promo from './_components/promo';
import Services from './_components/services';
import MeetTheTeam from './_components/team';
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
      <MeetTheTeam />
    </div>
  );
}
