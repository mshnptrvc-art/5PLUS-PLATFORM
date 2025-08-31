// pages/map.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapPage() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*')
      if (!error && data) {
        setProjects(data)
      }
    }
    fetchProjects()
  }, [])

  return (
    <div className="h-screen w-full">
      <MapContainer center={[44.7866, 20.4489]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {projects.map((proj) => (
          <Marker key={proj.id} position={[proj.location_lat, proj.location_lng]}>
            <Popup>
              <strong>{proj.name}</strong><br />
              Status: {proj.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
