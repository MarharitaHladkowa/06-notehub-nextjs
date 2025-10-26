import fetchNotes from "@/lib/api";
import NotesClient from "@/app/notes/Notes.client";
import { QueryClient } from "@tanstack/react-query";
const NotesPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", { pages: 1, searchValue: "" }],
    queryFn: () => fetchNotes(``, 1),
  });

  return <NotesClient />;
};

export default NotesPage;
