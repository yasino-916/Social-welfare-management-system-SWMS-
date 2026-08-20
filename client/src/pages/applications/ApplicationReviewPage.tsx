import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApplication, useKebeleDecision } from '@/hooks/useApplications';
import PageHeader from '@/components/common/PageHeader';
import FormField from '@/components/forms/FormField';
import TextArea from '@/components/forms/TextArea';
import SelectField from '@/components/forms/SelectField';
import { PageLoader } from '@/components/common/LoadingSpinner';

const schema = z.object({
  decision_type: z.enum(['ACCEPT', 'REJECT', 'RETURN', 'MORE_INFO']),
  reason: z.string().optional(),
}).refine(
  (d) => ['REJECT', 'RETURN', 'MORE_INFO'].includes(d.decision_type) ? !!d.reason?.trim() : true,
  { message: 'Reason is required for this decision', path: ['reason'] }
);

type FormData = z.infer<typeof schema>;

export default function ApplicationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: app, isLoading } = useApplication(id!);
  const decision = useKebeleDecision();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const decisionType = watch('decision_type');
  const needsReason = ['REJECT', 'RETURN', 'MORE_INFO'].includes(decisionType);

  const onSubmit = (data: FormData) => {
    decision.mutate({ id: id!, payload: data }, {
      onSuccess: () => navigate(`/applications/${id}`),
    });
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-xl">
      <PageHeader title="Review Application" subtitle={`Reference: ${app?.reference_number}`} />

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
        <FormField label="Decision" htmlFor="decision_type" required>
          <SelectField
            id="decision_type"
            placeholder="Select a decision..."
            options={[
              { value: 'ACCEPT', label: 'Accept' },
              { value: 'REJECT', label: 'Reject' },
              { value: 'RETURN', label: 'Return for Correction' },
              { value: 'MORE_INFO', label: 'Request More Information' },
            ]}
            {...register('decision_type')}
          />
        </FormField>

        {needsReason && (
          <FormField label="Reason" htmlFor="reason" error={errors.reason?.message} required>
            <TextArea id="reason" error={!!errors.reason} {...register('reason')}
              placeholder="Provide a clear reason for this decision..." />
          </FormField>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={decision.isPending}>
            {decision.isPending ? 'Saving...' : 'Record Decision'}
          </button>
        </div>
      </form>
    </div>
  );
}
