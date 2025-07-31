import React, { useEffect, useRef } from 'react';

function ScanPage({ onScan, onCancel }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert('Camera error: ' + err.message);
        onCancel();
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCancel]);

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h2>Camera Preview Test</h2>
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
      </div>
      <button onClick={onCancel} style={{ marginTop: 24 }}>Cancel</button>
    </div>
  );
}

export default ScanPage;