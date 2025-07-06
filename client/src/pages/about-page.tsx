import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import TeamSection from "@/components/home/team-section";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Web Code Academy</title>
        <meta 
          name="description" 
          content="Conoce la misión y visión de Web Code Academy, una academia de programación y tecnología gratuita que busca combatir el analfabetismo digital."
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-secondary-900 py-20 pb-10 md:pb-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mt-6 mb-4">
                  Conócenos
                </h1>
                <p className="text-muted text-lg">
                  Somos una academia comprometida con la educación tecnológica inclusiva, gratuita y accesible para todas las personas.
                </p>
              </div>
            </div>
          </section>
          
          {/* Mission & Vision */}
          <section className="bg-primary-800 py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2 order-2 md:order-1">
                  <h2 className="text-3xl font-heading font-bold mb-6">
                    Nuestra Misión
                  </h2>
                  <p className="text-muted mb-6">
                    En <span className="accent-blue font-medium">Web Code Academy</span>, creemos que la educación tecnológica de calidad debe ser accesible para todos. Nuestra misión es combatir el analfabetismo digital ofreciendo cursos de programación y tecnología gratuitos que permitan a nuestros estudiantes desarrollar habilidades relevantes para el mercado laboral actual.
                  </p>
                  
                  <h3 className="text-xl font-heading font-semibold mb-4">
                    Objetivos de Desarrollo Sostenible
                  </h3>
                  <p className="text-muted mb-4">
                    Nos alineamos con los siguientes ODS de la Agenda 2030 de la ONU:
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="px-3 py-2 bg-primary-700 rounded-lg text-sm flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-accent-red rounded-full mr-2 text-xs font-bold">4</span>
                      Educación de Calidad
                    </div>
                    <div className="px-3 py-2 bg-primary-700 rounded-lg text-sm flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-accent-blue rounded-full mr-2 text-xs font-bold">8</span>
                      Trabajo Decente
                    </div>
                    <div className="px-3 py-2 bg-primary-700 rounded-lg text-sm flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-accent-yellow rounded-full mr-2 text-xs font-bold">10</span>
                      Reducción de Desigualdades
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 order-1 md:order-2">
                  <img 
                    src="https://i.ibb.co/xbFQPY1/about1-cy3qzm.jpg" 
                    alt="Misión de Web Code Academy" 
                    className="rounded-xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* History & Values */}
          <section className="bg-secondary-900 py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2">
                  <img 
                    src="https://i.ibb.co/rKPSpHYq/about2-rxuu0v.jpg" 
                    alt="Valores de Web Code Academy" 
                    className="rounded-xl shadow-lg"
                  />
                </div>
                
                <div className="w-full md:w-1/2">
                  <h2 className="text-3xl font-heading font-bold mb-6">
                    Nuestra Historia
                  </h2>
                  <p className="text-muted mb-6">
                    Web Code Academy nació en 2022 como una respuesta a la creciente necesidad de educación tecnológica accesible. Fundada por Angel Salazar, quien experimentó de primera mano las barreras de acceso a la educación en tecnología, nuestra academia comenzó como un pequeño grupo de estudio y ha crecido hasta convertirse en una comunidad con decenas de estudiantes en toda Latinoamérica.
                  </p>
                  
                  <h3 className="text-xl font-heading font-semibold mb-4">
                    Nuestros Valores
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="accent-red mr-4 mt-1">
                        <i className="fas fa-star"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Inclusión</h4>
                        <p className="text-muted text-sm">Creemos que todos merecen acceso a educación de calidad, sin importar su situación económica o ubicación geográfica.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="accent-blue mr-4 mt-1">
                        <i className="fas fa-hands-helping"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Comunidad</h4>
                        <p className="text-muted text-sm">Fomentamos un ambiente colaborativo donde estudiantes e instructores aprenden juntos y se apoyan mutuamente.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="accent-yellow ml-1 mr-5 mt-1">
                        <i className="fas fa-lightbulb"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Innovación</h4>
                        <p className="text-muted text-sm">Constantemente buscamos nuevas formas de mejorar nuestra enseñanza y adaptarnos a las tecnologías emergentes.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="accent-red ml-1 mr-4 mt-1">
                        <i className="fas fa-certificate"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Excelencia</h4>
                        <p className="text-muted text-sm">Nos comprometemos a ofrecer contenido educativo de la más alta calidad, desarrollado por expertos en cada campo.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Team Section */}
          <TeamSection />
          
          {/* Impact */}
          <section className="bg-secondary-900 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-heading font-bold mb-6">
                  Nuestro Impacto
                </h2>
                <p className="text-muted mb-12">
                  Estamos orgullosos de los logros alcanzados hasta ahora, pero sabemos que nuestro trabajo apenas está comenzando.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-primary-700 rounded-xl p-8 text-center">
                  <div className="text-4xl font-bold accent-red mb-4">+120</div>
                  <h3 className="text-xl font-heading font-semibold mb-2">Estudiantes</h3>
                  <p className="text-muted">Personas que han accedido a educación gratuita de calidad en programación y tecnología.</p>
                </div>
                
                <div className="bg-primary-700 rounded-xl p-8 text-center">
                  <div className="text-4xl font-bold accent-blue mb-4">2</div>
                  <h3 className="text-xl font-heading font-semibold mb-2">Cursos Completos</h3>
                  <p className="text-muted">Programas educativos gratuitos con contenido exhaustivo y proyectos prácticos.</p>
                </div>
                
                <div className="bg-primary-700 rounded-xl p-8 text-center">
                  <div className="text-4xl font-bold accent-yellow mb-4">45%</div>
                  <h3 className="text-xl font-heading font-semibold mb-2">Tasa de Empleo</h3>
                  <p className="text-muted">De nuestros graduados han encontrado trabajo en el campo tecnológico o mejorado su situación laboral.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
