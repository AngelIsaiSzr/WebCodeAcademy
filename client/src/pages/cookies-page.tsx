import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function CookiesPage() {
  return (
    <>
      <Helmet>
        <title>Política de Cookies - Web Code Academy</title>
        <meta
          name="description"
          content="Política de cookies de Web Code Academy. Conoce cómo utilizamos las cookies para mejorar tu experiencia."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow py-20 bg-primary-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-heading font-bold mb-8 text-center">
                Política de Cookies
              </h1>
              
              <div className="bg-secondary-900 rounded-lg p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-accent-blue">
                    ¿Qué son las Cookies?
                  </h2>
                  <p className="text-muted leading-relaxed">
                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
                    cuando visitas un sitio web. Estas cookies nos ayudan a recordar tus preferencias, 
                    analizar el tráfico del sitio y mejorar tu experiencia de usuario.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-accent-blue">
                    Tipos de Cookies que Utilizamos
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-accent-yellow">
                        🍪 Cookies Esenciales
                      </h3>
                      <p className="text-muted leading-relaxed mb-2">
                        Estas cookies son necesarias para el funcionamiento básico del sitio web:
                      </p>
                      <ul className="text-muted leading-relaxed space-y-1 ml-6">
                        <li>• Mantener tu sesión activa</li>
                        <li>• Recordar tus preferencias de idioma</li>
                        <li>• Gestionar el carrito de cursos</li>
                        <li>• Proporcionar funcionalidades de seguridad</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-accent-yellow">
                        📊 Cookies de Análisis
                      </h3>
                      <p className="text-muted leading-relaxed mb-2">
                        Nos ayudan a entender cómo utilizas nuestro sitio web:
                      </p>
                      <ul className="text-muted leading-relaxed space-y-1 ml-6">
                        <li>• Páginas más visitadas</li>
                        <li>• Tiempo de permanencia en el sitio</li>
                        <li>• Fuentes de tráfico</li>
                        <li>• Comportamiento de navegación</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-accent-yellow">
                        🎯 Cookies de Funcionalidad
                      </h3>
                      <p className="text-muted leading-relaxed mb-2">
                        Mejoran tu experiencia recordando tus preferencias:
                      </p>
                      <ul className="text-muted leading-relaxed space-y-1 ml-6">
                        <li>• Configuraciones del editor de código</li>
                        <li>• Preferencias de tema (claro/oscuro)</li>
                        <li>• Configuraciones de notificaciones</li>
                        <li>• Preferencias de accesibilidad</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-accent-yellow">
                        📱 Cookies de Rendimiento
                      </h3>
                      <p className="text-muted leading-relaxed mb-2">
                        Nos ayudan a optimizar el rendimiento del sitio:
                      </p>
                      <ul className="text-muted leading-relaxed space-y-1 ml-6">
                        <li>• Monitorear tiempos de carga</li>
                        <li>• Identificar errores técnicos</li>
                        <li>• Optimizar recursos del servidor</li>
                        <li>• Mejorar la velocidad del sitio</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-accent-blue">
                    Cookies de Terceros
                  </h2>
                  <p className="text-muted leading-relaxed mb-4">
                    También utilizamos servicios de terceros que pueden establecer cookies:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-accent-red">Google Analytics</h3>
                      <p className="text-muted leading-relaxed">
                        Para analizar el tráfico y uso de nuestro sitio web.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-accent-red">YouTube</h3>
                      <p className="text-muted leading-relaxed">
                        Para mostrar videos educativos en nuestros cursos.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-accent-red">Redes Sociales</h3>
                      <p className="text-muted leading-relaxed">
                        Para integrar contenido de Facebook, Instagram, LinkedIn y YouTube.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-accent-red">Donorbox</h3>
                      <p className="text-muted leading-relaxed">
                        Para procesar donaciones y mantener la plataforma gratuita.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-accent-blue">
                    Duración de las Cookies
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-accent-yellow">Cookies de Sesión</h3>
                      <p className="text-muted leading-relaxed">
                        Se eliminan automáticamente cuando cierras tu navegador.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-accent-yellow">Cookies Persistentes</h3>
                      <p className="text-muted leading-relaxed">
                        Permanecen en tu dispositivo durante un período específico (hasta 2 años).
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-accent-blue">
                    Control de Cookies
                  </h2>
                  <p className="text-muted leading-relaxed mb-4">
                    Tienes varias opciones para controlar las cookies:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-accent-yellow">Configuración del Navegador</h3>
                      <p className="text-muted leading-relaxed mb-2">
                        Puedes configurar tu navegador para:
                      </p>
                      <ul className="text-muted leading-relaxed space-y-1 ml-6">
                        <li>• Aceptar o rechazar todas las cookies</li>
                        <li>• Recibir notificaciones cuando se establezcan cookies</li>
                        <li>• Eliminar cookies existentes</li>
                        <li>• Bloquear cookies de terceros</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-accent-yellow">Panel de Preferencias</h3>
                      <p className="text-muted leading-relaxed">
                        Próximamente implementaremos un panel de preferencias de cookies 
                        donde podrás gestionar tus opciones directamente en nuestro sitio.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-accent-blue">
                    Impacto de Deshabilitar Cookies
                  </h2>
                  <p className="text-muted leading-relaxed mb-4">
                    Si decides deshabilitar las cookies, ten en cuenta que:
                  </p>
                  <ul className="text-muted leading-relaxed space-y-2 ml-6">
                    <li>• Es posible que algunas funciones no funcionen correctamente</li>
                    <li>• Tendrás que volver a configurar tus preferencias en cada visita</li>
                    <li>• No podremos recordar tu progreso en los cursos</li>
                    <li>• Algunas características de personalización no estarán disponibles</li>
                    <li>• El rendimiento del sitio puede verse afectado</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-accent-blue">
                    Actualizaciones de esta Política
                  </h2>
                  <p className="text-muted leading-relaxed">
                    Esta política de cookies puede actualizarse ocasionalmente para reflejar 
                    cambios en nuestras prácticas o por otras razones operativas, legales o reglamentarias. 
                    Te notificaremos sobre cambios significativos.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-accent-blue">
                    Contacto
                  </h2>
                  <p className="text-muted leading-relaxed">
                    Si tienes preguntas sobre nuestra política de cookies, contáctanos a través de:
                  </p>
                  <ul className="text-muted leading-relaxed space-y-1 ml-6 mt-4">
                    <li>• Nuestra página de contacto</li>
                    <li>• Correo electrónico: cookies@webcodeacademy.com.mx</li>
                    <li>• Redes sociales oficiales</li>
                  </ul>
                </div>

                <div className="border-t border-secondary-800 pt-8">
                  <p className="text-muted text-sm">
                    <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-MX')}
                  </p>
                  <p className="text-muted text-sm mt-2">
                    Esta política de cookies es efectiva a partir de la fecha de publicación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
} 