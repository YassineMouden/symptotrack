import { createSupabaseClient } from '~/utils/supabase/server';

interface Note {
  id: number;
  title: string;
}

export default async function Notes() {
  try {
    const supabase = await createSupabaseClient();
    const { data: notes, error } = await supabase.from("notes").select<"notes", Note>();
    
    if (error) {
      throw error;
    }

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Your Notes</h1>
        
        <div className="grid gap-4">
          {notes?.map((note) => (
            <div key={note.id} className="bg-white p-4 rounded-lg shadow dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{note.title}</h2>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (err) {
    return <div>Error loading notes: {err instanceof Error ? err.message : String(err)}</div>;
  }
} 