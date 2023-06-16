import axios from 'axios';
import { Feature, Map, View } from 'ol';
import { Point } from 'ol/geom';
import Select from 'ol/interaction/Select';
import { Vector as VectorLayer } from 'ol/layer';
import TileLayer from 'ol/layer/Tile';
import 'ol/ol.css';
import { transform } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import OSM from 'ol/source/OSM';
import { FC, FormEvent, useEffect, useRef, useState } from 'react';

import { StoreDetails } from '../../features/storeDetails/StoreDetails';
import { Navbar } from '../layout/Navbar';
// Sellers
interface StoreCoordinate {
  tags: Record<string, unknown>;
  latitude: number;
  longitude: number;
}

export const SellersPage: FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [userCoordinates, setUserCoordinates] = useState({
    latitude: null,
    longitude: null
  });

  const [markedMap, setMarkedMap] = useState<Map | null>(null);
  const [storeCoordinatesSet, setStoreCoordinatesSet] = useState<Array<StoreCoordinate>>([]);
  const [showStore, setShowStore] = useState(false);
  const [locationTags, setLocationTags] = useState({});
  const [mapView, setMapView] = useState({
    center: [0, 0],
    zoom: 2,
  });

  useEffect(() => {
    const map = new Map({
      target: mapContainer.current as HTMLElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View(mapView),
    });

    setMarkedMap(map);

    return () => {
      map.setTarget(undefined);
    };
  }, [mapView]);

  const storeFinder = function(query: string) {
    axios.post('/api/map/stores', {
      data: query
    })
      .then((response) => {
        const storeSet = response.data.elements;
        const reformattedStoreSet = [];

        for (let i = 0; i < response.data.elements.length; i += 1) {
          const singleStore = {
            tags: storeSet[i].tags,
            latitude: storeSet[i].lat,
            longitude: storeSet[i].lon
          };

          if (storeSet[i].center) {
            singleStore.latitude = storeSet[i].center.lat;
            singleStore.longitude = storeSet[i].center.lon;
          }
          reformattedStoreSet.push(singleStore);
        }

        setStoreCoordinatesSet(reformattedStoreSet);

        if (reformattedStoreSet.length > 0) {
          setShowStore(true);
          const firstStore = reformattedStoreSet[0];
          const newMapView = {
            center: transform([firstStore.longitude, firstStore.latitude], 'EPSG:4326', 'EPSG:3857'),
            zoom: 10,
          };
          setMapView(newMapView);
        }
      })
      .catch(() => {
        console.log('Issue finding stores');
      });
  };

  useEffect(() => {
    let overpassQuery: string;
    const radiusInMeters = 10 * 1609.34;
    if (userCoordinates.latitude && userCoordinates.longitude) {
      overpassQuery = `?data=[out:json];
      (
        node["shop"="garden_centre"](around:${radiusInMeters},
          ${userCoordinates.latitude}, ${userCoordinates.longitude});
        way["shop"="garden_centre"](around:${radiusInMeters},
          ${userCoordinates.latitude}, ${userCoordinates.longitude});
        relation["shop"="garden_centre"](around:${radiusInMeters},
          ${userCoordinates.latitude}, ${userCoordinates.longitude});
      );
      out center;`;
      storeFinder(overpassQuery);
    }
  }, [userCoordinates]);

  const handleSubmit = function(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const City = (event.currentTarget[0] as HTMLInputElement).value;
    const State = (event.currentTarget[1] as HTMLInputElement).value;
    const query = `${City}, ${State}`;
    axios
      .get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      )
      .then((response) => {
        if (response.data[0]) {
          setUserCoordinates({
            latitude: response.data[0].lat,
            longitude: response.data[0].lon
          });
        }
      })
      .catch(() => {
        console.log('Error in retrieving coordinates');
      });
  };

  useEffect(() => {
    if (markedMap && storeCoordinatesSet.length > 0) {
      const features = storeCoordinatesSet.map((store) => {
        const feature = new Feature({
          geometry: new Point(transform([store.longitude, store.latitude], 'EPSG:4326', 'EPSG:3857'))
        });
        feature.setProperties({
          tags: store.tags,
          coordinates: [store.longitude, store.latitude]
        });
        return feature;
      });

      const vectorSource = new VectorSource({
        features: features
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource
      });

      markedMap.addLayer(vectorLayer);

      const selectInteraction = new Select();
      markedMap.addInteraction(selectInteraction);

      selectInteraction.on('select', (event) => {
        const selectedFeature = event.selected[0];
        if (selectedFeature) {
          const tags = selectedFeature.get('tags');
          setLocationTags(tags);
        }
      });

      return () => {
        markedMap.removeInteraction(selectInteraction);
        markedMap.removeLayer(vectorLayer);
      };
    }
  }, [markedMap, storeCoordinatesSet]);


  return (
    <div className='flex flex-col h-screen max-h-screen'>
      <Navbar />
      <div>
        <form className="m-10" onSubmit={handleSubmit}>
          <label>
            City
            <input className="input input-bordered w-full focus:text-white focus:border-primary focus:outline-primary hover:border-secondary" />
          </label>
          <label>
            State
            <input className="input input-bordered w-full focus:text-white focus:border-primary focus:outline-primary hover:border-secondary" />
          </label>
          <input className="btn btn-primary py-2 px-4 rounded" type="submit" value="Search Location" />
        </form>

        <div className="m-10 w-50 h-96" ref={mapContainer}></div>
        {showStore && <StoreDetails locationTags={locationTags} />}
      </div>
    </div>
  );
};
