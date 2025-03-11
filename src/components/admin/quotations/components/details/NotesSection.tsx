
interface NotesSectionProps {
  notes: string | null | undefined;
}

export const NotesSection = ({ notes }: NotesSectionProps) => {
  if (!notes) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Observações</h3>
      <p className="text-sm text-gray-600">{notes}</p>
    </div>
  );
};
