"use client"

import { Input } from "@/components/ui/input";
import { useAppContext } from "./context/NoteContext";
import { Button } from "@/components/ui/button";

export default function Home() {
  const {projects} = useAppContext()
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
          <div>Hi</div>
          
          ) : (<form className="flex items-center gap-2 pt-6">
            <Input placeholder="Project name..."/>
            <Button type="submit">Create New Project</Button>
        </form>)} 
        <div className="">

        </div>
      </section>
    </div>
  );
}
