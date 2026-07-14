import { useEffect, useState } from "react";
import { fetchShops } from "../api/shops.js";
import ShopList from "../components/ShopList.jsx";
import SearchFilterBar from "../components/SearchFilterBar.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function HomePage() {
  const [shops, setShops] = useState([]);
  const [filters, setFilters] = useState({ search: "", city: "", sort: "name" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadShops() {
      setLoading(true);
      setError("");

      try {
        const { data } = await fetchShops(filters);
        if (!cancelled) {
          setShops(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timeoutId = setTimeout(loadShops, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [filters]);

  return (
    <section className="panel">
      <h1>Find a local coffee shop</h1>
      <p>Search, filter, and rate independent coffee shops near you.</p>

      <SearchFilterBar filters={filters} onChange={setFilters} />

      {loading ? <LoadingMessage text="Loading coffee shops..." /> : null}
      <ErrorMessage text={error} />
      {!loading && !error ? <ShopList shops={shops} /> : null}
    </section>
  );
}
