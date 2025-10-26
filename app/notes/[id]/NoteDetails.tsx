import NoteDetailsClient from "../NoteDetails.client";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
interface NotesPageProps {
  params: Promise<{ id: string }>;
}

const NotesPage = async ({ params }: NotesPageProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NotesPage;
