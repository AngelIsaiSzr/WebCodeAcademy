import { Link } from 'wouter';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="accent-blue mr-2">
                <i className="fas fa-code text-2xl"></i>
              </div>
              <span className="font-heading font-bold text-xl">Web Code Academy</span>
            </div>
            <p className="text-muted mb-6">
              Academia de programación y tecnología completamente gratuita, comprometida con la educación de calidad y la reducción del analfabetismo digital.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted hover-accent-red">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted hover-accent-blue">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted hover-accent-red">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted hover-accent-blue">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-muted hover-accent-red">Inicio</Link></li>
              <li><Link href="/courses" className="text-muted hover-accent-red">Cursos</Link></li>
              <li><Link href="/about" className="text-muted hover-accent-red">Acerca de</Link></li>
              <li><Link href="/contact" className="text-muted hover-accent-red">Contacto</Link></li>
              <li><Link href="/editor" className="text-muted hover-accent-red">Editor</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6">Cursos</h3>
            <ul className="space-y-4">
              <li><Link href="/courses" className="text-muted hover-accent-red">Desarrollo Web Frontend</Link></li>
              <li><Link href="/courses" className="text-muted hover-accent-red">Python Fullstack</Link></li>
              <li><Link href="/courses" className="text-muted hover-accent-red">Java Fullstack</Link></li>
              <li><Link href="/courses" className="text-muted hover-accent-red">React & Redux</Link></li>
              <li><Link href="/courses" className="text-muted hover-accent-red">Ciencia de Datos</Link></li>
              <li><Link href="/courses" className="text-muted hover-accent-red">Node.js & Express</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6">Recursos</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted hover-accent-red">Blog</a></li>
              <li><a href="#" className="text-muted hover-accent-red">Tutoriales</a></li>
              <li><a href="#" className="text-muted hover-accent-red">Proyectos de Ejemplo</a></li>
              <li><a href="#" className="text-muted hover-accent-red">Documentación</a></li>
              <li><a href="#" className="text-muted hover-accent-red">Comunidad</a></li>
              <li><a href="#" className="text-muted hover-accent-red">Preguntas Frecuentes</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted text-sm mb-4 md:mb-0">
              © {currentYear} Web Code Academy. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted hover-accent-red text-sm">Términos y Condiciones</a>
              <a href="#" className="text-muted hover-accent-red text-sm">Política de Privacidad</a>
              <a href="#" className="text-muted hover-accent-red text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
