function InputField({ icon, error, rightElement, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        padding: '8px 12px'
      }}>
        <span style={{ marginRight: 8 }}>{icon}</span>
        <input
          {...props}
          style={{ flex: 1, border: 'none', outline: 'none' }}
        />
        {rightElement}
      </div>
      {error && (
        <p style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default InputField;