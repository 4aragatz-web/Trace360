import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

function ScanPage({ onScan, onCancel }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let codeReader = new BrowserMultiFormatReader();
    let controls;
    let active = true;

    async function startScan() {
      try {
        controls = await codeReader.decodeFromVideoDevice(
          { facingMode: "environment" },
          videoRef.current,
          (result, err) => {
            if (result && active) {
              codeReader.reset();
              if (controls && controls.stop) controls.stop();
              // Stop camera stream
              if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
              }
              onScan(result.getText());
            }
          }
        );
      } catch (err) {
        if (active) {
          codeReader.reset();
          if (controls && controls.stop) controls.stop();
          if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
          }
          alert('No barcode detected or camera error.');
          onCancel();
        }
      }
    }

    startScan();

    return () => {
      active = false;
      codeReader.reset();
      if (controls && controls.stop) controls.stop();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
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
        <video
          ref={videoRef}
          style={{ width: 300, height: 200, borderRadius: 8 }}
          autoPlay
          muted
          playsInline
        />
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
          Align the barcode within the frame
        </p>
      </div>
      <button onClick={onCancel} style={{ marginTop: 24 }}>Cancel</button>
    </div>
  );
}

export default ScanPage;