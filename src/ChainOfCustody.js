import React from 'react';
import ChainOfCustody from './ChainOfCustody';

function ChainOfCustodyPage({ product, onBack }) {
  if (!product) {
    return <div>No product found for this Trace ID.</div>;
  }

  return (
    <div>
      <h2>Chain of Custody</h2>
      <div style={{ marginBottom: 24 }}>
        <strong>Barcode Number:</strong> {product.id} <br />
        <strong>Seed Variety:</strong> {product.seedVariety} <br />
        <strong>Grown Location:</strong> {product.farmName}
      </div>
      <ChainOfCustody custodyHistory={product.custodyHistory} />
      <button onClick={onBack} style={{ marginTop: 16 }}>Back</button>
    </div>
  );
}

export default ChainOfCustodyPage;