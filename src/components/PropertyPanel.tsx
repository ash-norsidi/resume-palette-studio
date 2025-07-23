import { ResumeSection } from '../types/resume';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { X, Trash2, Palette, Type, Layout } from 'lucide-react';

interface PropertyPanelProps {
  section: ResumeSection;
  onUpdateStyle: (style: any) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const PropertyPanel = ({
  section,
  onUpdateStyle,
  onDelete,
  onClose
}: PropertyPanelProps) => {
  const handleStyleChange = (property: string, value: any) => {
    onUpdateStyle({ [property]: value });
  };

  return (
    <div className="w-80 bg-sidebar border-l border-sidebar-border h-screen overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Properties</h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Section Info */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-sm">Section Info</h4>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Type</div>
              <div className="text-sm font-medium capitalize">{section.type}</div>
            </div>
          </Card>

          {/* Typography */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-sm">Typography</h4>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fontSize" className="text-xs text-muted-foreground">
                  Font Size
                </Label>
                <Input
                  id="fontSize"
                  type="number"
                  value={section.style.fontSize || 14}
                  onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                  className="mt-1"
                  min="8"
                  max="72"
                />
              </div>
              
              <div>
                <Label htmlFor="fontWeight" className="text-xs text-muted-foreground">
                  Font Weight
                </Label>
                <select
                  id="fontWeight"
                  value={section.style.fontWeight || 400}
                  onChange={(e) => handleStyleChange('fontWeight', parseInt(e.target.value))}
                  className="w-full mt-1 px-3 py-2 text-sm border border-input rounded-md bg-background"
                >
                  <option value={300}>Light</option>
                  <option value={400}>Normal</option>
                  <option value={500}>Medium</option>
                  <option value={600}>Semi Bold</option>
                  <option value={700}>Bold</option>
                </select>
              </div>

              <div>
                <Label htmlFor="textAlign" className="text-xs text-muted-foreground">
                  Text Align
                </Label>
                <select
                  id="textAlign"
                  value={section.style.textAlign || 'left'}
                  onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm border border-input rounded-md bg-background"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Colors */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-sm">Colors</h4>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="textColor" className="text-xs text-muted-foreground">
                  Text Color
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="textColor"
                    type="color"
                    value={section.style.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded-md"
                  />
                  <Input
                    type="text"
                    value={section.style.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="flex-1 text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="backgroundColor" className="text-xs text-muted-foreground">
                  Background Color
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={section.style.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="w-12 h-10 p-1 border rounded-md"
                  />
                  <Input
                    type="text"
                    value={section.style.backgroundColor || 'transparent'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="flex-1 text-sm"
                    placeholder="transparent"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Spacing */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-sm">Spacing</h4>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="padding" className="text-xs text-muted-foreground">
                  Padding (px)
                </Label>
                <Input
                  id="padding"
                  type="number"
                  value={section.style.padding || 16}
                  onChange={(e) => handleStyleChange('padding', parseInt(e.target.value))}
                  className="mt-1"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <Label htmlFor="marginBottom" className="text-xs text-muted-foreground">
                  Bottom Margin (px)
                </Label>
                <Input
                  id="marginBottom"
                  type="number"
                  value={section.style.marginBottom || 16}
                  onChange={(e) => handleStyleChange('marginBottom', parseInt(e.target.value))}
                  className="mt-1"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </Card>

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="destructive"
              onClick={onDelete}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Section
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};