import React, { useState } from 'react';
import {
  Lock,
  UserCheck,
  ShieldAlert,
  KeyRound,
  X,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { User } from '../../types/pos';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, login, logout, switchUser } = usePOS();

  const [selectedUser, setSelectedUser] = useState<User | null>(currentUser);
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setPinInput('');
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (pinInput === selectedUser.pin) {
      switchUser(selectedUser);
      onClose();
    } else {
      setErrorMsg('PIN yang Anda masukkan salah. Coba lagi.');
    }
  };

  const handleQuickLoginAs = (user: User) => {
    switchUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                Otentikasi & Ganti Pengguna
              </h3>
              <p className="text-xs text-stone-400">
                Akses level Kasir & Admin Toko
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Banner */}
        {currentUser && (
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-stone-400 font-semibold uppercase">
                  Sedang Aktif ({currentUser.role})
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                setSelectedUser(null);
              }}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        )}

        {/* User Selection List */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
            Pilih Akun Kasir / Administrator:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {users.map(u => {
              const isSelected = selectedUser?.id === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectUser(u)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs ring-1 ring-emerald-600'
                      : 'border-stone-200 dark:border-stone-700 hover:border-emerald-400 bg-white dark:bg-stone-800'
                  }`}
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                      {u.name}
                    </div>
                    <div className="text-[10px] font-bold uppercase text-stone-500">
                      {u.role}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN Entry Form */}
        {selectedUser && (
          <form onSubmit={handleLoginSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Masukkan PIN untuk <span className="text-emerald-600">{selectedUser.name}</span>:
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="PIN Default: 1234 atau 8888"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-sm font-mono tracking-widest bg-white dark:bg-stone-800 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickLoginAs(selectedUser)}
                className="px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                title="Bypass tanpa ketik PIN untuk testing demo"
              >
                Login Cepat (Demo)
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Konfirmasi Masuk</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
