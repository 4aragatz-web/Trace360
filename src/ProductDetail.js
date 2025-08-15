import React, { useState } from 'react';

const EDIT_PASSWORD = "hemp123";

function ProductDetail({ product, onEdit, onShowChainOfCustody, onUpdateProduct }) {
  const [showForm, setShowForm] = useState(false);
  const [previousStatus, setPreviousStatus] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleShowForm = () => {
    const input = window.prompt("Enter password to add a custody event:");
    if (input === EDIT_PASSWORD) {
      setShowForm(true);
    } else {
      alert("Incorrect password.");
    }
  };

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
    const updatedProduct = {
      ...product,
      custodyHistory: [...(product.custodyHistory || []), newEvent]
    };
    if (onUpdateProduct) {
      onUpdateProduct(updatedProduct);
    }
    setShowForm(false);
    setPreviousStatus('');
    setNewStatus('');
    setLocation('');
    setLat('');
    setLng('');
  };

  if (!product) {
    return <div>No product found for this Trace ID.</div>;
  }

  return (
    <div>
      <h2>Product Details</h2>
      <div className="product-form">
        <span className="form-label">Trace ID:</span>
        <span className="form-input">{product.id}</span>

        <span className="form-label">Locations Grown:</span>
        <span className="form-input">{product.farmName}</span>

        <span className="form-label">Organic Certified:</span>
        <span className="form-input">{product.organicCertified}</span>

        <span className="form-label">Planted Date:</span>
        <span className="form-input">{product.dateSow}</span>

        <span className="form-label">Seed Variety:</span>
        <span className="form-input">{product.seedVariety}</span>

        <span className="form-label">Grown for:</span>
        <span className="form-input">{product.grownFor}</span>

        <span className="form-label">Harvested Date:</span>
        <span className="form-input">{product.dateHarvested}</span>

        <span className="form-label">THC compliance level:</span>
        <span className="form-input">{product.thc}</span>

        <span className="form-label">Current Status:</span>
        <span className="form-input">{product.currentStatus}</span>
      </div>
      <button onClick={onEdit} style={{ marginTop: 16 }}>Edit Product</button>
      <button
        onClick={onShowChainOfCustody}
        style={{ marginTop: 16, marginLeft: 8 }}
      >
        View Chain of Custody
      </button>
      <button onClick={handleShowForm} style={{ marginTop: 16 }}>
        Add Custody Event
      </button>
      {showForm && (
        <div style={{ margin: '16px 0', background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
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
      )}
    </div>
  );
}

export default ProductDetail;