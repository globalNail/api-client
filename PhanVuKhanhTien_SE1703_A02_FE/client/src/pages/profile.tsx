import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { accountService } from '../services/account.service';
import { authService } from '../services/auth.service';
import type { SystemAccount, AccountFormData } from '../types';

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<SystemAccount | null>(null);
  
  const [formData, setFormData] = useState<AccountFormData>({
    accountname: '',
    accountEmail: '',
    accountRole: 2,
    accountPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const data = await accountService.getById(user.accountId);
        setProfile(data);
        setFormData({
          accountId: data.accountId,
          accountname: data.accountname,
          accountEmail: data.accountEmail,
          accountRole: data.accountRole,
          accountPassword: '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsLoading(true);
    try {
      await accountService.update(profile.accountId, formData);
      setIsEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!isEditing && (
          <Button color="primary" onPress={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Name"
            value={formData.accountname}
            onChange={(e) =>
              setFormData({ ...formData, accountname: e.target.value })
            }
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.accountEmail}
            onChange={(e) =>
              setFormData({ ...formData, accountEmail: e.target.value })
            }
            required
          />
          <Input
            label="New Password (leave blank to keep current)"
            type="password"
            value={formData.accountPassword}
            onChange={(e) =>
              setFormData({ ...formData, accountPassword: e.target.value })
            }
            placeholder="Leave blank to keep current password"
          />
          <div className="flex gap-4">
            <Button
              color="default"
              variant="light"
              onPress={() => {
                setIsEditing(false);
                loadProfile();
              }}
            >
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p className="text-lg">{profile.accountname}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="text-lg">{profile.accountEmail}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <p className="text-lg">{profile.accountRole === 1 ? 'Admin' : 'Staff'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
