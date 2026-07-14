import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to convert number to Indian currency words
function numberToWords(num) {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  const parts = parseFloat(num).toFixed(2).split('.');
  const integerPart = parseInt(parts[0], 10);
  const decimalPart = parseInt(parts[1], 10);
  
  let words = helper(integerPart) + ' Rupees';
  
  if (decimalPart > 0) {
    words += ' and ' + helper(decimalPart) + ' Paise';
  }
  
  return words + ' Only';
  
  function helper(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + helper(n % 100) : '');
    if (n < 100000) return helper(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + helper(n % 1000) : '');
    if (n < 10000000) return helper(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + helper(n % 100000) : '');
    return helper(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + helper(n % 10000000) : '');
  }
}

// Format Date helper
function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');
}

// Function to generate the Invoice PDF
export const downloadInvoicePDF = (order) => {
  if (!order) return;

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.width; // A4 is 210mm
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2); // 182mm
    let currentY = 15;

    // --- 1. HEADER SECTION ---
    // Title Left: UK German Pharmaceuticals
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(104, 23, 27); // Brand color #68171b
    doc.text('UK German Pharmaceuticals', margin, currentY);

    // Title Right: Tax Invoice/Bill of Supply
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(33, 33, 33);
    doc.text('Tax Invoice/Bill of Supply/Cash Memo', pageWidth - margin, currentY, { align: 'right' });
    currentY += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text('(Original for Recipient)', pageWidth - margin, currentY, { align: 'right' });
    currentY += 8;

    // Horizontal line separator
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 6;

    // --- 2. ADDRESSES SECTION (Sold By / Billing / Shipping) ---
    // Detect if customer state is Punjab for GST calculation
    const custAddress = (order.address || '').toLowerCase();
    const custState = (order.shippingAddress?.state || '').toLowerCase();
    const isPunjab = custAddress.includes('punjab') || custState.includes('punjab');

    const soldByText = [
      'UK German Pharmaceuticals',
      'Akal Academy Road, Opp. PUNJAB Gramin Bank,',
      'Cheema Mandi - 148029,',
      'Distt. Sangrur (Punjab) India',
      'PAN No: AKBPK9732C',
      'GST Registration No: 03AKBPK9732C1ZK'
    ];

    const billingAddress = [
      order.name || order.userName || 'N/A',
      order.shippingAddress?.line1 || order.address || 'N/A',
      order.shippingAddress?.line2 || '',
      `${order.shippingAddress?.city || ''}${order.shippingAddress?.state ? ', ' + order.shippingAddress.state : ''} ${order.shippingAddress?.zipcode || ''}`,
      order.shippingAddress?.country || 'India',
      `Phone: ${order.phone || 'N/A'}`,
      `Email: ${order.email || order.userEmail || 'N/A'}`,
      `State/UT Code: ${isPunjab ? '03 (Punjab)' : 'Other'}`
    ].filter(line => line !== null && line !== '');

    const leftColX = margin;
    const rightColX = pageWidth / 2 + 5;
    const colWidth = (pageWidth / 2) - margin - 5;

    // Sold By block (Left Column)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(33, 33, 33);
    doc.text('Sold By :', leftColX, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    let tempY = currentY + 4;
    soldByText.forEach(line => {
      doc.text(line, leftColX, tempY);
      tempY += 3.8;
    });

    // Billing / Shipping block (Right Column)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(33, 33, 33);
    doc.text('Billing & Shipping Address :', rightColX, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    let rightTempY = currentY + 4;
    billingAddress.forEach(line => {
      // Handle word wrapping for long customer addresses
      const lines = doc.splitTextToSize(line, colWidth);
      lines.forEach(wrappedLine => {
        doc.text(wrappedLine, rightColX, rightTempY);
        rightTempY += 3.8;
      });
    });

    currentY = Math.max(tempY, rightTempY) + 4;

    // Separator line
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 6;

    // --- 3. ORDER / INVOICE METADATA ---
    const orderDisplayId = order.orderId || `BSK-O-${String(order._id || '').slice(-8).toUpperCase()}`;
    const invoiceNo = `INV-BSK-${String(order._id || '').slice(-6).toUpperCase()}`;
    const orderDate = formatDate(order.createdAt);
    const payStatus = order.paymentInfo?.status === 'captured' || order.paymentInfo?.status === 'cod' ? 'Paid' : 'Unpaid';
    
    // Order/Invoice Info block
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);

    // Metadata Left Column
    doc.text(`Order Number: ${orderDisplayId}`, leftColX, currentY);
    doc.text(`Order Date: ${orderDate}`, leftColX, currentY + 4.5);
    doc.text(`Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}`, leftColX, currentY + 9);

    // Metadata Right Column
    doc.text(`Invoice Number: ${invoiceNo}`, rightColX, currentY);
    doc.text(`Invoice Date: ${orderDate}`, rightColX, currentY + 4.5);
    doc.text(`Payment Status: ${payStatus}`, rightColX, currentY + 9);

    currentY += 15;

    // --- 4. PRODUCTS TABLE ---
    const tableColumns = [
      { header: 'SL\nNo', dataKey: 'sl' },
      { header: 'Description', dataKey: 'desc' },
      { header: 'Unit Price\n(Rs.)', dataKey: 'unit' },
      { header: 'Qty', dataKey: 'qty' },
      { header: 'Net Amt\n(Rs.)', dataKey: 'net' },
      { header: 'Tax\nRate', dataKey: 'taxRate' },
      { header: 'Tax\nType', dataKey: 'taxType' },
      { header: 'Tax Amt\n(Rs.)', dataKey: 'taxVal' },
      { header: 'Total\n(Rs.)', dataKey: 'total' }
    ];

    const tableRows = [];
    let grandSubtotal = 0;
    let grandTax = 0;
    let grandTotal = 0;

    // Populate order items
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item, index) => {
        const itemQty = item.quantity || 1;
        const itemPrice = item.price || 0; // Inclusive of GST
        const rowTotal = itemPrice * itemQty;
        
        // standard 12% GST calculation
        const netPrice = itemPrice / 1.12;
        const netAmount = netPrice * itemQty;
        const taxAmount = rowTotal - netAmount;
        
        grandSubtotal += netAmount;
        grandTax += taxAmount;
        grandTotal += rowTotal;

        tableRows.push({
          sl: index + 1,
          desc: item.name || 'Unknown Product',
          unit: netPrice.toFixed(2),
          qty: itemQty,
          net: netAmount.toFixed(2),
          taxRate: '12%',
          taxType: isPunjab ? 'CGST(6%)\nSGST(6%)' : 'IGST(12%)',
          taxVal: taxAmount.toFixed(2),
          total: rowTotal.toFixed(2)
        });
      });
    }

    // Add COD charge if applicable
    if (order.paymentMethod === 'cod' && order.codCharge && order.codCharge > 0) {
      const codTotal = order.codCharge;
      const codNet = codTotal / 1.12;
      const codTax = codTotal - codNet;

      grandSubtotal += codNet;
      grandTax += codTax;
      grandTotal += codTotal;

      tableRows.push({
        sl: tableRows.length + 1,
        desc: 'Cash On Delivery (COD) Charges',
        unit: codNet.toFixed(2),
        qty: 1,
        net: codNet.toFixed(2),
        taxRate: '12%',
        taxType: isPunjab ? 'CGST(6%)\nSGST(6%)' : 'IGST(12%)',
        taxVal: codTax.toFixed(2),
        total: codTotal.toFixed(2)
      });
    }

    // Create the Table using autoTable
    autoTable(doc, {
      startY: currentY,
      columns: tableColumns,
      body: tableRows,
      theme: 'grid',
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [33, 33, 33],
        fontStyle: 'bold',
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      columnStyles: {
        sl: { cellWidth: 8, halign: 'center' },
        desc: { cellWidth: 54 },
        unit: { cellWidth: 18, halign: 'right' },
        qty: { cellWidth: 10, halign: 'center' },
        net: { cellWidth: 18, halign: 'right' },
        taxRate: { cellWidth: 14, halign: 'center' },
        taxType: { cellWidth: 20, halign: 'center' },
        taxVal: { cellWidth: 18, halign: 'right' },
        total: { cellWidth: 22, halign: 'right' }
      },
      didDrawPage: (data) => {
        currentY = data.cursor.y + 4;
      }
    });

    // Safeguard currentY check (in case table wraps pages)
    if (currentY > doc.internal.pageSize.height - 60) {
      doc.addPage();
      currentY = 20;
    }

    // --- 5. TOTALS SECTION ---
    // Left Box: Amount in Words
    // Right Box: Summary Totals
    const totalBoxWidth = contentWidth / 2;

    // Left block - Amount in Words
    doc.setDrawColor(210, 210, 210);
    doc.rect(margin, currentY, totalBoxWidth - 2, 22);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(33, 33, 33);
    doc.text('Amount in Words:', margin + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    const wordsText = numberToWords(order.totalAmount || grandTotal);
    const wrappedWords = doc.splitTextToSize(wordsText, totalBoxWidth - 8);
    let wordsY = currentY + 9;
    wrappedWords.forEach(wLine => {
      doc.text(wLine, margin + 3, wordsY);
      wordsY += 3.8;
    });

    // Right block - Table of Summary Totals
    const rightBoxX = margin + totalBoxWidth + 2;
    doc.rect(rightBoxX, currentY, totalBoxWidth - 2, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    
    doc.text('Net Subtotal:', rightBoxX + 3, currentY + 5);
    doc.text(`Rs. ${grandSubtotal.toFixed(2)}`, pageWidth - margin - 3, currentY + 5, { align: 'right' });

    doc.text('GST Tax Amount:', rightBoxX + 3, currentY + 10);
    doc.text(`Rs. ${grandTax.toFixed(2)}`, pageWidth - margin - 3, currentY + 10, { align: 'right' });

    // Summary divider line
    doc.setDrawColor(220, 220, 220);
    doc.line(rightBoxX, currentY + 13.5, pageWidth - margin, currentY + 13.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(33, 33, 33);
    doc.text('Grand Total:', rightBoxX + 3, currentY + 18.5);
    doc.text(`Rs. ${parseFloat(order.totalAmount || grandTotal).toFixed(2)}`, pageWidth - margin - 3, currentY + 18.5, { align: 'right' });

    currentY += 28;

    // --- 6. SIGNATURE & FOOTER ---
    if (currentY > doc.internal.pageSize.height - 45) {
      doc.addPage();
      currentY = 20;
    }

    // Tax payable under reverse charge note
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text('Whether tax is payable under reverse charge - No', margin, currentY + 6);

    // Signature Area
    const sigX = pageWidth - margin - 50;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(33, 33, 33);
    doc.text('For UK German Pharmaceuticals:', sigX, currentY);

    // Placeholder signature space
    doc.setDrawColor(225, 225, 225);
    doc.rect(sigX, currentY + 2.5, 45, 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text('Authorized Signatory', sigX + 11, currentY + 18.5);

    currentY += 24;

    // Footer copyright message
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text('This is a computer-generated tax invoice. No physical signature is required.', pageWidth / 2, currentY, { align: 'center' });

    // Save the PDF
    doc.save(`Invoice_${orderDisplayId}.pdf`);
  } catch (error) {
    console.error('Error generating PDF invoice:', error);
  }
};
