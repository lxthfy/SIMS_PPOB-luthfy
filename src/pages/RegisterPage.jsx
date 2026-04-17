// pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearMessages } from '../store/slices/authSlice';
import { InputField, Button, Toast } from '../components/common';
import illustration from '../assets/illustrasi_login.png'

const RegisterPage = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: '', first_name: '', last_name: '', password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => {
        dispatch(clearMessages());
        onNavigate('login');
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [successMessage, dispatch, onNavigate]);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid';
    if (!form.first_name) e.first_name = 'Nama depan wajib diisi';
    if (!form.last_name) e.last_name = 'Nama belakang wajib diisi';
    if (!form.password) e.password = 'Password wajib diisi';
    else if (form.password.length < 8) e.password = 'Password minimal 8 karakter';
    if (!form.confirm_password) e.confirm_password = 'Konfirmasi password wajib diisi';
    else if (form.password !== form.confirm_password) e.confirm_password = 'Password tidak sama';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    dispatch(registerUser(form));
  };

  const EyeBtn = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle} style={{ padding: '0 12px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 16 }}>
      {show ? '🙈' : '👁'}
    </button>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Form side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 60px', maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: '#ef4444', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>SIMS PPOB</span>
        </div>
        <h2 style={{ margin: '0 0 32px', fontSize: 22, fontWeight: 700, color: '#111827', textAlign: 'center', lineHeight: 1.4 }}>
          Lengkapi data untuk<br />membuat akun
        </h2>
        <div style={{ width: '100%' }}>
          <InputField icon="@" placeholder="masukan email anda" value={form.email} onChange={handleChange('email')} error={errors.email} autoComplete="email" />
          <InputField icon="👤" placeholder="nama depan" value={form.first_name} onChange={handleChange('first_name')} error={errors.first_name} />
          <InputField icon="👤" placeholder="nama belakang" value={form.last_name} onChange={handleChange('last_name')} error={errors.last_name} />
          <InputField icon="🔒" type={showPw ? 'text' : 'password'} placeholder="buat password" value={form.password} onChange={handleChange('password')} error={errors.password}
            rightElement={<EyeBtn show={showPw} onToggle={() => setShowPw(!showPw)} />} />
          <InputField icon="🔒" type={showCpw ? 'text' : 'password'} placeholder="konfirmasi password" value={form.confirm_password} onChange={handleChange('confirm_password')} error={errors.confirm_password}
            rightElement={<EyeBtn show={showCpw} onToggle={() => setShowCpw(!showCpw)} />} />
          <div style={{ marginTop: 8 }}>
            <Button onClick={handleSubmit} loading={loading}>Registrasi</Button>
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
            sudah punya akun? login{' '}
            <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600, padding: 0 }}>di sini</button>
          </p>
        </div>
      </div>
      {/* Illustration side */}
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
      {successMessage && <Toast message={successMessage} type="success" onClose={() => dispatch(clearMessages())} />}
      {error && <Toast message={error} type="error" onClose={() => dispatch(clearMessages())} />}
    </div>
  );
};

export default RegisterPage;