"use client"

import React, { createContext, useContext, useEffect, useMemo, useState, } from "react";
import { v4 as uuidV4 } from "uuid"
import {addItem, deleteItem, getAllProjects, getItemsByProjectId, NOTES_STORE, PROJECTS_STORE, TAGS_STORE, TODOS_STORE, updateItem } from '../db/db';

type NoteContextType = {
    projects: Project[]
    isLoading: boolean 
    notes: Note[]
    tags: Tag[]
    todos: Todo[]
    currentProject: Project | null
    onCreateProject: (name: string) => Promise<void>
    onDeleteProject: (name: string) => Promise<void>
    setCurrentProject: React.Dispatch<React.SetStateAction<Project | null>>
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


const AppContext = createContext<NoteContextType | undefined>(undefined)

export function NoteProvider({children} : {children: React.ReactNode}) {
    const [projects,setProjects] = useState<Project[]>([])
    const [notes,setNotes] = useState<Note[]>([])
    const [tags,setTags] = useState<Tag[]>([])
    const [todos,setTodos] = useState<Todo[]>([])
    const [currentProject, setCurrentProject] = useState<Project | null>(null)
    const [isLoading,setIsLoading] = useState(true)

    //this useEffect runs on initial render.
    useEffect(() => {
      
            const getProjects = async() => {
            
                const allProjects = await getAllProjects()
                setProjects(allProjects)
                setIsLoading(false)
            }

            getProjects()
        

    },[])

    const handleSetCurrentProject = async() => {

       try {
        const [notesData,tagsData,todosData] = await Promise.all([
            getItemsByProjectId(NOTES_STORE,currentProject?.id),
            getItemsByProjectId(TAGS_STORE,currentProject?.id),
            getItemsByProjectId(TODOS_STORE,currentProject?.id),
        ]) 

        const notes_data = notesData as RawNote[]
        const todos_data = todosData as RawTodo[]

        const newNotes = notes_data.map(({tagIds,...other}) => {
            return {
                ...other,
                tags: tags.filter(tag => tagIds.includes(tag.id))
            }
        })

        const newTodos = todos_data.map(({tagIds,...other}) => {
            return {
                ...other,
                tags: tags.filter(tag => tagIds.includes(tag.id))
            }
        })

        setNotes(newNotes)
        setTags(tagsData)
        setTodos(newTodos)
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

    const onCreateNote = async(data: NoteData) => {

        const newNote: RawNote = {
            id: uuidV4(),
            project_id: currentProject?.id,
            title: data.title,
            markdown: data.markdown,
            tagIds: data.tags.map(tag => tag.id)
        }

        try {
            await addItem(NOTES_STORE,newNote);

            setNotes(prev => [...prev, {
                id: newNote.id,
            project_id: newNote?.project_id,
            title: newNote.title,
            markdown: newNote.markdown,
            tags: data.tags
            }
            ])
        } catch (error) {
            console.error('Error creating note:', error);
            
        }
    }

    const onUpdateNote = async(id:string,{tags,...data}: NoteData) => {

        const updatedNote:RawNote = {
            ...data, // title and markdown
            id,
            project_id: currentProject?.id,
            tagIds: tags.map(tag => tag.id)
        }

        const note =  {
            id,
            project_id: currentProject?.id,
            ...data,
            tags
        }

        try {
            await updateItem(NOTES_STORE,updatedNote);

            setNotes(prev => prev.map(p => p.id === id ? note : p))
        } catch (error) {
            console.log("error updating note:", error);
            
        }


    }

    const onDeleteNote = async(id:string) => {

        try {
            await deleteItem(NOTES_STORE,id)
            setNotes(prev => prev.filter(p => p.id !== id))
            
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }

    const addTag = async(label: string, priority: string ) => {

        const newTag: Tag = {
            id: uuidV4(),
            project_id: currentProject?.id,
            label,
            priority
        }

        try {
            await addItem(TAGS_STORE,newTag)
            setTags(prev => [...prev,newTag])
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    }

    const updateTag = async(id:string, label:string,priority:string) => {

        const updatedTag:Tag = {
            id,
            label,
            priority,
            project_id: currentProject?.id
        }

        await updateItem(TAGS_STORE,updatedTag)
    }

    const deleteTag = async(id:string) => {
        try {
            await deleteItem(TAGS_STORE,id)
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    }

    const addTodo = async({tags,...data}: TodoData) => {

        const newTodo:RawTodo = {
            ...data,
            id:uuidV4(),
            project_id:currentProject?.id,
            tagIds: tags.map(tag => tag.id)
        }

        try {
            await addItem(TODOS_STORE,newTodo)

            setTodos(prev => [...prev,{
                ...data,
                id: newTodo.id,
                project_id: newTodo.project_id,
                tags
            }])
        } catch (error) {
            console.log("error adding todos", error);
        }
    }

    const updateTodo = async(id:string, {tags,...data}: TodoData) => {

        const updatedTodo: RawTodo = {
            ...data,
            id,
            project_id:currentProject?.id,
            tagIds: tags.map(tag => tag.id)
        } 

        const todo: Todo = {
            ...data,
            id,
            project_id:currentProject?.id,
            tags
        }

        try {
            await updateItem(TODOS_STORE,updatedTodo)
            setTodos(prev => prev.map(p => p.id === id ? todo : p))
        } catch (error) {
            console.log("error updating todo", error);
            
        }
    }

    const deleteTodo = async(id:string) => {
        try {
            await deleteItem(TODOS_STORE,id)
            setTodos(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            console.log("error deleting todo",error);
                        
        }
    }


    return (
        <AppContext.Provider
          value={{
            projects,
            isLoading,
            currentProject,
            notes,
            tags,
            todos,
            onCreateProject,
            onDeleteProject,
            setCurrentProject,
            onCreateNote,
            onUpdateNote,
            onDeleteNote,
            addTag,
            updateTag,
            deleteTag,
            addTodo,
            updateTodo,
            deleteTodo
          }}
        >
          {children}
        </AppContext.Provider>
      )
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useNoteContext must be used within a NoteProvider");
      }
      return context;
}