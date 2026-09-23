/**
 * INNOVENTA - Dynamic Canvas Certificate Generator & Exporter
 */

const CertificateExporter = {
  generateCanvas(cert) {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1131; // 1.414 ratio (A4 landscape)
    const ctx = canvas.getContext("2d");

    // Background Gradient / Solid
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer Decorative Border
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#0f172a"; // Slate 900
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Inner Gold Border
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#d97706"; // Amber 600
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Corner Ornamentation
    const corners = [
      [48, 48],
      [canvas.width - 48, 48],
      [48, canvas.height - 48],
      [canvas.width - 48, canvas.height - 48]
    ];
    ctx.fillStyle = "#d97706";
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // Header Branding
    ctx.textAlign = "center";
    ctx.font = "bold 32px 'Outfit', 'Segoe UI', sans-serif";
    ctx.fillStyle = "#3b82f6"; // Blue 500
    ctx.fillText("I N N O V E N T A", canvas.width / 2, 130);

    ctx.font = "600 18px 'Inter', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("NATIONAL TECHNOLOGY & EVENT COUNCIL", canvas.width / 2, 165);

    // Certificate Title
    ctx.font = "bold 56px 'Outfit', 'Georgia', serif";
    ctx.fillStyle = "#0f172a";
    ctx.fillText("CERTIFICATE OF ACHIEVEMENT", canvas.width / 2, 250);

    // Divider Line
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 200, 280);
    ctx.lineTo(canvas.width / 2 + 200, 280);
    ctx.stroke();

    // Subtitle
    ctx.font = "italic 22px 'Inter', Georgia, serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("This official certificate is proudly presented to", canvas.width / 2, 340);

    // Participant Name
    ctx.font = "bold 64px 'Outfit', 'Segoe UI', sans-serif";
    ctx.fillStyle = "#1e3a8a"; // Dark blue
    ctx.fillText(cert.participantName, canvas.width / 2, 430);

    // Participant College / Category
    if (cert.college || cert.issueCategory) {
      ctx.font = "500 22px 'Inter', sans-serif";
      ctx.fillStyle = "#0284c7";
      ctx.fillText(`${cert.college ? cert.college + "  •  " : ""}${cert.issueCategory || "Participant"}`, canvas.width / 2, 480);
    }

    // Body Text
    ctx.font = "22px 'Inter', sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("for successful participation and meritorious performance in the event", canvas.width / 2, 550);

    // Event Name
    ctx.font = "bold 44px 'Outfit', sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.fillText(cert.eventName, canvas.width / 2, 620);

    // Date
    ctx.font = "500 22px 'Inter', sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText(`Conducted on ${cert.eventDate}`, canvas.width / 2, 675);

    // Badge Seal Graphic (Center-Bottom)
    ctx.save();
    ctx.translate(canvas.width / 2, 810);
    // Seal Circle
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fillStyle = "#fef3c7";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#d97706";
    ctx.stroke();

    ctx.font = "bold 24px 'Inter', sans-serif";
    ctx.fillStyle = "#b45309";
    ctx.fillText("VERIFIED", 0, -5);
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText("SECURE ID", 0, 18);
    ctx.restore();

    // Signatures
    // Left Signature
    ctx.textAlign = "center";
    ctx.beginPath();
    ctx.moveTo(250, 930);
    ctx.lineTo(480, 930);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#94a3b8";
    ctx.stroke();

    ctx.font = "bold 20px 'Outfit', sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.fillText("Dr. Aris Thorne", 365, 965);
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Director of Academic Events", 365, 990);

    // Right Signature
    ctx.beginPath();
    ctx.moveTo(canvas.width - 480, 930);
    ctx.lineTo(canvas.width - 250, 930);
    ctx.stroke();

    ctx.font = "bold 20px 'Outfit', sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.fillText("Elena Vance", canvas.width - 365, 965);
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Chief Verification Officer", canvas.width - 365, 990);

    // QR Code Area (Bottom Left)
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(100, 780, 130, 130);
    ctx.strokeStyle = "#cbd5e1";
    ctx.strokeRect(100, 780, 130, 130);

    // Draw simple QR pixel pattern representation
    ctx.fillStyle = "#0f172a";
    const qrGrid = [
      [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [1,1,0,1,0,1,1,0,1,1,0,1,0,1,1],
      [1,0,1,0,1,0,1,1,0,1,1,0,1,0,1],
      [1,1,1,1,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,1,0,1,0,1,0,1,1],
      [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,1,0,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,0,1,0,1,1,1]
    ];
    const cellSize = 6;
    const startX = 112;
    const startY = 792;
    for (let r = 0; r < qrGrid.length; r++) {
      for (let c = 0; c < qrGrid[r].length; c++) {
        if (qrGrid[r][c] === 1) {
          ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize, cellSize);
        }
      }
    }

    ctx.textAlign = "left";
    ctx.font = "500 12px 'Inter', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("SCAN TO VERIFY", 100, 930);

    // Footer Metadata & Certificate ID (Bottom Right)
    ctx.textAlign = "right";
    ctx.font = "bold 18px 'Inter', monospace";
    ctx.fillStyle = "#0f172a";
    ctx.fillText(`ID: ${cert.certificateId}`, canvas.width - 100, 860);

    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Verification Status: ${cert.status || "CERTIFICATE VERIFIED"}`, canvas.width - 100, 885);
    ctx.fillText(`Issue Hash: ${cert.issueHash || "0x8f92a1b74c5d3e2109841f6a"}`, canvas.width - 100, 910);
    ctx.fillText("Official Verifiable Credential • INNOVENTA Portal", canvas.width - 100, 930);

    return canvas;
  },

  download(cert) {
    const canvas = this.generateCanvas(cert);
    const link = document.createElement("a");
    link.download = `INNOVENTA_Certificate_${cert.certificateId}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

if (typeof window !== "undefined") {
  window.CertificateExporter = CertificateExporter;
}
