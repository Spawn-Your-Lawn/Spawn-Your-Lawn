import { FC } from 'react';

import { Cesium } from '../../features/garden/Cesium';
import { Navbar } from '../layout/Navbar';

export const GardenPage: FC = () => {
  return (
    <div className='flex flex-col h-screen max-h-screen'>
      <Navbar />
      <Cesium />
    </div>
  );
};
