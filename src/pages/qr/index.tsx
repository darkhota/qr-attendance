import { useEffect, useState } from "react";
import { generateQrCode } from "../../lib/generateQrCode";
import { QRCode } from "react-qrcode"; // Updated import
import { getUserLocation, getDistance } from "../../lib/geoUtils";



const QRCodePage = () => {
  const [qrCode, setQrCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

    // Church's location coordinates
const CHURCH_LAT = parseFloat(process.env.NEXT_PUBLIC_CHURCH_LAT || "0");
const CHURCH_LNG = parseFloat(process.env.NEXT_PUBLIC_CHURCH_LNG || "0");
const MAX_DISTANCE = parseInt(process.env.NEXT_PUBLIC_MAX_DISTANCE || "100");

   const checkUserLocation = async (): Promise<boolean> => {
    try {
      const userLocation = await getUserLocation();
      const distance = getDistance(
        userLocation.lat,
        userLocation.lng,
        CHURCH_LAT,
        CHURCH_LNG
      );

      if (distance > MAX_DISTANCE) {
        setError("You are not within church premises.");
        return false;
      }
      return true;
    } catch (err) {
      setError("Unable to determine your location. Please enable location services.");
      return false;
    }
  };


  useEffect(() => {
    const generateCode = async () => {

      const isWithinChurch = await checkUserLocation();
      if (!isWithinChurch) return;

      const link = `${window.location.origin}/check-in`;
      const code = await generateQrCode(link, "/cci-logo.svg"); // Pass logo path for QR code customization
      setQrCode(code);
    };
    generateCode();
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center bg-[#DA1212] overflow-hidden">
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
              {error && <p className="text-red-500">{error}</p>}
        {qrCode && <img src={qrCode} alt="QR Code" className="w-64 h-64" />}
      </div>
    </div>
  );
};

export default QRCodePage;