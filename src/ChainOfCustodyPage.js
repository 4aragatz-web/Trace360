import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from './logo.png';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ChainOfCustodyPage({ product, onBack, onUpdateProduct }) {
  const certificateRef = useRef();

  // State for new custody event inputs
  const [previousStatus, setPreviousStatus] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

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

  // Download PDF using jsPDF and jspdf-autotable (fixed: only one download)
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
            entry.date, entry.previousStatus, entry.newStatus, entry.location || '-', entry.geo ? `${entry.geo.lat}, ${entry.geo.lng}` : '-'
          ])
        : [['-', '-', '-', '-', '-']];

      autoTable(doc, {
        head: [['Date', 'Previous Status', 'New Status', 'Location', 'Geo']],
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

  // Add new custody event
  const handleAddEvent = () => {
    if (!previousStatus || !newStatus || !location) {
      alert('Please fill in all fields.');
      return;
    }
    const newEvent = {
      date: new Date().toISOString(),
      previousStatus,
      newStatus,
      location,
      geo: lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined
    };
    // Update product's custodyHistory
    const updatedProduct = {
      ...product,
      custodyHistory: [...(product.custodyHistory || []), newEvent]
    };
    if (onUpdateProduct) {
      onUpdateProduct(updatedProduct);
    } else {
      // fallback: update in place (not recommended for real apps)
      product.custodyHistory.push(newEvent);
    }
    // Clear form
    setPreviousStatus('');
    setNewStatus('');
    setLocation('');
    setLat('');
    setLng('');
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
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #bbb' }}>Location</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #bbb' }}>Geo</th>
            </tr>
          </thead>
          <tbody>
            {product.custodyHistory && product.custodyHistory.length > 0 ? (
              product.custodyHistory.map((entry, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{entry.date}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{entry.previousStatus}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{entry.newStatus}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{entry.location || '-'}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                    {entry.geo ? `${entry.geo.lat}, ${entry.geo.lng}` : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '8px' }}>No custody history available.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Timeline Visualization */}
        <h4 style={{ marginTop: 32 }}>Custody Timeline</h4>
        <VerticalTimeline>
          {(product.custodyHistory || []).map((entry, idx) => (
            <VerticalTimelineElement
              key={idx}
              date={new Date(entry.date).toLocaleString()}
              iconStyle={{ background: '#42756a', color: '#fff' }}
            >
              <h3 className="vertical-timeline-element-title">{entry.newStatus}</h3>
              <h4 className="vertical-timeline-element-subtitle">{entry.location || '-'}</h4>
              <p>
                <b>From:</b> {entry.previousStatus}<br />
                {entry.geo ? (
                  <span>
                    <b>Geo:</b> {entry.geo.lat}, {entry.geo.lng}
                  </span>
                ) : null}
              </p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>

      {/* Add new custody event form */}
      <div style={{ marginBottom: 24, background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
        <h4>Add New Custody Event</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <input
            type="text"
            placeholder="Previous Status"
            value={previousStatus}
            onChange={e => setPreviousStatus(e.target.value)}
            style={{ flex: 1, minWidth: 120 }}
          />
          <input
            type="text"
            placeholder="New Status"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            style={{ flex: 1, minWidth: 120 }}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ flex: 1, minWidth: 120 }}
          />
          <input
            type="number"
            placeholder="Latitude"
            value={lat}
            onChange={e => setLat(e.target.value)}
            style={{ flex: 1, minWidth: 100 }}
          />
          <input
            type="number"
            placeholder="Longitude"
            value={lng}
            onChange={e => setLng(e.target.value)}
            style={{ flex: 1, minWidth: 100 }}
          />
          <button onClick={handleAddEvent} style={{ flex: 1, minWidth: 120 }}>Add Event</button>
        </div>
      </div>

      <button onClick={handlePrint} style={{ marginRight: 8 }}>Print Certificate</button>
      <button onClick={handleDownloadPDF}>Download PDF</button>
      <button onClick={onBack} style={{ marginLeft: 8 }}>Back</button>

      {/* Map Visualization */}
      <h4 style={{ marginTop: 32 }}>Custody Map</h4>
      {(product.custodyHistory || []).some(e => e.geo && e.geo.lat && e.geo.lng) ? (
        <MapContainer
          center={[
            product.custodyHistory.find(e => e.geo && e.geo.lat && e.geo.lng)?.geo.lat || 0,
            product.custodyHistory.find(e => e.geo && e.geo.lat && e.geo.lng)?.geo.lng || 0
          ]}
          zoom={5}
          style={{ height: 400, width: '100%', marginBottom: 24 }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline
            positions={
              product.custodyHistory
                .filter(e => e.geo && e.geo.lat && e.geo.lng)
                .map(e => [e.geo.lat, e.geo.lng])
            }
            color="blue"
          />
          {product.custodyHistory
            .filter(e => e.geo && e.geo.lat && e.geo.lng)
            .map((e, i) => (
              <Marker key={i} position={[e.geo.lat, e.geo.lng]}>
                <Popup>
                  <b>{e.newStatus}</b><br />
                  {e.location}<br />
                  {new Date(e.date).toLocaleString()}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      ) : (
        <p>No geo-located custody events to display on map.</p>
      )}
    </div>
  );
}

export default ChainOfCustodyPage;