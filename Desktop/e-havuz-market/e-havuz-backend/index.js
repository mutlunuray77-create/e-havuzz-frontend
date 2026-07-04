import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🌟 HER ÜRÜNE FARKLI TAHMİN STRATEJİSİ EKLEDİK
const products = [
  {
    id: 1,
    name: "Havuz Kloru %56 Toz Granül 25 kg",
    category: "Havuz Kimyasalları",
    price: 2450.00,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&auto=format&fit=crop&q=60",
    description: "Havuz suyunun dezenfeksiyonunda kullanılan, hızlı çözünen stabilizatörlü toz klor.",
    stock: 15,
    moods: ["💼 İş odaklı"],
    aiTags: ["bakım", "temizlik", "klor", "kimyasal"],
    pricePrediction: "Fiyat stabil. Güvenle alabilirsiniz.",
    predictionType: "neutral" // Normal/Nötr durum
  },
  {
    id: 2,
    name: "Sıvı Yosun Önleyici Dezenfektan 20 lt",
    category: "Havuz Kimyasalları",
    price: 850.00,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=60",
    description: "Havuz duvarlarında ve tabanında yosun oluşumunu engelleyen konsantre sıvı ürün.",
    stock: 22,
    moods: ["😴 Yorgun"],
    aiTags: ["yosun", "hediye", "temizlik", "ucuz"],
    pricePrediction: "Bu ürünü alma. 4 gün sonra fiyatı %18 düşebilir.",
    predictionType: "danger" // Düşüş uyarısı (Alma)
  },
  {
    id: 3,
    name: "Astral Pool Havuz Pompası 1.5 HP",
    category: "Havuz Ekipmanları",
    price: 14200.00,
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop&q=60",
    description: "Yüksek performanslı, sessiz çalışan, kendinden emişli sirkülasyon pompası.",
    stock: 5,
    moods: ["💼 İş odaklı"],
    aiTags: ["pompa", "motor", "ekipman"],
    pricePrediction: "Bak bugün almanın tam zamanı! 2 gün sonra fiyatı yüzde 5 artabilir.",
    predictionType: "warning" // Artış uyarısı (Hemen al)
  },
  {
    id: 4,
    name: "Uzaktan Kumandalı Led Havuz Lambası",
    category: "Aydınlatma Sistemleri",
    price: 1950.00,
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500&auto=format&fit=crop&q=60",
    description: "RGB renk değiştirebilen, energy tasarruflu sıva altı havuz aydınlatma armatürü.",
    stock: 40,
    moods: ["😀 Mutlu", "🏖️ Tatil modu"],
    aiTags: ["lamba", "ışık", "led", "renkli", "hediye"],
    pricePrediction: "", // HİÇBİR ŞEY YAZMAYACAK
    predictionType: "none"
  },
  {
    id: 5,
    name: "Havuz PH Düşürücü Toz 25 kg",
    category: "Havuz Kimyasalları",
    price: 950.00,
    image: "https://images.unsplash.com/photo-1607619056574-7b8f304f3c6f?w=500&auto=format&fit=crop&q=60",
    description: "Havuz suyunun ideal PH değerini (7.2 - 7.6) korumak için kullanılan toz asit.",
    stock: 18,
    moods: ["💼 İş odaklı"],
    aiTags: ["ph", "kimyasal", "denge", "ucuz", "hediye"],
    pricePrediction: "Analizlere göre fiyat önümüzdeki 15 gün boyunca tamamen sabit görünüyor.",
    predictionType: "neutral"
  },
  {
    id: 6,
    name: "Otomatik Havuz Temizlik Robotu",
    category: "Havuz Ekipmanları",
    price: 28500.00,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60",
    description: "Taban ve duvarları kendi kendine tarayıp temizleyen akıllı robot.",
    stock: 3,
    moods: ["😴 Yorgun", "🏖️ Tatil modu"],
    aiTags: ["robot", "temizlik", "akıllı", "ekipman"],
    pricePrediction: "Acele et! Sınırlı stok sebebiyle yarın fiyat güncellemesi gelebilir.",
    predictionType: "warning"
  },
  {
    id: 7,
    name: "Yüzen RGB Işıklı Havuz Hoparlörü",
    category: "Aydınlatma Sistemleri",
    price: 1450.00,
    image: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=500&auto=format&fit=crop&q=60",
    description: "Su geçirmez, bluetooth bağlantılı, müzikle ritim tutan havuz içi aydınlatmalı hoparlör.",
    stock: 25,
    moods: ["😀 Mutlu", "🏖️ Tatil modu"],
    aiTags: ["hoparlör", "müzik", "ışık", "eğlence"],
    pricePrediction: "", // HİÇBİR ŞEY YAZMAYACAK
    predictionType: "none"
  },
  {
    id: 8,
    name: "Havuz Kepçesi ve Derin Yüzey Filesi",
    category: "Havuz Ekipmanları",
    price: 450.00,
    image: "https://images.unsplash.com/photo-1534643900280-d56d400ac7a5?w=500&auto=format&fit=crop&q=60",
    description: "Su yüzeyindeki yaprak ve pislikleri temizlemek için dayanıklı file aparat.",
    stock: 50,
    moods: ["💼 İş odaklı", "😴 Yorgun"],
    aiTags: ["kepçe", "file", "manuel", "ucuz", "hediye"],
    pricePrediction: "Kaçırma! Bu ürün şu an son 6 ayın en dip fiyatında.",
    predictionType: "neutral"
  },
  {
    id: 9,
    name: "Güneş Enerjili Dijital Havuz Termometresi",
    category: "Havuz Ekipmanları",
    price: 680.00,
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500&auto=format&fit=crop&q=60",
    description: "Su sıcaklığını anlık ölçen, solar panelli ve dijital ekranlı yüzen termometre.",
    stock: 30,
    moods: ["😀 Mutlu", "🏖️ Tatil modu"],
    aiTags: ["termometre", "derece", "solar", "ucuz", "hediye"],
    pricePrediction: "Dolar kuru endeksli üretim sebebiyle pazar gecesi fiyatı %3 artabilir.",
    predictionType: "warning"
  },
  {
    id: 10,
    name: "Paslanmaz Çelik Havuz Merdiveni 4 Basamaklı",
    category: "Havuz Ekipmanları",
    price: 4800.00,
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500&auto=format&fit=crop&q=60",
    description: "AISI 304 kalite paslanmaz çelikten üretilmiş, kaymaz basamaklı havuz merdiveni.",
    stock: 8,
    moods: ["💼 İş odaklı"],
    aiTags: ["merdiven", "çelik", "aksesuar"],
    pricePrediction: "", // HİÇBİR ŞEY YAZMAYACAK
    predictionType: "none"
  }
];

