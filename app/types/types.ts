type Project = {
    id: string,
    name: string
}

type RawNote = {
    id: string
    project_id: string | undefined
    title: string
    markdown: string
    tagIds: string[] // array of tag ids
}

type Note = {
    id: string
    project_id: string | undefined
    title: string
    markdown: string
    tags: Tag[]
}

type NoteData = {
    title: string
    markdown: string
    tags: Tag[]
}

type Tag = {
    id: string
    project_id: string | undefined
    label: string
    priority: string // this will be a hex value

}

type RawTodo = {
    id: string
    project_id: string | undefined
    task: string
    isCompleted: boolean
    deadline: string // this is a date.
    tagIds: string[] // array of tag ids
}

type Todo = {
    id: string
    project_id: string | undefined
    task: string
    isCompleted: boolean
    deadline: string // this is a date.
    tags: Tag[] // array of tag ids
}

type TodoData = {
    task: string
    isCompleted: boolean
    deadline: string // this is a date.
    tags: Tag[] // array of tag ids
}