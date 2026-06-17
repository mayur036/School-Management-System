import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GUEST } from '@/lib/icons';
import { contactSchema } from '@/schemas/contact.schema';

import { Eyebrow } from '../components/marketing';

const CONTACT_DETAILS = [
  {
    icon: GUEST.MAIL,
    label: 'Email',
    value: 'hello@campuscore.com',
    href: 'mailto:hello@campuscore.com',
  },
  {
    icon: GUEST.PHONE,
    label: 'Phone',
    value: '+1 (555) 010-2025',
    href: 'tel:+15550102025',
  },
  {
    icon: GUEST.MAP_PIN,
    label: 'Office',
    value: '120 Campus Drive, Suite 400',
    href: null,
  },
];

export const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit = async () => {
    // No public contact endpoint yet — simulate the request so the flow is
    // exercised end-to-end. Wire to a real API/mailer when one is available.
    await new Promise((resolve) => setTimeout(resolve, 700));
    toast.success("Thanks for reaching out! We'll get back to you shortly.");
    reset();
  };

  return (
    <>
      {/* Intro */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="text-foreground mt-5 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Let's talk about your school
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
          Have a question about CampusCore or want help getting set up? Send us a
          message and our team will get back to you.
        </p>
      </section>

      {/* Contact body */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Details */}
          <div className="lg:col-span-2">
            <h2 className="text-foreground text-xl font-bold tracking-tight">
              Get in touch
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Reach us through any of the channels below — we typically respond
              within one business day.
            </p>

            <ul className="mt-8 space-y-4">
              {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
                <li
                  key={label}
                  className="bg-card border-border/60 flex items-center gap-4 rounded-xl border p-4"
                >
                  <span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="text-foreground hover:text-primary text-sm font-semibold transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-foreground text-sm font-semibold">
                        {value}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="bg-card border-border/60 rounded-2xl border p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  aria-invalid={!!errors.subject}
                  {...register('subject')}
                />
                {errors.subject && (
                  <p className="text-destructive text-xs font-medium">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="mt-5 space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us a little about your school and what you need…"
                  aria-invalid={!!errors.message}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="text-destructive text-xs font-medium">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-6 w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <GUEST.LOADER className="size-4 animate-spin" />
                ) : (
                  <GUEST.SEND className="size-4" />
                )}
                {isSubmitting ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
