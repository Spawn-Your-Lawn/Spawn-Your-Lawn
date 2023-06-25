import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ReactLogo from '../../assets/react.svg';

interface Plant {
  id: number;
  plantId?: number;
  default_image?: {
    thumbnail: string;
  };
  common_name: string;
  description: string;
  plantName: string;
  origin?: string[];
}

export const SearchPlants = () => {
  const [typingTerm, setTypingTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchOption, setSearchOption] = useState('name');

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = async(newTerm: string) => {
    if (!newTerm) {
      return;
    }

    setIsLoading(true);

    navigate(`/search?plant=${encodeURIComponent(newTerm)}`);

    try {
      const response = await axios.get(
        `https://perenual.com/api/species-list?page=1&key=${process.env.PERENUAL_API_TOKEN}&q=${newTerm}`
      );

      const plantData = response.data.data;
      setPlants(plantData);
    } catch (error) {
      console.error('Error searching plants:', error);
    }

    setIsLoading(false);
  };

  const handleOriginSearch = async(newTerm: string) => {
    if (!newTerm) {
      return;
    }

    navigate(`/search?origin=${encodeURIComponent(newTerm)}`);

    setIsLoading(true);

    try {
      const response = await axios.get(`/api/plants/${encodeURIComponent(newTerm)}`);
      if (response && response.data) {
        console.log(response.data);
        setPlants(response.data);
      } else {
        setPlants([]);
      }
    } catch (error) {
      console.error(error);
      setPlants([]);
    }

    setIsLoading(false);
  };

  const handleSearchDelayed = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    const newTerm = event.target.value;
    setTypingTerm(newTerm);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        setSearchTerm(newTerm);

        if (searchOption === 'origin') {
          handleOriginSearch(newTerm);
        } else {
          handleSearch(newTerm);
        }
      }, 500)
    );
  };

  const openPlantDetails = (plantId: number ) => {
    navigate(`/plants/${plantId}`);
  };

  const searchContainerClass = `flex flex-col h-full items-center overflow-y-auto ${
    plants.length ? '' : 'justify-center'
  }`;
  const searchBarClass = `${plants ? 'my-4' : ''}`;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const plantParam = searchParams.get('plant');
    const originParam = searchParams.get('origin');
    if (plantParam) {
      setSearchTerm(plantParam);
      setTypingTerm(plantParam);
    } else if (originParam) {
      setSearchTerm(originParam);
      setTypingTerm(originParam);
      setSearchOption('origin');
    }
  }, [location]);

  useEffect(() => {
    if (searchTerm) {
      if (searchOption === 'origin') {
        handleOriginSearch(searchTerm);
      } else {
        handleSearch(searchTerm);
      }
    }
  }, [searchOption]);

  return (
    <div className={searchContainerClass}>
      <div className={searchBarClass}>
        <select
          value={searchOption}
          onChange={(event) => setSearchOption(event.target.value)}
          className="select select-primary"
        >
          <option value="name">Name</option>
          <option value="origin">Origin</option>
        </select>
        <input
          className="input input-primary"
          type="text"
          value={typingTerm}
          onChange={(event) => handleSearchDelayed(event)}
        />
        <button className="btn btn-primary">
        Search
        </button>
      </div>

      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <ReactLogo className="logo spin-animation" />
        </div>
      ) : plants.length > 0 && searchOption === 'name' ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full">
          {plants?.map((plant) => (
            <div key={plant.id} className="card shadow-lg" onClick={() => openPlantDetails(plant.id)}>
              <img src={plant.default_image?.thumbnail} alt={plant.common_name} className="w-full h-48 object-cover" />
              <div className="card-body bg-primary flex flex-col items-center">
                <h3 className="card-title text-center">{plant.common_name}</h3>
                <p className="card-text">{plant.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : plants.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full">
          {plants?.map((plant) => (
            <div key={plant.id} className="card shadow-lg" onClick={() => openPlantDetails(plant.plantId ?? 0)}>
              <div className="card-body bg-primary flex flex-col items-center">
                <h3 className="card-title text-center">{plant.plantName}</h3>
                <p className="card-text">
                  <strong>Locations:</strong> {plant?.origin?.join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
