const EDIT_PASSWORD = "hemp123";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HomeScreen from './HomeScreen';
import ProductDetail from './ProductDetail';
import NewProductForm from './NewProductForm';
import ChainOfCustodyPage from './ChainOfCustodyPage';
import logo from './logo.png';
import { BrowserMultiFormatReader } from '@zxing/browser';

const requestPassword = () => {
  const input = window.prompt("Enter password to edit or add a product:");
  return input === EDIT_PASSWORD;
};

// Improved helper to stop all camera streams on the page
const stopCamera = () => {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  });
};

// Helper to detect mobile devices
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
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    axios.get('https://trace360-co.onrender.com/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Always stop camera when scanning ends or component unmounts
  useEffect(() => {
    if (!scanning) return;
    return () => {
      stopCamera();
    };
  }, [scanning]);

  const findProduct = (id) => products.find(p => p.id === id);

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

  // Real barcode scan handler using camera
  const handleBarcodeScan = async () => {
    setScanning(true);
    setTimeout(async () => {
      const codeReader = new BrowserMultiFormatReader();
      let resultText = null;
      try {
        const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoRef.current);
        resultText = result.text;
      } catch (err) {
        alert('No barcode detected or camera error.');
      } finally {
        setScanning(false);
        codeReader.reset();
        stopCamera();
        if (resultText) {
          setTraceId(resultText);
          const found = findProduct(resultText);
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
      }
    }, 100); // Wait for video element to be in DOM
  };

  const handleBack = () => {
    setShowDetails(false);
    setShowNewProductForm(false);
    setEditProduct(null);
    setShowChainOfCustody(false);
    setTraceId('');
    stopCamera();
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
        {!showDetails && !showNewProductForm && !showChainOfCustody ? (
          <>
            <h2>Scan Barcode</h2>
            {!scanning && (
              <button onClick={handleBarcodeScan}>Scan Barcode</button>
            )}
            {scanning && (
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
            )}
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