import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Search, User, HelpCircle, FileText, Truck, Mail, MapPin, Sparkles, Filter, CheckCircle, X, LogIn, UserPlus, ArrowLeft, CreditCard, History, ShieldAlert, Key } from 'lucide-react';

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

  
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ fullname: '', city: '', phone: '', email: '' });
  const [guestForm, setGuestForm] = useState({ fullname: '', email: '', phone: '', city: '' });
  const [forgotEmail, setForgotEmail] = useState("");

  // Oturum ve PayTR Akış State'leri
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]); 
  const [orderSearchEmail, setOrderSearchEmail] = useState("");
  const [paytrStep, setPaytrStep] = useState(false); 
  const [paytrTokenData, setPaytrTokenData] = useState(null);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  const [subModal, setSubModal] = useState(""); // login, register, forgot, guestForm

  // API Bağlantısı (Render Canlı Backend)
  const BACKEND_URL = "https://e-havuzz-backend.onrender.com";

  // 1. Ürünleri Canlı Sunucudan Çekme
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/products`)
      .then(response => {
        setDbProducts(response.data);
        setDisplayedProducts(response.data);
      })
      .catch(error => {
        console.error("Hata:", error);
        setNotification("❌ Canlı sunucu verileri yüklenirken bir pürüz oluştu!");
      });
  }, []);

  // Siparişleri Anlık Sorgulama Fonksiyonu
  const fetchOrders = (email) => {
    if (!email) return;
    axios.get(`${BACKEND_URL}/api/orders/search?email=${email}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Arama, Kategori ve Ruh Hali Filtre Entegrasyonu
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
    setNotification(`✅ ${product.name} eklendi! Toplam: ₺${toplamTutar.toLocaleString('tr-TR')}`);
  };

  // Sepet Aşamasından Sonra Seçim Ekranını Tetikler
  const handleCheckoutInit = () => {
    if (isLoggedIn) {
      // Kullanıcı zaten giriş yapmışsa direkt PayTR token aşamasına geç
      generatePaytrToken(currentUser.email, currentUser.fullname, currentUser.phone);
    } else {
      // Giriş yapmamışsa Seçim Modalını Göster (Giriş yap / Misafir devam et)
      setPaytrStep(true);
      setSubModal("checkout_choice");
    }
  };

  // 2. PAYTR API TOKEN ÜRETİMİ (Axios POST)
  const generatePaytrToken = (email, fullname, phone) => {
    axios.post(`${BACKEND_URL}/api/paytr/token`, {
      totalPrice: sepetToplamTutar,
      email,
      fullname,
      phone
    })
    .then(res => {
      if (res.data.success) {
        setPaytrTokenData(res.data);
        setSubModal("paytr_iframe");
      }
    })
    .catch(() => {
      setNotification("❌ PayTR Token üretilirken API hatası oluştu!");
    });
  };

  // Misafir Bilgileri Alındıktan Sonra Tetiklenen PayTR Akışı
  const handleGuestFormSubmit = (e) => {
    e.preventDefault();
    setIsGuestCheckout(true);
    generatePaytrToken(guestForm.email, guestForm.fullname, guestForm.phone);
  };

  // 3. ÖDEME ONAYI VE SİPARİŞİ VERİTABANINA YAZMA (Axios POST)
  const handleFinalPaymentConfirm = () => {
    const buyerInfo = isGuestCheckout ? guestForm : {
      fullname: currentUser?.fullname || "Üye Kullanıcı",
      email: currentUser?.email || "uye@arpeta.com",
      phone: currentUser?.phone || "0555XXXXXXX"
    };

    const payload = {
      items: cart,
      totalPrice: sepetToplamTutar,
      isGuest: isGuestCheckout,
      buyerName: buyerInfo.fullname,
      buyerEmail: buyerInfo.email,
      buyerPhone: buyerInfo.phone,
      merchant_oid: paytrTokenData?.merchant_oid
    };

    axios.post(`${BACKEND_URL}/api/orders`, payload)
      .then(res => {
        if (res.data.success) {
          fetchOrders(buyerInfo.email);
          setCart([]);
          setPaytrStep(false);
          setPaytrTokenData(null);
          setActiveModal("kargo");
          setNotification(`💳 PayTR Ödemesi Başarıyla Tamamlandı! Sipariş No: ${res.data.order.orderId}`);
        }
      })
      .catch(() => {
        setNotification("❌ Sipariş veritabanına işlenirken hata oluştu!");
      });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    const user = { fullname: loginForm.username, email: `${loginForm.username}@gmail.com`, city: "Hatay", phone: "0532 111 22 33" };
    setCurrentUser(user);
    setSubModal("");
    if (paytrStep) {
      // Eğer sepet adımlarında giriş yaptıysa direkt PayTR tetikle
      setIsGuestCheckout(false);
      generatePaytrToken(user.email, user.fullname, user.phone);
    } else {
      setActiveModal("");
      setNotification(`🔑 Hoş geldin ${loginForm.username}! Sipariş yönetim paneli açıldı.`);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    const user = { fullname: registerForm.fullname, email: registerForm.email, city: registerForm.city, phone: registerForm.phone };
    setCurrentUser(user);
    setSubModal("");
    if (paytrStep) {
      setIsGuestCheckout(false);
      generatePaytrToken(user.email, user.fullname, user.phone);
    } else {
      setActiveModal("");
      setNotification(`📝 Kayıt Başarılı! Hoş geldin ${registerForm.fullname}.`);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(`✉️ Şifre sıfırlama linki ${forgotEmail} adresine başarıyla gönderildi bebek!`);
    setSubModal("login");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setOrders([]);
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
                {activeModal === "sepet" && "🛒 Alışveriş Sepetiniz & PayTR"}
                {activeModal === "asistan" && "🤖 Akıllı Havuz Asistanı"}
                {activeModal === "blog" && "📝 E-Havuz Market Blog"}
                {activeModal === "hakkimizda" && "✨ Hakkımızda"}
                {activeModal === "kargo" && "🚚 Sipariş Takip Durumu"}
                {activeModal === "auth" && "🔑 Kullanıcı İşlem Merkezi"}
                {activeModal === "orders" && "📋 Sipariş Takip & Geçmişi"}
              </h3>
              <button onClick={() => { setActiveModal(""); setPaytrStep(false); setAsistanCevap(""); }} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-slate-700 flex-1 flex flex-col justify-between">
              <div>
                
                {/* 1. SEPET VE PAYTR ÖDEME ENTEGRASYON AKIŞLARI */}
                {activeModal === "sepet" && (
                  <div className="text-sm">
                    {!paytrStep ? (
                      <>
                        {cart.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 font-medium">Sepetiniz şu anda boş. Ürün ekleyerek başlayabilirsiniz!</div>
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
                            <button onClick={handleCheckoutInit} className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black py-3 rounded-xl mt-4 hover:opacity-95 transition-all shadow-md">
                              Güvenli Ödeme Aşamasına Geç ➔
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* A - Giriş Seçim Ekranı */}
                        {subModal === "checkout_choice" && (
                          <div className="flex flex-col gap-4 text-center py-4">
                            <h4 className="font-black text-slate-800 text-sm">Nasıl devam etmek istersiniz bebek?</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                              <button onClick={() => setSubModal("checkout_login")} className="p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all">
                                <LogIn className="w-6 h-6 text-purple-700" />
                                <span className="font-black text-xs text-purple-900">Giriş Yaparak Devam Et</span>
                              </button>
                              <button onClick={() => setSubModal("checkout_guest")} className="p-4 bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all">
                                <UserPlus className="w-6 h-6 text-cyan-700" />
                                <span className="font-black text-xs text-cyan-900">Misafir Olarak Devam Et</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* B - Sepet İçi Giriş Yap Formu */}
                        {subModal === "checkout_login" && (
                          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
                            <span className="font-black text-xs text-purple-900 uppercase">Üye Girişi</span>
                            <input type="text" required placeholder="Kullanıcı Adı" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-white" />
                            <input type="password" required placeholder="Şifre" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-white" />
                            <button type="submit" className="w-full bg-purple-600 text-white font-black py-2.5 rounded-xl text-xs">Giriş Yap ve Ödemeyi Tetikle</button>
                          </form>
                        )}

                        {/* C - Misafir Teslimat Bilgileri Formu */}
                        {subModal === "checkout_guest" && (
                          <form onSubmit={handleGuestFormSubmit} className="flex flex-col gap-3 animate-fadeIn">
                            <span className="font-black text-xs text-cyan-900 uppercase">Misafir İletişim & Teslimat Bilgileri</span>
                            <input type="text" required placeholder="Adınız Soyadınız" value={guestForm.fullname} onChange={(e) => setGuestForm({...guestForm, fullname: e.target.value})} className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-300" />
                            <input type="email" required placeholder="E-Posta Adresiniz (Takip İçin Önemli)" value={guestForm.email} onChange={(e) => setGuestForm({...guestForm, email: e.target.value})} className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-300" />
                            <input type="tel" required placeholder="Telefon Numaranız" value={guestForm.phone} onChange={(e) => setGuestForm({...guestForm, phone: e.target.value})} className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-300" />
                            <input type="text" required placeholder="Şehir / İlçe" value={guestForm.city} onChange={(e) => setGuestForm({...guestForm, city: e.target.value})} className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-300" />
                            <button type="submit" className="w-full bg-cyan-500 text-white font-black py-2.5 rounded-xl text-xs">Bilgileri Kaydet ve PayTR'ye İlerle</button>
                          </form>
                        )}

                        {/* D - PAYTR iFRAME ÖDEME EKRANI SİMÜLASYONU */}
                        {subModal === "paytr_iframe" && (
                          <div className="flex flex-col gap-3 bg-slate-900 p-4 rounded-2xl border-2 border-purple-500 text-white animate-fadeIn">
                            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                              <span className="font-black text-xs text-purple-400 uppercase tracking-widest flex items-center gap-1">🔒 PAYTR SECURE iFRAME</span>
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">TEST MODU</span>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex flex-col gap-1">
                              <div>Sipariş No: <span className="text-white font-bold">{paytrTokenData?.merchant_oid}</span></div>
                              <div>Token: <span className="text-cyan-400 font-mono break-all text-[9px]">{paytrTokenData?.token}</span></div>
                              <div>Toplam Tutar: <span className="text-emerald-400 font-black">₺{sepetToplamTutar.toLocaleString('tr-TR')}</span></div>
                            </div>
                            
                            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex flex-col gap-2">
                              <label className="block text-[10px] font-black uppercase text-slate-400">Kredi Kartı No (Simüle)</label>
                              <input type="text" required disabled placeholder="4000 1234 5678 9010 (PayTR Güvenli Giriş)" className="w-full p-2 text-xs font-bold rounded-lg bg-slate-950 text-slate-400 border border-slate-700" />
                              <div className="grid grid-cols-2 gap-2">
                                <input type="text" disabled placeholder="12/29" className="w-full p-2 text-xs font-bold rounded-lg bg-slate-950 text-slate-400 border border-slate-700" />
                                <input type="text" disabled placeholder="000" className="w-full p-2 text-xs font-bold rounded-lg bg-slate-950 text-slate-400 border border-slate-700" />
                              </div>
                            </div>

                            <button type="button" onClick={handleFinalPaymentConfirm} className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl transition-all text-xs uppercase tracking-wider mt-1 flex items-center justify-center gap-1.5">
                              <CreditCard className="w-4 h-4" /> Ödemeyi Onayla (Callback Tetikle)
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* 2. SİPARİŞ TAKİP VE GEÇMİŞ SORGULAMA PANELİ */}
                {activeModal === "orders" && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 flex flex-col gap-2">
                      <label className="block text-xs font-black text-slate-700 uppercase">📧 Sipariş Geçmişi Sorgulama</label>
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          placeholder="Sipariş verdiğiniz e-posta adresini girin..." 
                          value={orderSearchEmail}
                          onChange={(e) => setOrderSearchEmail(e.target.value)}
                          className="flex-1 p-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-white" 
                        />
                        <button onClick={() => fetchOrders(orderSearchEmail)} className="bg-purple-600 text-white font-black text-xs px-4 rounded-xl">Sorgula</button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {orders.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 font-medium">Girilen e-posta adresine ait güncel veya geçmiş sipariş kaydı bulunamadı.</div>
                      ) : (
                        orders.map((order, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-2xl border-2 border-slate-200 text-xs flex flex-col gap-1.5 shadow-sm animate-fadeIn">
                            <div className="flex justify-between font-black text-slate-900">
                              <span className="text-purple-700">Sipariş ID: {order.orderId}</span>
                              <span className="text-emerald-600">₺{order.totalPrice.toLocaleString('tr-TR')}</span>
                            </div>
                            <div className="text-[11px] font-bold text-slate-500 flex justify-between border-b pb-1.5">
                              <span>Alıcı: {order.buyerName} ({order.isGuest ? "Misafir" : "Üye"})</span>
                              <span>Tarih: {order.date}</span>
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                              {order.items && order.items.map((item, i) => (
                                <div key={i} className="text-[11px] font-bold text-slate-700 flex justify-between">
                                  <span>• {item.name}</span>
                                  <span>₺{item.price.toLocaleString('tr-TR')}</span>
                                </div>
                              ))}
                            </div>
                            <div className="text-[10px] font-black tracking-wider uppercase text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg w-fit mt-2 border border-purple-200 flex items-center gap-1">
                              <Truck className="w-3 h-3" /> Durum: {order.status}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 3. KULLANICI AUTH PANELİ (Kayıt, Giriş, Şifremi Unuttum) */}
                {activeModal === "auth" && (
                  <div className="text-sm">
                    {subModal === "login" && (
                      <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                        <p className="text-xs text-slate-500 font-semibold">Hesabınıza giriş yaparak kayıtlı adreslerinizi ve siparişlerinizi yönetin.</p>
                        <input type="text" required placeholder="Kullanıcı Adı" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold" />
                        <input type="password" required placeholder="Şifre" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold" />
                        <button type="submit" className="w-full bg-purple-600 text-white font-black py-3 rounded-xl shadow-md text-sm">Güvenli Giriş Yap</button>
                        <button type="button" onClick={() => setSubModal("forgot")} className="text-xs text-purple-700 font-bold hover:underline self-start">🔑 Şifremi Unuttum?</button>
                      </form>
                    )}

                    {subModal === "register" && (
                      <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3 animate-fadeIn">
                        <p className="text-xs text-slate-500 font-semibold">Yeni bir profil oluşturarak tüm sipariş geçmişinizi tek panelden takip edin.</p>
                        <input type="text" required placeholder="İsim Soyisim" value={registerForm.fullname} onChange={(e) => setRegisterForm({...registerForm, fullname: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold" />
                        <input type="email" required placeholder="E-Posta Adresi" value={registerForm.email} onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold" />
                        <input type="text" required placeholder="Bulunduğunuz İl" value={registerForm.city} onChange={(e) => setRegisterForm({...registerForm, city: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold" />
                        <input type="tel" required placeholder="Telefon Numarası" value={registerForm.phone} onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold" />
                        <button type="submit" className="w-full bg-cyan-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wide shadow-sm">Kayıt İşlemini Tamamla</button>
                      </form>
                    )}

                    {subModal === "forgot" && (
                      <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 animate-fadeIn">
                        <h4 className="font-black text-sm text-slate-800 flex items-center gap-1"><Key className="w-4 h-4 text-purple-600" /> Şifre Sıfırlama Merkezi</h4>
                        <p className="text-xs text-slate-500 font-semibold">Sistemde kayıtlı e-posta adresinizi girerek yeni şifre oluşturma bağlantısı talep edebilirsiniz.</p>
                        <input type="email" required placeholder="E-Posta Adresiniz" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold" />
                        <div className="flex gap-2">
                          <button type="submit" className="flex-1 bg-purple-600 text-white font-black py-2.5 rounded-xl text-xs">Sıfırlama Bağlantısı Gönder</button>
                          <button type="button" onClick={() => setSubModal("login")} className="px-4 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">Geri Dön</button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {activeModal === "asistan" && (
                  <div className="flex flex-col gap-4 text-sm">
                    <p className="text-xs text-slate-500 font-semibold">Havuz otomasyon altyapısı ve entegre PayTR mimarimiz hakkında sorularınızı yanıtlayabilirim.</p>
                    <form onSubmit={handleAsistanSorgu} className="flex flex-col gap-2">
                      <input type="text" value={asistanSoru} onChange={(e) => setAsistanSoru(e.target.value)} placeholder="Örn: Projede PayTR entegrasyonu nasıl yapıldı?" className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-purple-500 text-xs text-slate-800 font-bold" />
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
                    <h4 className="font-black text-slate-900 text-sm mb-1 text-purple-900">📝 PayTR iFrame Sanal POS ve Callback Optimizasyon Özetleri</h4>
                    <p className="text-slate-700 mt-2">Mühendislik ekibimiz, sunucu tarafında oluşturulan SHA256 şifreli hash kodlarını PayTR test gateway sistemine başarıyla bağlamıştır. Hem üyelikli hem de üyeliksiz alışveriş hareketleri izlenebilmektedir.</p>
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
                    <p className="text-xs text-slate-600 font-bold max-w-xs mx-auto">Sipariş paketiniz Arpeta Yazılım merkezinden paketleme aşamasına geçmiştir. Detayları üst menüdeki 'Sipariş Sorgula' sekmesinden takip edebilirsiniz bebek.</p>
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
              {isLoggedIn ? `● Oturum Açık: ${currentUser?.fullname}` : "● Standart Giriş Modu Aktif"}
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

          <div className="flex-1 max-w-lg w-full relative">
            <label className="block text-[11px] font-black text-purple-900 mb-1 tracking-wide uppercase">🔍 Aradığınız ürün nedir?</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Örn: led lamba, şelale, klor, pompa..." 
                className="w-full pl-5 pr-12 py-3 border-2 border-slate-300 rounded-full focus:outline-none focus:border-cyan-500 bg-slate-50 font-bold text-sm shadow-inner transition-all" 
              />
              <Search className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
            </div>
          </div>

          {/* DİNAMİK HEADER KULLANICI KONTROL ALANLARI */}
          <div className="flex items-center flex-wrap gap-3 text-sm shrink-0">
            {!isLoggedIn ? (
              <>
                <button type="button" onClick={() => { setActiveModal("auth"); setSubModal("login"); }} className="text-slate-700 hover:text-purple-700 flex items-center gap-1 font-extrabold transition-colors border-2 border-slate-200 px-4 py-2 rounded-xl bg-slate-50 cursor-pointer shadow-sm text-xs">
                  Giriş Yap
                </button>
                <button type="button" onClick={() => { setActiveModal("auth"); setSubModal("register"); }} className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl font-extrabold transition-all shadow-sm cursor-pointer text-xs">
                  Üye Ol
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => { setActiveModal("orders"); fetchOrders(currentUser?.email); }} className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-extrabold border-2 border-emerald-200 px-4 py-2 rounded-xl bg-emerald-50 cursor-pointer shadow-sm text-xs">
                  <History className="w-4 h-4" /> Siparişlerim
                </button>
                <button type="button" onClick={handleLogout} className="text-rose-600 hover:text-rose-700 font-extrabold px-3 py-2 border border-rose-200 rounded-xl bg-rose-50 text-xs">
                  Çıkış
                </button>
              </>
            )}
            
            <button onClick={() => { setActiveModal("orders"); }} className="px-4 py-2 rounded-xl font-black transition-all shadow-sm border border-purple-600 bg-white text-purple-700 hover:bg-purple-50 text-xs">
              📋 Sipariş Sorgula
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

            <div className="bg-white p-5 rounded-2xl shadow-md border-2 border-slate-200 mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-800 mr-2 flex items-center gap-1 uppercase tracking-wide"><Filter className="w-4 h-4 text-purple-700" /> Kategori Seçin:</span>
              {["Hepsi", "Kimyasallar", "Temizlik", "Aydınlatma", "Ekipmanlar", "Pompalar"].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${selectedCategory === cat ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}>{cat}</button>
              ))}
            </div>

            {/* DİNAMİK 20 ÜRÜN LİSTELEME ALANI */}
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
                        <img src={product.image || `https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&q=80`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
        <div className="bg-slate-950 text-center py-4 text-[11px] text-slate-500 border-t border-slate-900 font-bold">&copy; 2026 HavuzMarket. Tüm Hakları Arpeta Yazılım Adına Saklıdır.</div>
      </footer>

    </div>
  );
}