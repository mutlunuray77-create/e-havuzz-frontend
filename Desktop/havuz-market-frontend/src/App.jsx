import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Search, User, HelpCircle, FileText, Truck, Mail, MapPin, Sparkles, Filter, CheckCircle, X, LogIn, UserPlus, ArrowLeft, CreditCard, Cookie } from 'lucide-react';

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
    { id: 201, name: "AquaGlow Turkuaz LED Havuz Aydınlatma", category: "Aydınlatma", price: 1450, image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&q=80", tag: "Yeni Sezon", moods: ["keyifli", "teknolojik"], aiInsight: "💡 Bugün alabilirsiniz, önümüzdeki 7 günde fiyatı %6 artabilir!" },
    { id: 202, name: "Rio Masaj Etkili Paslanmaz Havuz Şelalesi", category: "Ekipmanlar", price: 12800, image: "https://images.unsplash.com/photo-1562184560-a11b7cf7c847?w=500&q=80", tag: "Özel Tasarım", moods: ["yorgun", "sakin"], aiInsight: "🔥 Son 3 günün en düşük fiyatı! Kaçırmayın." },
    { id: 203, name: "EcoFilter Premium Cam Havuz Kumu 20 kg", category: "Ekipmanlar", price: 340, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", tag: "En Çok Satan", moods: ["titiz", "sakin"], aiInsight: "📉 Fiyatı şu an kararlı durumda. Güvenle alabilirsiniz." },
    { id: 204, name: "SmartPool Bluetooth Akıllı Dozaj Pompası", category: "Pompalar", price: 18500, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80", tag: "Akıllı Ürün", moods: ["teknolojik", "titiz"], aiInsight: "🤖 Yapay Zeka Öngörüsü: Gelecek ay stok durumuna bağlı olarak fiyatı yükselebilir." },
    { id: 205, name: "Olimpik Stil Havuz Emniyet and Kulvar Çizgisi", category: "Ekipmanlar", price: 2100, image: "https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=500&q=80", tag: "Güvenlik", moods: ["sakin", "titiz"], aiInsight: "💡 Sezon ortası indirimi: Son 48 saatin en iyi fiyatı." },
    { id: 206, name: "DeepClean Profesyonel Havuz Temizlik Süpürgesi", category: "Temizlik", price: 950, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80", tag: "Pratik Ürün", moods: ["titiz", "yorgun"], aiInsight: "⚡ Önümüzdeki 5 günde fiyatı %4 artış eğiliminde görünüyor." },
    { id: 207, name: "ThermoComfort Dijital Havuz Suyu Isı Ölçer", category: "Aydınlatma", price: 420, image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80", tag: "Yeni", moods: ["teknolojik"], aiInsight: "📉 Fiyat analizine göre şu an satın almak için en ideal dönem." },
    { id: 208, name: "Premium Paslanmaz Havuz Giriş Merdiveni (4 Basamak)", category: "Ekipmanlar", price: 4750, image: "https://images.unsplash.com/photo-1572331507600-664123d1115e?w=500&q=80", tag: "Lüks", moods: ["sakin"], aiInsight: "🔥 Son 3 günün en düşük fiyatı fırsatını yakalayın." },
    { id: 209, name: "Anti-Yosun Concentre Havuz Bakım Sıvısı 10 L", category: "Kimyasallar", price: 780, image: "https://images.unsplash.com/photo-1527156279143-6cd52a32c2a1?w=500&q=80", tag: "Etkili Formül", moods: ["titiz"], aiInsight: "💡 Kimyasal ürünlerde kur dalgalanması öncesi bugün almanız önerilir." },
    { id: 210, name: "SolarTarpaulin Isı Koruyucu Havuz Temizlik Brbrandası", category: "Temizlik", price: 3200, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80", tag: "Çevre Dostu", moods: ["keyifli"], aiInsight: "📈 Yapay zeka talebin arttığını öngörüyor, fiyat %8 yükselebilir!" },
    { id: 211, name: "Granül Havuz Kloru %56 Stabilizatörlü 25 KG", category: "Kimyasallar", price: 2300, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", tag: "Fırsat Ürünü", moods: ["titiz"], aiInsight: "💡 Su dezenfeksiyonu için haftalık periyotta en kararlı klor bileşiğidir." },
    { id: 212, name: "Lüks Duvar Tipi Havuz Şelalesi Şelale Perdesi", category: "Ekipmanlar", price: 15400, image: "https://images.unsplash.com/photo-1562184560-a11b7cf7c847?w=500&q=80", tag: "Özel Tasarım", moods: ["sakin", "yorgun"], aiInsight: "🌊 Mimari şelale tasarımı ortamdaki gürültüyü absorbe ederek sakinlik verir." },
    { id: 213, name: "Otomatik Havuz Dip Süpürme Robotu Klasik", category: "Temizlik", price: 34500, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80", tag: "Premium Altyapı", moods: ["teknolojik", "titiz"], aiInsight: "🤖 Yapay Zeka Öngörüsü: Rutin temizlik saatlerinde %40 energy tasarrufu sunar." },
    { id: 214, name: "Yüksek Verimli Havuz Sirkülasyon Pompası 2 HP", category: "Pompalar", price: 11200, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80", tag: "Yüksek Güç", moods: ["teknolojik"], aiInsight: "⚡ Büyük ölçekli havuz filtrasyon döngülerinde standartlara tam uyumlu." },
    { id: 215, name: "Sıvı Ph Düşürücü Havuz Kimyasalı 20 KG", category: "Kimyasallar", price: 690, image: "https://images.unsplash.com/photo-1527156279143-6cd52a32c2a1?w=500&q=80", tag: "Temel İhtiyaç", aiInsight: "📉 Fiyat analizine göre stabil kalma eğiliminde, güvenle stoklanabilir." },
    { id: 216, name: "Havuz İçi RGB Aydınlatma Trafosu Kumandalı", category: "Aydınlatma", price: 2400, image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80", tag: "Yeni Ürün", aiInsight: "💡 Uzaktan kumanda entegrasyonu ile 12V armatürlerin akıllı kontrolünü sağlar.", moods: ["sakin", "teknolojik"] },
    { id: 217, name: "Havuz Suyu Parlatıcı ve Çöktürücü 10 L", category: "Kimyasallar", price: 510, image: "https://images.unsplash.com/photo-1527156279143-6cd52a32c2a1?w=500&q=80", tag: "Hızlı Etki", aiInsight: "✨ Havuz suyundaki donukluğu saniyeler içinde gidererek kristal berraklık sunar.", moods: ["titiz"] },
    { id: 218, name: "Teleskobik Havuz Kepçesi Derin Tip Filreli", category: "Temizlik", price: 680, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80", tag: "Pratik", aiInsight: "⚡ İnce gözenekli yapısı sayesinde yüzeydeki polenleri dahi kolayca yakalar.", moods: ["titiz"] },
    { id: 219, name: "Güneş Enerjili Akıllı Havuz İyonizasyon Cihazı", category: "Ekipmanlar", price: 5400, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", tag: "Akıllı Ürün", moods: ["teknolojik"], aiInsight: "🤖 Güneş enerjisi paneli sayesinde sıfır işletme maliyeti ile koruma sağlar." },
    { id: 220, name: "Geçmeli Havuz Kenar Izgara Köşe Parçası", category: "Ekipmanlar", price: 190, image: "https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=500&q=80", tag: "Yedek Parça", moods: ["sakin"] }
  ];

  useEffect(() => {
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
    if (soruLower.includes("temiz") || soruLower.includes("robot") || soruLower.includes("süpürge")) {
      setSearchQuery("Robot");
      setAsistanCevap("🤖 Akıllı Asistan: Havuz temizliği için sana harika bir önerim var! Arka plandaki mağazada 'Temizlik' kategorisini senin için süzdüm. Özellikle v4 Pro Robot modelimizi incelemeni öneririm!");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 213));
    } else if (soruLower.includes("klor") || soruLower.includes("kimyasal")) {
      setSearchQuery("Klor");
      setAsistanCevap("🤖 Akıllı Asistan: Havuzun pırıl pırıl kalması ve dezenfeksiyonu için 'Kimyasallar' kategorisindeki stabilizatörlü Granül Klor ürünümüzü listeledim.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 211));
    } else if (soruLower.includes("pompa") || soruLower.includes("devirdaim")) {
      setSearchQuery("Pompa");
      setAsistanCevap("🤖 Akıllı Asistan: Sirkülasyon ve filtreleme döngüsü için 2 HP Yüksek Verimli Pompa modelimizi listeledim.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 214));
    } else if (soruLower.includes("ışık") || soruLower.includes("led") || soruLower.includes("aydınlatma")) {
      setSearchQuery("LED");
      setAsistanCevap("🤖 Akıllı Asistan: Gece keyfi ve ambiyans için kumandalı AquaGlow LED serimizi listeledim.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 201));
    } else if (soruLower.includes("şelale") || soruLower.includes("fıskiye")) {
      setSearchQuery("Şelale");
      setAsistanCevap("🤖 Akıllı Asistan: Harika bir tercih! Lüks Şelale Fıskiyesi modelimiz havuzunuza modern bir hava katarken, su sesiyle harika bir dinginlik sağlar. Ürün arka planda listelendi!");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 212));
    } else {
      setSearchQuery("");
      setAsistanCevap("🤖 Akıllı Asistan: Sorunu anladım! İstediğin ürünü yukarıdaki arama motoruna yazarak ya da kategorilerden süzerek anında 20 premium ürün arasından bulabilirsin.");
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

      {/* DİNAMİK MODAL SİSTEMİ */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] relative">
            
            {/* SUB MODAL (ALT MODAL) ALANI - SÖZLEŞMELERİN ARKA EKRANI KAPATMADAN GÖSTERİLMESİ */}
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
                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-900">1. Cayma Hakkı</h3>
                      <p>Tüketici, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin, satın aldığı ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içerisinde iade etme hakkına sahiptir.</p>
                      <h3 className="font-bold text-slate-900">2. İade Şartları</h3>
                      <p>İade edilecek ürünlerin ambalajının açılmamış, kullanılmamış, bozulmamış ve yeniden satılabilirlik özelliğini kaybetmemiş olması gerekmektedir. Hijyenik ürünler ve havuz kimyasalları gibi açıldığında özelliğini yitiren ürünlerde ambalaj açılmışsa iade kabul edilmemektedir.</p>
                      <h3 className="font-bold text-slate-900">3. İade Süreci</h3>
                      <p>İade talebinizi profilinizdeki "Siparişlerim" bölümünden veya iletişim sayfamızdan iletebilirsiniz. Onaylanan iadelerin ücreti 7 iş günü içerisinde kartınıza iade edilir.</p>
                    </div>
                  )}

                  {subModalContent === "kvkk" && (
                    <div className="space-y-3">
                      <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, e-havuzz olarak, veri sorumlusu sıfatıyla, kiisiel verilerinizi hukuka uygun olarak işleyebilmekteyiz.</p>
                      <h3 className="font-bold text-slate-900">1. İşlenen Kişisel Verileriniz</h3>
                      <p>Sitemiz üzerinden üye olurken veya alışveriş yaparken bizimle paylaştığınız; Ad, Soyad, E-posta adresi, Telefon numarası, Teslimat ve Fatura adresi ile IP adresi verileriniz işlenmektedir.</p>
                      <h3 className="font-bold text-slate-900">2. Kişisel Verilerin İşlenme Amaçları</h3>
                      <p>Kişisel verileriniz; siparişlerinizin alınması, ürünlerin teslimat süreçlerinin yürütülmesi, faturalandırma işlemlerinin yapılması, üyelik kaydınızın oluşturulması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.</p>
                      <h3 className="font-bold text-slate-900">3. Verilerin Aktarılması</h3>
                      <p>Kişisel verileriniz, yalnızca sipariş teslimatının yapılabilmesi amacıyla kargo firmalarıyla ve ödemenin güvenli alınabilmesi amacıyla aracı ödeme kuruluşlarıyla paylaşılmaktadır.</p>
                    </div>
                  )}

                  {subModalContent === "sozlesme" && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-900">e-havuzz Üyelik Şartları & Sözleşmesi</h3>
                      <p>İşbu sözleşme, e-havuzz platformuna üye olan kullanıcının haklarını, sipariş adımlarındaki sorumluluklarını ve platform kurallarını karşılıklı olarak beyan eder. Kayıt olan her kullanıcı bu şartları kabul etmiş sayılır.</p>
                    </div>
                  )}
                </div>
                <div className="border-t pt-4 mt-4 flex justify-end">
                  <button type="button" onClick={() => setSubModalOpen("")} className="bg-slate-900 text-white font-black text-xs px-5 py-2 rounded-xl">Metni Kapat</button>
                </div>
              </div>
            )}

            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-900 via-purple-900 to-[#00b4d8] text-white">
              <h3 className="font-black text-sm md:text-base flex items-center gap-2 tracking-wide">
                {activeModal === "sepet" && "🛒 Alışveriş Sepetiniz & Güvenli Ödeme Özetleri"}
                {activeModal === "asistan" && "🤖 Akıllı Havuz Asistanı"}
                {activeModal === "kargo" && "🚚 Kargo Takip & Teslimat Durumu"}
                {activeModal === "login" && "🔑 Üye Girişi"}
                {activeModal === "register" && "📝 Yeni Üye Kaydı"}
                {activeModal === "blog" && "📝 E-Havuz Market Blog"}
                {activeModal === "hakkimizda" && "✨ Hakkımızda"}
                {activeModal === "iade" && "🔄 İade & Değişim Politikası"}
                {activeModal === "kvkk" && "📜 KVKK Aydınlatma Metni"}
                {activeModal === "cerez" && "🍪 Çerez (Cookie) Politikası"}
                {activeModal === "sozlesme" && "📄 Kullanım Koşulları & Üyelik Sözleşmesi"}
              </h3>
              <button onClick={() => { if (paymentSuccess) { clearCartAfterSuccess(); } else { setActiveModal(""); } }} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-slate-700 flex-1 flex flex-col justify-between">
              <div>
                
                {/* SEPET ADIMI */}
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
                        <p className="text-[11px] text-slate-400 font-bold">Sipariş detayları ve kargo takip numarası e-posta adresinize gönderildi.</p>
                        <button type="button" onClick={clearCartAfterSuccess} className="w-full max-w-md bg-[#00b4d8] text-white font-black py-3.5 rounded-xl text-xs uppercase mt-2 flex items-center justify-center gap-1.5 shadow-md">Alışverişe Devam Et ➔</button>
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
                            <div className="grid grid-cols-2 gap-2">
                              <input type="text" required placeholder="İlçe" value={checkoutForm.ilce} onChange={(e) => setCheckoutForm({...checkoutForm, ilce: e.target.value})} className="p-2 text-xs font-bold rounded-xl border bg-white outline-none focus:border-cyan-500" />
                              <input type="text" required placeholder="Posta Kodu" value={checkoutForm.postaKodu} onChange={(e) => setCheckoutForm({...checkoutForm, postaKodu: e.target.value})} className="p-2 text-xs font-bold rounded-xl border bg-white outline-none focus:border-cyan-500" />
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

                            {/* SUB MODAL TETİKLEYİCİ - SEPETİ KAPATMADAN GÜVENLİ SÖZLEŞME AÇMA */}
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

                {/* DOĞRUDAN FOOTER'DAN TETİKLENEN DETAYLI TİCARİ YASAL METİNLER (TRENDYOL STANDARTLARI) */}
                {activeModal === "kvkk" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 space-y-4 font-medium p-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase">e-havuzz KİŞİSEL VERİLERİN KORUNMASI AYDINLATMA METNİ</h2>
                    <p className="italic">Veri Sorumlusu: e-havuzz (e-havuzz-frontend.vercel.app)</p>
                    <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, e-havuzz olarak, veri sorumlusu sıfatıyla, kişisel verilerinizi aşağıda açıklanan amaçlar kapsamında; hukuka ve dürüstlük kurallarına uygun olarak işleyebilmekte, kaydedebilmekte ve saklayabilmekteyiz.</p>
                    
                    <h3 className="font-black text-slate-900">1. İşlenen Kişisel Verileriniz</h3>
                    <p>Sitemiz üzerinden üye olurken veya alışveriş yaparken bizimle paylaştığınız; Ad, Soyad, E-posta adresi, Telefon numarası, Teslimat ve Fatura adresi ile IP adresi verileriniz işlenmektedir.</p>
                    
                    <h3 className="font-black text-slate-900">2. Kişisel Verilerin İşlenme Amaçları</h3>
                    <p>Kişisel verileriniz; siparişlerinizin alınması, ürünlerin teslimat süreçlerinin yürütülmesi, faturalandırma işlemlerinin yapılması, üyelik kaydınızın oluşturulması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.</p>
                    
                    <h3 className="font-black text-slate-900">3. Verilerin Aktarılması</h3>
                    <p>Kişisel verileriniz, yalnızca sipariş teslimatının yapılabilmesi amacıyla kargo firmalarıyla ve ödemenin güvenli alınabilmesi amacıyla aracı ödeme kuruluşlarıyla paylaşılmaktadır. Üçüncü şahıslara reklam amacıyla kesinlikle satılmamaktadır.</p>
                    
                    <h3 className="font-black text-slate-900">4. Haklarınız</h3>
                    <p>KVKK'nın 11. maddesi uyarınca sitemizle iletişim kurarak verilerinizin silinmesini, düzeltilmesini veya hangi verilerinizin işlendiğini öğrenmeyi talep edebilirsiniz.</p>
                  </div>
                )}

                {activeModal === "cerez" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 space-y-4 font-medium p-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase">e-havuzz ÇEREZ POLİTİKASI</h2>
                    <p>Bu Çerez Politikası, e-havuzz-frontend.vercel.app adresini ziyaret eden kullanıcılarımızın deneyimini optimize etmek amacıyla kullanılan çerezler hakkında bilgi vermek üzere hazırlanmıştır.</p>
                    
                    <h3 className="font-black text-slate-900">1. Çerez (Cookie) Nedir?</h3>
                    <p>Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır.</p>
                    
                    <h3 className="font-black text-slate-900">2. Sitemizde Kullanılan Çerez Türleri</h3>
                    <p><strong>Zorunlu Çerezler:</strong> Sitenin doğru çalışması, sepetinizin hatırlanması ve güvenli giriş yapabilmeniz için zorunludur.</p>
                    <p><strong>Analitik Çerezler:</strong> Sitemizi kaç kişinin ziyaret ettiğini ve hangi sayfaların daha çok tıklandığını anonim olarak ölçmek için kullanılır.</p>
                    
                    <h3 className="font-black text-slate-900">3. Çerezleri Nasıl Kontrol Edebilirsiniz?</h3>
                    <p>Tarayıcınızın ayarlarından veya sitemizde bulunan "Çerez Ayarları" panelinden dilediğiniz zaman çerez tercihlerinizi değiştirebilir veya tüm çerezleri engelleyebilirsiniz.</p>
                  </div>
                )}

                {activeModal === "iade" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 space-y-4 font-medium p-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase">e-havuzz İPTAL VE İADE KOŞULLARI</h2>
                    
                    <h3 className="font-black text-slate-900">1. Cayma Hakkı</h3>
                    <p>Tüketici, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin, satın aldığı ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içerisinde iade etme hakkına sahiptir.</p>
                    
                    <h3 className="font-black text-slate-900">2. İade Şartları</h3>
                    <p>İade edilecek ürünlerin ambalajının açılmamış, kullanılmamış, bozulmamış ve yeniden satılabilirlik özelliğini kaybetmemiş olması gerekmektedir. Hijyenik ürünler ve havuz kimyasalları gibi açıldığında özelliğini yitiren ürünlerde ambalaj açılmışsa iade kabul edilmemektedir.</p>
                    
                    <h3 className="font-black text-slate-900">3. İade Süreci</h3>
                    <p>İade talebinizi profilinizdeki "Siparişlerim" bölümünden veya iletişim sayfamızdan iletebilirsiniz. Onaylanan iadelerin ücreti 7 iş günü içerisinde kartınıza iade edilir.</p>
                  </div>
                )}

                {activeModal === "sozlesme" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-700 space-y-3 font-medium p-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase">e-havuzz Üyelik Şartları & Sözleşmesi</h2>
                    <p>İşbu sözleşme, e-havuzz platformuna üye olan kullanıcının haklarını, sipariş adımlarındaki sorumluluklarını ve platform kurallarını karşılıklı olarak beyan eder. Kayıt olan her kullanıcı bu şartları kabul etmiş sayılır.</p>
                  </div>
                )}

                {activeModal === "blog" && (
                  <div className="text-xs md:text-sm leading-relaxed text-slate-800 space-y-4 font-medium p-2">
                    <div className="bg-purple-50/70 border-2 border-purple-100 p-5 rounded-2xl">
                      <h4 className="font-black text-purple-900 text-sm mb-3">🛠️ e-havuzz Geliştirme Notları & Süreç Özeti</h4>
                      <ul className="space-y-3 text-xs md:text-sm text-slate-700">
                        <li><strong>1. Aşama: Statik Mimari ve UX Prototipleme</strong><p className="text-slate-600 font-normal mt-0.5">Projenin ilk aşamasında tüm e-ticaret akışı statik bir JSON kümesi ve React Context API ile yönetildi.</p></li>
                        <li><strong>2. Aşama: Altyapı Seçimi ve Vite Entegrasyonu</strong><p className="text-slate-600 font-normal mt-0.5">Geliştirme sürecine hızlı bir başlangıç yapabilmek amacıyla Vite mimarisi üzerine kurulu React altyapısı tercih edildi.</p></li>
                        <li><strong>3. Aşama: Dinamik Sayfa Yönlendirmeleri</strong><p className="text-slate-600 font-normal mt-0.5">Kullanıcı akışını kesintisiz hale getirmek amacıyla BrowserRouter ve Route bileşenleri kullanılarak sayfa yönlendirmeleri kurgulandı.</p></li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeModal === "hakkimizda" && (
                  <div className="bg-cyan-50 p-4 rounded-xl border-2 border-cyan-100 text-xs md:text-sm text-slate-800 font-medium">
                    <h4 className="text-base font-black text-purple-800 uppercase tracking-tight">✨ Platformumuz Hakkında</h4>
                    <p className="mt-1">HavuzMarket, modern otomasyon çözümlerinden endüstriyel havuz kimyasallarına kadar uzanan 20 premium ürünüyle, kurumsal yasal regülasyonlara tam uyumlu dijital tedarik altyapısı sunar.</p>
                  </div>
                )}

                {activeModal === "kargo" && (
                  <div className="bg-cyan-50/50 p-4 rounded-2xl border-2 border-cyan-100 text-xs md:text-sm leading-relaxed">
                    <h4 className="font-black text-cyan-900 text-sm mb-2 flex items-center gap-1.5"><Truck className="w-4 h-4" /> Kargo ve Teslimat Bilgilendirmesi</h4>
                    <p>Siparişleriniz anlaşmalı kargo firmamız olan **Yurtiçi Kargo** ile sigortalı olarak gönderilir. 1000₺ ve üzeri alışverişlerinizde kargo tamamen ücretsizdir.</p>
                  </div>
                )}

                {activeModal === "login" && (
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                    <input type="text" required placeholder="Kullanıcı Adı" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border-2 text-xs font-bold focus:outline-none" />
                    <input type="password" required placeholder="Şifre" className="w-full p-3 rounded-xl bg-slate-50 border-2 text-xs font-bold focus:outline-none" />
                    <button type="submit" className="w-full bg-purple-600 text-white font-black py-3 rounded-xl text-xs uppercase">Giriş Yap</button>
                  </form>
                )}

                {/* ÜYE OLMA BÖLÜMÜ (Bölüm 2) */}
                {activeModal === "register" && (
                  <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3 animate-fadeIn">
                    <p className="text-xs text-slate-500 font-bold mb-1">Havuz Market ayrıcalıklarından yararlanmak için formu eksiksiz doldurun.</p>
                    <input type="text" required placeholder="Ad Soyad" value={registerForm.fullname} onChange={(e) => setRegisterForm({...registerForm, fullname: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 text-xs font-bold outline-none" />
                    <input type="text" required maxLength="11" placeholder="TC Kimlik Numarası" value={registerForm.tcNo} onChange={(e) => setRegisterForm({...registerForm, tcNo: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 text-xs font-bold outline-none" />
                    <input type="tel" required placeholder="Telefon Numarası" value={registerForm.phone} onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 text-xs font-bold outline-none" />
                    <textarea required rows="2" placeholder="Teslimat Adresi" value={registerForm.city} onChange={(e) => setRegisterForm({...registerForm, city: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 text-xs font-bold outline-none"></textarea>
                    
                    {/* Onay Kutusu 1 (Zorunlu) - SUB MODAL AKIŞIYLA ENTEGRE */}
                    <div className="mt-1 flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border">
                      <input type="checkbox" id="kvkkCheck" required checked={kvkkRegisterCheck} onChange={(e) => setKvkkRegisterCheck(e.target.checked)} className="mt-0.5 cursor-pointer" />
                      <label htmlFor="kvkkCheck" className="text-[10px] font-bold text-slate-600 leading-tight cursor-pointer">
                        e-havuzz <span onClick={() => setSubModalOpen("sozlesme")} className="text-purple-700 underline font-black cursor-pointer">Üyelik Sözleşmesi</span>'ni ve <span onClick={() => setSubModalOpen("kvkk")} className="text-purple-700 underline font-black cursor-pointer">KVKK Aydınlatma Metni</span>'ni okudum, kabul ediyorum.
                      </label>
                    </div>

                    {/* Onay Kutusu 2 (İsteğe Bağlı Pazarlama İzni) */}
                    <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border">
                      <input type="checkbox" id="comCheck" checked={commercialIletiCheck} onChange={(e) => setCommercialIletiCheck(e.target.checked)} className="mt-0.5 cursor-pointer" />
                      <label htmlFor="comCheck" className="text-[10px] font-bold text-slate-600 leading-tight cursor-pointer">
                        e-havuzz tarafından tarafıma kampanya, indirim, bülten ve pazarlama amaçlı ticari elektronik ileti (SMS, E-posta) gönderilmesine onay veriyorum.
                      </label>
                    </div>

                    <button type="submit" disabled={!kvkkRegisterCheck} className={`w-full font-black py-3 rounded-xl text-xs uppercase tracking-wide shadow-sm mt-1 transition-all ${kvkkRegisterCheck ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                      Kayıt İşlemini Tamamla
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER VE ANA GÖVDE */}
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
            <button type="button" onClick={() => { setActiveModal("kargo"); }} className="px-4 py-2 rounded-xl font-black border border-purple-600 bg-white text-purple-700 text-xs">📋 Sipariş Sorgula</button>

            <div onClick={() => setActiveModal("sepet")} className="relative cursor-pointer text-slate-800 hover:text-purple-700 bg-slate-100 p-2.5 rounded-xl border-2 shadow-sm">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border border-white">{cart.length}</span>}
            </div>
          </div>
        </header>

        {/* AI KUTUSU */}
        <div className="max-w-[1400px] mx-auto px-6 mt-6">
          <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-[#00b4d8] p-6 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between shadow-2xl border-2 border-purple-500/40 relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-amber-400 to-purple-600 p-3 rounded-2xl shadow-lg shrink-0"><Sparkles className="w-6 h-6 text-white" /></div>
              <div>
                <h4 className="font-black text-lg tracking-wide">Arpeta AI Akıllı Karar Motoru Aktif!</h4>
                <p className="text-xs text-purple-100 font-bold max-w-xl mt-1 leading-relaxed">"Merhaba! Havuz otomasyon altyapınız, sepet akışınız ve modern mimarimizle ilgili tüm sorularınızı yanıtlamaya hazırım."</p>
              </div>
            </div>
            <button onClick={() => setActiveModal("asistan")} className="w-full md:w-auto bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs px-6 py-4 rounded-xl hover:scale-105 transition-all shadow-xl uppercase shrink-0">🚀 ASİSTANA SORU SOR</button>
          </div>
        </div>

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
                    <div className="flex items-center justify-between mt-4 border-t pt-3 border-slate-100">
                      <span className="text-base font-black text-slate-900">₺{product.price.toLocaleString('tr-TR')}</span>
                      <button onClick={() => addToCart(product)} className="bg-purple-600 hover:bg-cyan-500 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-colors shadow-md uppercase">Sepete Ekle</button>
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
              <button onClick={() => setActiveModal("kargo")} className="flex items-center gap-3 p-3 rounded-xl text-xs font-black text-slate-700 border hover:bg-emerald-50 w-full text-left"><Truck className="w-4 h-4 text-emerald-500" /> Kargo & Teslimat</button>
              <button onClick={() => setActiveModal("iade")} className="flex items-center gap-3 p-3 rounded-xl text-xs font-black text-slate-700 border hover:bg-rose-50 w-full text-left"><X className="w-4 h-4 text-rose-500" /> İade & Değişim</button>
            </div>
          </aside>
        </div>
      </div>

      {/* YASAL KURALLARA TAM UYUMLU KURUMSAL FOOTER ALANI (Bölüm 4) */}
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

          {/* SİTENİN HER YERİNDEN ERİŞİLEBİLİR YASAL FOOTER LINKLERI */}
          <div>
            <h5 className="text-white font-black text-xs uppercase tracking-wider mb-3">Kurumsal & Yasal</h5>
            <ul className="space-y-2 font-semibold text-slate-400">
              <li onClick={() => setActiveModal("hakkimizda")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Hakkımızda</li>
              <li onClick={() => setActiveModal("kvkk")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ KVKK Aydınlatma Metni</li>
              <li onClick={() => setActiveModal("cerez")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Çerez (Cookie) Politikası</li>
              <li onClick={() => setActiveModal("sozlesme")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Üyelik Sözleşmesi</li>
              <li onClick={() => setActiveModal("iade")} className="hover:text-cyan-400 cursor-pointer transition-colors">✦ Mesafeli Satış & İade Şartları</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-black text-xs uppercase tracking-wider mb-3">İletişim</h5>
            <ul className="space-y-2 font-semibold text-slate-400">
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-400" /> Savaş Mahallesi, İskenderun / Hatay, Türkiye</li>
              <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 shrink-0 text-cyan-400" /> destek@havuzmarket.com</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-950 text-center py-4 text-[11px] text-slate-500 border-t border-slate-900 font-bold">&copy; 2026 HavuzMarket. Tüm Hakları Saklıdır. Powered by ARPETA</div>
      </footer>

      {/* BÖLÜM 1: ÇEREZ (COOKIE) POP-UP BANNER'I */}
      {cookieBannerOpen && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-slate-900 text-white p-5 rounded-2xl shadow-2xl z-50 border-2 border-cyan-400 animate-slideUp flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Cookie className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h5 className="font-black text-xs uppercase tracking-wider">🍪 Çerez (Cookie) İzin Yönetimi</h5>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
            e-havuzz olarak, sitemizdeki kullanıcı deneyimini iyileştirmek, sayfalarımızı optimize etmek ve ilgi alanlarınıza göre kişiselleştirilmiş reklamlar sunabilmek adına zorunlu, analitik ve pazarlama çerezleri kullanıyoruz.[cite: 1] Çerezler hakkında detaylı bilgiye <span onClick={() => setActiveModal("cerez")} className="text-cyan-400 underline font-bold cursor-pointer">Çerez Politikası</span> metnimizden ulaşabilirsiniz.
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