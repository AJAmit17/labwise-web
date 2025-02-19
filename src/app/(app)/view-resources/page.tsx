/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { Loader2, FileText, FolderOpen } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { pinata } from '@/lib/pinata';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import React from 'react';

interface Resource {
    id: string;
    name: string;
    course: string;
    description: string;
    department: string;
    year: number;
    academicYear: string;
    professorName: string;
    cid: string | null;
}

interface GroupedResources {
    [department: string]: {
        [year: string]: {
            [professor: string]: {
                [course: string]: Resource[]
            }
        }
    }
}

export default function ViewResources() {
    const router = useRouter();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        department: 'all',
        year: 'all',
        professor: 'all',
        course: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [selectedProfessorCourses, setSelectedProfessorCourses] = useState<string[]>([]);

    useEffect(() => {
        fetchResources();
    }, [filters.department]);

    const fetchResources = async () => {
        try {
            setIsLoading(true);
            const url = filters.department === 'all'
                ? '/api/resources'
                : `/api/resources?department=${filters.department}`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setResources(data.resources);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createSignedURL = async (cid : string) => {
        const url = await pinata.gateways.createSignedURL({
            cid : cid,
            expires: 1800,
        });
        console.log(url);
        router.push(url);
    };

    // Extract unique values for filters
    const uniqueValues = {
        departments: Array.from(new Set(resources.map(r => r.department))),
        years: Array.from(new Set(resources.map(r => r.year.toString()))),
        professors: Array.from(new Set(resources.map(r => r.professorName || 'Unknown'))),
        courses: Array.from(new Set(resources.map(r => r.course || 'Uncategorized')))
    };

    // Effect to update available courses when professor changes
    useEffect(() => {
        if (filters.professor !== 'all') {
            const professorCourses = Array.from(new Set(
                resources
                    .filter(r => r.professorName === filters.professor)
                    .map(r => r.course)
                    .filter(Boolean) // Remove null/undefined values
            ));
            setSelectedProfessorCourses(professorCourses as string[]);
        } else {
            setSelectedProfessorCourses([]);
        }
    }, [filters.professor, resources]);

    // Reset dependent filters when parent filter changes
    const handleDepartmentChange = (value: string) => {
        setFilters({
            department: value,
            year: 'all',
            professor: 'all',
            course: 'all'
        });
    };

    const handleYearChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            year: value,
            professor: 'all',
            course: 'all'
        }));
    };

    const handleProfessorChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            professor: value,
            course: 'all'
        }));
    };

    // Filter resources based on selected filters and search query
    const filteredResources = resources.filter(resource => {
        const matchesSearch = searchQuery === '' || 
            resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (resource.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilters = 
            (filters.department === 'all' || resource.department === filters.department) &&
            (filters.year === 'all' || resource.year.toString() === filters.year) &&
            (filters.professor === 'all' || resource.professorName === filters.professor) &&
            (filters.course === 'all' || resource.course === filters.course);

        return matchesSearch && matchesFilters;
    });

    // Update breadcrumb based on filters
    const getBreadcrumbItems = () => {
        const items = [];
        if (filters.department !== 'all') {
            items.push(filters.department);
            if (filters.year !== 'all') {
                items.push(`Year ${filters.year}`);
                if (filters.professor !== 'all') {
                    items.push(filters.professor);
                    if (filters.course !== 'all') {
                        items.push(filters.course);
                    }
                }
            }
        }
        return items;
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-background">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/view-resources">Study Resources</BreadcrumbLink>
                        </BreadcrumbItem>
                        {getBreadcrumbItems().map((item, index) => (
                            <React.Fragment key={index}>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{item}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="container mr-auto p-4">
                <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                    <FolderOpen className="h-4 w-4" />
                    <span className="font-bold text-xl text-foreground">Resources</span>
                    {currentPath.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <span className="mx-2 text-muted-foreground">/</span>
                            <span className="font-medium text-foreground">{item}</span>
                        </div>
                    ))}
                </div>

                {/* Enhanced Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <Input
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="lg:col-span-2"
                    />
                    
                    <Select
                        value={filters.department}
                        onValueChange={handleDepartmentChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {uniqueValues.departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.year}
                        onValueChange={handleYearChange}
                        disabled={filters.department === 'all'}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {uniqueValues.years.map(year => (
                                <SelectItem key={year} value={year}>Year {year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.professor}
                        onValueChange={handleProfessorChange}
                        disabled={filters.year === 'all'}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Professor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Professors</SelectItem>
                            {uniqueValues.professors.map(prof => (
                                <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Course Select - Only shown when professor is selected */}
                    {filters.professor !== 'all' && selectedProfessorCourses.length > 0 && (
                        <Select
                            value={filters.course}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, course: value }))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {selectedProfessorCourses.map(course => (
                                    <SelectItem key={course} value={course}>{course}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* Active Filters with updated theming */}
                {Object.entries(filters).some(([_, value]) => value !== 'all') && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {Object.entries(filters).map(([key, value]) => 
                            value !== 'all' && (
                                <Badge 
                                    key={key} 
                                    variant="secondary" 
                                    className="px-3 py-1 bg-secondary text-secondary-foreground"
                                >
                                    {key}: {value}
                                    <button 
                                        className="ml-2 hover:text-destructive"
                                        onClick={() => setFilters(prev => ({...prev, [key]: 'all'}))}
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )
                        )}
                    </div>
                )}

                {/* Resources Grid with updated theming */}
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResources.map((resource) => (
                            <Card key={resource.id} className="flex flex-col p-4 hover:shadow-lg transition-all border-border bg-card">
                                {/* ... existing card content with updated theming ... */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-card-foreground">
                                            {resource.name}
                                        </h3>
                                        {resource.description && (
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                {resource.description}
                                            </p>
                                        )}
                                    </div>
                                    <FileText className="h-5 w-5 text-muted-foreground ml-2 flex-shrink-0" />
                                </div>
                                
                                <div className="mt-auto pt-4">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge variant="outline">{resource.department}</Badge>
                                        <Badge variant="outline">Year {resource.year}</Badge>
                                        {resource.course && (
                                            <Badge variant="outline" className="text-primary">
                                                {resource.course}
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <Button
                                        onClick={() => resource.cid ? createSignedURL(resource.cid) : null}
                                        className={`w-full ${!resource.cid ? 'opacity-50' : ''}`}
                                        disabled={!resource.cid}
                                        variant={resource.cid ? "default" : "secondary"}
                                    >
                                        {resource.cid ? 'View Resource' : 'No Resource Available'}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State with updated theming */}
                {!isLoading && filteredResources.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No resources found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                    </div>
                )}
            </div>
        </div>
    );
}
