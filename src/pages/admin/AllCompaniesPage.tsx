import React, { useState } from 'react';
import { MagnifyingGlass, Building, CheckCircle } from '@phosphor-icons/react';
import { Card, Input, Select, Badge, SkeletonTableRow } from '../../components/ui';
import { useAllCompanies } from '../../hooks/useAdmin';

const industryOptions = [
  { value: 'all', label: 'All Industries' },
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'other', label: 'Other' },
];

const AllCompaniesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('all');
  const { data, isLoading } = useAllCompanies({ 
    search, 
    industry: industry !== 'all' ? industry : undefined 
  });

  const companies = data?.results || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Companies</h1>
          <p className="text-gray-500">View and manage all company profiles</p>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlass
                weight="bold"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search by company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={industryOptions}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              fullWidth
            />
          </div>
        </Card>
      </div>

      {/* Companies Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Open Positions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => <SkeletonTableRow key={i} columns={5} />)
              ) : companies.length > 0 ? (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="w-full h-full rounded-lg object-cover"
                            />
                          ) : (
                            <Building weight="bold" className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{company.name}</p>
                          <p className="text-sm text-gray-500">{company.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600 capitalize">{company.industry}</td>
                    <td className="px-4 py-4 text-gray-600">{company.location}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {company.is_verified && (
                          <Badge variant="success" dot>
                            <CheckCircle weight="fill" className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {company.is_featured && (
                          <Badge variant="info">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {company.open_positions_count || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Building
                      weight="light"
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-gray-500">No companies found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AllCompaniesPage;
