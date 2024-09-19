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
import { useGroupCategoryStore } from "@/stores/groupCategory";
import { MdDeleteOutline } from "react-icons/md";
import { IGroupCategory } from "@/types";
import { getPublicId } from "@/lib/utils";

export function DeleteGroupCategory({ category }: { category: IGroupCategory }) {
  const { deleteGroupCategory } = useGroupCategoryStore();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await fetch(`/api/categories/group/${category.slug}?id=${category.id}`, { method: "DELETE" });
    if (res.ok) {
      deleteGroupCategory(category.id); // delete from store
      const imagesPublicIds = `${getPublicId(category.image)},${getPublicId(category.banner)}`;
      await fetch(`/api/image?public_ids=${imagesPublicIds}`, { method: "DELETE" });
    }
    setOpen(false);
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-2 text-red-500 ml-5">
        <MdDeleteOutline className="text-xl cursor-pointer" fill="red" onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-left">Delete Category</DialogTitle>
          <DialogDescription className="text-left">Are you sure you want to delete this group category?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="destructive" onClick={handleDelete} className="rounded">
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
