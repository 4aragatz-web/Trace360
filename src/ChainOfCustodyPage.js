import React, { useRef, useState } from 'react';
import axios from 'axios';
import ChainOfCustody from './ChainOfCustody';
import logo from './logo.png';

function ChainOfCustodyPage({ product, onBack }) {
  const certificateRef = useRef();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  if (!product) {
    return <div>No product found for this Trace ID.</div>;
  }

  const handlePrint = () => {
    const printContents = certificateRef.current.innerHTML;
    const win = window.open('', '', 'width=800,height=600');
    win.document.write('<html><head><title>Certificate</title></head><body>');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  // NEW: Send PDF via backend
  const handleEmail = async () => {
    if (!email) {
      setMessage('Please enter a recipient email.');
      return;
    }
    setSending(true);
    setMessage('');
    try {
      await axios.post('https://trace360-co.onrender.com/send-custody-pdf', {
        email,
        product
      });
      setMessage('PDF sent successfully!');
    } catch (err) {
      setMessage('Failed to send PDF.');
    }
    setSending(false);
  };

  return (
    <div>
      <h2>Chain of Custody</h2>
      <div
        ref={certificateRef}
        style={{
          marginBottom: 24,
          background: '#fff',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 2px 8px #ccc'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <img src={logo} alt="Logo" style={{ height: 60, marginBottom: 8 }} />
          <h3 style={{ margin: 0, color: '#42756a' }}>Certificate of Chain of Custody</h3>
        </div>
        <strong>Barcode Number:</strong> {product.id} <br />
        <strong>Seed Variety:</strong> {product.seedVariety} <br />
        <strong>Grown Location:</strong> {product.farmName} <br />
        <strong>Organic Certified:</strong> {product.organicCertified} <br />
        <strong>THC Level:</strong> {product.thc}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #bbb' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #bbb' }}>Previous Status</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #bbb' }}>New Status</th>
            </tr>
          </thead>
          <tbody>
            {product.custodyHistory && product.custodyHistory.length > 0 ? (
              product.custodyHistory.map((entry, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{entry.date}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{entry.previousStatus}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{entry.newStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ padding: '8px' }}>No custody history available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button onClick={handlePrint} style={{ marginRight: 8 }}>Print Certificate</button>
      {/* Email input and button */}
      <input
        type="email"
        placeholder="Recipient email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ marginRight: 8, padding: 6, borderRadius: 4, border: '1px solid #bbb' }}
        disabled={sending}
      />
      <button onClick={handleEmail} disabled={sending} style={{ marginRight: 8 }}>
        {sending ? 'Sending...' : 'Email Certificate'}
      </button>
      {message && <div style={{ marginTop: 8, color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
      <button onClick={onBack} style={{ marginTop: 16 }}>Back</button>
    </div>
  );
}

export default ChainOfCustodyPage;