import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Search, User, HelpCircle, FileText, Truck, Mail, MapPin, Sparkles, Filter, CheckCircle, X, LogIn, UserPlus, ArrowLeft, CreditCard } from 'lucide-react';

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

  // Form ve Takip State Yapıları
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ fullname: '', city: '', phone: '', email: '', tcNo: '' });
  const [cardInfo, setCardInfo] = useState({ name: '', number: '', date: '', cvc: '' });
  const [simulatedOrderStatus, setSimulatedOrderStatus] = useState("Hazırlanıyor"); 
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Beyaz ekranı önleyen can kurtaran state!

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Tam 20 Ürünlük Yapay Zeka Destekli Liste
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
    { id: 220, name: "Geçmeli Havuz Kenar Izgara Köşe Parçası", category: "Ekipmanlar", price: 190, image: "https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=500&q=80", tag: "Yedek Parça", moods: ["sakin"] },
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
    if (paymentSuccess) setPaymentSuccess(false); // Yeni sipariş için ekranı temizler
    setCart([...cart, product]);
    setNotification(`✅ ${product.name} sepete eklendi!`);
  };

 
  const handleOrderSubmit = (e) => {
    e.preventDefault(); 
    setPaymentSuccess(true); // Başarı ekranını modalın içinde tetikler
    setSimulatedOrderStatus("Hazırlanıyor");
    setNotification("📦 PayTR Ödemesi Başarılı! Siparişiniz Alındı.");
  };

  const clearCartAfterSuccess = () => {
    setCart([]);
    setPaymentSuccess(false);
    setActiveModal("");
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
      setAsistanCevap("🤖 Akıllı Asistan: Havuz temizliği için sana harika bir önerim var güzelim! Arka plandaki mağazada 'Temizlik' kategorisini senin için süzdüm. Özellikle v4 Pro Robot modelimizi incelemeni öneririm!");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 213));
    } else if (soruLower.includes("klor") || soruLower.includes("kimyasal")) {
      setSearchQuery("Klor");
      setAsistanCevap("🤖 Akıllı Asistan: Havuzun pırıl pırıl kalması ve dezenfeksiyonu için 'Kimyasallar' kategorisindeki stabilizatörlü Granül Klor ürünümüzü listeledim.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 211));
    } else if (soruLower.includes("pompa") || soruLower.includes("devirdaim")) {
      setSearchQuery("Pompa");
      setAsistanCevap("🤖 Akıllı Asistan: Sirkülasyon ve filtreleme döngüsü için 2 HP Yüksek Verimli Pompa modelimizi listeledim. Düşük desibel sessiz çalışma teknolojisine sahiptir.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 214));
    } else if (soruLower.includes("ışık") || soruLower.includes("led") || soruLower.includes("aydınlatma")) {
      setSearchQuery("LED");
      setAsistanCevap("🤖 Akıllı Asistan: Gece keyfi ve ambiyans için kumandalı AquaGlow LED serimizi listeledim. Enerji tasarruflu 12V altyapıya sahiptir.");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 201));
    } else if (soruLower.includes("şelale") || soruLower.includes("fıskiye")) {
      setSearchQuery("Şelale");
      setAsistanCevap("🤖 Akıllı Asistan: Harika bir tercih! Lüks Şelale Fıskiyesi modelimiz havuzunuza modern bir hava katarken, su sesiyle harika bir dinginlik sağlar canım. Ürün arka planda listelendi!");
      setAsistanOnerilenUrun(mock20Products.find(p => p.id === 212));
    } else {
      setSearchQuery("");
      setAsistanCevap("🤖 Akıllı Asistan: Sorunu anladım güzelim! İstediğin ürünü yukarıdaki arama motoruna yazarak ya da kategorilerden süzerek anında 20 premium ürün arasından bulabilirsin. Arpeta altyapısı hizmetinde!");
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
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-900 via-purple-900 to-[#00b4d8] text-white">
              <h3 className="font-black text-sm md:text-base flex items-center gap-2 tracking-wide">
                {activeModal === "sepet" && "🛒 Alışveriş Sepetiniz & PayTR Ödeme"}
                {activeModal === "asistan" && "🤖 Akıllı Havuz Asistanı"}
                {activeModal === "kargo" && "🚚 Sipariş Takip Paneli"}
                {activeModal === "login" && "🔑 Üye Girişi"}
                {activeModal === "register" && "📝 Yeni Üye Kaydı"}
                {activeModal === "blog" && "📝 E-Havuz Market Blog"}
                {activeModal === "hakkimizda" && "✨ Hakkımızda"}
              </h3>
              <button onClick={() => { if (paymentSuccess) { clearCartAfterSuccess(); } else { setActiveModal(""); } }} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-slate-700 flex-1 flex flex-col justify-between">
              <div>
                
                {/* SEPET + PAYTR ÖDEME FORMU ALANI */}
                {activeModal === "sepet" && (
                  <div className="text-sm">
                    {paymentSuccess ? (
                     
                      <div className="text-center py-6 flex flex-col items-center gap-5 animate-fadeIn">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-400">
                          <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-base">🎉 PayTR Ödemesi Başarıyla Alındı!</h4>
                          <p className="text-xs text-slate-500 font-bold mt-1">Siparişiniz sistemimize kaydedilmiştir ve hazırlanmaktadır bebek.</p>
                        </div>
                        
                        {}
                        <div className="w-full flex justify-between items-center px-4 mt-2 relative">
                          <div className="absolute left-6 right-6 top-4 h-1 bg-slate-200 -z-10"></div>
                          <div className="flex flex-col items-center gap-1 bg-white px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${simulatedOrderStatus === "Hazırlanıyor" || simulatedOrderStatus === "Yola Çıktı" || simulatedOrderStatus === "Tamamlandı" ? 'bg-purple-600 text-white' : 'bg-slate-200'}`}>1</div>
                            <span className="text-[10px] font-black text-purple-700">Sipariş Alındı</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 bg-white px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${simulatedOrderStatus === "Yola Çıktı" || simulatedOrderStatus === "Tamamlandı" ? 'bg-purple-600 text-white' : 'bg-slate-200'}`}>2</div>
                            <span className="text-[10px] font-black text-slate-700">Hazırlanıyor</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 bg-white px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${simulatedOrderStatus === "Tamamlandı" ? 'bg-purple-600 text-white' : 'bg-slate-200'}`}>3</div>
                            <span className="text-[10px] font-black text-slate-700">3 Günde Kargoda</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-2 w-full">
                          <button type="button" onClick={() => setSimulatedOrderStatus("Hazırlanıyor")} className="flex-1 bg-purple-100 text-purple-800 text-[9px] font-black py-1.5 rounded-md uppercase">Sipariş Alındı</button>
                          <button type="button" onClick={() => setSimulatedOrderStatus("Yola Çıktı")} className="flex-1 bg-slate-100 text-slate-800 text-[9px] font-black py-1.5 rounded-md uppercase">Hazırlanıyor</button>
                          <button type="button" onClick={() => setSimulatedOrderStatus("Tamamlandı")} className="flex-1 bg-emerald-100 text-emerald-800 text-[9px] font-black py-1.5 rounded-md uppercase">3 Günde Kargoda</button>
                        </div>

                        <button type="button" onClick={clearCartAfterSuccess} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl text-xs uppercase mt-2">
                          Alışverişe Devam Et
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {cart.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border">
                            <span className="font-bold text-xs text-slate-900 line-clamp-1">{item.name}</span>
                            <span className="font-black text-xs text-purple-700 shrink-0">1 adet / ₺{item.price}</span>
                          </div>
                        ))}

                        <div className="border-t pt-3 flex flex-col gap-1.5 border-dashed">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                            <span>Ürünler Toplamı:</span>
                            <span>₺{sepetUrunToplam.toLocaleString('tr-TR')}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                            <span>Kargo Ücreti:</span>
                            <span className={kargoUcreti === 0 ? "text-emerald-600 font-black" : "text-slate-800"}>
                              {kargoUcreti === 0 ? "Ücretsiz Kargo" : `₺${kargoUcreti}`}
                            </span>
                          </div>
                          {kargoUcreti === 0 && (
                            <div className="text-[10px] bg-emerald-50 text-emerald-700 font-black p-2 rounded-xl border border-emerald-200 text-center uppercase tracking-wide mt-1">
                              🎉 1000₺ Üzeri Alışverişlerde Ücretsiz Kargo Avantajı Uygulandı!
                            </div>
                          )}
                          <div className="flex justify-between items-center font-black text-slate-900 text-base border-t pt-2 mt-1">
                            <span>Genel Toplam Tutar:</span>
                            <span className="text-xl text-purple-700">₺{sepetToplamTutar.toLocaleString('tr-TR')}</span>
                          </div>
                        </div>

                        {/* GERÇEK VE GÜVENLİ FORM METODU */}
                        <form onSubmit={handleOrderSubmit} className="mt-2 bg-slate-50 p-4 rounded-2xl border-2 border-purple-200 flex flex-col gap-3">
                          <span className="font-black text-xs text-purple-900 uppercase flex items-center gap-1">🔒 PayTR Güvenli Ödeme Altyapısı</span>
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-0.5">Kart Üzerindeki İsim</label>
                            <input type="text" required placeholder="NURAY MUTLU" value={cardInfo.name} onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})} className="w-full p-2 text-xs font-bold rounded-xl border bg-white focus:border-purple-600 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-0.5">Kart Numarası</label>
                            <input type="text" required maxLength="16" placeholder="4000123456789010" value={cardInfo.number} onChange={(e) => setCardInfo({...cardInfo, number: e.target.value})} className="w-full p-2 text-xs font-bold rounded-xl border bg-white focus:border-purple-600 outline-none" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-500 mb-0.5">AA/YY</label>
                              <input type="text" required placeholder="12/29" className="w-full p-2 text-xs font-bold rounded-xl border border-slate-300 bg-white outline-none" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-500 mb-0.5">CVC</label>
                              <input type="text" required maxLength="3" placeholder="000" className="w-full p-2 text-xs font-bold rounded-xl border border-slate-300 bg-white outline-none" />
                            </div>
                          </div>
                          
                          <button type="submit" className="w-full bg-purple-600 hover:bg-cyan-500 text-white font-black py-3 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider mt-2 flex items-center justify-center gap-2">
                            <CreditCard className="w-4 h-4" /> Siparişi Onayla ve Öde ➔
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* PASİF KARGO MODAL PANELİ (Sadece Üst Menü Sipariş Sorgula İçin) */}
                {activeModal === "kargo" && (
                  <div className="text-center py-4 flex flex-col items-center gap-4">
                    <Truck className="w-10 h-10 text-purple-600 animate-bounce" />
                    <h4 className="font-black text-slate-900 text-base">🚚 Sipariş Takip Paneli</h4>
                    
                    <div className="w-full flex justify-between items-center px-4 mt-2 relative">
                      <div className="absolute left-6 right-6 top-4 h-1 bg-slate-200 -z-10"></div>
                      <div className="flex flex-col items-center gap-1 bg-white px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${simulatedOrderStatus === "Hazırlanıyor" || simulatedOrderStatus === "Yola Çıktı" || simulatedOrderStatus === "Tamamlandı" ? 'bg-purple-600 text-white' : 'bg-slate-200'}`}>1</div>
                        <span className="text-[10px] font-black text-purple-700">Sipariş Alındı</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 bg-white px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${simulatedOrderStatus === "Yola Çıktı" || simulatedOrderStatus === "Tamamlandı" ? 'bg-purple-600 text-white' : 'bg-slate-200'}`}>2</div>
                        <span className="text-[10px] font-black text-slate-700">Hazırlanıyor</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 bg-white px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${simulatedOrderStatus === "Tamamlandı" ? 'bg-purple-600 text-white' : 'bg-slate-200'}`}>3</div>
                        <span className="text-[10px] font-black text-slate-700">3 Günde Kargoda</span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs font-bold text-purple-900 w-full leading-relaxed">
                      {simulatedOrderStatus === "Hazırlanıyor" && "✅ Harika! Siparişiniz başarıyla sistemimize ulaştı. Havuz uzmanlarımız ürünlerinizi hazırlamaya başladı bile bebek. En geç 3 gün içinde kargoya teslim edilecektir."}
                      {simulatedOrderStatus === "Yola Çıktı" && "📦 Siparişiniz şu an Arpeta Dağıtım Merkezi'nde paketlenme aşamasındadır."}
                      {simulatedOrderStatus === "Tamamlandı" && "🚀 Kargonuz başarıyla yola çıktı, teslimat adresine doğru ilerliyor!"}
                    </div>

                    <div className="flex gap-2 mt-2 w-full">
                      <button type="button" onClick={() => setSimulatedOrderStatus("Hazırlanıyor")} className="flex-1 bg-purple-100 text-purple-800 text-[9px] font-black py-1 rounded-md uppercase">Sipariş Alındı</button>
                      <button type="button" onClick={() => setSimulatedOrderStatus("Yola Çıktı")} className="flex-1 bg-slate-100 text-slate-800 text-[9px] font-black py-1 rounded-md uppercase">Hazırlanıyor</button>
                      <button type="button" onClick={() => setSimulatedOrderStatus("Tamamlandı")} className="flex-1 bg-emerald-100 text-emerald-800 text-[9px] font-black py-1 rounded-md uppercase">3 Günde Kargoda</button>
                    </div>
                  </div>
                )}

                {activeModal === "login" && (
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                    <input type="text" required placeholder="Kullanıcı Adı" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border-2 text-xs font-bold" />
                    <input type="password" required placeholder="Şifre" className="w-full p-3 rounded-xl bg-slate-50 border-2 text-xs font-bold" />
                    <button type="submit" className="w-full bg-purple-600 text-white font-black py-3 rounded-xl text-xs uppercase">Giriş Yap</button>
                  </form>
                )}

                {activeModal === "register" && (
                  <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3 animate-fadeIn">
                    <p className="text-xs text-slate-500 font-bold mb-1">Havuz Market ayrıcalıklarından yararlanmak için formu eksiksiz doldurun bebek.</p>
                    <input type="text" required placeholder="Ad Soyad" value={registerForm.fullname} onChange={(e) => setRegisterForm({...registerForm, fullname: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 text-xs font-bold" />
                    <input type="text" required maxLength="11" placeholder="11 Haneli TC Kimlik No" value={registerForm.tcNo} onChange={(e) => setRegisterForm({...registerForm, tcNo: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 text-xs font-bold" />
                    <input type="tel" required placeholder="0555 XXXXXXX" value={registerForm.phone} onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 text-xs font-bold" />
                    <textarea required rows="2" placeholder="Açık adresinizi buraya yazın..." value={registerForm.city} onChange={(e) => setRegisterForm({...registerForm, city: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 text-xs font-bold"></textarea>
                    <button type="submit" className="w-full bg-cyan-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wide shadow-sm mt-1">Kayıt İşlemini Tamamla</button>
                  </form>
                )}

                {activeModal === "blog" && (
                  <div className="flex flex-col gap-4 text-xs md:text-sm leading-relaxed font-medium text-slate-800">
                    <div className="bg-purple-50/70 border-2 border-purple-100 p-5 rounded-2xl">
                      <h4 className="font-black text-slate-900 text-sm mb-1 text-purple-900">📝 Bir Bilgisayar Mühendisliği Öğrencisinin E-Ticaret Geliştirme Günlüğü</h4>
                      <span className="text-[10px] text-slate-500 font-black block mb-3">Yazar: Arpeta R&D Stajyeri Nuray | Temmuz 2026</span>
                      <p className="mb-3">Merhaba! Bir bilgisayar mühendisliği 2. sınıf öğrencisi olarak bu projeye başladığımda amacım sadece bir arayüz tasarlamak değil, gerçek bir e-ticaret akışını sıfırdan kurmaktı. Geliştirme sürecinde en çok zevk aldığım ama bir o kadar da zorlandığım an, dinamik filtreleme state'leri ile canlı backend entegrasyonunu sağlamaktı.</p>
                      <p className="mb-3">Ufak tefek Git çakışmaları, terminaldeki LF/CRLF satır sonu uyarıları ve 'sepetToplamTutar' değişkenindeki görünmez boşluk hataları bana kod yazarken ne kadar titiz olunması gerektiğini bir kez daha öğretti. Her hatayı adım adım çözüp, İrem Hanım'ın ve ekibin değerli yönlendirmeleriyle platformu PayTR sanal POS simülasyonu ve 3 kademeli sipariş takip sistemine kadar genişletmeyi başardık.</p>
                      <p>Bu süreç, teorik bilgilerimi sektörel bir premium altyapıya dönüştürme yolunda benim için harika bir dönüm noktası oldu. Teknolojiyi ve kod yazmayı çok seviyorum!</p>
                    </div>
                  </div>
                )}

                {activeModal === "hakkimizda" && (
                  <div className="flex flex-col gap-3 text-xs md:text-sm text-slate-800 font-medium">
                    <h4 className="text-base font-black text-purple-800 uppercase tracking-tight">✨ Platformumuz Hakkında</h4>
                    <p className="text-slate-950 font-bold italic bg-cyan-50 p-4 rounded-xl border-2 border-cyan-100 leading-relaxed">
                      "HavuzMarket, modern otomasyon çözümlerinden endüstriyel havuz kimyasallarına kadar uzanan 20 premium ürünüyle, kullanıcılarına uçtan uca kusursuz bir dijital tedarik deneyimi sunmak amacıyla Arpeta Yazılım bünyesinde geliştirilmiştir."
                    </p>
                    <p className="mt-1">Yapay zeka destekli akıllı karar motorumuz, kullanıcıların anlık ruh hallerine and havuz durum analizlerine göre en doğru ekipmanı listeler. Güvenli PayTR ödeme geçidi ve şeffaf 3 aşamalı sipariş takip modülümüzle sektörel standartları yeniden belirliyoruz.</p>
                  </div>
                )}

                {activeModal === "asistan" && (
                  <div className="flex flex-col gap-4 text-sm">
                    <p className="text-xs text-slate-500 font-bold">Havuz bakımı, temizliği veya aydınlatma ihtiyaçlarınızı yazın, akıllı asistan anlık süzüp ürün önersin bebek.</p>
                    <form onSubmit={handleAsistanSorgu} className="flex gap-2">
                      <input type="text" required value={asistanSoru} onChange={(e) => setAsistanSoru(e.target.value)} placeholder="Örn: havuzu temizlemek için ne almalıyım?" className="flex-1 p-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold focus:outline-none focus:border-purple-600" />
                      <button type="submit" className="bg-purple-600 text-white font-black text-xs px-5 rounded-xl uppercase shadow-sm">Sorgula</button>
                    </form>
                    
                    {asistanCevap && (
                      <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-2xl text-xs text-purple-900 font-extrabold leading-relaxed flex flex-col gap-3 animate-fadeIn">
                        <p>{asistanCevap}</p>
                        {asistanOnerilenUrun && (
                          <div className="mt-1 bg-white p-3 rounded-xl border border-purple-200 flex items-center justify-between gap-3 shadow-sm">
                            <div className="flex flex-col">
                              <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full w-fit font-black mb-1 uppercase">{asistanOnerilenUrun.tag}</span>
                              <span className="font-extrabold text-slate-900 text-xs line-clamp-1">{asistanOnerilenUrun.name}</span>
                              <span className="font-black text-cyan-600 text-xs mt-0.5">₺{asistanOnerilenUrun.price.toLocaleString('tr-TR')}</span>
                            </div>
                            <button type="button" onClick={() => { addToCart(asistanOnerilenUrun); setActiveModal(""); }} className="bg-cyan-500 hover:bg-purple-600 text-white font-black text-[10px] px-3 py-2 rounded-lg uppercase tracking-wider shrink-0 transition-colors">Hemen Ekle</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <button onClick={() => { if (paymentSuccess) { clearCartAfterSuccess(); } else { setActiveModal(""); } }} className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-black text-xs px-5 py-2 rounded-xl transition-all shadow-sm border">
                <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Geri Dön
              </button>
            </div>

          </div>
        </div>
      )}

      {/* HEADER BARI VE ANA SAYFA TASARIMI */}
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
            <label className="block text-[11px] font-black text-purple-900 mb-1 tracking-wide uppercase">🔍 Aradığınız ürün nedir?</label>
            <div className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Örn: led lamba, şelale, klor, pompa, fıskiye..." className="w-full pl-5 pr-12 py-3 border-2 border-slate-300 rounded-full focus:outline-none focus:border-cyan-500 bg-slate-50 font-bold text-sm shadow-inner transition-all" />
              <Search className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-3 text-sm shrink-0">
            <button type="button" onClick={() => setActiveModal("login")} className="text-slate-700 hover:text-purple-700 flex items-center gap-1 font-extrabold border-2 border-slate-200 px-4 py-2 rounded-xl bg-slate-50 text-xs shadow-sm">Giriş Yap</button>
            <button type="button" onClick={() => setActiveModal("register")} className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-extrabold text-xs">Üye Ol</button>
            <button type="button" onClick={() => { setActiveModal("kargo"); }} className="px-4 py-2 rounded-xl font-black border border-purple-600 bg-white text-purple-700 text-xs">📋 Sipariş Sorgula</button>

            <div onClick={() => setActiveModal("sepet")} className="relative cursor-pointer text-slate-800 hover:text-purple-700 bg-slate-100 p-2.5 rounded-xl border-2 shadow-sm">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md border border-white">{cart.length}</span>}
            </div>
          </div>
        </header>

        {/* AI MOTORU KUTUSU */}
        <div className="max-w-[1400px] mx-auto px-6 mt-6">
          <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-[#00b4d8] p-6 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between shadow-2xl border-2 border-purple-500/40 relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-amber-400 to-purple-600 p-3 rounded-2xl shadow-lg shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-black text-lg md:text-xl tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Arpeta AI Akıllı Karar Motoru Aktif!</h4>
                <p className="text-xs text-purple-100 font-bold max-w-xl mt-1 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">"Merhaba! Havuz otomasyon altyapınız, sepet akışınız ve modern mimarimizle ilgili tüm sorularınızı yanıtlamaya hazırım güzelim."</p>
              </div>
            </div>
            <button onClick={() => setActiveModal("asistan")} className="w-full md:w-auto bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs px-6 py-4 rounded-xl hover:scale-105 transition-all shadow-xl uppercase shrink-0">🚀 ASİSTANA SORU SOR</button>
          </div>
        </div>

        {/* MAĞAZA GÖVDESİ */}
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

            {/* DİNAMİK VİTRİN */}
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
            </div>
          </aside>
        </div>
      </div>

      <footer className="bg-slate-950 text-slate-300 mt-16 border-t-4 border-purple-600 text-center py-6 text-[11px] font-bold">&copy; 2026 HavuzMarket. Tüm Hakları Saklıdır.</footer>
    </div>
  );
}