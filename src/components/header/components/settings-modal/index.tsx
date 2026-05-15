import { ReactSVG } from "react-svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useSelector, useDispatch } from "react-redux";

import { selectChessState, setEngineDepth } from "@/features/chess/chess-slice";
import { ENGINE_DEPTH_MAX, ENGINE_DEPTH_MIN } from "./constants";
export default function SettingsModal() {
  const { engineDepth } = useSelector(selectChessState);
  const dispatch = useDispatch();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer">
          <ReactSVG
            src="/icons/settings.svg"
            className="[&_svg]:w-8 [&_svg]:fill-zinc-950 [&_svg]:dark:fill-white rotate-12"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your settings here. For now, only the engine depth can be
            adjusted.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span>Depth</span>
            <span>{engineDepth}</span>
          </div>
          <Slider
            max={ENGINE_DEPTH_MAX}
            min={ENGINE_DEPTH_MIN}
            step={1}
            value={[engineDepth]}
            onValueChange={(value) => dispatch(setEngineDepth(value[0]))}
            className="w-full"
          />
          <p className="text-sm text-zinc-500">
            Higher depth improves engine accuracy, but analysis will take
            longer.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
