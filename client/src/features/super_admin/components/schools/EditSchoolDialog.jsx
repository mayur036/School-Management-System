import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BASE } from '@/lib/icons';
import { updateSchoolBySuperSchema } from '@/schemas/school.schema';

import { useUpdateSchoolMutation } from '../../schools.api';

const EditSchoolDialog = ({ school, onClose }) => {
  const [updateSchool, { isLoading }] = useUpdateSchoolMutation();
  const open = !!school;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateSchoolBySuperSchema),
    defaultValues: {
      name: '',
      code: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
    },
  });

  // Sync form with selected school
  useEffect(() => {
    if (school) {
      reset({
        name: school.name || '',
        code: school.code || '',
        email: school.email || '',
        phone: school.phone || '',
        address: school.address || '',
        status: school.status || 'active',
      });
    }
  }, [school, reset]);

  const onSubmit = async (data) => {
    if (!school) return;

    // Convert empty fields to null for backend updates
    const payload = {
      id: school.school_id,
      name: data.name.trim(),
      code: data.code.trim(),
      email: data.email.trim(),
      phone: data.phone.trim() || null,
      address: data.address.trim() || null,
      status: data.status,
    };

    try {
      await updateSchool(payload).unwrap();
      toast.success('School updated successfully');
      handleClose();
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || 'Failed to update school'
      );
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit School Details</DialogTitle>
          <DialogDescription>
            Update the core configuration, identity, and operational status of
            the school.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-school-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Name — required */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-school-name">
              School Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-school-name"
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
              <Label htmlFor="edit-school-code">
                School Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-school-code"
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
              <Label htmlFor="edit-school-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-school-email"
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

          {/* Phone + Status — side by side on desktop */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-school-phone">Phone</Label>
              <Input
                id="edit-school-phone"
                placeholder="10 digit phone number"
                aria-invalid={!!errors.phone}
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-destructive text-xs">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-school-status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="edit-school-status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-destructive text-xs">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-school-address">Address</Label>
            <Textarea
              id="edit-school-address"
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
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-school-form"
            className="cursor-pointer gap-2"
            disabled={isLoading}
          >
            {isLoading && <BASE.LOADER className="animate-spin" />}
            {isLoading ? 'Saving…' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSchoolDialog;
