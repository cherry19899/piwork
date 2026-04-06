'use client';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

/**
 * POST /api/tasks/unlock
 * Unlocks a task if payment is cancelled or encounters an error
 */
export async function POST(request: NextRequest) {
  try {
    const { taskId } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      locked: false,
      unlockedAt: Timestamp.now(),
      lockReason: null,
    });

    console.log('[v0] Task unlocked:', taskId);

    return NextResponse.json({
      success: true,
      message: 'Task unlocked',
      taskId,
    });
  } catch (error) {
    console.error('[v0] Error unlocking task:', error);

    return NextResponse.json(
      {
        error: 'Failed to unlock task',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
