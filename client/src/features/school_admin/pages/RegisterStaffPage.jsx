import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
import { COMMON, SCHOOL_ADMIN } from '@/lib/icons';
import { createStaffSchema } from '@/schemas/staff.schema';

import { useGetDepartmentsQuery } from '../departments.api';
import { useCreateStaffMutation } from '../staff.api';

// Helper to generate a secure random password
const generateSecurePassword = () => {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+~';
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = '';
  // Ensure at least one of each required type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};

const RegisterStaffPage = () => {
  const navigate = useNavigate();

  // Queries & Mutations
  const { data: deptData, isLoading: deptsLoading } = useGetDepartmentsQuery();
  const departments = deptData?.data?.departments ?? [];
  const [createStaff, { isLoading: isSubmitting }] = useCreateStaffMutation();

  // Multi-step State
  const [activeStep, setActiveStep] = useState(1); // 1 = Personal, 2 = Contact, 3 = Account, 4 = Review
  const [showPassword, setShowPassword] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form setup
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
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      department_id: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      designation: '', // Visual mock field (ignored by server schema)
    },
  });

  // Step names & descriptors
  const steps = [
    {
      id: 1,
      title: 'Personal',
      desc: 'Basic information',
      fields: ['department_id', 'first_name', 'last_name'],
    },
    {
      id: 2,
      title: 'Contact',
      desc: 'Contact details',
      fields: ['email', 'phone'],
    },
    {
      id: 3,
      title: 'Account',
      desc: 'Login credentials',
      fields: ['password'],
    },
    { id: 4, title: 'Review', desc: 'Verify & submit', fields: [] },
  ];

  // Navigation handlers within wizard
  const handleNext = async () => {
    const currentStepFields = steps[activeStep - 1].fields;
    const isValid = await trigger(currentStepFields);
    if (isValid) {
      setActiveStep((prev) => Math.min(prev + 1, 4));
    } else {
      toast.error(
        'Please resolve the errors on this step before moving forward'
      );
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = async (stepId) => {
    // Prevent jumping ahead of completed steps
    if (stepId > activeStep) {
      // Validate all previous steps
      let allValid = true;
      for (let i = 1; i < stepId; i++) {
        const isValid = await trigger(steps[i - 1].fields);
        if (!isValid) {
          allValid = false;
          break;
        }
      }
      if (allValid) setActiveStep(stepId);
    } else {
      setActiveStep(stepId);
    }
  };

  const onSubmit = async (data) => {
    // Strip designation since DB schema/stored procedure doesn't hold it
    const { designation, ...cleanData } = data;
    const payload = Object.fromEntries(
      Object.entries(cleanData).filter(([, v]) => v !== '')
    );

    try {
      await createStaff(payload).unwrap();
      toast.success('Staff member registered successfully');

      const selectedDept = departments.find(
        (d) => Number(d.department_id) === Number(data.department_id)
      );

      setCreatedCredentials({
        name: `${data.first_name} ${data.last_name}`,
        department: selectedDept?.name ?? 'Assigned Department',
        designation: designation || 'Staff Member',
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      toast.error(err?.message ?? 'Failed to register staff');
    }
  };

  const handleGeneratePassword = () => {
    const pwd = generateSecurePassword();
    setValue('password', pwd, { shouldValidate: true });
    toast.success('Generated a secure password');
  };

  const handleCopy = async () => {
    if (!createdCredentials) return;
    const text = `Name: ${createdCredentials.name}\nDepartment: ${createdCredentials.department}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Credentials copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy — please copy manually');
    }
  };

  const handleRegisterAnother = () => {
    reset();
    setCreatedCredentials(null);
    setShowPassword(false);
    setCopied(false);
    setActiveStep(1);
  };

  if (deptsLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-center justify-center gap-3">
        <COMMON.LOADER className="text-primary size-8 animate-spin" />
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
          { label: 'Staff Directory', to: '/school/staff' },
          { label: 'Register Staff' },
        ]}
      />

      {/* Page Title Header */}
      <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Register Staff
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add a new department staff member and set their login credentials.
          </p>
        </div>

        {/* Security Info Badge */}
        <Card className="max-w-xs border-blue-500/20 bg-blue-500/5 py-0 shadow-xs">
          <CardContent className="flex items-center gap-3 p-3 text-xs">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <COMMON.SHIELD className="size-4" />
            </div>
            <div>
              <p className="text-foreground font-semibold">Secure & Private</p>
              <p className="text-muted-foreground mt-0.5">
                Staff credentials are encrypted and stored securely.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {createdCredentials ? (
        /* ── Post-Creation Credential Display ──────────────── */
        <Card className="border-success/30 bg-success/5 mx-auto w-full max-w-xl shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">
                Staff Registered Successfully
              </CardTitle>
              <Badge className="bg-success text-success-foreground">
                Success
              </Badge>
            </div>
            <CardDescription>
              Copy these details securely and share them with the new staff
              member.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Name
                </dt>
                <dd className="text-foreground mt-0.5 font-medium">
                  {createdCredentials.name}
                </dd>
              </div>
              <Separator />
              <div>
                <dt className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Department
                </dt>
                <dd className="text-foreground mt-0.5 font-medium">
                  {createdCredentials.department}
                </dd>
              </div>
              <Separator />
              <div>
                <dt className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Designation
                </dt>
                <dd className="text-foreground mt-0.5 font-medium">
                  {createdCredentials.designation}
                </dd>
              </div>
              <Separator />
              <div>
                <dt className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Email
                </dt>
                <dd className="text-foreground mt-0.5 font-mono font-medium break-all">
                  {createdCredentials.email}
                </dd>
              </div>
              <Separator />
              <div>
                <dt className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Password
                </dt>
                <dd className="text-foreground mt-0.5 font-mono font-medium">
                  {createdCredentials.password}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer gap-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <COMMON.CHECK data-icon="inline-start" />
                ) : (
                  <COMMON.COPY data-icon="inline-start" />
                )}
                {copied ? 'Copied!' : 'Copy Credentials'}
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/95 flex-1 cursor-pointer"
                onClick={handleRegisterAnother}
              >
                Register Another
              </Button>
            </div>
            <Button
              variant="ghost"
              asChild
              className="mt-1 w-full cursor-pointer"
            >
              <Link to="/school/staff">Go to Directory</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* ── Stepper/Wizard Form ─────────────────────────────── */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Left Panel: Vertical Stepper (Desktop) */}
          <div className="col-span-1 hidden flex-col gap-6 border-r pr-6 lg:flex">
            <div className="relative flex flex-col gap-8">
              {/* Vertical Connector Line */}
              <div className="bg-border absolute top-2 bottom-2 left-4 -z-10 w-0.5" />

              {steps.map((step) => {
                const isActive = step.id === activeStep;
                const isCompleted = step.id < activeStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepClick(step.id)}
                    className="group flex cursor-pointer items-center gap-4 text-left focus:outline-none"
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                          : isCompleted
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-muted border-border text-muted-foreground group-hover:border-muted-foreground/50'
                      }`}
                    >
                      {isCompleted ? (
                        <COMMON.CHECK className="size-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          isActive
                            ? 'text-primary'
                            : 'text-foreground/80 group-hover:text-foreground'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {step.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Horizontal Stepper Header */}
          <div className="bg-card border-border flex items-center justify-between rounded-xl border p-4 shadow-xs lg:hidden">
            {steps.map((step, idx) => {
              const isActive = step.id === activeStep;
              const isCompleted = step.id < activeStep;

              return (
                <div
                  key={step.id}
                  className="relative flex flex-1 flex-col items-center gap-1.5"
                >
                  {/* Step Connector Line */}
                  {idx > 0 && (
                    <div
                      className={`absolute top-4 right-1/2 -z-10 h-0.5 w-full -translate-y-1/2 ${
                        isCompleted || isActive ? 'bg-primary/45' : 'bg-border'
                      }`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleStepClick(step.id)}
                    className={`flex size-8 items-center justify-center rounded-full border text-xs font-semibold ${
                      isActive
                        ? 'bg-primary border-primary text-primary-foreground'
                        : isCompleted
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <COMMON.CHECK className="size-3.5" />
                    ) : (
                      step.id
                    )}
                  </button>
                  <span
                    className={`text-[10px] font-medium ${
                      isActive
                        ? 'text-primary font-bold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Panel: Stepper-Accordion Container */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            {/* Step 1: Personal Details */}
            <Card
              className={`border-border border shadow-xs transition-all ${activeStep === 1 ? 'block' : 'hidden'}`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Personal & Account Details
                </CardTitle>
                <CardDescription>
                  Provide accurate information to create staff account.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Department */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="staff-dept">
                    Department <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
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
                            <SelectValue placeholder="Select department" />
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
                  </div>
                  {errors.department_id && (
                    <p className="text-destructive text-xs">
                      {errors.department_id.message}
                    </p>
                  )}
                </div>

                {/* First + Last Name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="staff-first-name">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <SCHOOL_ADMIN.PROFILE className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="staff-first-name"
                        placeholder="Enter first name"
                        className="bg-muted/30 border-border pl-9"
                        aria-invalid={!!errors.first_name}
                        {...register('first_name')}
                      />
                    </div>
                    {errors.first_name && (
                      <p className="text-destructive text-xs">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="staff-last-name">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <SCHOOL_ADMIN.PROFILE className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="staff-last-name"
                        placeholder="Enter last name"
                        className="bg-muted/30 border-border pl-9"
                        aria-invalid={!!errors.last_name}
                        {...register('last_name')}
                      />
                    </div>
                    {errors.last_name && (
                      <p className="text-destructive text-xs">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Designation / Role */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="staff-designation">Role / Designation</Label>
                  <div className="relative">
                    <SCHOOL_ADMIN.DEPARTMENT_LIST className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="staff-designation"
                      placeholder="e.g. Teacher, Librarian, Lab Assistant"
                      className="bg-muted/30 border-border pl-9"
                      {...register('designation')}
                    />
                  </div>
                  <p className="text-muted-foreground text-[10px]">
                    Optional: Add specific role or designation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Collapsed Step 1 bar (when step > 1) */}
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => handleStepClick(1)}
                className="border-border bg-card hover:bg-muted/30 flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                    <COMMON.CHECK className="size-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-foreground text-sm font-semibold">
                      Personal Details
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Basic information
                    </span>
                  </div>
                </div>
                <COMMON.CHEVRON_DOWN className="text-muted-foreground size-4" />
              </button>
            )}

            {/* Step 2: Contact Information */}
            <Card
              className={`border-border border shadow-xs transition-all ${activeStep === 2 ? 'block' : 'hidden'}`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Provide communication details for the staff member.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="staff-email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <COMMON.MAIL className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="staff-email"
                      type="email"
                      placeholder="name@example.com"
                      className="bg-muted/30 border-border pl-9"
                      aria-invalid={!!errors.email}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-xs">
                      {errors.email.message}
                    </p>
                  )}
                  <p className="text-muted-foreground text-[10px]">
                    This email will be used for login and notifications.
                  </p>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="staff-phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="+91">
                      <SelectTrigger className="bg-muted/30 border-border w-24">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">+91 (IN)</SelectItem>
                        <SelectItem value="+1">+1 (US)</SelectItem>
                        <SelectItem value="+44">+44 (UK)</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <COMMON.PHONE className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="staff-phone"
                        placeholder="98765 43210"
                        className="bg-muted/30 border-border pl-9"
                        aria-invalid={!!errors.phone}
                        {...register('phone')}
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="text-destructive text-xs">
                      {errors.phone.message}
                    </p>
                  )}
                  <p className="text-muted-foreground text-[10px]">
                    Include country code.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Collapsed Step 2 bar (when step !== 2) */}
            {activeStep !== 2 && (
              <button
                type="button"
                disabled={activeStep < 2}
                onClick={() => handleStepClick(2)}
                className="border-border bg-card hover:bg-muted/30 flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 items-center justify-center rounded-full ${activeStep > 2 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                  >
                    {activeStep > 2 ? (
                      <COMMON.CHECK className="size-4" />
                    ) : (
                      <COMMON.MAIL className="size-4" />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-foreground text-sm font-semibold">
                      Contact Information
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Additional contact details (optional)
                    </span>
                  </div>
                </div>
                <COMMON.CHEVRON_DOWN className="text-muted-foreground size-4" />
              </button>
            )}

            {/* Step 3: Login Credentials */}
            <Card
              className={`border-border border shadow-xs transition-all ${activeStep === 3 ? 'block' : 'hidden'}`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Login Credentials
                </CardTitle>
                <CardDescription>
                  Set secure password for the staff account.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Password Input with Generate option */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="staff-password">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-primary cursor-pointer text-xs font-semibold hover:underline"
                    >
                      Generate Password
                    </button>
                  </div>
                  <div className="relative">
                    <COMMON.LOCK className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="staff-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      className="bg-muted/30 border-border pr-10 pl-9"
                      aria-invalid={!!errors.password}
                      {...register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 size-9 cursor-pointer"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? <COMMON.EYE_OFF /> : <COMMON.EYE />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Collapsed Step 3 bar (when step !== 3) */}
            {activeStep !== 3 && (
              <button
                type="button"
                disabled={activeStep < 3}
                onClick={() => handleStepClick(3)}
                className="border-border bg-card hover:bg-muted/30 flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 items-center justify-center rounded-full ${activeStep > 3 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                  >
                    {activeStep > 3 ? (
                      <COMMON.CHECK className="size-4" />
                    ) : (
                      <COMMON.LOCK className="size-4" />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-foreground text-sm font-semibold">
                      Login Credentials
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Set password for the staff account
                    </span>
                  </div>
                </div>
                <COMMON.CHEVRON_DOWN className="text-muted-foreground size-4" />
              </button>
            )}

            {/* Step 4: Review & Confirm */}
            <Card
              className={`border-border border shadow-xs transition-all ${activeStep === 4 ? 'block' : 'hidden'}`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Review & Confirm
                </CardTitle>
                <CardDescription>
                  Verify all details before registering the staff account.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {activeStep === 4 && (
                  <dl className="bg-muted/30 grid gap-4 rounded-xl border p-4 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-muted-foreground">Full Name</dt>
                      <dd className="text-foreground col-span-2 font-semibold">
                        {getValues('first_name')} {getValues('last_name')}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-muted-foreground">Department</dt>
                      <dd className="text-foreground col-span-2 font-semibold">
                        {departments.find(
                          (d) =>
                            String(d.department_id) ===
                            String(getValues('department_id'))
                        )?.name ?? '—'}
                      </dd>
                    </div>
                    {getValues('designation') && (
                      <div className="grid grid-cols-3 gap-2">
                        <dt className="text-muted-foreground">
                          Role/Designation
                        </dt>
                        <dd className="text-foreground col-span-2 font-semibold">
                          {getValues('designation')}
                        </dd>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-muted-foreground">Email Address</dt>
                      <dd className="text-foreground col-span-2 font-semibold break-all">
                        {getValues('email')}
                      </dd>
                    </div>
                    {getValues('phone') && (
                      <div className="grid grid-cols-3 gap-2">
                        <dt className="text-muted-foreground">Phone Number</dt>
                        <dd className="text-foreground col-span-2 font-semibold">
                          +91 {getValues('phone')}
                        </dd>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-muted-foreground">Password</dt>
                      <dd className="text-foreground col-span-2 font-mono font-semibold">
                        {getValues('password')}
                      </dd>
                    </div>
                  </dl>
                )}
              </CardContent>
            </Card>

            {/* Collapsed Step 4 bar (when step !== 4) */}
            {activeStep !== 4 && (
              <button
                type="button"
                disabled={activeStep < 4}
                onClick={() => handleStepClick(4)}
                className="border-border bg-card hover:bg-muted/30 flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
                    <COMMON.CHECK className="size-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-foreground text-sm font-semibold">
                      Review & Confirm
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Review all details before registration
                    </span>
                  </div>
                </div>
                <COMMON.CHEVRON_DOWN className="text-muted-foreground size-4" />
              </button>
            )}

            {/* Action Buttons Row */}
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <Button
                variant="outline"
                className="border-border cursor-pointer gap-2"
                onClick={() => navigate('/school/staff')}
                disabled={isSubmitting}
              >
                <COMMON.X className="animate-in size-4" />
                Cancel
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
                {activeStep < 4 ? (
                  <Button
                    type="button"
                    className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer gap-2"
                    onClick={handleNext}
                  >
                    Next
                    <COMMON.ARROW_RIGHT className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer gap-2"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <COMMON.LOADER className="animate-spin" />}
                    {isSubmitting ? 'Registering…' : 'Review & Register'}
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
