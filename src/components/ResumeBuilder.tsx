import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement, snapCenterToCursor } from '@dnd-kit/modifiers';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { ResumeSection, DragItem, SectionType } from '../types/resume';
import { Button } from './ui/button';
import { Download, FileText } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import { toast } from 'sonner';
import { ThemeToggle } from './ThemeToggle';

// === GRID SETTINGS (for snapping) ===
const GRID_SIZE = 30; // px, change for finer/coarser grid

// === HELPER: snap position to grid ===
function snapToGrid(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE,
  };
}

export const ResumeBuilder = () => {
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number } | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Sensors for pointer device
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const sensors = useSensors(pointerSensor);

  // === DND LOGIC FOR ABSOLUTE POSITIONING AND GRID SNAP ===
  const handleDragStart = (event: DragStartEvent) => {
    const section = sections.find(s => s.id === event.active.id);
    if (section) {
      setDragOrigin({ x: section.position.x, y: section.position.y });
    }
    setActiveId(event.active.id as string);

    // Drag overlay
    const dragItem = event.active.data.current as DragItem;
    setActiveDragItem(dragItem);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!activeId || !dragOrigin) {
      setActiveId(null);
      setActiveDragItem(null);
      setDragOrigin(null);
      return;
    }

    // Get drop coordinates relative to the canvas
    const { delta } = event; // DnD Kit passes pointer movement delta
    if (delta) {
      let newX = dragOrigin.x + delta.x;
      let newY = dragOrigin.y + delta.y;
      // === SNAP TO GRID ===
      const snapped = snapToGrid(newX, newY);

      setSections(prev =>
        prev.map(section =>
          section.id === activeId
            ? { ...section, position: snapped }
            : section
        )
      );
    }

    setActiveId(null);
    setActiveDragItem(null);
    setDragOrigin(null);
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
  const updateSectionPosition = (sectionId: string, position: { x: number; y: number }) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, position }
        : section
    ));
  };

  const addSectionByClick = (sectionType: string, label: string) => {
    const validSectionTypes = ['header', 'summary', 'experience', 'education', 'skills'];
    if (!validSectionTypes.includes(sectionType)) {
      toast.error('Invalid section type');
      return;
    }
    // Place new section at next available grid position
    const nextY = 50 + sections.length * GRID_SIZE * 4;
    const newSection: ResumeSection = {
      id: `${sectionType}-${Date.now()}`,
      type: sectionType as SectionType,
      position: { x: 50, y: nextY },
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
        <Sidebar onAddSection={addSectionByClick} />
        <main className="flex-1 overflow-auto">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            // restrict sections to canvas parent; snap center to pointer
            modifiers={[restrictToParentElement, snapCenterToCursor]}
          >
            <Canvas
              sections={sections}
              setSections={setSections}
              selectedSectionId={selectedSectionId}
              setSelectedSectionId={setSelectedSectionId}
              updateSection={updateSection}
              updateSectionStyle={updateSectionStyle}
              updateSectionSize={updateSectionSize}
              updateSectionPosition={updateSectionPosition}
              deleteSection={deleteSection}
            />
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
