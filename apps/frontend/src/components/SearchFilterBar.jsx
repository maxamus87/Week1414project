export default function SearchFilterBar({ filters, onChange }) {
  function handleChange(event) {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  }

  return (
    <form className="filter-bar" onSubmit={(event) => event.preventDefault()}>
      <label>
        Search by name
        <input
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="e.g. Rooted Coffee House"
        />
      </label>

      <label>
        City
        <input
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="e.g. Asheville"
        />
      </label>

      <label>
        Sort by
        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="name">Name (A-Z)</option>
          <option value="rating">Highest rated</option>
          <option value="newest">Newest</option>
        </select>
      </label>
    </form>
  );
}
