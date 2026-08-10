import { Task, Habit, Goal, Assignment, Hackathon, Internship, Priority, EnergyLevel } from '../types';

export interface ParsedCommand {
  type: 'task' | 'assignment' | 'habit' | 'reminder' | 'query';
  title: string;
  dueDate?: string;
  dueTime?: string;
  priority: Priority;
  energyLevel: EnergyLevel;
  category?: string;
  timeEstimateMinutes?: number;
}

export interface RiskReport {
  id: string;
  title: string;
  type: 'Assignment' | 'Hackathon' | 'Internship';
  dueDate: string;
  riskLevel: 'HIGH 🚨' | 'MEDIUM ⚠️';
  reason: string;
}

export interface RecommendedHabit {
  title: string;
  description: string;
  category: any;
  reason: string;
}

export interface AIProvider {
  parseNaturalLanguageCommand(text: string): Promise<ParsedCommand> | ParsedCommand;
  predictDeadlineRisks(assignments: Assignment[], hackathons: Hackathon[], internships: Internship[]): Promise<RiskReport[]> | RiskReport[];
  breakdownGoalIntoTasks(goal: Goal): Promise<{ title: string; timeEstimateMinutes: number; priority: Priority }[]> | { title: string; timeEstimateMinutes: number; priority: Priority }[];
  answerConversationalQuery(query: string, context: { tasks: Task[]; assignments: Assignment[]; hackathons: Hackathon[]; habits: Habit[] }): Promise<string> | string;
}

export class LocalHeuristicAIProvider implements AIProvider {
  parseNaturalLanguageCommand(text: string): ParsedCommand {
    const textLower = text.toLowerCase();
    
    let priority: Priority = 'medium';
    if (textLower.includes('urgent') || textLower.includes('p1') || textLower.includes('asap')) priority = 'urgent';
    else if (textLower.includes('high') || textLower.includes('important')) priority = 'high';
    else if (textLower.includes('low')) priority = 'low';

    let energyLevel: EnergyLevel = 'medium';
    if (textLower.includes('deep work') || textLower.includes('hard') || textLower.includes('complex')) energyLevel = 'high';
    else if (textLower.includes('quick') || textLower.includes('easy')) energyLevel = 'low';

    const now = new Date();
    let targetDate = new Date();

    if (textLower.includes('tomorrow')) {
      targetDate.setDate(now.getDate() + 1);
    } else if (textLower.includes('next tuesday')) {
      targetDate.setDate(now.getDate() + ((2 + 7 - now.getDay()) % 7 || 7));
    } else if (textLower.includes('next monday')) {
      targetDate.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));
    } else if (textLower.includes('friday')) {
      targetDate.setDate(now.getDate() + ((5 + 7 - now.getDay()) % 7 || 7));
    }

    const dueDateStr = targetDate.toISOString().split('T')[0];

    let dueTimeStr = '20:00';
    if (textLower.includes('8 pm') || textLower.includes('8pm')) dueTimeStr = '20:00';
    else if (textLower.includes('9 am') || textLower.includes('9am')) dueTimeStr = '09:00';
    else if (textLower.includes('5 pm') || textLower.includes('5pm')) dueTimeStr = '17:00';

    let cleanTitle = text
      .replace(/remind me to/i, '')
      .replace(/submit my/i, '')
      .replace(/next tuesday/i, '')
      .replace(/next monday/i, '')
      .replace(/tomorrow/i, '')
      .replace(/at 8 pm/i, '')
      .replace(/at 9 am/i, '')
      .trim();

    if (!cleanTitle) cleanTitle = text;

    return {
      type: textLower.includes('assignment') ? 'assignment' : 'task',
      title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
      dueDate: dueDateStr,
      dueTime: dueTimeStr,
      priority,
      energyLevel,
      timeEstimateMinutes: 45,
    };
  }

  predictDeadlineRisks(assignments: Assignment[], hackathons: Hackathon[], internships: Internship[]): RiskReport[] {
    const risks: RiskReport[] = [];
    const now = new Date();

    assignments.forEach((asg) => {
      if (asg.status === 'pending') {
        const due = new Date(`${asg.dueDate}T${asg.dueTime || '23:59'}:00`);
        const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursLeft > 0 && hoursLeft < 72) {
          const progress = asg.progressPercent || 0;
          if (progress < 50) {
            risks.push({
              id: asg.id,
              title: asg.title,
              type: 'Assignment',
              dueDate: asg.dueDate,
              riskLevel: hoursLeft < 24 ? 'HIGH 🚨' : 'MEDIUM ⚠️',
              reason: `Due in ${Math.round(hoursLeft)} hrs with only ${progress}% completion progress.`,
            });
          }
        }
      }
    });

    hackathons.forEach((hk) => {
      if (hk.submissionDeadline) {
        const due = new Date(`${hk.submissionDeadline}T23:59:00`);
        const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursLeft > 0 && hoursLeft < 96 && (hk.progressPercent || 0) < 60) {
          risks.push({
            id: hk.id,
            title: hk.title,
            type: 'Hackathon',
            dueDate: hk.submissionDeadline,
            riskLevel: 'HIGH 🚨',
            reason: `Hackathon submission in ${Math.round(hoursLeft / 24)} days with build progress at ${hk.progressPercent || 0}%.`,
          });
        }
      }
    });

    return risks;
  }

  breakdownGoalIntoTasks(goal: Goal): { title: string; timeEstimateMinutes: number; priority: Priority }[] {
    return [
      {
        title: `Phase 1: Research & Specs for ${goal.title}`,
        timeEstimateMinutes: 60,
        priority: 'high',
      },
      {
        title: `Phase 2: Core Engineering Implementation for ${goal.title}`,
        timeEstimateMinutes: 90,
        priority: 'urgent',
      },
      {
        title: `Phase 3: Final Verification & Milestone Demo for ${goal.title}`,
        timeEstimateMinutes: 45,
        priority: 'medium',
      },
    ];
  }

  answerConversationalQuery(query: string, context: { tasks: Task[]; assignments: Assignment[]; hackathons: Hackathon[]; habits: Habit[] }): string {
    const qLower = query.toLowerCase();

    if (qLower.includes('deadline') || qLower.includes('due') || qLower.includes('this week')) {
      const pendingAsgs = context.assignments.filter((a) => a.status === 'pending');
      if (pendingAsgs.length === 0) {
        return "You have 0 pending assignment deadlines this week! All academic submissions are up to date. 🎉";
      }
      const list = pendingAsgs.map((a) => `• "${a.title}" due ${a.dueDate} (${a.priority.toUpperCase()})`).join('\n');
      return `Here are your pending deadlines for this week:\n\n${list}\n\nWould you like me to schedule a deep focus block for any of these?`;
    }

    if (qLower.includes('habit') || qLower.includes('streak')) {
      const topStreak = context.habits.reduce((max, h) => (h.currentStreak > max.currentStreak ? h : max), context.habits[0]);
      if (topStreak) {
        return `Your highest active streak is "${topStreak.title}" with an impressive ${topStreak.currentStreak}-day streak! 🔥 Keep the momentum going!`;
      }
    }

    if (qLower.includes('productivity') || qLower.includes('score')) {
      return "Your composite Momentum Score is 88/100 (Peak Execution State). Your peak focus hours are between 09:00 AM - 11:30 AM.";
    }

    return `I analyzed your workspace context (${context.tasks.length} tasks, ${context.assignments.length} assignments, ${context.habits.length} habits). All systems are operating smoothly. How else can I assist your workflow today?`;
  }
}

