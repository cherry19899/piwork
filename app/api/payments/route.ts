import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

/**
 * POST /api/payments/approve
 * Called after Pi.createPayment's onReadyForServerApproval callback
 * Validates and approves the payment on Firebase
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentId, metadata } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });
    }

    // Verify payment in Pi SDK (would normally call Pi's verification API)
    const verificationResult = await verifyPaymentWithPi(paymentId);
    if (!verificationResult.valid) {
      return NextResponse.json(
        { error: 'Payment verification failed', details: verificationResult.reason },
        { status: 400 }
      );
    }

    // Lock task in database to prevent duplicate processing
    if (metadata?.task_id) {
      await lockTask(metadata.task_id);
    }

    // Create payment record in Firestore
    const paymentsRef = collection(db, 'payments');
    await addDoc(paymentsRef, {
      paymentId,
      status: 'approved',
      amount: verificationResult.amount,
      metadata,
      approvedAt: Timestamp.now(),
      appVersion: '1.0',
    });

    console.log('[v0] Payment approved:', paymentId);

    return NextResponse.json({
      success: true,
      message: 'Payment approved',
      paymentId,
    });
  } catch (error) {
    console.error('[v0] Payment approval error:', error);

    // Log to Sentry
    if (process.env.SENTRY_DSN) {
      // Sentry.captureException(error);
    }

    return NextResponse.json(
      {
        error: 'Payment approval failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payments/complete
 * Called after Pi.createPayment's onReadyForServerCompletion callback
 * Finalizes the payment and updates task status
 */
export async function PUT(request: NextRequest) {
  try {
    const { paymentId, txid, metadata } = await request.json();

    if (!paymentId || !txid) {
      return NextResponse.json({ error: 'Payment ID and transaction ID required' }, { status: 400 });
    }

    // Verify escrow (check that payment was properly locked)
    const escrowValid = await validateEscrow(paymentId);
    if (!escrowValid) {
      return NextResponse.json({ error: 'Escrow validation failed' }, { status: 400 });
    }

    // Verify transaction with Pi blockchain
    const txnVerified = await verifyTransactionWithPi(txid);
    if (!txnVerified) {
      return NextResponse.json({ error: 'Transaction verification failed' }, { status: 400 });
    }

    // Update payment record
    const paymentQuery = collection(db, 'payments');
    const paymentSnapshot = await getDoc(
      doc(db, 'payments', paymentId)
    ).catch(() => null);

    if (paymentSnapshot?.exists()) {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'completed',
        txid,
        completedAt: Timestamp.now(),
      });
    }

    // Update task status to 'in-progress' if applicable
    if (metadata?.task_id) {
      await updateTaskStatus(metadata.task_id, 'in-progress', metadata);
    }

    // Record transaction for analytics
    await recordTransaction({
      paymentId,
      txid,
      metadata,
      status: 'completed',
      timestamp: new Date(),
    });

    console.log('[v0] Payment completed:', { paymentId, txid });

    return NextResponse.json({
      success: true,
      message: 'Payment completed',
      paymentId,
      txid,
    });
  } catch (error) {
    console.error('[v0] Payment completion error:', error);

    return NextResponse.json(
      {
        error: 'Payment completion failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Helper: Verify payment with Pi Network (mocked for demo)
 */
async function verifyPaymentWithPi(paymentId: string) {
  try {
    // In production: call Pi SDK verification API
    // For now: check if payment exists in our records
    const paymentRef = doc(db, 'payments', paymentId);
    const paymentSnap = await getDoc(paymentRef);

    if (!paymentSnap.exists()) {
      return { valid: false, reason: 'Payment not found' };
    }

    const payment = paymentSnap.data();
    return {
      valid: true,
      amount: payment.amount,
    };
  } catch (error) {
    console.error('[v0] Pi verification error:', error);
    return { valid: false, reason: 'Verification error' };
  }
}

/**
 * Helper: Lock task during payment processing
 */
async function lockTask(taskId: string) {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      locked: true,
      lockedAt: Timestamp.now(),
      lockReason: 'payment_processing',
    });
    console.log('[v0] Task locked:', taskId);
  } catch (error) {
    console.error('[v0] Error locking task:', error);
    throw error;
  }
}

/**
 * Helper: Validate escrow
 */
async function validateEscrow(paymentId: string): Promise<boolean> {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    const paymentSnap = await getDoc(paymentRef);

    if (!paymentSnap.exists()) {
      return false;
    }

    const payment = paymentSnap.data();
    // Check if payment was locked and approved
    return payment.status === 'approved' && payment.locked !== false;
  } catch (error) {
    console.error('[v0] Escrow validation error:', error);
    return false;
  }
}

/**
 * Helper: Verify transaction with Pi blockchain
 */
async function verifyTransactionWithPi(txid: string): Promise<boolean> {
  try {
    // In production: verify transaction on Pi blockchain
    // For now: basic validation
    return txid.length > 0 && /^[a-zA-Z0-9_-]+$/.test(txid);
  } catch (error) {
    console.error('[v0] Transaction verification error:', error);
    return false;
  }
}

/**
 * Helper: Update task status after payment completion
 */
async function updateTaskStatus(
  taskId: string,
  status: string,
  metadata: any
) {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      status,
      paymentId: metadata?.paymentId,
      locked: false,
      updatedAt: Timestamp.now(),
    });
    console.log('[v0] Task status updated:', taskId, status);
  } catch (error) {
    console.error('[v0] Error updating task status:', error);
    throw error;
  }
}

/**
 * Helper: Record transaction for analytics
 */
async function recordTransaction(txData: any) {
  try {
    const transactionsRef = collection(db, 'transactions');
    await addDoc(transactionsRef, {
      ...txData,
      recordedAt: Timestamp.now(),
    });
    console.log('[v0] Transaction recorded:', txData.txid);
  } catch (error) {
    console.error('[v0] Error recording transaction:', error);
    // Don't throw - transaction recording shouldn't block payment completion
  }
}
