import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid"

type NoteContextType = {
    projects: Project[]
    notes: Note[]
    tags: Tag[]
    todos: Todo[]
    onCreateProject: (name: string) => Promise<void>
    onDeleteProject: (name: string) => Promise<void>
    setCurrentProject: (name: string) => Promise<void>
    onCreateNote: (data: NoteData) => Promise<void>
    onUpdateNote: (id: string, data: NoteData) => Promise<void>
    onDeleteNote: (id: string) => Promise<void>
    addTag: (label: string, priority: string) => Promise<void>
    updateTag: (id: string, label: string, priority: string) => Promise<void>
    deleteTag: (id: string) => Promise<void>
    addTodo: (data: TodoData) => Promise<void>
    updateTodo: ( id: string, data: TodoData) => Promise<void>
    deleteTodo: (id:string) => Promise<void>
}


const NoteContext = createContext<NoteContextType | undefined>(undefined)

export function NoteProvider({children} : {children: React.ReactNode}) {
    const [projects,setProjects] = useState<Project[]>([])
    const [notes,setNotes] = useState<Note[]>([])
    const [tags,setTags] = useState<Tag[]>([])
    const [todos,setTodos] = useState<Todo[]>([])
    const [currentProject, setCurrentProject] = useState<Project | null>(null)


    const handleSetCurrentProject = async() => {

       try {
        const [notesData,tagsData,todosData] = await Promise.all([
            getItemsByProjectId(NOTES_STORE,currentProject?.id),
            getItemsByProjectId(TAGS_STORE,currentProject?.id),
            getItemsByProjectId(TODOS_STORE,currentProject?.id),
        ]) 

        setNotes(notesData)
        setTags(tagsData)
        setTodos(todosData)
       } catch (error) {
            console.log(error);
            
       }
    }

    //whenever we toggle projects, this useEffect fetches all the notes, tags and todos of the current project.
    useEffect(() => {
        handleSetCurrentProject() 
    },[currentProject])

    const onCreateProject = async(name: string) => {

        const newProject: Project = {
            id: uuidV4(),
            name: name
        }

        try {
            await addItem(PROJECTS_STORE,newProject)
            setProjects(prevProjects => [...prevProjects,newProject])
            // during the inception of the app, currentProject will be null
            if (!currentProject) {
                setCurrentProject(currentProject)
              }
        } catch (error) {
            console.error('Error creating project:', error);
        }
    }

    const onDeleteProject = async(id: string) => {

        // first delete the notes, tags and todos of the current project
        const currentProjectNotes = await getItemsByProjectId(NOTES_STORE,id)
        const currentProjectTags = await getItemsByProjectId(TAGS_STORE,id)
        const currentProjectTodos = await getItemsByProjectId(TODOS_STORE,id)

        try {
            await Promise.all([
                ...currentProjectNotes.map(note => deleteItem(NOTES_STORE, note.id)),
                ...currentProjectTags.map(tag => deleteItem(TAGS_STORE, tag.id)),
                ...currentProjectTodos.map(todo => deleteItem(TAGS_STORE, todo.id)),
                deleteItem(PROJECTS_STORE, id)
              ]);
              
              setProjects(prev => prev.filter(project => project.id !== id))

              if(currentProject?.id === id){
                //redirect to the home page.
              }

        } catch (error) {
            console.log("error in deleting the project",error);
        }
    }

}