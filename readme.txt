# Görev Takip API

Node.js, Express ve PostgreSQL ile görev oluşturma, listeleme,
tamamlanma durumunu güncelleme ve silme API’si.

## Gereksinimler

- Node.js ve npm
- Çalışan PostgreSQL sunucusu
- PostgreSQL’de bağlantı yetkisi olan bir kullanıcı

## Kurulum

Bağımlılıkları yükle:

```bash
npm install
```

`server.js` içindeki bağlantı ayarlarını kendi ortamına göre düzenle.
Mevcut geliştirme ayarları:

- Host: localhost
- Port: 5432
- Kullanıcı: mertcan
- Veritabanı: task_app

Parola gerekiyorsa kaynak koda yazma; bağlantı için `PGPASSWORD`
ortam değişkeni kullanılabilir.

Yeni kurulumda, PostgreSQL’e bağlanıp veritabanını oluştur:

```sql
CREATE DATABASE task_app;
```

Ardından terminalde `schema.sql` dosyasını bu veritabanına uygula:

```bash
psql -h localhost -U mertcan -d task_app -f schema.sql
```

Mevcut veritabanı ve tablo zaten oluşturulmuşsa bu adımları atla.

## Çalıştırma

```bash
node server.js
```

API adresi: http://localhost:3000

Sağlık kontrolü:

```http
GET /health
```

## Endpoint’ler

| Metot | Adres | İşlem | Başarı |
|---|---|---|---|
| GET | /health | Sunucunun yanıt verdiğini kontrol et | 200 |
| GET | /tasks | Görevleri listele | 200 |
| GET | /tasks/:id | Tek görev getir | 200 |
| POST | /tasks | Görev oluştur | 201 |
| PATCH | /tasks/:id | Tamamlanma durumunu güncelle | 200 |
| DELETE | /tasks/:id | Görevi sil | 204 |

POST ve PATCH isteklerinde `Content-Type: application/json` kullanılır.

Görev oluşturma gövdesi:

```json
{
  "title": "Backend çalış"
}
```

Yeni görevde `completed` varsayılan olarak `false` olur.

Tamamlanma durumunu güncelleme gövdesi:

```json
{
  "completed": true
}
```

## Hata yanıtları

- 400: Geçersiz ID, geçersiz başlık veya boolean olmayan completed
- 404: Görev bulunamadı
- 500: Veritabanı işlemi sırasında sunucu hatası

Başlık boş olmayan bir string, ID pozitif tam sayı olmalıdır.
Başarılı DELETE yanıtının gövdesi yoktur.

## Testler

Sunucu ve PostgreSQL çalışırken ikinci terminalde:

```bash
npm test
```

Testler:

- Sayı başlık gönderildiğinde 400 dönmesi
- String completed gönderildiğinde 400 dönmesi
- Geçerli başlıkla görev oluşturulduğunda 201 ve beklenen alanların dönmesi

Başarılı oluşturma testi veritabanına deneme görevi ekler ve
test sonunda siler.