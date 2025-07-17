import MeetTheTeam from '@/ui-components/team/team';
import Buy from '../_components/buy/buy';
import Promo from '../_components/promo';
import TopListings from '../_components/top-listing/top-listings';
import Services from '../_components/services';
import { MainBanner } from '../_components/banner';
import { useGetPropertiesQuery } from '@/services/properties/hooks';

export default function Rent() {
  const { data: properties, isLoading } = useGetPropertiesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MainBanner title="Поможем найти и арендовать жилье!" />
      <div className="mt-10 md:mt-[60px]">
        <TopListings
          title="Снять недвижимость топовые объявления"
          properties={properties}
        />
      </div>
      <Promo />

      <Buy properties={properties} />
      <div className="lg:container mx-auto mt-10 md:mt-20">
        <Services />
      </div>
      <div className="mb-14 md:mb-[85px] mx-auto md:px-4 sm:px-6 lg:px-8">
        <MeetTheTeam />
      </div>
    </>
  );
}
