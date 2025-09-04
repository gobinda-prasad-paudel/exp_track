import { Transaction } from "@shared/schema";

export async function generateTransactionsPDF(transactions: Transaction[], userStats: any) {
  // Using jsPDF for PDF generation
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  
  // Set font
  doc.setFontSize(20);
  doc.text('Transaction Report', 20, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  
  // Add summary
  doc.setFontSize(14);
  doc.text('Summary', 20, 50);
  doc.setFontSize(10);
  doc.text(`Total Income: रु. ${userStats.totalIncome.toLocaleString()}`, 20, 60);
  doc.text(`Total Expenses: रु. ${userStats.totalExpenses.toLocaleString()}`, 20, 70);
  doc.text(`Total Balance: रु. ${userStats.totalBalance.toLocaleString()}`, 20, 80);
  doc.text(`Total Transactions: ${userStats.totalTransactions}`, 20, 90);
  
  // Add transactions table
  doc.setFontSize(14);
  doc.text('Transactions', 20, 110);
  
  let yPosition = 125;
  doc.setFontSize(8);
  
  // Table headers
  doc.text('Date', 20, yPosition);
  doc.text('Type', 50, yPosition);
  doc.text('Category', 80, yPosition);
  doc.text('Description', 120, yPosition);
  doc.text('Amount', 170, yPosition);
  
  yPosition += 10;
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  sortedTransactions.forEach((transaction, index) => {
    if (yPosition > 280) { // Start new page if needed
      doc.addPage();
      yPosition = 20;
    }
    
    const date = new Date(transaction.date).toLocaleDateString();
    const type = transaction.type === 'income' ? 'Income' : 'Expense';
    const category = transaction.category;
    const description = transaction.description || '-';
    const amount = `रु. ${transaction.amount.toLocaleString()}`;
    
    doc.text(date, 20, yPosition);
    doc.text(type, 50, yPosition);
    doc.text(category.substring(0, 15), 80, yPosition);
    doc.text(description.substring(0, 20), 120, yPosition);
    doc.text(amount, 170, yPosition);
    
    yPosition += 8;
  });
  
  return doc;
}

export function downloadPDF(doc: any, filename: string = 'transactions.pdf') {
  doc.save(filename);
}
