import {BASE_URL} from "../config/apiConfig"

export const createConversation = async ( userId:number, title: string) => {
    const response = await fetch(`${BASE_URL}/conversations/`, 
        {
            method : "POST",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                title: title
            })
        }
    )
    return response.json(); 
}

export const getAllConversation = async () => {
    const response = await fetch(`${BASE_URL}/conversations/`,{
        method : "GET",
        headers: {
            "Content-type":"application/json"
        }
    });
    return response.json();
}

export const getConversationByUser = async (userId:number) => {
    const response = await fetch(`${BASE_URL}/conversations/user/${userId}`,{
        method: "GET",
        headers:{
          "Content-type": "application/json"  
        },
    })
    return response.json();
}

export const getConversationById = async (conversationId:number) => {
    const response = await fetch (`${BASE_URL}/conversations/${conversationId}`, {
        method:"GET",
        headers:{
            "Content-type": "application/json"
        }
    })
    return response.json();
}

export const updateConversation = async (updateId:number, newTitle:string) => {
    const response = await fetch (`${BASE_URL}/conversations/${updateId}`,{
        method: "PUT",
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            title: newTitle,
        })
    })
    return response.json()
}

export const deleteConversation = async (deleteId:number) => {
    const response = await fetch (`${BASE_URL}/conversations/${deleteId}`,{
        method: "DELETE",
        headers:{
            "Content-type":"application/json"
        }
    })
    return response.json();
}
