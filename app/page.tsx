'use client';

import {useRouter} from 'next/navigation';
import MeetTheTeam from '@/ui-components/team/team';
import {useGetPropertiesQuery} from '@/services/properties/hooks';
import Buy from './_components/buy/buy';
import {MainBanner} from './_components/banner';
import PersonalRealtorCta from './_components/personal-realtor';
import Promo from './_components/promo';
import Services from './_components/services';
import TopListings from './_components/top-listing/top-listings';
import Head from "next/head";

export default function Home() {
    const router = useRouter();

    const {data: properties, isLoading} = useGetPropertiesQuery({
        listing_type: 'regular',
        });
    const {data: vipProperties, isLoading: isVipLoading} =
        useGetPropertiesQuery({
            listing_type: 'vip',
        });

    const {data: urgentProperties, isLoading: isUrgentLoading} =
        useGetPropertiesQuery({
            listing_type: 'urgent',
        });

    return (
        <>
            <Head>
                <title>Недвижимость в Душанбе и Таджикистане – Продажа и аренда квартир, домов, участков | Ваше агентство</title>
                <meta
                    name="description"
                    content="Агентство недвижимости в Душанбе. Продажа и аренда квартир, домов, земельных участков и коммерческой недвижимости по всему Таджикистану. Срочные и VIP объявления."
                />
                <meta
                    name="keywords"
                    content="недвижимость Таджикистан, квартиры Душанбе, аренда квартир Душанбе, купить квартиру Душанбе, дома Душанбе, продажа домов Таджикистан, агентство недвижимости Душанбе, срочные объявления недвижимость, VIP недвижимость Душанбе, новостройки Душанбе, квартиры Худжанд, аренда квартир Худжанд, купить квартиру Худжанд, дома Худжанд, продажа домов Худжанд, агентство недвижимости Худжанд"
                />
                <meta property="og:title" content="Недвижимость в Душанбе и Таджикистане | Aura Estate" />
                <meta property="og:description" content="Продажа и аренда недвижимости в Душанбе и по всему Таджикистану. Квартиры, дома, участки, коммерческая недвижимость. Срочные и VIP объявления." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://aura.tj/" />
                <meta property="og:image" content="https://aura.tj/aura.svg" />
                <link rel="canonical" href="https://aura.tj/" />
            </Head>

            <MainBanner title="Aura Estate"/>
            <div className="lg:mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 mx-auto mb-10 md:mb-20">
                <Services/>
            </div>
            <TopListings
                properties={urgentProperties}
                title="Срочные объявления"
                isLoading={isUrgentLoading}
            />
            <Promo/>
            <TopListings
                properties={vipProperties}
                title="VIP объявления"
                isLoading={isVipLoading}
            />
            <PersonalRealtorCta/>
            <div className="mt-10 md:mt-20">
                <Buy properties={properties} isLoading={isLoading}/>
            </div>
            <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 text-center pt-6">
                <button
                    onClick={() => router.push('/buy')}
                    className="bg-[#0036A5] text-white text-lg px-10 py-2.5 rounded-lg cursor-pointer"
                >
                    Посмотреть все
                </button>
            </div>
            <div className="mb-14 md:mb-[85px] mx-auto md:px-4 sm:px-6 lg:px-8">
                <MeetTheTeam/>
            </div>
        </>
    );
}
