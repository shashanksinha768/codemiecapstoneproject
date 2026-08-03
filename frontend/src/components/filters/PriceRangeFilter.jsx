// frontend/src/components/filters/PriceRangeFilter.jsx
import React from 'react';

/**
 * PriceRangeFilter renders min/max price per night inputs.
 *
 * @param {object} props - Component props.
 * @param {string|number} props.minPrice - Current minimum price value.
 * @param {string|number} props.maxPrice - Current maximum price value.
 * @param {(value: string) => void} props.onMinPriceChange - Handler invoked when min price changes.
 * @param {(value: string) => void} props.onMaxPriceChange - Handler invoked when max price changes.
 */
export function PriceRangeFilter(props) {
  // Normalizes input values for controlled inputs.
  const minValue = props.minPrice ?? '';
  const maxValue = props.maxPrice ?? '';

  // Handles min input changes and forwards raw string to parent for parsing.
  function handleMinChange(e) {
    props.onMinPriceChange(e.target.value);
  }

  // Handles max input changes and forwards raw string to parent for parsing.
  function handleMaxChange(e) {
    props.onMaxPriceChange(e.target.value);
  }

  return (
    <section className="filterCard" aria-label="Price range filter">
      <h3>Price per night</h3>
      <div className="filterRow" style={{ display: 'flex', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Min</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="1"
            placeholder="0"
            value={minValue}
            onChange={handleMinChange}
            aria-label="Minimum price per night"
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Max</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="1"
            placeholder="Any"
            value={maxValue}
            onChange={handleMaxChange}
            aria-label="Maximum price per night"
          />
        </label>
      </div>
    </section>
  );
}
