'use client';

import { useState } from 'react';
import Link from 'next/link';
import BuyCard from '@/app/_components/buy/buy-card';
import {useGetMyPropertiesQuery, useGetPropertiesQuery} from '@/services/properties/hooks';
import { Property } from '@/services/properties/types';

export default function MyListings() {

    return (
      <div>
          Мои показы
      </div>
    );
}
