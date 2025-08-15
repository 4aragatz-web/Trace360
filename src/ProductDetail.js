import React, { useState } from 'react';

const EDIT_PASSWORD = "hemp123";

function ProductDetail({ product, onUpdateProduct, onShowChainOfCustody }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...product });
  const [location, setLocation] = useState('');
  const [prevStatus, setPrevStatus] = useState(product.currentStatus);

  if (!product) {
    return <div>No product found for this Trace ID.</div>;
  }

  const handleEditClick = () => {
    const input = window.prompt("Enter password to edit product:");
    if (input === EDIT_PASSWORD) {
      setIsEditing(true);
    } else {
      alert("Incorrect password.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    let updatedProduct = { ...form };
    // If status changed, add to custodyHistory
    if (form.currentStatus !== prevStatus) {
      if (!location) {
        alert("Please enter a location for this status change.");
        return;
      }
      updatedProduct.custodyHistory = [
        ...(product.custodyHistory || []),
        {
          date: new Date().toISOString(),
          previousStatus: prevStatus,
          newStatus: form.currentStatus,
          location,
        }
      ];
    }
    try {
      await fetch(`https://trace360-co.onrender.com/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (onUpdateProduct) onUpdateProduct(updatedProduct);
      setIsEditing(false);
      setPrevStatus(form.currentStatus);
      setLocation('');
    } catch (err) {
      alert("Failed to update product in backend.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Product Details</h2>
      <div className="product-form">
        <span className="form-label">Trace ID:</span>
        <span className="form-input">{product.id}</span>

        <span className="form-label">Locations Grown:</span>
        {isEditing ? (
          <input name="farmName" value={form.farmName} onChange={handleChange} />
        ) : (
          <span className="form-input">{product.farmName}</span>
        )}

        <span className="form-label">Organic Certified:</span>
        {isEditing ? (
          <input name="organicCertified" value={form.organicCertified} onChange={handleChange} />
        ) : (
          <span className="form-input">{product.organicCertified}</span>
        )}

        <span className="form-label">Planted Date:</span>
        {isEditing ? (
          <input name="dateSow" value={form.dateSow} onChange={handleChange} />
        ) : (
          <span className="form-input">{product.dateSow}</span>
        )}

        <span className="form-label">Seed Variety:</span>
        {isEditing ? (
          <input name="seedVariety" value={form.seedVariety} onChange={handleChange} />
        ) : (
          <span className="form-input">{product.seedVariety}</span>
        )}

        <span className="form-label">Grown for:</span>
        {isEditing ? (
          <input name="grownFor" value={form.grownFor} onChange={handleChange} />
        ) : (
          <span className="form-input">{product.grownFor}</span>
        )}

        <span className="form-label">Harvested Date:</span>
        {isEditing ? (
          <input name="dateHarvested" value={form.dateHarvested} onChange={handleChange} />
        ) : (
          <span className="form-input">{product.dateHarvested}</span>
        )}

        <span className="form-label">THC compliance level:</span>
        {isEditing ? (
          <input name="thc" value={form.thc} onChange={handleChange} />
        ) : (
          <span className="form-input">{product.thc}</span>
        )}

        <span className="form-label">Current Status:</span>
        {isEditing ? (
          <input name="currentStatus" value={form.currentStatus} onChange={handleChange} />
        ) : (
          <span className="form-input">{product.currentStatus}</span>
        )}

        {isEditing && form.currentStatus !== prevStatus && (
          <>
            <span className="form-label">Location for Status Change:</span>
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </>
        )}
      </div>
      {!isEditing ? (
        <button onClick={handleEditClick} style={{ marginTop: 16 }}>Edit Product</button>
      ) : (
        <button onClick={handleSave} style={{ marginTop: 16 }}>Save</button>
      )}
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