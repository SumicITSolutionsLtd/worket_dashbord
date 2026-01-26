import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Buildings,
  Phone,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  XCircle,
  Upload,
  CircleNotch,
} from '@phosphor-icons/react';
import { Button, Input, Select, Textarea, Card } from '../components/ui';
import { useMyEmployerApplication, useSubmitEmployerApplication } from '../hooks/useEmployer';
import type { EmployerApplicationFormData } from '../types/employer.types';

const ORGANIZATION_TYPES = [
  { value: 'company', label: 'Company' },
  { value: 'ngo', label: 'NGO / Non-Profit' },
  { value: 'government', label: 'Government Agency' },
  { value: 'startup', label: 'Startup' },
  { value: 'other', label: 'Other' },
];

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

const DISTRICTS = [
  { value: 'kampala', label: 'Kampala' },
  { value: 'wakiso', label: 'Wakiso' },
  { value: 'mukono', label: 'Mukono' },
  { value: 'jinja', label: 'Jinja' },
  { value: 'mbarara', label: 'Mbarara' },
  { value: 'gulu', label: 'Gulu' },
  { value: 'lira', label: 'Lira' },
  { value: 'mbale', label: 'Mbale' },
  { value: 'fort_portal', label: 'Fort Portal' },
  { value: 'arua', label: 'Arua' },
  { value: 'soroti', label: 'Soroti' },
  { value: 'masaka', label: 'Masaka' },
  { value: 'entebbe', label: 'Entebbe' },
  { value: 'other', label: 'Other' },
];

const STEPS = [
  { id: 1, title: 'Organization', icon: Buildings },
  { id: 2, title: 'Contact', icon: Phone },
  { id: 3, title: 'Documents', icon: FileText },
  { id: 4, title: 'Review', icon: CheckCircle },
];

const EmployerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: application, isLoading } = useMyEmployerApplication();
  const submitApplication = useSubmitEmployerApplication();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EmployerApplicationFormData>({
    organization_name: '',
    organization_type: 'company',
    industry: '',
    registration_number: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    reason_for_hiring: '',
  });
  const [document, setDocument] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployerApplicationFormData, string>>>({});

  // Redirect to dashboard if already approved
  useEffect(() => {
    if (application?.status === 'approved') {
      navigate('/');
    }
  }, [application, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof EmployerApplicationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument(file);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof EmployerApplicationFormData, string>> = {};

    if (step === 1) {
      if (!formData.organization_name.trim()) {
        newErrors.organization_name = 'Organization name is required';
      }
      if (!formData.organization_type) {
        newErrors.organization_type = 'Organization type is required';
      }
      if (!formData.industry) {
        newErrors.industry = 'Industry is required';
      }
    }

    if (step === 2) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Business email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Physical address is required';
      }
      if (!formData.district) {
        newErrors.district = 'District is required';
      }
    }

    if (step === 3) {
      if (!formData.reason_for_hiring.trim()) {
        newErrors.reason_for_hiring = 'Please tell us why you want to hire';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    if (document) {
      data.append('document', document);
    }

    try {
      await submitApplication.mutateAsync(data);
      // Application submitted, stay on page to show status
    } catch {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircleNotch weight="bold" className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  // Show application status if already submitted
  if (application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center">
              {application.status === 'pending' && (
                <>
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock weight="bold" className="w-8 h-8 text-amber-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h1>
                  <p className="text-gray-600 mb-6">
                    Thank you for your interest in hiring through Worket. Your application is currently
                    being reviewed by our team. We'll notify you once a decision has been made.
                  </p>
                </>
              )}

              {application.status === 'rejected' && (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle weight="bold" className="w-8 h-8 text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Rejected</h1>
                  <p className="text-gray-600 mb-4">
                    Unfortunately, your employer application has been rejected.
                  </p>
                  {application.rejection_reason && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-left">
                      <p className="text-sm font-medium text-red-800 mb-1">Reason:</p>
                      <p className="text-sm text-red-700">{application.rejection_reason}</p>
                    </div>
                  )}
                  <p className="text-gray-500 text-sm">
                    If you believe this was a mistake or have additional information to provide, please
                    contact our support team.
                  </p>
                </>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-medium text-gray-900 mb-4">Application Details</h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-xs text-gray-500">Organization</p>
                    <p className="text-sm font-medium text-gray-900">{application.organization_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {application.organization_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Industry</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{application.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Submitted</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(application.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show multi-step form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Become an Employer</h1>
          <p className="text-gray-600">Complete your application to start hiring on Worket</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-md'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle weight="bold" className="w-6 h-6" />
                    ) : (
                      <Icon weight="bold" className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`text-sm mt-2 font-medium ${
                      isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Card */}
        <Card className="p-8">
          {/* Step 1: Organization */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Organization Details</h2>
                <p className="text-gray-500 text-sm">Tell us about your organization</p>
              </div>

              <Input
                label="Organization Name"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleInputChange}
                placeholder="Enter your organization's name"
                error={errors.organization_name}
                required
              />

              <Select
                label="Organization Type"
                name="organization_type"
                value={formData.organization_type}
                onChange={handleInputChange}
                options={ORGANIZATION_TYPES}
                error={errors.organization_type}
                required
              />

              <Select
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                options={INDUSTRIES}
                placeholder="Select your industry"
                error={errors.industry}
                required
              />
            </div>
          )}

          {/* Step 2: Contact */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Contact Information</h2>
                <p className="text-gray-500 text-sm">How can we reach your organization?</p>
              </div>

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+256 700 000000"
                error={errors.phone}
                required
              />

              <Input
                label="Business Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contact@organization.com"
                error={errors.email}
                required
              />

              <Input
                label="Physical Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street, Building, Floor"
                error={errors.address}
                required
              />

              <Select
                label="District"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                options={DISTRICTS}
                placeholder="Select district"
                error={errors.district}
                required
              />
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Documents & Verification</h2>
                <p className="text-gray-500 text-sm">Help us verify your organization</p>
              </div>

              <Input
                label="Registration Number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleInputChange}
                placeholder="Business registration number (optional)"
                helperText="If available, provide your company registration number"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Business Registration Document
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <Upload weight="bold" className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    {document ? (
                      <p className="text-sm text-primary-600 font-medium">{document.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max 5MB)</p>
                      </>
                    )}
                  </label>
                </div>
                <p className="mt-1.5 text-sm text-gray-500">Optional but helps speed up verification</p>
              </div>

              <Textarea
                label="Why do you want to hire through Worket?"
                name="reason_for_hiring"
                value={formData.reason_for_hiring}
                onChange={handleInputChange}
                placeholder="Tell us about your hiring needs and why you chose Worket..."
                rows={4}
                error={errors.reason_for_hiring}
                required
              />
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Review Your Application</h2>
                <p className="text-gray-500 text-sm">Please review your information before submitting</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Organization Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Organization Name</p>
                      <p className="text-sm font-medium text-gray-900">{formData.organization_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Type</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {formData.organization_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Industry</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{formData.industry}</p>
                    </div>
                    {formData.registration_number && (
                      <div>
                        <p className="text-xs text-gray-400">Registration No.</p>
                        <p className="text-sm font-medium text-gray-900">{formData.registration_number}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Address</p>
                      <p className="text-sm font-medium text-gray-900">{formData.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">District</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{formData.district}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Additional Information</h3>
                  {document && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400">Document</p>
                      <p className="text-sm font-medium text-primary-600">{document.name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400">Reason for Hiring</p>
                    <p className="text-sm text-gray-900 mt-1">{formData.reason_for_hiring}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  By submitting this application, you confirm that all information provided is accurate and
                  agree to Worket's terms of service for employers.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {currentStep > 1 ? (
              <Button
                variant="ghost"
                onClick={handlePrevious}
                leftIcon={<ArrowLeft weight="bold" className="w-4 h-4" />}
              >
                Previous
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                rightIcon={<ArrowRight weight="bold" className="w-4 h-4" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                isLoading={submitApplication.isPending}
                leftIcon={<CheckCircle weight="bold" className="w-4 h-4" />}
              >
                Submit Application
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployerOnboardingPage;
