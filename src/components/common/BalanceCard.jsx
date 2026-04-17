function BalanceCard({ balance }) {
  return (
    <div style={{
      padding: 20,
      background: '#ef4444',
      color: '#fff',
      borderRadius: 10,
      marginBottom: 20
    }}>
      <p>Saldo Anda</p>
      <h2>Rp {balance || 0}</h2>
    </div>
  )
}

export default BalanceCard