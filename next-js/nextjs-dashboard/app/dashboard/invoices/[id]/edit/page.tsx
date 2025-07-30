import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { notFound } from 'next/navigation';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import type { Customer } from '@/app/lib/definitions';
import { Metadata } from 'next';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getCustomer(id: string): Promise<Customer | undefined> {
  try {
    const customer = await sql<
      Customer[]
    >`
    SELECT customers.name FROM invoices
    JOIN customers ON customers.id = invoices.customer_id 
    WHERE invoices.id=${id}
    `;
    return customer[0];
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    throw new Error('Failed to fetch customer.');
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const customer = await getCustomer(params.id);

  return {
    title: `Invoice ${customer?.name}`,
  };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
