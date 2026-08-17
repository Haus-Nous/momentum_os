"use client";

import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { defaultAIProvider } from '../../utils/aiAssistantEngine';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const DeadlineRiskWidget: React.FC = () => {
  const { assignments, hackathons, internships, setActiveTab } = useMomentumStore();
  const [risks, setRisks] = React.useState<any[]>([]);

  React.useEffect(() => {
    Promise.resolve(defaultAIProvider.predictDeadlineRisks(assignments, hackathons, internships))
      .then((data) => setRisks(data || []))
      .catch(() => setRisks([]));
  }, [assignments, hackathons, internships]);

  return (
    <Card className="p-5 border-[#D93829]/30 dark:border-[#ED4B3B]/30 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#D93829]/15 text-[#D93829] dark:text-[#ED4B3B]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Deadline Risk Radar</h3>
            <p className="text-xs text-gray-500">Intelligent risk prediction on assignments and hackathons.</p>
          </div>
        </div>

        <Badge variant={risks.length > 0 ? 'urgent' : 'emerald'}>
          {risks.length > 0 ? `${risks.length} RISKS DETECTED` : 'ALL CLEAR'}
        </Badge>
      </div>

      <div className="space-y-2">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className="p-3.5 rounded-xl bg-[#D93829]/10 border border-[#D93829]/20 flex items-start justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2 font-bold text-gray-900 dark:text-white">
                <span>{risk.title}</span>
                <span className="text-[10px] text-[#D93829] dark:text-[#ED4B3B] font-mono">({risk.type})</span>
              </div>
              <p className="text-xs text-[#D93829] dark:text-[#ED4B3B]">{risk.reason}</p>
            </div>

            <button
              onClick={() => setActiveTab(risk.type === 'Assignment' ? 'semester' : 'career')}
              className="px-2.5 py-1 rounded-lg bg-[#D93829]/20 text-[#D93829] dark:text-[#ED4B3B] hover:bg-[#D93829] hover:text-white font-bold text-[11px] shrink-0 transition-colors cursor-pointer"
            >
              Resolve Risk
            </button>
          </div>
        ))}

        {risks.length === 0 && (
          <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#8A9A86] dark:text-[#9DB098]" />
            <span>Zero deadline risks detected. All submissions are on track!</span>
          </div>
        )}
      </div>
    </Card>
  );
};
