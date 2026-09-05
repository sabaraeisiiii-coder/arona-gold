import { getProducts } from "../services/product.service";
import WishlistScreen from "./WishlistScreen";
export default async function WishlistPage() {
  return <WishlistScreen products={await getProducts()} />;
}
