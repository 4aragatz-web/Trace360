const EDIT_PASSWORD = "hemp123";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HomeScreen from './HomeScreen';
import ProductDetail from './ProductDetail';
import NewProductForm from './NewProductForm';
import ChainOfCustodyPage from './ChainOfCustodyPage';
import logo from './logo.png';
import { BrowserMultiFormatReader } from '@zxing/browser';

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
  const [showForm, setShowForm] = useState(false);
  const videoRef = useRef(null);

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

  // Updated handleManualSubmit to accept barcodeOverride
  const handleManualSubmit = (e, barcodeOverride) => {
    if (e && e.preventDefault) e.preventDefault();
    const idToCheck = barcodeOverride || traceId.trim();
    if (idToCheck) {
      const found = findProduct(idToCheck);
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

  // Camera scan logic directly in App.js
  useEffect(() => {
    let codeReader;
    let active = true;
    let controls;

    async function startScan() {
      if (!showScanPage) return;
      codeReader = new BrowserMultiFormatReader();
      try {
        controls = await codeReader.decodeFromConstraints(
          { video: { facingMode: "environment" } },
          videoRef.current,
          (result, err) => {
            console.log("Scan callback fired", { result, err });
            if (result && active) {
              console.log("Scanned barcode:", result.getText());
              active = false;
              if (controls && controls.stop) controls.stop();
              if (codeReader && typeof codeReader.reset === "function") codeReader.reset();
              if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
              }
              const cleanBarcode = String(result.getText()).trim().replace(/[\r\n]+/g, '');
              setShowScanPage(false);
              setTraceId(cleanBarcode);
              setTimeout(() => {
                handleManualSubmit({ preventDefault: () => {} }, cleanBarcode);
              }, 0);
            }
          }
        );
      } catch (err) {
        if (active) {
          if (controls && controls.stop) controls.stop();
          if (codeReader && typeof codeReader.reset === "function") codeReader.reset();
          if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
          }
          alert('No barcode detected or camera error.');
          setShowScanPage(false);
        }
      }
    }

    if (showScanPage) startScan();

    return () => {
      active = false;
      if (controls && controls.stop) controls.stop();
      if (codeReader && typeof codeReader.reset === "function") codeReader.reset();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
    // eslint-disable-next-line
  }, [showScanPage]);

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

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products =>
      products.map(p => String(p.id) === String(updatedProduct.id) ? updatedProduct : p)
    );
  };

  const handleShowForm = () => {
    setShowForm(true);
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
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <h2>Scan Barcode</h2>
            <div style={{
              position: 'relative',
              width: 320,
              height: 240,
              margin: '0 auto',
              background: '#222',
              borderRadius: 12,
              boxShadow: '0 2px 12px #0008',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <video
                ref={videoRef}
                style={{ width: 300, height: 200, borderRadius: 8 }}
                autoPlay
                muted
                playsInline
              />
              <div
                style={{
                  position: 'absolute',
                  top: 60,
                  left: 60,
                  width: 200,
                  height: 40,
                  border: '2px solid #00FF00',
                  borderRadius: 8,
                  pointerEvents: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{
                position: 'absolute',
                top: 110,
                left: 0,
                width: '100%',
                textAlign: 'center',
                color: '#fff',
                textShadow: '0 0 4px #000'
              }}>
                Line up the barcode inside the box
              </p>
            </div>
            <button onClick={() => setShowScanPage(false)} style={{ marginTop: 24 }}>Cancel</button>
          </div>
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
              onUpdateProduct={handleUpdateProduct}
            />
            <button onClick={handleBack} style={{ marginTop: 16 }}>Back to Scanner</button>
          </>
        ) : showChainOfCustody ? (
          <>
            <ChainOfCustodyPage
              product={findProduct(traceId)}
              onBack={handleBack}
              onUpdateProduct={handleUpdateProduct}
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