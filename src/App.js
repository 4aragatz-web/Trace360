const EDIT_PASSWORD = "hemp123";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HomeScreen from './HomeScreen';
import ProductDetail from './ProductDetail';
import NewProductForm from './NewProductForm';
import ChainOfCustodyPage from './ChainOfCustodyPage';
import logo from './logo.png';
import { BrowserMultiFormatReader } from '@zxing/browser';

// --- ScanPage Component ---
function ScanPage({ onScan, onCancel }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let codeReader = new BrowserMultiFormatReader();
    let active = true;

    async function startScan() {
      try {
        const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoRef.current);
        if (active) {
          codeReader.reset();
          stopCamera();
          onScan(result.text);
        }
      } catch (err) {
        if (active) {
          codeReader.reset();
          stopCamera();
          alert('No barcode detected or camera error.');
          onCancel();
        }
      }
    }

    startScan();

    return () => {
      active = false;
      codeReader.reset();
      stopCamera();
    };
  }, [onScan, onCancel]);

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h2>Scan Barcode</h2>
      <div
        style={{
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
        }}
      >
        <video ref={videoRef} style={{ width: 300, height: 200, borderRadius: 8 }} />
        {/* Overlay rectangle for barcode alignment */}
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
      <button onClick={onCancel} style={{ marginTop: 24 }}>Cancel</button>
    </div>
  );
}

// --- Helper functions ---
const requestPassword = () => {
  const input = window.prompt("Enter password to edit or add a product:");
  return input === EDIT_PASSWORD;
};

const stopCamera = () => {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  });
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
    setShowScanPage(false);
    setTraceId(barcode);
    const found = findProduct(barcode);
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
              <label>
                Or enter Trace ID manually:
                <input
                  type="text"
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