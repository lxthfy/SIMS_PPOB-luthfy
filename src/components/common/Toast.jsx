function Toast({ message, type, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: type === 'error' ? '#ef4444' : '#22c55e',
      color: '#fff',
      padding: '12px 16px',
      borderRadius: 6
    }}>
      {message}
      <button
        onClick={onClose}
        style={{
          marginLeft: 10,
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;