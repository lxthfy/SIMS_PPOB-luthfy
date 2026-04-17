// pages/TopUpPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../store/slices/profileSlice';
import { fetchBalance, doTopUp, clearBalanceMessages } from '../store/slices/balanceSlice';
import { BalanceCard, Button, Toast } from '../components/common';
import Navbar from '../components/layout/Navbar';

const QUICK_AMOUNTS = [10000, 20000, 50000, 100000, 250000, 500000];
const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';

const TopUpPage = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { data: profile } = useSelector((s) => s.profile);
  const { amount: balance, loading, error, successMessage } = useSelector((s) => s.balance);

  const [inputAmount, setInputAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch]);

  const handleQuickSelect = (amount) => {
    setSelectedAmount(amount);
    setInputAmount(String(amount));
    setValidationError('');
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setInputAmount(val);
    setSelectedAmount(null);
    setValidationError('');
  };

  const numericAmount = Number(inputAmount);
  const isValid = numericAmount >= 10000 && numericAmount <= 1000000;

  const handleTopUp = () => {
    if (!inputAmount) { setValidationError('Masukkan nominal top up'); return; }
    if (numericAmount < 10000) { setValidationError('Minimum top up Rp10.000'); return; }
    if (numericAmount > 1000000) { setValidationError('Maksimum top up Rp1.000.000'); return; }
    dispatch(doTopUp(numericAmount)).then((res) => {
      if (!res.error) {
        setInputAmount('');
        setSelectedAmount(null);
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar currentPage="topup" onNavigate={onNavigate} />
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

        {/* Top Up Form */}
        <div style={{ maxWidth: 680 }}>
          <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: 14 }}>Silahkan masukan</p>
          <h2 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700, color: '#111827' }}>Nominal Top Up</h2>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Input */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: `1.5px solid ${validationError ? '#ef4444' : '#d1d5db'}`,
                borderRadius: 8, background: '#fff',
              }}>
                <span style={{ padding: '0 12px', color: '#9ca3af' }}>💰</span>
                <input
                  type="text"
                  placeholder="masukan nominal Top Up"
                  value={inputAmount ? `Rp ${Number(inputAmount).toLocaleString('id-ID')}` : ''}
                  onChange={handleInputChange}
                  onFocus={(e) => { e.target.value = inputAmount; }}
                  onBlur={(e) => {
                    if (inputAmount) e.target.value = `Rp ${Number(inputAmount).toLocaleString('id-ID')}`;
                  }}
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '12px', fontSize: 14, background: 'transparent' }}
                />
              </div>
              {validationError && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444' }}>{validationError}</p>}
              <div style={{ marginTop: 12 }}>
                <Button onClick={handleTopUp} disabled={!inputAmount || !isValid} loading={loading}>Top Up</Button>
              </div>
            </div>

            {/* Quick select */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleQuickSelect(amt)}
                  style={{
                    padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    border: `1.5px solid ${selectedAmount === amt ? '#ef4444' : '#d1d5db'}`,
                    background: selectedAmount === amt ? '#fef2f2' : '#fff',
                    color: selectedAmount === amt ? '#ef4444' : '#374151',
                    transition: 'all 0.15s',
                  }}
                >
                  Rp{(amt / 1000).toFixed(0)}.000
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {successMessage && <Toast message={successMessage} type="success" onClose={() => dispatch(clearBalanceMessages())} />}
      {error && <Toast message={error} type="error" onClose={() => dispatch(clearBalanceMessages())} />}
    </div>
  );
};

export default TopUpPage;