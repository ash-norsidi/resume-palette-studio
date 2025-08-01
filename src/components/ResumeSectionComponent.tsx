import { ResumeSection } from '../types/resume';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { DragHandle } from './DragHandle';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ResumeSectionComponentProps {
  section: ResumeSection;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (data: any) => void;
  onResize: (size: { width: number; height: number }) => void;
}

export const ResumeSectionComponent = ({
  section,
  isSelected,
  onSelect,
  onUpdate,
  onResize
}: ResumeSectionComponentProps) => {
  // Use useSortable for the container - but only apply listeners to the drag handle
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: section.id,
    data: {
      type: 'section',
      section
    }
  });
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const handleArrayAdd = (field: string) => {
    const currentArray = section.data[field] || [];
    const newItem = getNewItemForType(section.type);
    onUpdate({ [field]: [...currentArray, newItem] });
  };

  const handleArrayUpdate = (field: string, index: number, itemData: any) => {
    const currentArray = section.data[field] || [];
    const updatedArray = currentArray.map((item: any, i: number) => 
      i === index ? { ...item, ...itemData } : item
    );
    onUpdate({ [field]: updatedArray });
  };

  const handleArrayRemove = (field: string, index: number) => {
    const currentArray = section.data[field] || [];
    const updatedArray = currentArray.filter((_: any, i: number) => i !== index);
    onUpdate({ [field]: updatedArray });
  };

  const getNewItemForType = (type: string) => {
    switch (type) {
      case 'experience':
        return {
          id: Date.now(),
          company: 'Company Name',
          position: 'Job Title',
          startDate: '2023',
          endDate: 'Present',
          location: 'City, State',
          description: 'Describe your responsibilities and achievements.'
        };
      case 'education':
        return {
          id: Date.now(),
          institution: 'University Name',
          degree: 'Bachelor of Science',
          field: 'Your Field',
          startDate: '2019',
          endDate: '2023',
          location: 'City, State',
          gpa: '3.8'
        };
      default:
        return {};
    }
  };

  const renderSectionContent = () => {
    switch (section.type) {
      case 'header':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Input
                value={section.data.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-2xl font-bold text-center border-none shadow-none text-foreground"
                placeholder="Your Name"
              />
              <Input
                value={section.data.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-lg text-center border-none shadow-none text-muted-foreground"
                placeholder="Professional Title"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-center">
              <Input
                value={section.data.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
                className="text-center border-none shadow-none"
              />
              <Input
                value={section.data.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="text-center border-none shadow-none"
              />
              <Input
                value={section.data.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, State"
                className="text-center border-none shadow-none"
              />
              <Input
                value={section.data.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="yourwebsite.com"
                className="text-center border-none shadow-none"
              />
            </div>
          </div>
        );

      case 'summary':
        return (
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b border-border pb-1">
              Professional Summary
            </h3>
            <Textarea
              value={section.data.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write a compelling professional summary that highlights your key strengths and career objectives."
              className="border-none shadow-none resize-none min-h-[80px]"
            />
          </div>
        );

      case 'experience':
        return (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-primary border-b border-border pb-1">
                Work Experience
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleArrayAdd('items')}
                className="h-8"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-4">
              {(section.data.items || []).map((item: any, index: number) => (
                <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={item.position || ''}
                          onChange={(e) => handleArrayUpdate('items', index, { position: e.target.value })}
                          placeholder="Job Title"
                          className="font-medium"
                        />
                        <div className="grid grid-cols-2 gap-1">
                          <Input
                            value={item.startDate || ''}
                            onChange={(e) => handleArrayUpdate('items', index, { startDate: e.target.value })}
                            placeholder="Start Date"
                          />
                          <Input
                            value={item.endDate || ''}
                            onChange={(e) => handleArrayUpdate('items', index, { endDate: e.target.value })}
                            placeholder="End Date"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={item.company || ''}
                          onChange={(e) => handleArrayUpdate('items', index, { company: e.target.value })}
                          placeholder="Company Name"
                        />
                        <Input
                          value={item.location || ''}
                          onChange={(e) => handleArrayUpdate('items', index, { location: e.target.value })}
                          placeholder="Location"
                        />
                      </div>
                      <Textarea
                        value={item.description || ''}
                        onChange={(e) => handleArrayUpdate('items', index, { description: e.target.value })}
                        placeholder="Describe your responsibilities and achievements"
                        className="min-h-[60px]"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleArrayRemove('items', index)}
                      className="ml-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-primary border-b border-border pb-1">
                Education
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleArrayAdd('items')}
                className="h-8"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-4">
              {(section.data.items || []).map((item: any, index: number) => (
                <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={item.degree || ''}
                          onChange={(e) => handleArrayUpdate('items', index, { degree: e.target.value })}
                          placeholder="Degree"
                          className="font-medium"
                        />
                        <Input
                          value={item.field || ''}
                          onChange={(e) => handleArrayUpdate('items', index, { field: e.target.value })}
                          placeholder="Field of Study"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={item.institution || ''}
                          onChange={(e) => handleArrayUpdate('items', index, { institution: e.target.value })}
                          placeholder="Institution Name"
                        />
                        <Input
                          value={item.location || ''}
                          onChange={(e) => handleArrayUpdate('items', index, { location: e.target.value })}
                          placeholder="Location"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          value={item.startDate || ''}
                          onChange={(e) => handleArrayUpdate('items', index, { startDate: e.target.value })}
                          placeholder="Start Date"
                        />
                        <Input
                          value={item.endDate || ''}
                          onChange={(e) => handleArrayUpdate('items', index, { endDate: e.target.value })}
                          placeholder="End Date"
                        />
                        <Input
                          value={item.gpa || ''}
                          onChange={(e) => handleArrayUpdate('items', index, { gpa: e.target.value })}
                          placeholder="GPA (optional)"
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleArrayRemove('items', index)}
                      className="ml-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b border-border pb-1">
              Skills
            </h3>
            <Textarea
              value={(section.data.skills || []).join(', ')}
              onChange={(e) => handleInputChange('skills', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
              placeholder="JavaScript, React, Node.js, Python, SQL, Git (separate with commas)"
              className="border-none shadow-none resize-none min-h-[60px]"
            />
          </div>
        );

      default:
        return <div>Unknown section type</div>;
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const currentWidth = typeof section.size.width === 'number' ? section.size.width : 400;
  const currentHeight = typeof section.size.height === 'number' ? section.size.height : 200;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'z-10' : ''}`}
    >
      {/* Isolated Drag Handle - Only this handle triggers drag */}
      <DragHandle attributes={attributes} listeners={listeners} isDragging={isDragging} />

      <Resizable
        width={currentWidth}
        height={currentHeight}
        onResize={(e, { size }) => {
          onResize({ width: size.width, height: size.height });
        }}
        minConstraints={[200, 100]}
        maxConstraints={[800, 600]}
        resizeHandles={['se']}
      >
        <Card
          style={{
            width: currentWidth,
            height: currentHeight,
          }}
          className={`
            relative p-6 cursor-pointer transition-all duration-normal hover:shadow-md
            ${isSelected 
              ? 'ring-2 ring-primary ring-offset-2 shadow-element' 
              : 'border border-border hover:border-primary/50'
            }
          `}
          onClick={onSelect}
        >          
          <div className="h-full overflow-auto">
            {renderSectionContent()}
          </div>
        </Card>
      </Resizable>
    </div>
  );
};