import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dari = searchParams.get('dari') || '2024-01-01';
    const sampai = searchParams.get('sampai') || new Date().toISOString().split('T')[0];

    const client = await pool.connect();

    try {
      // Get laporan data
      const [
        zakatFitrahResult,
        zakatMalResult,
        kasResult,
        pengeluaranResult
      ] = await Promise.all([
        client.query(`
          SELECT 
            COUNT(*) as count,
            COALESCE(SUM(total_rupiah), 0) as total_uang
          FROM zakat_fitrah 
          WHERE tanggal_bayar BETWEEN $1 AND $2
        `, [dari, sampai]),
        client.query(`
          SELECT 
            COUNT(*) as count,
            COALESCE(SUM(jumlah_zakat), 0) as total
          FROM zakat_mal 
          WHERE tanggal_bayar BETWEEN $1 AND $2
        `, [dari, sampai]),
        client.query(`
          SELECT 
            COALESCE(SUM(CASE WHEN jenis_transaksi = 'masuk' THEN jumlah ELSE 0 END), 0) as pemasukan,
            COALESCE(SUM(CASE WHEN jenis_transaksi = 'keluar' THEN jumlah ELSE 0 END), 0) as pengeluaran
          FROM kas_harian 
          WHERE tanggal BETWEEN $1 AND $2
        `, [dari, sampai]),
        client.query(`
          SELECT 
            COALESCE(SUM(jumlah), 0) as total_pengeluaran
          FROM pengeluaran 
          WHERE tanggal BETWEEN $1 AND $2
        `, [dari, sampai])
      ]);

      const zakatFitrah = zakatFitrahResult.rows[0];
      const zakatMal = zakatMalResult.rows[0];
      const kas = kasResult.rows[0];
      const pengeluaran = pengeluaranResult.rows[0];

      // Create PDF
      const doc = new jsPDF();
      
      // Helper function to format currency
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(amount);
      };

      // Helper function to format date
      const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      // Helper function to draw table
      const drawTable = (x: number, y: number, data: string[][], colWidths: number[]) => {
        const rowHeight = 8;
        let currentY = y;
        
        // Draw header
        doc.setFillColor(240, 240, 240);
        doc.rect(x, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        let currentX = x;
        for (let i = 0; i < data[0].length; i++) {
          doc.text(data[0][i], currentX + 2, currentY + 5);
          currentX += colWidths[i];
        }
        currentY += rowHeight;
        
        // Draw rows
        doc.setFont('helvetica', 'normal');
        for (let i = 1; i < data.length; i++) {
          currentX = x;
          for (let j = 0; j < data[i].length; j++) {
            doc.text(data[i][j], currentX + 2, currentY + 5);
            currentX += colWidths[j];
          }
          currentY += rowHeight;
        }
        
        // Draw borders
        const tableWidth = colWidths.reduce((a, b) => a + b, 0);
        const tableHeight = rowHeight * data.length;
        
        // Outer border
        doc.rect(x, y, tableWidth, tableHeight);
        
        // Horizontal lines
        for (let i = 1; i < data.length; i++) {
          doc.line(x, y + i * rowHeight, x + tableWidth, y + i * rowHeight);
        }
        
        // Vertical lines
        currentX = x;
        for (let i = 0; i < colWidths.length - 1; i++) {
          currentX += colWidths[i];
          doc.line(currentX, y, currentX, y + tableHeight);
        }
        
        return currentY + 5;
      };

      // Set font
      doc.setFont('helvetica');

      // Title
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('LAPORAN ZAKAT DAN KEUANGAN', 105, 30, { align: 'center' });
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Periode: ${formatDate(dari)} - ${formatDate(sampai)}`, 105, 40, { align: 'center' });

      // Line separator
      doc.setLineWidth(0.5);
      doc.line(20, 50, 190, 50);

      let yPosition = 65;

      // Zakat Fitrah Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 0);
      doc.text('ZAKAT FITRAH', 20, yPosition);
      yPosition += 10;

      const zakatFitrahData = [
        ['Keterangan', 'Jumlah'],
        ['Jumlah Muzakki', `${parseInt(zakatFitrah.count)} orang`],
        ['Total Zakat Fitrah', formatCurrency(parseFloat(zakatFitrah.total_uang) || 0)]
      ];
      
      yPosition = drawTable(20, yPosition, zakatFitrahData, [120, 60]);
      yPosition += 10;

      // Zakat Mal Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 0);
      doc.text('ZAKAT MAL', 20, yPosition);
      yPosition += 10;

      const zakatMalData = [
        ['Keterangan', 'Jumlah'],
        ['Jumlah Muzakki', `${parseInt(zakatMal.count)} orang`],
        ['Total Zakat Mal', formatCurrency(parseFloat(zakatMal.total) || 0)]
      ];
      
      yPosition = drawTable(20, yPosition, zakatMalData, [120, 60]);
      yPosition += 10;

      // Kas Harian Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 0);
      doc.text('KAS HARIAN', 20, yPosition);
      yPosition += 10;

      const totalPemasukan = parseFloat(kas.pemasukan) || 0;
      const totalPengeluaranKas = parseFloat(kas.pengeluaran) || 0;
      const saldoKas = totalPemasukan - totalPengeluaranKas;

      const kasData = [
        ['Keterangan', 'Jumlah'],
        ['Total Pemasukan', formatCurrency(totalPemasukan)],
        ['Total Pengeluaran', formatCurrency(totalPengeluaranKas)],
        ['Saldo Kas', formatCurrency(saldoKas)]
      ];
      
      yPosition = drawTable(20, yPosition, kasData, [120, 60]);
      yPosition += 10;

      // Pengeluaran Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 0);
      doc.text('PENGELUARAN', 20, yPosition);
      yPosition += 10;

      const pengeluaranData = [
        ['Keterangan', 'Jumlah'],
        ['Total Pengeluaran', formatCurrency(parseFloat(pengeluaran.total_pengeluaran) || 0)]
      ];
      
      yPosition = drawTable(20, yPosition, pengeluaranData, [120, 60]);
      yPosition += 15;

      // Summary Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 150);
      doc.text('RINGKASAN KEUANGAN', 20, yPosition);
      yPosition += 10;

      const totalZakat = (parseFloat(zakatFitrah.total_uang) || 0) + (parseFloat(zakatMal.total) || 0);
      const totalSemua = totalZakat + totalPemasukan;
      const totalKeluarSemua = totalPengeluaranKas + (parseFloat(pengeluaran.total_pengeluaran) || 0);
      const saldoAkhir = totalSemua - totalKeluarSemua;

      const summaryData = [
        ['Keterangan', 'Jumlah'],
        ['Total Zakat (Fitrah + Mal)', formatCurrency(totalZakat)],
        ['Total Pemasukan Lainnya', formatCurrency(totalPemasukan)],
        ['Total Pemasukan Keseluruhan', formatCurrency(totalSemua)],
        ['Total Pengeluaran Keseluruhan', formatCurrency(totalKeluarSemua)],
        ['Saldo Akhir', formatCurrency(saldoAkhir)]
      ];
      
      yPosition = drawTable(20, yPosition, summaryData, [120, 60]);

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128, 128, 128);
      doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 20, pageHeight - 20);
      doc.text('Sistem Manajemen Zakat', 190, pageHeight - 20, { align: 'right' });

      // Generate PDF buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

      // Return PDF response
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="laporan-zakat-${dari}-${sampai}.pdf"`,
          'Content-Length': pdfBuffer.length.toString(),
        },
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Gagal menghasilkan PDF laporan' },
      { status: 500 }
    );
  }
}