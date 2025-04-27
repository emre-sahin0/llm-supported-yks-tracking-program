# YKS Takip Programı

Bu proje, YKS'ye hazırlanan öğrenciler ve etüt merkezleri için geliştirilmiş bir takip programıdır.

## Özellikler

- Öğrenci ve etüt merkezi kaydı
- Net takibi
- Konu takibi
- Soru takibi
- Program oluşturma
- Dashboard ile genel görünüm

## Kurulum

### Backend Kurulumu

1. Python 3.9 veya üstü sürümünün yüklü olduğundan emin olun
2. Backend klasörüne gidin:
   ```bash
   cd backend
   ```
3. Sanal ortam oluşturun ve aktif edin:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```
4. Gerekli paketleri yükleyin:
   ```bash
   pip install -r requirements.txt
   ```
5. PostgreSQL veritabanını kurun ve `config.py` dosyasındaki bağlantı bilgilerini güncelleyin
6. Uygulamayı başlatın:
   ```bash
   python app.py
   ```

### Frontend Kurulumu

1. Node.js'in yüklü olduğundan emin olun
2. Frontend klasörüne gidin:
   ```bash
   cd frontend
   ```
3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
4. Uygulamayı başlatın:
   ```bash
   npm start
   ```

## Kullanım

1. Tarayıcıda `http://localhost:3000` adresine gidin
2. Kayıt ol veya giriş yap
3. Öğrenci olarak:
   - Netlerinizi girebilirsiniz
   - Konuları takip edebilirsiniz
   - Soru çözümlerinizi kaydedebilirsiniz
   - Programınızı oluşturabilirsiniz

4. Etüt merkezi olarak:
   - Öğrencilerinizi yönetebilirsiniz
   - Öğrenci performanslarını takip edebilirsiniz
   - Program oluşturabilirsiniz

## Güvenlik

- Etüt merkezi kaydı için özel anahtar gereklidir
- Şifreler güvenli bir şekilde hash'lenerek saklanır
- Oturum yönetimi için Flask-Login kullanılır

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın. 