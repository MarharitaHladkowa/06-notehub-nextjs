import axios from "axios";
import type { Note, NewNote } from "../types/note";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

axios.defaults.headers.common.Authorization = `Bearer ${
  process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
}`;

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (query: string, page: number) => {
  const response = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      search: query,
      page,
      perPage: 12,
    },
  });
  return response.data;
};
export const createNote = async (newNote: NewNote) => {
  const response = await axios.post<Note>("/notes", newNote);
  return response.data;
};
export const deleteNote = async (noteId: string) => {
  const response = await axios.delete<Note>(`/notes/${noteId}`);
  return response.data;
};
export default fetchNotes;
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
};
