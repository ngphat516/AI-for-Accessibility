import { BASE_URL } from "../config/apiConfig";

export const createNote = async (userId:number, title:string, content:string) =>{
    const response = await fetch(`${BASE_URL}/notes`,{
        method: "POST",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({
            user_id: userId,
            title: title,
            content: content
        })
    })
    return response.json();
}

export const getNote = async () => {
    const response = await fetch(`${BASE_URL}/notes`,{
        method: "GET",
        headers:{
            "Content-type":"application/json"
        }
    })
    return response.json()
}

export const getuserId = async (userId: number) => {
    const response = await fetch (`${BASE_URL}/notes/user/${userId}`, {
        method: "GET",
        headers:{
            "Content-type":"application/json"
        }
    })
    return response.json();
}

export const getnoteId = async (noteId: number) => {
    const response = await fetch(`${BASE_URL}/notes/${noteId}`,{
        method: "GET",
        headers:{
            "Content-type":"application/json"
        }
    }) 
    return response.json()
}


export const updateNote = async (updateId: number, newTitle: string) => {
    const response = await fetch(`${BASE_URL}/notes/${updateId}`,{
        method: "PUT",
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            title: newTitle
        })
    })
    return response.json();
}

export const deleteNote = async (deleteId: number) => {
    const response = await fetch(`${BASE_URL}/notes/${deleteId}`,{
        method: "DELETE",
        headers:{
            "Content-type" : "application/json"
        }
    })
    return response.json();
}
