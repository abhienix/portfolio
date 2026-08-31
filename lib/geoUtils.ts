import * as THREE from 'three';

// Converts lat/lon degrees → 3D Cartesian on Three.js SphereGeometry UV mapping
// In Three.js SphereGeometry, UV mapping begins at lon=-180 (u=0) to lon=+180 (u=1).
// This requires z = -radius * cos(phi) * sin(theta) so East (+) maps accurately to East continents.
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (lat * Math.PI) / 180;
  const theta = (lon * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.cos(theta),
    radius * Math.sin(phi),
    -radius * Math.cos(phi) * Math.sin(theta)
  );
}

// 3D Cartesian → lat/lon degrees
export function vector3ToLatLon(v: THREE.Vector3): { lat: number; lon: number } {
  const n = v.clone().normalize();
  return {
    lat: (Math.asin(n.y) * 180) / Math.PI,
    lon: (-Math.atan2(n.z, n.x) * 180) / Math.PI,
  };
}
