import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { config } from "../config.js";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function safeFileNamePart(value) {
  return String(value || "report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function addSectionTitle(doc, title) {
  doc.moveDown().font("Helvetica-Bold").fontSize(13).fillColor("#0a3154").text(title);
  doc.moveDown(0.5);
}

function addKeyValue(doc, label, value) {
  doc.font("Helvetica-Bold").fillColor("#16212b").text(label, { continued: true });
  doc.font("Helvetica").fillColor("#16212b").text(` ${value ?? "-"}`);
}

function writePayeResult(doc, result) {
  addSectionTitle(doc, "PAYE Estimate");
  addKeyValue(doc, "Annual income:", formatCurrency(result?.annualIncome));
  addKeyValue(doc, "Total deductions:", formatCurrency(result?.totalDeductions));
  addKeyValue(doc, "Taxable income:", formatCurrency(result?.taxableIncome));
  addKeyValue(doc, "Annual tax:", formatCurrency(result?.annualTax));
  addKeyValue(doc, "Monthly PAYE:", formatCurrency(result?.monthlyTax));
  addKeyValue(doc, "Minimum wage exemption:", result?.isMinimumWageExempt ? "Applied" : "Not applied");
}

function writeCompanyResult(doc, result) {
  addSectionTitle(doc, "Company Tax Estimate");
  addKeyValue(doc, "Classification:", result?.classification || "-");
  addKeyValue(doc, "Annual turnover:", formatCurrency(result?.annualTurnover));
  addKeyValue(doc, "Assessable profit:", formatCurrency(result?.assessableProfit));
  addKeyValue(doc, "Taxable profit:", formatCurrency(result?.taxableProfit));
  addKeyValue(doc, "Company income tax:", formatCurrency(result?.companyIncomeTax));
  addKeyValue(doc, "Development levy:", formatCurrency(result?.developmentLevy));
  addKeyValue(doc, "Minimum tax:", formatCurrency(result?.minimumTax));
  addKeyValue(doc, "Global top-up tax:", formatCurrency(result?.globalMinimumTopUpTax));
  addKeyValue(doc, "Total estimated tax:", formatCurrency(result?.totalEstimatedTax));
  if (result?.note) {
    doc.moveDown(0.5).font("Helvetica").fillColor("#41586c").text(result.note);
  }
}

function writeOrderSummary(doc, record) {
  addSectionTitle(doc, "Order Summary");
  addKeyValue(doc, "Buyer:", record.name);
  addKeyValue(doc, "Email:", record.email);
  addKeyValue(doc, "Company:", record.companyName || "-");
  addKeyValue(doc, "Reference:", record.paymentReference || "-");
  addKeyValue(doc, "Amount paid:", `${record.currency || "NGN"} ${Number(record.amount || 0).toLocaleString()}`);
  addKeyValue(doc, "Paid at:", formatDateTime(record.paidAt));
  addKeyValue(doc, "Report scope:", record.reportScope || "Reviewed PDF summary");
  addKeyValue(doc, "Requested use case:", record.taxUseCase || "-");
  if (record.message) {
    doc.moveDown(0.5).font("Helvetica-Bold").fillColor("#16212b").text("Notes from buyer:");
    doc.font("Helvetica").fillColor("#41586c").text(record.message);
  }
}

export async function generatePaidPdfReport(record) {
  await fsp.mkdir(config.reportStorageDir, { recursive: true });

  const kind = record?.context?.kind || (String(record.calculationType || "").toLowerCase().includes("company") ? "company" : "paye");
  const fileName = `${safeFileNamePart(record.name)}-${safeFileNamePart(record.paymentReference || record._id)}.pdf`;
  const fullPath = path.join(config.reportStorageDir, fileName);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48 });
    const stream = fs.createWriteStream(fullPath);

    doc.pipe(stream);

    doc.font("Helvetica-Bold").fontSize(22).fillColor("#0a3154").text("Naija Tax Calculator");
    doc.font("Helvetica").fontSize(11).fillColor("#41586c").text("Paid PDF tax report");
    doc.moveDown();

    writeOrderSummary(doc, record);

    if (kind === "company") {
      writeCompanyResult(doc, record?.context?.result || {});
    } else {
      writePayeResult(doc, record?.context?.result || {});
    }

    addSectionTitle(doc, "Important Notice");
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#41586c")
      .text(
        "This report is an estimate generated from the values supplied to the calculator. Confirm the final filing position with the applicable tax authority or a licensed adviser before relying on it for compliance."
      );

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return {
    fileName,
    filePath: fullPath
  };
}

export async function hasGeneratedReport(record) {
  if (!record?.generatedFilePath) {
    return false;
  }

  try {
    await fsp.access(record.generatedFilePath);
    return true;
  } catch (_error) {
    return false;
  }
}
