"use client";

import React from 'react';
import { Bell, X, Check, Trash2, Calendar, Award } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';

export const NotificationsModal: React.FC = () => {
  const { isNotificationsOpen, setNotificationsOpen, notifications, markNotificationRead, clearNotifications } = useMomentumStore();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6 bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm glass-card rounded-2xl border border-black/10 dark:border-white/15 overflow-hidden shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-900 dark:text-white">
            <Bell className="w-4 h-4 text-indigo-500" />
            <span>System Notifications</span>
          </div>

          <div className="flex items-center space-x-1">
            <button onClick={clearNotifications} className="text-[10px] text-gray-400 hover:text-rose-500 mr-2">Clear</button>
            <button onClick={() => setNotificationsOpen(false)} className="p-1 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="py-3 space-y-2 max-h-80 overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                notif.read ? 'bg-black/5 dark:bg-white/5 border-transparent text-gray-500' : 'bg-indigo-500/10 border-indigo-500/30 text-gray-900 dark:text-white font-semibold'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-indigo-500 text-[11px]">{notif.title}</span>
                <span className="text-[9px] text-gray-400 font-mono">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-300">{notif.message}</p>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-8 text-center text-xs text-gray-400">No new notifications.</div>
          )}
        </div>
      </div>
    </div>
  );
};
