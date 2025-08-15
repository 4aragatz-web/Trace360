import React, { useState } from 'react';

const EDIT_PASSWORD = "hemp123";

function ProductDetail({ product, onEdit, onShowChainOfCustody, onUpdateProduct }) {
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');

  if (!product) {
    return <div>No product found for this Trace ID.</div>;
  }

  const handleShowStatusForm = () => {
    const input = window.prompt("Enter password to change status:");
    if (input === EDIT_PASSWORD) {
      setShowStatusForm(true);
    } else {
      alert("Incorrect password.");
    }
  };

  const handleStatusChange = () => {
    if (!newStatus) {
      alert("Please enter a new status.");
      return;
    }
    if (!location) {
      alert("Please enter a location for this status change.");
      return;
    }
    const updatedProduct = {
      ...product,
      currentStatus: newStatus,
      custodyHistory: [
        ...(product.custodyHistory || []),
        {
          date: new Date().toISOString(),
          previousStatus: product.currentStatus,
          newStatus,
          location,
        }
      ]
    };
    onUpdateProduct(updatedProduct);
    setNewStatus('');
    setLocation('');
    setShowStatusForm(false);
  };

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
      {!showStatusForm && (
        <button onClick={handleShowStatusForm} style={{ marginTop: 16 }}>
          Change Status
        </button>
      )}
      {showStatusForm && (
        <div style={{ marginTop: 16 }}>
          <input
            type="text"
            placeholder="Enter new status"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <button onClick={handleStatusChange}>
            Save Status
          </button>
          <button onClick={() => setShowStatusForm(false)} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        </div>
      )}
      <button onClick={onEdit} style={{ marginTop: 16 }}>Edit Product</button>
      <button
        onClick={onShowChainOfCustody}
        style={{ marginTop: 16, marginLeft: 8 }}
      >
        View Chain of Custody
      </button>
    </div>
  );
}

export default ProductDetail;