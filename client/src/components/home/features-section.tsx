import { motion } from 'framer-motion';

const features = [
  {
    icon: 'fas fa-laptop-code',
    title: 'Cursos 100% Gratuitos',
    description: 'Accede a educación de calidad en programación sin ningún costo. Aprende a tu propio ritmo y desde cualquier lugar.',
    color: 'accent-red'
  },
  {
    icon: 'fas fa-chalkboard-teacher',
    title: 'Clases Mixtas',
    description: 'Disfruta de modalidad presencial y virtual. Accede a las grabaciones y recursos de las clases en cualquier momento.',
    color: 'accent-blue'
  },
  {
    icon: 'fas fa-user-graduate',
    title: 'Certificación Reconocida',
    description: 'Obtén certificados al completar los cursos y mejora tu perfil profesional para acceder a mejores oportunidades laborales.',
    color: 'accent-yellow'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-primary-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-primary-700 rounded-xl p-8 transform transition hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1
              }}
            >
              <div className={`text-${feature.color} text-3xl mb-4`}>
                <i className={feature.icon}></i>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
