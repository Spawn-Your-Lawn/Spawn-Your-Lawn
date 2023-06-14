/* eslint-disable quotes */
import "./garden.scss";
import { Component } from "react";
import {
  Viewer,
  Ion,
  createOsmBuildings,
  Cartesian3,
  Math,
  createWorldImagery,
  IonWorldImageryStyle,
  IonImageryProvider
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
window.CESIUM_BASE_URL = "https://cesiumjs.org/";

export class Cesium extends Component {
  componentDidMount() {
    Ion.defaultAccessToken = process.env.CESIUM_API_KEY || "";
    this.viewer = new Viewer("cesiumContainer", {
      imageryProvider: createWorldImagery({
        style: IonWorldImageryStyle.AERIAL_WITH_LABELS,
      }),
      baseLayerPicker: false,
    });

    this.viewer.imageryLayers.addImageryProvider(
      new IonImageryProvider({ assetId: 2 })
    );

    this.viewer.scene.primitives.add(createOsmBuildings());
    this.viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
      orientation: {
        heading: Math.toRadians(0.0),
        pitch: Math.toRadians(-15.0),
      },
    });
  }

  componentWillUnmount() {
    this.viewer.destroy();
  }

  render() {
    return (
      <div id="cesiumContainer" style={{ width: "100%", height: "100%" }} />
    );
  }
}