import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Navbar } from '../../components/layout/Navbar';

export const FavoritePlants = () => {
  const [favoritedPlants, setFavoritedPlants] = useState([]);

  const navigate = useNavigate();

  const getFavoritePlants = () => {
    axios
      .get('/api/favorites')
      .then((response) => {
        setFavoritedPlants(response.data);
      })
      .catch((error) => {
        console.log('Error retrieving favorite plants:', error);
      });
  };

  useEffect(() => {
    getFavoritePlants();
  }, []);

  const deletePlant = (favoritedPlant: { plantId: number; userId: number }) => {
    axios
      .delete('/api/favorites', {
        data: {
          plantId: favoritedPlant.plantId,
          userId: favoritedPlant.userId,
        },
      })
      .then(() => {
        console.log('Deleted plant from favorites');
        getFavoritePlants();
      })
      .catch((error) => {
        console.log('Error deleting plant from favorites:', error);
      });
  };

  return favoritedPlants.length > 0 ? (
    <div>
      <Navbar />
      <h1>Favorite Plants</h1>
      <br></br>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full'>
        {favoritedPlants.map((favoritedPlant: {
          plantId: number,
          plantName: string,
          plantImage: string,
          userId: number;
        }, index) => (
          <div
            key={index}
            className='card shadow-lg'
            onClick={() => navigate(`/plants/${favoritedPlant.plantId}`)}
          >
            <img
              className='w-full h-48 object-cover'
              src={favoritedPlant.plantImage}
              alt={favoritedPlant.plantName}
            />
            <div className='card-body bg-primary flex flex-col items-center'>
              <div className='card-title text-center'>
                {favoritedPlant.plantName}
              </div>
              <div className='card-text'>
                Plant ID: {favoritedPlant.plantId}
              </div>
              <button className="btn btn-neutral">
                View Details
              </button>
              <button
                className='btn btn-error'
                onClick={() => deletePlant(favoritedPlant)}
              >
                Remove from Favorites
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>
      <Navbar />
      <h1>Favorite Plants</h1>
      <h2>Empty 😞</h2>
    </div>
  );
};
