import React from 'react';
import { Layers, Volume2, CloudRain, Music, Coffee, Trees } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { TimerWidget } from './TimerWidget';
import { ForestGrid } from './ForestGrid';

export const FocusView: React.FC = () => {
  const { focusSessions, ambientSound, toggleAmbientSound, setAmbientVolume } = useMomentumStore();

  return (
    <div className="space-y-6 pb-12">
      {/* Focus Timer & Sound Mixer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Countdown Timer */}
        <div className="lg:col-span-2">
          <TimerWidget />
        </div>

        {/* Ambient Sound Generator Panel */}
        <div className="rounded-3xl p-6 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Volume2 className="w-5 h-5 text-[#C85A32] dark:text-[#D96B43]" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Procedural Sound Generator</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Synthesize zero-latency procedural ambient audio using native Web Audio API oscillators and pink noise filters.
            </p>

            <div className="space-y-2.5 mt-6">
              {[
                { type: 'rain' as const, label: 'Gentle Rain & Thunder', icon: CloudRain, color: 'text-[#78899A] dark:text-[#90A2B4]' },
                { type: 'lofi' as const, label: 'Warm Lo-Fi Synth', icon: Music, color: 'text-[#C85A32] dark:text-[#D96B43]' },
                { type: 'cafe' as const, label: 'Café Chatter & Warmth', icon: Coffee, color: 'text-[#D9A05B] dark:text-[#E5B574]' },
                { type: 'forest' as const, label: 'Forest Pine Breeze', icon: Trees, color: 'text-[#8A9A86] dark:text-[#9DB098]' },
              ].map((sound) => {
                const Icon = sound.icon;
                const isActive = ambientSound.isPlaying && ambientSound.type === sound.type;
                return (
                  <button
                    key={sound.type}
                    onClick={() => toggleAmbientSound(sound.type)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#C85A32]/10 border-[#C85A32]/40 text-[#C85A32] dark:text-[#D96B43] shadow-sm'
                        : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${sound.color}`} />
                      <span>{sound.label}</span>
                    </div>
                    {isActive && <span className="text-[10px] text-[#8A9A86] dark:text-[#9DB098] font-bold">PLAYING</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Control */}
          {ambientSound.isPlaying && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-300 font-semibold">
                <span>Soundscape Volume</span>
                <span className="font-mono">{Math.round(ambientSound.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientSound.volume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 accent-indigo-500 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Forest Trees Gallery */}
      <ForestGrid sessions={focusSessions} />
    </div>
  );
};
