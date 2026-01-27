import React, { useState } from 'react';
import { Plus, MagnifyingGlass, Tag, Pencil, Trash } from '@phosphor-icons/react';
import {
  Card,
  Badge,
  Button,
  Input,
  Modal,
  SkeletonTableRow,
  Select,
} from '../../components/ui';
import { useAdminSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '../../hooks/useAdmin';
import type { Skill } from '../../types/api.types';

const categoryOptions = [
  { value: 'technical', label: 'Technical' },
  { value: 'soft', label: 'Soft Skills' },
  { value: 'language', label: 'Language' },
  { value: 'other', label: 'Other' },
] as const;

const SkillsManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newSkill, setNewSkill] = useState<{ name: string; category: 'technical' | 'soft' | 'language' | 'other' }>({
    name: '',
    category: 'technical',
  });

  const { data, isLoading } = useAdminSkills({
    page,
    search: search || undefined,
  });
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const skills = data?.results || [];

  const handleCreate = () => {
    if (newSkill.name.trim()) {
      createSkill.mutate(newSkill, {
        onSuccess: () => {
          setShowCreateModal(false);
          setNewSkill({ name: '', category: 'technical' });
        },
      });
    }
  };

  const handleUpdate = () => {
    if (editingSkill && newSkill.name.trim()) {
      updateSkill.mutate(
        { id: editingSkill.id, data: { name: newSkill.name.trim(), category: newSkill.category } },
        {
          onSuccess: () => {
            setEditingSkill(null);
            setNewSkill({ name: '', category: 'technical' });
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteSkill.mutate(deleteId, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setDeleteId(null);
        },
      });
    }
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setNewSkill({ name: skill.name, category: skill.category });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skills Management</h1>
          <p className="text-gray-500">Manage all skills available on the platform</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          leftIcon={<Plus weight="bold" className="w-4 h-4" />}
        >
          Add Skill
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input
          placeholder="Search skills by name or category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          leftIcon={<MagnifyingGlass weight="bold" className="w-5 h-5" />}
          fullWidth
        />
      </Card>

      {/* Skills Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Skill Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => <SkeletonTableRow key={i} columns={4} />)
              ) : skills.length > 0 ? (
                skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                          <Tag weight="bold" className="w-4 h-4" />
                        </div>
                        <p className="font-medium text-gray-900">{skill.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="secondary" size="sm" className="capitalize">
                        {skill.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">#{skill.id}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Pencil weight="bold" className="w-4 h-4" />}
                          onClick={() => openEditModal(skill)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<Trash weight="bold" className="w-4 h-4" />}
                          onClick={() => {
                            setDeleteId(skill.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <Tag weight="light" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No skills found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && (data.next || data.previous) && (
          <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {skills.length} of {data.count} skills
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.previous}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.next}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewSkill({ name: '', category: 'technical' });
        }}
        title="Add New Skill"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Skill Name"
            placeholder="e.g., React, Python, Communication"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            fullWidth
            required
          />
          <Select
            label="Category"
            options={categoryOptions.map((o) => ({ value: o.value, label: o.label }))}
            value={newSkill.category}
            onChange={(e) =>
              setNewSkill({
                ...newSkill,
                category: e.target.value as 'technical' | 'soft' | 'language' | 'other',
              })
            }
            fullWidth
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowCreateModal(false);
                setNewSkill({ name: '', category: 'technical' });
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              isLoading={createSkill.isPending}
              onClick={handleCreate}
              disabled={!newSkill.name.trim()}
            >
              Create Skill
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingSkill}
        onClose={() => {
          setEditingSkill(null);
          setNewSkill({ name: '', category: 'technical' });
        }}
        title="Edit Skill"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Skill Name"
            placeholder="e.g., React, Python"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            fullWidth
          />
          <Select
            label="Category"
            options={categoryOptions.map((o) => ({ value: o.value, label: o.label }))}
            value={newSkill.category}
            onChange={(e) =>
              setNewSkill({
                ...newSkill,
                category: e.target.value as 'technical' | 'soft' | 'language' | 'other',
              })
            }
            fullWidth
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setEditingSkill(null);
                setNewSkill({ name: '', category: 'technical' });
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              isLoading={updateSkill.isPending}
              onClick={handleUpdate}
              disabled={!newSkill.name.trim()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteId(null);
        }}
        title="Delete Skill"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this skill? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              isLoading={deleteSkill.isPending}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SkillsManagementPage;
