"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Modal from "@/components/Modal/Modal";
import type { Note } from "../../types/note";
import Pagination from "@/components/Pagination/Pagination";
import css from "./NotesPage.module.css";

export default function NotesClient() {
  const [query, setQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["notes", page, query],
    queryFn: () => fetchNotes(query, page),
    placeholderData: (previousData) => previousData,
    refetchOnMount: false,
  });

  // 1. Debounced функция: сохранено имя handleChange, ожидает ТОЛЬКО строку
  const handleChange = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 300);

  // 2. ФУНКЦИЯ-ОБЕРТКА: принимает Event, как требует SearchBox (Event -> String)
  const handleSearchEvent = (e: ChangeEvent<HTMLInputElement>) => {
    // Извлекаем строковое значение
    const value = e.target.value;

    // Передаем извлеченную строку в debounced функцию handleChange
    handleChange(value);
  };

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  useEffect(() => {
    if (isSuccess && query && notes.length === 0) {
      toast.error(`No notes found for your request: "${query}".`);
    }
  }, [isSuccess, notes.length, query]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    const newPage = selected + 1;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* ИСПРАВЛЕНИЕ: Передаем функцию-обертку handleSearchEvent */}
        <SearchBox value={query} onSearch={handleSearchEvent} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageClick}
          />
        )}
        <button
          onClick={openModal}
          className={css.button}
          aria-label="create note"
        >
          + create note
        </button>
      </header>
      <NoteList notes={notes} />
      <div>
        {isLoading && <Loader />}

        {isError && (
          <ErrorMessage
            message={
              error?.message || "An unexpected error occurred during search."
            }
          />
        )}
        {!isLoading && !isError && (
          <>
            {notes.length > 0 && (
              <div className={css.resultsMessage}>
                <p className={css.resultsText}>
                  Found {notes.length} notes.
                  <span className={css.resultsTextSecondary}>
                    (Page {page} of {totalPages})
                  </span>
                </p>
              </div>
            )}
          </>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>

        <Toaster position="top-right" />
      </div>
    </div>
  );
}
