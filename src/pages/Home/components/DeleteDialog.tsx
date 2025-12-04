import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const DeleteDialog = ({ open, setOpen, onConfirm }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer ce design ?</DialogTitle>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <button onClick={() => setOpen(false)}>Annuler</button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Supprimer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
