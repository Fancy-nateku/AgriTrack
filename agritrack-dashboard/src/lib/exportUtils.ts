import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export Utilities
 * 
 * Functions for exporting data to various formats (CSV, Excel, PDF)
 */

// ============================================
// CSV Export Functions
// ============================================

export interface ExportData {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Convert array of objects to CSV string
 */
function convertToCSV(data: ExportData[], headers?: string[]): string {
  if (data.length === 0) return '';

  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = csvHeaders.join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      // Handle values that might contain commas or quotes
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file
 */
function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to CSV file
 */
export function exportToCSV(data: ExportData[], filename: string, headers?: string[]): void {
  const csvContent = convertToCSV(data, headers);
  downloadCSV(csvContent, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

// ============================================
// Excel Export Functions
// ============================================

/**
 * Export data to Excel file
 */
export function exportToExcel(data: ExportData[], filename: string, sheetName: string = 'Sheet1'): void {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Generate Excel file and trigger download
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

// ============================================
// PDF Export Functions
// ============================================

export interface PDFTableColumn {
  header: string;
  dataKey: string;
}

export interface PDFExportOptions {
  title?: string;
  subtitle?: string;
  orientation?: 'portrait' | 'landscape';
  columns: PDFTableColumn[];
  data: ExportData[];
  filename: string;
}

/**
 * Export data to PDF file with table
 */
export function exportToPDF(options: PDFExportOptions): void {
  const { title, subtitle, orientation = 'portrait', columns, data, filename } = options;
  
  // Create new PDF document
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });
  
  let yPosition = 15;
  
  // Add title
  if (title) {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, yPosition);
    yPosition += 10;
  }
  
  // Add subtitle
  if (subtitle) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, 14, yPosition);
    yPosition += 10;
  }
  
  // Add table
  autoTable(doc, {
    startY: yPosition,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => {
      const value = row[col.dataKey];
      return value !== null && value !== undefined ? String(value) : '';
    })),
    theme: 'grid',
    headStyles: {
      fillColor: [34, 197, 94], // Green color
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });
  
  // Save PDF
  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

// ============================================
// Specialized Export Functions for AgriTrack
// ============================================

import type { ExpenseClient, IncomeClient } from '@/types/database';

// Re-export for backward compatibility
export type Expense = ExpenseClient;
export type Income = IncomeClient;


/**
 * Export expenses to CSV
 */
export function exportExpensesToCSV(expenses: Expense[]): void {
  const formattedData = expenses.map(expense => ({
    Date: new Date(expense.date).toLocaleDateString(),
    Category: expense.category,
    Description: expense.description || '',
    Amount: `KES ${Number(expense.amount).toLocaleString()}`,
  }));
  
  const filename = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(formattedData, filename);
}

/**
 * Export income to CSV
 */
export function exportIncomeToCSV(income: Income[]): void {
  const formattedData = income.map(inc => ({
    Date: new Date(inc.date).toLocaleDateString(),
    Source: inc.source,
    Description: inc.description || '',
    Amount: `KES ${Number(inc.amount).toLocaleString()}`,
  }));
  
  const filename = `income_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(formattedData, filename);
}

/**
 * Export expenses to PDF
 */
export function exportExpensesToPDF(expenses: Expense[]): void {
  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  
  exportToPDF({
    title: 'Expense Report',
    subtitle: `Generated on ${new Date().toLocaleDateString()} | Total: KES ${totalAmount.toLocaleString()}`,
    orientation: 'portrait',
    columns: [
      { header: 'Date', dataKey: 'date' },
      { header: 'Category', dataKey: 'category' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Amount (KES)', dataKey: 'amount' },
    ],
    data: expenses.map(exp => ({
      date: new Date(exp.date).toLocaleDateString(),
      category: exp.category,
      description: exp.description || '-',
      amount: Number(exp.amount).toLocaleString(),
    })),
    filename: `expense_report_${new Date().toISOString().split('T')[0]}.pdf`,
  });
}

/**
 * Export income to PDF
 */
export function exportIncomeToPDF(income: Income[]): void {
  const totalAmount = income.reduce((sum, inc) => sum + Number(inc.amount), 0);
  
  exportToPDF({
    title: 'Income Report',
    subtitle: `Generated on ${new Date().toLocaleDateString()} | Total: KES ${totalAmount.toLocaleString()}`,
    orientation: 'portrait',
    columns: [
      { header: 'Date', dataKey: 'date' },
      { header: 'Source', dataKey: 'source' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Amount (KES)', dataKey: 'amount' },
    ],
    data: income.map(inc => ({
      date: new Date(inc.date).toLocaleDateString(),
      source: inc.source,
      description: inc.description || '-',
      amount: Number(inc.amount).toLocaleString(),
    })),
    filename: `income_report_${new Date().toISOString().split('T')[0]}.pdf`,
  });
}

/**
 * Export financial summary to PDF (combined income and expenses)
 */
export function exportFinancialSummaryToPDF(
  expenses: Expense[],
  income: Income[],
  period: string = 'All Time'
): void {
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalIncome = income.reduce((sum, inc) => sum + Number(inc.amount), 0);
  const netProfit = totalIncome - totalExpenses;
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Summary Report', 14, 20);
  
  // Period and date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Period: ${period}`, 14, 30);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37);
  
  // Summary box
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, 50);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Income:`, 14, 58);
  doc.text(`KES ${totalIncome.toLocaleString()}`, 60, 58);
  
  doc.text(`Total Expenses:`, 14, 65);
  doc.text(`KES ${totalExpenses.toLocaleString()}`, 60, 65);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Net Profit:`, 14, 72);
  doc.setTextColor(netProfit >= 0 ? 34 : 220, netProfit >= 0 ? 197 : 38, netProfit >= 0 ? 94 : 38);
  doc.text(`KES ${netProfit.toLocaleString()}`, 60, 72);
  doc.setTextColor(0, 0, 0);
  
  // Expenses table
  if (expenses.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Recent Expenses', 14, 85);
    
    autoTable(doc, {
      startY: 90,
      head: [['Date', 'Category', 'Amount (KES)']],
      body: expenses.slice(0, 10).map(exp => [
        new Date(exp.date).toLocaleDateString(),
        exp.category,
        Number(exp.amount).toLocaleString(),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] },
    });
  }
  
  // Income table
  if (income.length > 0) {
    // Type guard for jsPDF with autoTable plugin
    interface JsPDFWithAutoTable extends jsPDF {
      lastAutoTable?: { finalY: number };
    }
    const finalY = (doc as JsPDFWithAutoTable).lastAutoTable?.finalY || 90;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Recent Income', 14, finalY + 15);
    
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Date', 'Source', 'Amount (KES)']],
      body: income.slice(0, 10).map(inc => [
        new Date(inc.date).toLocaleDateString(),
        inc.source,
        Number(inc.amount).toLocaleString(),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
    });
  }
  
  doc.save(`financial_summary_${new Date().toISOString().split('T')[0]}.pdf`);
}
