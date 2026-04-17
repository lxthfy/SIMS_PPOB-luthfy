function Button({ children, loading, ...props }) {
  return (
    <button
      {...props}
      style={{
        width: '100%',
        padding: '12px',
        background: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        fontWeight: 600
      }}
      disabled={loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

export default Button;