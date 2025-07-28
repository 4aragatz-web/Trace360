import React from 'react';

const ProductTraceCard = ({ productName, traceId, status }) => {
    return (
        <div className="product-trace-card">
            <h2>{productName}</h2>
            <p>Trace ID: {traceId}</p>
            <p>Status: {status}</p>
        </div>
    );
};

export default ProductTraceCard;