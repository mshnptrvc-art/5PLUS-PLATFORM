// pages/projects.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [newProject, setNewProject] = useState({ name: '', status: 'draft' })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*')
    if (data) setProjects(data)
  }

  const addProject = async () => {
    const { error } = await supabase.from('projects').insert([newProject])
    if (!error) {
      setNewProject({ name: '', status: 'draft' })
      fetchProjects()
    }
  }

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    fetchProjects()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects Overview</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Naziv projekta"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={addProject} className="bg-green-600 text-white px-4 py-2 rounded">
          Dodaj
        </button>
      </div>

      <ul>
        {projects.map((proj) => (
          <li key={proj.id} className="border p-2 mb-2 flex justify-between items-center">
            <div>
              <strong>{proj.name}</strong> — Status: {proj.status}
            </div>
            <button
              onClick={() => deleteProject(proj.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Obriši
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
