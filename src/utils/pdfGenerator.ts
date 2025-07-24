import html2pdf from 'html2pdf.js';
import { ResumeSection } from '../types/resume';

export const generatePDF = async (sections: ResumeSection[]): Promise<void> => {
  // Create a temporary container for PDF generation
  const container = document.createElement('div');
  container.style.width = '7.5in'; // Reduced to account for PDF margins
  container.style.minHeight = '10in';
  container.style.padding = '0.5in';
  container.style.backgroundColor = 'white';
  container.style.fontFamily = 'Inter, sans-serif';
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.5';
  container.style.color = '#000';
  container.style.boxSizing = 'border-box';
  container.style.overflow = 'hidden';

  // Generate HTML content from sections
  sections.forEach(section => {
    const sectionElement = document.createElement('div');
    sectionElement.style.marginBottom = '20px';
    
    switch (section.type) {
      case 'header':
        sectionElement.innerHTML = generateHeaderHTML(section.data as any);
        break;
      case 'summary':
        sectionElement.innerHTML = generateSummaryHTML(section.data as any);
        break;
      case 'experience':
        sectionElement.innerHTML = generateExperienceHTML(section.data as any);
        break;
      case 'education':
        sectionElement.innerHTML = generateEducationHTML(section.data as any);
        break;
      case 'skills':
        sectionElement.innerHTML = generateSkillsHTML(section.data as any);
        break;
    }
    
    container.appendChild(sectionElement);
  });

  // PDF generation options
  const options = {
    margin: 0.5,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait' 
    }
  };

  try {
    await html2pdf().set(options).from(container).save();
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
};

const generateHeaderHTML = (data: any): string => {
  return `
    <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
      <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 5px 0; color: #1f2937;">${data.name || 'Your Name'}</h1>
      <h2 style="font-size: 16px; font-weight: 400; margin: 0 0 15px 0; color: #6b7280;">${data.title || 'Professional Title'}</h2>
      <div style="font-size: 14px; color: #374151;">
        ${data.email ? `<span>${data.email}</span> • ` : ''}
        ${data.phone ? `<span>${data.phone}</span> • ` : ''}
        ${data.location ? `<span>${data.location}</span>` : ''}
        ${data.website ? ` • <span>${data.website}</span>` : ''}
      </div>
    </div>
  `;
};

const generateSummaryHTML = (data: any): string => {
  return `
    <div>
      <h3 style="font-size: 18px; font-weight: 600; color: #2563eb; margin: 0 0 10px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Professional Summary</h3>
      <p style="margin: 0; text-align: justify; line-height: 1.6;">${data.content || 'Professional summary content'}</p>
    </div>
  `;
};

const generateExperienceHTML = (data: any): string => {
  const items = data.items || [];
  const itemsHTML = items.map((item: any) => `
    <div style="margin-bottom: 20px;">
      <div style="margin-bottom: 5px;">
        <h4 style="font-size: 16px; font-weight: 600; margin: 0; color: #1f2937; float: left;">${item.position}</h4>
        <span style="font-size: 14px; color: #6b7280; float: right;">${item.startDate} - ${item.endDate}</span>
        <div style="clear: both;"></div>
      </div>
      <div style="margin-bottom: 8px;">
        <span style="font-size: 15px; font-weight: 500; color: #374151; float: left;">${item.company}</span>
        <span style="font-size: 14px; color: #6b7280; float: right;">${item.location}</span>
        <div style="clear: both;"></div>
      </div>
      <p style="margin: 0; text-align: justify; line-height: 1.5; color: #4b5563;">${item.description}</p>
    </div>
  `).join('');

  return `
    <div>
      <h3 style="font-size: 18px; font-weight: 600; color: #2563eb; margin: 0 0 15px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Work Experience</h3>
      ${itemsHTML}
    </div>
  `;
};

const generateEducationHTML = (data: any): string => {
  const items = data.items || [];
  const itemsHTML = items.map((item: any) => `
    <div style="margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
        <h4 style="font-size: 16px; font-weight: 600; margin: 0; color: #1f2937;">${item.degree} in ${item.field}</h4>
        <span style="font-size: 14px; color: #6b7280;">${item.startDate} - ${item.endDate}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-size: 15px; font-weight: 500; color: #374151;">${item.institution}</span>
        <span style="font-size: 14px; color: #6b7280;">${item.location}</span>
      </div>
      ${item.gpa ? `<p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">GPA: ${item.gpa}</p>` : ''}
    </div>
  `).join('');

  return `
    <div>
      <h3 style="font-size: 18px; font-weight: 600; color: #2563eb; margin: 0 0 15px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Education</h3>
      ${itemsHTML}
    </div>
  `;
};

const generateSkillsHTML = (data: any): string => {
  const skills = data.skills || [];
  const skillsHTML = skills.join(' • ');

  return `
    <div>
      <h3 style="font-size: 18px; font-weight: 600; color: #2563eb; margin: 0 0 10px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Skills</h3>
      <p style="margin: 0; line-height: 1.6;">${skillsHTML}</p>
    </div>
  `;
};