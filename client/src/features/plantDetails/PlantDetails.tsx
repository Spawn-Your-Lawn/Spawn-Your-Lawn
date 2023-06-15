import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import ReactLogo from '../../assets/react.svg';
import { setPlantDetails } from './plantDetailsSlice';

export const PlantDetails: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { plantId } = useParams<{ plantId: string; }>();

  const dispatch = useAppDispatch();

  const plantDetails = useAppSelector((state) => state.plantDetails);

  const notify = () => toast.success('Added plant to favorites!', {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  });

  const addPlant = () => {
    axios.post('/api/favorites', {
      plantImage: plantDetails.default_image.original_url,
      plantId: plantDetails.id,
      plantName: plantDetails.common_name,
      userId: 1
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log('Error posting plant to favorites:', error);
      });
  };

  const fetchPlantDetails = async() => {
    if (!plantId) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://perenual.com/api/species/details/${plantId}?page=1&key=${process.env.PERENUAL_API_TOKEN}`
      );

      const maintenanceData = await axios.get(`https://perenual.com/api/species-care-guide-list?key=sk-g3Rm64831fea079ef1196&species_id=${plantId}`);

      const completePlantDetails = {
        ...response.data,
        maintenance: maintenanceData.data.data.length > 0 ? maintenanceData.data.data[0].section : response.data?.maintenance
      };

      dispatch(setPlantDetails(completePlantDetails));
    } catch (error) {
      console.error('Error fetching plant details:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlantDetails();
  }, [plantId]);

  return (
    isLoading ? (
      <div className="h-screen flex items-center justify-center">
        <ReactLogo className="logo spin-animation" />
      </div>
    ) : (
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">
          Plant Details
          <div>
            <button className="btn btn-primary" onClick={() => {addPlant(); notify();}}>Add To Favorites</button>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </h1>
        {plantDetails && (
          <div className='grid grid-cols-2 gap-8'>
            <div className="p-4 bg-neutral rounded-lg shadow-md">
              <h2 className='text-3xl text-center mb-4'>{plantDetails.common_name.toUpperCase()}</h2>
              <img src={plantDetails.default_image.original_url} alt={plantDetails.common_name} className="w-full h-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Description:</h2>
              <p className="mb-4">{plantDetails.description}</p>
              {plantDetails.maintenance && Array.isArray(plantDetails.maintenance) ? (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Maintenance:</h2>
                  <ul className='space-y-2'>
                    {plantDetails.maintenance.map((task) => (
                      <li key={task.id}>{task.description}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mb-4">{plantDetails.maintenance}</p>
              )}
            </div>

            <div className="p-4 bg-neutral rounded-lg shadow-md space-y-4">
              <h2 className="text-2xl font-semibold mb-2">Details:</h2>

              <h3 className="text-xl">ID: <span className="font-normal">{plantDetails.id}</span></h3>
              <h3 className="text-xl">Scientific Name:</h3>
              <ul className="list-disc pl-5">
                {plantDetails.scientific_name.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold">Other Names:</h3>
              <ul>
                {plantDetails.other_name.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold">Family: {plantDetails.family}</h3>
              <h3 className="text-lg font-semibold">Origin: {plantDetails.origin}</h3>
              <h3 className="text-lg font-semibold">Type: {plantDetails.type}</h3>
              <h3 className="text-lg font-semibold">Dimension: {plantDetails.dimension}</h3>
              <h3 className="text-lg font-semibold">Cycle: {plantDetails.cycle}</h3>
              <h3 className="text-lg font-semibold">Watering: {plantDetails.watering}</h3>
              <h3 className="text-lg font-semibold">Attracts:</h3>
              <ul>
                {plantDetails.attracts.map((attraction) => (
                  <li key={attraction}>{attraction}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold">Propagation:</h3>
              <ul>
                {plantDetails.propagation.map((method) => (
                  <li key={method}>{method}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold">Hardiness:</h3>
              <p>Min: {plantDetails.hardiness.min}</p>
              <p>Max: {plantDetails.hardiness.max}</p>
              <h3 className="text-lg font-semibold">Hardiness Location:</h3>
              <p>Full URL: {plantDetails.hardiness_location.full_url}</p>
              <p>Full Iframe: {plantDetails.hardiness_location.full_iframe}</p>
              <h3 className="text-lg font-semibold">Flowers: {plantDetails.flowers ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Flowering Season: {plantDetails.flowering_season}</h3>
              <h3 className="text-lg font-semibold">Color: {plantDetails.color}</h3>
              <h3 className="text-lg font-semibold">Sunlight:</h3>
              <ul>
                {plantDetails.sunlight.map((sunlight) => (
                  <li key={sunlight}>{sunlight}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold">Soil:</h3>
              <ul>
                {plantDetails.soil.map((soil) => (
                  <li key={soil}>{soil}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold">Problem: {plantDetails.problem}</h3>
              <h3 className="text-lg font-semibold">Pest Susceptibility: {plantDetails.pest_susceptibility}</h3>
              <h3 className="text-lg font-semibold">Cones: {plantDetails.cones ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Fruits: {plantDetails.fruits ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Edible Fruit: {plantDetails.edible_fruit ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Edible Fruit Taste Profile: {plantDetails.edible_fruit_taste_profile}</h3>
              <h3 className="text-lg font-semibold">Fruit Nutritional Value: {plantDetails.fruit_nutritional_value}</h3>
              <h3 className="text-lg font-semibold">Fruit Color: {plantDetails.fruit_color}</h3>
              <h3 className="text-lg font-semibold">Fruiting Season: {plantDetails.fruiting_season}</h3>
              <h3 className="text-lg font-semibold">Harvest Season: {plantDetails.harvest_season}</h3>
              <h3 className="text-lg font-semibold">Harvest Method: {plantDetails.harvest_method}</h3>
              <h3 className="text-lg font-semibold">Leaf: {plantDetails.leaf ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Leaf Color:</h3>
              <ul>
                {plantDetails.leaf_color.map((color) => (
                  <li key={color}>{color}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold">Edible Leaf: {plantDetails.edible_leaf ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Edible Leaf Taste Profile: {plantDetails.edible_leaf_taste_profile}</h3>
              <h3 className="text-lg font-semibold">Leaf Nutritional Value: {plantDetails.leaf_nutritional_value}</h3>
              <h3 className="text-lg font-semibold">Growth Rate: {plantDetails.growth_rate}</h3>
              <h3 className="text-lg font-semibold">Medicinal: {plantDetails.medicinal ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Medicinal Use: {plantDetails.medicinal_use}</h3>
              <h3 className="text-lg font-semibold">Medicinal Method: {plantDetails.medicinal_method}</h3>
              <h3 className="text-lg font-semibold">Poisonous to Humans: {plantDetails.poisonous_to_humans ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Poison Effects to Humans: {plantDetails.poison_effects_to_humans}</h3>
              <h3 className="text-lg font-semibold">Poison to Humans Cure: {plantDetails.poison_to_humans_cure}</h3>
              <h3 className="text-lg font-semibold">Poisonous to Pets: {plantDetails.poisonous_to_pets ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Poison Effects to Pets: {plantDetails.poison_effects_to_pets}</h3>
              <h3 className="text-lg font-semibold">Poison to Pets Cure: {plantDetails.poison_to_pets_cure}</h3>
              <h3 className="text-lg font-semibold">Drought Tolerant: {plantDetails.drought_tolerant ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Salt Tolerant: {plantDetails.salt_tolerant ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Thorny: {plantDetails.thorny ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Invasive: {plantDetails.invasive ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Rare: {plantDetails.rare ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Rare Level: {plantDetails.rare_level}</h3>
              <h3 className="text-lg font-semibold">Tropical: {plantDetails.tropical ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Cuisine: {plantDetails.cuisine ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Cuisine List: {plantDetails.cuisine_list}</h3>
              <h3 className="text-lg font-semibold">Indoor: {plantDetails.indoor ? 'Yes' : 'No'}</h3>
              <h3 className="text-lg font-semibold">Care Level: {plantDetails.care_level}</h3>
            </div>
          </div>
        )}
      </div>
    )
  );
};
