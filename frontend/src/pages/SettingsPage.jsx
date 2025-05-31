import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { FaUserCircle, FaCamera } from 'react-icons/fa';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    username: '',
    full_name: '',
    profile_photo: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get('/auth/settings');
      setSettings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Ayarlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Burada normalde bir dosya yükleme servisi kullanılmalı
      // Şimdilik base64 olarak kaydediyoruz
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, profile_photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await axiosInstance.put('/auth/settings', settings);
      setSuccess('Ayarlar başarıyla güncellendi');
    } catch (err) {
      setError(err.response?.data?.message || 'Ayarlar güncellenirken bir hata oluştu');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('Yeni şifreler eşleşmiyor');
      return;
    }

    try {
      await axiosInstance.put('/auth/settings', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      
      setSuccess('Şifre başarıyla güncellendi');
      setShowPasswordForm(false);
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Şifre güncellenirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="relative bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 rounded-2xl shadow-2xl p-8 hover:scale-[1.025] hover:shadow-3xl transition-all duration-300 border border-gray-100 max-w-xl mx-auto">
        <div className="absolute -top-5 -right-5 bg-gray-500 rounded-full p-3 shadow-lg">
          <Cog6ToothIcon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-extrabold text-gray-800 mb-6 tracking-tight flex items-center gap-2">
          Ayarlar
        </h3>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {settings.profile_photo ? (
                <img
                  src={settings.profile_photo}
                  alt="Profil"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-gray-400" />
              )}
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                <FaCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Kullanıcı Adı</label>
              <input
                type="text"
                value={settings.username}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Ad Soyad</label>
              <input
                type="text"
                value={settings.full_name}
                onChange={(e) => setSettings(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Kaydet
            </button>
          </form>

          <div className="mt-8">
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-blue-500 hover:text-blue-700"
            >
              Şifre Değiştir
            </button>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Mevcut Şifre</label>
                  <input
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Yeni Şifre</label>
                  <input
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Şifreyi Güncelle
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .loader {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage; 