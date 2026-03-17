import { BASE_URL } from "../config/apiConfig";

export const createMessage = async (userId:number, title:string) =>{
    const response = await fetch(`${BASE_URL}/chatmessages/`,{
        method: "POST",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({
            user_id: userId,
            title: title
        })
    })
    return response.json();
}

export const chatMessage = async () => {
    const response = await fetch(`${BASE_URL}/chatmessages/`,{
        method: "GET",
        headers:{
            "Content-type":"application/json"
        }
    })
    return response.json()
}

export const chatMessageId = async (messageId: number) => {
    const response = await fetch(`${BASE_URL}/chatmessages/${messageId}`,{
        method: "GET",
        headers:{
            "Content-type":"application/json"
        }
    }) 
    return response.json()
}


export const updateMessage = async (updateId: number, newTitle: string) => {
    const response = await fetch(`${BASE_URL}/chatmessages/${updateId}`,{
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

export const deleteMessage = async (deleteId: number) => {
    const response = await fetch(`${BASE_URL}/chatmessages/${deleteId}`,{
        method: "DELETE",
        headers:{
            "Content-type" : "application/json"
        }
    })
    return response.json();
}
