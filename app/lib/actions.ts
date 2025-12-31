'use server';
 
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { FormState } from './definitions';
import { toInvoiceFieldErrors } from './utils';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { ErrorCode } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const Invoice = z.object({
  id: z.string(),
  customerId: z.preprocess(
    v => v?? '',
    z.string().min(1, 'Please select a customer.')
  ),
  amount: z.coerce.number({ message: "Please enter a valid amount"} )
            .refine(
              n => Number.isInteger(n * 100), 
              { message: "Please enter a valid amount with at most 2 decimal places"}
            )
            .refine(
              n => n > 0,
              { message: "Please enter an amount greater than $0."}
            ),
  status: z.enum(['pending', 'paid'], {
    message: 'Please select an invoice status.'
  }),
  date: z.string(),
}).omit({ id: true, date: true });

export async function createInvoice(prevState: FormState, formData: FormData) {
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

export async function editInvoice(id: string, prevState: FormState, formData: FormData) {
  const validatedFields  = Invoice.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: toInvoiceFieldErrors(validatedFields.error)
    };
  }

  const { customerId, amount, status } = validatedFields.data;
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
    throw err;
  }
  
  const route = `/dashboard/invoices${query && `?query=${query}`}`
  revalidatePath(route);
  redirect(route);
}

const Login = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least six characters long" })
});

export async function authenticate(prevState: FormState | undefined, formData: FormData) {
  const validatedFields = Login.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return {
      errors: toInvoiceFieldErrors(validatedFields.error)
    };
  }

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.cause?.err?.message) {
        case ErrorCode.UserNotFound:
          return {
            errors: { email: ['User doesn\'t exist'] }
          };
        case ErrorCode.PasswordsNotMatch:
          return {
            errors: { password: ['Wrong credential'] }
          };
      }
    }

    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // must rethrow it if the error is NEXT_REDIRECT
    }

    return {
      message: 'Something went wrong'
    }
  }
}
