import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [loading, setLoading] = useState(true);

  // AI Asistan State'leri
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiProducts, setAiProducts] = useState([]);

  // 🏛️ MODERN MODAL SİSTEMİ STATE'LERİ
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const categories = ["Havuz Kimyasalları", "Havuz Ekipmanları", "Aydınlatma Sistemleri"];
  const moods = ["😀 Mutlu", "😴 Yorgun", "💼 İş odaklı", "🏖️ Tatil modu"];

  useEffect(() => {
    setLoading(true);
    let url = 'http://localhost:5000/api/products?';
    if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}&`;
    if (selectedMood) url += `mood=${encodeURIComponent(selectedMood)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Veri çekme hatası:", err);
        setLoading(false);
      });
  }, [selectedCategory, selectedMood]);

  const handleAiSearch = (e) => {
    e.preventDefault();
    if (!aiPrompt) return;

    fetch('http://localhost:5000/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: aiPrompt })
    })
    .then(res => res.json())
    .then(data => {
      setAiResponse(data.message);
      setAiProducts(data.products);
    })
    .catch(err => console.error("AI API hatası:", err));
  };

  // 📋 MODAL AÇMA FONKSİYONU
  const openInfoModal = (title, type) => {
    setModalTitle(title);
    if (type === 'about') {
      setModalContent(
        <div style={{ color: '#334155', lineHeight: '1.6', fontSize: '14px' }}>
          <p style={{ fontWeight: '700', color: '#6d28d9', fontSize: '16px', margin: '0 0 10px 0' }}>📄 Biz Kimiz?</p>
          <p style={{ margin: '0 0 15px 0' }}>
            2026 yılında, Şanlıurfa Harran'da küçük bir hayalle yola çıktık. Amacımız, en kaliteli akıllı havuz ekipmanlarını ve bakım bileşenlerini herkes için ulaşılabilir, güvenli ve keyifli bir alışveriş deneyimine dönüştürmekti. Bugün, ilk günkü heyecanımızla binlerce müşterimize en modern teknolojileri ulaştırmanın mutluluğunu yaşıyoruz.
          </p>
          <p style={{ fontWeight: '700', color: '#6d28d9', fontSize: '16px', margin: '0 0 10px 0' }}>🌟 Neden Biz?</p>
          <p style={{ margin: '0 0 15px 0' }}>
            Biz sadece ürün satmıyoruz; hayatınıza değer katacak, güvenle kullanacağınız bir deneyim sunuyoruz. Sizin için her zaman:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 15px 0' }}>
            <li style={{ marginBottom: '6px' }}><strong>Önce Kalite:</strong> Seçtiğimiz her ürünü titizlikle kontrol ediyor ve en iyisini sunuyoruz.</li>
            <li style={{ marginBottom: '6px' }}><strong>Şeffaf Hizmet:</strong> Gizli maliyetler olmadan, ne görüyorsanız onu kapınıza getiriyoruz.</li>
            <li style={{ marginBottom: '6px' }}><strong>Kesintisiz Destek:</strong> Satış öncesinde ve sonrasında her sorunuzda yanınızdayız.</li>
          </ul>
          <p style={{ margin: 0, fontWeight: '600', fontStyle: 'italic', textAlign: 'center', color: '#4c1d95' }}>
            Arpeta E-Havuz Market ailesi olarak, bizi tercih ettiğiniz ve hikayemizin bir parçası olduğunuz için teşekkür ederiz. Keyifli alışverişler!
          </p>
        </div>
      );
    } else if (type === 'shipping') {
      setModalContent(
        <div style={{ color: '#334155', lineHeight: '1.6', fontSize: '14px', textAlign: 'center' }}>
          <p style={{ fontWeight: '700', color: '#ea580c', fontSize: '16px', margin: '0 0 10px 0' }}>📦 Arpeta Kargo Takibiniz:</p>
          <p style={{ marginBottom: '15px' }}>
            Misafir alışverişleriniz de dahil olmak üzere, tüm gönderileriniz Arpeta lojistik ağı ve anlaşmalı kargo şubelerimiz tarafından anlık olarak izlenmektedir.
          </p>
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '12px', borderRadius: '8px', color: '#b45309', fontWeight: '600', fontSize: '13px' }}>
            Siparişiniz hazırlık aşamasındadır. Kargo takip kodunuz sistemde kayıtlı e-posta adresinize 24 saat içerisinde iletilecektir.
          </div>
        </div>
      );
    } else if (type === 'blog') {
      setModalContent(
        <div style={{ color: '#334155', lineHeight: '1.6', fontSize: '14px', textAlign: 'center' }}>
          <p style={{ fontWeight: '700', color: '#6d28d9', fontSize: '16px', margin: '0 0 10px 0' }}>✍️ E-Havuz Teknik Blogu</p>
          <p>
            Stajyer bilgisayar mühendisimiz <strong>Nuray Mutlu</strong>'nun bu akıllı platformu kurarken kullandığı yöntemleri, Context API mimarisini, Node.js backend sunucu tasarımlarını ve karşılaştığı dikkat edilmesi gereken teknik detayları anlatacağı blog serimiz pazar günü tamamlanacak olan teslim sürecinden hemen sonra yayında olacaktır!
          </p>
        </div>
      );
    }
    setModalOpen(true);
  };

  const recommendedProducts = products.filter(p => p.predictionType === 'danger' || p.price > 10000 || p.id === 1);

  return (
    <div style={{ padding: '25px', fontFamily: 'sans-serif', backgroundColor: '#e0f2fe', minHeight: '100vh' }}>
      
      {/* 🎨 BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #6d28d9 0%, #06b6d4 100%)',
        padding: '45px 30px', borderRadius: '20px', textAlign: 'center', marginBottom: '35px', color: 'white',
        boxShadow: '0 10px 25px -5px rgba(109, 40, 217, 0.25)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '36px', fontWeight: '800' }}>Arpeta Smart Havuz Market ⭐</h1>
        <p style={{ margin: 0, opacity: 0.95, fontSize: '16px' }}>Yapay Zekâ Destekli Yeni Nesil Alışveriş Deneyimi</p>
      </div>

      <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
        
        {/* 📁 SOL SIDEBAR MENÜ */}
        <div style={{ 
          width: '260px', backgroundColor: 'white', borderRadius: '20px', padding: '20px', 
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #bae6fd', position: 'sticky', top: '25px'
        }}>
          <h3 style={{ color: '#1e293b', marginTop: 0, marginBottom: '12px', fontSize: '15px', fontWeight: '700', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
            📁 Kategoriler
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '25px' }}>
            <button 
              onClick={() => { setSelectedCategory(''); setSelectedMood(''); }}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', textAlign: 'left', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                backgroundColor: selectedCategory === '' ? '#6d28d9' : 'transparent', color: selectedCategory === '' ? 'white' : '#475569'
              }}
            >
              🌐 Tüm Ürünler Ana Sayfa
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx} onClick={() => setSelectedCategory(cat)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', textAlign: 'left', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                  backgroundColor: selectedCategory === cat ? '#6d28d9' : 'transparent', color: selectedCategory === cat ? 'white' : '#475569'
                }}
              >
                🔹 {cat}
              </button>
            ))}
          </div>

          {/* ℹ️ KURUMSAL MENÜ (ARIK MODAL TETİKLİYOR) */}
          <h3 style={{ color: '#1e293b', marginTop: 0, marginBottom: '12px', fontSize: '15px', fontWeight: '700', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
            ℹ️ Kurumsal Bilgiler
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '25px' }}>
            <button onClick={() => openInfoModal("🏛️ Arpeta E-Havuz Market", "about")} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', textAlign: 'left', fontWeight: '500', fontSize: '13px', color: '#475569', backgroundColor: 'transparent', cursor: 'pointer' }}>
              📄 Hakkımızda
            </button>
            <button onClick={() => openInfoModal("🏛️ Arpeta E-Havuz Market", "shipping")} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', textAlign: 'left', fontWeight: '500', fontSize: '13px', color: '#475569', backgroundColor: 'transparent', cursor: 'pointer' }}>
              🚚 Kargo Takibi
            </button>
            <button onClick={() => openInfoModal("🏛️ Arpeta E-Havuz Market", "blog")} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', textAlign: 'left', fontWeight: '600', fontSize: '13px', color: '#6d28d9', backgroundColor: '#f5f3ff', cursor: 'pointer' }}>
              ✍️ E-Havuz Blog
            </button>
          </div>

          {/* E-POSTA DESTEK BLOK */}
          <div style={{ padding: '15px', backgroundColor: '#f0fdfa', borderRadius: '12px', border: '1px solid #ccfbf1', textAlign: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 4px 0', color: '#0f766e', fontSize: '13px', fontWeight: '700' }}>💬 Ürün Sorularınız İçin</h4>
            <a href="mailto:info@arpetayazilim.com" style={{ display: 'block', backgroundColor: '#06b6d4', color: '#1e1b4b', padding: '8px', borderRadius: '6px', textDecoration: 'none', fontWeight: '700', fontSize: '12px', marginTop: '8px' }}>
              Destek Ekibine Yaz
            </a>
          </div>

          {/* GÜVENLI ALIŞVERİŞ ROZETİ */}
          <div style={{ padding: '15px', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6d28d9', fontWeight: '700', fontSize: '13px', marginBottom: '5px' }}>🔒 Güvenli Alışveriş</div>
            <p style={{ margin: 0, fontSize: '11px', color: '#581c87', lineHeight: '1.4', fontWeight: '500' }}>
              Sitemize <strong>üye olmadan</strong>, banka düzeyinde korunan <strong>3D Secure</strong> altyapısı ile misafir olarak anında güvenle alışveriş yapabilirsiniz.
            </p>
          </div>
        </div>

        {/* ⚡ SAĞ İÇERİK ALANI */}
        <div style={{ flex: 1 }}>
          {/* YAPAY ZEKÂ ASİSTANI */}
          <div style={{ backgroundColor: 'white', border: '2px solid #6d28d9', borderRadius: '20px', padding: '25px', marginBottom: '25px', boxShadow: '0 10px 15px -3px rgba(109, 40, 217, 0.05)' }}>
            <h4 style={{ color: '#6d28d9', marginTop: 0, marginBottom: '12px', fontWeight: '700' }}>✨ Yapay Zekâ Alışveriş Asistanı</h4>
            <form onSubmit={handleAiSearch} style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Asistana ihtiyacınızı yazın... (Örn: temizlik)" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} style={{ flex: 1, padding: '14px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
              <button type="submit" style={{ backgroundColor: '#6d28d9', color: 'white', padding: '14px 24px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Sorgula</button>
            </form>
            {aiResponse && (
              <div style={{ marginTop: '15px', padding: '20px', backgroundColor: '#f5f3ff', borderRadius: '12px', borderLeft: '4px solid #6d28d9' }}>
                <p style={{ fontWeight: '600', color: '#4c1d95', margin: '0 0 12px 0', fontSize: '14px' }}>🤖 {aiResponse}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {aiProducts.map(p => (
                    <div key={p.id} style={{ backgroundColor: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e9d5ff', fontSize: '14px', display: 'flex', justifycontent: 'space-between', alignItems: 'center' }}>
                      <span>🎯 {p.name}</span>
                      <strong style={{ color: '#6d28d9' }}>{p.price} TL</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MOOD SHOPPING PANELİ */}
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '18px 25px', marginBottom: '25px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', jústifyContent: 'space-between', gap: '15px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>🧠 Alışveriş Modu:</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {moods.map((m, idx) => (
                <button key={idx} onClick={() => setSelectedMood(selectedMood === m ? '' : m)} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', backgroundColor: selectedMood === m ? '#06b6d4' : '#f1f5f9', color: selectedMood === m ? 'white' : '#475569' }}>{m}</button>
              ))}
            </div>
          </div>

          {loading ? <h3 style={{ textAlign: 'center', color: '#64748b' }}>Yükleniyor...</h3> : (
            <>
              {/* VİTRİN 1: SİZİN İÇİN SEÇTİKLERİMİZ */}
              {!selectedCategory && !selectedMood && (
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{ color: '#0f172a', fontSize: '22px', fontWeight: '800', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🔥 Sizin İçin Seçtiklerimiz <span style={{ fontSize: '12px', backgroundColor: '#fef2f2', color: '#ef4444', padding: '3px 10px', borderRadius: '12px', fontWeight: '700' }}>Akıllı Tercih</span>
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
                    {recommendedProducts.map(product => <ProductCard key={product.id} product={product} />)}
                  </div>
                </div>
              )}

              {/* VİTRİN 2: TÜM ÜRÜNLER */}
              <div>
                <h3 style={{ color: '#0f172a', fontSize: '22px', fontWeight: '800', marginBottom: '18px' }}>
                  {selectedCategory ? `🛒 ${selectedCategory} Listeleniyor` : selectedMood ? `🧠 Moduna Uygun Ürünler` : '🌐 Tüm Ürünlerimiz'}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
                  {products.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ⭐ SİHİRLİ MODAL BİLEŞENİ (TARAYICI UYARISI YERİNE ARPETA BAŞLIKLI ŞIK PANEL) */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '2px solid #6d28d9',
            animation: 'scaleUp 0.2s ease-out'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e1b4b', fontSize: '20px', fontWeight: '800', borderBottom: '2px solid #6d28d9', paddingBottom: '10px' }}>
              {modalTitle}
            </h2>
            <div style={{ marginBottom: '25px' }}>
              {modalContent}
            </div>
            <button 
              onClick={() => setModalOpen(false)}
              style={{
                width: '100%', backgroundColor: '#6d28d9', color: 'white', padding: '12px',
                border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px'
              }}
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div style={{ width: '280px', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 10px rgba(0,0,0,0.04)' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
      <div style={{ padding: '18px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '11px', backgroundColor: '#f3e8ff', color: '#6d28d9', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>{product.category}</span>
          <h4 style={{ margin: '12px 0', fontSize: '14px', color: '#1e293b', minHeight: '40px', lineHeight: '1.4', fontWeight: '600' }}>{product.name}</h4>
        </div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '18px', color: '#0f172a', marginBottom: '12px' }}>{product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
          {product.predictionType !== "none" && product.pricePrediction && (
            <div style={{ fontSize: '11px', color: product.predictionType === 'danger' ? '#b91c1c' : product.predictionType === 'warning' ? '#b45309' : '#475569', backgroundColor: product.predictionType === 'danger' ? '#fef2f2' : product.predictionType === 'warning' ? '#fffbeb' : '#f8fafc', padding: '10px', borderRadius: '10px', marginBottom: '15px', borderLeft: `4px solid ${product.predictionType === 'danger' ? '#ef4444' : product.predictionType === 'warning' ? '#f59e0b' : '#94a3b8'}`, fontWeight: '500', lineHeight: '1.4' }}>
              🕵️‍♂️ AI: "{product.pricePrediction}"
            </div>
          )}
          <Link to={`/product/${product.id}`} style={{ display: 'block', textAlign: 'center', backgroundColor: '#06b6d4', color: '#1e1b4b', padding: '11px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Ürünü İncele</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;