import { BASE_URL } from "../config/apiConfig";

export const createNoteMessageSources = async (noteId: number, chatmessagesId: number) =>{
    const response = await fetch(`${BASE_URL}/note-sources/`,{
        method: "POST",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({
            note_id: noteId,
            chat_message_id : chatmessagesId
        })
    })
    return response.json();
}

export const getNoteMessageSources = async (noteId: Number) => {
    const response = await fetch (`${BASE_URL}/note-sources/note/${noteId}`,{
        method: "GET",
        headers:{
            "Content-type":"application/json"
        }
    })
    return response.json()
}

export const deleteNoteMessageSources = async (deteleId: number, chatmessagesId:number) => {
    const response = await fetch(`${BASE_URL}/note-sources/${deteleId}/${chatmessagesId}`,{
        method: "DELETE",
        headers:{
            "Content-type":"application/json"
        }
    })
    return response.json()
}