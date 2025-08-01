import { useSortable } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';
import { ResumeSection } from '../types/resume';

interface DragHandleProps {
  section: ResumeSection;
}

export const DragHandle = ({ section }: DragHandleProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useSortable({ 
    id: section.id,
    data: {
      type: 'section',
      section
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        absolute -top-3 -right-3 p-2 bg-primary rounded-full hover:bg-primary/80 
        cursor-grab active:cursor-grabbing shadow-element transition-all duration-normal 
        z-30 border-2 border-background
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <GripVertical className="w-4 h-4 text-primary-foreground" />
    </div>
  );
};