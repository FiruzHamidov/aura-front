'use client';

import { useState } from 'react';
import Image from 'next/image';

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
    <div className="bg-white rounded-lg p-8 w-full">
      <h1 className="text-2xl font-bold mb-8">Профиль</h1>

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
  );
}
