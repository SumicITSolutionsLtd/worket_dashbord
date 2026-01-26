import React, { useState } from 'react';
import { MagnifyingGlass, GraduationCap } from '@phosphor-icons/react';
import { Card, Input, SkeletonTableRow } from '../../components/ui';
import { useAllCourses } from '../../hooks/useAdmin';
import { formatDate } from '../../lib/utils';

const AllCoursesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAllCourses({ search });

  const courses = data?.results || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>
          <p className="text-gray-500">View and manage all courses</p>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <MagnifyingGlass
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <Input
              type="text"
              placeholder="Search by course name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>
      </div>

      {/* Courses Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => <SkeletonTableRow key={i} columns={5} />)
              ) : courses.length > 0 ? (
                courses.map((course: { id: number; title?: string; name?: string; description?: string; category?: { name: string } | string; instructor?: { full_name?: string; name?: string; email?: string } | string; enrollments_count?: number; enrollment_count?: number; created_at?: string }) => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <GraduationCap weight="bold" className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{course.title || course.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {course.description || '-'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {course.category 
                        ? (typeof course.category === 'object' 
                            ? course.category.name 
                            : course.category)
                        : '-'}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {course.instructor 
                        ? (typeof course.instructor === 'object' 
                            ? (course.instructor.full_name || course.instructor.name || course.instructor.email || '-')
                            : course.instructor)
                        : '-'}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {course.enrollments_count || course.enrollment_count || 0}
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      {course.created_at ? formatDate(course.created_at) : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <GraduationCap
                      weight="light"
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-gray-500">No courses found</p>
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

export default AllCoursesPage;
