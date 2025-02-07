"use client"

import { Input } from "@/components/ui/input";
import { useAppContext } from "./context/NoteContext";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import LoadingOverlay from "./custom-components/LoadingOverlay";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function Home() {
  const {projects,onCreateProject,isLoading} = useAppContext()

  const projectNameRef = useRef<HTMLInputElement>(null)
  const [selectedProjectId,setSelectedProjectId] = useState("")
  const router = useRouter()

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(projectNameRef.current)
      await onCreateProject(projectNameRef.current.value)
    
  }

  const handleNavigate = () => {
    router.push(`/${selectedProjectId}/all`)
  }
  
  if(isLoading)
  {
      return <LoadingOverlay />
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      <section className="text-center flex flex-col items-center justify-center bg-white shadow-lg rounded-2xl p-6 w-[50%]">
        <h1 className="text-5xl font-medium mb-2">
          Quick<span className="text-green-500">Scribe</span>
        </h1>

        {/* Card Component */}
          <p className="text-gray-600 text-sm mt-2">
            A fast and efficient way to take notes, organize thoughts, and stay productive.
          </p>
        

        {/* Empty space below for additional elements */}

        {projects.length > 0 ? (
         
         <div className="flex items-center w-full justify-center gap-2 pt-6 ">
           <Select
          onValueChange={(value) => {
          
            //get the id from the name.
            const id = projects.find((project) => project.name === value)?.id  

            if(id)
              setSelectedProjectId(id)
          }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.name}>{project.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="default" onClick={handleNavigate}>Enter</Button>
         </div>
          
          ) : (<form onSubmit={handleSubmit} className="flex items-center justify-center w-full gap-2 pt-6">
            <Input 
            className="w-[50%]"
            ref={projectNameRef} 

             placeholder="Project name..."
             />
            <Button type="submit">Create New Project</Button>
        </form>)} 
        <div className="">

        </div>
      </section>
    </div>
  );
}
