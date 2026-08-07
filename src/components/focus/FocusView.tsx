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
        <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Procedural Sound Generator</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Synthesize zero-latency procedural ambient audio using native Web Audio API oscillators and pink noise filters.
            </p>

            <div className="space-y-2.5 mt-6">
              {[
                { type: 'rain' as const, label: 'Gentle Rain & Thunder', icon: CloudRain, color: 'text-cyan-400' },
                { type: 'lofi' as const, label: 'Cyberpunk Lo-Fi Synth', icon: Music, color: 'text-indigo-400' },
                { type: 'cafe' as const, label: 'Café Chatter & Warmth', icon: Coffee, color: 'text-amber-400' },
                { type: 'forest' as const, label: 'Forest Pine Breeze', icon: Trees, color: 'text-emerald-400' },
              ].map((sound) => {
                const Icon = sound.icon;
                const isActive = ambientSound.isPlaying && ambientSound.type === sound.type;
                return (
                  <button
                    key={sound.type}
                    onClick={() => toggleAmbientSound(sound.type)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white/10 border-indigo-500/50 text-white shadow-md'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${sound.color}`} />
                      <span>{sound.label}</span>
                    </div>
                    {isActive && <span className="text-[10px] text-emerald-400 font-bold animate-pulse">PLAYING</span>}
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
