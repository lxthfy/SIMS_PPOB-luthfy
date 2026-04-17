// pages/PaymentPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../store/slices/profileSlice';
import { fetchBalance } from '../store/slices/balanceSlice';
import { doTransaction, clearServiceMessages } from '../store/slices/servicesSlice';
import { BalanceCard, Button, Toast } from '../components/common';
import Navbar from '../components/layout/Navbar';

const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';

const PaymentPage = ({ onNavigate, params }) => {
  const dispatch = useDispatch();
  const { data: profile } = useSelector((s) => s.profile);
  const { amount: balance } = useSelector((s) => s.balance);
  const { transactionLoading, error, successMessage } = useSelector((s) => s.services);
  const [showBalance, setShowBalance] = useState(true);

  const service = params?.service;

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch]);

  const handlePayment = () => {
    if (!service) return;
    dispatch(doTransaction(service.service_code)).then((res) => {
      if (!res.error) dispatch(fetchBalance());
    });
  };

  if (!service) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <Navbar currentPage="home" onNavigate={onNavigate} />
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: 40, textAlign: 'center' }}>
          <p>Layanan tidak ditemukan.</p>
          <button onClick={() => onNavigate('home')} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>← Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar currentPage="home" onNavigate={onNavigate} />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, marginBottom: 40, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={profile?.profile_image || DEFAULT_AVATAR} alt="avatar"
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }}
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            />
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Selamat datang,</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 20 }}>{profile ? `${profile.first_name} ${profile.last_name}` : '...'}</p>
            </div>
          </div>
          <BalanceCard balance={balance} showBalance={showBalance} onToggle={() => setShowBalance(!showBalance)} />
        </div>

        {/* Payment detail */}
        <div style={{ maxWidth: 580 }}>
          <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: 13 }}>PemBayaran</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <img src={service.service_icon} alt={service.service_name}
              style={{ width: 36, height: 36, objectFit: 'contain' }}
              onError={(e) => { e.target.style.display='none'; }}
            />
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>{service.service_name}</h3>
          </div>

          <div style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#9ca3af' }}>💰</span>
            <span style={{ fontSize: 15, color: '#111827', fontWeight: 500 }}>
              {service.service_tariff?.toLocaleString('id-ID')}
            </span>
          </div>

          <Button onClick={handlePayment} loading={transactionLoading}>Bayar</Button>

          <div style={{ marginTop: 16, padding: '12px 16px', background: '#f9fafb', borderRadius: 8, fontSize: 13, color: '#6b7280' }}>
            <strong>Rincian:</strong><br />
            Layanan: {service.service_name}<br />
            Tarif: Rp {service.service_tariff?.toLocaleString('id-ID')}<br />
            Saldo Anda: Rp {balance?.toLocaleString('id-ID') ?? '-'}
          </div>
        </div>
      </div>

      {successMessage && <Toast message={successMessage} type="success" onClose={() => dispatch(clearServiceMessages())} />}
      {error && <Toast message={error} type="error" onClose={() => dispatch(clearServiceMessages())} />}
    </div>
  );
};

export default PaymentPage;