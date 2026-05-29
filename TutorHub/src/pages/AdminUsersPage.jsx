// src/pages/AdminUsersPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminSidebar from '../components/layout/AdminSidebar';
import { getAdminUsers, toggleUserStatus, changeUserRole } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadUsers = async () => {
    try {
      const res = await getAdminUsers();
      setUsers(res.data || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await toggleUserStatus(userId, nextStatus);
      toast.success(`User status updated to ${nextStatus}`);
      loadUsers();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleChangeRole = async (userId, nextRole) => {
    try {
      await changeUserRole(userId, nextRole);
      toast.success(`User role updated to ${nextRole}`);
      loadUsers();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="admin-layout">
        <AdminSidebar />
        <div className="screen-area pb-24 md:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
            <p className="text-slate-500 text-sm">View, search, filter, suspend, activate, or edit roles for all platform accounts.</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
              </svg>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="All">All Roles</option>
                  <option value="Student">Student</option>
                  <option value="Parent">Parent</option>
                  <option value="Tutor">Tutor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-slate-500 text-sm mt-3">Loading users directory...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center bg-slate-50">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07" />
                </svg>
                <h3 className="text-md font-bold text-slate-700">No Users Found</h3>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">User</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Joined On</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredUsers.map((user) => {
                      const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
                      const statusStyles = {
                        Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        Pending: 'bg-amber-50 text-amber-700 border-amber-200',
                        Suspended: 'bg-rose-50 text-rose-700 border-rose-200',
                        Rejected: 'bg-slate-50 text-slate-600 border-slate-200'
                      }[user.status] || 'bg-slate-50 text-slate-600 border-slate-200';

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                {initials}
                              </div>
                              <span className="font-semibold text-slate-800">{user.firstName} {user.lastName}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-500 font-mono text-xs">{user.email}</td>
                          <td className="p-4">
                            <select
                              value={user.role}
                              onChange={(e) => handleChangeRole(user.id, e.target.value)}
                              className="border border-slate-200 rounded px-2 py-1 text-xs bg-white text-slate-700 focus:outline-none focus:border-blue-500"
                            >
                              <option value="Student">Student</option>
                              <option value="Parent">Parent</option>
                              <option value="Tutor">Tutor</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </td>
                          <td className="p-4 text-slate-400">{user.dateJoined}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${statusStyles}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {user.role !== 'Admin' && (
                              <button
                                onClick={() => handleToggleStatus(user.id, user.status)}
                                className={`inline-flex items-center font-bold text-xs py-1.5 px-3 rounded-lg border transition-colors ${
                                  user.status === 'Active'
                                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                                }`}
                              >
                                {user.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;