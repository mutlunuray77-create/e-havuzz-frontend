import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Güvenli toplam fiyat hesabı
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    /* 🩵 ANA ARKA PLAN: BEBEKSİ MAVİ */
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#e0f2fe', minHeight: '100vh' }}>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* BAŞLIK */}
        <h2 style={{ color: '#1e1b4b', fontWeight: '800', fontSize: '28px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🛒 Sepetim
        </h2>

        {cart.length === 0 ? (
          /* SEPET BOŞSA */
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#64748b', fontSize: '16px', fontWeight: '500', marginBottom: '20px' }}>Sepetinizde henüz bir ürün bulunmuyor.</p>
            <Link to="/" style={{ backgroundColor: '#6d28d9', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', inlineBlock: 'true' }}>
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          /* SEPET DOLUYSA: YAN YANA İKİLİ BLOK MİMARİSİ */
          <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
            
            {/* SOL TARAF: SEPETTEKİ ÜRÜNLER LİSTESİ */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ 
                  backgroundColor: 'white', padding: '15px 20px', borderRadius: '16px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px' }} />
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>{item.name}</h4>
                      <span style={{ fontWeight: '700', color: '#6d28d9', fontSize: '14px' }}>
                        {(item.price).toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                  </div>

                  {/* MİKTAR DEĞİŞTİRME BUTONLARI */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                    <span style={{ fontWeight: '700', color: '#1e293b', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      style={{ marginLeft: '15px', backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                    >
                      🗑️ Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SAĞ TARAF: SİPARİŞ ÖZETİ VE GÜVENLİK ÖZETİ */}
            <div style={{ width: '320px', backgroundColor: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #bae6fd' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#1e293b', fontWeight: '700', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                Sipariş Özeti
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: '#475569' }}>
                <span>Toplam Ürün:</span>
                <span style={{ fontWeight: '600' }}>{cart.reduce((acc, item) => acc + item.quantity, 0)} Adet</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontSize: '18px', color: '#1e1b4b', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                <span style={{ fontWeight: '700' }}>Genel Toplam:</span>
                <span style={{ fontWeight: '800', color: '#6d28d9' }}>
                  {totalPrice.toLocaleString('tr-TR')} TL
                </span>
              </div>

              {/* MİSAFİR ALIŞVERİŞİ & 3D SECURE CHECKOUT BUTONU */}
              <button 
                onClick={() => alert("🎉 Arpeta Güvenli Ödeme Sayfasına Yönlendiriliyorsunuz... Misafir Alışverişiniz 3D Secure ile korunmaktadır.")}
                style={{ 
                  width: '100%', backgroundColor: '#06b6d4', color: '#1e1b4b', border: 'none', padding: '14px', 
                  borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)', marginBottom: '15px'
                }}
              >
                🔒 Güvenli Ödemeye Geç
              </button>

              <div style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', padding: '12px', borderRadius: '10px', fontSize: '11px', color: '#581c87', lineHeight: '1.4' }}>
                ⚡ <strong>Misafir Alışverişi Aktif:</strong> Üye olma zorunluluğu olmadan, 3D Secure güvencesiyle siparişinizi tek adımda tamamlayabilirsiniz.
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;