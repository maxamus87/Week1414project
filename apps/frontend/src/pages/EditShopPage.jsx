import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchShop, updateShop } from "../api/shops.js";
import { useAuth } from "../context/AuthContext.jsx";
import ShopForm from "../components/ShopForm.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function EditShopPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadShop() {
      try {
        const { data } = await fetchShop(id);
        setShop(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    loadShop();
  }, [id]);

  async function handleSubmit(form) {
    await updateShop(id, form, token);
    navigate(`/shops/${id}`);
  }

  if (loading) {
    return <LoadingMessage text="Loading shop..." />;
  }

  if (error) {
    return <ErrorMessage text={error} />;
  }

  return (
    <section className="panel">
      <h1>Edit {shop.name}</h1>
      <ShopForm initialValues={shop} onSubmit={handleSubmit} submitLabel="Save changes" />
    </section>
  );
}
