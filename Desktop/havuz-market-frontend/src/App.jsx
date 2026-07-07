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

  // Form ve Takip State Yapıları
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ fullname: '', city: '', phone: '', email: '' });
  const [cardInfo, setCardInfo] = useState({ name: '', number: '', date: '', cvc: '' });
  const [trackingEmail, setTrackingEmail] = useState("");
  const [simulatedOrderStatus, setSimulatedOrderStatus] = useState(""); // Hazırlanıyor, Yola Çıktı, Tamamlandı

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  
  const mock20Products = [
    { id: 201, name: "AquaGlow Turkuaz LED Havuz Aydınlatma", category: "Aydınlatma", price: 1450, image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&q=60", tag: "Yeni Sezon", moods: ["keyifli", "teknolojik"], aiInsight: "💡 Bugün alabilirsiniz, önümüzdeki 7 günde fiyatı %6 artabilir!" },
    { id: 202, name: "Rio Masaj Etkili Paslanmaz Havuz Şelalesi", category: "Ekipmanlar", price: 12800, image: "https://images.unsplash.com/photo-1562184560-a11b7cf7c847?w=500&q=60", tag: "Özel Tasarım", moods: ["yorgun", "sakin"], aiInsight: "🔥 Son 3 günün en düşük fiyatı! Kaçırmayın." },
    { id: 203, name: "EcoFilter Premium Cam Havuz Kumu 20 kg", category: "Ekipmanlar", price: 340, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=60", tag: "En Çok Satan", moods: ["titiz", "sakin"], aiInsight: "📉 Fiyatı şu an kararlı durumda. Güvenle alabilirsiniz." },
    { id: 204, name: "SmartPool Bluetooth Akıllı Dozaj Pompası", category: "Pompalar", price: 18500, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=60", tag: "Akıllı Ürün", moods: ["teknolojik", "titiz"], aiInsight: "🤖 Yapay Zeka Öngörüsü: Gelecek ay stok durumuna bağlı olarak fiyatı yükselebilir." },
    { id: 205, name: "Olimpik Stil Havuz Emniyet ve Kulvar Çizgisi", category: "Ekipmanlar", price: 2100, image: "https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=500&q=60", tag: "Güvenlik", moods: ["sakin", "titiz"], aiInsight: "💡 Sezon ortası indirimi: Son 48 saatin en iyi fiyatı." },
    { id: 206, name: "DeepClean Profesyonel Havuz Temizlik Süpürgesi", category: "Temizlik", price: 950, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=60", tag: "Pratik Ürün", moods: ["titiz", "yorgun"], aiInsight: "⚡ Önümüzdeki 5 günde fiyatı %4 artış eğiliminde görünüyor." },
    { id: 207, name: "ThermoComfort Dijital Havuz Suyu Isı Ölçer", category: "Aydınlatma", price: 420, image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=60", tag: "Yeni", moods: ["teknolojik"], aiInsight: "📉 Fiyat analizine göre şu an satın almak için en ideal dönem." },
    { id: 208, name: "Premium Paslanmaz Havuz Giriş Merdiveni (4 Basamak)", category: "Ekipmanlar", price: 4750, image: "https://images.unsplash.com/photo-1572331507600-664123d1115e?w=500&q=60", tag: "Lüks", moods: ["sakin"], aiInsight: "🔥 Son 3 günün en düşük fiyatı fırsatını yakalayın." },
    { id: 209, name: "Anti-Yosun Concentre Havuz Bakım Sıvısı 10 L", category: "Kimyasallar", price: 780, image: "https://images.unsplash.com/photo-1527156279143-6cd52a32c2a1?w=500&q=60", tag: "Etkili Formül", moods: ["titiz"], aiInsight: "💡 Kimyasal ürünlerde kur dalgalanması öncesi bugün almanız önerilir." },
    { id: 210, name: "SolarTarpaulin Isı Koruyucu Havuz Temizlik Brbrandası", category: "Temizlik", price: 3200, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=60", tag: "Çevre Dostu", moods: ["keyifli"], aiInsight: "📈 Yapay zeka talebin arttığını öngörüyor, fiyat %8 yükselebilir!" },
    { id: 211, name: "Premium Havuz Kloru 25 KG (Granül %56)", category: "Kimyasallar", price: 2450, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=60", tag: "Çok Satan", moods: ["titiz"], aiInsight: "💡 Maksimum dezenfeksiyon performansı sağlayan stabilizatörlü formül." },
    { id: 212, name: "Paslanmaz Çelik Şelale Fıskiyesi Geniş Tip", category: "Ekipmanlar", price: 14500, image: "https://images.unsplash.com/photo-1562184560-a11b7cf7c847?w=500&q=60", tag: "Mimari", moods: ["sakin", "yorgun"], aiInsight: "🌊 Estetik su perdesi tasarımıyla havuzunuza modern bir hava katar." },
    { id: 213, name: "Yüzey Sıyırıcı Skimmer Geniş Ağızlı Set", category: "Ekipmanlar", price: 1200, image: "https://images.unsplash.com/photo-1572331507600-664123d1115e?w=500&q=60", tag: "Gerekli", aiInsight: "💡 Yüzeydeki yaprak ve partikülleri filtre haznesine çeker." },
    { id: 214, name: "Düşük Desibel Havuz Sirkülasyon Pompası 2 HP", category: "Pompalar", price: 11200, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=60", tag: "Yüksek Güç", aiInsight: "⚡ Enerji tasarruflu ECO motoruyla sessiz devirdaim yapar." },
    { id: 215, name: "Sualtı Paslanmaz Masaj Jet Nozulu", category: "Ekipmanlar", price: 2100, image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&q=80", tag: "Keyif", moods: ["yorgun", "keyifli"], aiInsight: "💆‍♂️ Basınçlı hava ve su karışımı ile harika bir jakuzi etkisi." },
    { id: 216, name: "Güneş Enerjili Akıllı Havuz İyonizeri", category: "Ekipmanlar", price: 4300, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=60", tag: "Ekolojik", moods: ["teknolojik"], aiInsight: "🤖 Kimyasal kullanımını %80 azaltan solar mineral teknolojisi." },
    { id: 217, name: "Havuz Süpürge Hortumu Kendinden Yüzer 15m", category: "Temizlik", price: 1650, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=60", tag: "Esnek", moods: ["titiz"], aiInsight: "⚡ Kırılmaz özel takviyeli iç çeper yapısına sahiptir." },
    { id: 218, name: "Lineer Havuz Kenar Izgarası Geçmeli Set", category: "Ekipmanlar", price: 450, image: "https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=500&q=60", tag: "Güvenlik", moods: ["sakin"], aiInsight: "💡 Anti-slip kaymaz yüzey dokusuyla emniyeti maksimuma çıkarır." },
    { id: 219, name: "Tuz Klor Jeneratörü Otomasyon Sistemi", category: "Ekipmanlar", price: 39000, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=60", tag: "Yapay Zeka", moods: ["teknolojik", "titiz"], aiInsight: "✨ Göz yakmayan, kokusuz ve tamamen doğal iyonize su döngüsü üretir." },
    { id: 220, name: "Slim Led Havuz Aydınlatma Armatürü Beyaz", category: "Aydınlatma", price: 2200, image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=60", tag: "Minimalist", moods: ["keyifli"], aiInsight: "💡 Duvara tam sıfır yapısı sayesinde havuz içi hareket alanını daraltmaz." }
  ];

  // Burada backend verisi yerine zorunlu olarak mock20Products listemizi bağlıyoruz ki pürüz kalmasın!
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

  // Arama ve Filtre Dinamik Motoru
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
    setCart([...cart, product]);
    setNotification(`✅ ${product.name} sepete eklendi!`);
  };

  // KART BİLGİLERİ İLE SİPARİŞİ ONAYLAMA FONKSİYONU
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setCart([]);
    setSimulatedOrderStatus("Yola Çıktı"); // İrem Hanım'ın istediği durum tetikleyicisi
    setActiveModal("kargo"); 
    setNotification("💳 PayTR Ödemesi Alındı! Kargonuz Yola Çıktı bebek.");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setCurrentUser({ fullname: loginForm.username, email: "nuray@arpeta.com" });
    setActiveModal("");
    setNotification(`🔑 Hoş geldin ${loginForm.username}!`);
  };

  const sepetToplamTutar = cart.reduce((sum, item) => sum + item.price, 0);

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
                {activeModal === "kargo" && "🚚 Sipariş Kargo Durumu"}
                {activeModal === "login" && "🔑 Üye Girişi"}
                {activeModal === "register" && "📝 Yeni Üye Kaydı"}
              </h3>
              <button onClick={() => setActiveModal("")} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-slate-700 flex-1 flex flex-col justify-between">
              <div>
                
                {/* SEPET + KART BİLGİLERİ + SEPETİ ONAYLA ALANI */}
                {activeModal === "sepet" && (
                  <div className="text-sm">
                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 font-medium">Sepetiniz şu anda boş bebek.</div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {cart.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border">
                            <span className="font-bold text-xs text-slate-900 line-clamp-1">{item.name}</span>
                            <span className="font-black text-xs text-purple-700 shrink-0">1 adet / ₺{item.price}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between items-center font-black text-slate-900 text-sm">
                          <span>Toplam Ödenecek Tutar:</span>
                          <span className="text-xl text-purple-700">₺{sepetToplamTutar.toLocaleString('tr-TR')}</span>
                        </div>

                        {/* İREM HANIMIN İSTEDİĞİ KART BİLGİLERİ VE SİPARİŞİ ONAYLA FORMU */}
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
                              <input type="text" required placeholder="12/29" value={cardInfo.date} onChange={(e) => setCardInfo({...cardInfo, date: e.target.value})} className="w-full p-2 text-xs font-bold rounded-xl border bg-white focus:border-purple-600 outline-none" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-500 mb-0.5">CVC</label>
                              <input type="text" required maxLength="3" placeholder="000" value={cardInfo.cvc} onChange={(e) => setCardInfo({...cardInfo, cvc: e.target.value})} className="w-full p-2 text-xs font-bold rounded-xl border bg-white focus:border-purple-600 outline-none" />
                            </div>
                          </div>
                          <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black py-3 rounded-xl shadow-md text-xs uppercase tracking-wide mt-2">
                            Siparişi Onayla ve Öde ➔
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* İREM HANIMIN İSTEDİĞİ: SİPARİŞ HAZIR / YOLA ÇIKTI / TAMAMLANDI PANELİ */}
                {activeModal === "kargo" && (
                  <div className="text-center py-4 flex flex-col items-center gap-4">
                    <Truck className="w-10 h-10 text-purple-600 animate-bounce" />
                    <h4 className="font-black text-slate-900 text-base">🚚 Sipariş Durum Ekranı</h4>
                    
                    {/* Görsel Step Progress Çubuğu */}
                    <div className="w-full flex justify-between items-center px-4 mt-2 relative">
                      <div className="absolute left-6 right-6 top-4 h-1 bg-slate-200 -z-10"></div>
                      <div className="flex flex-col items-center gap-1 bg-white px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${simulatedOrderStatus === "Hazırlanıyor" || simulatedOrderStatus === "Yola Çıktı" || simulatedOrderStatus === "Tamamlandı" ? 'bg-purple-600 text-white' : 'bg-slate-200'}`}>1</div>
                        <span className="text-[10px] font-black text-slate-700">Sipariş Hazır</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 bg-white px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${simulatedOrderStatus === "Yola Çıktı" || simulatedOrderStatus === "Tamamlandı" ? 'bg-purple-600 text-white' : 'bg-slate-200'}`}>2</div>
                        <span className="text-[10px] font-black text-purple-700">Kargo Yola Çıktı</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 bg-white px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${simulatedOrderStatus === "Tamamlandı" ? 'bg-purple-600 text-white' : 'bg-slate-200'}`}>3</div>
                        <span className="text-[10px] font-black text-slate-700">Tamamlandı</span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs font-bold text-purple-900 w-full">
                      Mevcut Durum: {simulatedOrderStatus === "Yola Çıktı" ? "📦 Kargonuz Başarıyla Arpeta Dağıtım Merkezinden Çıktı!" : "Siparişiniz Alındı."}
                    </div>

                    {/* Simülasyonu Değiştirme Butonları (İrem Hanıma Göstermek İçin) */}
                    <div className="flex gap-2 mt-2 w-full">
                      <button onClick={() => setSimulatedOrderStatus("Hazırlanıyor")} className="flex-1 bg-slate-100 text-slate-800 text-[9px] font-black py-1 rounded-md uppercase">Hazır Yap</button>
                      <button onClick={() => setSimulatedOrderStatus("Yola Çıktı")} className="flex-1 bg-purple-100 text-purple-800 text-[9px] font-black py-1 rounded-md uppercase">Yola Çıkar</button>
                      <button onClick={() => setSimulatedOrderStatus("Tamamlandı")} className="flex-1 bg-emerald-100 text-emerald-800 text-[9px] font-black py-1 rounded-md uppercase">Tamamla</button>
                    </div>
                  </div>
                )}

                {activeModal === "login" && (
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                    <input type="text" required placeholder="Kullanıcı Adı" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border-2" />
                    <input type="password" required placeholder="Şifre" className="w-full p-3 rounded-xl bg-slate-50 border-2" />
                    <button type="submit" className="w-full bg-purple-600 text-white font-black py-3 rounded-xl">Giriş Yap</button>
                  </form>
                )}

              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                <button onClick={() => setActiveModal("")} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm border border-slate-300">
                  <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Geri Dön
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* HEADER BARI */}
      <div>
        <div className="bg-slate-900 text-white text-[11px] font-bold py-2 px-6 flex justify-between items-center tracking-wide">
          <span>✦ 1000₺ Üzeri Alışverişlerde Ücretsiz Kargo</span>
          <span className="text-cyan-400 font-black">{isLoggedIn ? `● Oturum: ${currentUser?.fullname}` : "● Standart Mod"}</span>
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
            <button onClick={() => { setActiveModal("kargo"); }} className="px-4 py-2 rounded-xl font-black border border-purple-600 bg-white text-purple-700 text-xs">📋 Sipariş Sorgula</button>

            <div onClick={() => setActiveModal("sepet")} className="relative cursor-pointer text-slate-800 hover:text-purple-700 bg-slate-100 p-2.5 rounded-xl border-2 shadow-sm">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md border border-white">{cart.length}</span>}
            </div>
          </div>
        </header>

        {/* AI ASİSTAN BARI */}
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

            {/* DİNAMİK 20 ÜRÜNLÜK VİTRİN */}
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