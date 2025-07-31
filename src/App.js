const EDIT_PASSWORD = "hemp123";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HomeScreen from './HomeScreen';
import ProductDetail from './ProductDetail';
import NewProductForm from './NewProductForm';
import ChainOfCustodyPage from './ChainOfCustodyPage';
import logo from './logo.png';
import ScanPage from './ScanPage'; // <-- Import the new ScanPage component

// --- Helper functions ---
const requestPassword = () => {
  const input = window.prompt("Enter password to edit or add a product:");
  return input === EDIT_PASSWORD;
};

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

function App() {
  const [traceId, setTraceId] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [products, setProducts] = useState([]);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showChainOfCustody, setShowChainOfCustody] = useState(false);
  const [showScanPage, setShowScanPage] = useState(false);

  // Use a ref to always have the latest products in async handlers
  const productsRef = useRef(products);
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    axios.get('https://trace360-co.onrender.com/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const findProduct = (id) => productsRef.current.find(p => String(p.id) === String(id));

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (traceId.trim()) {
      const found = findProduct(traceId.trim());
      if (found) {
        setShowDetails(true);
        setShowNewProductForm(false);
        setEditProduct(null);
      } else {
        if (!requestPassword()) {
          alert("Incorrect password.");
          return;
        }
        setShowNewProductForm(true);
        setShowDetails(false);
        setEditProduct(null);
      }
    }
  };

  // Called when scan is successful
  const handleScanResult = (barcode) => {
    const cleanBarcode = String(barcode).trim().replace(/[\r\n]+/g, '');
    setShowScanPage(false);
    setTraceId(cleanBarcode);
    setTimeout(() => {
      handleManualSubmit({ preventDefault: () => {} });
    }, 0);
  };

  const handleBack = () => {
    setShowDetails(false);
    setShowNewProductForm(false);
    setEditProduct(null);
    setShowChainOfCustody(false);
    setTraceId('');
  };

  const handleSaveNewProduct = (newProduct) => {
    axios.post('https://trace360-co.onrender.com/products', newProduct)
      .then(() => axios.get('https://trace360-co.onrender.com/products'))
      .then(res => {
        setProducts(res.data);
        setShowDetails(true);
        setShowNewProductForm(false);
        setEditProduct(null);
      })
      .catch(err => console.error(err));
  };

  const handleEdit = () => {
    if (!requestPassword()) {
      alert("Incorrect password.");
      return;
    }
    const product = findProduct(traceId);
    setEditProduct(product);
    setShowNewProductForm(true);
    setShowDetails(false);
  };

  const handleShowChainOfCustody = () => {
    setShowChainOfCustody(true);
    setShowDetails(false);
    setShowNewProductForm(false);
  };

  // --- Main Render ---
  return (
    <div className="app-container">
      {/* Only show background video on non-mobile devices */}
      {!isMobile() && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
          src="/background.mp4"
        />
      )}
      <img src={logo} alt="Company Logo" style={{ height: 60, marginBottom: 16, position: 'relative', zIndex: 1 }} />
      <HomeScreen />
      <div style={{ marginTop: 32, position: 'relative', zIndex: 1 }}>
        {showScanPage ? (
          <ScanPage
            onScan={handleScanResult}
            onCancel={() => setShowScanPage(false)}
          />
        ) : !showDetails && !showNewProductForm && !showChainOfCustody ? (
          <>
            <h2>Scan Barcode</h2>
            <button onClick={() => setShowScanPage(true)}>Scan Barcode</button>
            <form onSubmit={handleManualSubmit} style={{ marginTop: 16 }}>
              <label htmlFor="traceId">
                Or enter Trace ID manually:
                <input
                  type="text"
                  id="traceId"
                  name="traceId"
                  value={traceId}
                  onChange={(e) => setTraceId(e.target.value)}
                  placeholder="e.g. 123456789"
                  style={{ marginLeft: 8 }}
                />
              </label>
              <button type="submit" style={{ marginLeft: 8 }}>Submit</button>
            </form>
          </>
        ) : showDetails ? (
          <>
            <ProductDetail
              product={findProduct(traceId)}
              onEdit={handleEdit}
              onShowChainOfCustody={handleShowChainOfCustody}
            />
            <button onClick={handleBack} style={{ marginTop: 16 }}>Back to Scanner</button>
          </>
        ) : showChainOfCustody ? (
          <>
            <ChainOfCustodyPage
              product={findProduct(traceId)}
              onBack={handleBack}
            />
          </>
        ) : (
          <>
            <NewProductForm
              traceId={traceId}
              onSave={handleSaveNewProduct}
              onCancel={handleBack}
              initialData={editProduct}
            />
          </>
        )}
      </div>
    </div>
  );
}
export default App;