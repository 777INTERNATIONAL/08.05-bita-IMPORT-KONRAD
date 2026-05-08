import fs from 'fs';

const files = [
  'package.json',
  'index.html',
  'src/App.tsx',
  'src/main.tsx',
  'src/translations.ts',
  'src/types.ts',
  'src/services/aiService.ts',
  'src/data/mockLeads.ts',
  'src/data/pipelineData.ts',
  'src/index.css'
];

let out = "# APEX CRM - EXPORT DLA CLAUDE\n\nPoniżej znajduje się pełny kod aplikacji. Wklej ten jeden plik do Claude'a, a AI zrozumie całą aplikację od razu.\n\n";

for (const file of files) {
  if (fs.existsSync(file)) {
    out += `\n## Plik: ${file}\n\`\`\`tsx\n`;
    out += fs.readFileSync(file, 'utf8');
    out += `\n\`\`\`\n`;
  }
}

fs.writeFileSync('CLAUDE_EXPORT.md', out);
console.log('CLAUDE_EXPORT.md wygenerowany!');
