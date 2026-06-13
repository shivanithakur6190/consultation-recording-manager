import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getInitials, formatDate } from '../utils/helpers';
import { updateProfile } from '../services/authService';

import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = async (e) => {
  e.preventDefault();

  try {
    const res = await updateProfile({
      name: formData.name,
    });

    const updatedUser = res.data;

    setUser(updatedUser);

    localStorage.setItem(
      'crm-user',
      JSON.stringify(updatedUser)
    );

    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      'Failed to update profile'
    );
  }
};

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-text-dark dark:text-textLight">
          Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your account information
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-glow flex-shrink-0">
          {getInitials(user?.name)}
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-text-dark dark:text-textLight">
            {user?.name}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            Joined {formatDate(user?.createdAt)}
          </div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="glass rounded-2xl p-6 space-y-5"
      >
        <h3 className="text-base font-semibold text-text-dark dark:text-textLight">
          Account Information
        </h3>

        <Input
          label="Full Name"
          icon={User}
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <Input
          label="Email Address"
          icon={Mail}
          value={formData.email}
          disabled
        />

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-white/5 rounded-xl p-3">
          <Shield size={14} />
          Email address cannot be changed for security reasons.
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default Profile;