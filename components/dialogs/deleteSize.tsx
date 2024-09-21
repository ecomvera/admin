import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { deleteSizeDB } from "@/lib/actions/size.action";
import { useEnumsStore } from "@/stores/enums";

export function DeleteSize({ value }: { value: string }) {
  const { removeSize } = useEnumsStore();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    let res = await deleteSizeDB(value);
    if (res.ok) removeSize(value);
    setOpen(false);
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="">
        <MdDeleteOutline className="text-lg cursor-pointer" fill="red" onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-left">Delete Size</DialogTitle>
          <DialogDescription className="text-left">Are you sure you want to delete this?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="destructive" onClick={handleDelete}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
