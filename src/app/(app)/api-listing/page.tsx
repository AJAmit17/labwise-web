'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiSection, HttpMethod, MethodColors } from '@/types/api';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const ApiListing = () => {
  const apis: ApiSection = {
    timeTable: [
      {
        method: 'GET',
        endpoint: '/api/time-table',
        description: 'Fetch time tables based on department, year, and academic year',
        params: ['department', 'year', 'academicYear'],
        returns: 'Array of time tables with their slots'
      },
      {
        method: 'POST',
        endpoint: '/api/time-table',
        description: 'Create a new time table with slots',
        body: {
          department: 'string',
          year: 'number',
          academicYear: 'string',
          slots: 'Array<TimeTableSlot>'
        }
      },
      {
        method: 'DELETE',
        endpoint: '/api/time-table/[id]',
        description: 'Delete a specific time table',
        params: ['id']
      }
    ],
    resources: [
      {
        method: 'GET',
        endpoint: '/api/resources',
        description: 'Fetch all resources',
        returns: 'Array of resources with file URLs'
      },
      {
        method: 'POST',
        endpoint: '/api/resources',
        description: 'Create a new resource',
        body: {
          name: 'string',
          department: 'string',
          year: 'number',
          academicYear: 'string',
          cid: 'string?',
          course: 'string?',
          description: 'string?',
          professorName: 'string?'
        }
      }
    ],
    experiments: [
      {
        method: 'GET',
        endpoint: '/api/experiments',
        description: 'Fetch experiments with optional filtering and sorting',
        params: ['search?', 'branch?', 'year?', 'sortBy?', 'sortOrder?']
      },
      {
        method: 'POST',
        endpoint: '/api/experiments',
        description: 'Create a new experiment',
        body: {
          year: 'number',
          aceYear: 'string',
          Branch: 'string',
          CCode: 'string',
          CName: 'string',
          ExpNo: 'number',
          ExpName: 'string',
          ExpDesc: 'string',
          ExpSoln: 'string',
          youtubeLink: 'string?'
        }
      },
      {
        method: 'GET',
        endpoint: '/api/experiments/[id]',
        description: 'Fetch a specific experiment',
        params: ['id']
      },
      {
        method: 'PUT',
        endpoint: '/api/experiments/[id]',
        description: 'Update a specific experiment',
        params: ['id']
      },
      {
        method: 'DELETE',
        endpoint: '/api/experiments/[id]',
        description: 'Delete a specific experiment',
        params: ['id']
      }
    ]
  };

  const getMethodColor = (method: HttpMethod): string => {
    const colors: MethodColors = {
      GET: 'bg-blue-500',
      POST: 'bg-green-500',
      PUT: 'bg-yellow-500',
      DELETE: 'bg-red-500'
    };
    return colors[method];
  };

  return (
    <div className="flex flex-col w-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>API Documentation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">API Documentation</h1>
        </div>
        
        <Tabs defaultValue="timeTable">
          <TabsList className="mb-4">
            <TabsTrigger value="timeTable">Time Table</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="experiments">Experiments</TabsTrigger>
          </TabsList>

          {Object.entries(apis).map(([key, endpoints]) => (
            <TabsContent key={key} value={key}>
              {endpoints.map((api, index) => (
                <Card key={index} className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Badge className={`${getMethodColor(api.method)} text-white`}>
                        {api.method}
                      </Badge>
                      <span className="font-mono">{api.endpoint}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{api.description}</p>
                    
                    {api.params && (
                      <div className="mb-3">
                        <h4 className="font-semibold mb-2">Parameters:</h4>
                        <ul className="list-disc list-inside">
                          {api.params.map((param, i) => (
                            <li key={i} className="text-gray-600">{param}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {api.body && (
                      <div className="mb-3">
                        <h4 className="font-semibold mb-2">Request Body:</h4>
                        <Card className="bg-muted">
                          <CardContent className="p-3 font-mono text-sm">
                            {JSON.stringify(api.body, null, 2)}
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {api.returns && (
                      <div>
                        <h4 className="font-semibold mb-2">Returns:</h4>
                        <p className="text-gray-600">{api.returns}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ApiListing;
