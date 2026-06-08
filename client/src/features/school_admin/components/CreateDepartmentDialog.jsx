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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { COMMON } from '@/lib/icons';
import { createDepartmentSchema } from '@/schemas/department.schema';

import { useCreateDepartmentMutation } from '../departments.api';

const CreateDepartmentDialog = ({
  externalOpen = false,
  onExternalOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen || internalOpen;
  const [createDepartment, { isLoading }] = useCreateDepartmentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await createDepartment(data).unwrap();
      toast.success('Department created successfully');
      reset();
      handleOpenChange(false);
    } catch (err) {
      toast.error(err?.message ?? 'Failed to create department');
    }
  };

  const handleOpenChange = (nextOpen) => {
    setInternalOpen(nextOpen);
    onExternalOpenChange?.(nextOpen);
    if (!nextOpen) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer gap-2">
          <COMMON.PLUS data-icon="inline-start" />
          Add Department
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>
            Create a department to organize your school's staff members.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-department-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Name — required */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dept-name">
              Department Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dept-name"
              placeholder="e.g. Mathematics"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
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
            form="create-department-form"
            className="cursor-pointer gap-2"
            disabled={isLoading}
          >
            {isLoading && <COMMON.LOADER className="animate-spin" />}
            {isLoading ? 'Creating…' : 'Create Department'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartmentDialog;
