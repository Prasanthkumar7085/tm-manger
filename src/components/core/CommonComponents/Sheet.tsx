import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

type SheetDemoProps = {
  label: string;
  sheetTitle: string;
  onOKClick: () => void;
  extraField: string;
  memberData: { user_id: number; role: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SheetDemo = ({
  sheetTitle,
  label,
  onOKClick,
  memberData,
  handleInputChange,
}: SheetDemoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">{label}</Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-100">
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user_id" className="text-right">
              User ID
            </Label>
            <Input
              id="user_id"
              name="user_id"
              value={memberData.user_id}
              placeholder="Enter User ID"
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input
              id="role"
              name="role"
              value={memberData.role}
              placeholder="Enter Role"
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <SheetClose asChild>
            <Button type="submit" onClick={onOKClick}>
              Add
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
