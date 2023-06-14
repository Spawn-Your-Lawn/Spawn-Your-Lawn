import { FC } from 'react';
import { Navbar } from '../layout/Navbar';
import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Feature } from 'ol';
import { Map, View } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { transform } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import axios from 'axios';
import Select from 'ol/interaction/Select';

export const SellersPage: FC = () => {
  const mapContainer = useRef(null);
  const [userCoordinates, setUserCoordinates] = useState({
    latitude: null,
    longitude: null
  });

  const [markedMap, setMarkedMap] = useState(null);
  const [storeCoordinatesSet, setStoreCoordinatesSet] = useState([]);
  const [selectedCoordinated, setSelectedCoordinated] = useState({});
  const [showCoordinate, setShowCoordinate] = useState(false);

  useEffect(() => {
    const map = new Map({
      target: mapContainer.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    setMarkedMap(map);

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  let storeFinder = function (radius: any, query: string) {
    axios
      .post('/map/stores', {
        data: query
      })
      .then((response) => {
        let storeSet = response.data.elements;
        let reformattedStoreSet = [];
        for (let i = 0; i < response.data.elements.length; i += 1) {
          let singleStore: any = {};
          singleStore.tags = storeSet[i].tags;
          singleStore.latitude = storeSet[i].lat;
          singleStore.longitude = storeSet[i].lon;
          if (storeSet[i].center) {
            singleStore.latitude = storeSet[i].center.lat;
            singleStore.longitude = storeSet[i].center.lon;
          }
          reformattedStoreSet.push(singleStore);
        }
        setStoreCoordinatesSet(reformattedStoreSet);
      })
      .catch((err) => {
        console.log('Issue finding stores');
      });
  };

  useEffect(() => {
    let overpassQuery: string;
    if (userCoordinates.latitude && userCoordinates.longitude) {
      overpassQuery = `?data=[out:json];
      (
        node["shop"="garden_centre"](around:8047.2,
          ${userCoordinates.latitude}, ${userCoordinates.longitude});
        way["shop"="garden_centre"](around:8047.2,
          ${userCoordinates.latitude}, ${userCoordinates.longitude});
        relation["shop"="garden_centre"](around:8047.2,
          ${userCoordinates.latitude}, ${userCoordinates.longitude});
      );
      out center;`;
      storeFinder(null, overpassQuery);
    }
  }, [userCoordinates]);

  let handleSubmit = function (e) {
    e.preventDefault();
    let City = e.target[0].value;
    let State = e.target[1].value;
    let query = `${City}, ${State}`;
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
      .catch((err) => {
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
          const coordinates = selectedFeature.get('coordinates');
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
        <form className="locationForm" onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
};