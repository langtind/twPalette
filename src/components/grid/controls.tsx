import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Method, Score } from "@/lib/contrast-utils.ts";

interface ControlsProps {
  method: Method;
  score: Score;
  useAutoTextColor: boolean;
  onMethodChange: (value: Method) => void;
  onScoreChange: (value: Score) => void;
  onAutoTextColorChange: (value: boolean) => void;
}

export function Controls({
  method,
  score,
  useAutoTextColor,
  onMethodChange,
  onScoreChange,
  onAutoTextColorChange,
}: ControlsProps) {
  return (
    <div className="w-48 space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-400">METHOD</h3>
        <RadioGroup value={method} onValueChange={onMethodChange}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="apca" id="apca" />
              <Label htmlFor="apca" className="text-sm text-gray-500">
                APCA (Possible WCAG 3)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wcag2" id="wcag2" />
              <Label htmlFor="wcag2" className="text-sm text-gray-500">
                WCAG 2
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-400">SCORE</h3>
        <RadioGroup value={score} onValueChange={onScoreChange}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="60" id="60" />
              <Label htmlFor="60" className="text-sm text-gray-500">
                60%+ (Similar to AA)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="80" id="80" />
              <Label htmlFor="80" className="text-sm text-gray-500">
                80%+ (Similar to AAA)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="text-sm text-gray-500">
                All
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="auto-text-color"
          checked={useAutoTextColor}
          onCheckedChange={onAutoTextColorChange}
        />
        <Label htmlFor="auto-text-color" className="text-sm text-gray-500">
          Use automatic text color
        </Label>
      </div>
    </div>
  );
}
