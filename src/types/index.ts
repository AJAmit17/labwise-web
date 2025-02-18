import { z } from "zod";

export const experimentFormSchema = z.object({
  year: z.number().min(1).max(4),
  aceYear: z.string().min(1),
  Branch: z.string().min(1),
  CCode: z.string().min(1),
  CName: z.string().min(1),
  ExpNo: z.number().min(1),
  ExpName: z.string().min(1),
  ExpDesc: z.string().min(1),
  ExpSoln: z.string().min(1),
  youtubeLink: z.string().optional(),
});

export type ExperimentFormData = z.infer<typeof experimentFormSchema>;
