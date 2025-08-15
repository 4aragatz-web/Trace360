import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 15;

    const generatePDF = () => {
      doc.addImage(img, 'PNG', 80, y, 50, 20);
      y += 25;

      doc.setFontSize(18);
      doc.setTextColor(66, 117, 106);
      doc.text('Certificate of Chain of Custody', 105, y, { align: 'center' });
      y += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Barcode Number: ${product.id}`, 14, y);
      y += 8;
      doc.text(`Seed Variety: ${product.seedVariety}`, 14, y);
      y += 8;
      doc.text(`Grown Location: ${product.farmName}`, 14, y);
      y += 8;
      doc.text(`Organic Certified: ${product.organicCertified}`, 14, y);
      y += 8;
      doc.text(`THC Level: ${product.thc}`, 14, y);
      y += 10;

      const tableData = product.custodyHistory && product.custodyHistory.length > 0
        ? product.custodyHistory.map(entry => [
            entry.date, entry.previousStatus, entry.newStatus
          ])
        : [['-', '-', '-']];

      autoTable(doc, {
        head: [['Date', 'Previous Status', 'New Status']],
        body: tableData,
        startY: y,
        styles: { fontSize: 11, cellPadding: 3 },
        headStyles: { fillColor: [66, 117, 106] }
      });

      doc.save(`ChainOfCustody_${product.id}.pdf`);
    };

    const img = new window.Image();
    img.src = logo;
    img.onload = generatePDF;
    if (img.complete) {
      img.onload = null; // Prevent double call
      generatePDF();
    }
  };

  // Sort custody history by date ascending
  const sortedHistory = [...(product.custodyHistory || [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

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
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24, marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #42756a', color: '#42756a' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #42756a', color: '#42756a' }}>Previous Status</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #42756a', color: '#42756a' }}>New Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.length > 0 ? (
              sortedHistory.map((entry, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? '#f7faf9' : '#fff' }}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{new Date(entry.date).toLocaleString()}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{entry.previousStatus}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#42756a' }}>{entry.newStatus}</td>
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
      <button onClick={handleDownloadPDF}>Download PDF</button>
      <button onClick={onBack} style={{ marginLeft: 8 }}>Back</button>
    </div>
  );
}

export default ChainOfCustodyPage;