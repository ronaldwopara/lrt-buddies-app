import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Maximize2, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapView({ userName, userLocation, onBack }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [nearbyIncidents, setNearbyIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const firstName = userName ? userName.split(' ')[0] : 'Guest';

  // Mock incidents data (replace with API call later)
  const mockIncidents = [
    {
      id: 1,
      title: "Elevator is Broken",
      trainLine: "Metro",
      station: "Churchill",
      category: "Accessibility",
      status: "resolved",
      lat: 53.5444,
      lon: -113.4909,
      timestamp: "2025-11-02T10:30:00Z"
    },
    {
      id: 2,
      title: "Slippery Ramps",
      trainLine: "Capital",
      station: "Clareview",
      category: "Safety",
      status: "pending",
      lat: 53.5580,
      lon: -113.4150,
      timestamp: "2025-11-02T14:20:00Z"
    },
    {
      id: 3,
      title: "Broken Glass",
      trainLine: "Valley",
      station: "Mill Woods",
      category: "Safety",
      status: "critical",
      lat: 53.4630,
      lon: -113.4640,
      timestamp: "2025-11-02T16:45:00Z"
    },
    {
      id: 4,
      title: "Wheelchair Access Blocked",
      trainLine: "Metro",
      station: "NAIT",
      category: "Accessibility",
      status: "pending",
      lat: 53.5675,
      lon: -113.5050,
      timestamp: "2025-11-02T12:15:00Z"
    }
  ];

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter incidents by distance (2km radius)
  const filterNearbyIncidents = (allIncidents, userLat, userLon) => {
    return allIncidents.filter(incident => {
      const distance = calculateDistance(userLat, userLon, incident.lat, incident.lon);
      return distance <= 2;
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-500';
      case 'pending': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get category color for map markers
  const getCategoryColor = (category) => {
    return category === 'Safety' ? '#EF4444' : '#3B82F6';
  };

  // Create custom icon for markers
  const createCustomIcon = (category, isSelected) => {
    const color = getCategoryColor(category);
    const size = isSelected ? 40 : 30;
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Wait for container to be ready
    setTimeout(() => {
      try {
        // Create map
        const map = L.map(mapRef.current, {
          center: [53.5444, -113.4909],
          zoom: 13,
          zoomControl: true,
        });
        
        // Add tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Force resize
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

        // Load incidents
        setIncidents(mockIncidents);

        // Handle location
        if (userLocation) {
          map.setView([userLocation.lat, userLocation.lon], 14);
          
          // User marker
          L.marker([userLocation.lat, userLocation.lon], {
            icon: L.divIcon({
              html: '<div style="width: 20px; height: 20px; background: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(59,130,246,0.5);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })
          }).addTo(map).bindPopup("You are here");
          
          const nearby = filterNearbyIncidents(mockIncidents, userLocation.lat, userLocation.lon);
          setNearbyIncidents(nearby);
          addMarkersToMap(nearby, map);
        } else {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                map.setView([lat, lon], 14);
                
                L.marker([lat, lon], {
                  icon: L.divIcon({
                    html: '<div style="width: 20px; height: 20px; background: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(59,130,246,0.5);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                  })
                }).addTo(map).bindPopup("You are here");
                
                const nearby = filterNearbyIncidents(mockIncidents, lat, lon);
                setNearbyIncidents(nearby);
                addMarkersToMap(nearby, map);
              },
              (error) => {
                console.error('Location error:', error);
                setLocationError('Unable to get location');
                setNearbyIncidents(mockIncidents);
                addMarkersToMap(mockIncidents, map);
              }
            );
          } else {
            setNearbyIncidents(mockIncidents);
            addMarkersToMap(mockIncidents, map);
          }
        }
      } catch (error) {
        console.error('Map error:', error);
        setLocationError('Map initialization failed');
      }
    }, 50);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add markers to map
  const addMarkersToMap = (incidentsToShow, map) => {
    if (!map) return;
    
    // Clear existing
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add new
    incidentsToShow.forEach(incident => {
      const marker = L.marker([incident.lat, incident.lon], {
        icon: createCustomIcon(incident.category, false)
      })
        .addTo(map)
        .on('click', () => {
          setSelectedIncident(incident);
          const elem = document.getElementById(`incident-${incident.id}`);
          if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      
      markersRef.current.push(marker);
    });
  };

  // Update markers when selection/filter changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add new markers
    const toShow = selectedCategory
      ? nearbyIncidents.filter(i => i.category === selectedCategory)
      : nearbyIncidents;

    toShow.forEach(incident => {
      const isSelected = selectedIncident?.id === incident.id;
      const marker = L.marker([incident.lat, incident.lon], {
        icon: createCustomIcon(incident.category, isSelected)
      })
        .addTo(mapInstanceRef.current)
        .on('click', () => {
          setSelectedIncident(incident);
          const elem = document.getElementById(`incident-${incident.id}`);
          if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      
      markersRef.current.push(marker);
    });
  }, [selectedIncident, selectedCategory, nearbyIncidents]);

  // Handle expand/collapse
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 350);
    }
  }, [isExpanded]);

  // Handle incident click
  const handleIncidentClick = (incident) => {
    setSelectedIncident(incident);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([incident.lat, incident.lon], 16);
    }
  };

  // Filter incidents
  const filteredIncidents = selectedCategory
    ? nearbyIncidents.filter(i => i.category === selectedCategory)
    : nearbyIncidents;

  // Counts
  const accessibilityCount = nearbyIncidents.filter(i => i.category === 'Accessibility').length;
  const safetyCount = nearbyIncidents.filter(i => i.category === 'Safety').length;

  return (
    <div className="h-screen overflow-hidden bg-gray-900 flex flex-col">
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-gray-900 border-b border-gray-800 z-10">
        <button
          onClick={onBack}
          className="p-3 rounded-full bg-blue-700 hover:bg-blue-600 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white">Map View</h1>
        <div className="w-11" />
      </div>

      {/* Map */}
      <div 
        ref={mapRef} 
        className={`w-full bg-gray-800 transition-all duration-300 ${
          isExpanded ? 'h-1/3' : 'h-2/3'
        }`}
        style={{ minHeight: '200px' }}
      />

      {/* Incidents Panel */}
      <div className={`bg-gray-800 transition-all duration-300 ${
        isExpanded ? 'flex-1' : 'h-1/3'
      } flex flex-col overflow-hidden`}>
        
        {/* Panel Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">Nearby incidents</h2>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedCategory(selectedCategory === 'Accessibility' ? null : 'Accessibility')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === 'Accessibility'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Accessibility ({accessibilityCount})
            </button>
            <button
              onClick={() => setSelectedCategory(selectedCategory === 'Safety' ? null : 'Safety')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === 'Safety'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Safety ({safetyCount})
            </button>
          </div>
        </div>

        {/* Error */}
        {locationError && (
          <div className="mx-4 mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
            <p className="text-yellow-300 text-sm">{locationError}</p>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredIncidents.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No nearby incidents</p>
              <p className="text-gray-500 text-sm mt-1">
                No incidents within 2km
              </p>
            </div>
          ) : (
            filteredIncidents.map(incident => (
              <button
                key={incident.id}
                id={`incident-${incident.id}`}
                onClick={() => handleIncidentClick(incident)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedIncident?.id === incident.id
                    ? 'bg-blue-900/50 border-2 border-blue-500'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">{incident.trainLine}</p>
                    <h3 className="text-lg font-semibold text-white mb-1">{incident.title}</h3>
                    <p className="text-sm text-gray-300">{incident.station} Station</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(incident.status)}`} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
