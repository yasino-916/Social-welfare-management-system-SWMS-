import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { feedbackApi } from '@/services/api/feedbackApi';
import FormField from '@/components/forms/FormField';
import TextArea from '@/components/forms/TextArea';
import toast from 'react-hot-toast';
import { useState } from 'react';

const schema = z.object({
  message: z.string().min(10, 'Please provide at least 10 characters'),
  rating: z.coerce.number().min(1).max(5).optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  application_id: z.string().optional(),
  is_anonymous: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: feedbackApi.publicSubmit,
    onSuccess: () => setSubmitted(true),
    onError: () => toast.error('Failed to submit feedback. Please try again.'),
  });

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900">Thank you for your feedback!</h2>
        <p className="mt-2 text-gray-500">Your feedback has been received and will be reviewed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit Feedback</h1>
      <p className="text-sm text-gray-500 mb-6">
        Share your feedback about our services. You may submit anonymously.
      </p>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="card space-y-5">
        <FormField label="Your Feedback" htmlFor="message" error={errors.message?.message} required>
          <TextArea id="message" error={!!errors.message} {...register('message')} placeholder="Describe your feedback..." />
        </FormField>

        <FormField label="Rating (1–5)" htmlFor="rating">
          <input id="rating" type="number" min={1} max={5} className="input" {...register('rating')} />
        </FormField>

        <FormField label="Application Reference Number" htmlFor="application_id">
          <input id="application_id" type="text" className="input" placeholder="Optional" {...register('application_id')} />
        </FormField>

        <div className="border-t pt-4 space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('is_anonymous')} className="rounded" />
            Submit anonymously
          </label>
          <FormField label="Your Name" htmlFor="contact_name">
            <input id="contact_name" type="text" className="input" placeholder="Optional" {...register('contact_name')} />
          </FormField>
          <FormField label="Phone Number" htmlFor="contact_phone">
            <input id="contact_phone" type="tel" className="input" placeholder="Optional" {...register('contact_phone')} />
          </FormField>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
