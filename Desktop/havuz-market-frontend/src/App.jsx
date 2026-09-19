import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, Search, User, LogOut, HelpCircle, FileText, Truck, 
  Mail, MapPin, Sparkles, Filter, CheckCircle, X, Lock, Phone, CreditCard, 
  Check, Package, Clock, ShieldCheck
} from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [dbProducts, setDbProducts] = useState([]); 
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [notification, setNotification] = useState("");

  // Kullanıcı Yönetimi
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ fullName: '', phone: '', address: '', password: '' });

  // Modal Durumları
  const [activeModal, setActiveModal] = useState(""); // giris, uyeol, sepet, odeme, asistan, blog, hakkimizda, kargo
  const [asistanSoru, setAsistanSoru] = useState("");
  const [asistanCevap, setAsistanCevap] = useState("");

  // Ödeme Formu
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setDbProducts(response.data);
        setDisplayedProducts(response.data);
      })
      .catch(error => {
        console.error("Veri çekilemedi:", error);
        setNotification("❌ Backend sunucusuna bağlanılamadı!");
      });
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    let list = dbProducts;
    if (selectedCategory !== "Hepsi") {
      list = list.filter(p => p.category === selectedCategory);
    }
    if (selectedMood && selectedMood !== "hepsi") {
      list = list.filter(p => p.moods && p.moods.includes(selectedMood));
    }
    setDisplayedProducts(list);
  }, [selectedCategory, selectedMood, dbProducts]);

  const addToCart = (product) => {
    const updated = [...cart, product];
    setCart(updated);
    setNotification(`✅ ${product.name} sepete eklendi!`);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, idx) => idx !== indexToRemove));
  };

  // Sepet & Kargo Hesaplama
  const urunlerToplami = cart.reduce((sum, item) => sum + item.price, 0);
  const kargoUcreti = (cart.length > 0 && urunlerToplami < 1000) ? 50 : 0;
  const genelToplam = urunlerToplami + kargoUcreti;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) return;
    setCurrentUser(loginForm.username);
    setActiveModal("");
    setNotification(`👋 Hoş geldiniz, Sayın ${loginForm.username}!`);
    setLoginForm({ username: '', password: '' });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerForm.fullName || !registerForm.phone || !registerForm.address) return;
    setCurrentUser(registerForm.fullName);
    setActiveModal("");
    setNotification(`🎉 Aramıza hoş geldiniz, ${registerForm.fullName}! Kaydınız başarıyla oluşturuldu.`);
    setCheckoutForm(prev => ({
      ...prev,
      fullName: registerForm.fullName,
      phone: registerForm.phone,
      address: registerForm.address
    }));
    setRegisterForm({ fullName: '', phone: '', address: '', password: '' });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const orderPayload = {
      items: cart,
      shippingFee: kargoUcreti,
      totalPrice: genelToplam,
      customer: checkoutForm,
      isGuest: isGuestMode
    };

    axios.post('http://localhost:5000/api/orders', orderPayload)
      .then(res => {
        alert(`🎉 Harika! Siparişiniz Başarıyla Alındı!\nSipariş Takip No: ${res.data.order.orderId}\nKargo Durumu: Siparişiniz Hazırlanıyor.`);
        setCart([]);
        setActiveModal("kargo");
      })
      .catch(() => {
        alert("Sipariş iletilirken bir hata oluştu!");
      });
  };

  const handleAsistanSorgu = (e) => {
    e.preventDefault();
    if (!asistanSoru) return;
    setAsistanCevap("🤖 Havuz Asistanı: Harika bir soru! E-Havuz Market sistemimizde kimyasal dengesi, akıllı LED aydınlatma ve enerji tasarruflu inverter pompalarla havuzunuzu 4 mevsim en verimli seviyede tutabilirsiniz.");
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col justify-between font-sans">
      
      {/* GLOBAL TOAST BİLDİRİMİ */}
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white font-semibold text-xs md:text-sm px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 border border-cyan-400 backdrop-blur-md">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          {notification}
        </div>
      )}

      {/* TÜM MODALLAR */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header + Kapatma Çarpısı */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-900 via-purple-950 to-cyan-900 text-white">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                {activeModal === "giris" && "Hesabınıza Giriş Yapın"}
                {activeModal === "uyeol" && "Ailemize Katılın - Üye Ol"}
                {activeModal === "sepet" && "Alışveriş Sepetiniz"}
                {activeModal === "odeme" && "Güvenli Ödeme ve Teslimat"}
                {activeModal === "kargo" && "Arpeta Mini Kargo Takip Sistemi"}
                {activeModal === "asistan" && "Akıllı Havuz Asistanı"}
                {activeModal === "blog" && "E-Havuz Market Blog"}
                {activeModal === "hakkimizda" && "Kurumsal Bilgilerimiz"}
              </h3>
              <button 
                onClick={() => setActiveModal("")} 
                className="p-2 rounded-full bg-white/10 hover:bg-red-500 text-white transition-colors"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Gövdesi */}
            <div className="p-6 overflow-y-auto text-slate-600 flex-1">
              
              {/* 1. GİRİŞ YAP */}
              {activeModal === "giris" && (
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                  <p className="text-xs text-slate-500">Kullanıcı adı ve şifrenizi girerek hemen oturum açın.</p>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Kullanıcı Adı</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required 
                        value={loginForm.username} 
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        placeholder="Örn: nuraymutlu" 
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Şifre</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        required 
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="••••••••" 
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-purple-700 to-cyan-600 text-white font-bold py-3 rounded-xl text-xs hover:opacity-95 transition-opacity shadow-md">
                    Giriş Yap
                  </button>
                  <div className="text-center">
                    <button type="button" onClick={() => setActiveModal("uyeol")} className="text-xs text-cyan-600 hover:underline font-semibold">Hesabınız yok mu? Hemen Üye Olun</button>
                  </div>
                </form>
              )}

              {/* 2. ÜYE OL */}
              {activeModal === "uyeol" && (
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
                  <p className="text-xs text-slate-500">E-Havuz Market avantajlarından faydalanmak için formu doldurun.</p>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">İsim Soyisim</label>
                    <input 
                      type="text" 
                      required 
                      value={registerForm.fullName}
                      onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                      placeholder="Adınız ve Soyadınız" 
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Telefon Numarası</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        required 
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        placeholder="05XX XXX XX XX" 
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600"
                      />
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Teslimat Adresi</label>
                    <textarea 
                      required 
                      rows="2"
                      value={registerForm.address}
                      onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                      placeholder="Açık adresiniz..." 
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600"
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Şifre Belirleyin</label>
                    <input 
                      type="password" 
                      required 
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      placeholder="••••••••" 
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold py-3 rounded-xl text-xs hover:opacity-95 transition-opacity shadow-md mt-2">
                    Üyeliği Tamamla ve Giriş Yap
                  </button>
                </form>
              )}

              {/* SEPET */}
              {activeModal === "sepet" && (
                <div>
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-sm">Sepetinizde ürün bulunmamaktadır.</div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="max-h-64 overflow-y-auto pr-1 flex flex-col gap-2">
                        {cart.map((item, index) => (
                          <div key={index} className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                            <div className="flex-1">
                              <h5 className="font-bold text-xs text-slate-800 line-clamp-1">{item.name}</h5>
                              <span className="text-[10px] text-cyan-600 font-bold uppercase">{item.category}</span>
                            </div>
                            <span className="font-extrabold text-xs text-slate-900">₺{item.price.toLocaleString('tr-TR')}</span>
                            <button onClick={() => removeFromCart(index)} className="text-slate-400 hover:text-red-500 p-1">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Kargo Bilgilendirmesi */}
                      <div className="bg-slate-100 p-3 rounded-xl text-xs flex flex-col gap-1 border border-slate-200 mt-2">
                        <div className="flex justify-between">
                          <span>Ürünler Tutarı:</span>
                          <span className="font-bold">₺{urunlerToplami.toLocaleString('tr-TR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kargo Bedeli:</span>
                          <span className={`font-bold ${kargoUcreti === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {kargoUcreti === 0 ? "ÜCRETSİZ (1000₺ Üzeri)" : "₺50"}
                          </span>
                        </div>
                        {urunlerToplami < 1000 && (
                          <span className="text-[10px] text-amber-600 font-semibold mt-1">
                            ℹ️ Sepetinize ₺{(1000 - urunlerToplami).toLocaleString('tr-TR')} değerinde ürün daha ekleyin, kargo bedava olsun!
                          </span>
                        )}
                        <div className="border-t pt-2 mt-1 flex justify-between text-sm font-black text-slate-900">
                          <span>Genel Toplam:</span>
                          <span className="text-purple-700">₺{genelToplam.toLocaleString('tr-TR')}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setActiveModal("odeme")}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-2xl text-xs shadow-lg transition-all mt-4 flex items-center justify-center gap-2"
                      >
                        Siparişi Onayla ve Bilgileri Gir
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ÖDEME VE ADRES FORMU */}
              {activeModal === "odeme" && (
                <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-3 text-xs">
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-purple-900">Ödenecek Tutar:</span>
                    <span className="font-black text-sm text-purple-900">₺{genelToplam.toLocaleString('tr-TR')}</span>
                  </div>

                  <h5 className="font-black text-slate-800 uppercase tracking-wider text-[11px] mt-1">1. Teslimat Bilgileri</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Ad Soyad</label>
                      <input 
                        type="text" 
                        required 
                        value={checkoutForm.fullName}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                        placeholder="Adınız Soyadınız" 
                        className="w-full p-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Telefon</label>
                      <input 
                        type="tel" 
                        required 
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                        placeholder="05XX XXX XX XX" 
                        className="w-full p-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Açık Adres</label>
                    <textarea 
                      required 
                      rows="2"
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                      placeholder="İlçe, Mahalle, Cadde, No..." 
                      className="w-full p-2 border rounded-xl"
                    ></textarea>
                  </div>

                  <h5 className="font-black text-slate-800 uppercase tracking-wider text-[11px] mt-2 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-cyan-600" /> 2. Kart Bilgileri (Güvenli 3D Ödeme)
                  </h5>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kart Numarası</label>
                    <input 
                      type="text" 
                      required 
                      maxLength="19"
                      placeholder="4543 •••• •••• 1234" 
                      value={checkoutForm.cardNumber}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, cardNumber: e.target.value })}
                      className="w-full p-2 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Son Kullanma (AA/YY)</label>
                      <input 
                        type="text" 
                        required 
                        maxLength="5"
                        placeholder="12/28" 
                        value={checkoutForm.cardExpiry}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, cardExpiry: e.target.value })}
                        className="w-full p-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">CVV</label>
                      <input 
                        type="text" 
                        required 
                        maxLength="3"
                        placeholder="•••" 
                        value={checkoutForm.cardCvv}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, cardCvv: e.target.value })}
                        className="w-full p-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> 256-Bit SSL ile güvenli ödeme yapılmaktadır.
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl mt-2 text-xs shadow-md transition-colors"
                  >
                    Ödemeyi Tamamla ve Siparişi Oluştur
                  </button>
                </form>
              )}

              {/* 6. ARBETA MİNİ KARGO TAKİP */}
              {activeModal === "kargo" && (
                <div className="flex flex-col gap-6 py-2">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Sipariş No</span>
                      <span className="font-black text-slate-800">#HM-918230</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Taşıyıcı Firma</span>
                      <span className="font-bold text-cyan-700">Arpeta Mini</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Teslimat Tarihi</span>
                      <span className="font-bold text-emerald-600">Yarın Adresinizde</span>
                    </div>
                  </div>

                  {/* 4 Aşamalı Takip Çizelgesi */}
                  <div className="relative flex justify-between items-center px-4">
                    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0">
                      <div className="h-full bg-emerald-500 w-2/3"></div>
                    </div>

                    {[
                      { title: "Sipariş Alındı", time: "10:15", done: true, icon: Check },
                      { title: "Kargoya Verildi", time: "11:40", done: true, icon: Package },
                      { title: "Teslimatta", time: "Dağıtımda", done: true, current: true, icon: Truck },
                      { title: "Teslim Edildi", time: "--:--", done: false, icon: Clock }
                    ].map((step, idx) => (
                      <div key={idx} className="relative z-10 flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${step.current ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse' : step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          <step.icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-800 mt-2 text-center">{step.title}</span>
                        <span className="text-[9px] text-slate-400 font-semibold">{step.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
                    <Truck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span><strong>Kurye Dağıtımda:</strong> Siparişiniz kuryemiz tarafından teslimat adresinize ulaştırılmak üzere araca yüklendi. (Arpeta Mini Güvencesiyle)</span>
                  </div>
                </div>
              )}

              {/* ASİSTAN MODALI */}
              {activeModal === "asistan" && (
                <div className="flex flex-col gap-4 text-sm">
                  <p className="text-xs text-slate-500">Havuz otomasyonu, ürün seçimleri veya montaj hakkında aklınıza takılan her şeyi yazabilirsiniz.</p>
                  <form onSubmit={handleAsistanSorgu} className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      value={asistanSoru} 
                      onChange={(e) => setAsistanSoru(e.target.value)} 
                      placeholder="Örn: Tuz klor jeneratörü nasıl çalışır?" 
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <button type="submit" className="bg-cyan-600 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-cyan-700">Soruyu Yanıtla</button>
                  </form>
                  {asistanCevap && (
                    <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-2xl text-xs text-cyan-950 font-semibold leading-relaxed">
                      {asistanCevap}
                    </div>
                  )}
                </div>
              )}

              {/* 7. ÖZEL STAJ BLOG YAZISI */}
              {activeModal === "blog" && (
                <div className="flex flex-col gap-4 text-xs leading-relaxed text-slate-700 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="bg-gradient-to-r from-slate-900 to-cyan-950 text-white p-5 rounded-3xl shadow-md border border-cyan-500/20">
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      Staj Serüveni & Teknik Deneyim
                    </span>
                    <h3 className="text-base font-black text-white mt-2.5 leading-snug">
                      Bir Fikirden Global Bir E-Ticaret Mimarisine: Arpeta Yazılım’da 35 Günlük Staj Serüvenim
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-cyan-200 mt-2 font-medium">
                      <span>👤 Yazar: Nuray Mutlu | Bilgisayar Mühendisliği Öğrencisi</span>
                      <span>•</span>
                      <span>📅 Tarih: Eylül 2026</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
                    <p>
                      Bir bilgisayar mühendisliği öğrencisi için staj; ders kitaplarında, slaytlarda veya sınav kağıtlarında gördüğü o soyut kavramların gerçek dünyada ete kemiğe büründüğü andır. 20 yaşındayım, önümde uzun ve heyecan dolu bir mühendislik yolu var. Ancak Arpeta Yazılım çatısı altında geçirdiğim bu staj dönemi, sadece bir zorunlu stajı tamamlamak değil; kendi sınırlarımı, problem çözme reflekslerimi ve uçtan uca bir ürünü sıfırdan inşa etmenin heyecanını keşfettiğim dönüm noktası oldu.
                    </p>
                    <p>
                      Gelin, masanın başına oturup ilk satır kodu yazdığım andan, global standartlarda bir platform ortaya çıkarana kadar yaşadığım sürece birlikte bakalım.
                    </p>

                    <div className="border-t border-slate-200 pt-3">
                      <h4 className="font-black text-slate-900 text-sm mb-1 text-cyan-800">Projenin Doğuşu: E-Havuz Market</h4>
                      <p>
                        Stajımın ana odak noktası, havuz sektörüne yönelik modern, hızlı ve kullanıcı deneyimini merkeze alan tam kapsamlı bir e-ticaret platformu (E-Havuz Market) geliştirmekti. Projeye başlarken hedefimiz basitti ama çıtayı bilerek yükseğe koyduk:
                        <em> Sıradan bir alışveriş sitesi değil; yapay zekayla karar destekleyen, dinamik kargo lojistiğini simüle eden ve mimarisiyle global ölçeğe hitap eden bir platform inşa etmek.</em>
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <h4 className="font-black text-slate-900 text-sm mb-2 text-cyan-800">Teknik Mimaride Neler Yaptım?</h4>
                      <p className="mb-2">Proje boyunca tam yığın (Full-Stack) bir geliştirme süreci yürüttüm:</p>
                      <ul className="list-disc list-inside space-y-2 text-slate-600 pl-1">
                        <li><strong>Frontend Mimarisi:</strong> Hız ve modern bileşen yapısı için React ve Vite kullandım. Arayüzün her ekran boyutunda kusursuz ve akıcı görünmesi için Tailwind CSS ile çalıştım.</li>
                        <li><strong>Backend & API Tasarımı:</strong> Node.js ve Express.js ile RESTful bir mimari kurdum. 5 farklı kategorideki 30 kritik ürünün dinamik olarak listelenmesini, sepet ve sipariş verilerinin arka planda güvenle işlenmesini sağladım.</li>
                        <li><strong>Yapay Zeka Destekli Karar Motoru:</strong> Kullanıcıların "Bugün havuzunuz için modunuz nasıl?" sorusuna verdikleri yanıtlara (titiz, teknolojik, dingin vb.) göre en uygun ürün kombinasyonlarını anında eşleştiren akıllı bir filtreleme mekanizması geliştirdim.</li>
                        <li><strong>Dinamik Lojistik ve Sepet Deneyimi:</strong> 1000 TL üzeri ücretsiz kargo baremini dinamik hesaplayan bir sepet akışı ve sipariş onayından hemen sonra Arpeta Mini / Trendyol tarzı 4 adımlı (Sipariş Alındı ➔ Kargoya Verildi ➔ Dağıtımda ➔ Teslim Edildi) canlı kargo takip simülasyonunu entegre ettim.</li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <h4 className="font-black text-slate-900 text-sm mb-1 text-cyan-800">En Büyük Öğretmen: "Hatalar ve Debugging"</h4>
                      <p>
                        Yazılım geliştirmenin en güzel yanı, terminalde çıkan her kırmızı yazının aslında size yeni bir şey öğretmesidir. Bu süreçte port çakışmalarından dosya dizinlerinin doğru yönetimine, asenkron API çağrılarından durum yönetimine (state management) kadar pek çok teknik engelle karşılaştım.
                      </p>
                      <p className="mt-2">
                        Kimi zaman masaüstündeki bir kopyayla asıl proje dizini arasındaki farkı tespit etmek için terminal loglarını didik didik ettim; kimi zaman 5000 portunu kilitleyen arka plan süreçlerini analiz ettim. Ama her defasında o sorunun kök nedenini bulup çözmek ve tarayıcıda Ctrl + F5 yapıp her şeyin tıkır tıkır çalıştığını görmek tarif edilemez bir tatmin verdi. Mühendislik tam olarak buydu: Pes etmemek, analitik düşünmek ve çözüme ulaşana kadar o terminalin başından kalkmamak.
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-3 bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100">
                      <h4 className="font-black text-cyan-950 text-sm mb-1">Bana Kalanlar ve Teşekkür</h4>
                      <p>
                        Bu 35 gün bana sadece React veya Node.js ile kod yazmayı değil; bir yazılımın kullanıcı gözünden nasıl deneyimlendiğini, kurumsal düşünmeyi ve bir ekibin parçası olarak değer üretmenin önemini öğretti.
                      </p>
                      <p className="mt-2">
                        Başta bana bu vizyonu katan, yol gösteren ve her adımda gelişimimi destekleyen değerli yöneticim <strong>İrem Hanım</strong> olmak üzere, bana profesyonel bir çalışma ortamının kapılarını açan tüm <strong>Arpeta Yazılım</strong> ailesine sonsuz teşekkür ederim.
                      </p>
                      <p className="mt-2 font-bold text-cyan-900">
                        20 yaşında bir bilgisayar mühendisliği öğrencisi olarak bu stajdan; heybesi bilgi dolu, özgüveni yüksek ve geleceğin teknolojilerini üretmeye hazır bir genç mühendis adayı olarak ayrılıyorum.
                      </p>
                      <p className="mt-2 font-black text-slate-900">Bu daha başlangıç, üretmeye ve kodlamaya devam! 🚀</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. HAKKIMIZDA */}
              {activeModal === "hakkimizda" && (
                <div className="flex flex-col gap-4 text-xs text-slate-600 leading-relaxed">
                  <div className="bg-gradient-to-r from-cyan-900 to-slate-900 text-white p-5 rounded-3xl shadow-sm">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">
                      E-Havuz Market: Akıllı Teknolojilerle Havuz Konforu
                    </h4>
                    <p className="text-[11px] text-cyan-200 mt-1">
                      Arpeta Yazılım Güvencesiyle Yeni Nesil E-Ticaret Deneyimi
                    </p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                    <p>
                      <strong>E-Havuz Market</strong>, Arpeta Yazılım güvencesiyle hayata geçirilen; bireysel villa, konut ve kurumsal işletmelerin tüm havuz ihtiyaçlarını tek bir çatı altında toplayan yeni nesil bir e-ticaret platformudur.
                    </p>
                    <p>
                      Gelişmiş filtrasyon ve pompa sistemlerinden çevre dostu bakım kimyasallarına, estetik LED aydınlatmalardan akıllı temizlik robotlarına kadar <strong>5 temel kategoride 30'u aşkın profesyonel çözümü</strong> kullanıcılarımızla buluşturuyoruz.
                    </p>
                    <p>
                      Klasik alışveriş deneyiminin ötesine geçerek; yapay zeka destekli karar motorumuz, anlık akıllı asistanımız ve 1000 TL üzeri ücretsiz kargo avantajıyla havuz bakımını zahmetsiz, keyifli ve güvenilir bir sürece dönüştürüyoruz.
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-950">
                    <strong className="block font-black text-xs uppercase mb-1 text-emerald-900">🎯 Misyonumuz</strong>
                    <p>
                      Havuz konforunu ve su hijyenini en yenilikçi mühendislik çözümleri ve hızlı teslimat güvencesiyle Türkiye'nin her noktasına ulaştırmak.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* HEADER & LOGO BÖLÜMÜ */}
      <div>
        <div className="bg-slate-900 text-white text-xs py-2 px-6 flex justify-between items-center">
          <span className="font-medium text-cyan-300">✦ 1000₺ Üzeri Alışverişlerde Kargo Bedava! (Altında Sabit 50₺)</span>
          <div className="flex gap-4">
            <span className={`font-bold ${isGuestMode ? 'text-purple-400' : 'text-cyan-400'}`}>
              {isGuestMode ? "● Misafir Alışveriş Modu" : "● Standart Mod"}
            </span>
          </div>
        </div>

        <header className="bg-white shadow-sm sticky top-0 z-40 px-6 py-3.5 flex justify-between items-center border-b border-slate-200">
          
          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedCategory("Hepsi"); setSelectedMood(""); }}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12c.6.5 1.2.8 2 .8s1.4-.3 2-.8c.6.5 1.2.8 2 .8s1.4-.3 2-.8c.6.5 1.2.8 2 .8s1.4-.3 2-.8c.6.5 1.2.8 2 .8s1.4-.3 2-.8"/>
                <path d="M2 17c.6.5 1.2.8 2 .8s1.4-.3 2-.8c.6.5 1.2.8 2 .8s1.4-.3 2-.8c.6.5 1.2.8 2 .8s1.4-.3 2-.8c.6.5 1.2.8 2 .8s1.4-.3 2-.8"/>
                <path d="M12 2a4 4 0 0 0-4 4c0 3 4 7 4 7s4-4 4-7a4 4 0 0 0-4-4z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
                HAVUZ<span className="text-cyan-600">MARKET</span>
              </h1>
              <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest mt-1">Akıllı Havuz Çözümleri</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-6 relative">
            <input 
              type="text" 
              placeholder="30 farklı ürün ve kategoride arayın..." 
              className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-cyan-500 text-xs bg-slate-50" 
            />
            <Search className="absolute right-3.5 top-2.5 text-slate-400 w-4 h-4" />
          </div>

          <div className="flex items-center gap-3 text-xs">
            
            {/* GİRİŞ YAP & ÇIKIŞ */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                <User className="w-3.5 h-3.5 text-cyan-600" />
                <span className="font-bold text-slate-800">{currentUser}</span>
                <button onClick={() => { setCurrentUser(null); setNotification("Başarıyla çıkış yapıldı."); }} title="Çıkış Yap" className="text-slate-400 hover:text-red-500 ml-1">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveModal("giris")} 
                className="text-slate-700 hover:text-cyan-600 font-bold flex items-center gap-1 transition-colors px-2 py-1"
              >
                <User className="w-4 h-4" /> Giriş Yap
              </button>
            )}

            {/* ÜYE OL BUTONU */}
            {!currentUser && (
              <button 
                onClick={() => setActiveModal("uyeol")} 
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full font-bold shadow-sm transition-all"
              >
                Üye Ol
              </button>
            )}

            {/* Misafir Alışveriş Modu */}
            <button 
              onClick={() => {
                setIsGuestMode(!isGuestMode);
                setNotification(isGuestMode ? "Standart moda geçildi." : "Misafir alışveriş modu aktif! Üyeliksiz sipariş verebilirsiniz.");
              }} 
              className={`px-3 py-2 rounded-full font-bold border transition-all ${isGuestMode ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'}`}
            >
              {isGuestMode ? "Misafir Modu Aktif" : "Misafir Alışveriş"}
            </button>

            {/* Sepet Butonu */}
            <div 
              onClick={() => setActiveModal("sepet")} 
              className="relative cursor-pointer bg-slate-100 hover:bg-cyan-50 p-2.5 rounded-2xl border border-slate-200 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-slate-800" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  {cart.length}
                </span>
              )}
            </div>

          </div>
        </header>

        {/* ASİSTAN BANNER'I */}
        <div className="max-w-[1400px] mx-auto px-6 mt-6">
          <div className="bg-gradient-to-r from-slate-950 via-cyan-950 to-purple-950 p-5 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between shadow-xl border border-cyan-500/30 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-500 text-slate-950 p-3 rounded-2xl shadow-lg shadow-cyan-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-base text-white tracking-wide flex items-center gap-2">
                  Merhaba, Size Nasıl Yardımcı Olabilirim?
                </h4>
                <p className="text-xs text-cyan-200 mt-0.5">
                  Arpeta AI Akıllı Asistanı havuz kimyası, motor gücü ve tesisat seçimleriniz için 7/24 hazır.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveModal("asistan")} 
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all shadow-md whitespace-nowrap"
            >
              Asistana Soru Sor
            </button>
          </div>
        </div>

        {/* ANA İÇERİK: KARAR MOTORU + FİLTRELER + 30 ÜRÜN */}
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
          
          <div className="flex-1">
            
            {/* KARAR MOTORU */}
            <section className="bg-slate-900 text-white py-8 px-6 rounded-3xl text-center shadow-lg border border-slate-800 mb-6">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Yapay Zeka Destekli Karar Motoru
              </span>
              <h2 className="text-2xl font-black mt-3 mb-1">Bugün havuzunuz için modunuz nasıl?</h2>
              <p className="text-slate-400 text-xs mb-4">Bir ruh hali seçin, yapay zeka ihtiyacınız olan en az 2 kritik ürünü hemen eşleştirsin:</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { id: "yorgun", label: "💆‍♂️ Yorgunum, Masaj & Dinlenme", color: "bg-amber-600" },
                  { id: "titiz", label: "✨ Titizim, Kusursuz Hijyen & Berraklık", color: "bg-emerald-600" },
                  { id: "teknolojik", label: "🤖 Teknolojik & Akıllı Çözümler", color: "bg-purple-600" },
                  { id: "sakin", label: "🌊 Sakinlik & Huzurlu Akşamlar", color: "bg-cyan-600" },
                  { id: "hepsi", label: "Tüm Modları Sıfırla", color: "bg-slate-700" }
                ].map(mood => (
                  <button 
                    key={mood.id} 
                    onClick={() => setSelectedMood(mood.id)} 
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedMood === mood.id ? 'ring-2 ring-white scale-105 ' + mood.color : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </section>

            {/* KATEGORİ SEÇİMİ */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-cyan-600" /> Kategoriler:
                </span>
                {["Hepsi", "Kimyasallar", "Temizlik", "Aydınlatma", "Ekipmanlar", "Pompalar"].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)} 
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400 font-bold">Listelenen: {displayedProducts.length} Ürün</span>
            </div>

            {/* 30 ÜRÜNLÜK GRİD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {displayedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 flex flex-col justify-between group">
                  <div className="relative">
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-cyan-300 text-[10px] font-bold px-2.5 py-1 rounded-lg z-10 border border-cyan-500/30">
                      {product.tag}
                    </span>
                    <div className="h-48 overflow-hidden bg-slate-100">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-cyan-700 font-black text-[10px] tracking-wider uppercase block mb-1">{product.category}</span>
                      <h4 className="font-bold text-slate-800 text-xs min-h-[36px] line-clamp-2">{product.name}</h4>
                      <div className="mt-2.5 bg-cyan-50 border border-cyan-100 p-2 rounded-xl text-[10px] font-semibold text-cyan-900 leading-snug">
                        💡 {product.aiInsight}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 border-t pt-3 border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Fiyat</span>
                        <span className="text-base font-black text-slate-900">₺{product.price.toLocaleString('tr-TR')}</span>
                      </div>
                      <button 
                        onClick={() => addToCart(product)} 
                        className="bg-slate-900 hover:bg-cyan-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                      >
                        Sepete Ekle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* SAĞ YAN PANEL */}
          <aside className="w-full lg:w-64 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 h-fit sticky top-24">
            <h4 className="font-black text-xs text-slate-900 mb-3 pb-2 border-b border-slate-100 uppercase tracking-wider text-center">
              Hızlı İşlemler
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <button onClick={() => setActiveModal("kargo")} className="flex items-center gap-3 p-3 rounded-2xl font-bold text-slate-700 bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 transition-all text-left">
                <Truck className="w-4 h-4 text-cyan-600" /> Kargo Takip Sistemi
              </button>
              <button onClick={() => setActiveModal("blog")} className="flex items-center gap-3 p-3 rounded-2xl font-bold text-slate-700 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 transition-all text-left">
                <FileText className="w-4 h-4 text-purple-600" /> Staj Serüveni & Blog
              </button>
              <button onClick={() => setActiveModal("hakkimizda")} className="flex items-center gap-3 p-3 rounded-2xl font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all text-left">
                <HelpCircle className="w-4 h-4 text-slate-600" /> Hakkımızda
              </button>
            </div>
          </aside>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 mt-20 border-t-4 border-cyan-500">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-xs">
          <div>
            <h4 className="text-white font-black text-base mb-2">E-Havuz Market Global İletişim</h4>
            <p className="text-slate-400 mb-4 leading-relaxed">Havuz projeleri, otomasyon sistemleri ve toptan ürün siparişleriniz için 7/24 hizmetinizdeyiz.</p>
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" /> Mareşal Fevzi Çakmak Caddesi, Hatay, Türkiye</span>
              <span className="flex items-center gap-2 text-white font-bold"><Mail className="w-4 h-4 text-cyan-400" /> destek@ehavuzmarket.com</span>
            </div>
          </div>
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
            <h5 className="text-white font-bold uppercase tracking-wider mb-2 text-[11px]">Hızlı Mesaj Bırakın</h5>
            <form onSubmit={(e) => { e.preventDefault(); alert("Mesajınız iletildi!"); }} className="flex flex-col gap-2">
              <input type="email" placeholder="E-posta Adresiniz" required className="bg-slate-900 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-xs" />
              <textarea placeholder="Mesajınız..." rows="2" required className="bg-slate-900 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-xs"></textarea>
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black py-2 rounded-xl transition-all">Gönder</button>
            </form>
          </div>
        </div>
        <div className="bg-slate-950 text-center py-4 text-[10px] text-slate-500 border-t border-slate-800">
          &copy; 2026 E-Havuz Market. Tüm hakları saklıdır. Global standartlarda geliştirilmiştir.
        </div>
      </footer>

    </div>
  );
}