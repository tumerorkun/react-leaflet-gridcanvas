import { GridLayer, GridLayerOptions } from 'leaflet'
import { LayerContainer, Map, GridLayer as RLGridLayer, GridLayerProps } from "react-leaflet";

export interface GCProps extends GridLayerProps {
  color?: string;
  centerText?: string | Function;
  options?: GridLayerOptions;
  leaflet?: {
    map?: Map;
    pane?: string;
    layerContainer?: LayerContainer;
    popupContainer?: Layer;
  }
}

export class GridCanvas extends RLGridLayer<GCProps> { }