export class GroqAIProvider implements AIProvider {
  private fallbackProvider = new LocalHeuristicAIProvider();

  async parseNaturalLanguageCommand(text: string): Promise<ParsedCommand> {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'parseCommand', payload: { text } }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data.fallback || !data.title) {
        throw new Error(data.error || 'Invalid Groq response format');
      }
      return data as ParsedCommand;
    } catch (err: any) {
      console.warn('[GroqAIProvider] Falling back to LocalHeuristicAIProvider due to:', err.message);
      return this.fallbackProvider.parseNaturalLanguageCommand(text);
    }
  }

  async predictDeadlineRisks(assignments: Assignment[], hackathons: Hackathon[], internships: Internship[]): Promise<RiskReport[]> {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'predictRisks', payload: { assignments, hackathons, internships } }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.fallback || !Array.isArray(data)) {
        throw new Error(data.error || 'Invalid Groq response format');
      }
      return data as RiskReport[];
    } catch (err: any) {
      console.warn('[GroqAIProvider] Falling back to LocalHeuristicAIProvider due to:', err.message);
      return this.fallbackProvider.predictDeadlineRisks(assignments, hackathons, internships);
    }
  }

  async breakdownGoalIntoTasks(goal: Goal): Promise<{ title: string; timeEstimateMinutes: number; priority: Priority }[]> {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'breakdownGoal', payload: { goal } }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.fallback || !Array.isArray(data)) {
        throw new Error(data.error || 'Invalid Groq response format');
      }
      return data;
    } catch (err: any) {
      console.warn('[GroqAIProvider] Falling back to LocalHeuristicAIProvider due to:', err.message);
      return this.fallbackProvider.breakdownGoalIntoTasks(goal);
    }
  }

  async answerConversationalQuery(query: string, context: { tasks: Task[]; assignments: Assignment[]; hackathons: Hackathon[]; habits: Habit[] }): Promise<string> {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'answerQuery', payload: { query, context } }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.fallback || !data.answer) {
        throw new Error(data.error || 'Invalid Groq response format');
      }
      return data.answer;
    } catch (err: any) {
      console.warn('[GroqAIProvider] Falling back to LocalHeuristicAIProvider due to:', err.message);
      return this.fallbackProvider.answerConversationalQuery(query, context);
    }
  }
}

export const localHeuristicAIProvider = new LocalHeuristicAIProvider();
export const groqAIProvider = new GroqAIProvider();

export class DynamicAIProvider implements AIProvider {
  private getProvider(): AIProvider {
    try {
      const mode = (window as any)?.__MOMENTUM_AI_MODE__ || 'groq';
      return mode === 'heuristic' ? localHeuristicAIProvider : groqAIProvider;
    } catch {
      return groqAIProvider;
    }
  }

  parseNaturalLanguageCommand(text: string) {
    return this.getProvider().parseNaturalLanguageCommand(text);
  }

  predictDeadlineRisks(assignments: Assignment[], hackathons: Hackathon[], internships: Internship[]) {
    return this.getProvider().predictDeadlineRisks(assignments, hackathons, internships);
  }

  breakdownGoalIntoTasks(goal: Goal) {
    return this.getProvider().breakdownGoalIntoTasks(goal);
  }

  answerConversationalQuery(query: string, context: { tasks: Task[]; assignments: Assignment[]; hackathons: Hackathon[]; habits: Habit[] }) {
    return this.getProvider().answerConversationalQuery(query, context);
  }
}

export const defaultAIProvider: AIProvider = new DynamicAIProvider();
