// frontend/src/components/filters/AmenitiesFilter.jsx
import React from 'react';

export function AmenitiesFilter({ amenities, selected, onChange }) {
  function toggle(code) {
    const next = selected.includes(code)
      ? selected.filter((c) => c !== code)
      : [...selected, code];
    onChange(next);
  }

  return (
    <div className="filterBlock">
      <div className="filterTitle">Amenities</div>
      <div className="filterOptions">
        {amenities.map((a) => (
          <label key={a.code} className="checkboxRow">
            <input
              type="checkbox"
              checked={selected.includes(a.code)}
              onChange={() => toggle(a.code)}
            />
            <span>{a.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
