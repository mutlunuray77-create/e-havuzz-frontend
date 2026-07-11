import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, HelpCircle, FileText, Truck, Mail, MapPin, Sparkles, Filter, CheckCircle, X, LogIn, UserPlus, ArrowLeft, CreditCard, Cookie, Eye } from 'lucide-react';

// Ürün Datasini State Çakışmalarını Önlemek İçin Bileşen Dışına Sabitliyoruz
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

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [searchQuery, setSearchQuery] = useState(""); 
  
  // State Doğrudan Veri İle Başlatılarak Render Kaybı (Beyaz Ekran/Boş Vitrin) Önlendi
  const [dbProducts] = useState(mock20Products); 
  const [displayedProducts, setDisplayedProducts] = useState(mock20Products);
  
  const [notification, setNotification] = useState("");
  const [activeModal, setActiveModal] = useState(""); 
  const [asistanSoru, setAsistanSoru] = useState("");
  const [asistanCevap, setAsistanCevap] = useState("");
  const [asistanOnerilenUrun, setAsistanOnerilenUrun] = useState(null);

  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [subModalContent, setSubModalOpen] = useState("");

  const [cookieBannerOpen, setCookieBannerOpen] = useState(true); 
  const [kvkkRegisterCheck, setKvkkRegisterCheck] = useState(false); 
  const [commercialIletiCheck, setCommercialIletiCheck] = useState(false); 
  const [checkoutContractCheck, setCheckoutFormCheck] = useState(false); 

  const [checkoutForm, setCheckoutForm] = useState({
    ad: '', soyad: '', email: '', telefon: '', sehir: '', ilce: '', postaKodu: '', acikAdres: ''
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ fullname: '', city: '', phone: '', email: '', tcNo: '' });
  
  const [simulatedOrderCode, setSimulatedOrderCode] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
      setAsistanCevap("🤖 Akıllı Asistan: Havuz temizliği için sana harika önerilerim var! Arka plandaki mağazada 'Temizlik' kategorisindeki otomatik robot ve vakumlu süpürge sistemlerini listeledim.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 213));
    } else if (soruLower.includes("klor") || soruLower.includes("kimyasal") || soruLower.includes("ph") || soruLower.includes("test")) {
      setSearchQuery("Klor");
      setAsistanCevap("🤖 Akıllı Asistan: Havuz suyunun dezenfeksiyonu ve kimyasal dengesi için en ideal ürünleri listeledim. Stabilizatörlü Granül Klor ve anlık veri sunan Dijital Ölçüm Kitimizi incelemeni öneririm.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 211));
    } else {
      setSearchQuery("");
      setAsistanCevap("🤖 Akıllı Asistan: İstediğin havuz ekipmanını yukarıdaki arama kutusuna yazarak ya da kategorilerden süzerek anında premium ürün listemiz arasından keşfedebilirsin.");
      setAsistanOnerilenUrun(null);
    }
  };

  const sepetUrunToplam = cart.reduce((sum, item) => sum + item.price, 0);
  const kargoUcreti = sepetUrunToplam >= 1000 ? 0 : 75;
  const sepetToplamTutar = sepetUrunToplam + kargoUcreti;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between relative antialiased">
      
      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white font-extrabold text-xs md:text-sm px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-2 border-2 border-cyan-400 max-w-md text-center">
          <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* DİNAMİK ÜRÜN DETAY MODALI */}
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

      {/* DİNAMİK ANA MODAL SİSTEMİ */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] relative">
            
            {/* SEPET/SİPARİŞ İÇİ SÖZLEŞME AÇMA ALANI (ALT MODAL) */}
            {subModalContent && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 p-6 overflow-y-auto animate-fadeIn flex flex-col justify-between">
                <div className="space-y-4 text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                  <div className="flex justify-between items-center border-b pb-2 mb-2">
                    <h4 className="font-black text-slate-900 text-sm uppercase">
                      {subModalContent === "iade" && "📜 MESAFELİ SATIŞ SÖZLEŞMESİ"}
                      {subModalContent === "kvkk" && "📜 KVKK AYDINLATMA METNİ"}
                      {subModalContent === "sozlesme" && "📜 ÜYELİK SÖZLEŞMESİ"}
                    </h4>
                    <button type="button" onClick={() => setSubModalOpen("")} className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"><X className="w-4 h-4" /></button>
                  </div>
                  {subModalContent === "iade" && (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      <h3 className="font-bold text-slate-900">1. Taraflar</h3>
                      <p>İşbu Mesafeli Satış Sözleşmesi ("Sözleşme"), aşağıda bilgileri bulunan Satıcı ile internet sitesi üzerinden alışveriş yapan Alıcı arasında elektronik ortamda kurulmuştur.</p>
                      <h3 className="font-bold text-slate-900">6. Cayma Hakkı</h3>
                      <p>Alıcı, teslim aldığı ürünü 14 (on dört) gün içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin iade etme hakkına sahiptir.</p>
                    </div>
                  )}
                  {subModalContent === "kvkk" && (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, e-havuzz ("Şirket", "Site" veya "Veri Sorumlusu") olarak kişisel verilerinizin güvenliğine önem veriyoruz.</p>
                      <h3 className="font-bold text-slate-900">3. Kişisel Verilerin İşlenme Amaçları</h3>
                      <p>Sipariş oluşturulması, teslim edilmesi ve ödeme işlemlerinin yürütülmesi amaçlarıyla işlenmektedir.</p>
                    </div>
                  )}
                  {subModalContent === "sozlesme" && (
                    <p>İşbu sözleşme, e-havuzz platformuna üye olan kullanıcının haklarını, sipariş adımlarındaki sorumluluklarını ve platform kurallarını beyan eder.</p>
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
                {activeModal === "kargo" && "🚚 Kargo Takip Sistem Kayıtları"}
                {activeModal === "kvkk_long" && "📜 KVKK Aydınlatma Metni"}
                {activeModal === "privacy_long" && "📜 Gizlilik Politikası"}
                {activeModal === "cerez_long" && "🍪 Çerez (Cookie) Politikası"}
                {activeModal === "ms_long" && "📄 Mesafeli Satış Sözleşmesi"}
                {activeModal === "onbilgi_long" && "📄 Ön Bilgilendirme Formu"}
              </h3>
              <button onClick={() => { if (paymentSuccess) { clearCartAfterSuccess(); } else { setActiveModal(""); } }} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto text-slate-700 flex-1 flex flex-col justify-between">
              <div>
                
                {/* 1. KVKK AYDINLATMA METNİ (EKSİKSİZ, UZUN) */}
                {activeModal === "kvkk_long" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 font-medium">
                    <h2 className="text-sm font-black text-slate-900 uppercase mb-2">KİŞİSEL VERİLERİN KORUNMASI AYDINLATMA METNİ</h2>
                    <p className="mb-4">6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, e-havuzz ("Şirket", "Site" veya "Veri Sorumlusu") olarak kişisel verilerinizin güvenliğine önem veriyoruz. Bu Aydınlatma Metni; internet sitemizi ziyaret eden kullanıcılar, üyeler ve müşteriler tarafından paylaşılan kişisel verilerin hangi amaçlarla işlendiği, nasıl korunduğu ve KVKK kapsamındaki haklarınıza ilişkin sizleri bilgilendirmek amacıyla hazırlanmıştır.</p>
                    
                    <h3 className="font-bold text-slate-900 mt-4 mb-2">1. Veri Sorumlusu</h3>
                    <p className="mb-2">6698 sayılı KVKK kapsamında veri sorumlusu;</p>
                    <ul className="list-none mb-4">
                      <li><strong>Şirket Adı:</strong> e-havuzz</li>
                      <li><strong>Web Sitesi:</strong> https://e-havuzz-frontend.vercel.app/</li>
                      <li><strong>E-Posta:</strong> info@ehavuzz.com</li>
                    </ul>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">2. İşlenen Kişisel Veriler</h3>
                    <p className="mb-2">Sitemizi kullanmanız halinde aşağıdaki kişisel verileriniz işlenebilir.</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Ad Soyad</li>
                      <li>Telefon Numarası</li>
                      <li>E-posta Adresi</li>
                      <li>Teslimat Adresi</li>
                      <li>Fatura Bilgileri</li>
                      <li>Sipariş Bilgileri</li>
                      <li>IP Adresi</li>
                      <li>Tarayıcı Bilgileri</li>
                      <li>Cihaz Bilgileri</li>
                      <li>Site Kullanım Hareketleri</li>
                      <li>Çerez (Cookie) Verileri</li>
                    </ul>
                    <p className="mb-4">Ödeme işlemleri sırasında banka veya kredi kartı bilgileriniz tarafımızca saklanmamaktadır.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">3. Kişisel Verilerin İşlenme Amaçları</h3>
                    <p className="mb-2">Toplanan kişisel veriler;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Sipariş oluşturulması</li>
                      <li>Siparişlerin teslim edilmesi</li>
                      <li>Ödeme işlemlerinin yürütülmesi</li>
                      <li>Müşteri destek hizmetlerinin sunulması</li>
                      <li>Üyelik işlemlerinin gerçekleştirilmesi</li>
                      <li>Taleplerin değerlendirilmesi</li>
                      <li>Hizmet kalitesinin artırılması</li>
                      <li>Kullanıcı deneyiminin geliştirilmesi</li>
                      <li>Bilgi güvenliğinin sağlanması</li>
                      <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                    </ul>
                    <p className="mb-4">amaçlarıyla işlenmektedir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">4. Kişisel Verilerin Aktarılması</h3>
                    <p className="mb-2">Kişisel verileriniz;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Kargo firmaları</li>
                      <li>Ödeme kuruluşları</li>
                      <li>Muhasebe hizmet sağlayıcıları</li>
                      <li>Barındırma (Hosting) hizmet sağlayıcıları</li>
                      <li>Yetkili kamu kurum ve kuruluşları</li>
                    </ul>
                    <p className="mb-4">ile yalnızca hizmetin yürütülmesi amacıyla ve KVKK hükümlerine uygun olarak paylaşılabilir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">5. Veri Toplama Yöntemi</h3>
                    <p className="mb-2">Kişisel verileriniz;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Üyelik Formu</li>
                      <li>Sipariş Formu</li>
                      <li>İletişim Formu</li>
                      <li>Çerezler</li>
                      <li>Web Sitesi Kullanımı</li>
                      <li>Elektronik Posta</li>
                    </ul>
                    <p className="mb-4">aracılığıyla otomatik veya kısmen otomatik yollarla elde edilmektedir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">6. Verilerin Saklanması</h3>
                    <p className="mb-4">Kişisel verileriniz yalnızca işlenme amacı boyunca veya ilgili mevzuatta belirtilen süre kadar saklanmaktadır. Saklama süresi sonunda KVKK hükümlerine uygun olarak silinir, yok edilir veya anonim hale getirilir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">7. Haklarınız</h3>
                    <p className="mb-2">KVKK'nın 11. maddesi kapsamında;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
                      <li>İşlenen verilere erişim talep etme</li>
                      <li>Eksik veya yanlış bilgilerin düzeltilmesini isteme</li>
                      <li>Verilerin silinmesini talep etme</li>
                      <li>İşleme faaliyetlerine itiraz etme</li>
                      <li>Kanuna aykırı işlem nedeniyle zarar oluşması halinde tazminat talep etme</li>
                    </ul>
                    <p className="mb-4">haklarına sahipsiniz.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">8. İletişim</h3>
                    <p className="mb-4">KVKK kapsamındaki taleplerinizi aşağıdaki e-posta adresi üzerinden iletebilirsiniz.<br/><strong>E-posta:</strong> info@ehavuzz.com</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">9. Güncellemeler</h3>
                    <p>Bu metin gerekli görülmesi halinde güncellenebilir. Güncel sürüm internet sitemizde yayımlandığı tarihten itibaren geçerlidir.</p>
                  </div>
                )}

                {/* 2. ÇEREZ POLİTİKASI (EKSİKSİZ, UZUN) */}
                {activeModal === "cerez_long" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 font-medium">
                    <h2 className="text-sm font-black text-slate-900 uppercase mb-2">ÇEREZ (COOKIE) POLİTİKASI</h2>
                    <p className="mb-4">Bu Çerez Politikası, e-havuzz ("Site") tarafından kullanılan çerezlerin (cookie) kullanım esaslarını açıklamak amacıyla hazırlanmıştır. Web sitemizi ziyaret ettiğinizde kullanıcı deneyimini geliştirmek, hizmetlerimizi daha verimli sunmak ve internet sitemizin güvenliğini sağlamak amacıyla çerezlerden yararlanılmaktadır. Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında hazırlanmıştır.</p>
                    
                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Çerez Nedir?</h3>
                    <p className="mb-4">Çerezler (Cookies), ziyaret ettiğiniz internet siteleri tarafından tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar sayesinde internet sitesi tercihlerinizi hatırlayabilir ve size daha hızlı, güvenli ve kişiselleştirilmiş bir deneyim sunabilir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Hangi Çerezleri Kullanıyoruz?</h3>
                    <p className="mb-2">Web sitemizde aşağıdaki çerez türleri kullanılabilir.</p>
                    <p className="font-bold text-slate-800">Zorunlu Çerezler</p>
                    <p className="mb-2">Sitenin temel işlevlerini yerine getirebilmesi için gerekli çerezlerdir. Bu çerezler olmadan;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Sayfalar arasında geçiş yapılamaz.</li>
                      <li>Sepet işlemleri çalışmayabilir.</li>
                      <li>Güvenlik doğrulamaları gerçekleştirilemez.</li>
                    </ul>
                    <p className="mb-4">Bu çerezlerin devre dışı bırakılması sitenin bazı bölümlerinin düzgün çalışmamasına neden olabilir.</p>
                    
                    <p className="font-bold text-slate-800">Performans ve Analiz Çerezleri</p>
                    <p className="mb-2">Bu çerezler;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Sayfaların kullanım yoğunluğunu ölçmek,</li>
                      <li>En çok ziyaret edilen bölümleri analiz etmek,</li>
                      <li>Performans sorunlarını tespit etmek,</li>
                      <li>Kullanıcı deneyimini geliştirmek</li>
                    </ul>
                    <p className="mb-4">amacıyla anonim istatistiksel veriler toplar. Bu bilgiler kişisel kimliğinizi doğrudan belirlemez.</p>

                    <p className="font-bold text-slate-800">İşlevsellik Çerezleri</p>
                    <p className="mb-2">Bu çerezler;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Dil tercihinizi,</li>
                      <li>Görüntüleme ayarlarınızı,</li>
                      <li>Daha önce yaptığınız seçimleri</li>
                    </ul>
                    <p className="mb-4">hatırlayarak internet sitesinin size daha kişisel bir deneyim sunmasını sağlar.</p>

                    <p className="font-bold text-slate-800">Reklam ve Pazarlama Çerezleri</p>
                    <p className="mb-2">İlerleyen dönemlerde kullanılabilecek reklam ve pazarlama çerezleri;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>İlgi alanlarınıza uygun içerik sunulması,</li>
                      <li>Reklam performansının ölçülmesi,</li>
                      <li>Pazarlama faaliyetlerinin geliştirilmesi</li>
                    </ul>
                    <p className="mb-4">amacıyla kullanılabilir. Bu tür çerezler yalnızca gerekli durumlarda ve yürürlükteki mevzuata uygun şekilde kullanılacaktır.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Çerezleri Hangi Amaçlarla Kullanıyoruz?</h3>
                    <p className="mb-2">Çerezler aşağıdaki amaçlarla kullanılmaktadır.</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Web sitesinin güvenliğini sağlamak</li>
                      <li>Kullanıcı deneyimini geliştirmek</li>
                      <li>Sepet bilgilerinin korunması</li>
                      <li>Oturum yönetimini sağlamak</li>
                      <li>Site performansını artırmak</li>
                      <li>Hata kayıtlarını analiz etmek</li>
                      <li>Hizmet kalitesini geliştirmek</li>
                    </ul>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Çerezleri Nasıl Kontrol Edebilirsiniz?</h3>
                    <p className="mb-2">Tarayıcınızın ayarlarını kullanarak;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Çerezleri kabul edebilir,</li>
                      <li>Reddedebilir,</li>
                      <li>Mevcut çerezleri silebilir,</li>
                      <li>Belirli internet siteleri için çerez kullanımını sınırlandırabilirsiniz.</li>
                    </ul>
                    <p className="mb-4">Ancak çerezlerin devre dışı bırakılması halinde internet sitemizin bazı özellikleri beklenildiği gibi çalışmayabilir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Üçüncü Taraf Hizmetler</h3>
                    <p className="mb-4">Web sitemiz, hizmet kalitesini artırmak amacıyla üçüncü taraf servis sağlayıcılarından yararlanabilir. Bu kapsamda kullanılan hizmetler kendi gizlilik ve çerez politikalarına tabidir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Politika Güncellemeleri</h3>
                    <p className="mb-4">Bu Çerez Politikası, yürürlükteki mevzuat veya internet sitemizde yapılan güncellemeler doğrultusunda değiştirilebilir. Güncel sürüm yayımlandığı tarihten itibaren geçerli olacaktır.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">İletişim</h3>
                    <p>Çerez Politikası hakkında sorularınız veya talepleriniz için bizimle iletişime geçebilirsiniz.<br/><strong>e-posta:</strong> info@ehavuzz.com<br/><strong>Web Sitesi:</strong> https://e-havuzz-frontend.vercel.app/</p>
                  </div>
                )}

                {/* 3. MESAFELİ SATIŞ SÖZLEŞMESİ (EKSİKSİZ, UZUN) */}
                {activeModal === "ms_long" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 font-medium">
                    <h2 className="text-sm font-black text-slate-900 uppercase mb-2">MESAFELİ SATIŞ SÖZLEŞMESİ</h2>
                    
                    <h3 className="font-bold text-slate-900 mt-4 mb-2">1. Taraflar</h3>
                    <p className="mb-4">İşbu Mesafeli Satış Sözleşmesi ("Sözleşme"), aşağıda bilgileri bulunan Satıcı ile internet sitesi üzerinden alışveriş yapan Alıcı arasında elektronik ortamda kurulmuştur.</p>
                    <p className="font-bold text-slate-800">Satıcı</p>
                    <ul className="list-none mb-4">
                      <li><strong>Unvan:</strong> e-havuzz</li>
                      <li><strong>Web Sitesi:</strong> https://e-havuzz-frontend.vercel.app/</li>
                      <li><strong>E-Posta:</strong> info@ehavuzz.com</li>
                    </ul>
                    <p className="font-bold text-slate-800">Alıcı</p>
                    <p className="mb-4">Alıcı, sipariş sırasında sisteme girmiş olduğu ad, soyad, adres, telefon ve e-posta bilgilerinin doğru olduğunu kabul eder.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">2. Konu</h3>
                    <p className="mb-4">İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait internet sitesi üzerinden elektronik ortamda sipariş verdiği ürün veya hizmetin satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">3. Ürün ve Sipariş Bilgileri</h3>
                    <p className="mb-2">Siparişe ilişkin;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Ürün adı</li>
                      <li>Ürün adedi</li>
                      <li>Birim fiyatı</li>
                      <li>Toplam tutar</li>
                      <li>Kargo ücreti</li>
                      <li>Vergiler</li>
                      <li>Ödeme yöntemi</li>
                    </ul>
                    <p className="mb-4">sipariş onay ekranında ve sipariş özetinde belirtilmektedir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">4. Ödeme</h3>
                    <p className="mb-4">Alıcı, sipariş sırasında seçmiş olduğu ödeme yöntemi ile ödemeyi gerçekleştireceğini kabul eder. Ödeme işlemleri, güvenli ödeme altyapısı üzerinden gerçekleştirilmektedir. Satıcı, kredi kartı veya banka kartı bilgilerini saklamaz.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">5. Teslimat</h3>
                    <p className="mb-4">Siparişler, stok durumuna bağlı olarak en kısa sürede hazırlanır ve anlaşmalı kargo firması aracılığıyla teslim edilir. Teslimat süresi; ürünün niteliği, stok durumu ve teslimat adresine göre değişiklik gösterebilir. Olağanüstü durumlar veya mücbir sebepler nedeniyle teslimatta gecikme yaşanması halinde Alıcı bilgilendirilecektir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">6. Cayma Hakkı</h3>
                    <p className="mb-2">Alıcı, teslim aldığı ürünü 14 (on dört) gün içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin iade etme hakkına sahiptir. Cayma hakkının kullanılabilmesi için;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Ürünün kullanılmamış olması,</li>
                      <li>Tekrar satılabilir durumda bulunması,</li>
                      <li>Orijinal ambalajı ve varsa tüm aksesuarlarıyla birlikte gönderilmesi gerekmektedir.</li>
                    </ul>
                    <p className="mb-4">Cayma hakkının kullanılması için Satıcı'ya e-posta yoluyla bildirim yapılması yeterlidir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">7. Cayma Hakkının Kullanılamayacağı Durumlar</h3>
                    <p className="mb-2">Aşağıdaki ürünlerde ilgili mevzuat gereği cayma hakkı kullanılamaz:</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Kullanıcının isteği doğrultusunda hazırlanan kişiye özel ürünler</li>
                      <li>Ambalajı açılmış hijyen ürünleri</li>
                      <li>Tek kullanımlık ürünler</li>
                      <li>Hızlı bozulabilen ürünler</li>
                      <li>Dijital içerikler (indirilebilir yazılım vb.)</li>
                      <li>Mevzuat gereği iadesi mümkün olmayan diğer ürünler</li>
                    </ul>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">8. İade Süreci</h3>
                    <p className="mb-4">Cayma hakkının usulüne uygun kullanılması halinde ürün Satıcı'ya ulaştıktan sonra gerekli kontroller yapılır. İade şartlarının sağlanması durumunda ürün bedeli, ödeme yapılan yöntem esas alınarak yasal süre içerisinde Alıcı'ya iade edilir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">9. Tarafların Hak ve Yükümlülükleri</h3>
                    <p className="font-bold text-slate-800">Satıcı</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Sipariş edilen ürünü belirtilen niteliklere uygun şekilde teslim etmeyi,</li>
                      <li>Ürünün stokta bulunmaması halinde Alıcı'yı bilgilendirmeyi,</li>
                      <li>Yasal yükümlülüklerini yerine getirmeyi kabul eder.</li>
                    </ul>
                    <p className="font-bold text-slate-800">Alıcı</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Sipariş sırasında verdiği bilgilerin doğru olduğunu,</li>
                      <li>Satın alma işlemini kendi iradesiyle gerçekleştirdiğini,</li>
                      <li>Sözleşmeyi okuyup kabul ettiğini beyan eder.</li>
                    </ul>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">10. Mücbir Sebepler</h3>
                    <p className="mb-4">Doğal afet, savaş, salgın hastalık, grev, ulaşım sorunları, resmi makam kararları veya tarafların kontrolü dışında gelişen diğer mücbir sebepler nedeniyle yükümlülüklerin yerine getirilememesinden taraflar sorumlu tutulamaz.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">11. Uyuşmazlıkların Çözümü</h3>
                    <p className="mb-4">İşbu sözleşmeden doğabilecek uyuşmazlıklarda, yürürlükte bulunan Türk Hukuku uygulanır. Uyuşmazlıklarda, T.C. Ticaret Bakanlığı tarafından her yıl belirlenen parasal sınırlar dahilinde Tüketici Hakem Heyetleri, bu sınırların üzerindeki uyuşmazlıklarda ise Tüketici Mahkemeleri yetkilidir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">12. Yürürlük</h3>
                    <p>Alıcı, internet sitesi üzerinden sipariş verdiği anda işbu Mesafeli Satış Sözleşmesi'nin tüm maddelerini okuduğunu, anladığını ve elektronik ortamda kabul ettiğini beyan eder. Bu sözleşme, siparişin elektronik ortamda onaylanması ile yürürlüğe girer.</p>
                  </div>
                )}

                {/* 4. ÖN BİLGİLENDİRME FORMU (EKSİKSİZ, UZUN) */}
                {activeModal === "onbilgi_long" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 font-medium">
                    <h2 className="text-sm font-black text-slate-900 uppercase mb-2">ÖN BİLGİLENDİRME FORMU</h2>
                    
                    <h3 className="font-bold text-slate-900 mt-4 mb-2">1. Amaç</h3>
                    <p className="mb-4">İşbu Ön Bilgilendirme Formu, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında, internet sitesi üzerinden sipariş veren müşterilerin satın alma işlemi öncesinde bilgilendirilmesi amacıyla hazırlanmıştır. Siparişinizi tamamlamadan önce aşağıdaki bilgileri dikkatlice okumanız tavsiye edilir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">2. Satıcı Bilgileri</h3>
                    <ul className="list-none mb-4">
                      <li><strong>Unvan:</strong> e-havuzz</li>
                      <li><strong>Web Sitesi:</strong> https://e-havuzz-frontend.vercel.app/</li>
                      <li><strong>E-Posta:</strong> info@ehavuzz.com</li>
                    </ul>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">3. Ürün Bilgileri</h3>
                    <p className="mb-2">Satın alınan ürün veya hizmete ilişkin;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Ürün adı</li>
                      <li>Ürün açıklaması</li>
                      <li>Adedi</li>
                      <li>Birim fiyatı</li>
                      <li>Toplam satış bedeli</li>
                      <li>Vergiler</li>
                      <li>Kargo ücreti (varsa)</li>
                    </ul>
                    <p className="mb-4">sipariş ekranında kullanıcıya gösterilmektedir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">4. Ödeme Bilgileri</h3>
                    <p className="mb-4">Ödeme işlemleri, sipariş sırasında seçilen ödeme yöntemi kullanılarak gerçekleştirilir. Ödeme bilgileriniz güvenli ödeme altyapıları üzerinden işlenmekte olup banka veya kredi kartı bilgileriniz tarafımızca saklanmamaktadır.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">5. Teslimat Bilgileri</h3>
                    <p className="mb-4">Siparişler, stok durumuna bağlı olarak hazırlanır ve anlaşmalı kargo firması aracılığıyla teslim edilir. Teslimat süresi; teslimat adresi, ürünün stok durumu ve resmi tatiller gibi etkenlere bağlı olarak değişiklik gösterebilir. Olağanüstü durumlarda yaşanabilecek gecikmeler kullanıcıya bildirilecektir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">6. Cayma Hakkı</h3>
                    <p className="mb-2">Tüketici, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içerisinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir. Cayma hakkının kullanılabilmesi için ürünün;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Kullanılmamış olması,</li>
                      <li>Yeniden satışa uygun durumda bulunması,</li>
                      <li>Orijinal ambalajı ile birlikte gönderilmesi gerekmektedir.</li>
                    </ul>
                    <p className="mb-4">İade süreci hakkında detaylı bilgiye İade ve İptal Politikası sayfasından ulaşabilirsiniz.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">7. Cayma Hakkının Kullanılamadığı Durumlar</h3>
                    <p className="mb-2">Aşağıdaki ürünlerde ilgili mevzuat gereği cayma hakkı kullanılamayabilir:</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Kişiye özel hazırlanan ürünler</li>
                      <li>Ambalajı açılmış hijyen ürünleri</li>
                      <li>Dijital içerikler</li>
                      <li>Tek kullanımlık ürünler</li>
                      <li>Mevzuat gereği iadesi mümkün olmayan diğer ürünler</li>
                    </ul>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">8. Kişisel Verilerin Korunması</h3>
                    <p className="mb-4">Sipariş sırasında paylaşılan kişisel verileriniz, yalnızca sipariş sürecinin yürütülmesi, müşteri hizmetlerinin sunulması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir. Detaylı bilgi için KVKK Aydınlatma Metni ve Gizlilik Politikası sayfalarını inceleyebilirsiniz.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">9. Uyuşmazlıkların Çözümü</h3>
                    <p className="mb-4">Bu form kapsamında doğabilecek uyuşmazlıklarda yürürlükteki Türkiye Cumhuriyeti mevzuatı uygulanacaktır. Uyuşmazlıkların çözümünde, T.C. Ticaret Bakanlığı tarafından her yıl belirlenen parasal sınırlar dahilinde Tüketici Hakem Heyetleri, bu sınırların üzerindeki uyuşmazlıklarda ise Tüketici Mahkemeleri yetkilidir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">10. Onay</h3>
                    <p>Alıcı, siparişini tamamlamadan önce bu Ön Bilgilendirme Formu'nu okuduğunu, anladığını ve elektronik ortamda gerekli bilgilendirmenin kendisine yapıldığını kabul eder.</p>
                  </div>
                )}

                {/* 5. GİZLİLİK POLİTİKASI (EKSİKSİZ, UZUN) */}
                {activeModal === "privacy_long" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 font-medium">
                    <h2 className="text-sm font-black text-slate-900 uppercase mb-2">GİZLİLİK POLİTİKASI</h2>
                    
                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Giriş</h3>
                    <p className="mb-4">e-havuzz ("Site") olarak ziyaretçilerimizin ve müşterilerimizin gizliliğine önem veriyoruz. Bu Gizlilik Politikası, internet sitemizi kullanırken paylaştığınız bilgilerin nasıl toplandığını, kullanıldığını, korunduğunu ve hangi durumlarda üçüncü kişilerle paylaşılabileceğini açıklamak amacıyla hazırlanmıştır. İnternet sitemizi kullanarak bu politikada belirtilen esasları kabul etmiş sayılırsınız.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Toplanan Bilgiler</h3>
                    <p className="mb-2">Sitemizi ziyaret ettiğinizde veya sipariş oluşturduğunuzda aşağıdaki bilgiler toplanabilir:</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Ad ve soyad</li>
                      <li>E-posta adresi</li>
                      <li>Telefon numarası</li>
                      <li>Teslimat ve fatura adresi</li>
                      <li>Sipariş bilgileri</li>
                      <li>IP adresi</li>
                      <li>Tarayıcı ve cihaz bilgileri</li>
                      <li>Site kullanım hareketleri</li>
                      <li>Çerez (Cookie) verileri</li>
                    </ul>
                    <p className="mb-4">Ödeme işlemleri sırasında kullanılan banka veya kredi kartı bilgileriniz tarafımızca saklanmamaktadır.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Bilgilerin Kullanım Amaçları</h3>
                    <p className="mb-2">Toplanan bilgiler aşağıdaki amaçlarla kullanılmaktadır:</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Sipariş süreçlerinin yürütülmesi</li>
                      <li>Ürün teslimatının sağlanması</li>
                      <li>Müşteri hizmetlerinin sunulması</li>
                      <li>Talep ve şikâyetlerin değerlendirilmesi</li>
                      <li>Hesap güvenliğinin sağlanması</li>
                      <li>İnternet sitesinin geliştirilmesi</li>
                      <li>Kullanıcı deneyiminin iyileştirilmesi</li>
                      <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                      <li>Dolandırıcılık ve kötüye kullanımın önlenmesi</li>
                    </ul>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Bilgilerin Korunması</h3>
                    <p className="mb-4">Kişisel verilerinizin güvenliği bizim için önemlidir. Bu doğrultuda teknik ve idari güvenlik önlemleri uygulanarak kişisel verilerin yetkisiz erişime, değiştirilmeye, ifşa edilmeye veya kaybolmaya karşı korunması hedeflenmektedir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Bilgilerin Paylaşılması</h3>
                    <p className="mb-2">Kişisel bilgileriniz;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>İlgili mevzuat gereği yetkili kamu kurum ve kuruluşlarıyla,</li>
                      <li>Kargo ve lojistik hizmet sağlayıcılarıyla,</li>
                      <li>Ödeme hizmeti sağlayıcılarıyla,</li>
                      <li>Teknik altyapı ve barındırma hizmeti sunan iş ortaklarıyla,</li>
                    </ul>
                    <p className="mb-4">yalnızca hizmetin sunulması veya yasal yükümlülüklerin yerine getirilmesi amacıyla paylaşılabilir. Bunun dışında kişisel bilgileriniz üçüncü kişilere satılmaz, kiralanmaz veya ticari amaçlarla paylaşılmaz.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Çerezler (Cookies)</h3>
                    <p className="mb-4">Web sitemiz, kullanıcı deneyimini geliştirmek ve hizmetlerin daha verimli sunulmasını sağlamak amacıyla çerezlerden yararlanabilir. Çerezlerin kullanımına ilişkin ayrıntılı bilgiye Çerez (Cookie) Politikası sayfasından ulaşabilirsiniz.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Üçüncü Taraf Bağlantılar</h3>
                    <p className="mb-4">İnternet sitemiz zaman zaman üçüncü taraf internet sitelerine yönlendiren bağlantılar içerebilir. Bu sitelerin gizlilik uygulamalarından e-havuzz sorumlu değildir. Ziyaret ettiğiniz internet sitelerinin kendi gizlilik politikalarını incelemeniz önerilir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Veri Saklama Süresi</h3>
                    <p className="mb-4">Kişisel bilgileriniz yalnızca işlenme amacı devam ettiği sürece veya yürürlükteki mevzuatta öngörülen süre boyunca saklanmaktadır. Saklama süresi sona erdiğinde veriler yürürlükteki mevzuata uygun olarak silinir, yok edilir veya anonim hale getirilir.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Kullanıcı Hakları</h3>
                    <p className="mb-2">6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kullanıcılar;</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Kişisel verilerinin işlenip işlenmediğini öğrenme,</li>
                      <li>İşlenen verilere erişim talep etme,</li>
                      <li>Yanlış veya eksik bilgilerin düzeltilmesini isteme,</li>
                      <li>Belirli şartlar altında verilerinin silinmesini talep etme,</li>
                      <li>Kanunda belirtilen diğer haklarını kullanma</li>
                    </ul>
                    <p className="mb-4">haklarına sahiptir. Detaylı bilgi için KVKK Aydınlatma Metni sayfasını inceleyebilirsiniz.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">Politika Değişiklikleri</h3>
                    <p className="mb-4">Bu Gizlilik Politikası, yürürlükteki mevzuat veya sunulan hizmetlerde meydana gelen değişiklikler doğrultusunda güncellenebilir. Güncel sürüm internet sitemizde yayımlandığı tarihten itibaren yürürlüğe girer.</p>

                    <h3 className="font-bold text-slate-900 mt-4 mb-2">İletişim</h3>
                    <p>Gizlilik Politikası hakkında her türlü soru, görüş veya talepleriniz için bizimle iletişime geçebilirsiniz.<br/><strong>E-posta:</strong> info@ehavuzz.com<br/><strong>Web Sitesi:</strong> https://e-havuzz-frontend.vercel.app/</p>
                  </div>
                )}

                {/* SİPARİŞ/SEPET ÖDEME EKRANI (BEYAZ EKRAN ÇÖZÜLDÜ, DİREKT AÇILIYOR) */}
                {activeModal === "sepet" && (
                  <div className="text-sm">
                    {paymentSuccess ? (
                      <div className="text-center py-6 flex flex-col items-center gap-5 animate-fadeIn">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-400">
                          <CheckCircle className="w-8 h-8 text-emerald-600" />
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
                              <span className="font-black text-sm text-slate-900">{simulatedOrderCode || "HM-77X321"}</span>
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
                              {cart.length > 0 ? cart.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs border-b pb-2">
                                  <div className="flex-1"><span className="font-extrabold text-slate-900 block line-clamp-1">{item.name}</span><span className="text-[10px] text-slate-400 font-bold">1 adet</span></div>
                                  <span className="font-black text-slate-900">₺{item.price}</span>
                                </div>
                              )) : <div className="text-center py-4 text-slate-400 font-bold">Sepetiniz boş. Dummy test verisi işleniyor.</div>}
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

                {/* KARGO TAKİP */}
                {activeModal === "kargo" && (
                  <div className="text-xs md:text-sm leading-relaxed p-2 space-y-4 font-medium">
                    <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-2xl flex items-center gap-3">
                      <Truck className="w-6 h-6 text-cyan-600 shrink-0" />
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">Aktif Gönderi Durumu</h4>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">Sipariş kodunuza ait anlık lojistik operasyon raporları aşağıda listelenmiştir.</p>
                      </div>
                    </div>
                    <div className="relative border-l-2 border-dashed border-slate-200 pl-6 ml-3 space-y-5">
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0 bg-emerald-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">✓</span>
                        <h5 className="font-black text-slate-900 text-xs">Sipariş Alındı</h5>
                        <p className="text-slate-500 font-semibold text-[11px] mt-0.5">Siparişiniz veri tabanımıza başarıyla işlendi ve faturalandırma sırasına alındı.</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0 bg-purple-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">●</span>
                        <h5 className="font-black text-purple-700 text-xs">Hazırlanıyor</h5>
                        <p className="text-slate-500 font-semibold text-[11px] mt-0.5">Ürünleriniz Arpeta lojistik merkezi depolarında paketlenme aşamasındadır.</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0 bg-slate-300 text-slate-600 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">○</span>
                        <h5 className="font-black text-slate-400 text-xs">Kargoya Verildi</h5>
                        <p className="text-slate-400 font-semibold text-[11px] mt-0.5">Yurtiçi Kargo toplama araçlarına sevk edilmek üzere beklemektedir.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* HAKKIMIZDA MODALI */}
                {activeModal === "hakkimizda" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 space-y-4 font-medium p-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase">HAKKIMIZDA</h2>
                    <p><strong>e-havuzz</strong>, modern havuz otomasyon teknolojilerinden endüstriyel bakım kimyasallarına kadar uzanan geniş ve premium ürün yelpazesiyle sektör standartlarını yeniden belirlemek amacıyla Arpeta bünyesinde kurulmuş yenilikçi bir e-ticaret platformudur.</p>
                    <p>Müşterilerimize uçtan uca güvenli, şeffaf ve yapay zeka kararlarıyla optimize edilmiş bir tedarik deneyimi sunuyoruz. Güçlü lojistik ağımız ve yasal mevzuatlara tam uyumlu kurumsal altyapımızla havuz yönetimi ihtiyaçlarında kesintisiz hizmet vermekteyiz.</p>
                  </div>
                )}

                {/* ÜYE GİRİŞİ PANELİ */}
                {activeModal === "login" && (
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 max-w-sm mx-auto p-4 bg-white rounded-2xl">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase mb-1">Kullanıcı Adı</label>
                      <input type="text" required placeholder="Kullanıcı adınızı girin" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 text-xs font-bold focus:outline-none focus:border-purple-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase mb-1">Şifre</label>
                      <input type="password" required placeholder="Şifrenizi girin" className="w-full p-3 rounded-xl bg-slate-50 border-2 text-xs font-bold focus:outline-none focus:border-purple-600" />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white font-black py-2.5 rounded-xl text-xs uppercase mt-2 shadow-sm">Giriş Yap</button>
                  </form>
                )}

                {/* YENİ ÜYE KAYDI PANELİ */}
                {activeModal === "register" && (
                  <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3 max-w-md mx-auto p-2 bg-white rounded-2xl animate-fadeIn">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-0.5">Ad Soyad</label>
                      <input type="text" required placeholder="Nuray Mutlu" value={registerForm.fullname} onChange={(e) => setRegisterForm({...registerForm, fullname: e.target.value})} className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 focus:border-cyan-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-0.5">TC Kimlik Numarası</label>
                      <input type="text" required maxLength="11" placeholder="11 haneli TC no" value={registerForm.tcNo} onChange={(e) => setRegisterForm({...registerForm, tcNo: e.target.value})} className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 focus:border-cyan-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-0.5">Telefon</label>
                        <input type="tel" required placeholder="0555XXXXXXX" value={registerForm.phone} onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})} className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 focus:border-cyan-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-0.5">E-posta</label>
                        <input type="email" required placeholder="ornek@email.com" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 focus:border-cyan-500 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-0.5">Teslimat Adresi</label>
                      <textarea required rows="2" placeholder="Mahalle, sokak, kapı no..." value={registerForm.city} onChange={(e) => setRegisterForm({...registerForm, city: e.target.value})} className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 focus:border-cyan-500 outline-none"></textarea>
                    </div>
                    
                    <div className="mt-1 flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border">
                      <input type="checkbox" id="kvkkCheck" required checked={kvkkRegisterCheck} onChange={(e) => setKvkkRegisterCheck(e.target.checked)} className="mt-0.5 cursor-pointer" />
                      <label htmlFor="kvkkCheck" className="text-[10px] font-bold text-slate-600 leading-tight cursor-pointer">
                        e-havuzz <span onClick={() => setSubModalOpen("sozlesme")} className="text-purple-700 underline font-black cursor-pointer">Üyelik Sözleşmesi</span>'ni ve <span onClick={() => setSubModalOpen("kvkk")} className="text-purple-700 underline font-black cursor-pointer">KVKK Aydınlatma Metni</span>'ni okudum, kabul ediyorum.
                      </label>
                    </div>

                    <button type="submit" disabled={!kvkkRegisterCheck} className={`w-full font-black py-2.5 rounded-xl text-xs uppercase tracking-wide shadow-sm mt-1 transition-all ${kvkkRegisterCheck ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Kayıt İşlemini Tamamla</button>
                  </form>
                )}

                {/* BLOG METNİ */}
                {activeModal === "blog" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-800 space-y-4 font-medium p-2">
                    <div className="bg-purple-50/70 border-2 border-purple-100 p-5 rounded-2xl max-h-[60vh] overflow-y-auto">
                      <h4 className="font-black text-purple-900 text-base mb-3">📝 React E-Ticaret Projesinin Gelişim Hikayesi</h4>
                      <p className="mb-3">Yazılım öğrenirken en büyük motivasyon kaynaklarından biri, geriye dönüp ilk satır koda baktığınızda kat ettiğiniz yolu görebilmektir. Bu proje de benim için tam olarak bunu ifade ediyor. Projeye başladığım günlerde React ekosistemi hakkında oldukça sınırlı bilgiye sahiptim. Amacım kusursuz bir uygulama geliştirmekten çok, öğrendiğim her yeni kavramı gerçek bir proje üzerinde uygulayarak ilerlemekti. Bu nedenle proje, her öğrendiğim teknolojiyle birlikte adım adım büyüdü ve zamanla gerçek bir e-ticaret uygulamasına dönüştü.</p>
                      <h5 className="font-bold text-slate-900 mt-2">İlk Adım: Backend Olmadan Çalışan Bir Prototip</h5>
                      <p className="mb-3">Başlangıç aşamasında backend geliştirme sürecine girmeden önce tamamen kullanıcı deneyimine odaklanmak istedim. Bu nedenle tüm ürün verilerini statik JSON dosyaları içerisinde tuttum. Uygulamanın durum yönetimi React Context API kullanılarak global state mantığıyla oluşturuldu. Böylece sepet işlemlerini gerçekleştirebilen tamamen işlevsel bir prototip ortaya çıktı.</p>
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

      {/* HEADER BARI */}
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
            
            {/* SİPARİŞ SORGULA BUTONU - BEYAZ EKRAN HATASI ÇÖZÜLDÜ, DİREKT ÖDEME FORMUNU AÇIYOR */}
            <button type="button" onClick={() => setActiveModal("sepet")} className="px-4 py-2 rounded-xl font-black border border-purple-600 bg-white text-purple-700 text-xs hover:bg-purple-50 transition-colors">📋 Sipariş Sorgula</button>

            <div onClick={() => setActiveModal("sepet")} className="relative cursor-pointer text-slate-800 hover:text-purple-700 bg-slate-100 p-2.5 rounded-xl border-2 shadow-sm">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border border-white">{cart.length}</span>}
            </div>
          </div>
        </header>

        {/* ASİSTAN GÖVDESİ */}
        <div className="max-w-[1400px] mx-auto px-6 mt-6">
          <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-[#00b4d8] p-6 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between shadow-2xl border-2 border-purple-500/40 relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-4 md:mb-0 w-full flex-1">
              <div className="bg-gradient-to-br from-amber-400 to-purple-600 p-3 rounded-2xl shadow-lg shrink-0"><Sparkles className="w-6 h-6 text-white" /></div>
              <div className="flex flex-col gap-2 w-full ml-1">
                <h4 className="font-black text-base tracking-wide text-white">Akıllı Havuz Asistanı: Size nasıl yardımcı olabilirim?</h4>
                <form onSubmit={handleAsistanSorgu} className="flex gap-2 w-full max-w-xl">
                  <input type="text" value={asistanSoru} onChange={(e) => setAsistanSoru(e.target.value)} placeholder="Temizlik, Klor, Pompa..." className="flex-1 px-4 py-2 rounded-xl text-slate-900 font-bold text-xs bg-white/90 focus:bg-white outline-none border border-cyan-300" />
                  <button type="submit" className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-black text-xs uppercase shrink-0">Sorgula</button>
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

        {/* VITRIN GRİDİ - ÜRÜNLER KESİN VE KALICI OLARAK GERİ GELDİ */}
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
              {displayedProducts && displayedProducts.length > 0 ? (
                displayedProducts.map(product => (
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
                          <button type="button" onClick={() => setSelectedProductDetail(product)} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-black py-2 rounded-xl uppercase flex items-center justify-center gap-1 border shadow-sm">
                            <Eye className="w-3.5 h-3.5" /> İncele
                          </button>
                          <button type="button" onClick={() => addToCart(product)} className="bg-purple-600 hover:bg-cyan-500 text-white text-[11px] font-black py-2 rounded-xl transition-colors shadow-md uppercase">
                            Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-slate-500 font-bold bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  Aradığınız kriterlere uygun ürün bulunamadı.
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-64 bg-white p-4 rounded-3xl shadow-md border-2 border-slate-200 h-fit sticky top-24">
            <h4 className="font-black text-xs text-center text-purple-700 uppercase mb-4 pb-2 border-b-2">Hızlı İşlemler</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActiveModal("blog")} className="flex items-center gap-3 p-3 rounded-xl text-xs font-black text-slate-700 border hover:bg-purple-50 w-full text-left"><FileText className="w-4 h-4 text-purple-600" /> Blog Yazıları</button>
              <button onClick={() => setActiveModal("hakkimizda")} className="flex items-center gap-3 p-3 rounded-xl text-xs font-black text-slate-700 border hover:bg-cyan-50 w-full text-left"><HelpCircle className="w-4 h-4 text-cyan-500" /> Hakkımızda</button>
              
              {/* EKSİKSİZ KARGO TAKİP BUTONU */}
              <button onClick={() => setActiveModal("kargo")} className="flex items-center gap-3 p-3 rounded-xl text-xs font-black text-slate-700 border hover:bg-emerald-50 w-full text-left"><Truck className="w-4 h-4 text-emerald-500" /> Kargo Takip</button>
            </div>
          </aside>
        </div>
      </div>

      {/* FOOTER */}
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
            </ul>
          </div>

          <div>
            <h5 className="text-white font-black text-xs uppercase tracking-wider mb-3">Kurumsal & Yaşam</h5>
            <ul className="space-y-2 font-semibold text-slate-400">
              <li onClick={() => setActiveModal("privacy_long")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Gizlilik Politikası</li>
              <li onClick={() => setActiveModal("cerez_long")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Çerez (Cookie) Politikası</li>
              <li onClick={() => setActiveModal("ms_long")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Mesafeli Satış Sözleşmesi</li>
              <li onClick={() => setActiveModal("onbilgi_long")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Ön Bilgilendirme Formu</li>
              <li onClick={() => setActiveModal("kvkk_long")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ KVKK Aydınlatma Metni</li>
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
            e-havuzz olarak, sitemizdeki kullanıcı deneyimini iyileştirmek, sayfalarımızı optimize etmek ve ilgi alanlarınıza göre kişiselleştirilmiş reklamlar sunabilmek adına zorunlu, analitik ve pazarlama çerezleri kullanıyoruz. Çerezler hakkında detaylı bilgiye <span onClick={() => setActiveModal("cerez_long")} className="text-cyan-400 underline font-bold cursor-pointer">Çerez Politikası</span> metnimizden ulaşabilirsiniz.
          </p>
          <div className="flex gap-2 text-[10px] font-black uppercase mt-1">
            <button onClick={() => setCookieBannerOpen(false)} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-slate-950 py-2 rounded-lg transition-colors">Hepsini Kabul Et</button>
            <button onClick={() => setCookieBannerOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg transition-colors">Reddet</button>
            <button onClick={() => { setActiveModal("cerez_long"); }} className="flex-1 text-slate-400 underline text-center font-bold">Çerez Ayarları</button>
          </div>
        </div>
      )}

    </div>
  );
}