import { NextRequest, NextResponse } from 'next/server';
import { deletePengeluaran } from '@/lib/database';
import pool from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Update status pengeluaran
    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE pengeluaran SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Pengeluaran not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: 'Pengeluaran status updated successfully', data: result.rows[0] },
        { status: 200 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating pengeluaran status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const result = await deletePengeluaran(id);
    
    if (result) {
      return NextResponse.json(
        { message: 'Pengeluaran deleted successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to delete pengeluaran' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting pengeluaran:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}