function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
      <div
        style={{
          width: 30,
          height: 30,
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #ef4444',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default Spinner