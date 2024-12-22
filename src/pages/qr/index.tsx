import { useEffect, useState } from "react";
import { generateQrCode } from "../../lib/generateQrCode";

const QRCodePage = () => {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    const generateCode = async () => {
      const link = `${window.location.origin}/check-in`;
      const code = await generateQrCode(link, "/cci-logo.svg"); // Pass logo path for QR code customization
      setQrCode(code);
    };
    generateCode();
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center bg-red-500 overflow-hidden">
      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="floating-icon text-white text-opacity-40"
            style={{
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            ✨
          </span>
        ))}
      </div>

      {/* QR Code Content */}
      <div className="z-10 flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Scan to Check In</h1>
        {qrCode && <img src={qrCode} alt="QR Code" className="w-64 h-64" />}
      </div>
    </div>
  );
};

export default QRCodePage;