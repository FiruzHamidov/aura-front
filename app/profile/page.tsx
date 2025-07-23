'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProfile, useUpdateProfileMutation } from '@/services/login/hooks';
import { useAddProfilePhotoMutation } from '@/services/users/hooks';
import { toast } from 'react-toastify';
import { STORAGE_URL } from '@/constants/base-url';

export default function Profile() {
  const { data: user, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfileMutation();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '22/10/1999',
    phone: '',
    email: '',
  });
  const profilePhoto = `${STORAGE_URL}/${user?.photo || '/images/team/1.png'}`;

  const [profileImage] = useState(profilePhoto);
  const [uploading, setUploading] = useState(false);

  const addProfilePhotoMutation = useAddProfilePhotoMutation();

  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(' ');
      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts[1] || '',
        dateOfBirth: '22/10/1999',
        phone: user.phone,
        email: user.email,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      await updateProfileMutation.mutateAsync({
        userId: user.id,
        profileData: profileData,
      });
    } catch (error) {
      toast.error('Error updating profile: ' + error);
    }
  };

  const handleUpdatePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      await addProfilePhotoMutation.mutateAsync({
        userId: String(user.id),
        photo: file,
      });
      // Optionally update the UI with the new photo URL if returned
      // setProfileImage(URL.createObjectURL(file));
      toast.success('Фото профиля обновлено!');
    } catch (error) {
      toast.error('Ошибка при обновлении фото: ' + error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = () => {
    // Photo deletion logic will go here
    toast.info('Удаление фото пока не реализовано');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-8 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-8 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Ошибка загрузки профиля</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-8 w-full">
      <h1 className="text-2xl font-bold mb-8">Профиль</h1>

      {/* User Info Section */}
      {user && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#0036A5] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                {user.role?.name || 'Пользователь'}
              </p>
              <p className="text-xs text-gray-400">
                ID: {user.id} • Статус: {user.status}
              </p>
            </div>
          </div>
        </div>
      )}

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
        <div className="ml-4 flex gap-4 text-lg items-center">
          <label className="px-2.5 py-1.5 bg-[#E8F6FF] text-[#3498DB] rounded-sm hover:bg-blue-200 cursor-pointer">
            {uploading ? 'Загрузка...' : 'Обновить фото'}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpdatePhoto}
              className="hidden"
              disabled={uploading}
            />
          </label>
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
            disabled={updateProfileMutation.isPending}
            className="w-full py-3 px-4 bg-[#0036A5] text-white rounded-md hover:bg-blue-800 transition disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}
