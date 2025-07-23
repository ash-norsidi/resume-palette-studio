import { useDraggable } from '@dnd-kit/core';
import { DragItem } from '../types/resume';
import { Card } from './ui/card';
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award,
  Image,
  Type,
  Square,
  Minus
} from 'lucide-react';

const resumeSections = [
  {
    id: 'header',
    label: 'Header',
    icon: User,
    description: 'Name, title, and contact info'
  },
  {
    id: 'summary',
    label: 'Professional Summary',
    icon: FileText,
    description: 'Brief overview of your background'
  },
  {
    id: 'experience',
    label: 'Work Experience',
    icon: Briefcase,
    description: 'Employment history and achievements'
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    description: 'Academic background and qualifications'
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Award,
    description: 'Technical and soft skills'
  }
];

const basicElements = [
  {
    id: 'text',
    label: 'Text Block',
    icon: Type,
    description: 'Custom text content'
  },
  {
    id: 'image',
    label: 'Image',
    icon: Image,
    description: 'Profile photo or graphics'
  },
  {
    id: 'shape',
    label: 'Shape',
    icon: Square,
    description: 'Rectangle or circle'
  },
  {
    id: 'divider',
    label: 'Divider',
    icon: Minus,
    description: 'Section separator line'
  }
];

function DraggableItem({ item, type }: { item: any; type: 'section' | 'element' }) {
  const dragItem: DragItem = {
    type: 'section',
    sectionType: item.id,
    label: item.label
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: item.id,
    data: dragItem,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const Icon = item.icon;

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-4 cursor-grab active:cursor-grabbing transition-all duration-normal hover:shadow-md border border-border/50 hover:border-primary/50 ${
        isDragging ? 'opacity-50 scale-105 rotate-1' : ''
      }`}
      style={style}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary-light rounded-md">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-foreground truncate">
            {item.label}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </Card>
  );
}

export const Sidebar = () => {
  return (
    <aside className="w-80 bg-gradient-sidebar border-r border-sidebar-border h-screen overflow-y-auto">
      <div className="p-6">
        <div className="space-y-6">
          {/* Resume Sections */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Resume Sections
            </h3>
            <div className="space-y-3">
              {resumeSections.map((section) => (
                <DraggableItem
                  key={section.id}
                  item={section}
                  type="section"
                />
              ))}
            </div>
          </div>

          {/* Basic Elements */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Basic Elements
            </h3>
            <div className="space-y-3">
              {basicElements.map((element) => (
                <DraggableItem
                  key={element.id}
                  item={element}
                  type="element"
                />
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-primary-light/30 p-4 rounded-lg border border-primary/20">
            <h4 className="font-medium text-primary mb-2">💡 Quick Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Drag sections to the canvas to add them</li>
              <li>• Click elements to edit their content</li>
              <li>• Use the property panel to customize styling</li>
              <li>• Export to PDF when ready</li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};