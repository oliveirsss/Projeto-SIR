export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#333',
      color: '#fff',
      textAlign: 'center',
      padding: '1rem',
      width: '100%',
      marginTop: 'auto' // Pushes to bottom if flex container
    }}>
      <p style={{ margin: 0, opacity: 0.8 }}>UniEvents v1.0</p>
    </footer>
  );
}
