'use server';
 
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { InvoiceFormError } from './definitions';
import { toInvoiceFieldErrors } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const Invoice = z.object({
  id: z.string(),
  customerId: z.preprocess(
    v => v ?? '',
    z.string().min(1, 'Please select a customer.')
  ),
  amount: z.coerce.number().gt(0, {message: 'Please enter an amount greater than $0.'}),
  status: z.enum(['pending', 'paid'], {
    message: 'Please select an invoice status.'
  }),
  date: z.string(),
}).omit({ id: true, date: true });

export async function createInvoice(prevState: InvoiceFormError, formData: FormData) {
  const validatedFields  = Invoice.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: toInvoiceFieldErrors(validatedFields.error)
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = Math.round(amount * 100);
  const date = new Date().toISOString();

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (err) {
    console.error(err);
    throw err;
  }

  const route = '/dashboard/invoices';
  revalidatePath(route);
  redirect(route);
}

export async function updateInvoice(id: string, prevState: InvoiceFormError, formData: FormData) {
  const validatedFields  = Invoice.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: toInvoiceFieldErrors(validatedFields.error)
    };
  }

  const { customerId, amount, status } = Invoice.parse(Object.fromEntries(formData.entries()));
  const amountInCents = Math.round(amount * 100);
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (err) {
    console.error(err);
    throw err;
  }
  
  const route = '/dashboard/invoices';
  revalidatePath(route);
  redirect(route);
}

export async function deleteInvoice(id: string, query: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (err) {
    console.error(err);
    return {
      message: 'Database Error: Failed to delete Invoice.'
    };
  }
  
  const route = `/dashboard/invoices${query && `?query=${query}`}`
  revalidatePath(route);
  redirect(route);
}
