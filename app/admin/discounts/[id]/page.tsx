import { AdminRecordScreen } from '../../../components/admin/AdminRecordScreen';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminRecordScreen resource="discounts" id={id} title="جزئیات تخفیف" mode="edit" />;
}
