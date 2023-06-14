import { FC } from 'react';

import { Navbar } from '../layout/Navbar';
import { Cesium } from '../../features/garden/Cesium';

export const GardenPage: FC = () => {
  return (
    <div className='flex flex-col h-screen max-h-screen'>
      <Navbar />
      <Cesium />
    </div>
  );
};