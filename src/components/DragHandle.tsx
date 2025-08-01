import { GripVertical } from 'lucide-react';

interface DragHandleProps {
  attributes: any;
  listeners: any;
  isDragging?: boolean;
}

export const DragHandle = ({ attributes, listeners, isDragging }: DragHandleProps) => {
  return (
    <div
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