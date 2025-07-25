import { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { ResumeSection, DragItem } from '../types/resume';
import { Button } from './ui/button';
import { Download, FileText } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import { toast } from 'sonner';
import { ThemeToggle } from './ThemeToggle';

export const ResumeBuilder = () => {
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Configure sensors for both mouse and touch devices
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 15, // Increased distance to avoid conflicts with resize handles
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300, // Increased delay
      tolerance: 8,
    },
  });

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 15, // Increased distance to avoid conflicts with resize handles
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Set the drag item for overlay
    const dragItem = active.data.current as DragItem;
    setActiveDragItem(dragItem);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveDragItem(null);
      return;
    }

    // Handle reordering existing sections
    if (active.id !== over.id) {
      const activeIndex = sections.findIndex(section => section.id === active.id);
      const overIndex = sections.findIndex(section => section.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        setSections(prev => arrayMove(prev, activeIndex, overIndex));
        setActiveId(null);
        setActiveDragItem(null);
        return;
      }
    }

    // If dropping on canvas (adding new section from sidebar)
    if (over.id === 'canvas') {
      const dragItem = active.data.current as DragItem;
      
      if (dragItem.type === 'section') {
        const newSection: ResumeSection = {
          id: `${dragItem.sectionType}-${Date.now()}`,
          type: dragItem.sectionType,
          position: { x: 50, y: 50 + sections.length * 100 },
          size: { width: 400, height: 200 },
          data: getInitialSectionData(dragItem.sectionType),
          style: {
            fontSize: 14,
            fontWeight: 400,
            color: '#000000',
            backgroundColor: 'transparent',
            padding: 16,
            marginBottom: 16,
          }
        };
        
        setSections(prev => [...prev, newSection]);
        toast.success(`${dragItem.label} section added to resume`);
      }
    }
    
    setActiveId(null);
    setActiveDragItem(null);
  };

  const getInitialSectionData = (type: string) => {
    switch (type) {
      case 'header':
        return {
          name: 'Your Name',
          title: 'Professional Title',
          email: 'email@example.com',
          phone: '+1 (555) 123-4567',
          location: 'City, State',
          website: 'yourwebsite.com'
        };
      case 'summary':
        return {
          content: 'Write a compelling professional summary that highlights your key strengths and career objectives.'
        };
      case 'experience':
        return {
          items: [{
            id: 1,
            company: 'Company Name',
            position: 'Job Title',
            startDate: '2023',
            endDate: 'Present',
            location: 'City, State',
            description: 'Describe your key responsibilities and achievements in this role.'
          }]
        };
      case 'education':
        return {
          items: [{
            id: 1,
            institution: 'University Name',
            degree: 'Bachelor of Science',
            field: 'Your Field of Study',
            startDate: '2019',
            endDate: '2023',
            location: 'City, State',
            gpa: '3.8'
          }]
        };
      case 'skills':
        return {
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git']
        };
      default:
        return {};
    }
  };

  const updateSection = (sectionId: string, data: any) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, data: { ...section.data, ...data } }
        : section
    ));
  };

  const updateSectionStyle = (sectionId: string, style: any) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, style: { ...section.style, ...style } }
        : section
    ));
  };

  const updateSectionSize = (sectionId: string, size: { width: number; height: number }) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, size: { ...section.size, ...size } }
        : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
    setSelectedSectionId(null);
    toast.success('Section removed');
  };

  const handleExportPDF = async () => {
    try {
      await generatePDF(sections);
      toast.success('Resume exported successfully!');
    } catch (error) {
      toast.error('Failed to export resume. Please try again.');
      console.error('PDF generation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-canvas">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Header */}
        <header className="bg-sidebar dark:bg-sidebar border-b border-sidebar-border dark:border-sidebar-border shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
              <p className="text-sm text-muted-foreground">Create your professional resume</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button 
              onClick={handleExportPDF}
              className="bg-gradient-primary hover:opacity-90 text-white shadow-element"
              disabled={sections.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <main className="flex-1">
            <Canvas 
              sections={sections}
              setSections={setSections}
              selectedSectionId={selectedSectionId}
              setSelectedSectionId={setSelectedSectionId}
              updateSection={updateSection}
              updateSectionStyle={updateSectionStyle}
              updateSectionSize={updateSectionSize}
              deleteSection={deleteSection}
            />
          </main>
        </div>

        <DragOverlay>
          {activeDragItem ? (
            <div className="bg-card p-4 rounded-lg shadow-lg border-2 border-primary opacity-90">
              <span className="text-sm font-medium text-card-foreground">{activeDragItem.label}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
