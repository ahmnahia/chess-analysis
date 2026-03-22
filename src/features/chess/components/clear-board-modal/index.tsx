"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactSVG } from "react-svg";
import { SIDEBAR_INFO_CLASSES } from "../sidebar-info/constants";
import useClearBoardModal from "./use-clear-board-modal";

export function ClearBoardModal() {
  const { handleClearBoard, isResetDisabled } = useClearBoardModal();

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            className={SIDEBAR_INFO_CLASSES.navButton}
            variant="outline"
            disabled={isResetDisabled}
          >
            <ReactSVG
              className="[&_svg]:dark:fill-white"
              src="/icons/clear.svg"
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Board?</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset the board?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="text-red-500" onClick={handleClearBoard}>
                Yes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
