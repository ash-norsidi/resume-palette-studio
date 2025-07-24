import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
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
  deleteSection: (sectionId: string) => void;
}

export const Canvas = ({
  sections,
  setSections,
  selectedSectionId,
  setSelectedSectionId,
  updateSection,
  updateSectionStyle,
  deleteSection
}: CanvasProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas',
  });

  const selectedSection = sections.find(section => section.id === selectedSectionId);

  return (
    <div className="flex h-screen">
      {/* Canvas Area */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Resume Canvas</h2>
            <p className="text-muted-foreground">
              Drag sections from the sidebar to build your resume
            </p>
          </div>
          
          <div
            ref={setNodeRef}
            className={`
              relative min-h-[800px] bg-background rounded-lg shadow-lg border-2 border-dashed transition-all duration-normal
              ${isOver 
                ? 'border-primary bg-primary-light/10 scale-[1.01]' 
                : 'border-border hover:border-border/80'
              }
              ${sections.length === 0 ? 'canvas-grid' : ''}
            `}
          >
            {sections.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-medium mb-2">Start Building Your Resume</h3>
                  <p className="text-sm">Drag resume sections from the sidebar to get started</p>
                </div>
              </div>
            ) : (
              <div className="p-8 space-y-4">
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  {sections.map((section) => (
                    <ResumeSectionComponent
                      key={section.id}
                      section={section}
                      isSelected={selectedSectionId === section.id}
                      onSelect={() => setSelectedSectionId(section.id)}
                      onUpdate={(data) => updateSection(section.id, data)}
                    />
                  ))}
                </SortableContext>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Panel */}
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