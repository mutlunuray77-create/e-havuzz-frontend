import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import { CartProvider, useCart } from './context/CartContext'; // Eklenen kısım

// Üst Menü Bileşeni (Sepet Sayısını Anlık Göstermek İçin)
function Navbar() {
  const { cartCount } = useCart();
  return (
    <nav style={{ padding: '15px', backgroundColor: '#0070f3', display: 'flex', justifyContent: 'center', gap: '20px' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Ana Sayfa</Link>
      <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
        🛒 Sepetim <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', marginLeft: '5px' }}>{cartCount}</span>
      </Link>
    </nav>
  );
}

function App() {
  return (
    <CartProvider> {/* Tüm siteyi sepet hafızasıyla sarmalıyoruz */}
      <Router>
        <div style={{ fontFamily: 'sans-serif' }}>
          <Navbar />
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;