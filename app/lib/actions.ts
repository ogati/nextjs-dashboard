'use server';
 
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const Invoice = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
}).omit({ id: true, date: true });
 
export async function createInvoice(formData: FormData) {
  const {customerId, amount, status} = Invoice.parse(Object.fromEntries(formData.entries()));
  const amountInCents = Math.round(amount * 100);
  const date = new Date().toISOString();

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  const route = '/dashboard/invoices';
  revalidatePath(route);
  redirect(route);
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = Invoice.parse(Object.fromEntries(formData.entries()));
  const amountInCents = Math.round(amount * 100);
 
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  
  const route = '/dashboard/invoices';
  revalidatePath(route);
  redirect(route);
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

