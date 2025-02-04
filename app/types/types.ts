type Project = {
    id: string,
    name: string
}

type RawNote = {
    id: string
    project_id: string
    title: string
    markdown: string
    tagIds: string[] // array of tag ids
}

type Note = {
    id: string
    project_id: string
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
    project_id: string
    label: string
    priority: string // this will be a hex value

}

type Todo = {
    id: string
    project_id: string
    task: string
    isCompleted: boolean
    deadline: string // this is a date.
}

type TodoData = {
    task: string
    isCompleted: boolean
    deadline: string // this is a date.
}