import { BASE_URL } from "../config/apiConfig";


export const createMessage = async (conversationId: number, senderType: 'user' | 'ai', content: string) => {
  const response = await fetch(`${BASE_URL}/messages/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },

    body: JSON.stringify({
      conversation_id: conversationId,
      sender_type: senderType,
      content: content,
    }),
  });
  return response.json();
};


export const getMessages = async () => {
  const response = await fetch(`${BASE_URL}/messages/`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  return response.json();
};


export const getMessageById = async (messageId: number) => {
  const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  return response.json();
};

export const updateMessage = async (updateId: number, newContent: string) => {
  const response = await fetch(`${BASE_URL}/messages/${updateId}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      content: newContent,
    }),
  });
  return response.json();
};

export const deleteMessage = async (deleteId: number) => {
  const response = await fetch(`${BASE_URL}/messages/${deleteId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  });
  return response.json();
};