import { Settings, Sun, Moon } from "lucide-react";
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
import { useTheme } from "@/hooks/useTheme";

const SettingsDialog = () => {
  const { introEnabled, toggleIntro } = useIntroSettings();
  const { theme, toggleTheme } = useTheme();

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
          {/* Theme Toggle */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <Label htmlFor="theme-toggle" className="text-base font-medium flex items-center gap-2">
                {theme === "light" ? (
                  <Sun className="w-4 h-4 text-yellow-500" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-400" />
                )}
                Mavzu
              </Label>
              <p className="text-sm text-muted-foreground">
                {theme === "light" ? "Kunduzgi rejim" : "Tungi rejim"}
              </p>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>

          {/* Intro Animation Toggle */}
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
