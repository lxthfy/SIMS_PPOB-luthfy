// pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../store/slices/profileSlice';
import { fetchBalance } from '../store/slices/balanceSlice';
import { fetchServices, fetchBanners } from '../store/slices/servicesSlice';
import { BalanceCard, Spinner } from '../components/common';
import Navbar from '../components/layout/Navbar';

const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';

const HomePage = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { data: profile } = useSelector((s) => s.profile);
  const { amount: balance } = useSelector((s) => s.balance);
  const { list: services, banners, loading } = useSelector((s) => s.services);
  const [showBalance, setShowBalance] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
    dispatch(fetchServices());
    dispatch(fetchBanners());
  }, [dispatch]);

  // Auto-slide banner
  useEffect(() => {
    if (banners.length === 0) return;
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 3000);
    return () => clearInterval(t);
  }, [banners.length]);

  const handleServiceClick = (service) => {
    onNavigate('payment', { service });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar currentPage="home" onNavigate={onNavigate} />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        {/* Top section: profile + balance */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, marginBottom: 40, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img
              src={profile?.profile_image || DEFAULT_AVATAR}
              alt="avatar"
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }}
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            />
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Selamat datang,</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 20, color: '#111827' }}>
                {profile ? `${profile.first_name} ${profile.last_name}` : '...'}
              </p>
            </div>
          </div>
          <BalanceCard balance={balance} showBalance={showBalance} onToggle={() => setShowBalance(!showBalance)} />
        </div>

        {/* Services */}
        {loading ? <Spinner /> : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
              {services.map((svc) => (
                <div
                  key={svc.service_code}
                  onClick={() => handleServiceClick(svc)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', width: 70 }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={svc.service_icon} alt={svc.service_name} style={{ width: 40, height: 40, objectFit: 'contain' }} onError={(e) => { e.target.style.display='none'; }} />
                  </div>
                  <span style={{ fontSize: 11, textAlign: 'center', color: '#374151', fontWeight: 500, lineHeight: 1.3 }}>{svc.service_name}</span>
                </div>
              ))}
            </div>

            {/* Banners */}
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#374151' }}>Temukan promo menarik</h3>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              {/* Slider */}
              <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin' }}>
                {banners.map((banner, i) => (
                  <img
                    key={i}
                    src={banner.banner_image}
                    alt={banner.banner_name}
                    style={{ width: 240, height: 120, objectFit: 'cover', borderRadius: 12, flexShrink: 0, border: '1px solid #f3f4f6' }}
                    onError={(e) => {
                      e.target.style.background = ['#fca5a5','#fcd34d','#6ee7b7','#93c5fd','#c4b5fd'][i % 5];
                      e.target.style.display = 'flex';
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;