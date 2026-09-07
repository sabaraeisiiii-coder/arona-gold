import { AdminRecordScreen } from '../../../components/admin/AdminRecordScreen';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminRecordScreen resource="categories" id={id} title="جزئیات دسته‌بندی" mode="edit" />;
}
