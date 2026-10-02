import { z } from 'zod';

export const saveSubmissionSchema = z.object({
  body: z.object({
    data: z.object({}).passthrough({
      message: 'Submission data must be a valid object'
    }),
    status: z.enum(['in-progress', 'submitted'], {
      required_error: 'Status is required and must be either in-progress or submitted'
    })
  })
});
