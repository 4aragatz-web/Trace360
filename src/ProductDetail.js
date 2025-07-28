import React from 'react';

function ProductDetail({ product, onEdit, onShowChainOfCustody }) {
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
    </div>
  );
}
export default ProductDetail;