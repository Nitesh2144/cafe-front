import jsPDF from "jspdf";

const PAPER_WIDTH_MAP = {
  "58mm": 58,
  "80mm": 80,
  "A4": 210,
};

const formatAddress = (address) => {
  if (!address) return "";
  const { street, area, city, state, pincode } = address;
  return [street, area, city, state, pincode]
    .filter(Boolean)
    .join(", ");
};


export const generateThermalInvoice = (order, config = {}) => {
  const paperSize = config.paperSize || "80mm";
    const pageWidth = PAPER_WIDTH_MAP[paperSize] || 80;
  const is58 = paperSize === "58mm";
const isA4 = paperSize === "A4";

const nameColWidth = is58 ? 12 : isA4 ? 30 : 18;
const qtyX = is58 ? 30 : isA4 ? 120 : 36;
const rateX = is58 ? 38 : isA4 ? 145 : 48;
const amtX  = is58 ? 48 : isA4 ? 170 : 60;
const line = "-".repeat(is58 ? 32 : 40);

// 🔢 Dynamic height calculation
const HEADER_HEIGHT = 35;
const FOOTER_HEIGHT = 50;
const ITEM_HEIGHT = 8;

const itemsHeight = order.items.length * ITEM_HEIGHT;

const pageHeight =
  HEADER_HEIGHT +
  itemsHeight +
  FOOTER_HEIGHT;

  const baseFontSize =
    paperSize === "58mm" ? 8 :
    paperSize === "80mm" ? 10 :
    12;
  
  const smallFont = baseFontSize - 2;
  const bigFont = baseFontSize + 2;
// 🧾 Create PDF with dynamic height
const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format:
    paperSize === "A4"
      ? "a4"
      : [pageWidth, pageHeight],
});
// ✅ FONT SIZE BASED ON PAPER SIZE


doc.setFontSize(baseFontSize);

  let y = 6;
const centerX = pageWidth / 2;

  /* ===== BUSINESS HEADER ===== */
doc.setFont("courier", "bold");
doc.setFontSize(bigFont);
doc.text(config.businessName || "MY CAFE", centerX, y, { align: "center" });

y += 5;
doc.setFont("courier", "normal");
doc.setFontSize(smallFont);


const addressText = formatAddress(config.businessAddress);

if (addressText) {
doc.setFontSize(smallFont);
  doc.text(addressText, centerX, y, {
    align: "center",
    maxWidth: pageWidth - 8,
  });
 
}
  y += 10;
  doc.text(
    `Phone: ${config.businessPhone || "XXXXXXXXXX"}`,
    centerX,
    y,
    { align: "center" }
  );

  y += 6;
 doc.text(line, centerX, y, { align: "center" });


  /* ===== BILL INFO ===== */
  y += 4;
  const billNo = String(order.billNo).padStart(2, "0");
doc.text(`Bill No: ${billNo}`, 4, y);


  y += 4;
  doc.text(
    `Created: ${new Date(order.createdAt).toLocaleString()}`,
    4,
    y
  );

  y += 6;
doc.text(line, centerX, y, { align: "center" });

  /* ===== ITEMS ===== */
  y += 4;
doc.text(
  is58 ? "Item        Qty   Rate   Amt" : "Item               Qty    Rate    Amt",
  4,
  y
);


  y += 3;
  doc.text(line, centerX, y, { align: "center" });

  let totalQty = 0;

  order.items.forEach(item => {
    totalQty += item.quantity;
    y += 4;
doc.text(item.name.substring(0, nameColWidth), 4, y);
doc.text(String(item.quantity), qtyX, y);
doc.text(String(item.price), rateX, y);
doc.text(String(item.quantity * item.price), amtX, y);

  });

  y += 4;
doc.text(line, centerX, y, { align: "center" });


  /* ===== TOTALS ===== */
  y += 4;
  doc.text(`Total Items: ${order.items.length}`, 4, y); 

  y += 4;
  doc.text(`Total Quantity: ${totalQty}`, 4, y);

  y += 4;
doc.text(line, centerX, y, { align: "center" });


  y += 6;
doc.setFont("courier", "bold");
doc.setFontSize(bigFont);
doc.text(`TOTAL ${order.totalAmount}`, centerX, y, { align: "center" });

  /* ===== FOOTER ===== */
  y += 6;
  doc.setFont("courier", "normal");
doc.setFontSize(smallFont);
  doc.text(
    `Payment: ${order.paymentStatus}`,
    centerX,
    y,
    { align: "center" }
  );

  y += 4;
doc.setFont("courier", "normal");
doc.setFontSize(smallFont);
doc.text(config.footerText || "Thank You! Visit Again", centerX, y, { align: "center" });


  y += 4;
  doc.text("Powered by Tech Shower", centerX, y, {
    align: "center",
  });

    doc.autoPrint();

  // ✅ Open print dialog
  const pdfBlob = doc.output("bloburl");
  const printWindow = window.open(pdfBlob);

  if (!printWindow) {
    alert("Please allow popups for printing");
  }
};

