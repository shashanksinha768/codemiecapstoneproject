// frontend/src/components/filters/ReviewScoreFilter.jsx
import React from 'react';

const OPTIONS = [
  { value: '', label: 'Any' },
  { value: '6', label: '6+' },
  { value: '7', label: '7+' },
  { value: '8', label: '8+' },
  { value: '9', label: '9+' },
];

export function ReviewScoreFilter({ value, onChange }) {
  return (
    <div className="filterBlock">
      <div className="filterTitle">Review score</div>
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {OPTIONS.map((o) => (
          <option key={o.label} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
