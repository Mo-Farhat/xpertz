import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title: string;
    content?: React.ReactNode;
  }>;
  className?: string;
}

const Map: React.FC<MapProps> = ({ 
  center, 
  zoom = 13, 
  markers = [],
  className = "h-[400px] w-full rounded-md"
}) => {
  return (
    <div className={className}>
      <MapContainer 
        center={center as L.LatLngExpression} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            position={marker.position as L.LatLngExpression}
          >
            <Popup>
              <div className="p-2">
                {marker.content || marker.title}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;