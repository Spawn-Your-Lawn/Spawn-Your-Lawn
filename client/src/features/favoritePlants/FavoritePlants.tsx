import { useState, useEffect } from 'react';
import axios from 'axios';

import { Navbar } from '../../components/layout/Navbar';

export const FavoritePlants = () => {
  const [favoritedPlants, setFavoritedPlants] = useState([]);

  const getFavoritePlants = () => {
    axios.get('/api/favorites')
      .then((response) => {
        console.log(response.data);
        setFavoritedPlants(response.data);
      })
      .catch((error) => {
        console.log('Error retrieving favvorite plants:', error);
      });
  };

  useEffect(() => {
    getFavoritePlants();
  }, []);

  const deletePlant = (favoritedPlant) => {
    console.log(favoritedPlant);
    axios.delete('/api/favorites', {
      data: {
        plantId: favoritedPlant.plantId,
        userId: favoritedPlant.userId
      }
    })
      .then(() => {
        console.log('Deleted plant from favorites');
        getFavoritePlants();
      })
      .catch((error) => {
        console.log('Error deleting plant from favorites:', error);
      });
  };

  return (
    <div>
      <Navbar />
      <h1>Favorite Plants</h1>
      <br></br>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full'>
        {favoritedPlants.map((favoritedPlant, index) => (
          <div key={index} className="card shadow-lg">
            <img className="w-full h-48 object-cover" src={favoritedPlant.plantImage} alt={favoritedPlant.plantName} />
            <div className="card-body bg-primary flex flex-col items-center">
              <div className="card-title text-center">Plant ID: {favoritedPlant.plantId}</div>
              <div className="card-text">Plant Name: {favoritedPlant.plantName}</div>
              <button className="btn btn-primary" onClick={() => deletePlant(favoritedPlant)}>Delete Me 😞</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
