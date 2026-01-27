import React, { useState, useMemo } from 'react';
import { Brain, Info } from '@phosphor-icons/react';
import { Button, Card, Textarea } from '../ui';
import type { AIShortlistCriteria } from '../../types/api.types';

interface CriteriaWeightsFormProps {
  onSubmit: (criteria: AIShortlistCriteria) => void;
  isSubmitting?: boolean;
  initialCriteria?: AIShortlistCriteria;
}

const defaultCriteria: AIShortlistCriteria = {
  skills_match_weight: 40,
  experience_weight: 30,
  education_weight: 20,
  location_weight: 10,
  custom_criteria: '',
};

interface WeightSliderProps {
  label: string;
  field: keyof AIShortlistCriteria;
  description: string;
  criteria: AIShortlistCriteria;
  onWeightChange: (field: keyof AIShortlistCriteria, value: number) => void;
}

const WeightSlider: React.FC<WeightSliderProps> = ({
  label,
  field,
  description,
  criteria,
  onWeightChange,
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <span className="text-sm font-bold text-gray-900">
        {criteria[field] as number}%
      </span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      step="5"
      value={criteria[field] as number}
      onChange={(e) => onWeightChange(field, parseInt(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
    />
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

const CriteriaWeightsForm: React.FC<CriteriaWeightsFormProps> = ({
  onSubmit,
  isSubmitting,
  initialCriteria,
}) => {
  const [criteria, setCriteria] = useState<AIShortlistCriteria>(
    initialCriteria || defaultCriteria
  );

  const total =
    criteria.skills_match_weight +
    criteria.experience_weight +
    criteria.education_weight +
    criteria.location_weight;

  const error = useMemo(() => {
    if (total !== 100) {
      return `Weights must sum to 100 (currently ${total})`;
    }
    return null;
  }, [total]);

  const handleWeightChange = (field: keyof AIShortlistCriteria, value: number) => {
    setCriteria((prev) => ({
      ...prev,
      [field]: Math.max(0, Math.min(100, value)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (total === 100) {
      onSubmit(criteria);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-purple-100/80 rounded-xl">
            <Brain weight="bold" className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Analysis Criteria</h3>
            <p className="text-sm text-gray-500">
              Adjust the weights to prioritize what matters most for this role.
              Total must equal 100%.
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-6">
          <WeightSlider
            label="Skills Match"
            field="skills_match_weight"
            description="How well the candidate's skills match the job requirements"
            criteria={criteria}
            onWeightChange={handleWeightChange}
          />
          <WeightSlider
            label="Experience"
            field="experience_weight"
            description="Relevant work experience and career progression"
            criteria={criteria}
            onWeightChange={handleWeightChange}
          />
          <WeightSlider
            label="Education"
            field="education_weight"
            description="Educational background and qualifications"
            criteria={criteria}
            onWeightChange={handleWeightChange}
          />
          <WeightSlider
            label="Location"
            field="location_weight"
            description="Proximity to job location or remote work suitability"
            criteria={criteria}
            onWeightChange={handleWeightChange}
          />
        </div>

        {/* Total indicator */}
        <div
          className={`flex items-center justify-between p-3 rounded-lg mb-6 ${
            total === 100
              ? 'bg-green-100/80 text-green-700'
              : 'bg-red-100/80 text-red-700'
          }`}
        >
          <span className="font-medium">Total Weight</span>
          <span className="font-bold">{total}%</span>
        </div>

        {/* Custom criteria */}
        <div className="mb-6">
          <Textarea
            label="Custom Criteria (Optional)"
            value={criteria.custom_criteria || ''}
            onChange={(e) =>
              setCriteria((prev) => ({ ...prev, custom_criteria: e.target.value }))
            }
            placeholder="Add any specific requirements or preferences for the AI to consider..."
            rows={3}
            helperText="Describe any additional factors the AI should consider when ranking candidates"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
            <Info weight="bold" className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          disabled={total !== 100}
          leftIcon={<Brain weight="bold" className="w-5 h-5" />}
        >
          Start AI Analysis
        </Button>
      </Card>
    </form>
  );
};

export default CriteriaWeightsForm;
