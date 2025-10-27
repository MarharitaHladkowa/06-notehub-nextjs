"use client"; // Компонент для отображения списка заметок
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note"; // Импорт типа Note
import css from "@/NoteList.module.css"; // Импорт стилей
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
}
export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteNoteMutate } = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (noteId: string) => {
    deleteNoteMutate(noteId);
  };

  return (
    <ul className={css.list}>
      {" "}
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <Link href={`/notes/${note.id}`} className={css.content}>
            {note.content}
          </Link>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`} className={css.button}>
              View details
            </Link>
            <button
              type="button"
              className={css.button}
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
