'use client';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * GET /api/payments/validate-escrow
 * Validates that a payment's escrow is properly locked and ready for completion
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });
    }

    const paymentRef = doc(db, 'payments', paymentId);
    const paymentSnap = await getDoc(paymentRef);

    if (!paymentSnap.exists()) {
      return NextResponse.json(
        { valid: false, reason: 'Payment not found' },
        { status: 404 }
      );
    }

    const payment = paymentSnap.data();

    // Validate escrow requirements
    const isValid =
      payment.status === 'approved' &&
      payment.locked === true &&
      payment.amount > 0 &&
      payment.approvedAt;

    if (!isValid) {
      return NextResponse.json({
        valid: false,
        reason: 'Escrow validation failed',
        details: {
          status: payment.status,
          locked: payment.locked,
          hasAmount: payment.amount > 0,
          hasApprovalTime: !!payment.approvedAt,
        },
      });
    }

    return NextResponse.json({
      valid: true,
      paymentId,
      amount: payment.amount,
      approvedAt: payment.approvedAt,
    });
  } catch (error) {
    console.error('[v0] Escrow validation error:', error);

    return NextResponse.json(
      {
        valid: false,
        error: 'Validation error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