// API Rotaları
app.get('/api/products', (req, res) => {
  const { category, mood } = req.query;
  let filtered = [...products];
  if (category) filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  if (mood) filtered = filtered.filter(p => p.moods.includes(mood));
  res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  product ? res.json(product) : res.status(404).json({ message: "Bulunamadı" });
});

app.post('/api/ai-assistant', (req, res) => {
  const { prompt } = req.body;
  const query = prompt.toLowerCase();
  let resultProducts = [];
  let aiMessage = "";

  if (query.includes("1000") || query.includes("hediye")) {
    resultProducts = products.filter(p => p.price < 1000 && p.aiTags.includes("hediye"));
    aiMessage = "🤖 AI Asistan: Sizin için 1000 TL altı harika hediye seçenekleri süzdüm:";
  } else if (query.includes("ışık") || query.includes("lamba")) {
    resultProducts = products.filter(p => p.aiTags.includes("ışık"));
    aiMessage = "🤖 AI Asistan: Havuz aydınlatma sistemlerimiz:";
  } else {
    resultProducts = products.filter(p => p.aiTags.includes("temizlik"));
    aiMessage = "🤖 AI Asistan: Havuz temizlik ve bakım ürünlerimiz hazır:";
  }
  res.json({ message: aiMessage, products: resultProducts });
});

app.listen(PORT, () => console.log(`🚀 Sunucu çalışıyor: ${PORT}`));