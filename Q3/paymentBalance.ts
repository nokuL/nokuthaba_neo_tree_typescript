// a) What goes wrong when two payments for the same patient happen at the same time:
//    The  code copies the balance, waits for the payment to save, then adds the amount
//    to that old copy. While it waits, the second payment also copies the SAME old balance.
//    Both add their amount to the old balance, and whichever finishes last overwrites the other.
//    Example: balance is $100, payments of $20 and $30 arrive together.
//    The balance should be $150, but it ends up $120 or $130 - one payment is lost.

export interface DB {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }>;
}

export type User = { id: number; balance: number };

export async function addPayment(db: DB, user: User, amountCents: number): Promise<number> {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("amount must be a positive whole number of cents");
  }

  await savePayment(db, user.id, amountCents);

  user.balance += amountCents;
  return user.balance;
}

async function savePayment(db: DB, userId: number, amountCents: number): Promise<void> {
  const result = await db.query(
    `WITH updated AS (
       UPDATE users SET balance_cents = balance_cents + $1 WHERE id = $2 RETURNING id
     ),
     saved AS (
       INSERT INTO payments (user_id, amount_cents) SELECT id, $1 FROM updated
     )
     SELECT id FROM updated`,
    [amountCents, userId],
  );
  if (result.rowCount === 0) {
    throw new Error(`user ${userId} not found`);
  }
}
