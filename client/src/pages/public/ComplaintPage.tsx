import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { complaintApi } from '@/services/api/complaintApi';
import FormField from '@/components/forms/FormField';
import TextArea from '@/components/forms/TextArea';
import SelectField from '@/components/forms/SelectField';
import toast from 'react-hot-toast';
import { useState } from 'react';

const schema = z.object({
  description: z.string().min(20, 'Please provide at least 20 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  application_id: z.string().optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  is_anonymous: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

export default function ComplaintPage() {
  const [result, setResult] = useState<{ complaint_reference: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'MEDIUM' },
  });

  const mutation = useMutation({
    mutationFn: complaintApi.publicSubmit,
    onSuccess: (data) => setResult(data),
    onError: () => toast.error('Failed to submit complaint. Please try again.'),
  });

  if (result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900">Complaint Submitted</h2>
        <p className="mt-2 text-gray-600">Your complaint reference number is:</p>
        <p className="mt-2 text-lg font-mono font-bold text-primary-700 bg-primary-50 rounded px-4 py-2 inline-block">
          {result.complaint_reference}
        </p>
        <p className="mt-3 text-sm text-gray-500">Save this reference number to track your complaint status.</p>
        <a href="/complaint/track" className="btn-primary mt-4 inline-flex">Track My Complaint</a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit a Complaint</h1>
      <p className="text-sm text-gray-500 mb-6">
        Describe your complaint. You will receive a reference number to track progress.
      </p>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="card space-y-5">
        <FormField label="Complaint Description" htmlFor="description" error={errors.description?.message} required>
          <TextArea id="description" error={!!errors.description} {...register('description')}
            placeholder="Describe your complaint in detail..." />
        </FormField>

        <FormField label="Priority" htmlFor="priority">
          <SelectField
            id="priority"
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'CRITICAL', label: 'Critical' },
            ]}
            {...register('priority')}
          />
        </FormField>

        <FormField label="Application Reference (if applicable)" htmlFor="application_id">
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
          {mutation.isPending ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}
