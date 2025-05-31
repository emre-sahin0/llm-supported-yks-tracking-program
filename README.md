# YKS Takip & AI Quiz Platformu

YKS'ye hazırlanan öğrenciler ve etüt merkezleri için geliştirilmiş, konu/performans takibi ve yapay zeka destekli quiz özellikleri sunan tam kapsamlı bir platformdur.

---

## Özellikler

### Genel
- Öğrenci ve etüt merkezi kaydı (özel anahtar ile)
- Güvenli oturum yönetimi (Flask-Login)
- PostgreSQL tabanlı veri saklama

### Öğrenci Paneli
- **Net Takibi:** Sınav netlerinizi kaydedin ve gelişiminizi izleyin.
- **Konu Takibi:** Hangi konuları tamamladığınızı işaretleyin.
- **Soru Takibi:** Çözdüğünüz soru sayılarını ve detaylarını kaydedin.
- **Program Oluşturma:** Kendi çalışma programınızı oluşturun.
- **AI Quiz:** Tamamladığınız her konu için Gemini destekli, otomatik çoktan seçmeli quiz çözün ve anında geri bildirim alın.
- **AI Analiz:** Performansınıza göre yapay zeka destekli çalışma önerileri alın.

### Etüt Merkezi Paneli
- Öğrenci yönetimi ve performans takibi
- Toplu program ve konu atama

### Modern Arayüz
- Responsive ve kullanıcı dostu React arayüzü
- Modern, kutulu quiz ve sonuç ekranları
- Kolay kullanım ve hızlı erişim

---

## Kurulum

### 1. PostgreSQL Kurulumu
- PostgreSQL sunucunuzu kurun ve bir veritabanı oluşturun.
- Render, Railway gibi platformlarda canlıya alacaksanız, platformun verdiği bağlantı bilgisini kullanın.

### 2. Backend (Flask)
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
pip install -r requirements.txt
```
`.env` dosyanızı oluşturun ve aşağıdaki gibi doldurun:
```
SECRET_KEY=senin_secretin
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-flash
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_HOST=...
POSTGRES_PORT=5432
POSTGRES_DB=...
```
Uygulamayı başlatın:
```bash
python app.py
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm start
```
Tarayıcıda `http://localhost:3000` adresine gidin.

---

## Canlıya Alma (Render/Railway/Heroku)
- Ortam değişkenlerini platform panelinden girin.
- Backend için start komutu: `gunicorn app:app` veya `python app.py`
- Frontend için: `npm run build` ve statik dosya servisi
- CORS ayarlarını production domainlerine göre güncelleyin.

---

## Kullanım Akışı

1. **Kayıt Ol / Giriş Yap**
2. **Konu Takibi:** Konu kutucuğunu tamamladığınızda otomatik olarak AI Quiz başlar.
3. **AI Quiz:** Gemini API ile o konuya özel 2 çoktan seçmeli soru çözersiniz, anında geri bildirim alırsınız.
4. **Net ve Soru Takibi:** Netlerinizi ve çözdüğünüz soruları kaydedin.
5. **AI Analiz:** Performansınıza göre yapay zeka önerileri alın.

---

## Gelişmiş Özellikler

- **Yapay Zeka ile Quiz:** Gemini API ile otomatik, konuya özel, çoktan seçmeli sorular.
- **Anında Geri Bildirim:** Doğru sayınıza göre motivasyonel mesajlar.
- **Modern Tasarım:** Responsive, kutulu ve renkli quiz/sonuç ekranları.
- **Kolay Entegrasyon:** Her ortamda kolayca deploy edilebilir yapı.

---

## Katkı ve Lisans

- Katkı için fork/pull request adımlarını izleyin.
- MIT Lisansı ile özgürce kullanabilirsiniz.

---

Her türlü soru ve katkı için iletişime geçebilirsiniz!  
Kolay gelsin 🚀 