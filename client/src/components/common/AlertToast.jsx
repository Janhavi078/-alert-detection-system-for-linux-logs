import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { AlertCircle } from 'lucide-react';

const AlertToast = ({ message, onClose }) => {
  const toastRef = useRef();

  // Animation for the alert to slide in from the right [cite: 149]
  useGSAP(() => {
    if (toastRef.current) {
      gsap.from(toastRef.current, { 
        x: 300, 
        opacity: 0, 
        duration: 0.5, 
        ease: 'back.out' 
      });
    }
  }, { scope: toastRef });

  return (
    <div ref={toastRef} className="position-fixed top-0 end-0 m-4" style={{ zIndex: 9999 }}>
      <div className="alert alert-danger d-flex align-items-center shadow-lg border-0 p-3 text-white bg-danger">
        <AlertCircle className="me-3" size={24} />
        <div className="me-4">
          <strong className="d-block">Anomaly Detected!</strong>
          <div className="small opacity-75">{message}</div>
        </div>
        <button 
          type="button" 
          className="btn-close btn-close-white ms-auto" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default AlertToast;