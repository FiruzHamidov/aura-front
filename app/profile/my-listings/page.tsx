'use client';

import {useState} from 'react';
import BuyCard from '@/app/_components/buy/buy-card';
import BuyCardSkeleton from '@/ui-components/BuyCardSkeleton';
import {useGetMyPropertiesQuery} from '@/services/properties/hooks';
import {Property} from '@/services/properties/types';
import {useProfile} from "@/services/login/hooks";

export default function MyListings() {

    const {data: user} = useProfile();

    const {data: myProperties, isLoading} = useGetMyPropertiesQuery();
    const [selectedTab, setSelectedTab] = useState<'active' | 'inactive'>(
        'active'
    );

    const listings = myProperties?.data || [];

    const activeListings = listings.filter(
        (listing: Property) => listing.moderation_status === 'approved'
    );

    const inactiveListings = listings.filter(
        (listing: Property) => listing.moderation_status !== 'approved'
    );

    const currentListings =
        selectedTab === 'active' ? activeListings : inactiveListings;


    if (isLoading) {
        return (
            <div>
                <div className="mb-6">
                    <div className="flex space-x-4 border-b">
                        <button
                            className={`pb-2 px-4 border-b-2 font-medium ${
                                selectedTab === 'active'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500'
                            }`}
                            onClick={() => setSelectedTab('active')}
                        >
                            Активные
                        </button>
                        <button
                            className={`pb-2 px-4 border-b-2 font-medium ${
                                selectedTab === 'inactive'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500'
                            }`}
                            onClick={() => setSelectedTab('inactive')}
                        >
                            Неактивные
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
                    {Array.from({length: 6}).map((_, index) => (
                        <BuyCardSkeleton key={index}/>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex space-x-4 border-b">
                    <button
                        className={`pb-2 px-4 border-b-2 font-medium ${
                            selectedTab === 'active'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500'
                        }`}
                        onClick={() => setSelectedTab('active')}
                    >
                        Активные ({activeListings.length})
                    </button>
                    <button
                        className={`pb-2 px-4 border-b-2 font-medium ${
                            selectedTab === 'inactive'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500'
                        }`}
                        onClick={() => setSelectedTab('inactive')}
                    >
                        Неактивные ({inactiveListings.length})
                    </button>
                </div>
            </div>

            {currentListings.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">
                        {selectedTab === 'active'
                            ? 'У вас нет активных объявлений'
                            : 'У вас нет неактивных объявлений'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
                    {currentListings.map((listing: Property) => (
                        // <Link key={listing.id} href={`/profile/edit-post/${listing.id}`}>
                        <BuyCard listing={listing} user={user} key={listing.id}/>
                        //</Link>
                    ))}
                </div>
            )}
        </div>
    );
}
