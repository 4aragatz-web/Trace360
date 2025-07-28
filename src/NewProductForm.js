import React, { useState } from 'react';

function NewProductForm({ traceId, onSave, onCancel, initialData }) {
  const [farmName, setFarmName] = useState(initialData?.farmName || '');
  const [organicCertified, setOrganicCertified] = useState(initialData?.organicCertified || '');
  const [dateSow, setDateSow] = useState(initialData?.dateSow || '');
  const [seedVariety, setSeedVariety] = useState(initialData?.seedVariety || '');
  const [grownFor, setGrownFor] = useState(initialData?.grownFor || '');
  const [dateHarvested, setDateHarvested] = useState(initialData?.dateHarvested || '');
  const [thc, setThc] = useState(initialData?.thc || '');
  const [currentStatus, setCurrentStatus] = useState(initialData?.currentStatus || '');

  // Track previous status for custody history
  const [previousStatus, setPreviousStatus] = useState(initialData?.currentStatus || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build custody history entry if status changed
    let custodyHistory = initialData?.custodyHistory ? [...initialData.custodyHistory] : [];
    if (previousStatus !== currentStatus) {
      custodyHistory.push({
        date: new Date().toISOString().slice(0, 10),
        previousStatus: previousStatus,
        newStatus: currentStatus
      });
    }

    onSave({
      id: traceId,
      farmName,
      organicCertified,
      dateSow,
      seedVariety,
      grownFor,
      dateHarvested,
      thc,
      currentStatus,
      custodyHistory
    });

    setPreviousStatus(currentStatus); // update previous status for next edit
  };

  return (
    <div>
      <h2>{initialData ? 'Edit Product' : 'New Product Entry'}</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <span className="form-label">Trace ID:</span>
        <span className="form-input">{traceId}</span>

        <span className="form-label">Location Grown:</span>
        <input className="form-input" value={farmName} onChange={e => setFarmName(e.target.value)} />

        <span className="form-label">Organic Certified:</span>
        <select className="form-input" value={organicCertified} onChange={e => setOrganicCertified(e.target.value)}>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <span className="form-label">Planted Date:</span>
        <input className="form-input" type="date" value={dateSow} onChange={e => setDateSow(e.target.value)} />

        <span className="form-label">Seed Variety:</span>
        <input className="form-input" value={seedVariety} onChange={e => setSeedVariety(e.target.value)} />

        <span className="form-label">Grown for:</span>
        <input className="form-input" value={grownFor} onChange={e => setGrownFor(e.target.value)} />

        <span className="form-label">Harvested Date:</span>
        <input className="form-input" type="date" value={dateHarvested} onChange={e => setDateHarvested(e.target.value)} />

        <span className="form-label">THC compliance level:</span>
        <input className="form-input" value={thc} onChange={e => setThc(e.target.value)} />

        <span className="form-label">Current Status:</span>
        <input className="form-input" value={currentStatus} onChange={e => setCurrentStatus(e.target.value)} />

        <div style={{ gridColumn: '1 / span 2', marginTop: 16 }}>
          <button type="submit">{initialData ? 'Update Product' : 'Save Product'}</button>
          <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
export default NewProductForm;