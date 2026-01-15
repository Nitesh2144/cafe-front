import jsPDF from "jspdf";

const formatAddress = (address) => {
  if (!address) return "";
  const { street, area, city, state, pincode } = address;
  return [street, area, city, state, pincode]
    .filter(Boolean)
    .join(", ");
};


export const generateThermalInvoice = (order, config = {}) => {
// 🔢 Dynamic height calculation
const HEADER_HEIGHT = 35;
const FOOTER_HEIGHT = 50;
const ITEM_HEIGHT = 8;

const itemsHeight = order.items.length * ITEM_HEIGHT;

const pageHeight =
  HEADER_HEIGHT +
  itemsHeight +
  FOOTER_HEIGHT;

// 🧾 Create PDF with dynamic height
const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: [80, pageHeight],
});


  let y = 6;
  const centerX = 40;

  /* ===== BUSINESS HEADER ===== */
  doc.setFont("courier", "bold");
  doc.setFontSize(12);
  doc.text(
    config.businessName || "MY CAFE",
    centerX,
    y,
    { align: "center" }
  );

  y += 5;
  doc.setFontSize(8);
  doc.setFont("courier", "normal");

const addressText = formatAddress(config.businessAddress);

if (addressText) {
  doc.setFontSize(8);
  doc.text(addressText, centerX, y, {
    align: "center",
    maxWidth: 72, // 80mm paper safe width
  });
  y += 6;
}
  y += 4;
  doc.text(
    `Phone: ${config.phone || "XXXXXXXXXX"}`,
    centerX,
    y,
    { align: "center" }
  );

  y += 6;
  doc.text("---------------------------------------", centerX, y, { align: "center" });

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
  doc.text("------------------------------------", centerX, y, { align: "center" });

  /* ===== ITEMS ===== */
  y += 4;
  doc.text(" Item             Qty     Rate    Amt", 4, y);

  y += 3;
  doc.text("-----------------------------------", centerX, y, { align: "center" });

  let totalQty = 0;

  order.items.forEach(item => {
    totalQty += item.quantity;
    y += 4;
    doc.text(item.name.substring(0, 14), 4, y);
    doc.text(String(item.quantity), 36, y);
    doc.text(String(item.price), 48, y);
    doc.text(String(item.quantity * item.price), 60, y);
  });

  y += 4;
  doc.text("-----------------------------------", centerX, y, { align: "center" });

  /* ===== TOTALS ===== */
  y += 4;
  doc.text(`Total Items: ${order.items.length}`, 4, y); 

  y += 4;
  doc.text(`Total Quantity: ${totalQty}`, 4, y);

  y += 4;
  doc.text("-----------------------------------", centerX, y, { align: "center" });

  y += 6;
  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  doc.text(`TOTAL ${order.totalAmount}`, centerX, y, {
    align: "center",
  });

  /* ===== FOOTER ===== */
  y += 6;
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.text(
    `Payment: ${order.paymentStatus}`,
    centerX,
    y,
    { align: "center" }
  );

  y += 4;
  doc.text(
    config.footerText || "Thank You! Visit Again",
    centerX,
    y,
    { align: "center" }
  );

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

