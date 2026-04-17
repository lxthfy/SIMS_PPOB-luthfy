// App.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import TopUpPage from './pages/TopUpPage';
import PaymentPage from './pages/PaymentPage';
import TransactionPage from './pages/TransactionPage';
import AccountPage from './pages/AccountPage';

// Simple client-side router using state
const App = () => {
  const { token } = useSelector((s) => s.auth);
  const [page, setPage] = useState(token ? 'home' : 'login');
  const [pageParams, setPageParams] = useState(null);

  const navigate = (target, params = null) => {
    setPageParams(params);
    setPage(target);
    window.scrollTo(0, 0);
  };

  // Redirect unauthenticated users
  const publicPages = ['login', 'register'];
  if (!token && !publicPages.includes(page)) {
    return <LoginPage onNavigate={navigate} />;
  }
  if (token && publicPages.includes(page)) {
    return <HomePage onNavigate={navigate} />;
  }

  const pages = {
    login:       <LoginPage       onNavigate={navigate} />,
    register:    <RegisterPage    onNavigate={navigate} />,
    home:        <HomePage        onNavigate={navigate} />,
    topup:       <TopUpPage       onNavigate={navigate} />,
    payment:     <PaymentPage     onNavigate={navigate} params={pageParams} />,
    transaction: <TransactionPage onNavigate={navigate} />,
    account:     <AccountPage     onNavigate={navigate} />,
  };

  return pages[page] || <HomePage onNavigate={navigate} />;
};

export default App;