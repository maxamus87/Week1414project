import { useState } from "react";

const emptyForm = { name: "", city: "", state: "", address: "", description: "", website: "" };

export default function ShopForm({ initialValues, onSubmit, submitLabel = "Save shop" }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.city.trim() || !form.state.trim()) {
      setError("Name, city, and state are required.");
      return;
    }

    setError("");

    try {
      await onSubmit(form);
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Shop name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        City
        <input name="city" value={form.city} onChange={handleChange} required />
      </label>

      <label>
        State
        <input name="state" value={form.state} onChange={handleChange} required />
      </label>

      <label>
        Address
        <input name="address" value={form.address ?? ""} onChange={handleChange} />
      </label>

      <label>
        Description
        <textarea name="description" value={form.description ?? ""} onChange={handleChange} rows="3" />
      </label>

      <label>
        Website
        <input name="website" value={form.website ?? ""} onChange={handleChange} placeholder="https://" />
      </label>

      {error ? <p className="status status--error">{error}</p> : null}

      <button type="submit">{submitLabel}</button>
    </form>
  );
}
