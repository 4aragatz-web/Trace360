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

  // Download PDF using jsPDF and jspdf-autotable
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 15;

    // Add logo (centered)
    const img = new window.Image();
    img.src = logo;
    img.onload = function () {
      doc.addImage(img, 'PNG', 80, y, 50, 20); // Adjust position/size as needed
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

      // Table for custody history
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
    if (img.complete) img.onload();
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
      <button onClick={handleDownloadPDF} style={{ marginRight: 8 }}>Download PDF</button>
      <button onClick={onBack} style={{ marginTop: 16 }}>Back</button>
    </div>
  );
}

export default ChainOfCustodyPage;