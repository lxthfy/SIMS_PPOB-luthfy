// pages/TransactionPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../store/slices/profileSlice';
import { fetchBalance } from '../store/slices/balanceSlice';
import { fetchTransactions, resetTransactions } from '../store/slices/transactionSlice';
import { BalanceCard, Spinner } from '../components/common';
import Navbar from '../components/layout/Navbar';
import { useState } from 'react';

const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
};

const TransactionPage = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { data: profile } = useSelector((s) => s.profile);
  const { amount: balance } = useSelector((s) => s.balance);
  const { records, offset, hasMore, loading } = useSelector((s) => s.transactions);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
    dispatch(resetTransactions());
    dispatch(fetchTransactions(0));
  }, [dispatch]);

  const handleShowMore = () => {
    dispatch(fetchTransactions(offset));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar currentPage="transaction" onNavigate={onNavigate} />
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

        {/* Transaction list */}
        <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Semua Transaksi</h3>

        {records.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 15 }}>
            Belum ada riwayat transaksi
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {records.map((tx) => {
            const isTopUp = tx.transaction_type === 'TOPUP';
            return (
              <div key={tx.invoice_number} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px',
                background: '#fff',
              }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 16, color: isTopUp ? '#16a34a' : '#ef4444' }}>
                    {isTopUp ? '+' : '−'} Rp{tx.total_amount?.toLocaleString('id-ID')}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>{formatDate(tx.created_on)}</p>
                </div>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{tx.description}</span>
              </div>
            );
          })}
        </div>

        {loading && <Spinner />}

        {hasMore && !loading && records.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={handleShowMore}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, fontSize: 14, cursor: 'pointer', padding: '8px 0' }}
            >
              Show more
            </button>
          </div>
        )}

        {!hasMore && records.length > 0 && (
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#9ca3af' }}>Semua transaksi sudah ditampilkan</p>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;