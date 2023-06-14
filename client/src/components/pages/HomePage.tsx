import { FC } from 'react';

import { SearchPlants } from '../../features/searchPlants/SearchPlants';
import { Navbar } from '../layout/Navbar';
import { useAuth0 } from '@auth0/auth0-react';


export const HomePage: FC = () => {
  const { logout } = useAuth0();
  return (
    <div className='flex flex-col h-screen max-h-screen'>
      <Navbar />
      <SearchPlants />
      <a href='http://localhost:3000/login'>Login</a>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
      </button>
    </div>
  );
};
