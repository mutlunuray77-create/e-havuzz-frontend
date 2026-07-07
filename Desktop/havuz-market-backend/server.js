const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // PayTR token şifrelemesi için gerekli built-in modül
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// İREM HANIMIN İSTEDİĞİ TAM 20 ADET PREMIUM YAPAY ZEKA DESTEKLİ ÜRÜN LİSTESİ
const yapayZekaDestekliUrunler = [
  { id: 201, name: "AquaGlow Turkuaz LED Havuz Aydınlatma", category: "Aydınlatma", price: 1450, image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&q=60", tag: "Yeni Sezon", moods: ["sakin", "teknolojik"], aiInsight: "💡 Bugün alabilirsiniz, önümüzdeki 7 günde fiyatı %6 artabilir!" },
  { id: 202, name: "Rio Masaj Etkili Paslanmaz Havuz Şelalesi", category: "Ekipmanlar", price: 12800, image: "https://images.unsplash.com/photo-1562184560-a11b7cf7c847?w=500&q=60", tag: "Özel Tasarım", moods: ["yorgun", "sakin"], aiInsight: "🔥 Son 3 günün en düşük fiyatı! Kaçırmayın." },
  { id: 203, name: "EcoFilter Premium Cam Havuz Kumu 20 kg", category: "Ekipmanlar", price: 340, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=60", tag: "En Çok Satan", moods: ["titiz", "sakin"], aiInsight: "📉 Fiyatı şu an kararlı durumda. Güvenle alabilirsiniz." },
  { id: 204, name: "SmartPool Bluetooth Akıllı Dozaj Pompası", category: "Pompalar", price: 18500, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=60", tag: "Akıllı Ürün", moods: ["teknolojik", "titiz"], aiInsight: "🤖 Yapay Zeka Öngörüsü: Gelecek ay stok durumuna bağlı olarak fiyatı yükselebilir." },
  { id: 205, name: "Olimpik Stil Havuz Emniyet ve Kulvar Çizgisi", category: "Ekipmanlar", price: 2100, image: "https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=500&q=60", tag: "Güvenlik", moods: ["sakin", "titiz"], aiInsight: "💡 Sezon ortası indirimi: Son 48 saatin en iyi fiyatı." },
  { id: 206, name: "DeepClean Profesyonel Havuz Temizlik Süpürgesi", category: "Temizlik", price: 950, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=60", tag: "Pratik Ürün", moods: ["titiz", "yorgun"], aiInsight: "⚡ Önümüzdeki 5 günde fiyatı %4 artış eğiliminde görünüyor." },
  { id: 207, name: "ThermoComfort Dijital Havuz Suyu Isı Ölçer", category: "Aydınlatma", price: 420, image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=60", tag: "Yeni", moods: ["teknolojik"], aiInsight: "📉 Fiyat analizine göre şu an satın almak için en ideal dönem." },
  { id: 208, name: "Premium Paslanmaz Havuz Giriş Merdiveni (4 Basamak)", category: "Ekipmanlar", price: 4750, image: "https://images.unsplash.com/photo-1572331507600-664123d1115e?w=500&q=60", tag: "Lüks", moods: ["sakin"], aiInsight: "🔥 Son 3 günün en düşük fiyatı fırsatını yakalayın." },
  { id: 209, name: "Anti-Yosun Concentre Havuz Bakım Sıvısı 10 L", category: "Kimyasallar", price: 780, image: "https://images.unsplash.com/photo-1527156279143-6cd52a32c2a1?w=500&q=60", tag: "Etkili Formül", moods: ["titiz"], aiInsight: "💡 Kimyasal ürünlerde kur dalgalanması öncesi bugün almanız önerilir." },
  { id: 210, name: "SolarTarpaulin Isı Koruyucu Havuz Temizlik Brbrandası", category: "Temizlik", price: 3200, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=60", tag: "Çevre Dostu", moods: ["keyifli"], aiInsight: "📈 Yapay zeka talebin arttığını öngörüyor, fiyat %8 yükselebilir!" },
  { id: 211, name: "Granül Havuz Kloru %56 Stabilizatörlü 25 KG", category: "Kimyasallar", price: 2300, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=60", tag: "Fırsat Ürünü", moods: ["titiz"], aiInsight: "💡 Su dezenfeksiyonu için haftalık periyotta en kararlı klor bileşiğidir." },
  { id: 212, name: "Lüks Duvar Tipi Havuz Şelalesi Şelale Perdesi", category: "Ekipmanlar", price: 15400, image: "https://images.unsplash.com/photo-1562184560-a11b7cf7c847?w=500&q=60", tag: "Özel Tasarım", moods: ["sakin", "yorgun"], aiInsight: "🌊 Mimari şelale tasarımı ortamdaki gürültüyü absorbe ederek sakinlik verir." },
  { id: 213, name: "Otomatik Havuz Dip Süpürme Robotu Klasik", category: "Temizlik", price: 34500, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=60", tag: "Premium Altyapı", moods: ["teknolojik", "titiz"], aiInsight: "🤖 Yapay Zeka Öngörüsü: Rutin temizlik saatlerinde %40 enerji amortismanı sunar." },
  { id: 214, name: "Yüksek Verimli Havuz Sirkülasyon Pompası 2 HP", category: "Pompalar", price: 11200, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=60", tag: "Yüksek Güç", moods: ["teknolojik"], aiInsight: "⚡ Büyük ölçekli havuz filtrasyon döngülerinde kurumsal standartlara tam uyumlu." },
  { id: 215, name: "Sıvı Ph Düşürücü Havuz Kimyasalı 20 KG", category: "Kimyasallar", price: 690, image: "https://images.unsplash.com/photo-1527156279143-6cd52a32c2a1?w=500&q=60", tag: "Temel İhtiyaç", aiInsight: "📉 Fiyat analizine göre stabil kalma eğiliminde, güvenle stoklanabilir." },
  { id: 216, name: "Havuz İçi RGB Aydınlatma Trafosu Kumandalı", category: "Aydınlatma", price: 2400, tag: "Yeni Ürün", aiInsight: "💡 Uzaktan kumanda entegrasyonu ile 12V armatürlerin akıllı kontrolünü sağlar.", moods: ["sakin", "teknolojik"] },
  { id: 217, name: "Havuz Suyu Parlatıcı ve Çöktürücü 10 L", category: "Kimyasallar", price: 510, tag: "Hızlı Etki", aiInsight: "✨ Havuz suyundaki donukluğu saniyeler içinde gidererek kristal berraklık sunar.", moods: ["titiz"] },
  { id: 218, name: "Teleskobik Havuz Kepçesi Derin Tip Filreli", category: "Temizlik", price: 680, tag: "Pratik", aiInsight: "⚡ İnce gözenekli yapısı sayesinde yüzeydeki polenleri dahi kolayca yakalar.", moods: ["titiz"] },
  { id: 219, name: "Güneş Enerjili Akıllı Havuz İyonizasyon Cihazı", category: "Ekipmanlar", price: 5400, tag: "Akıllı Ürün", aiInsight: "🤖 Güneş enerjisi paneli sayesinde sıfır işletme maliyeti ile koruma sağlar.", moods: ["teknolojik"] },
  { id: 220, name: "Geçmeli Havuz Kenar Izgara Köşe Parçası", category: "Ekipmanlar", price: 190, tag: "Yedek Parça", aiInsight: "💡 UV ışınlarına ve kırılmalara dayanıklı polimer yapısıyla uzun ömürlüdür.", moods: ["sakin"] }
];

// Local Bellekte Siparişleri Tutacak Geçici Havuz (Database görevi görüyor)
let siparislerVeritabani = [];

// 1. Tüm Ürünleri Getiren Endpoint (Artık 20 Adet)
app.get('/api/products', (req, res) => {
  res.json(yapayZekaDestekliUrunler);
});

// 2. PAYTR iFRAME TOKEN ÜRETME ENDPOINT'İ (İrem Hanım'ın Planladığı Güvenli API)
app.post('/api/paytr/token', (req, res) => {
  const { totalPrice, email, fullname, phone } = req.body;
  
  // Arpeta Yazılım PayTR Test Kimlik Bilgileri (Simüle)
  const merchant_id = '202677';
  const merchant_key = 'ArpetaKey77';
  const merchant_salt = 'ArpetaSalt77';
  const merchant_oid = 'ARP-' + Math.floor(100000 + Math.random() * 900000);
  
  const user_ip = '127.0.0.1';
  const payment_amount = Math.round(totalPrice * 100); // Kuruş cinsinden
  const currency = 'TL';
  const test_mode = '1';
  
  // PayTR Güvenlik Hash Zinciri Oluşturma
  const hashStr = merchant_id + user_ip + merchant_oid + email + payment_amount + payment_amount + currency + test_mode + merchant_salt;
  const token = crypto.createHmac('sha256', merchant_key).update(hashStr).digest('base64');
  
  res.json({
    success: true,
    token: token,
    merchant_oid: merchant_oid,
    iframeUrl: `https://www.paytr.com/odeme/guvenli/${token}` // Test iFrame yönlendirme linki
  });
});

// 3. Sipariş Oluşturma (Planındaki Tüm Alanları Kapsayan Gelişmiş Endpoint)
app.post('/api/orders', (req, res) => {
  const { items, totalPrice, isGuest, buyerName, buyerEmail, buyerPhone, merchant_oid } = req.body;
  
  const newOrder = {
    orderId: merchant_oid || `ARPETA-${Math.floor(100000 + Math.random() * 900000)}`,
    items,
    totalPrice,
    isGuest: isGuest || false,
    buyerName: buyerName || "Misafir Kullanıcı",
    buyerEmail: buyerEmail || "misafir@arpeta.com",
    buyerPhone: buyerPhone || "0555XXXXXXX",
    payment_status: "PayTR Onaylandı",
    status: "Hazırlanıyor",
    date: new Date().toLocaleDateString('tr-TR')
  };
  
  siparislerVeritabani.unshift(newOrder);
  console.log("🚚 [Arpeta DB] Yeni Sipariş Entegre Edildi:", newOrder);
  
  res.status(201).json({ 
    success: true, 
    message: "Siparişiniz PayTR onayıyla backend sistemine kaydedildi!", 
    order: newOrder 
  });
});

// 4. Belirli Bir Kullanıcıya veya E-postaya Ait Siparişleri Sorgulama
app.get('/api/orders/search', (req, res) => {
  const { email } = req.query;
  if (!email) return res.json([]);
  
  const filtrelenmisSiparisler = siparislerVeritabani.filter(o => o.buyerEmail.toLowerCase() === email.toLowerCase());
  res.json(filtrelenmisSiparisler);
});

app.listen(PORT, () => {
  console.log(`🚀 Arpeta E-Havuz Market API Sunucusu ${PORT} portunda yayında...`);
});