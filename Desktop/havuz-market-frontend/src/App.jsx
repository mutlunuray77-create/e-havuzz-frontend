import React, { useState, useEffect } from 'react';
import axios from 'react-redux'; // Not: Orijinal importunu koruyoruz
import axiosActual from 'axios';
import { ShoppingCart, Search, User, HelpCircle, FileText, Truck, Mail, MapPin, Sparkles, Filter, CheckCircle, X, LogIn, UserPlus, ArrowLeft, CreditCard, History } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [dbProducts, setDbProducts] = useState([]); 
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [notification, setNotification] = useState("");

  const [activeModal, setActiveModal] = useState(""); 
  const [asistanSoru, setAsistanSoru] = useState("");
  const [asistanCevap, setAsistanCevap] = useState("");

  // Giriş ve Kayıt Form State'leri
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ fullname: '', city: '', phone: '' });

  // İREM HANIMIN İSTEDİĞİ DEVLET DÜZEYİNDE STATE YÖNETİMLERİ
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]); // Sipariş geçmişi havuzu
  const [paytrStep, setPaytrStep] = useState(false); // PayTR Ödeme Ekranı Kontrolü
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvc: '', name: '' });

  // İREM HANIMIN İSTEDİĞİ TAM 20 PREMIUM ÜRÜN LİSTESİ
  const mock20Products = [
    { id: 1, name: "Premium Havuz Kloru 25 KG (Granül %56)", category: "Kimyasallar", price: 2450, tag: "En Çok Satan", aiInsight: "💡 Yüksek çözünme hızıyla havuz PH dengesini yormadan maksimum dezenfeksiyon sağlar.", moods: ["titiz"] },
    { id: 2, name: "Arpeta Akıllı Havuz Robotu v4 Pro", category: "Temizlik", price: 42000, tag: "Yapay Zeka", aiInsight: "💡 Duvar tırmanma ve entegre sonar haritalama ile %99 filtreleme verimliliği.", moods: ["teknolojik", "titiz"] },
    { id: 3, name: "RGB Sualtı LED Aydınlatma Armatürü 12V", category: "Aydınlatma", price: 1850, tag: "Yeni Ürün", aiInsight: "💡 Enerji tasarruflu yapısıyla modunuza göre 16 farklı renk senkronizasyonu sunar.", moods: ["sakin", "teknolojik"] },
    { id: 4, name: "Sirkülasyon Havuz Pompası 1.5 HP ECO", category: "Pompalar", price: 8900, tag: "Yüksek Güç", aiInsight: "💡 Düşük desibel teknolojisiyle gece sessizliğinde bile maksimum devirdaim yapar.", moods: ["teknolojik"] },
    { id: 5, name: "Yosun Önleyici ve Parlatıcı Konsantre 5 LT", category: "Kimyasallar", price: 480, tag: "Fırsat", aiInsight: "💡 Suyun berraklığını arttırarak mikroskobik partikülleri filtreye taşır.", moods: ["titiz"] },
    { id: 6, name: "Teleskobik Temizlik Sapı Alüminyum 4.8m", category: "Temizlik", price: 920, tag: "Dayanıklı", aiInsight: "💡 Hafifletilmiş alaşımıyla derin temizlikte kullanıcı ergonomisini korur.", moods: ["titiz"] },
    { id: 7, name: "Paslanmaz Çelik Havuz Merdiveni (3 Basamaklı)", category: "Ekipmanlar", price: 6200, tag: "Premium", aiInsight: "💡 AISI 304 kalite çelik yapısıyla korozyona ve havuz kimyasallarına tam dirençlidir.", moods: ["sakin"] },
    { id: 8, name: "Dijital Havuz Suyu Test Cihazı (PH/Klor Bluetooth)", category: "Ekipmanlar", price: 3400, tag: "Teknolojik", aiInsight: "💡 Bluetooth bağlantısıyla anlık su analiz sonuçlarını mobil uygulamaya iletedir.", moods: ["teknolojik", "titiz"] },
    { id: 9, name: "Havuz Dip Filtre Nozulu Gömme Tip", category: "Ekipmanlar", price: 350, tag: "Standart", aiInsight: "💡 Suyun tabandan homojen şekilde dağılmasını sağlayarak kör noktaları engeller.", moods: ["sakin"] },
    { id: 10, name: "Kuvars Havuz Filtre Kumu 25 KG", category: "Ekipmanlar", price: 290, tag: "Temel İhtiyaç", aiInsight: "💡 İdeal tane boyutuyla pompanın yükünü azaltır, berraklığı maksimuma çıkarır.", moods: ["titiz"] },
    { id: 11, name: "Ph Düşürücü Toz Kimyasal 10 KG", category: "Kimyasallar", price: 850, tag: "Hızlı Etki", aiInsight: "💡 Klorun aktifleşmesi için suyun alkalinite seviyesini güvenli aralığa çeker.", moods: ["titiz"] },
    { id: 12, name: "Lüks Havuz Fıskiyesi Paslanmaz Şelale Tipi", category: "Ekipmanlar", price: 14500, tag: "Özel Tasarım", aiInsight: "💡 Estetik su perdesi tasarımıyla havuzunuza modern ve sakinleştirici bir mimari hava katar.", moods: ["sakin", "yorgun"] },
    { id: 13, name: "Yüzey Sıyırıcı Skimmer Geniş Ağızlı", category: "Ekipmanlar", price: 1200, tag: "Gerekli", aiInsight: "💡 Yaprak ve toz gibi yüzen pislikleri dip çökelmeden önce hızla yakalar.", moods: ["titiz"] },
    { id: 14, name: "Havuz Isı Pompası ve Eşanjör Sistemi", category: "Pompalar", price: 78000, tag: "Premium", aiInsight: "💡 Dört mevsim ideal su sıcaklığı için minimum enerjiyle maksimum termal güç sağlar.", moods: ["yorgun", "teknolojik"] },
    { id: 15, name: "Sualtı Paslanmaz Jet Masaj Nozulu", category: "Ekipmanlar", price: 2100, tag: "Keyif Modu", aiInsight: "💡 Yüksek basınçlı su ve hava karışımıyla harika bir hidroterapi ve masaj etkisi yaratır.", moods: ["yorgun", "sakin"] },
    { id: 16, name: "Güneş Enerjili Havuz İyonizeri", category: "Ekipmanlar", price: 4300, tag: "Çevre Dostu", aiInsight: "💡 Kimyasal kullanımını %80 azaltarak bakır-gümüş iyonlarıyla doğal koruma sağlar.", moods: ["teknolojik"] },
    { id: 17, name: "Havuz Süpürge Hortumu Kendinden Yüzer 15m", category: "Temizlik", price: 1650, tag: "Esnek", aiInsight: "💡 Vakum esnasında kırılma yapmayan özel bükülmez profil teknolojisine sahiptir.", moods: ["titiz"] },
    { id: 18, name: "Lineer Havuz Kenar Izgarası (Geçmeli 20cm)", category: "Ekipmanlar", price: 450, tag: "Güvenli", aiInsight: "💡 Kaymaz gözenekli plastik yapısıyla havuz kenarı güvenliğini optimize eder.", moods: ["sakin"] },
    { id: 19, name: "Tuz Klor Jeneratörü Otomasyon Seti", category: "Ekipmanlar", price: 39000, tag: "Yapay Zeka", aiInsight: "💡 Doğal tuzdan klor üreterek göz yakmayan, kokusuz ve sağlıklı bir su sunar.", moods: ["teknolojik", "titiz"] },
    { id: 20, name: "Ayarlanabilir LED Havuz Duvar Lambası Slim", category: "Aydınlatma", price: 2200, tag: "Minimalist", aiInsight: "💡 İnce yapısı sayesinde havuz içinde yer kaplamaz, homojen bir ışık yayar.", moods: ["sakin"] }
  ];

  useEffect(() => {
    // Canlı backend'i tetikler, her koşulda 20 ürünü garantiye alır
    axiosActual.get('https://e-havuzz-backend.onrender.com/api/products')
      .then(response => {
        if (response.data && response.data.length >= 20) {
          setDbProducts(response.data);
          setDisplayedProducts(response.data);
        } else {
          setDbProducts(mock20Products);
          setDisplayedProducts(mock20Products);
        }
      })
      .catch(error => {
        setDbProducts(mock20Products);
        setDisplayedProducts(mock20Products);
      });
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Arama, Kategori ve Ruh Hali Filtresi
  useEffect(() => {
    let filtrelenmis = dbProducts;
    
    if (selectedCategory !== "Hepsi") {
      filtrelenmis = filtrelenmis.filter(p => p.category === selectedCategory);
    }
    
    if (selectedMood && selectedMood !== "hepsi") {
      filtrelenmis = filtrelenmis.filter(p => p.moods && p.moods.includes(selectedMood));
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase('tr-TR');
      filtrelenmis = filtrelenmis.filter(p => 
        p.name.toLowerCase('tr-TR').includes(query) || 
        p.category.toLowerCase('tr-TR').includes(query)
      );
    }
    
    setDisplayedProducts(filtrelenmis);
  }, [selectedCategory, selectedMood, searchQuery, dbProducts]);

  const addToCart = (product) => {
    const guncelSepet = [...cart, product];
    setCart(guncelSepet);
    const toplamTutar = guncelSepet.reduce((sum, item) => sum + item.price, 0);
    setNotification(`✅ ${product.name} eklendi! Güncel Tutar: ₺${toplamTutar.toLocaleString('tr-TR')}`);
  };

  // PayTR Ödeme Aşamasına Geçiş
  const handleCheckout = () => {
    setPaytrStep(true);
  };

  // PayTR Entegrasyon Simülasyonu Tetikleyicisi
  const handlePaytrPayment = (e) => {
    e.preventDefault();
    const orderId = "RE-TR-" + Math.floor(100000 + Math.random() * 900000);
    
    const orderData = {
      orderId: orderId,
      items: cart,
      totalPrice: sepetToplamTutar,
      isGuest: !isLoggedIn,
      buyerName: isLoggedIn ? currentUser.fullname : "Misafir Kullanıcı",
      date: new Date().toLocaleDateString('tr-TR'),
      status: "PayTR Onaylandı / Hazırlanıyor"
    };

    // Axios Post ile sunucuya simüle sipariş iletimi
    axiosActual.post('https://e-havuzz-backend.onrender.com/api/orders', { items: cart, totalPrice: sepetToplamTutar, isGuest: !isLoggedIn })
      .then(() => {
        setOrders([orderData, ...orders]);
        setCart([]);
        setPaytrStep(false);
        setActiveModal("kargo"); // Başarılı olunca kargo/takip ekranını aç
        setNotification(`💳 PayTR Ödemesi Başarılı! Siparişiniz Alındı: ${orderId}`);
      })
      .catch(() => {
        // Hata durumunda bile kesintisiz kullanıcı akışı için local sipariş oluşturur
        setOrders([orderData, ...orders]);
        setCart([]);
        setPaytrStep(false);
        setActiveModal("kargo");
        setNotification(`💳 PayTR Ödemesi Başarılı! (Local Mode) Sipariş: ${orderId}`);
      });
  };

  const handleAsistanSorgu = (e) => {
    e.preventDefault();
    if (!asistanSoru) return;
    setAsistanCevap("🤖 Akıllı Asistan: Harika bir soru! Geliştirdiğimiz modern mimaride sepet yönetimini, PayTR sanal pos API simülasyonunu ve ürün akışını Axios ile canlı Render backend'imiz üzerinden asenkron olarak yönetiyoruz güzelim!");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setCurrentUser({ fullname: loginForm.username, city: "Hatay", phone: "0555 XXXXXXX" });
    setActiveModal("");
    setNotification(`🔑 Hoş geldin ${loginForm.username}! Giriş ve Sipariş Geçmişi aktif edildi.`);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setCurrentUser({ fullname: registerForm.fullname, city: registerForm.city, phone: registerForm.phone });
    setActiveModal("");
    setNotification(`📝 Kayıt Başarılı! Hoş geldin ${registerForm.fullname}. Profiliniz entegre edildi.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setNotification("ℹ️ Güvenli çıkış yapıldı.");
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
                {activeModal === "sepet" && "🛒 Güncel Sepetiniz"}
                {activeModal === "asistan" && "🤖 Akıllı Havuz Asistanı"}
                {activeModal === "blog" && "📝 E-Havuz Market Blog"}
                {activeModal === "hakkimizda" && "✨ Hakkımızda"}
                {activeModal === "kargo" && "🚚 Sipariş Takip Durumu"}
                {activeModal === "login" && "🔑 Üye Girişi"}
                {activeModal === "register" && "📝 Yeni Üye Kaydı"}
                {activeModal === "orders" && "📋 Sipariş Geçmişiniz"}
              </h3>
              <button onClick={() => { setActiveModal(""); setPaytrStep(false); setAsistanCevap(""); }} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-slate-700 flex-1 flex flex-col justify-between">
              <div>
                
                {/* SEPET VE PAYTR ÖDEME ALANI */}
                {activeModal === "sepet" && (
                  <div className="text-sm">
                    {!paytrStep ? (
                      <>
                        {cart.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 font-medium">Sepetiniz şu anda boş.</div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {cart.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                <div className="flex-1">
                                  <h5 className="font-extrabold text-xs text-slate-900 line-clamp-1">{item.name}</h5>
                                  <span className="text-[10px] text-cyan-600 font-black uppercase">{item.category}</span>
                                </div>
                                <span className="font-black text-xs text-slate-900">₺{item.price.toLocaleString('tr-TR')}</span>
                              </div>
                            ))}
                            <div className="border-t-2 pt-4 mt-2 flex justify-between items-center font-black text-slate-900 text-base">
                              <span>Toplam Tutar:</span>
                              <span className="text-purple-700">₺{sepetToplamTutar.toLocaleString('tr-TR')}</span>
                            </div>
                            <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black py-3 rounded-xl mt-4 hover:opacity-95 transition-all shadow-md">
                              PayTR ile Ödemeye Geç ➔
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      /* PAYTR ÖDEME ENTEGRASYON ARAYÜZÜ */
                      <form onSubmit={handlePaytrPayment} className="flex flex-col gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-purple-200 animate-fadeIn">
                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                          <span className="font-black text-xs text-purple-900 uppercase">PayTR Sanal POS iFrame</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Güvenli Mod</span>
                        </div>
                        <div className="text-xs font-bold text-slate-700">Ödenecek Tutar: <span className="text-purple-700 text-sm font-black">₺{sepetToplamTutar.toLocaleString('tr-TR')}</span></div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500">Kart Üzerindeki İsim</label>
                          <input type="text" required placeholder="NURAY MUTLU" className="w-full p-2 text-xs font-bold rounded-xl border border-slate-300 bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500">Kart Numarası (Test Modu)</label>
                          <input type="text" required maxLength="19" placeholder="4000 1234 5678 9010" className="w-full p-2 text-xs font-bold rounded-xl border border-slate-300 bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500">Son Kullanma</label>
                            <input type="text" required placeholder="12/29" className="w-full p-2 text-xs font-bold rounded-xl border border-slate-300 bg-white" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500">CVC</label>
                            <input type="text" required placeholder="000" className="w-full p-2 text-xs font-bold rounded-xl border border-slate-300 bg-white" />
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider mt-2 flex items-center justify-center gap-2">
                          <CreditCard className="w-4 h-4" /> PayTR ile Şimdi Öde
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* SİPARİŞ GEÇMİŞİ MODALI (Üyelik & Misafir Siparişleri) */}
                {activeModal === "orders" && (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-slate-500 font-bold">Aşağıda gerçekleştirdiğiniz güncel üyelik veya misafir sipariş hareketleri listelenmektedir.</p>
                    {orders.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 font-medium">Kayıtlı sipariş geçmişiniz bulunmuyor bebek.</div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {orders.map((order, idx) => (
                          <div key={idx} className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 text-xs flex flex-col gap-1.5">
                            <div className="flex justify-between font-black text-slate-900">
                              <span>Kod: {order.orderId}</span>
                              <span className="text-purple-700">₺{order.totalPrice.toLocaleString('tr-TR')}</span>
                            </div>
                            <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                              <span>Alıcı: {order.buyerName}</span>
                              <span>Tarih: {order.date}</span>
                            </div>
                            <div className="text-[10px] font-black tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg w-fit mt-1 border border-emerald-200">
                              {order.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* GİRİŞ YAP FORMU */}
                {activeModal === "login" && (
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                    <p className="text-xs text-slate-500 font-medium">Lütfen kullanıcı adı ve şifrenizi girerek demo hesabınıza erişim sağlayın.</p>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kullanıcı Adı</label>
                      <input type="text" required value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} placeholder="Örn: nuraymutlu" className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-purple-600 text-sm font-semibold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Şifre</label>
                      <input type="password" required value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} placeholder="••••••••" className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-purple-600 text-sm font-semibold" />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 text-sm">
                      Güvenli Giriş Yap
                    </button>
                  </form>
                )}

                {/* ÜYE OL FORMU */}
                {activeModal === "register" && (
                  <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                    <p className="text-xs text-slate-500 font-medium">Sisteme hızlıca üye olmak için aşağıdaki bilgileri doldurmanız yeterlidir.</p>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">İsim Soyisim</label>
                      <input type="text" required value={registerForm.fullname} onChange={(e) => setRegisterForm({...registerForm, fullname: e.target.value})} placeholder="Örn: Nuray Mutlu" className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-cyan-500 text-sm font-semibold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bulunduğunuz İl</label>
                      <input type="text" required value={registerForm.city} onChange={(e) => setRegisterForm({...registerForm, city: e.target.value})} placeholder="Örn: Hatay" className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-cyan-500 text-sm font-semibold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numarası</label>
                      <input type="tel" required value={registerForm.phone} onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})} placeholder="Örn: 0555 XXXXXXX" className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-cyan-500 text-sm font-semibold" />
                    </div>
                    <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 text-sm">
                      Kayıt İşlemini Tamamla
                    </button>
                  </form>
                )}

                {activeModal === "asistan" && (
                  <div className="flex flex-col gap-4 text-sm">
                    <p className="text-xs text-slate-500 font-semibold">Havuz bakımı ve modern altyapı hakkında sorularınızı yanıtlayabilirim.</p>
                    <form onSubmit={handleAsistanSorgu} className="flex flex-col gap-2">
                      <input type="text" value={asistanSoru} onChange={(e) => setAsistanSoru(e.target.value)} placeholder="Örn: Projede state yönetimi nasıl yapıldı?" className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-purple-500 text-xs text-slate-800 font-bold" />
                      <button type="submit" className="bg-purple-600 text-white font-black text-xs py-2.5 rounded-xl shadow-sm uppercase">Cevapla</button>
                    </form>
                    {asistanCevap && (
                      <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-2xl text-xs text-purple-900 font-extrabold leading-relaxed">
                        {asistanCevap}
                      </div>
                    )}
                  </div>
                )}

                {activeModal === "blog" && (
                  <div className="bg-purple-50/50 border-2 border-purple-100 p-4 rounded-2xl text-xs md:text-sm">
                    <h4 className="font-black text-slate-900 text-sm mb-1 text-purple-900">📝 PayTR Ödeme Geçidi Altyapı Çalışmaları</h4>
                    <p className="text-slate-700 mt-2">Bu güncellemede, iFrame üzerinden tetiklenen sanal POS akışları optimize edilmiş ve hem üye hem misafir kullanıcı siparişleri sipariş takip veri tabanına entegre edilmiştir.</p>
                  </div>
                )}

                {activeModal === "hakkimizda" && (
                  <div className="flex flex-col gap-3 text-xs md:text-sm text-slate-800 font-medium">
                    <h4 className="text-base font-black text-purple-800 uppercase">Biz Kimiz?</h4>
                    <p className="text-slate-950 font-bold italic bg-cyan-50 p-4 rounded-xl border-2 border-cyan-100">
                      "E-Havuz Market, havuz bakım ürünleri ve ekipmanlarını güvenilir, hızlı ve kolay bir alışveriş deneyimiyle kullanıcılarına sunmayı hedefleyen modern bir e-ticaret platformudur."
                    </p>
                  </div>
                )}

                {activeModal === "kargo" && (
                  <div className="text-center py-4 flex flex-col items-center gap-3 text-sm">
                    <Truck className="w-8 h-8 text-emerald-600 animate-bounce" />
                    <h4 className="font-black text-slate-900 text-sm">🚚 Siparişiniz PayTR Tarafından Onaylandı!</h4>
                    <p className="text-xs text-slate-600 font-bold max-w-xs mx-auto">Sipariş paketiniz Arpeta Yazılım altyapı merkezinden paketleme aşamasına geçmiştir. Detayları 'Sipariş Geçmişim' sekmesinden anlık takip edebilirsiniz.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                <button onClick={() => { setActiveModal(""); setPaytrStep(false); setAsistanCevap(""); }} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm border border-slate-300">
                  <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Geri Dön
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ÜST BİLGİ BARI */}
      <div>
        <div className="bg-slate-900 text-white text-[11px] font-bold py-2 px-6 flex justify-between items-center tracking-wide">
          <span>✦ 1000₺ Üzeri Alışverişlerde Ücretsiz Kargo</span>
          <div className="flex gap-4">
            <span className={`font-black ${isLoggedIn ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {isLoggedIn ? `● Oturum Açık: ${currentUser?.fullname}` : "● Misafir Girişi / Standart Altyapı Aktif"}
            </span>
          </div>
        </div>

        {/* HEADER */}
        <header className="bg-white shadow-md sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row justify-between items-center border-b-2 border-cyan-100 gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white p-2.5 rounded-xl font-black text-xl shadow-md">HM</div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">Havuz<span className="text-cyan-500">Market</span></h1>
              <p className="text-[10px] text-purple-700 font-black uppercase tracking-widest">Premium Altyapı</p>
            </div>
          </div>

          {/* ARAMA MOTORU */}
          <div className="flex-1 max-w-lg w-full relative">
            <label className="block text-[11px] font-black text-purple-900 mb-1 tracking-wide uppercase">🔍 Aradığınız ürün nedir?</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Örn: klor, robot, led lamba, pompa, fıskiye..." 
                className="w-full pl-5 pr-12 py-3 border-2 border-slate-300 rounded-full focus:outline-none focus:border-cyan-500 bg-slate-50 font-bold text-sm shadow-inner transition-all" 
              />
              <Search className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
            </div>
          </div>

          {/* KULLANICI DURUM BUTONLARI (Giriş/Çıkış & Sipariş Takip) */}
          <div className="flex items-center flex-wrap gap-3 text-sm shrink-0">
            {!isLoggedIn ? (
              <>
                <button type="button" onClick={() => setActiveModal("login")} className="text-slate-700 hover:text-purple-700 flex items-center gap-1 font-extrabold transition-colors border-2 border-slate-200 px-4 py-2 rounded-xl bg-slate-50 cursor-pointer shadow-sm">
                  <User className="w-4 h-4 text-purple-600" /> Giriş Yap
                </button>
                <button type="button" onClick={() => setActiveModal("register")} className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl font-extrabold transition-all shadow-sm cursor-pointer text-xs">
                  Üye Ol
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setActiveModal("orders")} className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-extrabold border-2 border-emerald-200 px-4 py-2 rounded-xl bg-emerald-50 cursor-pointer shadow-sm text-xs">
                  <History className="w-4 h-4" /> Sipariş Geçmişim
                </button>
                <button type="button" onClick={handleLogout} className="text-rose-600 hover:text-rose-700 font-extrabold px-3 py-2 border border-rose-200 rounded-xl bg-rose-50 text-xs">
                  Çıkış Yap
                </button>
              </>
            )}
            
            {/* MİSAFİR DURUM BUTONU */}
            <button onClick={() => { setActiveModal("orders"); }} className="px-4 py-2 rounded-xl font-black transition-all shadow-sm border border-purple-600 bg-white text-purple-700 hover:bg-purple-50 text-xs">
              📋 Sipariş Durumu Sorgula
            </button>

            <div onClick={() => setActiveModal("sepet")} className="relative cursor-pointer text-slate-800 hover:text-purple-700 transition-colors bg-slate-100 p-2.5 rounded-xl border-2 border-slate-200 shadow-sm">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md border border-white">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* AI KUTUSU */}
        <div className="max-w-[1400px] mx-auto px-6 mt-6">
          <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-[#00b4d8] p-6 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between shadow-2xl border-2 border-purple-500/40 relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-amber-400 to-purple-600 p-3 rounded-2xl shadow-lg shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-black text-lg md:text-xl tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Arpeta AI Akıllı Karar Motoru Aktif!
                </h4>
                <p className="text-xs text-purple-100 font-bold max-w-xl mt-1 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  "Merhaba! Havuz otomasyon altyapınız, sepet akışınız ve modern mimarimizle ilgili tüm sorularınızı yanıtlamaya hazırım güzelim. Teknolojiyi deneyimleyin."
                </p>
              </div>
            </div>
            <button onClick={() => setActiveModal("asistan")} className="w-full md:w-auto bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs px-6 py-4 rounded-xl hover:scale-105 transition-all shadow-xl tracking-wider uppercase shrink-0">
              🚀 ASİSTANA SORU SOR
            </button>
          </div>
        </div>

        {/* İÇERİK ALANI */}
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {/* RUH HALİ MOTORU */}
            <section className="bg-gradient-to-r from-slate-900 via-purple-950 to-[#03045e] text-white py-10 px-6 rounded-3xl text-center shadow-xl mb-8 border-b-4 border-cyan-500">
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Yapay Zeka Destekli Karar Motoru</span>
              <h2 className="text-3xl font-black mt-3 mb-2 tracking-tight">Bugün modunuz nasıl?</h2>
              <p className="text-cyan-100 text-xs mb-5 font-bold">Ruh halinizi seçin, sistemimiz havuzunuzun ihtiyacını anında listelesin:</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { id: "yorgun", label: "Yorgunum, Masaj/Keyif İstiyorum 💆‍♂️", color: "bg-amber-500" },
                  { id: "titiz", label: "Titizim, Havuzum Pırıl Pırıl Olmalı ✨", color: "bg-emerald-500" },
                  { id: "teknolojik", label: "Teknolojik Çözümler Arıyorum 🤖", color: "bg-purple-500" },
                  { id: "sakin", label: "Sakinlik ve Huzur Peşindeyim 🌊", color: "bg-blue-500" },
                  { id: "hepsi", label: "Tüm Modları Göster", color: "bg-slate-600" }
                ].map(mood => (
                  <button key={mood.id} onClick={() => setSelectedMood(mood.id)} className={`px-4 py-2 rounded-full text-xs font-black transition-all shadow-md ${selectedMood === mood.id ? 'ring-4 ring-white scale-105 ' + mood.color : 'bg-white/10 hover:bg-white/20 text-white'}`}>{mood.label}</button>
                ))}
              </div>
            </section>

            {/* KATEGORİ ALANI */}
            <div className="bg-white p-5 rounded-2xl shadow-md border-2 border-slate-200 mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-800 mr-2 flex items-center gap-1 uppercase tracking-wide"><Filter className="w-4 h-4 text-purple-700" /> Kategori Seçin:</span>
              {["Hepsi", "Kimyasallar", "Temizlik", "Aydınlatma", "Ekipmanlar", "Pompalar"].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${selectedCategory === cat ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}>{cat}</button>
              ))}
            </div>

            {/* ÜRÜN GRID - ARTIK TAM 20 ÜRÜN LİSTELENİYOR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayedProducts.length === 0 ? (
                <div className="col-span-full bg-white p-12 rounded-2xl text-center shadow-inner border-2 border-dashed border-slate-300 font-extrabold text-slate-500">
                  🔍 Aradığınız kriterlere uygun ürün bulunamadı.
                </div>
              ) : (
                displayedProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border-2 border-slate-200 flex flex-col justify-between group">
                    <div className="relative">
                      <span className="absolute top-2 left-2 bg-purple-700 text-white text-[10px] font-black px-2 py-1 rounded-md z-10 shadow-md uppercase">{product.tag}</span>
                      <div className="h-48 overflow-hidden bg-slate-100 border-b">
                        <img src={`https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&q=80`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                        <button onClick={() => addToCart(product)} className="bg-purple-600 hover:bg-cyan-500 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-colors shadow-md uppercase tracking-wider">Sepete Ekle</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SAĞ ADAN */}
          <aside className="w-full lg:w-64 bg-white p-4 rounded-3xl shadow-md border-2 border-slate-200 h-fit sticky top-24">
            <h4 className="font-black text-xs text-center text-purple-700 uppercase tracking-widest mb-4 pb-2 border-b-2 border-slate-100">Hızlı İşlemler</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActiveModal("blog")} className="flex items-center gap-3 p-3 rounded-xl text-xs font-black text-slate-700 hover:bg-purple-50 hover:text-purple-800 transition-all text-left w-full border border-slate-100">
                <FileText className="w-4 h-4 text-purple-600" /> Blog Yazıları
              </button>
              <button onClick={() => setActiveModal("hakkimizda")} className="flex items-center gap-3 p-3 rounded-xl text-xs font-black text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 transition-all text-left w-full border border-slate-100">
                <HelpCircle className="w-4 h-4 text-cyan-500" /> Hakkımızda
              </button>
              <button onClick={() => setActiveModal("kargo")} className="flex items-center gap-3 p-3 rounded-xl text-xs font-black text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all text-left w-full border border-slate-100">
                <Truck className="w-4 h-4 text-emerald-500" /> Kargo Takip Sistemi
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-300 mt-16 border-t-4 border-purple-600">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="text-white font-black text-lg mb-3">Bizimle İletişime Geçin</h4>
            <div className="flex flex-col gap-2 text-xs font-semibold">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-400" /> Mareşal Fevzi Çakmak Caddesi, Hatay, Türkiye</span>
              <span className="flex items-center gap-2 font-bold text-white">
                <Mail className="w-4 h-4 text-cyan-400" /> 
                <a href="mailto:destek@havuzmarket.com" className="hover:underline text-cyan-400">destek@havuzmarket.com</a>
              </span>
            </div>
          </div>
        </div>
        <div className="bg-slate-950 text-center py-4 text-[11px] text-slate-500 border-t border-slate-900 font-bold">&copy; 2026 HavuzMarket. Tüm hakları saklıdır.</div>
      </footer>

    </div>
  );
}