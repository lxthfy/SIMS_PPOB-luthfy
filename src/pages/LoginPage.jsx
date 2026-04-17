// pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearMessages } from '../store/slices/authSlice';
import { InputField, Button, Toast } from '../components/common';
import illustration from '../assets/illustrasi_login.png'


const LoginPage = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (token) onNavigate('home');
  }, [token, onNavigate]);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid';
    if (!form.password) e.password = 'Password wajib diisi';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    dispatch(loginUser(form));
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 60px', maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: '#ef4444', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>SIMS PPOB</span>
        </div>
        <h2 style={{ margin: '0 0 32px', fontSize: 22, fontWeight: 700, color: '#111827', textAlign: 'center', lineHeight: 1.4 }}>
          Masuk atau buat akun<br />untuk memulai
        </h2>
        <div style={{ width: '100%' }} onKeyDown={handleKeyDown}>
          <InputField icon="@" placeholder="masukan email anda" value={form.email} onChange={handleChange('email')} error={errors.email} autoComplete="email" />
          <InputField icon="🔒" type={showPw ? 'text' : 'password'} placeholder="masukan password anda" value={form.password} onChange={handleChange('password')} error={errors.password}
            rightElement={
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ padding: '0 12px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 16 }}>
                {showPw ? '🙈' : '👁'}
              </button>
            }
          />
          <div style={{ marginTop: 8 }}>
            <Button onClick={handleSubmit} loading={loading}>Masuk</Button>
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
            belum punya akun? registrasi{' '}
            <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600, padding: 0 }}>di sini</button>
          </p>
          {/* Demo hint — mock mode only */}
          <div style={{ marginTop: 24, padding: '12px 16px', background: '#fef9c3', borderRadius: 8, fontSize: 12, color: '#854d0e', textAlign: 'center', lineHeight: 1.6 }}>
            <strong>Mock mode credentials:</strong><br />
            email: <code>user@nutech-integrasi.com</code><br />
            password: <code>abcdef1234</code>
          </div>
        </div>
      </div>
      {/* Illustration */}
      <div
        style={{
        flex: 1,
        background: '#fef2f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
        }}
    >
        <img
            src={illustration}
            alt="illustration"
            style={{
            maxWidth: '80%',
            height: 'auto'
        }}
    />
    </div>

      {error && <Toast message={error} type="error" onClose={() => dispatch(clearMessages())} />}
    </div>
  );
};

export default LoginPage;