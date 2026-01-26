import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Minus, X } from '@phosphor-icons/react';
import { Button, Input, Textarea, Select, Card } from '../ui';
import { useSkills } from '../../hooks/useEmployer';
import type { JobFormData, Skill } from '../../types/api.types';

interface JobFormProps {
  initialData?: Partial<JobFormData>;
  onSubmit: (data: JobFormData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const jobTypeOptions = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
  { value: 'freelance', label: 'Freelance' },
];

const experienceLevelOptions = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'executive', label: 'Executive' },
];

const currencyOptions = [
  { value: 'UGX', label: 'UGX' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
];

const JobForm: React.FC<JobFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = 'Create Job',
}) => {
  const { data: skills = [] } = useSkills();
  const [selectedSkills, setSelectedSkills] = useState<number[]>(
    initialData?.skills_required || []
  );
  const [responsibilities, setResponsibilities] = useState<string[]>(
    initialData?.responsibilities || ['']
  );
  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements || ['']
  );
  const [niceToHave, setNiceToHave] = useState<string[]>(
    initialData?.nice_to_have || ['']
  );
  const [benefits, setBenefits] = useState<string[]>(
    initialData?.benefits || ['']
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      location: initialData?.location || '',
      job_type: initialData?.job_type || 'full-time',
      experience_level: initialData?.experience_level || 'entry',
      salary_min: initialData?.salary_min || null,
      salary_max: initialData?.salary_max || null,
      salary_currency: initialData?.salary_currency || 'UGX',
      is_active: initialData?.is_active ?? true,
      expires_at: initialData?.expires_at || null,
    },
  });

  const handleFormSubmit = (data: JobFormData) => {
    onSubmit({
      ...data,
      responsibilities: responsibilities.filter((r) => r.trim()),
      requirements: requirements.filter((r) => r.trim()),
      nice_to_have: niceToHave.filter((r) => r.trim()),
      benefits: benefits.filter((r) => r.trim()),
      skills_required: selectedSkills,
    });
  };

  const addListItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList([...list, '']);
  };

  const removeListItem = (
    index: number,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.length > 1) {
      setList(list.filter((_, i) => i !== index));
    }
  };

  const updateListItem = (
    index: number,
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const toggleSkill = (skillId: number) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const ListInput = ({
    label,
    items,
    setItems,
    placeholder,
  }: {
    label: string;
    items: string[];
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
    placeholder: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateListItem(index, e.target.value, items, setItems)}
              placeholder={placeholder}
            />
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => removeListItem(index, items, setItems)}
              disabled={items.length === 1}
            >
              <Minus weight="bold" className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => addListItem(items, setItems)}
          leftIcon={<Plus weight="bold" className="w-4 h-4" />}
        >
          Add Item
        </Button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <Input
            label="Job Title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
            placeholder="e.g., Senior Software Engineer"
          />

          <Textarea
            label="Job Description"
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
            placeholder="Describe the role and what the candidate will be doing..."
            rows={6}
          />

          <Input
            label="Location"
            {...register('location', { required: 'Location is required' })}
            error={errors.location?.message}
            placeholder="e.g., Kampala, Uganda"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Job Type"
              options={jobTypeOptions}
              {...register('job_type')}
            />
            <Select
              label="Experience Level"
              options={experienceLevelOptions}
              {...register('experience_level')}
            />
          </div>
        </div>
      </Card>

      {/* Salary */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Salary (Optional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Minimum"
            type="number"
            {...register('salary_min', { valueAsNumber: true })}
            placeholder="e.g., 2000000"
          />
          <Input
            label="Maximum"
            type="number"
            {...register('salary_max', { valueAsNumber: true })}
            placeholder="e.g., 4000000"
          />
          <Select
            label="Currency"
            options={currencyOptions}
            {...register('salary_currency')}
          />
        </div>
      </Card>

      {/* Requirements */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Requirements & Details</h3>
        <div className="space-y-6">
          <ListInput
            label="Responsibilities"
            items={responsibilities}
            setItems={setResponsibilities}
            placeholder="Enter a responsibility..."
          />
          <ListInput
            label="Requirements"
            items={requirements}
            setItems={setRequirements}
            placeholder="Enter a requirement..."
          />
          <ListInput
            label="Nice to Have"
            items={niceToHave}
            setItems={setNiceToHave}
            placeholder="Enter a nice-to-have skill..."
          />
          <ListInput
            label="Benefits"
            items={benefits}
            setItems={setBenefits}
            placeholder="Enter a benefit..."
          />
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: Skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => toggleSkill(skill.id)}
              className={`
                inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${
                  selectedSkills.includes(skill.id)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                }
              `}
            >
              {skill.name}
              {selectedSkills.includes(skill.id) && (
                <X weight="bold" className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
        {selectedSkills.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
