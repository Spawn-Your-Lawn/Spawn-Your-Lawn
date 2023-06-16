import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ReactLogo from '../../assets/react.svg';

export const SearchPlants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchOrigin, setSearchOrigin] = useState('');
  const [filterByOrigin, setFilterByOrigin] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = async() => {
    if (!searchTerm) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://perenual.com/api/species-list?page=1&key=${process.env.PERENUAL_API_TOKEN}&q=${searchTerm}`
      );

      const plantData = response.data.data;
      setPlants(plantData);
    } catch (error) {
      console.error('Error searching plants:', error);
    }

    setIsLoading(false);
  };

  const handleSearchOrigin = function(e: ChangeEvent<HTMLInputElement>) {
    setSearchOrigin(e.target.value);
    handleSearchDelayed();
  };

  const handleSearchDelayed = (isOrigin: boolean) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        if (isOrigin) {
          handleSearchOrigin();
        } else {
          handleSearch();
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
    if (plantParam) {
      setSearchTerm(plantParam);
    }
  }, [location]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const fetchAllPlants = async() => {
    let id = 1;
    let counter = 0;
    let response = true;

    while (response) {
      // make the request
      response = await axios.get(`https://www.perenual.com/api/species/details/${id}?key=sk-g3Rm64831fea079ef1196`);
      if (response.data.length === 0) {
        response = false;
        return;
      }

      console.log('id: ', id);

      await axios.post('/api/plants', {
        plantId: response.data.id,
        plantName: response.data.common_name,
        origin: response.data.origin
      })

      id++;
      counter++;

      if (counter >= 1450) {
        await new Promise((resolve) => setTimeout(resolve, 60000));
        counter = 0;
      }
    }
  };

  // useEffect(() => {
  //   fetchAllPlants();
  // }, []);

  const navigateToSearch = () => {
    navigate(`/search?plant=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className={searchContainerClass}>
      <div className={searchBarClass}>
        <input className="input input-primary" value={searchOrigin} onChange={(e) => {
          setSearchOrigin(e.target.value);
          handleSearchDelayed(true);
        }}/>
        <input
          className="input input-primary"
          type="text"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            handleSearchDelayed(false);
          }}
        />
        <button className="btn btn-primary" onClick={navigateToSearch}>
        Search
        </button>
        <button className="btn btn-error" onClick={fetchAllPlants}>Fetch All Plants</button>
      </div>

      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <ReactLogo className="logo spin-animation" />
        </div>
      ) : plants.length > 0 && (
        <div>
          <button onClick={() => fetchAllPlants()}></button>
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
        </div>
      )}
    </div>
  );
};
