import { FC } from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { HomePage } from '../components/pages/HomePage';
import { PlantDetailsPage } from '../components/pages/PlantDetailsPage';
import { SearchPage } from '../components/pages/SearchPage';
import { store } from './store';
import { SellersPage } from '../components/pages/SellersPage';

export const App: FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/plants/:plantId' element={<PlantDetailsPage />} />
          <Route path='/sellers' element={<SellersPage />}/>
        </Routes>
      </Router>
    </Provider>
  );
};
