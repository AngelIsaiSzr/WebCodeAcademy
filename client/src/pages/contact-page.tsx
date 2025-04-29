import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ContactFormValues = z.infer<typeof insertContactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Mensaje enviado",
        description: "Hemos recibido tu mensaje. Te responderemos a la brevedad.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error al enviar el mensaje",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    contactMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Web Code Academy</title>
        <meta 
          name="description" 
          content="Contáctanos para obtener más información sobre nuestros cursos gratuitos de programación o para cualquier consulta que tengas."
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          {/* Header */}
          <section className="bg-secondary-900 py-20 pb-10 md:pb-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mt-6 mb-4">
                  Contacto
                </h1>
                <p className="text-muted text-lg">
                  ¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte.
                </p>
              </div>
            </div>
          </section>
          
          {/* Contact Section */}
          <section className="bg-primary-800 py-16">
            <div className="container mx-auto px-10">
              <div className="flex flex-col md:flex-row items-start">
                <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-10">
                  <h2 className="text-3xl font-heading font-bold mb-6">
                    Envíanos un mensaje
                  </h2>
                  <p className="text-muted mb-6">
                    Si tienes alguna pregunta, sugerencia o simplemente quieres saludarnos, completa el formulario y te responderemos lo antes posible. ¡Estamos ansiosos por escucharte!
                  </p>
                  
                  <div className="space-y-6 mb-10">
                    <div className="flex items-start">
                      <div className="accent-red mr-4 mt-1">
                        <i className="fas fa-map-marker-alt text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Ubicación</h3>
                        <p className="text-muted">Ciudad de México, México</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="accent-blue mr-4 mt-1">
                        <i className="fas fa-envelope text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Email</h3>
                        <p className="text-muted">info@webcodeacademy.com.mx</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="accent-yellow mr-4 mt-1">
                        <i className="fas fa-phone-alt text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Teléfono</h3>
                        <p className="text-muted">+52 55 1234 5678</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Síguenos</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-muted hover:bg-accent-blue hover:text-white transition-colors">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-muted hover:bg-accent-blue hover:text-white transition-colors">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-muted hover:bg-accent-blue hover:text-white transition-colors">
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-muted hover:bg-accent-blue hover:text-white transition-colors">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-muted hover:bg-accent-blue hover:text-white transition-colors">
                        <i className="fab fa-youtube"></i>
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2">
                  <div className="bg-primary-700 rounded-xl p-6 md:p-8">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input placeholder="Tu nombre" className="bg-primary-800" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Correo electrónico</FormLabel>
                              <FormControl>
                                <Input placeholder="tu@email.com" className="bg-primary-800" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mensaje</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="¿En qué podemos ayudarte?" 
                                  className="bg-primary-800" 
                                  rows={5}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-accent-blue hover:bg-accent-blue hover:opacity-90"
                          disabled={contactMutation.isPending}
                        >
                          {contactMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Enviar mensaje
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* FAQ Section */}
          <section className="bg-secondary-900 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-heading font-bold mb-10 text-center">
                  Preguntas Frecuentes
                </h2>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b border-primary-700">
                    <AccordionTrigger className="text-xl font-heading font-semibold px-6 py-4 bg-primary-700 rounded-t-xl hover:no-underline">
                      ¿Los cursos son realmente gratuitos?
                    </AccordionTrigger>
                    <AccordionContent className="bg-primary-700 px-6 pb-6 rounded-b-xl text-muted">
                      Sí, todos nuestros cursos son 100% gratuitos. Nuestro objetivo es combatir el analfabetismo digital y hacer que la educación tecnológica sea accesible para todos, independientemente de su situación económica.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border-b border-primary-700 mt-4">
                    <AccordionTrigger className="text-xl font-heading font-semibold px-6 py-4 bg-primary-700 rounded-t-xl hover:no-underline">
                      ¿Cómo funcionan las clases mixtas?
                    </AccordionTrigger>
                    <AccordionContent className="bg-primary-700 px-6 pb-6 rounded-b-xl text-muted">
                      Ofrecemos clases tanto presenciales como virtuales. Las clases virtuales se transmiten en vivo y también quedan grabadas para que puedas revisarlas en cualquier momento. Las clases presenciales se realizan en nuestra sede en la Ciudad de México.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border-b border-primary-700 mt-4">
                    <AccordionTrigger className="text-xl font-heading font-semibold px-6 py-4 bg-primary-700 rounded-t-xl hover:no-underline">
                      ¿Recibo algún certificado al completar un curso?
                    </AccordionTrigger>
                    <AccordionContent className="bg-primary-700 px-6 pb-6 rounded-b-xl text-muted">
                      Sí, al completar satisfactoriamente un curso, recibirás un certificado digital que acredita tus habilidades y conocimientos adquiridos. Este certificado puede ser añadido a tu currículum y perfil de LinkedIn.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border-b border-primary-700 mt-4">
                    <AccordionTrigger className="text-xl font-heading font-semibold px-6 py-4 bg-primary-700 rounded-t-xl hover:no-underline">
                      ¿Necesito conocimientos previos para tomar los cursos?
                    </AccordionTrigger>
                    <AccordionContent className="bg-primary-700 px-6 pb-6 rounded-b-xl text-muted">
                      No necesariamente. Tenemos cursos diseñados para todos los niveles, desde principiantes absolutos hasta programadores con experiencia. Cada curso indica claramente el nivel de conocimientos previos recomendado.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5" className="border-b border-primary-700 mt-4">
                    <AccordionTrigger className="text-xl font-heading font-semibold px-6 py-4 bg-primary-700 rounded-t-xl hover:no-underline">
                      ¿Cómo puedo apoyar a Web Code Academy?
                    </AccordionTrigger>
                    <AccordionContent className="bg-primary-700 px-6 pb-6 rounded-b-xl text-muted">
                      Puedes apoyarnos compartiendo nuestros cursos con otras personas, participando activamente en nuestra comunidad, o si eres un profesional de la tecnología, considerando unirte como voluntario o mentor. Contáctanos para más información.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
