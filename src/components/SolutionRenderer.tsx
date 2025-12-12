import { Card } from "@/components/ui/card";
import { BookOpen, Target, FlaskConical, CheckCircle2, Lightbulb, GraduationCap } from "lucide-react";

interface SolutionRendererProps {
  solution: string;
}

const SolutionRenderer = ({ solution }: SolutionRendererProps) => {
  // Parse sections from solution
  const parseSection = (text: string, emoji: string, title: string) => {
    const patterns = [
      new RegExp(`${emoji}\\s*${title}[:\\s]*([\\s\\S]*?)(?=(?:📋|🎯|📚|🔬|✅|💡|$))`, 'i'),
      new RegExp(`${title}[:\\s]*([\\s\\S]*?)(?=(?:BERILGAN|TOPISH|NAZARIY|YECHIM|JAVOB|ESLATMA|$))`, 'i'),
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]?.trim()) {
        return match[1].trim();
      }
    }
    return null;
  };

  const sections = [
    { 
      emoji: "📋", 
      title: "BERILGAN", 
      icon: BookOpen, 
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    { 
      emoji: "🎯", 
      title: "TOPISH KERAK", 
      icon: Target, 
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30"
    },
    { 
      emoji: "📚", 
      title: "NAZARIY ASOS", 
      icon: GraduationCap, 
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    },
    { 
      emoji: "🔬", 
      title: "YECHIM", 
      icon: FlaskConical, 
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30"
    },
    { 
      emoji: "✅", 
      title: "JAVOB", 
      icon: CheckCircle2, 
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    },
    { 
      emoji: "💡", 
      title: "ESLATMA", 
      icon: Lightbulb, 
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    },
  ];

  // Check if solution has structured format
  const hasStructuredFormat = sections.some(s => 
    solution.includes(s.emoji) || solution.toUpperCase().includes(s.title)
  );

  if (!hasStructuredFormat) {
    // Return simple formatted solution
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg border border-border/50">
          {solution}
        </div>
      </div>
    );
  }

  const parsedSections = sections.map(s => ({
    ...s,
    content: parseSection(solution, s.emoji, s.title)
  })).filter(s => s.content);

  // If no sections were parsed, show original
  if (parsedSections.length === 0) {
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg border border-border/50">
          {solution}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {parsedSections.map((section, index) => {
        const Icon = section.icon;
        return (
          <Card 
            key={index} 
            className={`p-4 ${section.bgColor} border ${section.borderColor} transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${section.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${section.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm mb-2 ${section.color}`}>
                  {section.emoji} {section.title}
                </h4>
                <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {section.content}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default SolutionRenderer;
