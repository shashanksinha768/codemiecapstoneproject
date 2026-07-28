// frontend/src/components/filters/PropertyTypeFilter.jsx
import React from 'react';

const PROPERTY_TYPES = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'villa', label: 'Villa' },
];

export function PropertyTypeFilter({ selected, onChange }) {
  function toggle(value) {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(next);
  }

  return (
    <div className="filterBlock">
      <div className="filterTitle">Property type</div>
      <div className="filterOptions">
        {PROPERTY_TYPES.map((t) => (
          <label key={t.value} className="checkboxRow">
            <input
              type="checkbox"
              checked={selected.includes(t.value)}
              onChange={() => toggle(t.value)}
            />
            <span>{t.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
