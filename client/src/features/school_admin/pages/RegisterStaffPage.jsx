import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ACTIONS, BASE, STATUS } from '@/lib/icons';
import { copyToClipboard } from '@/lib/utils';
import { batchRegisterStaffSchema } from '@/schemas/staff.schema';

import { useGetDepartmentsQuery } from '../departments.api';
import { useCreateStaffMutation } from '../staff.api';
import { generateSecurePassword } from '../utils/staff.utils';

const RegisterStaffPage = () => {
  // Queries & Mutations
  const { data: deptData, isLoading: deptsLoading } = useGetDepartmentsQuery();
  const departments = useMemo(
    () => deptData?.data?.departments ?? [],
    [deptData]
  );
  const [createStaff, { isLoading: isSubmitting }] = useCreateStaffMutation();

  // Stepper State
  const [activeStep, setActiveStep] = useState(1); // 1 = Details, 2 = Credentials, 3 = Review
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form Setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(batchRegisterStaffSchema),
    mode: 'onChange',
    defaultValues: {
      department_id: '',
      members: [
        {
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          password: '',
          designation: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  // Step Wizard Meta
  const steps = [
    {
      id: 1,
      title: 'Staff Members',
      desc: 'Enter names & contact details',
    },
    {
      id: 2,
      title: 'Credentials',
      desc: 'Set passwords',
    },
    {
      id: 3,
      title: 'Review & Confirm',
      desc: 'Verify details & submit',
    },
  ];

  // Validate step transitions
  const handleNext = async () => {
    if (activeStep === 1) {
      // Validate department_id and member detail fields (excluding password)
      const fieldsToValidate = ['department_id'];
      fields.forEach((_, index) => {
        fieldsToValidate.push(`members.${index}.first_name`);
        fieldsToValidate.push(`members.${index}.last_name`);
        fieldsToValidate.push(`members.${index}.email`);
        fieldsToValidate.push(`members.${index}.phone`);
        fieldsToValidate.push(`members.${index}.designation`);
      });

      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setActiveStep(2);
      } else {
        toast.error('Please resolve errors on this step before moving forward');
      }
    } else if (activeStep === 2) {
      // Validate passwords
      const fieldsToValidate = [];
      fields.forEach((_, index) => {
        fieldsToValidate.push(`members.${index}.password`);
      });

      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setActiveStep(3);
      } else {
        toast.error('Please configure valid passwords for all members');
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = async (stepId) => {
    if (stepId === activeStep) return;
    if (stepId > activeStep) {
      if (activeStep === 1 && stepId >= 2) {
        // Validate Step 1
        const fieldsToValidate = ['department_id'];
        fields.forEach((_, idx) => {
          fieldsToValidate.push(`members.${idx}.first_name`);
          fieldsToValidate.push(`members.${idx}.last_name`);
          fieldsToValidate.push(`members.${idx}.email`);
          fieldsToValidate.push(`members.${idx}.phone`);
          fieldsToValidate.push(`members.${idx}.designation`);
        });
        const isValid = await trigger(fieldsToValidate);
        if (!isValid) {
          return;
        }
        if (stepId === 3) {
          // If trying to skip to Step 3, must also validate Step 2 (passwords)
          const passFields = fields.map((_, idx) => `members.${idx}.password`);
          const isPassValid = await trigger(passFields);
          if (!isPassValid) {
            return;
          }
        }
      } else if (activeStep === 2 && stepId === 3) {
        // Validate Step 2
        const passFields = fields.map((_, idx) => `members.${idx}.password`);
        const isPassValid = await trigger(passFields);
        if (!isPassValid) {
          return;
        }
      }
      setActiveStep(stepId);
    } else {
      setActiveStep(stepId);
    }
  };

  // Bulk password actions
  const handleGeneratePassword = (index) => {
    const pwd = generateSecurePassword();
    setValue(`members.${index}.password`, pwd, { shouldValidate: true });
    toast.success(`Generated password for member #${index + 1}`);
  };

  const handleGenerateAllPasswords = () => {
    fields.forEach((_, index) => {
      const pwd = generateSecurePassword();
      setValue(`members.${index}.password`, pwd, { shouldValidate: true });
    });
    toast.success('Generated secure passwords for all staff members');
  };

  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Submit Handler
  const onSubmit = async (data) => {
    // Strip designation since database schema does not hold it
    const cleanMembers = data.members.map(({ ...m }) => {
      const cleanMember = Object.fromEntries(
        Object.entries(m).filter(([, v]) => v !== '')
      );
      return cleanMember;
    });

    const payload = {
      department_id: Number(data.department_id),
      members: cleanMembers,
    };

    try {
      await createStaff(payload).unwrap();
      toast.success('Batch registration completed successfully');

      const selectedDept = departments.find(
        (d) => Number(d.department_id) === Number(data.department_id)
      );

      const credentialDetails = data.members.map((m) => ({
        name: `${m.first_name} ${m.last_name}`,
        department: selectedDept?.name ?? 'Assigned Department',
        designation: m.designation || 'Staff Member',
        email: m.email,
        password: m.password,
      }));

      setCreatedCredentials(credentialDetails);
    } catch (err) {
      toast.error(err?.message ?? 'Failed to register staff batch');
    }
  };

  // Clipboard Copiers
  const handleCopyAll = async () => {
    if (!createdCredentials) return;
    const text = createdCredentials
      .map(
        (c, idx) =>
          `Staff #${idx + 1}:\nName: ${c.name}\nDepartment: ${c.department}\nEmail: ${c.email}\nPassword: ${c.password}\n`
      )
      .join('\n---\n\n');
    try {
      await copyToClipboard(text);
      setCopied(true);
      toast.success('All credentials copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy — please copy manually');
    }
  };

  const handleCopySingle = async (member, idx) => {
    const text = `Name: ${member.name}\nDepartment: ${member.department}\nEmail: ${member.email}\nPassword: ${member.password}`;
    try {
      await copyToClipboard(text);
      toast.success(`Copied credentials for Member #${idx + 1}`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleRegisterAnotherBatch = () => {
    reset();
    setCreatedCredentials(null);
    setVisiblePasswords({});
    setCopied(false);
    setActiveStep(1);
  };

  if (deptsLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-center justify-center gap-3">
        <BASE.LOADER className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">
          Loading registration data...
        </p>
      </div>
    );
  }

  if (!departments.length) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-center justify-center gap-4 text-center">
        <div className="bg-warning/10 text-warning flex size-12 items-center justify-center rounded-xl">
          <span className="text-xl font-bold">!</span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-foreground font-medium">No Departments Found</p>
          <p className="text-muted-foreground text-sm">
            You must create at least one department before registering staff
            members.
          </p>
        </div>
        <Button asChild className="cursor-pointer">
          <Link to="/school/departments">Go to Departments</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          { label: 'School Admin', to: '/school/dashboard' },
          { label: 'Register Staff' },
        ]}
      />

      {createdCredentials ? (
        /* ── Post-Creation Credential Display ──────────────── */
        <Card className="border-success/30 bg-success/5 mx-auto w-full max-w-2xl shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">
                  Staff Registered Successfully
                </CardTitle>
                <Badge className="bg-success text-success-foreground">
                  Success
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer gap-1.5"
                onClick={handleCopyAll}
              >
                {copied ? (
                  <STATUS.ACTIVE className="text-success size-3.5" />
                ) : (
                  <BASE.COPY className="size-3.5" />
                )}
                {copied ? 'Copied All!' : 'Copy All Credentials'}
              </Button>
            </div>
            <CardDescription>
              Copy these credentials and share them with the newly registered
              staff members.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
              {createdCredentials.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-card border-border relative rounded-xl border p-4 text-sm shadow-xs"
                >
                  <div className="mb-2 flex items-center justify-between border-b pb-2">
                    <span className="text-foreground font-bold">
                      Member #{idx + 1}: {c.name}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 cursor-pointer"
                      title="Copy member details"
                      onClick={() => handleCopySingle(c, idx)}
                    >
                      <BASE.COPY className="size-3.5" />
                    </Button>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <dt className="text-muted-foreground font-semibold uppercase">
                        Department
                      </dt>
                      <dd className="text-foreground mt-0.5">{c.department}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground font-semibold uppercase">
                        Role/Designation
                      </dt>
                      <dd className="text-foreground mt-0.5">
                        {c.designation}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-muted-foreground font-semibold uppercase">
                        Email
                      </dt>
                      <dd className="text-foreground mt-0.5 font-mono break-all">
                        {c.email}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-muted-foreground font-semibold uppercase">
                        Password
                      </dt>
                      <dd className="text-foreground bg-muted/30 mt-0.5 w-fit rounded-md border px-2 py-1 font-mono font-bold">
                        {c.password}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>

            <Separator className="my-2" />

            <div className="mt-2 flex gap-3">
              <Button
                variant="outline"
                asChild
                className="flex-1 cursor-pointer"
              >
                <Link to="/school/staff">Go to Directory</Link>
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/95 flex-1 cursor-pointer"
                onClick={handleRegisterAnotherBatch}
              >
                Register Another Batch
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* ── Stepper/Wizard Form ─────────────────────────────── */
        <div className="flex flex-col gap-6">
          {/* Horizontal Stepper (Desktop & Mobile) */}
          <div className="bg-card border-border rounded-xl border p-4 shadow-sm">
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-6">
              {steps.map((step, idx) => {
                const isActive = step.id === activeStep;
                const isCompleted = step.id < activeStep;

                return (
                  <div
                    key={step.id}
                    className="flex flex-1 items-center justify-center sm:justify-start"
                  >
                    <button
                      type="button"
                      onClick={() => handleStepClick(step.id)}
                      className="group flex cursor-pointer items-center gap-2.5 text-left focus:outline-none"
                    >
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all sm:size-9 sm:text-sm ${
                          isActive
                            ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                            : isCompleted
                              ? 'bg-primary/10 border-primary text-primary font-bold'
                              : 'bg-muted border-border text-muted-foreground group-hover:border-muted-foreground/50'
                        }`}
                      >
                        {isCompleted ? (
                          <STATUS.ACTIVE className="size-4 font-bold" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="hidden flex-col leading-tight sm:flex">
                        <span
                          className={`text-xs font-semibold transition-colors sm:text-sm ${
                            isActive
                              ? 'text-primary font-bold'
                              : 'text-foreground/85 group-hover:text-foreground'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-muted-foreground mt-0.5 hidden text-[11px] md:inline">
                          {step.desc}
                        </span>
                      </div>
                    </button>
                    {/* Horizontal Connector Line */}
                    {idx < steps.length -1 && (
                      <div
                        className={`mx-2 h-0.5 min-w-4 flex-1 sm:mx-3 sm:min-w-5 md:mx-6 ${
                          isCompleted ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {/* Mobile-only Step Title Subtitle */}
            <div className="text-primary border-border/50 mt-3 border-t pt-2.5 text-center text-xs font-semibold sm:hidden">
              Step {activeStep} of {steps.length}: {steps[activeStep - 1].title}
            </div>
          </div>

          {/* Form Content Panel */}
          <div className="flex flex-col gap-4">
            {/* Step 1: Department Selection & Staff Details */}
            <Card
              className={`border-border border shadow-xs transition-all ${activeStep === 1 ? 'block' : 'hidden'}`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="animate-fade-in text-lg font-semibold">
                  Department & Member List
                </CardTitle>
                <CardDescription>
                  Select the department and add list details for all members.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {/* Department Selection (Shared) */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="staff-dept">
                    Registration Department{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="department_id"
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="staff-dept"
                          aria-invalid={!!errors.department_id}
                          className="bg-muted/30 border-border"
                        >
                          <SelectValue placeholder="Select target department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem
                              key={dept.department_id}
                              value={String(dept.department_id)}
                            >
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.department_id && (
                    <p className="text-destructive text-xs">
                      {errors.department_id.message}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Dynamic Member Rows List */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold">
                      Staff Members List ({fields.length})
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer gap-1"
                      onClick={() =>
                        append({
                          first_name: '',
                          last_name: '',
                          email: '',
                          phone: '',
                          password: '',
                          designation: '',
                        })
                      }
                    >
                      <ACTIONS.CREATE className="size-3.5" />
                      Add Member
                    </Button>
                  </div>

                  <div className="max-h-120 space-y-4 overflow-y-auto pr-1">
                    {fields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="bg-muted/10 border-border relative rounded-xl border p-4 shadow-2xs"
                      >
                        <div className="mb-3 flex items-center justify-between border-b pb-2">
                          <span className="text-foreground text-xs font-bold">
                            Member #{idx + 1}
                          </span>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 h-7 cursor-pointer gap-1 px-2 text-xs"
                              onClick={() => remove(idx)}
                            >
                              <ACTIONS.DELETE className="size-3.5" />
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {/* First Name */}
                          <div className="flex flex-col gap-1">
                            <Label
                              htmlFor={`first-name-${idx}`}
                              className="text-xs"
                            >
                              First Name{' '}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`first-name-${idx}`}
                              placeholder="First name"
                              className="bg-background h-8.5 text-xs"
                              aria-invalid={!!errors.members?.[idx]?.first_name}
                              {...register(`members.${idx}.first_name`)}
                            />
                            {errors.members?.[idx]?.first_name && (
                              <p className="text-destructive text-[10px]">
                                {errors.members[idx].first_name.message}
                              </p>
                            )}
                          </div>

                          {/* Last Name */}
                          <div className="flex flex-col gap-1">
                            <Label
                              htmlFor={`last-name-${idx}`}
                              className="text-xs"
                            >
                              Last Name{' '}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`last-name-${idx}`}
                              placeholder="Last name"
                              className="bg-background h-8.5 text-xs"
                              aria-invalid={!!errors.members?.[idx]?.last_name}
                              {...register(`members.${idx}.last_name`)}
                            />
                            {errors.members?.[idx]?.last_name && (
                              <p className="text-destructive text-[10px]">
                                {errors.members[idx].last_name.message}
                              </p>
                            )}
                          </div>

                          {/* Email */}
                          <div className="flex flex-col gap-1">
                            <Label htmlFor={`email-${idx}`} className="text-xs">
                              Email Address{' '}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`email-${idx}`}
                              type="email"
                              placeholder="email@school.com"
                              className="bg-background h-8.5 text-xs"
                              aria-invalid={!!errors.members?.[idx]?.email}
                              {...register(`members.${idx}.email`)}
                            />
                            {errors.members?.[idx]?.email && (
                              <p className="text-destructive text-[10px]">
                                {errors.members[idx].email.message}
                              </p>
                            )}
                          </div>

                          {/* Phone */}
                          <div className="flex flex-col gap-1">
                            <Label htmlFor={`phone-${idx}`} className="text-xs">
                              Phone Number (10 digits)
                            </Label>
                            <Input
                              id={`phone-${idx}`}
                              placeholder="e.g. 9876543210"
                              className="bg-background h-8.5 text-xs"
                              aria-invalid={!!errors.members?.[idx]?.phone}
                              {...register(`members.${idx}.phone`)}
                            />
                            {errors.members?.[idx]?.phone && (
                              <p className="text-destructive text-[10px]">
                                {errors.members[idx].phone.message}
                              </p>
                            )}
                          </div>

                          {/* Designation */}
                          <div className="flex flex-col gap-1 sm:col-span-2">
                            <Label
                              htmlFor={`designation-${idx}`}
                              className="text-xs"
                            >
                              Designation / Role
                            </Label>
                            <Input
                              id={`designation-${idx}`}
                              placeholder="e.g. Science Teacher, Assistant Professor, Registrar"
                              className="bg-background h-8.5 text-xs"
                              {...register(`members.${idx}.designation`)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collapsed Step 1 bar (when step > 1) */}
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => handleStepClick(1)}
                className="border-border bg-card hover:bg-primary/10 flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                    <STATUS.ACTIVE className="size-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-foreground text-sm font-semibold">
                      Staff Members List
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {fields.length} member(s) listed under{' '}
                      {departments.find(
                        (d) =>
                          String(d.department_id) ===
                          String(getValues('department_id'))
                      )?.name ?? 'selected department'}
                    </span>
                  </div>
                </div>
                <BASE.CHEVRON_DOWN className="text-muted-foreground size-4" />
              </button>
            )}

            {/* Step 2: Login Credentials / Passwords */}
            <Card
              className={`border-border border shadow-xs transition-all ${activeStep === 2 ? 'block' : 'hidden'}`}
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Configure Passwords
                    </CardTitle>
                    <CardDescription>
                      Configure credentials or generate random passwords for
                      all.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="cursor-pointer gap-1.5 self-start sm:self-auto"
                    onClick={handleGenerateAllPasswords}
                  >
                    <BASE.LOCK className="size-3.5" />
                    Generate for All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="max-h-120 space-y-4 overflow-y-auto pr-1">
                  {fields.map((field, idx) => {
                    const firstName =
                      getValues(`members.${idx}.first_name`) || '';
                    const lastName =
                      getValues(`members.${idx}.last_name`) || '';
                    const email = getValues(`members.${idx}.email`) || '';

                    return (
                      <div
                        key={field.id}
                        className="bg-card border-border relative rounded-xl border p-4 text-sm shadow-xs"
                      >
                        <div className="text-foreground mb-2 font-semibold">
                          Member #{idx + 1}: {firstName} {lastName}
                          <span className="text-muted-foreground ml-2 font-mono text-xs font-normal">
                            ({email})
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor={`password-${idx}`}
                              className="text-xs"
                            >
                              Password{' '}
                              <span className="text-destructive">*</span>
                            </Label>
                            <button
                              type="button"
                              className="text-primary cursor-pointer text-xs font-semibold hover:underline"
                              onClick={() => handleGeneratePassword(idx)}
                            >
                              Generate Password
                            </button>
                          </div>
                          <div className="relative">
                            <BASE.LOCK className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                              id={`password-${idx}`}
                              type={visiblePasswords[idx] ? 'text' : 'password'}
                              placeholder="Enter or generate secure password (min. 8 chars)"
                              className="bg-background h-9 pr-10 pl-9 text-xs"
                              aria-invalid={!!errors.members?.[idx]?.password}
                              {...register(`members.${idx}.password`)}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0 size-9 cursor-pointer"
                              onClick={() => togglePasswordVisibility(idx)}
                              aria-label="Toggle password visibility"
                            >
                              {visiblePasswords[idx] ? (
                                <BASE.EYE_OFF className="size-4" />
                              ) : (
                                <BASE.EYE className="size-4" />
                              )}
                            </Button>
                          </div>
                          {errors.members?.[idx]?.password && (
                            <p className="text-destructive text-[10px]">
                              {errors.members[idx].password.message}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Collapsed Step 2 bar (when step !== 2) */}
            {activeStep !== 2 && (
              <button
                type="button"
                disabled={activeStep < 2}
                onClick={() => handleStepClick(2)}
                className="border-border bg-card hover:bg-primary/10 flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 items-center justify-center rounded-full ${activeStep > 2 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                  >
                    {activeStep > 2 ? (
                      <STATUS.ACTIVE className="size-4" />
                    ) : (
                      <BASE.LOCK className="size-4" />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-foreground text-sm font-semibold">
                      Login Credentials
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Configure passwords for the staff list
                    </span>
                  </div>
                </div>
                <BASE.CHEVRON_DOWN className="text-muted-foreground size-4" />
              </button>
            )}

            {/* Step 3: Review & Confirm */}
            <Card
              className={`border-border border shadow-xs transition-all ${activeStep === 3 ? 'block' : 'hidden'}`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="animate-fade-in text-lg font-semibold">
                  Review Batch Registration
                </CardTitle>
                <CardDescription>
                  Verify all batch entries before creating accounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {activeStep === 3 && (
                  <div className="flex flex-col gap-3">
                    <div className="bg-muted/30 rounded-xl border p-4 text-sm">
                      <span className="text-muted-foreground font-semibold">
                        Target Department:
                      </span>
                      <span className="text-foreground ml-2 font-bold">
                        {departments.find(
                          (d) =>
                            String(d.department_id) ===
                            String(getValues('department_id'))
                        )?.name ?? '—'}
                      </span>
                    </div>

                    <div className="border-border overflow-hidden rounded-xl border shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-muted/40 border-border text-muted-foreground border-b font-bold tracking-wider uppercase">
                              <th className="p-3">#</th>
                              <th className="p-3">Name</th>
                              <th className="p-3">Email</th>
                              <th className="p-3">Phone</th>
                              <th className="p-3">Designation</th>
                              <th className="p-3">Password</th>
                            </tr>
                          </thead>
                          <tbody className="divide-border divide-y">
                            {getValues('members').map((m, idx) => (
                              <tr
                                key={idx}
                                className="hover:bg-muted/10 text-foreground font-medium"
                              >
                                <td className="text-muted-foreground p-3 font-semibold">
                                  {idx + 1}
                                </td>
                                <td className="p-3 font-semibold">
                                  {m.first_name} {m.last_name}
                                </td>
                                <td className="p-3 font-mono">{m.email}</td>
                                <td className="p-3 font-mono">
                                  {m.phone || '—'}
                                </td>
                                <td className="p-3">
                                  {m.designation || 'Staff Member'}
                                </td>
                                <td className="bg-muted/20 p-3 font-mono font-bold">
                                  {m.password}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Collapsed Step 3 bar (when step !== 3) */}
            {activeStep !== 3 && (
              <button
                type="button"
                disabled={activeStep < 3}
                onClick={() => handleStepClick(3)}
                className="border-border bg-card hover:bg-primary/10 flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
                    <STATUS.ACTIVE className="size-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-foreground text-sm font-semibold">
                      Review & Submit
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Review batch of {fields.length} member(s) before
                      submitting
                    </span>
                  </div>
                </div>
                <BASE.CHEVRON_DOWN className="text-muted-foreground size-4" />
              </button>
            )}

            {/* Action Buttons Row */}
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <Button
                variant="outline"
                className="border-border cursor-pointer gap-2"
                onClick={handleRegisterAnotherBatch}
                disabled={isSubmitting}
              >
                <BASE.ROTATE_CCW className="size-4" />
                Reset
              </Button>

              <div className="flex gap-2">
                {activeStep > 1 && (
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                )}
                {activeStep < 3 ? (
                  <Button
                    type="button"
                    className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer gap-2"
                    onClick={handleNext}
                  >
                    Next
                    <BASE.ARROW_RIGHT className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer gap-2"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <BASE.LOADER className="animate-spin" />}
                    {isSubmitting ? 'Registering Batch…' : 'Register Batch'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterStaffPage;
