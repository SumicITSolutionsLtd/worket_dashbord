import React, { useState, useEffect, useRef } from 'react';
import {
  Buildings,
  Camera,
  Globe,
  MapPin,
  Phone,
  EnvelopeSimple,
  LinkedinLogo,
  TwitterLogo,
  CalendarBlank,
  Users,
  CircleNotch,
  Plus,
  PencilSimple,
  Image,
} from '@phosphor-icons/react';
import { Button, Input, Textarea, Select, Card } from '../components/ui';
import { useMyCompanies, useCreateCompany, useUpdateCompany } from '../hooks/useCompany';
import type { Company } from '../types/api.types';

const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'construction', label: 'Construction' },
  { value: 'transportation', label: 'Transportation & Logistics' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'other', label: 'Other' },
];

const EMPLOYEE_COUNTS = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1001+', label: '1000+ employees' },
];

interface CompanyFormData {
  name: string;
  description: string;
  website: string;
  location: string;
  industry: string;
  employee_count: string;
  founded_year: string;
  email: string;
  phone: string;
  linkedin_url: string;
  twitter_url: string;
}

const CompanyProfilePage: React.FC = () => {
  const { data: companies, isLoading } = useMyCompanies();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    description: '',
    website: '',
    location: '',
    industry: '',
    employee_count: '',
    founded_year: '',
    email: '',
    phone: '',
    linkedin_url: '',
    twitter_url: '',
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyFormData, string>>>({});

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const company = companies?.[0];

  // Initialize form data when company loads
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        description: company.description || '',
        website: company.website || '',
        location: company.location || '',
        industry: company.industry || '',
        employee_count: company.employee_count || '',
        founded_year: company.founded_year?.toString() || '',
        email: company.email || '',
        phone: company.phone || '',
        linkedin_url: company.linkedin_url || '',
        twitter_url: company.twitter_url || '',
      });
      setLogoPreview(company.logo);
      setCoverPreview(company.cover_image);
    }
  }, [company]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CompanyFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    if (formData.founded_year) {
      const year = parseInt(formData.founded_year);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1800 || year > currentYear) {
        newErrors.founded_year = 'Please enter a valid year';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    if (logo) {
      data.append('logo', logo);
    }
    if (coverImage) {
      data.append('cover_image', coverImage);
    }

    try {
      if (company) {
        await updateCompany.mutateAsync({ id: company.id, data });
      } else {
        await createCompany.mutateAsync(data);
      }
      setIsEditing(false);
      setLogo(null);
      setCoverImage(null);
    } catch {
      // Error handled by hook
    }
  };

  const handleCancel = () => {
    if (company) {
      setFormData({
        name: company.name || '',
        description: company.description || '',
        website: company.website || '',
        location: company.location || '',
        industry: company.industry || '',
        employee_count: company.employee_count || '',
        founded_year: company.founded_year?.toString() || '',
        email: company.email || '',
        phone: company.phone || '',
        linkedin_url: company.linkedin_url || '',
        twitter_url: company.twitter_url || '',
      });
      setLogoPreview(company.logo);
      setCoverPreview(company.cover_image);
    }
    setLogo(null);
    setCoverImage(null);
    setIsEditing(false);
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <CircleNotch weight="bold" className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  // Show create company view if no company exists
  if (!company && !isEditing) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-500">Manage your company's profile and branding</p>
        </div>

        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Buildings weight="bold" className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Company Profile Yet</h2>
            <p className="text-gray-500 mb-6">
              Create your company profile to showcase your brand to potential candidates and build trust
              with job seekers.
            </p>
            <Button
              onClick={() => setIsEditing(true)}
              leftIcon={<Plus weight="bold" className="w-4 h-4" />}
            >
              Create Company Profile
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Edit/Create form
  if (isEditing || !company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {company ? 'Edit Company Profile' : 'Create Company Profile'}
            </h1>
            <p className="text-gray-500">
              {company ? 'Update your company information' : 'Set up your company profile'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={createCompany.isPending || updateCompany.isPending}
            >
              {company ? 'Save Changes' : 'Create Company'}
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          {/* Cover Image Upload */}
          <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200">
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <input
              ref={coverInputRef}
              type="file"
              onChange={handleCoverChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-white transition-colors shadow-sm"
            >
              <Image weight="bold" className="w-4 h-4" />
              {coverPreview ? 'Change Cover' : 'Add Cover'}
            </button>
          </div>

          {/* Logo Upload */}
          <div className="px-6 -mt-12 relative z-10">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-xl bg-white border-4 border-white shadow-lg overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Buildings weight="bold" className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                onChange={handleLogoChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors shadow-md"
              >
                <Camera weight="bold" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Company Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter company name"
                error={errors.name}
                required
              />

              <Select
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                options={INDUSTRIES}
                placeholder="Select industry"
              />
            </div>

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell job seekers about your company, culture, and mission..."
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
                leftIcon={<MapPin weight="bold" className="w-4 h-4" />}
              />

              <Input
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourcompany.com"
                error={errors.website}
                leftIcon={<Globe weight="bold" className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Company Size"
                name="employee_count"
                value={formData.employee_count}
                onChange={handleInputChange}
                options={EMPLOYEE_COUNTS}
                placeholder="Select company size"
              />

              <Input
                label="Founded Year"
                name="founded_year"
                value={formData.founded_year}
                onChange={handleInputChange}
                placeholder="e.g., 2020"
                error={errors.founded_year}
                leftIcon={<CalendarBlank weight="bold" className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contact@company.com"
                error={errors.email}
                leftIcon={<EnvelopeSimple weight="bold" className="w-4 h-4" />}
              />

              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+256 700 000000"
                leftIcon={<Phone weight="bold" className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="LinkedIn"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/company/..."
                leftIcon={<LinkedinLogo weight="bold" className="w-4 h-4" />}
              />

              <Input
                label="Twitter"
                name="twitter_url"
                value={formData.twitter_url}
                onChange={handleInputChange}
                placeholder="https://twitter.com/..."
                leftIcon={<TwitterLogo weight="bold" className="w-4 h-4" />}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // View mode
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-500">Manage your company's profile and branding</p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          leftIcon={<PencilSimple weight="bold" className="w-4 h-4" />}
        >
          Edit Profile
        </Button>
      </div>

      <Card className="overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200">
          {company.cover_image && (
            <img
              src={company.cover_image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Logo and Basic Info */}
        <div className="px-6 -mt-12 relative z-10">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-xl bg-white border-4 border-white shadow-lg overflow-hidden">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Buildings weight="bold" className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <div className="pb-2">
              <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
              {company.industry && (
                <p className="text-gray-500 capitalize">{company.industry}</p>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          {company.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{company.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.location && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin weight="bold" className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">{company.location}</p>
                </div>
              </div>
            )}

            {company.website && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Globe weight="bold" className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Website</p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    {company.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}

            {company.employee_count && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users weight="bold" className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Company Size</p>
                  <p className="text-sm font-medium text-gray-900">{company.employee_count}</p>
                </div>
              </div>
            )}

            {company.founded_year && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CalendarBlank weight="bold" className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Founded</p>
                  <p className="text-sm font-medium text-gray-900">{company.founded_year}</p>
                </div>
              </div>
            )}

            {company.email && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <EnvelopeSimple weight="bold" className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a
                    href={`mailto:${company.email}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    {company.email}
                  </a>
                </div>
              </div>
            )}

            {company.phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone weight="bold" className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <a
                    href={`tel:${company.phone}`}
                    className="text-sm font-medium text-gray-900"
                  >
                    {company.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          {(company.linkedin_url || company.twitter_url) && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Social Links</h3>
              <div className="flex gap-3">
                {company.linkedin_url && (
                  <a
                    href={company.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#0077b5] rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <LinkedinLogo weight="bold" className="w-5 h-5" />
                  </a>
                )}
                {company.twitter_url && (
                  <a
                    href={company.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#1da1f2] rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <TwitterLogo weight="bold" className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{company.open_positions_count || 0}</p>
                <p className="text-sm text-gray-500">Open Positions</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{company.followers_count || 0}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompanyProfilePage;
