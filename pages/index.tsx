import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// Load Leaflet dynamically (only client-side)
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

// Init Supabase client (env vars from Vercel)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase.from("projects").select("*");
    if (!error && data) setProjects(data);
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="p-4 bg-gray-800 text-white flex justify-between">
        <h1 className="text-xl font-bold">5plus</h1>
        <Button onClick={fetchProjects}>Reload Projects</Button>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 p-2 bg-gray-100">
        <a href="#map">Mapa</a>
        <a href="#projects">Projects Overview</a>
      </div>

      <main className="flex-1 overflow-auto">
        {/* Map Tab */}
        <section id="map" className="h-full w-full">
          <MapContainer center={[44.8176, 20.4569]} zoom={6} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {projects.map((p) => (
              <Marker key={p.id} position={[p.location_lat || 44.8176, p.location_lng || 20.4569]}>
                <Popup>
                  <div>
                    <h3 className="font-bold">{p.name}</h3>
                    <p>Status: {p.status}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>

        {/* Projects Overview */}
        <section id="projects" className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="border rounded-xl p-4 shadow bg-white">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p>Status: {p.status}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

