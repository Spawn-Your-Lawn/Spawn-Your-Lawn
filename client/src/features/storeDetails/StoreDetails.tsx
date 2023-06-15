import { FC } from 'react';

export const StoreDetails: FC = ({ locationTags }) => {

  console.log(locationTags);

  return (
    <div>
      <div>
        {locationTags.name && <p>{locationTags.name}</p>}
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
        {locationTags['phone'] && <p>{locationTags['phone']}</p>}
      </div>
    </div>
  );
};