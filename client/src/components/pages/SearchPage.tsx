import { FC } from 'react';

import { SearchPlants } from '../../features/searchPlants/SearchPlants';
import { Navbar } from '../layout/Navbar';

export const SearchPage: FC = () => {
  return (
    <div className='flex flex-col h-screen max-h-screen'>
      <Navbar />
      <SearchPlants />
      <a href='http://localhost:3000/login'>text</a>
    </div>
  );
};
