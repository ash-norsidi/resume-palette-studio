import { ResumeSection } from '../types/resume';
import { ResumeSectionComponent } from './ResumeSectionComponent';
import { PropertyPanel } from './PropertyPanel';

interface CanvasProps {
  sections: ResumeSection[];
  setSections: React.Dispatch<React.SetStateAction<ResumeSection[]>>;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  updateSection: (sectionId: string, data: any) => void;
  updateSectionStyle: (sectionId: string, style: any) => void;
  updateSectionSize: (sectionId: string, size: { width: number; height: number }) => void;
  updateSectionPosition: (sectionId: string, position: { x: number; y: number }) => void; // NEW
  deleteSection: (sectionId: string) => void;
}

export const Canvas = ({
  sections,
  setSections,
  selectedSectionId,
  setSelectedSectionId,
  updateSection,
  updateSectionStyle,
  updateSectionSize,
  updateSectionPosition, // NEW
  deleteSection
}: CanvasProps) => {
  // The Canvas area is now a relative container for absolutely-positioned sections
  const selectedSection = sections.find(section => section.id === selectedSectionId);

  return (
    <div className="relative min-h-[800px] bg-background rounded-lg shadow-lg border-2 border-dashed transition-all duration-normal">
      {/* === CHANGE: If no sections, show the empty state centered === */}
      {sections.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center canvas-grid">
          <div className="text-center text-muted-foreground">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium mb-2">Start Building Your Resume</h3>
            <p className="text-sm">Drag resume sections from the sidebar to get started</p>
          </div>
        </div>
      ) : (
        // === CHANGE: Render each section absolutely positioned ===
        <>
          {sections.map((section) => (
            <ResumeSectionComponent
              key={section.id}
              section={section}
              isSelected={selectedSectionId === section.id}
              onSelect={() => setSelectedSectionId(section.id)}
              onUpdate={(data) => updateSection(section.id, data)}
              onResize={(size) => updateSectionSize(section.id, size)}
              sectionId={section.id}
              onDelete={deleteSection}
              // Note: Drag-and-drop and position logic is done in ResumeBuilder
            />
          ))}
        </>
      )}
      {/* Property Panel floats to the side, unchanged */}
      {selectedSection && (
        <PropertyPanel
          section={selectedSection}
          onUpdateStyle={(style) => updateSectionStyle(selectedSection.id, style)}
          onDelete={() => deleteSection(selectedSection.id)}
          onClose={() => setSelectedSectionId(null)}
        />
      )}
    </div>
  );
};
