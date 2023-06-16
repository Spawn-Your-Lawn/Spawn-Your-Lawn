import { FC } from 'react';

interface LocationTags {
  name?: string;
  'addr:housenumber'?: string;
  'addr:street'?: string;
  'addr:city'?: string;
  'addr:postcode'?: string;
  phone?: string;
}

interface StoreDetailsProps {
  locationTags: LocationTags;
}

export const StoreDetails: FC<StoreDetailsProps> = ({ locationTags }) => {
  return (
    <div className="m-10">
      <div>
        {locationTags.name && <h4 className="underline"><strong>{locationTags.name}</strong></h4>}
      </div>
      <div>
        {locationTags['addr:housenumber'] && <p>{locationTags['addr:housenumber']}</p>}
      </div>
      <div>
        {locationTags['addr:street'] && <p>{locationTags['addr:street']}</p>}
      </div>
      <div>
        {locationTags['addr:city'] && <p>{locationTags['addr:city']}</p>}
      </div>
      <div>
        {locationTags['addr:postcode'] && <p>{locationTags['addr:postcode']}</p>}
      </div>
      <div>
        {locationTags.phone && <p>{locationTags.phone}</p>}
      </div>
    </div>
  );
};
