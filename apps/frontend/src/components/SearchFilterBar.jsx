import { useState } from "react";

export default function SearchFilterBar({
  filters,
  onChange,
  onFindNear,
  onUseLocation,
  locationLabel,
  locationBusy,
  locationError,
  onClearLocation,
  hasLocation,
  radiusMiles,
  onRadiusChange
}) {
  const [nearAddress, setNearAddress] = useState("");
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  function handleUseLocation() {
    setShowLocationPopup(false);
    onUseLocation();
  }

  function handleChange(event) {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  }

  function handleFindNear(event) {
    event.preventDefault();
    if (nearAddress.trim()) {
      onFindNear(nearAddress.trim());
    }
  }

  return (
    <>
      <form className="near-me" onSubmit={handleFindNear}>
        <label className="near-me__field near-me__field--address">
          Near this address
          <input
            value={nearAddress}
            onChange={(event) => setNearAddress(event.target.value)}
            onFocus={() => setShowLocationPopup(true)}
            onBlur={() => setTimeout(() => setShowLocationPopup(false), 150)}
            placeholder="e.g. 123 Main St, Asheville, NC"
          />
          {showLocationPopup ? (
            <div className="near-me__popup">
              <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={handleUseLocation} disabled={locationBusy}>
                Use my current location
              </button>
            </div>
          ) : null}
        </label>

        <label className="near-me__field near-me__field--radius">
          Within
          <select
            value={radiusMiles}
            onChange={(event) => onRadiusChange(event.target.value)}
            disabled={!hasLocation}
          >
            <option value="">No limit</option>
            <option value="1">1 mile</option>
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
          </select>
        </label>

        <div className="near-me__actions">
          <button type="submit" disabled={locationBusy || !nearAddress.trim()}>
            Find
          </button>
          {locationLabel ? (
            <button type="button" className="near-me__clear" onClick={onClearLocation}>
              Clear
            </button>
          ) : null}
        </div>

        {locationBusy ? <p className="status status--loading">Finding your location...</p> : null}
        {locationError ? <p className="status status--error">{locationError}</p> : null}
        {locationLabel && !locationBusy ? <p className="status">{locationLabel}</p> : null}
      </form>

      <div className="search-divider">
        <span>Or</span>
      </div>

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
          State
          <input
            name="state"
            value={filters.state}
            onChange={handleChange}
            placeholder="e.g. North Carolina"
          />
        </label>

        <label>
          Sort by
          <select name="sort" value={filters.sort} onChange={handleChange}>
            <option value="name">Name (A-Z)</option>
            <option value="rating">Highest rated</option>
            <option value="newest">Newest</option>
            <option value="nearest">Nearest to me</option>
          </select>
        </label>
      </form>
    </>
  );
}
