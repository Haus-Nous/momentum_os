import fs from 'fs';
import path from 'path';

function findInDir(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findInDir(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const srcDir = path.join(process.cwd(), 'src');
const allFiles = findInDir(srcDir);

console.log(`Auditing ${allFiles.length} files in src/...`);

const suspiciousPatterns = [
  { name: 'CGPA 8.5/8.50', regex: /8\.50?/g },
  { name: 'Hardcoded coins 420', regex: /\b420\b/g },
  { name: 'Fake progress 68/80/40/70', regex: /\b(68|80|40|70)\b/g },
  { name: 'Fake default assignment names', regex: /(Distributed Systems|Dr\. Katherine Vance|Faculty Advisor)/g },
  { name: 'Fake default hackathon names', regex: /(Autonomous AI Platforms|Vercel & Next\.js Core|Alex Mercer|MOMENTUM OS)/g }
];

const matches: { file: string; line: number; text: string; pattern: string }[] = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((lineText, idx) => {
    suspiciousPatterns.forEach(p => {
      if (p.regex.test(lineText)) {
        // Exclude responsive breakpoints like 768px, or standard CSS colors/values/SVG paths/keyframes
        if (p.name.includes('68') && (lineText.includes('768') || lineText.includes('breakpoint') || lineText.includes('confetti') || lineText.includes('68b7280') || lineText.includes('soundEngine') || lineText.includes('border') || lineText.includes('<svg') || lineText.includes('<path') || lineText.includes('<rect') || lineText.includes('<polygon') || lineText.includes('points='))) return;
        if (p.name.includes('80') && (lineText.includes('max-h-80') || lineText.includes('80%') || lineText.includes('768') || lineText.includes('confetti') || lineText.includes('duration') || lineText.includes('800') || lineText.includes('border') || lineText.includes('bg-') || lineText.includes('slate-') || lineText.includes('text-') || lineText.includes('<ellipse') || lineText.includes('<circle') || lineText.includes('<line') || lineText.includes('<path') || lineText.includes('<polygon') || lineText.includes('viewBox'))) return;
        if (p.name.includes('Fake progress') && (lineText.includes('<') || lineText.includes('x1=') || lineText.includes('x2=') || lineText.includes('y1=') || lineText.includes('y2=') || lineText.includes('points=') || lineText.includes('transform=') || lineText.includes('width=') || lineText.includes('height=') || lineText.includes('viewBox') || lineText.includes('rotate(') || lineText.includes('idx *') || lineText.includes('momentumScore') || lineText.includes('% {') || lineText.includes('strokeWidth='))) return;
        matches.push({
          file: path.relative(process.cwd(), file),
          line: idx + 1,
          text: lineText.trim(),
          pattern: p.name
        });
      }
    });
  });
});

console.log(`\nFound ${matches.length} suspicious literal matches across the codebase:`);
matches.forEach(m => {
  console.log(`[${m.pattern}] ${m.file}:${m.line} -> ${m.text}`);
});
