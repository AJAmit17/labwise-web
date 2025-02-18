/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { experimentFormSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    // FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Editor } from '@tinymce/tinymce-react';
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const createExperiment = async (experimentData: z.infer<typeof experimentFormSchema>) => {
    try {
        const response = await fetch('/api/experiments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(experimentData),
        });

        if (!response.ok) {
            throw new Error('Failed to create experiment');
        }

        return response.json();
    } catch (error) {
        console.error('Error creating experiment:', error);
        throw error;
    }
};

const updateExperiment = async (id: string, experimentData: z.infer<typeof experimentFormSchema>) => {
    try {
        const response = await fetch(`/api/experiments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(experimentData),
        });

        if (!response.ok) {
            throw new Error('Failed to update experiment');
        }

        return response.json();
    } catch (error) {
        console.error('Error updating experiment:', error);
        throw error;
    }
};

interface ExpProps {
    type?: 'create' | 'edit';
    experimentDetails?: string;
}

export default function ExperimentForm({
    type = 'create',
    experimentDetails,
}: ExpProps) {
    const editorRef = useRef<any>(null)
    const router = useRouter();

    const parsedExperimentDetails = experimentDetails && JSON.parse(experimentDetails || "");

    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof experimentFormSchema>>({
        resolver: zodResolver(experimentFormSchema),
        defaultValues: {
            year: parsedExperimentDetails ? parsedExperimentDetails.year : 0,
            aceYear: parsedExperimentDetails ? parsedExperimentDetails.aceYear || "" : "",
            Branch: parsedExperimentDetails ? parsedExperimentDetails.Branch || "" : "",
            CCode: parsedExperimentDetails ? parsedExperimentDetails.CCode || "" : "",
            CName: parsedExperimentDetails ? parsedExperimentDetails.CName || "" : "",
            ExpNo: parsedExperimentDetails ? parsedExperimentDetails.ExpNo : 0,
            ExpName: parsedExperimentDetails ? parsedExperimentDetails.ExpName || "" : "",
            ExpDesc: parsedExperimentDetails ? parsedExperimentDetails.ExpDesc || "" : "",
            ExpSoln: parsedExperimentDetails ? parsedExperimentDetails.ExpSoln || "" : "",
            youtubeLink: parsedExperimentDetails ? parsedExperimentDetails.youtubeLink || "" : ""
        }
    });

    async function onSubmit(values: z.infer<typeof experimentFormSchema>) {
        setIsSubmitting(true);

        try {
            if (type === 'edit' && parsedExperimentDetails?.id) {
                await updateExperiment(parsedExperimentDetails.id, values);
            } else {
                await createExperiment(values);
            }
            router.push("/experiments")
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="max-w-4xl">
            <CardHeader>
                <CardTitle>{type === 'edit' ? 'Edit' : 'Create'} Experiment</CardTitle>
                <CardDescription>
                    Fill in the details for your experiment. Required fields are marked with an asterisk (*).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Details Group */}
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter year (1-4)"
                                                {...field}
                                                onChange={event => field.onChange(+event.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="aceYear"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Academic Year *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 2023-2024" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="Branch"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Branch *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., CSE, ISE, CSE-DS" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="CCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Code *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 22CDL32" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Full Width Fields */}
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="CName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Advanced Data Structures" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="ExpNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Experiment Number *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter experiment number"
                                                    {...field}
                                                    onChange={event => field.onChange(+event.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ExpName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Experiment Name/Title *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Queries on Movie DB" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="ExpDesc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Experiment Description *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write the Description here..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ExpSoln"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full gap-3">
                                        <FormLabel>Experiment Solution *</FormLabel>
                                        <FormControl>
                                            <Editor
                                                apiKey={"zm5qwqqx3k9r97pxx4z8q8eovkf2gfkfmo3fnwfuemt0ippy"}
                                                // apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                                onInit={(evt, editor) => {
                                                    editorRef.current = editor;
                                                }}
                                                onBlur={field.onBlur}
                                                onEditorChange={(content) => field.onChange(content)}
                                                initialValue={parsedExperimentDetails ? parsedExperimentDetails.ExpSoln || "" : ""}
                                                init={{
                                                    height: 350,
                                                    menubar: false,
                                                    plugins: [
                                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                        'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
                                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                                    ],
                                                    toolbar: 'undo redo | blocks | ' +
                                                        'codesample | bold italic forecolor | alignleft aligncenter |' +
                                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                                        'removeformat | help',
                                                    content_style: 'body { font-family:Inter; font-size:16px }',
                                                    skin: "oxide-dark",
                                                    content_css: "dark"
                                                }}
                                            >
                                            </Editor>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="youtubeLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>YouTube Link</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://youtube.com/watch?v=..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            className=" bg-purple-800 text-white"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {type === 'edit' ? 'Update' : 'Upload'} Experiment
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}