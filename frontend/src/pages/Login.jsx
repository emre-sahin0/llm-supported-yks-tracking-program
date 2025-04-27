import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // yönlendirme için import

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // yönlendirme hook'u

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/auth/login',
            { username, password },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true
            }
          );
          

      console.log("Gelen Yanıt:", response.data);

      if (response.data.message === "Giriş başarılı") {
        alert("Giriş Başarılı! 🎉");
        navigate('/dashboard');  // Giriş başarılıysa dashboard'a yönlendir
      } else {
        setError("Giriş başarısız oldu.");
      }
    } catch (err) {
      console.error("Login hatası:", err);
      setError('Kullanıcı adı veya şifre hatalı!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">YKS Takip Programı</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Kullanıcı adınızı girin"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Şifrenizi girin"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Giriş Yap
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Hesabınız yok mu?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-500 hover:text-blue-700"
            >
              Kayıt Ol
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
