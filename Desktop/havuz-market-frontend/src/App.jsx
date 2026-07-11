import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, HelpCircle, FileText, Truck, Mail, MapPin, Sparkles, Filter, CheckCircle, X, LogIn, UserPlus, ArrowLeft, CreditCard, Cookie, Eye } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [dbProducts, setDbProducts] = useState([]); 
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [notification, setNotification] = useState("");
  const [activeModal, setActiveModal] = useState(""); 
  const [asistanSoru, setAsistanSoru] = useState("");
  const [asistanCevap, setAsistanCevap] = useState("");
  const [asistanOnerilenUrun, setAsistanOnerilenUrun] = useState(null);

  // Ürün detay ekranı state yapısı
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  // Sözleşmelerin sepeti kapatmadan açılmasını sağlayan alt modal state'i
  const [subModalContent, setSubModalOpen] = useState("");

  // Yasal Sözleşme ve Çerez State Kontrolleri
  const [cookieBannerOpen, setCookieBannerOpen] = useState(true); 
  const [kvkkRegisterCheck, setKvkkRegisterCheck] = useState(false); 
  const [commercialIletiCheck, setCommercialIletiCheck] = useState(false); 
  const [checkoutContractCheck, setCheckoutFormCheck] = useState(false); 

  // Form ve Sipariş Takip State Yapıları
  const [checkoutForm, setCheckoutForm] = useState({
    ad: '', soyad: '', email: '', telefon: '', sehir: '', ilce: '', postaKodu: '', acikAdres: ''
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ fullname: '', city: '', phone: '', email: '', tcNo: '' });
  const [cardInfo, setCardInfo] = useState({ name: '', number: '', date: '', cvc: '' });
  
  const [simulatedOrderCode, setSimulatedOrderCode] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false); 

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 20 Premium Ürün Veri Kümesi
  const mock20Products = [
    { id: 201, name: "AquaGlow Turkuaz LED Havuz Aydınlatma", category: "Aydınlatma", price: 1450, image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&q=80", tag: "Yeni Sezon", moods: ["keyifli", "teknolojik"], aiInsight: "💡 Bugün alabilirsiniz, önümüzdeki 7 günde fiyatı %6 artabilir!", stok: 14, acıklama: "12V düşük voltaj yüksek yoğunluklu LED teknolojisi. Su sızdırmaz IP68 epoksi gövde ile havuzunuza mükemmel turkuaz ambiyans sağlar." },
    { id: 202, name: "Rio Masaj Etkili Paslanmaz Havuz Şelalesi", category: "Ekipmanlar", price: 12800, image: "https://images.unsplash.com/photo-1562184560-a11b7cf7c847?w=500&q=80", tag: "Özel Tasarım", moods: ["yorgun", "sakin"], aiInsight: "🔥 Son 3 günün en düşük fiyatı! Kaçırmayın.", stok: 3, acıklama: "AISI 316 kalite paslanmaz çelikten üretilmiştir. Duvar tipi montaja uygun, su sesiyle terapi etkisi sunan şelale perdesi." },
    { id: 203, name: "EcoFilter Premium Cam Havuz Kumu 20 kg", category: "Ekipmanlar", price: 340, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", tag: "En Çok Satan", moods: ["titiz", "sakin"], aiInsight: "📉 Fiyatı şu an kararlı durumda. Güvenle alabilirsiniz.", stok: 45, acıklama: "Geleneksel kuvars kumuna göre %30 daha yüksek filtrasyon hassasiyeti sunan, yosun tutmayan çevre dostu cam medya." },
    { id: 204, name: "SmartPool Bluetooth Akıllı Dozaj Pompası", category: "Pompalar", price: 18500, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80", tag: "Akıllı Ürün", moods: ["teknolojik", "titiz"], aiInsight: "🤖 Yapay Zeka Öngörüsü: Gelecek ay stok durumuna bağlı olarak fiyatı yükselebilir.", stok: 5, acıklama: "Mobil uygulama üzerinden pH ve Klor seviyelerini otomatik analiz edip dozajlama yapan akıllı sirkülasyon otomasyonu." },
    { id: 205, name: "Olimpik Stil Havuz Emniyet ve Kulvar Çizgisi", category: "Ekipmanlar", price: 2100, image: "https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=500&q=80", tag: "Güvenlik", moods: ["sakin", "titiz"], aiInsight: "💡 Sezon ortası indirimi: Son 48 saatin en iyi fiyatı.", stok: 12, acıklama: "Dalga kıran özel polietilen dubalı, paslanmaz çelik halat altyapılı, olimpik standartlara uygun emniyet şeridi." },
    { id: 206, name: "DeepClean Profesyonel Havuz Temizlik Süpürgesi", category: "Temizlik", price: 950, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80", tag: "Pratik Ürün", moods: ["titiz", "yorgun"], aiInsight: "⚡ Önümüzdeki 5 günde fiyatı %4 artış eğiliminde görünüyor.", stok: 22, acıklama: "Vakumlu taban yapısı ve esnek fırça kılları ile havuz tabanındaki tüm tortu ve polenleri anında temizleyen profesyonel süpürge başlığı." },
    { id: 207, name: "ThermoComfort Dijital Havuz Suyu Isı Ölçer", category: "Aydınlatma", price: 420, image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80", tag: "Yeni", moods: ["teknolojik"], aiInsight: "📉 Fiyat analizine göre şu an satın almak için en ideal dönem.", stok: 30, acıklama: "Güneş enerjili kablosuz LCD ekranlı dijital termometre. Havuz suyu sıcaklığını anlık ve hassas olarak uzaktan izleme imkanı." },
    { id: 208, name: "Premium Paslanmaz Havuz Giriş Merdiveni (4 Basamak)", category: "Ekipmanlar", price: 4750, image: "https://images.unsplash.com/photo-1572331507600-664123d1115e?w=500&q=80", tag: "Lüks", moods: ["sakin"], aiInsight: "🔥 Son 3 günün en düşük fiyatı fırsatını yakalayın.", stok: 7, acıklama: "Kaymaz basamak yüzeyli, parlatılmış krom kaplama, havuz duvarına kolayca monte edilebilen rijit tasarım merdiven." },
    { id: 209, name: "Anti-Yosun Concentre Havuz Bakım Sıvısı 10 L", category: "Kimyasallar", price: 780, image: "https://images.unsplash.com/photo-1527156279143-6cd52a32c2a1?w=500&q=80", tag: "Etkili Formül", moods: ["titiz"], aiInsight: "💡 Kimyasal ürünlerde kur dalgalanması öncesi bugün almanız önerilir.", stok: 50, acıklama: "Köpürmeyen, klor ile uyumlu çalışan yüksek konsantrasyonlu yosun önleyici dezenfektan destek sıvısı." },
    { id: 210, name: "SolarTarpaulin Isı Koruyucu Temizlik Brandası", category: "Temizlik", price: 3200, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80", tag: "Çevre Dostu", moods: ["keyifli"], aiInsight: "📈 Yapay zeka talebin arttığını öngörüyor, fiyat %8 yükselebilir!", stok: 8, acıklama: "Güneş ışınlarını emerek havuz suyu sıcaklığını koruyan ve buharlaşmayı %90 oranında azaltan koruma brandası." },
    { id: 211, name: "Granül Havuz Kloru %56 Stabilizatörlü 25 KG", category: "Kimyasallar", price: 2300, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", tag: "Fırsat Ürünü", moods: ["titiz"], aiInsight: "💡 Su dezenfeksiyonu için haftalık periyotta en kararlı klor bileşiğidir.", stok: 40, acıklama: "Hızlı çözünen, kireç bırakmayan stabilizatörlü granül aktif klor. Havuz suyunun sürekli dezenfeksiyonu için idealdir." },
    { id: 212, name: "Lüks Duvar Tipi Havuz Şelalesi Perdesi", category: "Ekipmanlar", price: 15400, image: "https://images.unsplash.com/photo-1562184560-a11b7cf7c847?w=500&q=80", tag: "Özel Tasarım", moods: ["sakin", "yorgun"], aiInsight: "🌊 Mimari şelale tasarımı ortamdaki gürültüyü absorbe ederek sakinlik verir.", stok: 2, acıklama: "Modern mimari yapılara uygun ankastre gizli montaj havuz şelalesi. Doğal şelale akışı akustiği yaratır." },
    { id: 213, name: "Otomatik Havuz Dip Süpürme Robotu Klasik", category: "Temizlik", price: 34500, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80", tag: "Premium Altyapı", moods: ["teknolojik", "titiz"], aiInsight: "🤖 Yapay Zeka Öngörüsü: Rutin temizlik saatlerinde %40 enerji tasarrufu sunar.", stok: 4, acıklama: "Paletli duvar tırmanma sonar akıllı haritalama robotu. Havuzun zemin ve duvarlarını insansız temizler." },
    { id: 214, name: "Yüksek Verimli Havuz Sirkülasyon Pompası 2 HP", category: "Pompalar", price: 11200, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80", tag: "Yüksek Güç", moods: ["teknolojik"], aiInsight: "⚡ Büyük ölçekli havuz filtrasyon döngülerinde standartlara tam uyumlu.", stok: 6, acıklama: "Monoblok ön filtreli, sessiz çalışan yüksek debili sirkülasyon motoru. Tuzlu suya ve korozyona dayanıklı şaft." },
    { id: 215, name: "Sıvı Ph Düşürücü Havuz Kimyasalı 20 KG", category: "Kimyasallar", price: 690, image: "https://images.unsplash.com/photo-1527156279143-6cd52a32c2a1?w=500&q=80", tag: "Temel İhtiyaç", aiInsight: "📉 Fiyat analizine göre stabil kalma eğiliminde, güvenle stoklanabilir.", stok: 60, acıklama: "Havuz suyu pH değerini ideal 7.2 - 7.6 aralığına hızlıca çekmek için formüle edilmiş saflaştırılmış asit çözeltisi." },
    { id: 216, name: "Havuz İçi RGB Aydınlatma Trafosu Kumandalı", category: "Aydınlatma", price: 2400, image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80", tag: "Yeni Ürün", aiInsight: "💡 Uzaktan kumanda entegrasyonu ile 12V armatürlerin akıllı kontrolünü sağlar.", stok: 15, acıklama: "100W güç kapasiteli, senkronize renk değiştirme modüllü korumalı izolasyon trafosu." },
    { id: 217, name: "Havuz Suyu Parlatıcı ve Çöktürücü 10 L", category: "Kimyasallar", price: 510, image: "https://images.unsplash.com/photo-1527156279143-6cd52a32c2a1?w=500&q=80", tag: "Hızlı Etki", aiInsight: "✨ Havuz suyundaki donukluğu saniyeler içinde gidererek kristal berraklık sunar.", moods: ["titiz"], stok: 35, acıklama: "Sudaki askıda kalan mikro partikülleri topaklaştırarak filtrenin tutabileceği boyuta getiren organik topaklayıcı." },
    { id: 218, name: "Teleskobik Havuz Kepçesi Derin Tip Filtreli", category: "Temizlik", price: 680, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80", tag: "Pratik", aiInsight: "⚡ İnce gözenekli yapısı sayesinde yüzeydeki polenleri dahi kolayca yakalar.", moods: ["titiz"], stok: 25, acıklama: "Alüminyum uzama kollu gövdeye sahip, dayanıklı polimer file yapılı derin yaprak ve yüzey kepçesi." },
    { id: 219, name: "Güneş Enerjili Akıllı Havuz İyonizasyon Cihazı", category: "Ekipmanlar", price: 5400, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", tag: "Akıllı Ürün", moods: ["teknolojik"], aiInsight: "🤖 Güneş enerjisi paneli sayesinde sıfır işletme maliyeti ile koruma sağlar.", stok: 4, acıklama: "Bakır ve Gümüş iyonları salarak klor ihtiyacını %80 azaltan solar güneş enerjili ekolojik iyonizer." },
    { id: 220, name: "Geçmeli Havuz Kenar Izgara Köşe Parçası", category: "Ekipmanlar", price: 190, image: "https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=500&q=80", tag: "Yedek Parça", moods: ["sakin"], stok: 120, acıklama: "UV ışınlarına ve havuz kimyasallarına dayanıklı PP malzemeden imal edilmiş taşma kanalı kenar ızgarası." }
  ];

  useEffect(() => {
    setCart([]);
    setDbProducts(mock20Products);
    setDisplayedProducts(mock20Products);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    let filtrelenmis = dbProducts;
    if (selectedCategory !== "Hepsi") filtrelenmis = filtrelenmis.filter(p => p.category === selectedCategory);
    if (selectedMood && selectedMood !== "hepsi") filtrelenmis = filtrelenmis.filter(p => p.moods && p.moods.includes(selectedMood));

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase('tr-TR');
      filtrelenmis = filtrelenmis.filter(p => p.name.toLowerCase('tr-TR').includes(query));
    }
    setDisplayedProducts(filtrelenmis);
  }, [selectedCategory, selectedMood, searchQuery, dbProducts]);

  const addToCart = (product) => {
    if (paymentSuccess) setPaymentSuccess(false); 
    setCart([...cart, product]);
    setNotification(`✅ ${product.name} sepete eklendi!`);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault(); 
    if (!checkoutContractCheck) {
      alert("Lütfen Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme şartlarını onaylayın!");
      return;
    }
    const randomCode = "HM-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    setSimulatedOrderCode(randomCode);
    setPaymentSuccess(true); 
    setNotification("📦 PayTR Ödemesi Onaylandı! Siparişiniz Alındı.");
  };

  const clearCartAfterSuccess = () => {
    setCart([]);
    setPaymentSuccess(false);
    setActiveModal("");
    setCheckoutForm({ ad: '', soyad: '', email: '', telefon: '', sehir: '', ilce: '', postaKodu: '', acikAdres: '' });
    setCheckoutFormCheck(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setCurrentUser({ fullname: loginForm.username });
    setActiveModal("");
    setNotification(`🔑 Hoş geldin ${loginForm.username}!`);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!kvkkRegisterCheck) {
      alert("Lütfen Üyelik Sözleşmesi ve KVKK Aydınlatma Metnini onaylayın!");
      return;
    }
    setIsLoggedIn(true);
    setCurrentUser({ fullname: registerForm.fullname });
    setActiveModal("");
    setNotification(`📝 Kayıt Başarılı! Hoş geldin ${registerForm.fullname}.`);
  };

  const handleAsistanSorgu = (e) => {
    e.preventDefault();
    if (!asistanSoru) return;

    const soruLower = asistanSoru.toLowerCase('tr-TR');
    if (soruLower.includes("temiz") || soruLower.includes("robot") || soruLower.includes("süpürge") || soruLower.includes("fırça")) {
      setSearchQuery("Süpürge");
      setAsistanCevap("🤖 Akıllı Asistan: Havuz temizliği için sana harika önerilerim var! Arka plandaki mağazada 'Temizlik' kategorisindeki otomatik robot ve vakumlu süpürge sistemlerini listeledim. Havuzun zeminini pırıl pırıl yapmak için fırça modellerimizi de inceleyebilirsin.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 213));
    } else if (soruLower.includes("klor") || soruLower.includes("kimyasal") || soruLower.includes("ph") || soruLower.includes("test")) {
      setSearchQuery("Klor");
      setAsistanCevap("🤖 Akıllı Asistan: Havuz suyunun dezenfeksiyonu ve kimyasal dengesi için en ideal ürünleri listeledim. Stabilizatörlü Granül Klor ve anlık veri sunan Dijital Ölçüm Kitimizi incelemeni öneririm.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 211));
    } else if (soruLower.includes("pompa") || soruLower.includes("sirkülasyon") || soruLower.includes("devirdaim")) {
      setSearchQuery("Pompa");
      setAsistanCevap("🤖 Akıllı Asistan: Filtrasyon döngüsü için yüksek verimli 2 HP Sirkülasyon Pompasını arka planda senin için süzdüm. Sessiz ve güçlü motor altyapısına sahiptir.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 214));
    } else if (soruLower.includes("ışık") || soruLower.includes("led") || soruLower.includes("aydınlatma")) {
      setSearchQuery("LED");
      setAsistanCevap("🤖 Akıllı Asistan: Gece ambiyansı ve aydınlatma ihtiyaçların için kumandalı AquaGlow LED serimizi listeledim. Enerji tasarruflu 12V altyapıya sahiptir.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 201));
    } else if (soruLower.includes("şelale") || soruLower.includes("fıskiye")) {
      setSearchQuery("Şelale");
      setAsistanCevap("🤖 Akıllı Asistan: Harika bir mimari dokunuş! Paslanmaz çelik şelale perdesi modellerimiz arka planda listelendi. Su sesi dinginliği için mükemmel seçim.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 202));
    } else {
      setSearchQuery("");
      setAsistanCevap("🤖 Akıllı Asistan: İstediğin havuz ekipmanını yukarıdaki arama kutusuna yazarak ya da kategorilerden süzerek anında premium ürün listemiz arasından keşfedebilirsin.");
      setAsistanOnerilenUrun(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between relative antialiased">
      
      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white font-extrabold text-xs md:text-sm px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-2 border-2 border-cyan-400 max-w-md text-center">
          <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* DİNAMİK ÜRÜN DETAY MODAL EKRANI */}
      {selectedProductDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-fadeIn relative">
            <button onClick={() => setSelectedProductDetail(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-purple-900 text-white">
              <h3 className="font-black text-sm md:text-base tracking-wide flex items-center gap-2">🔍 {selectedProductDetail.name}</h3>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 rounded-2xl overflow-hidden bg-slate-100 border">
                <img src={selectedProductDetail.image} alt={selectedProductDetail.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-cyan-600 font-black text-xs uppercase block mb-1">{selectedProductDetail.category}</span>
                  <h2 className="text-xl font-black text-slate-900 leading-tight mb-2">{selectedProductDetail.name}</h2>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">{selectedProductDetail.acıklama}</p>
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-xs font-bold text-purple-900 mb-4">{selectedProductDetail.aiInsight}</div>
                  <div className="text-xs font-bold text-slate-500 mb-2">Stok Durumu: <span className="text-slate-900 font-black">{selectedProductDetail.stok} Adet</span></div>
                </div>
                <div className="border-t pt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-slate-900">₺{selectedProductDetail.price.toLocaleString('tr-TR')}</span>
                  <button onClick={() => { addToCart(selectedProductDetail); setSelectedProductDetail(null); }} className="bg-purple-600 hover:bg-cyan-500 text-white text-xs font-black px-6 py-3 rounded-xl transition-colors shadow-md uppercase">Sepete Ekle</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DİNAMİK ALTYAPI MODAL SİSTEMİ */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] relative">
            
            {subModalContent && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 p-6 overflow-y-auto animate-fadeIn flex flex-col justify-between">
                <div className="space-y-4 text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                  <div className="flex justify-between items-center border-b pb-2 mb-2">
                    <h4 className="font-black text-slate-900 text-sm uppercase">
                      {subModalContent === "iade" && "📜 e-havuzz İPTAL VE İADE KOŞULLARI"}
                      {subModalContent === "kvkk" && "📜 e-havuzz KVKK AYDINLATMA METNİ"}
                      {subModalContent === "sozlesme" && "📜 e-havuzz ÜYELİK SÖZLEŞMESİ"}
                    </h4>
                    <button type="button" onClick={() => setSubModalOpen("")} className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"><X className="w-4 h-4" /></button>
                  </div>

                  {subModalContent === "iade" && (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      <h3 className="font-bold text-slate-900">1. Taraflar</h3>
                      <p>İşbu Mesafeli Satış Sözleşmesi ("Sözleşme"), aşağıda bilgileri bulunan Satıcı ile internet sitesi üzerinden alışveriş yapan Alıcı arasında elektronik ortamda kurulmuştur.</p>
                      <p><strong>Satıcı Unvanı:</strong> e-havuzz<br/><strong>Web Sitesi:</strong> https://e-havuzz-frontend.vercel.app/<br/><strong>E-Posta:</strong> info@ehavuzz.com</p>
                      <p><strong>Alıcı:</strong> Alıcı, sipariş sırasında sisteme girmiş olduğu ad, soyad, adres, telefon ve e-posta bilgilerinin doğru olduğunu kabul eder.</p>
                      <h3 className="font-bold text-slate-900">2. Konu</h3>
                      <p>İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait internet sitesi üzerinden elektronik ortamda sipariş verdiği ürün veya hizmetin satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir.</p>
                      <h3 className="font-bold text-slate-900">3. Ürün ve Sipariş Bilgileri</h3>
                      <p>Siparişe ilişkin; ürün adı, adedi, birim fiyatı, toplam tutar, kargo ücreti, vergiler ve ödeme yöntemi onay ekranında belirtilmektedir.</p>
                      <h3 className="font-bold text-slate-900">4. Ödeme</h3>
                      <p>Alıcı, sipariş sırasında seçmiş olduğu ödeme yöntemi ile ödemeyi gerçekleştireceğini kabul eder. Ödeme işlemleri, güvenli ödeme altyapısı üzerinden gerçekleştirilmektedir. Satıcı, kredi kartı veya banka kartı bilgilerini saklamaz.</p>
                      <h3 className="font-bold text-slate-900">5. Teslimat</h3>
                      <p>Siparişler, stok durumuna bağlı olarak en kısa sürede hazırlanır and anlaşmalı kargo firması aracılığıyla teslim edilir.</p>
                      <h3 className="font-bold text-slate-900">6. Cayma Hakkı</h3>
                      <p>Alıcı, teslim aldığı ürünü 14 (on dört) gün içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin iade etme hakkına sahiptir.</p>
                      <h3 className="font-bold text-slate-900">7. Cayma Hakkının Kullanılamayacağı Durumlar</h3>
                      <p>Kullanıcının isteği doğrultusunda hazırlanan kişiye özel ürünler, ambalajı açılmış hijyen ürünleri, tek kullanımlık ürünler, hızlı bozulabilen ürünler ve ambalajı açılmış havuz kimyasallarında cayma hakkı kullanılamaz.</p>
                      <h3 className="font-bold text-slate-900">8. İade Süreci</h3>
                      <p>İade şartlarının sağlanması durumunda ürün bedeli, ödeme yapılan yöntem esas alınarak yasal süre içerisinde Alıcı'ya iade edilir.</p>
                    </div>
                  )}

                  {subModalContent === "kvkk" && (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, e-havuzz ("Şirket", "Site" veya "Veri Sorumlusu") olarak kişisel verilerinizin güvenliğine önem veriyoruz.</p>
                      <h3 className="font-bold text-slate-900">1. Veri Sorumlusu</h3>
                      <p>Şirket Adı: e-havuzz<br/>Web Sitesi: https://e-havuzz-frontend.vercel.app/<br/>E-Posta: info@ehavuzz.com</p>
                      <h3 className="font-bold text-slate-900">2. İşlenen Kişisel Veriler</h3>
                      <p>Sitemiz üzerinden işlem yaparken paylaştığınız; Ad Soyad, Telefon Numarası, E-posta Adresi, Teslimat Adresi, Fatura Bilgileri, Sipariş Bilgileri, IP Adresi ve Çerez verileri işlenmektedir.</p>
                      <h3 className="font-bold text-slate-900">3. Kişisel Verilerin İşlenme Amaçları</h3>
                      <p>Sipariş oluşturulması, ürün teslimatı, ödeme süreçlerinin yürütülmesi, müşteri destek hizmetlerinin sunulması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.</p>
                    </div>
                  )}

                  {subModalContent === "sozlesme" && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-900">e-havuzz Üyelik Şartları & Sözleşmesi</h3>
                      <p>İşbu sözleşme, e-havuzz platformuna üye olan kullanıcının haklarını, sipariş adımlarındaki sorumluluklarını ve platform kurallarını karşılıklı olarak beyan eder.</p>
                    </div>
                  )}
                </div>
                <div className="border-t pt-4 mt-4 flex justify-end">
                  <button type="button" onClick={() => setSubModalOpen("")} className="bg-slate-900 text-white font-black text-xs px-5 py-2 rounded-xl">Metni Kapat</button>
                </div>
              </div>
            )}

            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-900 via-purple-900 to-[#00b4d8] text-white">
              <h3 className="font-black text-sm md:text-base tracking-wide flex items-center gap-2">
                {activeModal === "sepet" && "🛒 Alışveriş Sepetiniz & Güvenli Ödeme Özetleri"}
                {activeModal === "login" && "🔑 Üye Girişi"}
                {activeModal === "register" && "📝 Yeni Üye Kaydı"}
                {activeModal === "blog" && "📝 E-Havuz Market Blog"}
                {activeModal === "hakkimizda" && "✨ Hakkımızda"}
                {activeModal === "kvkk" && "📜 KVKK Aydınlatma Metni"}
                {activeModal === "cerez" && "🍪 Çerez (Cookie) Politikası"}
                {activeModal === "iade" && "🔄 Mesafeli Satış & İade Şartları"}
                {activeModal === "sozlesme" && "📄 Üyelik Sözleşmesi"}
                {activeModal === "onbilgi" && "📄 Ön Bilgilendirme Formu"}
              </h3>
              <button onClick={() => { if (paymentSuccess) { clearCartAfterSuccess(); } else { setActiveModal(""); } }} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto text-slate-700 flex-1 flex flex-col justify-between">
              <div>
                
                {/* SEPET VE FORM AKIŞI */}
                {activeModal === "sepet" && (
                  <div className="text-sm">
                    {paymentSuccess ? (
                      <div className="text-center py-6 flex flex-col items-center gap-5 animate-fadeIn">
                        <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center border-2 border-cyan-400">
                          <CheckCircle className="w-8 h-8 text-cyan-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-slate-900">Siparişiniz Alındı</h2>
                          <p className="text-xs text-slate-500 font-bold mt-1">Siparişiniz başarıyla oluşturuldu. Siparişiniz en kısa sürede hazırlanacaktır.</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl w-full text-left shadow-sm max-w-md">
                          <div className="flex items-center gap-3 border-b pb-3 mb-3">
                            <div className="p-2 bg-slate-100 rounded-xl"><Truck className="w-5 h-5 text-slate-700" /></div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">Sipariş Kodu</span>
                              <span className="font-black text-sm text-slate-900">{simulatedOrderCode}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div><span className="text-[10px] text-slate-400 font-bold block">Tahmini Teslimat</span><span className="font-extrabold text-slate-800">2-4 İş Günü</span></div>
                            <div><span className="text-[10px] text-slate-400 font-bold block">Kargo Firması</span><span className="font-extrabold text-slate-800">Yurtiçi Kargo</span></div>
                            <div className="mt-1"><span className="text-[10px] text-slate-400 font-bold block">Ödeme Durumu</span><span className="font-black text-emerald-600">✓ Onaylandı</span></div>
                            <div className="mt-1"><span className="text-[10px] text-slate-400 font-bold block">Sipariş Durumu</span><span className="font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md w-fit">Hazırlanıyor</span></div>
                          </div>
                        </div>
                        <button type="button" onClick={clearCartAfterSuccess} className="w-full max-w-md bg-[#00b4d8] text-white font-black py-3.5 rounded-xl text-xs uppercase mt-2">Alışverişe Devam Et ➔</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <form onSubmit={handleOrderSubmit} className="lg:col-span-7 flex flex-col gap-4">
                          <div className="flex flex-col gap-2">
                            <h4 className="font-black text-xs text-slate-900 border-b pb-1 flex items-center gap-1.5 uppercase tracking-wide">
                              <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px]">1</span>Teslimat Adresi
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              <input type="text" required placeholder="Ad" value={checkoutForm.ad} onChange={(e) => setCheckoutForm({...checkoutForm, ad: e.target.value})} className="p-2 text-xs font-bold rounded-xl border bg-white outline-none focus:border-cyan-500" />
                              <input type="text" required placeholder="Soyad" value={checkoutForm.soyad} onChange={(e) => setCheckoutForm({...checkoutForm, soyad: e.target.value})} className="p-2 text-xs font-bold rounded-xl border bg-white outline-none focus:border-cyan-500" />
                            </div>
                            <input type="email" required placeholder="E-posta" value={checkoutForm.email} onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})} className="w-full p-2 text-xs font-bold rounded-xl border bg-white outline-none focus:border-cyan-500" />
                            <div className="grid grid-cols-2 gap-2">
                              <input type="tel" required placeholder="Telefon" value={checkoutForm.telefon} onChange={(e) => setCheckoutForm({...checkoutForm, telefon: e.target.value})} className="p-2 text-xs font-bold rounded-xl border bg-white outline-none focus:border-cyan-500" />
                              <input type="text" required placeholder="Şehir" value={checkoutForm.sehir} onChange={(e) => setCheckoutForm({...checkoutForm, sehir: e.target.value})} className="p-2 text-xs font-bold rounded-xl border bg-white outline-none focus:border-cyan-500" />
                            </div>
                            <textarea required rows="2" placeholder="Açık Adres" value={checkoutForm.acikAdres} onChange={(e) => setCheckoutForm({...checkoutForm, acikAdres: e.target.value})} className="w-full p-2 text-xs font-bold rounded-xl border bg-white outline-none focus:border-cyan-500"></textarea>
                          </div>

                          <div className="flex flex-col gap-2">
                            <h4 className="font-black text-xs text-slate-900 border-b pb-1 flex items-center gap-1.5 uppercase tracking-wide">
                              <span className="w-4 h-4 rounded-full bg-purple-900 text-white flex items-center justify-center text-[9px]">2</span>Ödeme Bilgileri
                            </h4>
                            <div className="w-full max-w-sm bg-gradient-to-br from-purple-800 via-indigo-900 to-cyan-700 p-5 rounded-2xl text-white shadow-lg flex flex-col justify-between h-36 relative overflow-hidden self-center mb-1">
                              <span className="text-[10px] font-black tracking-widest text-cyan-300">PREMIUM HAVUZ KART</span>
                              <div className="text-base font-mono tracking-widest text-slate-100">•••• •••• •••• ••••</div>
                              <div className="flex justify-between items-center text-[10px]">
                                <div><span className="text-slate-400 text-[8px] block uppercase">Kart Sahibi</span><span className="font-bold">NURAY MUTLU</span></div>
                                <div><span className="text-slate-400 text-[8px] block uppercase">AA/YY</span><span className="font-bold">12/29</span></div>
                              </div>
                            </div>

                            <input type="text" required placeholder="Kart Üzerindeki İsim" className="w-full p-2 text-xs font-bold rounded-xl border bg-white focus:border-purple-600 outline-none" />
                            <input type="text" required maxLength="16" placeholder="Kart Numarası" className="w-full p-2 text-xs font-bold rounded-xl border bg-white focus:border-purple-600 outline-none" />
                            <div className="grid grid-cols-2 gap-2">
                              <input type="text" required placeholder="MM/YY" className="p-2 text-xs font-bold rounded-xl border bg-white outline-none" />
                              <input type="text" required maxLength="3" placeholder="CVC" className="p-2 text-xs font-bold rounded-xl border bg-white outline-none" />
                            </div>

                            <div className="mt-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
                              <input type="checkbox" id="checkoutCheck" required checked={checkoutContractCheck} onChange={(e) => setCheckoutFormCheck(e.target.checked)} className="mt-0.5 rounded cursor-pointer" />
                              <label htmlFor="checkoutCheck" className="text-[11px] font-semibold text-slate-700 leading-tight cursor-pointer">
                                <span onClick={() => setSubModalOpen("iade")} className="text-purple-700 font-bold underline cursor-pointer">Mesafeli Satış Sözleşmesi</span>'ni ve Ön Bilgilendirme Formu'nu okudum, şartları kabul ediyorum.
                              </label>
                            </div>
                          </div>

                          <button type="submit" disabled={!checkoutContractCheck} className={`w-full font-black py-3.5 rounded-xl text-xs uppercase shadow-md flex items-center justify-center gap-2 transition-all ${checkoutContractCheck ? 'bg-[#00b4d8] text-white hover:bg-[#0096c7]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                            <CreditCard className="w-4 h-4" /> Siparişi Tamamla
                          </button>
                        </form>

                        <div className="lg:col-span-5 bg-slate-50 p-4 rounded-2xl border flex flex-col justify-between max-h-[460px]">
                          <div>
                            <h4 className="font-black text-xs text-slate-800 uppercase border-b pb-2 mb-3">Sipariş Özeti</h4>
                            <div className="flex flex-col gap-3 overflow-y-auto max-h-[180px]">
                              {cart.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs border-b pb-2">
                                  <div className="flex-1"><span className="font-extrabold text-slate-900 block line-clamp-1">{item.name}</span><span className="text-[10px] text-slate-400 font-bold">1 adet</span></div>
                                  <span className="font-black text-slate-900">₺{item.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="pt-3 border-t border-dashed mt-4 flex flex-col gap-1.5 text-xs font-bold text-slate-600">
                            <div className="flex justify-between"><span>Ara Toplam:</span><span>₺{sepetUrunToplam.toLocaleString('tr-TR')}</span></div>
                            <div className="flex justify-between"><span>Kargo:</span><span>{kargoUcreti === 0 ? "Ücretsiz" : `₺${kargoUcreti}`}</span></div>
                            <div className="flex justify-between items-center text-slate-900 text-sm font-black border-t pt-2 mt-1">
                              <span>Toplam:</span><span className="text-lg text-purple-700">₺{sepetToplamTutar.toLocaleString('tr-TR')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* GÜNCEL RESMÎ GİZLİLİK POLİTİKASI MODALI */}
                {activeModal === "kvkk" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 space-y-4 font-medium p-2 max-h-[65vh] overflow-y-auto">
                    <h2 className="text-sm font-black text-slate-900 uppercase">KİŞİSEL VERİLERİN KORUNMASI AYDINLATMA METNİ</h2>
                    <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, e-havuzz ("Şirket", "Site" veya "Veri Sorumlusu") olarak kişisel verilerinizin güvenliğine önem veriyoruz. Bu Aydınlatma Metni; internet sitemizi ziyaret eden kullanıcılar, üyeler ve müşteriler tarafından paylaşılan kişisel verilerin hangi amaçlarla işlendiği, nasıl korunduğu ve KVKK kapsamındaki haklarınıza ilişkin sizleri bilgilendirmek amacıyla hazırlanmıştır.</p>
                    <h3 className="font-black text-slate-900">1. Veri Sorumlusu</h3>
                    <p>6698 sayılı KVKK kapsamında veri sorumlusu;<br/><strong>Şirket Adı:</strong> e-havuzz<br/><strong>Web Sitesi:</strong> https://e-havuzz-frontend.vercel.app/<br/><strong>E-Posta:</strong> info@ehavuzz.com</p>
                    <h3 className="font-black text-slate-900">2. İşlenen Kişisel Veriler</h3>
                    <p>Sitemizi kullanmanız halinde aşağıdaki kişisel verileriniz işlenebilir: Ad Soyad, Telefon Numarası, E-posta Adresi, Teslimat Adresi, Fatura Bilgileri, Sipariş Bilgileri, IP Adresi, Tarayıcı Bilgileri, Cihaz Bilgileri, Site Kullanım Hareketleri, Çerez (Cookie) Verileri. Ödeme işlemleri sırasında banka veya kredi kartı bilgileriniz tarafımızca saklanmamaktadır.</p>
                    <h3 className="font-black text-slate-900">3. Kişisel Verilerin İşlenme Amaçları</h3>
                    <p>Toplanan kişisel veriler; sipariş oluşturulması, siparişlerin teslim edilmesi, ödeme işlemlerinin yürütülmesi, müşteri destek hizmetlerinin sunulması, üyelik işlemlerinin gerçekleştirilmesi, taleplerin değerlendirilmesi, hizmet kalitesinin artırılması, kullanıcı deneyiminin geliştirilmesi, bilgi güvenliğinin sağlanması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.</p>
                    <h3 className="font-black text-slate-900">4. Kişisel Verilerin Aktarılması</h3>
                    <p>Kişisel verileriniz; kargo firmaları, ödeme kuruluşları, muhasebe hizmet sağlayıcıları, barındırma (Hosting) hizmet sağlayıcıları, yetkili kamu kurum ve kuruluşları ile yalnızca hizmetin yürütülmesi amacıyla ve KVKK hükümlerine uygun olarak paylaşılabilir.</p>
                    <h3 className="font-black text-slate-900">5. Veri Toplama Yöntemi</h3>
                    <p>Kişisel verileriniz; Üyelik Formu, Sipariş Formu, İletişim Formu, Çerezler, Web Sitesi Kullanımı ve Elektronik Posta aracılığıyla otomatik veya kısmen otomatik yollarla elde edilmektedir.</p>
                    <h3 className="font-black text-slate-900">6. Verilerin Saklanması</h3>
                    <p>Kişisel verileriniz yalnızca işlenme amacı boyunca veya ilgili mevzuatta belirtilen süre kadar saklanmaktadır. Saklama süresi sonunda KVKK hükümlerine uygun olarak silinir, yok edilir veya anonim hale getirilir.</p>
                    <h3 className="font-black text-slate-900">7. Haklarınız</h3>
                    <p>KVKK'nın 11. maddesi kapsamında; verilerinizin işlenip işlenmediğini öğrenme, işlenen verilere erişim talep etme, eksik veya yanlış bilgilerin düzeltilmesini isteme, verilerin silinmesini talep etme, işleme faaliyetlerine itiraz etme ve kanuna aykırı işlem nedeniyle zarar oluşması halinde tazminat talep etme haklarına sahipsiniz.</p>
                    <h3 className="font-black text-slate-900">8. İletişim</h3>
                    <p>KVKK kapsamındaki taleplerinizi aşağıdaki e-posta adresi üzerinden iletebilirsiniz.<br/><strong>E-posta:</strong> info@ehavuzz.com</p>
                    <h3 className="font-black text-slate-900">9. Güncellemeler</h3>
                    <p>Bu metin gerekli görülmesi halinde güncellenebilir. Güncel sürüm internet sitemizde yayımlandığı tarihten itibaren geçerlidir.</p>
                  </div>
                )}

                {/* GÜNCEL RESMÎ ÇEREZ POLİTİKASI MODALI */}
                {activeModal === "cerez" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 space-y-4 font-medium p-2 max-h-[65vh] overflow-y-auto">
                    <h2 className="text-sm font-black text-slate-900 uppercase">ÇEREZ (COOKIE) POLİTİKASI</h2>
                    <p>Bu Çerez Politikası, e-havuzz ("Site") tarafından kullanılan çerezlerin (cookie) kullanım esaslarını açıklamak amacıyla hazırlanmıştır. Web sitemizi ziyaret ettiğinizde kullanıcı deneyimini geliştirmek, hizmetlerimizi daha verimli sunmak ve internet sitemizin güvenliğini sağlamak amacıyla çerezlerden yararlanılmaktadır. Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında hazırlanmıştır.</p>
                    <h3 className="font-black text-slate-900">Çerez Nedir?</h3>
                    <p>Çerezler (Cookies), ziyaret ettiğiniz internet siteleri tarafından tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar sayesinde internet sitesi tercihlerinizi hatırlayabilir ve size daha hızlı, güvenli ve kişiselleştirilmiş bir deneyim sunabilir.</p>
                    <h3 className="font-black text-slate-900">Hangi Çerezleri Kullanıyoruz?</h3>
                    <p><strong>Zorunlu Çerezler:</strong> Sitenin temel işlevlerini yerine getirebilmesi için gerekli çerezlerdir. Bu çerezler olmadan sayfalar arasında geçiş yapılamaz, sepet işlemleri çalışmayabilir and güvenlik doğrulamaları gerçekleştirilemez.</p>
                    <p><strong>Performans ve Analiz Çerezleri:</strong> Sayfaların kullanım yoğunluğunu ölçmek, en çok ziyaret edilen bölümleri analiz etmek ve kullanıcı deneyimini geliştirmek amacıyla anonim istatistiksel veriler toplar.</p>
                    <p><strong>İşlevsellik Çerezleri:</strong> Dil tercihinizi, görüntüleme ayarlarınızı ve daha önce yaptığınız seçimleri hatırlayarak internet sitesinin size daha kişisel bir deneyim sunmasını sağlar.</p>
                    <p><strong>Reklam ve Pazarlama Çerezleri:</strong> İlerleyen dönemlerde ilgi alanlarınıza uygun içerik sunulması ve pazarlama faaliyetlerinin geliştirilmesi amacıyla mevzuata uygun şekilde kullanılabilir.</p>
                    <h3 className="font-black text-slate-900">Çerezleri Hangi Amaçlarla Kullanıyoruz?</h3>
                    <p>Web sitesinin güvenliğini sağlamak, kullanıcı deneyimini geliştirmek, sepet bilgilerinin korunması, oturum yönetimini sağlamak, site performansını artırmak, hata kayıtlarını analiz etmek ve hizmet kalitesini geliştirmek.</p>
                    <h3 className="font-black text-slate-900">Çerezleri Nasıl Kontrol Edebilirsiniz?</h3>
                    <p>Tarayıcınızın ayarlarını kullanarak çerezleri kabul edebilir, reddedebilir, mevcut çerezleri silebilir veya çerez kullanımını sınırlandırabilirsiniz. Ancak çerezlerin devre dışı bırakılması halinde internet sitemizin bazı özellikleri beklenildiği gibi çalışmayabilir.</p>
                    <h3 className="font-black text-slate-900">Üçüncü Taraf Hizmetler</h3>
                    <p>Web sitemiz, hizmet kalitesini artırmak amacıyla üçüncü taraf servis sağlayıcılarından yararlanabilir. Bu kapsamda kullanılan hizmetler kendi gizlilik ve çerez politikalarına tabidir.</p>
                    <h3 className="font-black text-slate-900">Politika Güncellemeleri ve İletişim</h3>
                    <p>Güncel sürüm yayımlandığı tarihten itibaren geçerli olacaktır. Sorularınız için bizimle iletişime geçebilirsiniz.<br/><strong>E-posta:</strong> info@ehavuzz.com<br/><strong>Web Sitesi:</strong> https://e-havuzz-frontend.vercel.app/</p>
                  </div>
                )}

                {/* GÜNCEL RESMÎ GİZLİLİK POLİTİKASI MODALI */}
                {activeModal === "hakkimizda" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 space-y-4 font-medium p-2 max-h-[65vh] overflow-y-auto">
                    <h2 className="text-sm font-black text-slate-900 uppercase">GİZLİLİK POLİTİKASI</h2>
                    <p>e-havuzz ("Site") olarak ziyaretçilerimizin ve müşterilerimizin gizliliğine önem veriyoruz. Bu Gizlilik Politikası, internet sitemizi kullanırken paylaştığınız bilgilerin nasıl toplandığını, kullanıldığını, korunduğunu ve hangi durumlarda üçüncü kişilerle paylaşılabileceğini açıklamak amacıyla hazırlanmıştır. İnternet sitemizi kullanarak bu politikada belirtilen esasları kabul etmiş sayılırsınız.</p>
                    <h3 className="font-black text-slate-900">Toplanan Bilgiler</h3>
                    <p>Sitemizi ziyaret ettiğinizde veya sipariş oluşturduğunuzda; Ad ve soyad, E-posta adresi, Telefon numarası, Teslimat ve fatura adresi, Sipariş bilgileri, IP adresi, Tarayıcı ve cihaz bilgileri, Site kullanım hareketleri ve Çerez verileri toplanabilir. Ödeme işlemleri sırasında kullanılan banka veya kredi kartı bilgileriniz tarafımızca saklanmamaktadır.</p>
                    <h3 className="font-black text-slate-900">Bilgilerin Kullanım Amaçları</h3>
                    <p>Sipariş süreçlerinin yürütülmesi, ürün teslimatının sağlanması, müşteri hizmetlerinin sunulması, talep ve şikâyetlerin değerlendirilmesi, hesap güvenliğinin sağlanması, internet sitesinin geliştirilmesi, kullanıcı deneyiminin iyileştirilmesi, yasal yükümlülüklerin yerine getirilmesi, dolandırıcılık ve kötüye kullanımın önlenmesi.</p>
                    <h3 className="font-black text-slate-900">Bilgilerin Korunması ve Paylaşılması</h3>
                    <p>Kişisel verileriniz; ilgili mevzuat gereği yetkili kamu kurum ve kuruluşlarıyla, kargo ve lojistik hizmet sağlayıcılarıyla, ödeme hizmeti sağlayıcılarıyla, teknik altyapı ve barındırma hizmeti sunan iş ortaklarıyla yalnızca hizmetin sunulması amacıyla paylaşılabilir. Bunun dışında kişisel bilgileriniz üçüncü kişilere satılmaz veya kiralanmaz.</p>
                    <h3 className="font-black text-slate-900">Veri Saklama Süresi ve Haklar</h3>
                    <p>Kişisel bilgileriniz yalnızca işlenme amacı devam ettiği sürece veya yürürlükteki mevzuatta öngörülen süre boyunca saklanmaktadır. Kullanıcılar verilerinin işlenip işlenmediğini öğrenme, erişim talep etme ve düzeltilmesini isteme haklarına sahiptir.<br/><strong>E-posta:</strong> info@ehavuzz.com<br/><strong>Web Sitesi:</strong> https://e-havuzz-frontend.vercel.app/</p>
                  </div>
                )}

                {/* GÜNCEL RESMÎ MESAFELİ SATIŞ SÖZLEŞMESİ MODALI */}
                {activeModal === "iade" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 space-y-4 font-medium p-2 max-h-[65vh] overflow-y-auto">
                    <h2 className="text-sm font-black text-slate-900 uppercase">MESAFELİ SATIŞ SÖZLEŞMESİ</h2>
                    <h3 className="font-black text-slate-900">1. Taraflar</h3>
                    <p>İşbu Mesafeli Satış Sözleşmesi ("Sözleşme"), aşağıda bilgileri bulunan Satıcı ile internet sitesi üzerinden alışveriş yapan Alıcı arasında elektronik ortamda kurulmuştur.<br/><strong>Satıcı Unvanı:</strong> e-havuzz<br/><strong>Web Sitesi:</strong> https://e-havuzz-frontend.vercel.app/<br/><strong>E-Posta:</strong> info@ehavuzz.com<br/><strong>Alıcı:</strong> Sipariş sırasında sisteme girmiş olduğu ad, soyad, adres, telefon ve e-posta bilgilerinin doğru olduğunu kabul eder.</p>
                    <h3 className="font-black text-slate-900">2. Konu ve Ürün Bilgileri</h3>
                    <p>İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait internet sitesi üzerinden elektronik ortamda sipariş verdiği ürün veya hizmetin satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir. Ürün adı, adedi, birim fiyatı, toplam tutar, kargo ücreti ve ödeme yöntemi sipariş onay ekranında belirtilmektedir.</p>
                    <h3 className="font-black text-slate-900">4. Ödeme ve Teslimat</h3>
                    <p>Alıcı, seçmiş olduğu ödeme yöntemi ile ödemeyi gerçekleştireceğini kabul eder. Ödeme işlemleri, güvenli ödeme altyapısı üzerinden gerçekleştirilmekte olup Satıcı kart bilgilerini saklamaz. Siparişler stok durumuna bağlı olarak en kısa sürede hazırlanır ve anlaşmalı kargo firması aracılığıyla teslim edilir.</p>
                    <h3 className="font-black text-slate-900">6. Cayma Hakkı ve Kullanılamayacağı Durumlar</h3>
                    <p>Alıcı, teslim aldığı ürünü 14 (on dört) gün içerisinde herhangi bir gerekçe göstermeksizin iade etme hakkına sahiptir. Cayma hakkının kullanılabilmesi için ürünün kullanılmamış, yeniden satışa uygun ve orijinal ambalajında olması şarttır. Kullanıcının isteği doğrultusunda hazırlanan kişiye özel ürünler ve hızlı bozulabilen ürünlerde cayma hakkı kullanılamaz.</p>
                    <h3 className="font-black text-slate-900">8. Uyuşmazlıkların Çözümü</h3>
                    <p>Uyuşmazlıklarda, T.C. Ticaret Bakanlığı tarafından her yıl belirlenen parasal sınırlar dahilinde Tüketici Hakem Heyetleri, bu sınırların üzerindeki uyuşmazlıklarda ise Tüketici Mahkemeleri yetkilidir. Alıcı elektronik ortamda onay verdiği anda tüm maddeleri kabul etmiş sayılır.</p>
                  </div>
                )}

                {/* GÜNCEL RESMÎ ÖN BİLGİLENDİRME FORMU MODALI */}
                {activeModal === "onbilgi" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 space-y-4 font-medium p-2 max-h-[65vh] overflow-y-auto">
                    <h2 className="text-sm font-black text-slate-900 uppercase">ÖN BİLGİLENDİRME FORMU</h2>
                    <h3 className="font-black text-slate-900">1. Amaç ve Satıcı Bilgileri</h3>
                    <p>İşbu Ön Bilgilendirme Formu, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında, internet sitesi üzerinden sipariş veren müşterilerin satın alma işlemi öncesinde bilgilendirilmesi amacıyla hazırlanmıştır.<br/><strong>Unvan:</strong> e-havuzz<br/><strong>Web Sitesi:</strong> https://e-havuzz-frontend.vercel.app/<br/><strong>E-Posta:</strong> info@ehavuzz.com</p>
                    <h3 className="font-black text-slate-900">3. Ürün, Ödeme ve Teslimat Bilgileri</h3>
                    <p>Satın alınan ürün veya hizmete ilişkin; ürün adı, adedi, birim fiyatı, toplam satış bedeli, vergiler ve kargo ücreti sipariş ekranında gösterilmektedir. Ödeme bilgileri güvenli ödeme altyapıları üzerinden işlenir. Siparişler, stok durumuna bağlı olarak hazırlanır and anlaşmalı kargo firması aracılığıyla teslim edilir.</p>
                    <h3 className="font-black text-slate-900">6. Cayma Hakkı ve Şartları</h3>
                    <p>Tüketici, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içerisinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir. Cayma hakkının kullanılabilmesi için ürünün kullanılmamış, yeniden satışa uygun durumda bulunması and orijinal ambalajı ile birlikte gönderilmesi gerekmektedir.</p>
                    <h3 className="font-black text-slate-900">9. Uyuşmazlıkların Çözümü ve Onay</h3>
                    <p>Uyuşmazlıkların çözümünde, T.C. Ticaret Bakanlığı tarafından her yıl belirlenen parasal sınırlar dahilinde Tüketici Hakem Heyetleri, bu sınırların üzerindeki uyuşmazlıklarda ise Tüketici Mahkemeleri yetkilidir. Alıcı, siparişini tamamlamadan önce bu formu okuduğunu ve onayladığını kabul eder.</p>
                  </div>
                )}

                {activeModal === "sozlesme" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 space-y-3 font-medium p-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase">e-havuzz Üyelik Şartları & Sözleşmesi</h2>
                    <p>İşbu sözleşme, e-havuzz platformuna üye olan kullanıcının haklarını ve platform kurallarını karşılıklı olarak beyan eder. Kayıt olan her kullanıcı bu şartları kabul etmiş sayılır.</p>
                  </div>
                )}

                {activeModal === "login" && (
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 max-w-sm mx-auto p-4 bg-white rounded-2xl">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase mb-1">Kullanıcı Adı</label>
                      <input type="text" required placeholder="Kullanıcı adınızı girin" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 text-xs font-bold focus:outline-none focus:border-purple-600 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase mb-1">Şifre</label>
                      <input type="password" required placeholder="Şifrenizi girin" className="w-full p-3 rounded-xl bg-slate-50 border-2 text-xs font-bold focus:outline-none focus:border-purple-600 transition-all" />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 hover:bg-cyan-500 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all mt-2 shadow-sm">
                      Giriş Yap
                    </button>
                  </form>
                )}

                {activeModal === "blog" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-800 space-y-4 font-medium p-2">
                    <div className="bg-purple-50/70 border-2 border-purple-100 p-5 rounded-2xl max-h-[60vh] overflow-y-auto">
                      <h4 className="font-black text-purple-900 text-base mb-3">📝 React E-Ticaret Projesinin Gelişim Hikayesi</h4>
                      <p className="mb-3">Yazılım öğrenirken en büyük motivasyon kaynaklarından biri, geriye dönüp ilk satır koda baktığınızda kat ettiğiniz yolu görebilmektir. Bu proje de benim için tam olarak bunu ifade ediyor. Projeye başladığım günlerde React ekosistemi hakkında oldukça sınırlı bilgiye sahiptim. Amacım kusursuz bir uygulama geliştirmekten çok, öğrendiğim her yeni kavramı gerçek bir proje üzerinde uygulayarak ilerlemekti. Bu nedenle proje, her öğrendiğim teknolojiyle birlikte adım adım büyüdü ve zamanla gerçek bir e-ticaret uygulamasına dönüştü.</p>
                      <h5 className="font-bold text-slate-900 mt-2">İlk Adım: Backend Olmadan Çalışan Bir Prototip</h5>
                      <p className="mb-3">Başlangıç aşamasında backend geliştirme sürecine girmeden önce tamamen kullanıcı deneyimine odaklanmak istedim. Bu nedenle tüm ürün verilerini statik JSON dosyaları içerisinde tuttum. Uygulamanın durum yönetimi React Context API kullanılarak global state mantığıyla oluşturuldu. Böylece backend bağımlılığı olmadan çalışan, ürün listeleme, ürün detay görüntüleme ve sepet işlemlerini gerçekleştirebilen tamamen işlevsel bir prototip ortaya çıktı.</p>
                      <h5 className="font-bold text-slate-900 mt-2">Neden React + Vite?</h5>
                      <p className="mb-3">Projeyi geliştirirken hızlı derleme süresi ve sade yapı sunması nedeniyle Vite tercih ettim. Sayfalar arasında geçişleri yönetebilmek için react-router-dom kütüphanesini projeye ekledim. Böylece uygulama modern bir Single Page Application (SPA) mimarisine dönüştü.</p>
                      <h5 className="font-bold text-slate-900 mt-2">Dinamik Routing Yapısını Kurmak</h5>
                      <p className="mb-3">İlerleyen aşamalarda BrowserRouter, Routes ve Route bileşenlerini kullanarak tüm sayfa akışını yeniden tasarladım. Özellikle ürün detay sayfasında kullanılan /product/ yapısı sayesinde her ürün tek bir bileşen üzerinden dinamik olarak görüntülenebilir hale geldi. Bu yapı projenin ölçeklenebilirliğini önemli ölçüde artırdı.</p>
                      <h5 className="font-bold text-slate-900 mt-2">Responsive Ürün Listeleme</h5>
                      <p className="mb-3">Kullanıcı deneyiminin yalnızca masaüstü değil mobil cihazlarda da iyi olması gerektiğini fark ettim. Bu nedenle ürün listeleme ekranını CSS Grid yapısındaki repeat(auto-fill, minmax(250px, 1fr)) mimarisiyle yeniden oluşturdum. Ürün kartları JavaScript'in map() fonksiyonu kullanılarak dinamik şekilde üretildi ve tamamen responsive bir görünüm elde edildi.</p>
                      <h5 className="font-bold text-slate-900 mt-2">Prop Drilling Yerine Context API</h5>
                      <p className="mb-3">Proje büyümeye başladıkça componentler arasında sürekli veri taşımak zorlaşmaya başladı. Bu problemi çözmek için React Context API kullandım. CartProvider yapısı sayesinde; sepete ürün ekleme, ürün silme, miktar artırma ve toplam tutar hesaplama gibi işlemler merkezi state üzerinden yönetilmeye başlandı. Bu değişiklik kod okunabilirliğini ciddi şekilde artırdı.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER VE ARAMA BARI */}
      <div>
        <div className="bg-slate-900 text-white text-[11px] font-bold py-2 px-6 flex justify-between items-center tracking-wide">
          <span>✦ 1000₺ Üzeri Alışverişlerde Ücretsiz Kargo</span>
          <span className="text-cyan-400 font-black">{isLoggedIn ? `● Oturum Açık` : "● Standart Mod"}</span>
        </div>

        <header className="bg-white shadow-md sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row justify-between items-center border-b-2 border-cyan-100 gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white p-2.5 rounded-xl font-black text-xl shadow-md">HM</div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">Havuz<span className="text-cyan-500">Market</span></h1>
              <p className="text-[10px] text-purple-700 font-black uppercase tracking-widest">Premium Altyapı</p>
            </div>
          </div>

          <div className="flex-1 max-w-lg w-full relative">
            <div className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Örn: led lamba, şelale, klor, pompa..." className="w-full pl-5 pr-12 py-3 border-2 border-slate-300 rounded-full focus:outline-none focus:border-cyan-500 bg-slate-50 font-bold text-sm shadow-inner" />
              <Search className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-3 text-sm shrink-0">
            <button type="button" onClick={() => setActiveModal("login")} className="text-slate-700 hover:text-purple-700 font-extrabold border-2 border-slate-200 px-4 py-2 rounded-xl bg-slate-50 text-xs">Giriş Yap</button>
            <button type="button" onClick={() => setActiveModal("register")} className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-extrabold text-xs">Üye Ol</button>
            <button type="button" onClick={() => { setActiveModal("sepet"); }} className="px-4 py-2 rounded-xl font-black border border-purple-600 bg-white text-purple-700 text-xs">📋 Sipariş Sorgula</button>

            <div onClick={() => setActiveModal("sepet")} className="relative cursor-pointer text-slate-800 hover:text-purple-700 bg-slate-100 p-2.5 rounded-xl border-2 shadow-sm">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border border-white">{cart.length}</span>}
            </div>
          </div>
        </header>

        {/* ASİSTAN ALANI */}
        <div className="max-w-[1400px] mx-auto px-6 mt-6">
          <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-[#00b4d8] p-6 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between shadow-2xl border-2 border-purple-500/40 relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-4 md:mb-0 w-full flex-1">
              <div className="bg-gradient-to-br from-amber-400 to-purple-600 p-3 rounded-2xl shadow-lg shrink-0"><Sparkles className="w-6 h-6 text-white" /></div>
              <div className="flex flex-col gap-2 w-full ml-1">
                <h4 className="font-black text-base tracking-wide text-white">Akıllı Havuz Asistanı: Size nasıl yardımcı olabilirim?</h4>
                <form onSubmit={handleAsistanSorgu} className="flex gap-2 w-full max-w-xl">
                  <input type="text" value={asistanSoru} onChange={(e) => setAsistanSoru(e.target.value)} placeholder="Temizlik, Klor, Pompa, Led, Şelale..." className="flex-1 px-4 py-2 rounded-xl text-slate-900 font-bold text-xs bg-white/90 focus:bg-white outline-none border border-cyan-300" />
                  <button type="submit" className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-black text-xs uppercase transition-transform transform active:scale-95 shrink-0">Sorgula</button>
                </form>
                {asistanCevap && (
                  <div className="bg-slate-950/80 border border-cyan-500/50 p-3 rounded-xl text-xs font-bold text-cyan-300 leading-relaxed mt-1 animate-fadeIn max-w-2xl">
                    <p className="mb-2">{asistanCevap}</p>
                    {asistanOnerilenUrun && (
                      <div className="bg-white/10 p-2 rounded-lg flex items-center justify-between gap-3 border border-white/10">
                        <span className="font-extrabold text-white text-xs line-clamp-1">{asistanOnerilenUrun.name} - ₺{asistanOnerilenUrun.price}</span>
                        <button type="button" onClick={() => addToCart(asistanOnerilenUrun)} className="bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-md uppercase tracking-wider shrink-0">Sepete Ekle</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RE-DESIGN VİTRİN */}
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <section className="bg-gradient-to-r from-slate-900 via-purple-950 to-[#03045e] text-white py-10 px-6 rounded-3xl text-center shadow-xl mb-8 border-b-4 border-cyan-500">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Bugün modunuz nasıl?</h2>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {[{ id: "yorgun", label: "Yorgunum 💆‍♂️", color: "bg-amber-500" }, { id: "titiz", label: "Titizim ✨", color: "bg-emerald-500" }, { id: "teknolojik", label: "Teknolojik 🤖", color: "bg-purple-500" }, { id: "sakin", label: "Sakinlik 🌊", color: "bg-blue-500" }, { id: "hepsi", label: "Hepsi", color: "bg-slate-600" }].map(mood => (
                  <button key={mood.id} onClick={() => setSelectedMood(mood.id)} className={`px-4 py-2 rounded-full text-xs font-black shadow-md ${selectedMood === mood.id ? 'ring-4 ring-white scale-105 ' + mood.color : 'bg-white/10 text-white'}`}>{mood.label}</button>
                ))}
              </div>
            </section>

            <div className="bg-white p-5 rounded-2xl shadow-md border-2 border-slate-200 mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-800 mr-2 flex items-center gap-1 uppercase tracking-wide"><Filter className="w-4 h-4 text-purple-700" /> Kategori Seçin:</span>
              {["Hepsi", "Kimyasallar", "Temizlik", "Aydınlatma", "Ekipmanlar", "Pompalar"].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-black border-2 ${selectedCategory === cat ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>{cat}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-slate-200 flex flex-col justify-between group">
                  <div className="relative">
                    <span className="absolute top-2 left-2 bg-purple-700 text-white text-[10px] font-black px-2 py-1 rounded-md z-10 uppercase">{product.tag}</span>
                    <div className="h-48 overflow-hidden bg-slate-100 border-b">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-cyan-600 font-black text-[11px] tracking-wider uppercase block mb-1">{product.category}</span>
                      <h4 className="font-extrabold text-slate-900 text-sm line-clamp-2 min-h-[40px] leading-tight">{product.name}</h4>
                      <div className="mt-3 bg-cyan-50 border border-cyan-200 p-2.5 rounded-xl text-[11px] font-bold text-cyan-900 leading-relaxed">{product.aiInsight}</div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4 border-t pt-3 border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-slate-900">₺{product.price.toLocaleString('tr-TR')}</span>
                        <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Stok: {product.stok}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button type="button" onClick={() => setSelectedProductDetail(product)} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-black py-2 rounded-xl uppercase flex items-center justify-center gap-1 transition-colors border shadow-sm">
                          <Eye className="w-3.5 h-3.5" /> İncele
                        </button>
                        <button type="button" onClick={() => addToCart(product)} className="bg-purple-600 hover:bg-cyan-500 text-white text-[11px] font-black py-2 rounded-xl transition-colors shadow-md uppercase">
                          Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="w-full lg:w-64 bg-white p-4 rounded-3xl shadow-md border-2 border-slate-200 h-fit sticky top-24">
            <h4 className="font-black text-xs text-center text-purple-700 uppercase mb-4 pb-2 border-b-2">Hızlı İşlemler</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActiveModal("blog")} className="flex items-center gap-3 p-3 rounded-xl text-xs font-black text-slate-700 border hover:bg-purple-50 w-full text-left"><FileText className="w-4 h-4 text-purple-600" /> Blog Yazıları</button>
              <button onClick={() => setActiveModal("hakkimizda")} className="flex items-center gap-3 p-3 rounded-xl text-xs font-black text-slate-700 border hover:bg-cyan-50 w-full text-left"><HelpCircle className="w-4 h-4 text-cyan-500" /> Hakkımızda</button>
            </div>
          </aside>
        </div>
      </div>

      {/* YASAL KURALLARA TAM UYUMLU GÜNCEL KATEGORİZE FOOTER ALANI */}
      <footer className="bg-slate-950 text-slate-300 mt-16 border-t-4 border-purple-600">
        <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white p-2 rounded-lg font-black text-sm">HM</div>
              <h4 className="text-white font-black text-sm">Havuz Market</h4>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">Türkiye'nin premium havuz ekipmanları platformu. 2010'dan bu yana güvenilir hizmet, yetkili servis ağı ve uzman müşteri desteği.</p>
          </div>
          <div>
            <h5 className="text-white font-black text-xs uppercase tracking-wider mb-3">Kategoriler</h5>
            <ul className="space-y-2 font-semibold text-slate-400">
              <li onClick={() => setSelectedCategory("Hepsi")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Tüm Ürünler</li>
              <li onClick={() => setSelectedCategory("Kimyasallar")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Havuz Kimyasalları</li>
              <li onClick={() => setSelectedCategory("Pompalar")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Havuz Pompaları</li>
              <li onClick={() => setSelectedCategory("Aydınlatma")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Havuz Aydınlatmaları</li>
            </ul>
          </div>

          {/* GÜNCEL BAŞLIK VE TİKSİZ LİNKLER PANELİ */}
          <div>
            <h5 className="text-white font-black text-xs uppercase tracking-wider mb-3">Kurumsal & Yaşam</h5>
            <ul className="space-y-2 font-semibold text-slate-400">
              <li onClick={() => setActiveModal("hakkimizda")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Gizlilik Politikası</li>
              <li onClick={() => setActiveModal("cerez")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Çerez (Cookie) Politikası</li>
              <li onClick={() => setActiveModal("iade")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Mesafeli Satış Sözleşmesi</li>
              <li onClick={() => setActiveModal("onbilgi")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Ön Bilgilendirme Formu</li>
              <li onClick={() => setActiveModal("iade")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ İade ve İptal Politikası</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-black text-xs uppercase tracking-wider mb-3">İletişim</h5>
            <ul className="space-y-2 font-semibold text-slate-400">
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-400" /> Savaş Mahallesi, İskenderun / Hatay, Türkiye</li>
              <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 shrink-0 text-cyan-400" /> info@ehavuzz.com</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-950 text-center py-4 text-[11px] text-slate-500 border-t border-slate-900 font-bold">&copy; 2026 HavuzMarket. Tüm Hakları Saklıdır. Powered by ARPETA</div>
      </footer>

      {/* ÇEREZ BANNERI */}
      {cookieBannerOpen && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-slate-900 text-white p-5 rounded-2xl shadow-2xl z-50 border-2 border-cyan-400 animate-slideUp flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Cookie className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h5 className="font-black text-xs uppercase tracking-wider">🍪 Çerez (Cookie) İzin Yönetimi</h5>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
            e-havuzz olarak, sitemizdeki kullanıcı deneyimini iyileştirmek, sayfalarımızı optimize etmek ve ilgi alanlarınıza göre kişiselleştirilmiş reklamlar sunabilmek adına zorunlu, analitik ve pazarlama çerezleri kullanıyoruz. Çerezler hakkında detaylı bilgiye <span onClick={() => setActiveModal("cerez")} className="text-cyan-400 underline font-bold cursor-pointer">Çerez Politikası</span> metnimizden ulaşabilirsiniz.
          </p>
          <div className="flex gap-2 text-[10px] font-black uppercase mt-1">
            <button onClick={() => setCookieBannerOpen(false)} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-slate-950 py-2 rounded-lg transition-colors">Hepsini Kabul Et</button>
            <button onClick={() => setCookieBannerOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg transition-colors">Reddet</button>
            <button onClick={() => { setActiveModal("cerez"); }} className="flex-1 text-slate-400 underline text-center font-bold">Çerez Ayarları</button>
          </div>
        </div>
      )}

    </div>
  );
}