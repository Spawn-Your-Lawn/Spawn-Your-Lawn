import {
  Cartesian3,
  Ion,
  IonImageryProvider,
  IonWorldImageryStyle,
  Math,
  Viewer,
  createOsmBuildings,
  createWorldImagery
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { FC, useEffect, useRef } from 'react';

import './garden.scss';

declare global {
  interface Window {
    CESIUM_BASE_URL: string;
  }
}

window.CESIUM_BASE_URL = 'https://cesiumjs.org/';

export const Cesium: FC = () => {
  const viewer = useRef<Viewer | null>(null);

  useEffect(() => {
    Ion.defaultAccessToken = process.env.CESIUM_API_KEY || '';
    viewer.current = new Viewer('cesiumContainer', {
      imageryProvider: createWorldImagery({
        style: IonWorldImageryStyle.AERIAL_WITH_LABELS,
      }),
      baseLayerPicker: false,
    });

    viewer.current.imageryLayers.addImageryProvider(
      new IonImageryProvider({ assetId: 2 })
    );

    viewer.current.scene.primitives.add(createOsmBuildings());
    viewer.current.camera.flyTo({
      destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
      orientation: {
        heading: Math.toRadians(0.0),
        pitch: Math.toRadians(-15.0),
      },
    });

    return () => {
      if (viewer.current) {
        viewer.current.destroy();
      }
    };
  }, []);

  return (
    <div id="cesiumContainer" className="overflow-hidden" />
  );
};
