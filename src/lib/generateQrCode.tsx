import QRCode from "qrcode";

export const generateQrCode = async (text: string, logoPath?: string): Promise<string> => {
  if (!logoPath) {
    // Generate basic QR code without a logo
    return await QRCode.toDataURL(text, { errorCorrectionLevel: "H" });
  }

  // Generate QR code with a logo
  const baseQrCode = await QRCode.toDataURL(text, { errorCorrectionLevel: "H", width: 300 });
  const qrCanvas = document.createElement("canvas");
  const ctx = qrCanvas.getContext("2d");

  const qrImage = new Image();
  qrImage.src = baseQrCode;

  return new Promise<string>((resolve) => {
    qrImage.onload = () => {
      qrCanvas.width = qrImage.width;
      qrCanvas.height = qrImage.height;

      // Draw QR code
      if (ctx) {
        ctx.drawImage(qrImage, 0, 0);

        // Draw logo with margin
        const logo = new Image();
        logo.src = logoPath;
        logo.onload = () => {
          const logoSize = qrCanvas.width / 6; // Logo size is 1/6th of QR code width
          const logoMargin = logoSize / 4; // Add a margin around the logo
          const logoX = (qrCanvas.width - logoSize) / 2 - logoMargin; // Center logo horizontally
          const logoY = (qrCanvas.height - logoSize) / 2 - logoMargin; // Center logo vertically

          // Draw a white background behind the logo for better visibility
          ctx.fillStyle = "white";
          ctx.fillRect(
            logoX + logoMargin / 2,
            logoY + logoMargin / 2,
            logoSize + logoMargin,
            logoSize + logoMargin
          );

          // Draw the logo
          ctx.drawImage(logo, logoX + logoMargin, logoY + logoMargin, logoSize, logoSize);
          resolve(qrCanvas.toDataURL());
        };
      }
    };
  });
};