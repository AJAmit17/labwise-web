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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Editor } from '@tinymce/tinymce-react';
import { Textarea } from "../ui/textarea";

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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* YEAR - Integer */}
                <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel className=" text-sm">
                                Year<span className="ml-1 font-bold text-destructive">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Input
                                    type="number"
                                    className="bg-input min-h-[56px] rounded-lg border border-primary-foreground"
                                    {...field}
                                    onChange={event => field.onChange(+event.target.value)}
                                />
                            </FormControl>
                            <FormDescription className="mt-2.5">
                                Enter Year in Number i.e., 1/2/3/4
                            </FormDescription>
                            <FormMessage className="font-semibold text-destructive" />
                        </FormItem>
                    )}
                />
                {/* ACEYEAR */}
                <FormField
                    control={form.control}
                    name="aceYear"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel className="text-sm">
                                Academic Year<span className="ml-1 font-bold text-destructive">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Input className="bg-input min-h-[56px] rounded-lg border border-primary-foreground" {...field} />
                            </FormControl>
                            <FormDescription className="mt-2.5">
                                Enter Academic Year i.e., 2023-2024
                            </FormDescription>
                            <FormMessage className="font-semibold text-destructive" />
                        </FormItem>
                    )}
                />
                {/* BRANCH */}
                <FormField
                    control={form.control}
                    name="Branch"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel className="text-sm">
                                Branch<span className="ml-1 font-bold text-destructive">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Input className="bg-input min-h-[56px] rounded-lg border border-primary-foreground" {...field} />
                            </FormControl>
                            <FormDescription className="mt-2.5">
                                Enter Branch i.e., CSE/ISE/CSE-DS etc.
                            </FormDescription>
                            <FormMessage className="font-semibold text-destructive" />
                        </FormItem>
                    )}
                />
                {/* CCode */}
                <FormField
                    control={form.control}
                    name="CCode"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel className="text-sm">
                                Course Code<span className="ml-1 font-bold text-destructive">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Input className="bg-input min-h-[56px] rounded-lg border border-primary-foreground" {...field} />
                            </FormControl>
                            <FormDescription className="mt-2.5">
                                Enter Course Code i.e., 22CDL32 etc.
                            </FormDescription>
                            <FormMessage className="font-semibold text-destructive" />
                        </FormItem>
                    )}
                />
                {/* CName */}
                <FormField
                    control={form.control}
                    name="CName"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel className="text-sm">
                                Course Name<span className="ml-1 font-bold text-destructive">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Input className="bg-input min-h-[56px] rounded-lg border border-primary-foreground" {...field} />
                            </FormControl>
                            <FormDescription className="mt-2.5">
                                Enter Course Name i.e., ADS/DBMS etc.
                            </FormDescription>
                            <FormMessage className="font-semibold text-destructive" />
                        </FormItem>
                    )}
                />
                {/* ExpNo - Integer */}
                <FormField
                    control={form.control}
                    name="ExpNo"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel className="text-sm">
                                Experiment Number<span className="ml-1 font-bold text-destructive">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Input
                                    type="number"
                                    className="bg-input min-h-[56px] rounded-lg border border-primary-foreground"
                                    {...field}
                                    onChange={event => field.onChange(+event.target.value)}
                                />
                            </FormControl>
                            <FormDescription className="mt-2.5">
                                Enter Experiment Number i.e., 1/2/3/4 etc.
                            </FormDescription>
                            <FormMessage className="font-semibold text-destructive" />
                        </FormItem>
                    )}
                />
                {/* ExpName  */}
                <FormField
                    control={form.control}
                    name="ExpName"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel className="text-sm">
                                Experiment Name/Title<span className="ml-1 font-bold text-destructive">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Input className="bg-input min-h-[56px] rounded-lg border border-primary-foreground" {...field} />
                            </FormControl>
                            <FormDescription className="mt-2.5">
                                Enter Experiment Name i.e., Quries on Movie DB ,etc.
                            </FormDescription>
                            <FormMessage className="font-semibold text-destructive" />
                        </FormItem>
                    )}
                />
                {/* ExpDesc */}
                <FormField
                    control={form.control}
                    name="ExpDesc"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel className="text-sm">
                                Experiment Description<span className="ml-1 font-bold text-destructive">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Textarea
                                    placeholder="Write the Description here..."
                                    className="bg-input min-h-[300px] rounded-lg border border-primary-foreground"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="mt-2.5">
                                Enter Description of the Experiment.
                            </FormDescription>
                            <FormMessage className="font-semibold text-destructive" />
                        </FormItem>
                    )}
                />
                {/* ExpSoln */}
                <FormField
                    control={form.control}
                    name="ExpSoln"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                            <FormLabel className="text-sm">
                                Experiment Solution<span className="ml-1 font-bold text-destructive">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
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
                            <FormDescription className="mt-2.5">
                                Upload all the Text and Code Solution of the Experiment
                            </FormDescription>
                            <FormMessage className="font-semibold text-destructive" />
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
                            <FormDescription>
                                Paste the YouTube video URL for this experiment
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className=" bg-purple-800 text-white"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {type === 'edit' ? 'Update' : 'Upload'} Experiment
                </Button>
            </form>
        </Form>
    )
}