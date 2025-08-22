import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import TeamSection from "@/components/home/team-section";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Acerca de - Web Code Academy | Primera Academia Tecnológica Multidisciplinaria y Colaborativa</title>
        <meta 
          name="description" 
          content="Conoce la evolución de Web Code Academy, la primera academia tecnológica multidisciplinaria y colaborativa 100% gratuita que revoluciona la educación del siglo XXI."
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
                    En <span className="accent-blue font-medium">Web Code Academy</span>, creemos que la educación tecnológica de calidad debe ser accesible para todos. Nuestra misión es combatir el analfabetismo digital ofreciendo cursos 100% gratuitos en alianza con otros proyectos educativos, que permitan a nuestros estudiantes desarrollar habilidades relevantes para el mercado laboral actual.
                  </p>
                  
                  <h3 className="text-xl font-heading font-semibold mb-4">
                    Metodología Play&Impact Learning
                  </h3>
                  <p className="text-muted mb-4">
                    Nuestra metodología se basa en el enfoque del creador de LEGO, donde aprender es como jugar en el jardín de niños, pero para toda la vida, y lo combinamos con lo mejor del Modelo Tec21. Nos alineamos con los siguientes ODS de la Agenda 2030 de la ONU:
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
                      <span className="w-6 h-6 flex items-center justify-center bg-accent-purple rounded-full mr-2 text-xs font-bold">9</span>
                      Industria, Innovación e Infraestructura
                    </div>
                    <div className="px-3 py-2 bg-primary-700 rounded-lg text-sm flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-accent-yellow rounded-full mr-2 text-xs font-bold">10</span>
                      Reducción de Desigualdades
                    </div>
                    <div className="px-3 py-2 bg-primary-700 rounded-lg text-sm flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-accent-green rounded-full mr-2 text-xs font-bold">17</span>
                      Alianzas para los Objetivos
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
          
          {/* Evolution & Values */}
          <section className="bg-secondary-900 py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2">
                  <img 
                    src="https://i.ibb.co/rKPSpHYq/about2-rxuu0v.jpg" 
                    alt="Evolución de Web Code Academy" 
                    className="rounded-xl shadow-lg"
                  />
                </div>
                
                <div className="w-full md:w-1/2">
                  <h2 className="text-3xl font-heading font-bold mb-6">
                    Nuestra Historia
                  </h2>
                  <p className="text-muted mb-6">
                    Web Code Academy nació en 2022 como una respuesta a la creciente necesidad de educación tecnológica accesible. Fundada por Angel Salazar, quien experimentó de primera mano las barreras de acceso a la educación en tecnología, nuestra academia comenzó como un pequeño grupo de estudio y ha evolucionado hasta convertirse en la primera academia tecnológica multidisciplinaria y colaborativa 100% gratuita.
                  </p>
                  
                  <h3 className="text-xl font-heading font-semibold mb-4">
                    Nuestros Nuevos Valores
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="accent-red mr-4 mt-1">
                        <i className="fas fa-star"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Multidisciplinariedad</h4>
                        <p className="text-muted text-sm">Integramos múltiples áreas del conocimiento usando con la tecnología como eje transversal, desde computación hasta historia, literatura, idiomas, matemáticas y arte digital.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="accent-blue mr-4 mt-1">
                        <i className="fas fa-hands-helping"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Colaboración</h4>
                        <p className="text-muted text-sm">Abrimos nuestras puertas a otros proyectos educativos y con impacto social para construir juntos una comunidad educativa descentralizada y diversa.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="accent-yellow ml-1 mr-5 mt-1">
                        <i className="fas fa-lightbulb"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Innovación Educativa</h4>
                        <p className="text-muted text-sm">Implementamos y desarrollamos nuestra metodología "Play&Impact Learning", integrando ODS, proyectos y retos que resuelven problemas reales del mundo.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="accent-green ml-1 mr-4 mt-1">
                        <i className="fas fa-globe"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Impacto Global</h4>
                        <p className="text-muted text-sm">Formamos agentes de cambio para el desarrollo sostenible, con impacto en más de 120 estudiantes de 9 países en Latinoamérica y España.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Vision & Collaboration */}
          <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-heading font-bold mb-6">
                  Visión Colaborativa y Descentralizada
                </h2>
                <p className="text-muted mb-8">
                  No buscamos centralizar, sino sumar. Queremos construir juntos una comunidad educativa descentralizada, diversa y humana usando nuestra metodología de aprendizaje.
                </p>
                
                <div className="bg-gradient-to-r from-primary-700 to-secondary-800 rounded-2xl p-8 mb-8 border border-primary-600/20 shadow-2xl">
                  <h3 className="text-2xl font-heading font-semibold mb-6 text-accent-blue">
                    Nuestra Visión Compartida
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center group">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent-yellow/20 to-accent-yellow/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-4xl">🤝</span>
                      </div>
                      <h4 className="font-semibold mb-3 text-lg">Unir Proyectos</h4>
                      <p className="text-muted text-sm">Conectamos iniciativas educativas para crear sinergias</p>
                    </div>
                    <div className="text-center group">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent-blue/20 to-accent-blue/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-4xl">🚀</span>
                      </div>
                      <h4 className="font-semibold mb-3 text-lg">Potenciar Talentos</h4>
                      <p className="text-muted text-sm">Desarrollamos habilidades para el futuro digital</p>
                    </div>
                    <div className="text-center group">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent-red/20 to-accent-red/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-4xl">💫</span>
                      </div>
                      <h4 className="font-semibold mb-3 text-lg">Transformar Vidas</h4>
                      <p className="text-muted text-sm">Creamos impacto social real en las comunidades</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-accent-blue/10 via-accent-blue/5 to-accent-blue/10 border border-primary-600/20 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-heading font-semibold mb-4 text-accent-red">
                    Nuestro Compromiso
                  </h3>
                  <p className="text-lg font-medium mb-5 leading-relaxed">
                    "Educación tecnológica gratuita para todos:<br />Forma, transforma e impulsa con Web Code Academy"
                  </p>
                  <h4 className="text-xl font-heading font-semibold mb-4 text-accent-yellow">
                    Nuestro Lema Principal
                  </h4>
                  <p className="text-lg font-medium leading-relaxed">
                    "Aprender tecnología no debe ser un privilegio: debe ser un derecho."
                  </p>
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
                  Nuestro Impacto Global
                </h2>
                <p className="text-muted mb-12">
                  Estamos orgullosos de los logros alcanzados hasta ahora, pero sabemos que nuestro trabajo apenas está comenzando. Este es solo el comienzo de algo mucho más grande.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-primary-700 rounded-xl p-8 text-center">
                  <div className="text-4xl font-bold accent-red mb-4">+120</div>
                  <h3 className="text-xl font-heading font-semibold mb-2">Estudiantes</h3>
                  <p className="text-muted">Personas de 9 países en Latinoamérica y España que han accedido a educación gratuita de calidad.</p>
                </div>
                
                <div className="bg-primary-700 rounded-xl p-8 text-center">
                  <div className="text-4xl font-bold accent-blue mb-4">4</div>
                  <h3 className="text-xl font-heading font-semibold mb-2">Sedes</h3>
                  <p className="text-muted">Contamos con Sede en Veracruz, Guadalajara, Nuevo León y Nacional. Muy pronto abriremos más sedes.</p>
                </div>
                
                <div className="bg-primary-700 rounded-xl p-8 text-center">
                  <div className="text-4xl font-bold accent-yellow mb-4">∞</div>
                  <h3 className="text-xl font-heading font-semibold mb-2">Posibilidades</h3>
                  <p className="text-muted">Cursos multidisciplinarios desde computación hasta historia, literatura, idiomas, matemáticas y arte digital.</p>
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
