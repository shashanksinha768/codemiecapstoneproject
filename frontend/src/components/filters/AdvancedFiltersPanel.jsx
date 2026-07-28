// frontend/src/components/filters/AdvancedFiltersPanel.jsx
import React from 'react';
import { AmenitiesFilter } from './AmenitiesFilter';
import { PropertyTypeFilter } from './PropertyTypeFilter';
import { ReviewScoreFilter } from './ReviewScoreFilter';

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
      <ReviewScoreFilter
        value={props.minReviewScore}
        onChange={props.onMinReviewScoreChange}
      />
    </aside>
  );
}
