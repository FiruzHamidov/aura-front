import MeetTheTeam from '@/ui-components/team/team';
import Buy from '../_components/buy/buy';
import HeroSearch from '../_components/filters';
import Promo from '../_components/promo';
import TopListings from '../_components/top-listing/top-listings';
import Services from '../_components/services';

export default function Rent() {
  return (
    <>
      <HeroSearch title="Поможем найти и арендовать жилье!" />
      <div className="mt-10 md:mt-[60px]">
        <TopListings title="Снять недвижимость топовые объявления" />
      </div>
      <Promo />

      <Buy />
      <div className="lg:container mx-auto mt-10 md:mt-20">
        <Services />
      </div>
      <div className="mb-14 md:mb-[85px] mx-auto md:px-4 sm:px-6 lg:px-8">
        <MeetTheTeam />
      </div>
    </>
  );
}
