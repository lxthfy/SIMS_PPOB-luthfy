// components/layout/Navbar.jsx
import React from 'react';

const Navbar = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'topup', label: 'Top Up' },
    { id: 'transaction', label: 'Transaction' },
    { id: 'account', label: 'Akun' },
  ];

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 40px', borderBottom: '1px solid #f3f4f6',
      background: '#fff', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div
        onClick={() => onNavigate('home')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{
          width: 32, height: 32, background: '#ef4444', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 14,
        }}>S</div>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>SIMS PPOB</span>
      </div>
      <div style={{ display: 'flex', gap: 32 }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 500,
              color: currentPage === item.id ? '#ef4444' : '#6b7280',
              borderBottom: currentPage === item.id ? '2px solid #ef4444' : '2px solid transparent',
              paddingBottom: 2, transition: 'all 0.2s',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;