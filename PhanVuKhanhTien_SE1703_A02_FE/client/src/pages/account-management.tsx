import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@heroui/table';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { accountService } from '../services/account.service';
import type { SystemAccount, AccountFormData } from '../types';
import role from '../constants/role.constants';

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<SystemAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SystemAccount | null>(null);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState<AccountFormData>({
    accountname: '',
    accountEmail: '',
    accountRole: role.STAFF,
    accountPassword: '',
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await accountService.getAll();
      setAccounts(data);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadAccounts();
      return;
    }
    setIsLoading(true);
    try {
      const data = await accountService.search(searchTerm);
      setAccounts(data);
    } catch (error) {
      console.error('Error searching accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedAccount(null);
    setFormData({
      accountname: '',
      accountEmail: '',
      accountRole: role.STAFF,
      accountPassword: '',
    });
    setIsFormOpen(true);
  };

  const handleEdit = (account: SystemAccount) => {
    setSelectedAccount(account);
    setFormData({
      accountId: account.accountId,
      accountname: account.accountname,
      accountEmail: account.accountEmail,
      accountRole: account.accountRole,
      accountPassword: '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = (account: SystemAccount) => {
    setSelectedAccount(account);
    setDeleteError('');
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAccount) return;

    setIsLoading(true);
    try {
      // Check if account can be deleted
      const canDelete = await accountService.canDelete(selectedAccount.accountId);
      
      if (!canDelete) {
        setDeleteError(
          'Cannot delete this account. The account has created news articles and must remain in the system.'
        );
        setIsLoading(false);
        return;
      }

      await accountService.delete(selectedAccount.accountId);
      setIsDeleteOpen(false);
      loadAccounts();
    } catch (error: any) {
      setDeleteError(error.response?.data?.message || 'Error deleting account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedAccount) {
        await accountService.update(selectedAccount.accountId, formData);
      } else {
        await accountService.create(formData);
      }
      setIsFormOpen(false);
      loadAccounts();
    } catch (error) {
      console.error('Error saving account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleName = (roleId: number) => {
    return roleId === role.ADMIN ? 'Admin' : 'Staff';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Account Management</h1>
        <Button color="primary" onPress={handleCreate}>
          Create Account
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="max-w-md"
        />
        <Button onPress={handleSearch}>Search</Button>
        <Button onPress={loadAccounts} variant="flat">
          Clear
        </Button>
      </div>

      {/* Table */}
      <Table aria-label="Accounts table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No accounts found" isLoading={isLoading}>
          {accounts.map((account) => (
            <TableRow key={account.accountId}>
              <TableCell>{account.accountId}</TableCell>
              <TableCell>{account.accountname}</TableCell>
              <TableCell>{account.accountEmail}</TableCell>
              <TableCell>{getRoleName(account.accountRole)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" onPress={() => handleEdit(account)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => handleDelete(account)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} size="lg">
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {selectedAccount ? 'Edit Account' : 'Create Account'}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
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
                  label="Password"
                  type="password"
                  value={formData.accountPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, accountPassword: e.target.value })
                  }
                  required={!selectedAccount}
                  placeholder={selectedAccount ? 'Leave blank to keep current' : ''}
                />
                <div>
                  <label className="block mb-2 text-sm">Role</label>
                  <select
                    value={formData.accountRole}
                    onChange={(e) =>
                      setFormData({ ...formData, accountRole: Number(e.target.value) })
                    }
                    className="px-3 py-2 border rounded"
                    required
                    aria-label="Account Role"
                  >
                    <option value={role.STAFF}>Staff</option>
                    <option value={role.ADMIN}>Admin</option>
                  </select>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                {selectedAccount ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            {deleteError ? (
              <p className="text-danger">{deleteError}</p>
            ) : (
              <p>
                Are you sure you want to delete account "{selectedAccount?.accountname}"?
                {selectedAccount && (
                  <span className="block mt-2 text-sm text-warning">
                    Note: Accounts that have created news articles cannot be deleted.
                  </span>
                )}
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            {!deleteError && (
              <Button
                color="danger"
                onPress={confirmDelete}
                isLoading={isLoading}
              >
                Delete
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
