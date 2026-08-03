// frontend/src/components/filters/AdvancedFiltersPanel.jsx
import React from 'react';
import { AmenitiesFilter } from './AmenitiesFilter';
import { PropertyTypeFilter } from './PropertyTypeFilter';
import { ReviewScoreFilter } from './ReviewScoreFilter';
import { PriceRangeFilter } from './PriceRangeFilter';

/**
 * AdvancedFiltersPanel composes all advanced filter controls.
 *
 * NOTE: Existing filter components are not modified; we only add the new PriceRangeFilter.
 *
 * @param {object} props - Component props.
 */
export function AdvancedFiltersPanel(props) {
  return (
    <aside className="filtersPanel">
      <AmenitiesFilter
        amenities={props.amenitiesOptions}
        selected={props.selectedAmenities}
        onChange={props.onAmenitiesChange}
      />
      <PropertyTypeFilter
        selected={props.selectedPropertyTypes}
        onChange={props.onPropertyTypesChange}
      />
      <ReviewScoreFilter value={props.minReviewScore} onChange={props.onMinReviewScoreChange} />
      <PriceRangeFilter
        minPrice={props.minPrice}
        maxPrice={props.maxPrice}
        onMinPriceChange={props.onMinPriceChange}
        onMaxPriceChange={props.onMaxPriceChange}
      />
    </aside>
  );
}
