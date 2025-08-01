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
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { ResumeSection, DragItem, SectionType } from '../types/resume';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import { toast } from 'sonner';
import { ThemeToggle } from './ThemeToggle';

// === STATE SETUP ===
export const ResumeBuilder = () => {
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null); // CHANGE: track drag offset
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // DnD sensors
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor);

  // === DnD-LAYOUT CHANGE ===
  // Instead of reordering, we update the section's .position property!
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Find the section being dragged and record pointer offset
    const dragSection = sections.find(s => s.id === active.id);
    if (dragSection) {
      // Get mouse position relative to section
      const pointerX = event.activatorEvent instanceof MouseEvent ? event.activatorEvent.clientX : 0;
      const pointerY = event.activatorEvent instanceof MouseEvent ? event.activatorEvent.clientY : 0;
      setDragOffset({
        x: pointerX - dragSection.position.x,
        y: pointerY - dragSection.position.y
      });
    }

    // For DragOverlay
    const dragItem = active.data.current as DragItem;
    setActiveDragItem(dragItem);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // Only move by x/y, not reorder array
    if (!event.active.id) {
      setActiveId(null);
      setActiveDragItem(null);
      setDragOffset(null);
      return;
    }

    // Find pointer position
    const pointerX = event.activatorEvent instanceof MouseEvent ? event.activatorEvent.clientX : 0;
    const pointerY = event.activatorEvent instanceof MouseEvent ? event.activatorEvent.clientY : 0;

    // Find drag offset and update section position
    if (dragOffset) {
      const newX = pointerX - dragOffset.x;
      const newY = pointerY - dragOffset.y;

      setSections(prev =>
        prev.map(section =>
          section.id === event.active.id
            ? { ...section, position: { x: newX, y: newY } }
            : section
        )
      );
    }

    setActiveId(null);
    setActiveDragItem(null);
    setDragOffset(null);
  };

  // === Section update helpers ===
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
  // CHANGE: new updater for position (for external uses)
  const updateSectionPosition = (sectionId: string, position: { x: number; y: number }) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, position }
        : section
    ));
  };

  // === Add/delete/export helpers (no change for DnD) ===
  const addSectionByClick = (sectionType: string, label: string) => {
    // Validate sectionType
    const validSectionTypes = ['header', 'summary', 'experience', 'education', 'skills'];
    if (!validSectionTypes.includes(sectionType)) {
      toast.error('Invalid section type');
      return;
    }

    const newSection: ResumeSection = {
      id: `${sectionType}-${Date.now()}`,
      type: sectionType as SectionType,
      position: { x: 50, y: 50 + sections.length * 100 }, // CHANGE: initial position
      size: { width: 400, height: 200 },
      data: getInitialSectionData(sectionType),
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
    toast.success(`${label} section added to resume`);
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
    }
  };

  // === Section Data Generator (unchanged) ===
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
        return { items: [] };
      case 'education':
        return { items: [] };
      case 'skills':
        return { skills: [] };
      default:
        return {};
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-8 py-5 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <FileText className="w-7 h-7 text-primary" />
          <span className="font-bold text-xl">Resume Palette Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportPDF}
            disabled={sections.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar onAddSection={addSectionByClick} />

        {/* === CHANGE: DndContext for grid/absolute movement === */}
        <main className="flex-1 overflow-auto">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]} // Optional: keep in parent
          >
            <Canvas
              sections={sections}
              setSections={setSections}
              selectedSectionId={selectedSectionId}
              setSelectedSectionId={setSelectedSectionId}
              updateSection={updateSection}
              updateSectionStyle={updateSectionStyle}
              updateSectionSize={updateSectionSize}
              updateSectionPosition={updateSectionPosition} // CHANGE: pass position updater
              deleteSection={deleteSection}
            />
            {/* Drag overlay for visual feedback */}
            <DragOverlay>
              {activeDragItem ? (
                <div className="bg-card p-4 rounded-lg shadow-lg border-2 border-primary opacity-90">
                  <span className="text-sm font-medium text-card-foreground">
                    {activeDragItem.label}
                  </span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </main>
      </div>
    </div>
  );
};
