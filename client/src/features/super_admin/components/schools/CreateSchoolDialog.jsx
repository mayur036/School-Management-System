import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BASE } from '@/lib/icons';
import { createSchoolSchema } from '@/schemas/school.schema';

import { useCreateSchoolMutation } from '../../schools.api';

const CreateSchoolDialog = ({ externalOpen = false, onExternalOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen || internalOpen;
  const [createSchool, { isLoading }] = useCreateSchoolMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSchoolSchema),
    defaultValues: {
      name: '',
      code: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = async (data) => {
    // Strip empty optional strings so the API receives undefined / null
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '')
    );

    try {
      await createSchool(payload).unwrap();
      toast.success('School created successfully');
      reset();
      handleOpenChange(false);
    } catch (err) {
      toast.error(err?.message ?? 'Failed to create school');
    }
  };

  const handleOpenChange = (nextOpen) => {
    setInternalOpen(nextOpen);
    onExternalOpenChange?.(nextOpen);
    if (!nextOpen) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New School</DialogTitle>
          <DialogDescription>
            Register a new school on the platform. You can assign an admin
            afterwards.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-school-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Name — required */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="school-name">
              School Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="school-name"
              placeholder="e.g. Springfield Academy"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* Code + Email — side by side on desktop */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="school-code">School Code</Label>
              <Input
                id="school-code"
                placeholder="e.g. SPR-001"
                aria-invalid={!!errors.code}
                {...register('code')}
              />
              {errors.code && (
                <p className="text-destructive text-xs">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="school-email">Email</Label>
              <Input
                id="school-email"
                type="email"
                placeholder="info@school.edu"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="school-phone">Phone</Label>
            <Input
              id="school-phone"
              placeholder="+91 98765 43210"
              aria-invalid={!!errors.phone}
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-destructive text-xs">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="school-address">Address</Label>
            <Textarea
              id="school-address"
              rows={2}
              placeholder="Full address"
              aria-invalid={!!errors.address}
              {...register('address')}
            />
            {errors.address && (
              <p className="text-destructive text-xs">
                {errors.address.message}
              </p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-school-form"
            className="cursor-pointer gap-2"
            disabled={isLoading}
          >
            {isLoading && <BASE.LOADER className="animate-spin" />}
            {isLoading ? 'Creating…' : 'Create School'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSchoolDialog;
