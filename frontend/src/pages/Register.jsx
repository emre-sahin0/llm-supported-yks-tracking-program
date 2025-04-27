import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'student',
    registration_key: '' // Etüt merkezi anahtarı için yeni alan
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Etüt merkezi seçilmişse ve anahtar girilmemişse hata ver
      if (formData.role === 'etut' && !formData.registration_key) {
        setError('Etüt merkezi kaydı için özel anahtar gereklidir');
        return;
      }

      const response = await axios.post('http://localhost:5000/auth/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.message === 'Kayıt başarılı') {
        alert('Kayıt başarılı! Giriş yapabilirsiniz.');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt sırasında bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">YKS Takip Programı - Kayıt Ol</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Ad Soyad</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Adınız ve soyadınız"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Kullanıcı Adı</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Kullanıcı adınız"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Şifre</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Şifreniz"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Kullanıcı Tipi</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="student">Öğrenci</option>
              <option value="etut">Etüt Merkezi</option>
            </select>
          </div>

          {formData.role === 'etut' && (
            <div>
              <label className="block text-gray-700">Etüt Merkezi Kayıt Anahtarı</label>
              <input
                type="password"
                name="registration_key"
                value={formData.registration_key}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Etüt merkezi kayıt anahtarını girin"
                required={formData.role === 'etut'}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Kayıt Ol
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Zaten hesabınız var mı?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-blue-500 hover:text-blue-700"
            >
              Giriş Yap
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 