import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Search, User, HelpCircle, FileText, Truck, Mail, MapPin, Sparkles, Filter, CheckCircle, X, LogIn, UserPlus, ArrowLeft } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [dbProducts, setDbProducts] = useState([]); 
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [notification, setNotification] = useState("");

  const [activeModal, setActiveModal] = useState(""); 
  const [asistanSoru, setAsistanSoru] = useState("");
  const [asistanCevap, setAsistanCevap] = useState("");

  useEffect(() => {
    axios.get('https://e-havuzz-backend.onrender.com/api/products')
      .then(response => {
        setDbProducts(response.data);
        setDisplayedProducts(response.data);
      })
      .catch(error => {
        console.error("Veri çekilirken hata oluştu:", error);
        setNotification("❌ Canlı sunucuya bağlanılamadı veya veriler yüklenemedi!");
      });
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
    if (selectedMood && selectedMood !== "hepsi") filtrelenmis = filtrelenmis.filter(p => p.moods.includes(selectedMood));
    setDisplayedProducts(filtrelenmis);
  }, [selectedCategory, selectedMood, dbProducts]);

  const addToCart = (product) => {
    const guncelSepet = [...cart, product];
    setCart(guncelSepet);
    const toplamTutar = guncelSepet.reduce((sum, item) => sum + item.price, 0);
    setNotification(`✅ ${product.name} eklendi! Güncel Tutar: ₺${toplamTutar.toLocaleString('tr-TR')}`);
  };

  const handleCheckout = () => {
    const orderData = { items: cart, totalPrice: sepetToplamTutar, isGuest: isGuestMode };
    axios.post('https://e-havuzz-backend.onrender.com/api/orders', orderData)
      .then(response => {
        if (response.data.success) {
          alert(`🎉 ${response.data.message}\nSipariş Numaranız: ${response.data.order.orderId}`);
          setCart([]);
          setActiveModal("");
        }
      })
      .catch(error => {
        alert("Sipariş iletilirken bir hata meydana geldi!");
      });
  };

  const handleAsistanSorgu = (e) => {
    e.preventDefault();
    if (!asistanSoru) return;
    setAsistanCevap("🤖 Akıllı Asistan: Harika bir soru! Geliştirdiğimiz modern mimaride sepet yönetimini ve ürün akışını Axios ile canlı Render backend API'miz üzerinden asenkron olarak yönetiyoruz güzelim!");
  };

  // DUMMY GİRİŞ VE ÜYE OLMA FONKSİYONLARI
  const handleDummyLogin = () => {
    setNotification("🔑 [Dummy API] Giriş Başarılı! Hoş geldin Nuray Mutlu. Standart kullanıcı token'ı oluşturuldu.");
  };

  const handleDummyRegister = () => {
    setNotification("📝 [Dummy API] Kayıt Başarılı! Yeni kullanıcı profili simüle edildi ve veri tabanına eklendi.");
  };

  const sepetToplamTutar = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-[#f0f7ff] text-slate-800 flex flex-col justify-between relative">
      
      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white font-bold text-xs md:text-sm px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-2 border-2 border-cyan-400 max-w-md text-center">
          <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* MODAL SİSTEMİ */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
            
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-purple-950 via-purple-900 to-[#00b4d8] text-white">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                {activeModal === "sepet" && "🛒 Güncel Sepetiniz"}
                {activeModal === "asistan" && "🤖 Akıllı Havuz Asistanı"}
                {activeModal === "blog" && "📝 E-Havuz Market Blog"}
                {activeModal === "hakkimizda" && "✨ Hakkımızda"}
                {activeModal === "kargo" && "🚚 Kargo Takip Durumu"}
              </h3>
              <button onClick={() => { setActiveModal(""); setAsistanCevap(""); setAsistanSoru(""); }} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-slate-600 flex-1 flex flex-col justify-between">
              <div>
                {activeModal === "sepet" && (
                  <div className="text-sm">
                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">Sepetiniz şu anda boş bebek. Ürün ekleyerek başlayabilirsiniz!</div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {cart.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                            <div className="flex-1">
                              <h5 className="font-bold text-xs text-slate-800 line-clamp-1">{item.name}</h5>
                              <span className="text-[10px] text-[#00b4d8] font-bold uppercase">{item.category}</span>
                            </div>
                            <span className="font-extrabold text-xs text-slate-900">₺{item.price.toLocaleString('tr-TR')}</span>
                          </div>
                        ))}
                        <div className="border-t pt-4 mt-2 flex justify-between items-center font-black text-slate-900 text-base">
                          <span>Toplam Tutar:</span>
                          <span className="text-purple-600">₺{sepetToplamTutar.toLocaleString('tr-TR')}</span>
                        </div>
                        <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-[#00b4d8] to-purple-600 text-white font-bold py-3 rounded-xl mt-4 hover:opacity-95 transition-opacity shadow-md">
                          Siparişi {isGuestMode ? "Misafir Olarak" : ""} Onayla ve API'ye Gönder
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeModal === "asistan" && (
                  <div className="flex flex-col gap-4 text-sm">
                    <p className="text-xs text-slate-500">Havuz bakımı, modern React mimarisi veya akıllı cihaz öngörüleri hakkında merak ettiğin her şeyi sorabilirsin güzelim.</p>
                    <form onSubmit={handleAsistanSorgu} className="flex flex-col gap-2">
                      <input type="text" value={asistanSoru} onChange={(e) => setAsistanSoru(e.target.value)} placeholder="Örn: Projede state yönetimi nasıl yapıldı?" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-500 text-xs text-slate-800 font-medium" />
                      <button type="submit" className="bg-purple-600 text-white font-bold text-xs py-2.5 rounded-xl">Cevapla</button>
                    </form>
                    {asistanCevap && (
                      <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl text-xs text-purple-900 font-semibold leading-relaxed animate-pulse">
                        {asistanCevap}
                      </div>
                    )}
                  </div>
                )}

                {activeModal === "blog" && (
                  <div className="flex flex-col gap-4 text-xs md:text-sm leading-relaxed">
                    <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl">
                      <h4 className="font-black text-slate-800 text-sm mb-1 text-purple-800">📝 React ile E-Ticaret Projesi Geliştirirken Öğrendiklerim</h4>
                      <span className="text-[9px] text-slate-400 font-bold block mb-3">Yazar: Arpeta R&D Team | Temmuz 2026</span>
                      <p className="mb-2">Her yazılım projesi yeni bir öğrenme süreci demek. Bu e-ticaret projesinde amacım sadece çalışan bir uygulama geliştirmek değil, aynı zamanda modern React mimarisini adım adım deneyimlemekti.</p>
                      <p className="mb-2">Projeye hızlı bir başlangıç yapabilmek için Vite ve React kullandım. Sayfalar arası geçişleri yönetmek için react-router-dom ile dinamik routing yapısını oluşturdum. Ürün detay sayfalarında useParams kullanarak URL üzerinden gelen ID bilgisine göre ilgili ürünü ekrana getirdim.</p>
                      <p className="mb-2">İlk aşamada backend geliştirmeyi beklememek adına tüm ürün verilerini statik bir JSON dosyasında tuttum. Sepet işlemlerini ise React Context API ile merkezi bir state üzerinden yönettim. Böylece prop drilling problemini ortadan kaldırırken daha temiz ve yönetilebilir bir yapı kurmuş oldum.</p>
                    </div>
                  </div>
                )}

                {activeModal === "hakkimizda" && (
                  <div className="flex flex-col gap-3 text-xs md:text-sm leading-relaxed text-slate-600">
                    <div className="border-b pb-2 border-slate-100">
                      <h4 className="text-base font-black text-purple-700 uppercase tracking-tight">Biz Kimiz?</h4>
                    </div>
                    <p className="text-slate-700 font-medium italic bg-cyan-50 p-3 rounded-xl border border-cyan-100">
                      "E-Havuz Market, havuz bakım ürünleri ve ekipmanlarını güvenilir, hızlı ve kolay bir alışveriş deneyimiyle kullanıcılarına sunmayı hedefleyen modern bir e-ticaret platformudur."
                    </p>
                    <p>Kaliteli ürün yelpazemiz, kullanıcı dostu arayüzümüz ve pratik alışveriş sürecimiz sayesinde ihtiyaç duyduğunuz ürünlere kolayca ulaşmanızı amaçlıyoruz. Müşteri memnuniyetini ön planda tutarak güvenilir hizmet anlayışımızla sizlere en iyi deneyimi sunmak için çalışıyoruz.</p>
                  </div>
                )}

                {activeModal === "kargo" && (
                  <div className="text-center py-4 flex flex-col items-center gap-3 text-sm">
                    <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full w-fit">
                      <Truck className="w-8 h-8 animate-bounce" />
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm">🚚 Müjde, Kargonuz Yola Çıktı bebek!</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">Siparişiniz Arpeta Yazılım altyapı merkezinden başarıyla paketlenmiş ve yola çıkmıştır. Tahmini teslimat süresi 24 saattir.</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-2/3 rounded-full"></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold block">Durum: Dağıtımda</span>
                  </div>
                )}
              </div>

              {/* YENİ ÖZELLİK: MODALLARIN ALTINA EKLEDİĞİMİZ ŞIK GERİ DÖN BUTONU */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button onClick={() => { setActiveModal(""); setAsistanCevap(""); setAsistanSoru(""); }} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm">
                  <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Geri Dön
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ANA SAYFA DÜZENİ */}
      <div>
        <div className="bg-[#0f172a] text-white text-xs py-2 px-4 flex justify-between items-center">
          <span>✦ 1000₺ Üzeri Alışverişlerde Ücretsiz Kargo</span>
          <div className="flex gap-4">
            <span className={`font-bold ${isGuestMode ? 'text-purple-400' : 'text-cyan-400'}`}>
              {isGuestMode ? "● Misafir Alışveriş Bölümü Aktif" : "● Standart Mod"}
            </span>
          </div>
        </div>

        <header className="bg-white shadow-sm sticky top-0 z-40 px-6 py-4 flex justify-between items-center border-b border-cyan-100">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#00b4d8] to-purple-600 text-white p-2 rounded-xl font-bold text-xl shadow-md">HM</div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Havuz<span className="text-[#00b4d8]">Market</span></h1>
              <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Premium Altyapı</p>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-6 relative">
            <input type="text" placeholder="Ürün veya kategori ara..." className="w-full pl-4 pr-10 py-2 border-2 border-slate-200 rounded-full focus:outline-none focus:border-[#00b4d8] transition-all text-sm" />
            <Search className="absolute right-4 top-2.5 text-slate-400 w-4 h-4" />
          </div>

          {/* DUMMY DATA SİMÜLASYONU GİRİŞ/ÜYE OL BUTONLARI */}
          <div className="flex items-center gap-3 text-sm">
            <button onClick={handleDummyLogin} className="text-slate-600 hover:text-[#00b4d8] flex items-center gap-1 font-bold transition-colors">
              <LogIn className="w-4 h-4 text-slate-400" /> Giriş Yap
            </button>
            <button onClick={handleDummyRegister} className="bg-[#00b4d8] text-white px-4 py-1.5 rounded-full font-bold hover:bg-cyan-500 transition-all shadow-sm flex items-center gap-1 text-xs">
              <UserPlus className="w-3 h-3" /> Üye Ol
            </button>
            
            <button onClick={() => { setIsGuestMode(!isGuestMode); setNotification(isGuestMode ? "ℹ️ Standart Alışveriş Moduna Geçildi." : "🔮 Misafir Alışveriş Bölümü Açıldı! Üyeliksiz Sipariş Verebilirsiniz."); }} className={`px-4 py-1.5 rounded-full font-bold transition-all shadow-sm border text-xs ${isGuestMode ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-purple-600 hover:bg-purple-50'}`}>
              {isGuestMode ? "Misafir Bölümündesiniz" : "Misafir Alışveriş Bölümü"}
            </button>

            <div onClick={() => setActiveModal("sepet")} className="relative cursor-pointer text-slate-700 hover:text-purple-600 ml-2 transition-colors bg-slate-50 p-2 rounded-xl border border-slate-100">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* PREMIUM YAPILAN VE ARTIK ÇOK DAHA PARLAK OLAN AI ASİSTAN KUTUSU */}
        <div className="max-w-[1400px] mx-auto px-6 mt-6">
          <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-[#00b4d8] p-6 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between shadow-2xl border-2 border-purple-500/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-amber-400 to-purple-600 p-3 rounded-2xl shadow-lg animate-bounce">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-black text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-100 bg-clip-text text-transparent flex items-center gap-2">
                  Arpeta AI Akıllı Karar Motoru Aktif!
                </h4>
                <p className="text-xs text-purple-200 font-medium max-w-xl mt-1 leading-relaxed">
                  "Merhaba! Havuz otomasyon altyapınız, sepet akışınız ve modern mimarimizle ilgili tüm sorularınızı yanıtlamaya hazırım güzelim. Teknolojiyi deneyimleyin."
                </p>
              </div>
            </div>
            <button onClick={() => setActiveModal("asistan")} className="w-full md:w-auto bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl hover:scale-105 transition-all shadow-xl tracking-wider uppercase">
              🚀 ASİSTANA SORU SOR
            </button>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <section className="bg-gradient-to-r from-slate-900 via-purple-950 to-[#03045e] text-white py-10 px-6 rounded-3xl text-center shadow-lg mb-8">
              <span className="bg-[#00b4d8]/20 text-[#00b4d8] border border-[#00b4d8]/30 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Yapay Zeka Destekli Karar Motoru</span>
              <h2 className="text-3xl font-extrabold mt-3 mb-2">Bugün modunuz nasıl?</h2>
              <p className="text-cyan-100 text-xs mb-5">Ruh halinizi seçin, sistemimiz havuzunuzun ihtiyacını anında listelesin:</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { id: "yorgun", label: "Yorgunum, Masaj/Keyif İstiyorum 💆‍♂️", color: "bg-amber-500" },
                  { id: "titiz", label: "Titizim, Havuzum Pırıl Pırıl Olmalı ✨", color: "bg-emerald-500" },
                  { id: "teknolojik", label: "Teknolojik Çözümler Arıyorum 🤖", color: "bg-purple-500" },
                  { id: "sakin", label: "Sakinlik ve Huzur Peşindeyim 🌊", color: "bg-blue-500" },
                  { id: "hepsi", label: "Tüm Modları Göster", color: "bg-slate-600" }
                ].map(mood => (
                  <button key={mood.id} onClick={() => setSelectedMood(mood.id)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${selectedMood === mood.id ? 'ring-2 ring-white scale-105 ' + mood.color : 'bg-white/10 hover:bg-white/20 text-white'}`}>{mood.label}</button>
                ))}
              </div>
            </section>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1"><Filter className="w-3 h-3 text-purple-600" /> Kategori Seçin:</span>
              {["Hepsi", "Kimyasallar", "Temizlik", "Aydınlatma", "Ekipmanlar", "Pompalar"].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-[#00b4d8] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {displayedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col justify-between group">
                  <div className="relative">
                    <span className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md z-10 shadow-sm">{product.tag}</span>
                    <div className="h-44 overflow-hidden bg-slate-50">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[#00b4d8] font-bold text-[10px] tracking-wider uppercase block mb-1">{product.category}</span>
                      <h4 className="font-bold text-slate-700 text-xs line-clamp-2 min-h-[32px]">{product.name}</h4>
                      <div className="mt-3 bg-purple-50 border border-purple-100 p-2 rounded-xl text-[10px] font-semibold text-purple-700">{product.aiInsight}</div>
                    </div>
                    <div className="flex items-center justify-between mt-4 border-t pt-2 border-slate-50">
                      <span className="text-base font-black text-slate-900">₺{product.price.toLocaleString('tr-TR')}</span>
                      <button onClick={() => addToCart(product)} className="bg-purple-600 hover:bg-[#00b4d8] text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">Sepete Ekle</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="w-full lg:w-64 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 h-fit sticky top-24">
            <h4 className="font-extrabold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100 text-center text-purple-600 uppercase tracking-wider">Hızlı İşlemler</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActiveModal("blog")} className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full">
                <FileText className="w-4 h-4 text-purple-500" /> Blog Yazıları
              </button>
              <button onClick={() => setActiveModal("hakkimizda")} className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-cyan-50 hover:text-[#00b4d8] transition-all text-left w-full">
                <HelpCircle className="w-4 h-4 text-[#00b4d8]" /> Hakkımızda
              </button>
              <button onClick={() => setActiveModal("kargo")} className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full">
                <Truck className="w-4 h-4 text-purple-500" /> Kargo Takip Sistemi
              </button>
            </div>
          </aside>
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-300 mt-16 border-t-4 border-purple-600">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="text-white font-black text-lg mb-3">Bizimle İletişime Geçin</h4>
            <p className="text-slate-400 text-xs mb-4">Her türlü soru, teknik destek veya kurumsal talepleriniz için mail kanalıyla anında destek alabilirsiniz.</p>
            <div className="flex flex-col gap-2 text-xs">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-400" /> Mareşal Fevzi Çakmak Caddesi, Hatay, Türkiye</span>
              <span className="flex items-center gap-2 font-bold text-white">
                <Mail className="w-4 h-4 text-[#00b4d8]" /> 
                <a href="mailto:destek@havuzmarket.com" className="hover:underline text-[#00b4d8]">destek@havuzmarket.com</a>
              </span>
            </div>
          </div>
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Hızlı E-Posta Gönder</h5>
            <form onSubmit={(e) => { e.preventDefault(); alert('Mesajınız başarıyla iletildi!'); }} className="flex flex-col gap-2">
              <input type="email" placeholder="E-posta Adresiniz" required className="bg-slate-900 text-white text-xs p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00b4d8] border border-slate-700" />
              <textarea placeholder="Mesajınız..." rows="2" required className="bg-slate-900 text-white text-xs p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 border border-slate-700"></textarea>
              <button type="submit" className="bg-gradient-to-r from-[#00b4d8] to-purple-600 text-white font-bold text-xs py-2 rounded-xl hover:opacity-90 transition-opacity">E-Posta Gönder</button>
            </form>
          </div>
        </div>
        <div className="bg-slate-950 text-center py-4 text-[10px] text-slate-500 border-t border-slate-800">&copy; 2026 HavuzMarket. Tüm hakları saklıdır. Arpeta Yazılım Güvencesiyle.</div>
      </footer>

    </div>
  );
}