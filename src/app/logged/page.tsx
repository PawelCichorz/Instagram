'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Menu from '../Components/Menu';

export default function Logged() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [userName, setUserName] = useState<string | null>('');


  const fetchUserData = async () => {
    const response = await fetch('/api/getUserName'); // Endpoint backendowy
    if (response.ok) {
      const data = await response.json();
      setUserName(data.userName); // Zapisujemy userName w stanie
      console.log(data.userName)
    } else {
      console.error('Failed to fetch user data');
    }
  };

  useEffect(() => {
    fetchUserData(); // Wywołujemy fetch po załadowaniu komponentu
  }, []);

  const fetchProfileImage = async () => {
    const response = await fetch('/api/getProfileImage');
    if (response.ok) {
      const blob = await response.blob();
      setImageSrc(URL.createObjectURL(blob));
    } else {
      setImageSrc(null);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setFile(file);
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/profileImage', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Profile image uploaded successfully!');
      fetchProfileImage();
    } else {
      alert('Failed to upload profile image');
    }
    setFile(null)
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  return (
    <div className="flex">
      <Menu />
      <div className='flex  justify-center items-center text-center h-[200px]'>
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100 m-4">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt="Profile"
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <label className="text-gray-500 cursor-pointer flex flex-col items-center">
              Dodaj zdjęcie
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
          
        </div>
        {file && (
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Zapisz zdjęcie profilowe
          </button>
        )}
        <div className='flex items-center' >{userName}</div>
      </div>
    </div>
  );
}
