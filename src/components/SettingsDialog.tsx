import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIntroSettings } from "@/hooks/useIntroSettings";

const SettingsDialog = () => {
  const { introEnabled, toggleIntro } = useIntroSettings();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
          title="Sozlamalar"
        >
          <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sozlamalar</DialogTitle>
          <DialogDescription>
            Ilova sozlamalarini bu yerda o'zgartiring
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <Label htmlFor="intro-animation" className="text-base font-medium">
                Intro animatsiya
              </Label>
              <p className="text-sm text-muted-foreground">
                Ilova ochilganda intro animatsiyani ko'rsatish
              </p>
            </div>
            <Switch
              id="intro-animation"
              checked={introEnabled}
              onCheckedChange={toggleIntro}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
