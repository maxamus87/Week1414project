import { useNavigate } from "react-router-dom";
import { createShop } from "../api/shops.js";
import { useAuth } from "../context/AuthContext.jsx";
import ShopForm from "../components/ShopForm.jsx";

export default function NewShopPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  async function handleSubmit(form) {
    const { data } = await createShop(form, token);
    navigate(`/shops/${data.id}`);
  }

  return (
    <section className="panel">
      <h1>Add a coffee shop</h1>
      <ShopForm onSubmit={handleSubmit} submitLabel="Create shop" />
    </section>
  );
}
