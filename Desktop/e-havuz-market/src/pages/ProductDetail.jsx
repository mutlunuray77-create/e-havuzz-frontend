import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ürün detayını backend API'den ID'ye göre çekiyoruz
  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ürün bulunamadı");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h3 style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Ürün detayları yükleniyor...</h3>;
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>❌ Ürün Bulunamadı!</h2>
        <Link to="/" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
          🔙 Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Üst Kategori Navigasyonu */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
          📁 {product.category}
        </Link>
        <span style={{ color: '#6b7280', margin: '0 10px' }}>/</span>
        <span style={{ color: '#374151', fontSize: '14px' }}>{product.name}</span>
      </div>

      {/* Ürün Detay Kartı */}
      <div style={{
        display: 'flex',
        gap: '40px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Sol Taraf: Görsel */}
        <div style={{ flex: '1' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>

        {/* Sağ Taraf: Detaylar */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{
              backgroundColor: '#eff6ff',
              color: '#1e40af',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {product.category}
            </span>
            
            <h1 style={{ color: '#1f2937', marginTop: '15px', marginBottom: '10px', fontSize: '28px' }}>
              {product.name}
            </h1>
            
            <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '16px', marginBottom: '20px' }}>
              {product.description}
            </p>

            <div style={{ color: '#059669', fontWeight: 'bold', marginBottom: '20px', fontSize: '14px' }}>
              ✓ Stok Durumu: {product.stock} adet mevcut
            </div>
          </div>

          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
              {product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </div>

            <button style={{
              width: '100%',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '15px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
            }} onClick={() => addToCart(product)}>
              🛒 Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;