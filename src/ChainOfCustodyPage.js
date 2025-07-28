import React, { useRef } from 'react';
import ChainOfCustody from './ChainOfCustody';
import logo from './logo.png';

function ChainOfCustodyPage({ product, onBack }) {
  const certificateRef = useRef();

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

  const handleEmail = () => {
    const subject = `Chain of Custody Certificate for ${product.id}`;
    const body = encodeURIComponent(
      `Certificate for Trace ID: ${product.id}\nSeed Variety: ${product.seedVariety}\nGrown Location: ${product.farmName}\nOrganic Certified: ${product.organicCertified}\nTHC Level: ${product.thc}\n\nChain of Custody:\n` +
      product.custodyHistory.map(entry =>
        `${entry.date}: ${entry.previousStatus} → ${entry.newStatus}`
      ).join('\n')
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
      <button onClick={handleEmail} style={{ marginRight: 8 }}>Email Certificate</button>
      <button onClick={onBack} style={{ marginTop: 16 }}>Back</button>
    </div>
  );
}

export default ChainOfCustodyPage;