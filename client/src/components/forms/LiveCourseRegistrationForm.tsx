import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InsertLiveCourseRegistration, Course } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from "@/hooks/use-auth";

// Define the Zod schema for the form
const liveRegistrationFormSchema = z.object({
  fullName: z.string().min(1, { message: 'El nombre completo es requerido.' }),
  email: z.string().email({ message: 'Por favor, ingresa un correo electrónico válido.' }),
  phoneNumber: z.string().min(10, { message: 'El número de teléfono es requerido y debe tener al menos 10 dígitos.' }).max(15, { message: 'El número de teléfono no debe exceder los 15 dígitos.' }),
  age: z.coerce.number()
    .min(1, { message: 'La edad debe ser mayor a 0.' })
    .max(100, { message: 'La edad no puede ser mayor a 100.' }),
  preferredModality: z.enum(['Presencial', 'Virtual'], { message: 'Por favor, selecciona una modalidad.' }),
  hasLaptop: z.boolean({ message: 'Debes indicar si cuentas con una computadora portátil.' }),
  // Conditional fields for minors
  guardianName: z.string().optional(),
  guardianPhoneNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.age < 18) {
    if (!data.guardianName || data.guardianName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El nombre del tutor es requerido para menores de edad.',
        path: ['guardianName'],
      });
    }
    if (!data.guardianPhoneNumber || data.guardianPhoneNumber.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El número de teléfono del tutor es requerido para menores de edad.',
        path: ['guardianPhoneNumber'],
      });
    }
  }
});

type LiveRegistrationFormValues = z.infer<typeof liveRegistrationFormSchema>;

interface LiveCourseRegistrationFormProps {
  course: Course;
  onSuccessRegistration: () => void;
}

export function LiveCourseRegistrationForm({ course, onSuccessRegistration }: LiveCourseRegistrationFormProps) {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<LiveRegistrationFormValues>({
    resolver: zodResolver(liveRegistrationFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      age: undefined,
      preferredModality: 'Virtual',
      hasLaptop: false,
      guardianName: '',
      guardianPhoneNumber: '',
    },
  });

  const { register, handleSubmit, watch, formState: { errors }, reset } = form;
  const age = watch('age');
  const isMinor = age !== undefined && age < 18;

  const registerMutation = useMutation({
    mutationFn: async (data: LiveRegistrationFormValues) => {
      const payload: InsertLiveCourseRegistration = {
        courseId: course.id,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        age: data.age,
        preferredModality: data.preferredModality,
        hasLaptop: data.hasLaptop,
        guardianName: isMinor ? data.guardianName : undefined,
        guardianPhoneNumber: isMinor ? data.guardianPhoneNumber : undefined,
      };

      const response = await fetch('/api/live-course-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrarse en el curso.');
      }
      return response.json();
    },
    onSuccess: () => {
      reset();
      onSuccessRegistration();
      queryClient.invalidateQueries({ queryKey: ['/api/live-course-registrations', user?.id, course.id] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const onSubmit = (data: LiveRegistrationFormValues) => {
    registerMutation.mutate(data);
  };

  // Live course details from the course object
  const liveDetails = course.liveDetails as {
    liveDuration: string;
    schedule: string;
    modality: string;
    address: string;
    contact: string;
  };

  return (
    <Card className="max-w-3xl mx-auto mt-2">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center mb-2">
          Curso: {course.title}
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          {course.shortDescription}
        </CardDescription>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p><strong>Duración:</strong> {liveDetails.liveDuration}</p>
          <p><strong>Horario:</strong> {liveDetails.schedule}</p>
          <p><strong>Modalidad:</strong> {liveDetails.modality}</p>
          <p><strong>Dirección:</strong> {liveDetails.address}</p>
          <p>Para más información, envíanos un mensaje al: <span className="font-semibold">{liveDetails.contact}</span></p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="fullName">Nombre completo (Nombre | Apellidos)</Label>
            <Input id="fullName" {...register('fullName')} className="mt-1" />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" {...register('email')} className="mt-1" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phoneNumber">Número de teléfono</Label>
            <Input id="phoneNumber" type="tel" {...register('phoneNumber')} className="mt-1" />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <Label htmlFor="age">Edad</Label>
            <Input 
              id="age" 
              type="number" 
              min={1}
              max={100}
              {...register('age', { valueAsNumber: true })} 
              className="mt-1" 
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
          </div>

          {isMinor && (
            <>
              <div>
                <Label htmlFor="guardianName">Escribe el nombre de tu Madre, Padre o Tutor (Nombre | Apellidos)</Label>
                <Input id="guardianName" {...register('guardianName')} className="mt-1" />
                {errors.guardianName && <p className="text-red-500 text-sm mt-1">{errors.guardianName.message}</p>}
              </div>

              <div>
                <Label htmlFor="guardianPhoneNumber">Escribe el número de teléfono de tu Madre, Padre o Tutor</Label>
                <Input id="guardianPhoneNumber" type="tel" {...register('guardianPhoneNumber')} className="mt-1" />
                {errors.guardianPhoneNumber && <p className="text-red-500 text-sm mt-1">{errors.guardianPhoneNumber.message}</p>}
              </div>
            </>
          )}

          <div>
            <Label>¿Qué modalidad prefieres?</Label>
            <RadioGroup
              onValueChange={(value: 'Presencial' | 'Virtual') => form.setValue('preferredModality', value)}
              value={watch('preferredModality')}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Presencial" id="modality-presencial" />
                <Label htmlFor="modality-presencial">Presencial</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Virtual" id="modality-virtual" />
                <Label htmlFor="modality-virtual">Virtual</Label>
              </div>
            </RadioGroup>
            {errors.preferredModality && <p className="text-red-500 text-sm mt-1">{errors.preferredModality.message}</p>}
          </div>

          <div>
            <Label>¿Cuentas con una computadora portátil? (Laptop)</Label>
            <RadioGroup
              onValueChange={(value: 'true' | 'false') => form.setValue('hasLaptop', value === 'true')}
              value={watch('hasLaptop') ? 'true' : 'false'}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="laptop-yes" />
                <Label htmlFor="laptop-yes">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="laptop-no" />
                <Label htmlFor="laptop-no">No</Label>
              </div>
            </RadioGroup>
            {errors.hasLaptop && <p className="text-red-500 text-sm mt-1">{errors.hasLaptop.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 