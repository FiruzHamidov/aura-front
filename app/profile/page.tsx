'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import UserIcon from '@/icons/UserIcon';
import HeartIcon from '@/icons/HeartIcon';
import WalletIcon from '@/icons/WalletIcon';
import ListingIcon from '@/icons/ListingIcon';
import LogoutIcon from '@/icons/LogoutIcon';

export default function Profile() {
  const [profileData, setProfileData] = useState({
    firstName: 'Шер',
    lastName: 'Атаев',
    dateOfBirth: '22/10/1999',
    phone: '90290 66 90',
    email: 'ataevsher@gmail.com',
  });

  // eslint-disable-next-line
  const [profileImage, setProfileImage] = useState('/images/team/1.png');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSave = () => {
    // Save profile data logic will go here
    console.log('Saving profile data:', profileData);
  };

  const handleUpdatePhoto = () => {
    // Photo update logic will go here
    console.log('Updating photo');
  };

  const handleDeletePhoto = () => {
    // Photo deletion logic will go here
    console.log('Deleting photo');
  };

  return (
    <div className="container flex gap-5 pt-8 pb-24">
      {/* Sidebar */}
      <div className="w-80 h-max bg-white p-[18px] pb-8">
        <nav className="flex flex-col gap-4">
          <Link
            href="/profile"
            className="flex items-center gap-3 bg-blue-700 text-white p-3 rounded-lg font-medium"
          >
            <UserIcon className="w-6 h-6 text-white" />
            <span>Профиль</span>
          </Link>
          <Link
            href="/favorites"
            className="flex items-center gap-3 text-gray-700 p-3 rounded-lg hover:bg-gray-100"
          >
            <HeartIcon className="w-6 h-6" />
            <span>Избранное</span>
          </Link>
          <Link
            href="/wallet"
            className="flex items-center gap-3 text-gray-700 p-3 rounded-lg hover:bg-gray-100"
          >
            <WalletIcon className="w-6 h-6" />
            <span>Кошелек</span>
          </Link>
          <Link
            href="/my-listings"
            className="flex items-center gap-3 text-gray-700 p-3 rounded-lg hover:bg-gray-100"
          >
            <ListingIcon className="w-6 h-6" />
            <span>Мои объявления</span>
          </Link>

          <button className="mt-80 flex items-center gap-3 text-red-600 p-3 rounded-lg hover:bg-gray-100">
            <LogoutIcon className="w-6 h-6" />
            <span>Выйти</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}

      <div className="bg-white rounded-lg p-8 w-full">
        <h1 className="text-2xl font-bold mb-8">Профиль</h1>

        {/* Profile Photo */}
        <div className="flex items-center mb-8 max-w-[390px]">
          <div className="relative">
            <div className="w-[62px] h-[62px] rounded-full overflow-hidden bg-gray-200">
              <Image
                src={profileImage}
                alt="Profile"
                width={62}
                height={62}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="ml-4 flex gap-4 text-lg">
            <button
              onClick={handleUpdatePhoto}
              className="px-2.5 py-1.5 bg-[#E8F6FF] text-[#3498DB] rounded-sm hover:bg-blue-200"
            >
              Обновить фото
            </button>
            <button
              onClick={handleDeletePhoto}
              className="px-2.5 py-1.5 bg-[#FFE9EA] text-[#FF0F0F] rounded-sm hover:bg-red-200"
            >
              Удалить фото
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-6 max-w-[390px]">
          <div>
            <label className="block mb-2 text-sm text-gray-600">Имя</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Фамилия</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">
              Дата рождения
            </label>
            <input
              type="text"
              name="dateOfBirth"
              value={profileData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">
              Номер телефона
            </label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-md bg-gray-50"
            />
          </div>

          <div className="mt-4">
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 bg-[#0036A5] text-white rounded-md hover:bg-blue-800 transition"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
