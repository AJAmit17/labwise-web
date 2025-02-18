/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { pinata } from '@/lib/pinata';
import { useRouter } from 'next/navigation';

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

export default function ViewResources() {
    const router = useRouter();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchResources();
    }, [selectedDepartment]);

    const fetchResources = async () => {
        try {
            setIsLoading(true);
            const url = selectedDepartment === 'all'
                ? '/api/resources'
                : `/api/resources?department=${selectedDepartment}`;

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

    const groupByDepartment = (resources: Resource[]) => {
        return resources.reduce((acc, resource) => {
            const dept = resource.department;
            if (!acc[dept]) {
                acc[dept] = [];
            }
            acc[dept].push(resource);
            return acc;
        }, {} as Record<string, Resource[]>);
    };

    const filteredResources = resources.filter(resource =>
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.professorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedResources = groupByDepartment(filteredResources);
    const departments = Array.from(new Set(resources.map(r => r.department)));

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Study Resources</h1>

            <div className="flex gap-4 mb-6">
                <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>
                                {dept}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <Accordion type="single" collapsible className="space-y-4">
                    {Object.entries(groupedResources).map(([department, deptResources]) => (
                        <AccordionItem key={department} value={department}>
                            <AccordionTrigger className="text-xl font-semibold">
                                {department} ({deptResources.length} resources)
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-4 p-4">
                                    {deptResources.map((resource) => (
                                        <Card key={resource.id} className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold">{resource.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        Course: {resource.course}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Professor: {resource.professorName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Year: {resource.year} | {resource.academicYear}
                                                    </p>
                                                    <p className="mt-2">{resource.description}</p>
                                                </div>
                                                <Button
                                                    // onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${resource.cid}`, '_blank')}
                                                    onClick={() => resource.cid ? createSignedURL(resource.cid) : null}
                                                    rel="noopener noreferrer"
                                                    className={`bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm ${!resource.cid ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {resource.cid ? 'View Resource' : 'No Resource Available'}
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
}
