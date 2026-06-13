import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Lock, Trash2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../hooks/useTheme';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/authService';

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-12 h-6 rounded-full transition-colors ${
      checked ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gray-300 dark:bg-white/10'
    }`}
  >
    <motion.div
      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md"
      animate={{ x: checked ? 22 : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    />
  </button>
);

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [autoSummary, setAutoSummary] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handlePasswordChange = async (e) => {
  e.preventDefault();

  if (!passwords.current) {
    toast.error('Current password is required');
    return;
  }

  if (passwords.new.length < 6) {
    toast.error('Password must be at least 6 characters');
    return;
  }

  if (passwords.new !== passwords.confirm) {
    toast.error('New passwords do not match');
    return;
  }

  try {
    const res = await changePassword({
      currentPassword: passwords.current,
      newPassword: passwords.new,
    });

    toast.success(res.message);

    setPasswordModal(false);

    setPasswords({
      current: '',
      new: '',
      confirm: '',
    });
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      'Failed to update password'
    );
  }
};

  const handleDeleteAccount = () => {
    toast.success('Account deletion request submitted (UI demo)');
    setDeleteModal(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text-dark dark:text-textLight">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your preferences and account settings
        </p>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-6 space-y-4"
      >
        <h3 className="text-base font-semibold text-text-dark dark:text-textLight">
          Appearance
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary dark:text-secondary">
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <p className="text-sm font-medium text-text-dark dark:text-textLight">
                Dark Mode
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Toggle between light and dark themes
              </p>
            </div>
          </div>
          <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 space-y-4"
      >
        <h3 className="text-base font-semibold text-text-dark dark:text-textLight">
          Notifications & Automation
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
              <Bell size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-dark dark:text-textLight">
                Email Notifications
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Receive updates about your recordings
              </p>
            </div>
          </div>
          <ToggleSwitch checked={notifications} onChange={() => setNotifications((p) => !p)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
              <Globe size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-dark dark:text-textLight">
                Auto-generate AI Summary
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automatically generate summary after upload
              </p>
            </div>
          </div>
          <ToggleSwitch checked={autoSummary} onChange={() => setAutoSummary((p) => !p)} />
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-6 space-y-4"
      >
        <h3 className="text-base font-semibold text-text-dark dark:text-textLight">
          Security
        </h3>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Lock size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-dark dark:text-textLight">
                Password
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Change your account password
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setPasswordModal(true)}>
            Change Password
          </Button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 space-y-4 border border-red-500/20"
      >
        <h3 className="text-base font-semibold text-red-500">Danger Zone</h3>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500">
              <Trash2 size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-dark dark:text-textLight">
                Delete Account
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Permanently delete your account and all data
              </p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
            Delete Account
          </Button>
        </div>
      </motion.div>

      {/* Password Modal */}
      <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="Change Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
          />
          <Input
            label="New Password"
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setPasswordModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          This will permanently delete your account, all recordings, and associated data.
          This action <span className="font-semibold text-red-500">cannot be undone</span>.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete My Account
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;