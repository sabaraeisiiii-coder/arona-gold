import OrderDetailScreen from './OrderDetailScreen';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <OrderDetailScreen id={(await params).id} />;
}
