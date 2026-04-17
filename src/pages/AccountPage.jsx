import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, saveProfile, uploadProfileImage, clearProfileMessages } from '../store/slices/profileSlice';
import { logout } from '../store/slices/authSlice';
import { fetchBalance } from '../store/slices/balanceSlice';
import { InputField, Button, Toast } from '../components/common';
import Navbar from '../components/layout/Navbar';

const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';

const AccountPage = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { data: profile, loading, error, successMessage } = useSelector((s) => s.profile);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '' });
  const [errors, setErrors] = useState({});
  const [imgError, setImgError] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({ first_name: profile.first_name, last_name: profile.last_name });
    }
  }, [profile]);

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'Nama depan wajib diisi';
    if (!form.last_name.trim()) e.last_name = 'Nama belakang wajib diisi';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    dispatch(saveProfile(form)).then((res) => {
      if (!res.error) setIsEditing(false);
    });
  };

  const handleCancel = () => {
    if (profile) setForm({ first_name: profile.first_name, last_name: profile.last_name });
    setErrors({});
    setIsEditing(false);
  };

  const handleImageClick = () => fileRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgError('');
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setImgError('Format gambar harus JPG atau PNG');
      return;
    }
    if (file.size > 102400) {
      setImgError('Ukuran file maksimum 100 KB');
      return;
    }
    const fd = new FormData();
    fd.append('file', file);
    dispatch(uploadProfileImage(fd));
  };

  const handleLogout = () => {
    dispatch(logout());
    onNavigate('login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar currentPage="account" onNavigate={onNavigate} />

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleImageClick}>
            <img
              src={profile?.profile_image || DEFAULT_AVATAR}
              alt="Profile"
              style={{
                width: 100, height: 100, borderRadius: '50%', objectFit: 'cover',
                border: '3px solid #e5e7eb', display: 'block',
              }}
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            />
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 28, height: 28, borderRadius: '50%',
              background: '#fff', border: '2px solid #e5e7eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13,
            }}>✏️</div>
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={handleImageChange} />
          {imgError && <p style={{ margin: '8px 0 0', fontSize: 12, color: '#ef4444' }}>{imgError}</p>}
          <h2 style={{ margin: '16px 0 0', fontSize: 20, fontWeight: 700, color: '#111827' }}>
            {profile ? `${profile.first_name} ${profile.last_name}` : '...'}
          </h2>
        </div>

        {/* Form */}
        <div>
          <InputField
            label="Email"
            icon="@"
            value={profile?.email || ''}
            disabled
            onChange={() => {}}
          />
          <InputField
            label="Nama Depan"
            icon="👤"
            value={form.first_name}
            onChange={(e) => { setForm((f) => ({ ...f, first_name: e.target.value })); setErrors((er) => ({ ...er, first_name: '' })); }}
            disabled={!isEditing}
            error={errors.first_name}
          />
          <InputField
            label="Nama Belakang"
            icon="👤"
            value={form.last_name}
            onChange={(e) => { setForm((f) => ({ ...f, last_name: e.target.value })); setErrors((er) => ({ ...er, last_name: '' })); }}
            disabled={!isEditing}
            error={errors.last_name}
          />

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                <Button variant="primary" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button onClick={handleSave} loading={loading}>Simpan</Button>
                <Button variant="outline" onClick={handleCancel}>Batalkan</Button>
              </>
            )}
          </div>
        </div>
      </div>

      {successMessage && <Toast message={successMessage} type="success" onClose={() => dispatch(clearProfileMessages())} />}
      {error && <Toast message={error} type="error" onClose={() => dispatch(clearProfileMessages())} />}
    </div>
  );
};

export default AccountPage;