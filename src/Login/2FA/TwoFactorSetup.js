import React, { useState } from 'react';
import axios from 'axios';
import { Link} from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // Use QRCodeCanvas for rendering the QR code
import './TwoFactorSetup.css';

const TwoFactorSetup = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateQRCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/generate-2fa');
      setQrCodeUrl(response.data.otpauth_url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <div className="setup-2fa">
      <h1>Two-Factor Authentication</h1>
      <button onClick={generateQRCode}>Generate QR Code</button> <br></br>
      {qrCodeUrl && <QRCodeCanvas value={qrCodeUrl} />}<br></br>
      <Link to='/2fa-verify'><button>Enter pin</button></Link>
    </div>
  );
};

export default TwoFactorSetup;
