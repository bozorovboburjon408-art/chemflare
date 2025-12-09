import { motion } from "framer-motion";
import { CheckCircle, Lightbulb, Calculator, FlaskConical, Atom, Target, BookOpen, ArrowRight } from "lucide-react";

interface SolutionRendererProps {
  solution: string;
}

const SolutionRenderer = ({ solution }: SolutionRendererProps) => {
  // Parse the solution into sections
  const parseContent = (text: string) => {
    const sections: { type: string; title: string; content: string; icon: React.ReactNode }[] = [];
    
    // Split by common section headers
    const lines = text.split('\n');
    let currentSection = { type: 'intro', title: '', content: '', icon: <BookOpen className="w-5 h-5" /> };
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check for section headers
      if (trimmedLine.match(/^(1\.|•|\*|-)?\s*(berilgan|ma'lumotlar|berilganlar)/i)) {
        if (currentSection.content.trim()) sections.push({ ...currentSection });
        currentSection = { type: 'given', title: "📋 Berilganlar", content: '', icon: <BookOpen className="w-5 h-5 text-blue-500" /> };
      } else if (trimmedLine.match(/^(2\.|•|\*|-)?\s*(topish kerak|topilsin|aniqlansin|nima topiladi)/i)) {
        if (currentSection.content.trim()) sections.push({ ...currentSection });
        currentSection = { type: 'find', title: "🎯 Topish kerak", content: '', icon: <Target className="w-5 h-5 text-amber-500" /> };
      } else if (trimmedLine.match(/^(3\.|•|\*|-)?\s*(yechim|yechish|hisoblash|formula|yechim qadamlari)/i)) {
        if (currentSection.content.trim()) sections.push({ ...currentSection });
        currentSection = { type: 'solution', title: "🔬 Yechim", content: '', icon: <FlaskConical className="w-5 h-5 text-emerald-500" /> };
      } else if (trimmedLine.match(/^(4\.|•|\*|-)?\s*(javob|natija|xulosa)/i)) {
        if (currentSection.content.trim()) sections.push({ ...currentSection });
        currentSection = { type: 'answer', title: "✅ Javob", content: '', icon: <CheckCircle className="w-5 h-5 text-green-500" /> };
      } else if (trimmedLine.match(/^(5\.|•|\*|-)?\s*(izoh|tushuntirish|eslatma|muhim)/i)) {
        if (currentSection.content.trim()) sections.push({ ...currentSection });
        currentSection = { type: 'note', title: "💡 Izoh", content: '', icon: <Lightbulb className="w-5 h-5 text-yellow-500" /> };
      } else if (trimmedLine.match(/^(•|\*|-)?\s*(reaksiya tenglama)/i)) {
        if (currentSection.content.trim()) sections.push({ ...currentSection });
        currentSection = { type: 'equation', title: "⚗️ Reaksiya tenglamasi", content: '', icon: <Atom className="w-5 h-5 text-purple-500" /> };
      } else {
        // Add content to current section
        currentSection.content += line + '\n';
      }
    });
    
    // Add the last section
    if (currentSection.content.trim()) {
      sections.push({ ...currentSection });
    }
    
    return sections;
  };

  // Format chemical formulas and equations
  const formatChemistry = (text: string) => {
    // Already has Unicode subscripts/superscripts, just enhance display
    return text
      .split('\n')
      .map((line, i) => {
        const trimmed = line.trim();
        
        // Highlight equations with arrows
        if (trimmed.includes('→') || trimmed.includes('=')) {
          if (trimmed.includes('→')) {
            return (
              <div key={i} className="my-3 p-3 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-lg border border-primary/20">
                <code className="text-base font-medium text-primary">{trimmed}</code>
              </div>
            );
          }
          // Math equations
          if (trimmed.match(/^\s*\w+\s*=\s*.+$/)) {
            return (
              <div key={i} className="my-2 p-2 bg-muted/50 rounded-md font-mono text-sm">
                {trimmed}
              </div>
            );
          }
        }
        
        // Highlight numbers with units
        const formattedLine = trimmed.replace(
          /(\d+(?:[.,]\d+)?)\s*(g|kg|mol|M|L|mL|m³|см³|dm³|%|°C|K|Pa|atm|kJ|J)/g,
          '<span class="font-semibold text-primary">$1 $2</span>'
        );
        
        // Highlight step numbers
        if (trimmed.match(/^(\d+[\.\)]|\*|•|-)\s/)) {
          return (
            <div key={i} className="flex items-start gap-2 my-2">
              <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^(\d+[\.\)]|\*|•|-)\s*/, '') }} />
            </div>
          );
        }
        
        if (!trimmed) return <div key={i} className="h-2" />;
        
        return (
          <p key={i} className="my-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      });
  };

  const sections = parseContent(solution);
  
  // If no clear sections found, display as formatted text
  if (sections.length <= 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="p-4 bg-muted/20 rounded-xl border border-border/50 leading-relaxed">
            {formatChemistry(solution)}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {sections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`rounded-xl border overflow-hidden ${
            section.type === 'answer' 
              ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30' 
              : section.type === 'solution'
              ? 'bg-gradient-to-br from-primary/10 to-accent/5 border-primary/30'
              : section.type === 'note'
              ? 'bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/30'
              : 'bg-card/50 border-border/50'
          }`}
        >
          {section.title && (
            <div className={`px-4 py-3 border-b flex items-center gap-3 ${
              section.type === 'answer'
                ? 'bg-green-500/10 border-green-500/20'
                : section.type === 'solution'
                ? 'bg-primary/10 border-primary/20'
                : section.type === 'note'
                ? 'bg-yellow-500/10 border-yellow-500/20'
                : 'bg-muted/30 border-border/50'
            }`}>
              {section.icon}
              <h4 className="font-semibold text-base">{section.title}</h4>
            </div>
          )}
          <div className="p-4 text-sm">
            {formatChemistry(section.content)}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SolutionRenderer;
