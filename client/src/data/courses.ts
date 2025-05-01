import { InsertCourse } from '@shared/schema';

// Datos iniciales de los cursos para la aplicación
export const initialCourses: InsertCourse[] = [
  {
    title: "Desarrollo Web",
    slug: "desarrollo-web",
    description: "En este curso aprenderás todo sobre el Desarrollo Web. Desde la estructura básica de una página web en HTML, hasta la aplicación de estilos en CSS y la implementación de interactividad con JavaScript, desarrollarás las habilidades necesarias para construir interfaces de usuario claras y funcionales.",
    shortDescription: "Aprende a crear sitios web con HTML, CSS y JavaScript. Inicia tu camino en la programación y el desarrollo web.",
    level: "Principiante",
    category: "Desarrollo Web",
    duration: 24,
    modules: 11,
    image: "https://res.cloudinary.com/dw6igi7fc/image/upload/v1746134148/back1_sngqjn.jpg",
    featured: false,
    popular: true,
    new: false,
    instructor: "Angel Salazar"
  },
  {
    title: "Desarrollo Web Frontend",
    slug: "desarrollo-web-frontend",
    description: "Domina HTML, CSS y JavaScript para crear interfaces web modernas, responsivas y accesibles. En este curso aprenderás a crear sitios web desde cero, implementar diseños responsive, añadir interactividad con JavaScript y trabajar con frameworks y librerías populares. Al finalizar estarás listo para construir aplicaciones web completas con las mejores prácticas de la industria.",
    shortDescription: "Domina HTML, CSS y JavaScript para crear interfaces web modernas, responsivas y accesibles.",
    level: "Principiante",
    category: "Frontend",
    duration: 30,
    modules: 9,
    image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&auto=format&fit=crop&w=1489&q=80",
    featured: true,
    popular: false,
    new: false,
    instructor: "Angel Salazar"
  },
  {
    title: "Python Fullstack",
    slug: "python-fullstack",
    description: "Desde fundamentos hasta aplicaciones avanzadas, proyectos prácticos y desarrollo fullstack con Python. Aprenderás Python desde cero, programación orientada a objetos, frameworks como Django y Flask, manejo de bases de datos, y cómo construir aplicaciones web completas. El curso incluye proyectos reales que te permitirán aplicar todos los conocimientos adquiridos.",
    shortDescription: "Desde fundamentos hasta aplicaciones avanzadas, proyectos prácticos y desarrollo fullstack con Python.",
    level: "Todos los niveles",
    category: "Fullstack",
    duration: 45,
    modules: 10,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1489&q=80",
    featured: false,
    popular: true,
    new: false,
    instructor: "Angel Salazar"
  },
  {
    title: "Java Fullstack",
    slug: "java-fullstack",
    description: "Aprende Java para desarrollo empresarial, aplicaciones Android y sistemas backend robustos. Este curso te llevará desde los fundamentos de Java hasta conceptos avanzados como programación orientada a objetos, patrones de diseño, desarrollo de aplicaciones web con Spring Boot, y creación de aplicaciones móviles para Android. Obtendrás habilidades muy demandadas en el mercado laboral actual.",
    shortDescription: "Aprende Java para desarrollo empresarial, aplicaciones Android y sistemas backend robustos.",
    level: "Intermedio",
    category: "Backend",
    duration: 55,
    modules: 8,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1489&q=80",
    featured: false,
    popular: false,
    new: false,
    instructor: "Carlos Ruiz"
  },
  {
    title: "React & Redux",
    slug: "react-redux",
    description: "Construye interfaces dinámicas con React, gestiona estados con Redux y crea SPAs modernas. Aprenderás a desarrollar aplicaciones web modernas utilizando React.js, implementar gestión de estados con Redux, crear componentes reutilizables, trabajar con hooks, y utilizar las mejores prácticas de desarrollo frontend. Desarrollarás múltiples proyectos que podrás añadir a tu portafolio profesional.",
    shortDescription: "Construye interfaces dinámicas con React, gestiona estados con Redux y crea SPAs modernas.",
    level: "Intermedio",
    category: "Frontend",
    duration: 30,
    modules: 7,
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1489&q=80",
    featured: false,
    popular: false,
    new: true,
    instructor: "Laura Méndez"
  },
  {
    title: "Ciencia de Datos con Python",
    slug: "ciencia-datos-python",
    description: "Análisis de datos, visualización, machine learning y proyectos reales con Python y sus bibliotecas. Este curso cubre todo lo que necesitas para convertirte en un científico de datos: análisis exploratorio, preprocesamiento de datos, creación de modelos predictivos, evaluación de modelos y despliegue. Trabajarás con bibliotecas como NumPy, Pandas, Matplotlib, scikit-learn y TensorFlow en proyectos del mundo real.",
    shortDescription: "Análisis de datos, visualización, machine learning y proyectos reales con Python y sus bibliotecas.",
    level: "Avanzado",
    category: "Data Science",
    duration: 50,
    modules: 8,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1489&q=80",
    featured: true,
    popular: false,
    new: false,
    instructor: "Carlos Ruiz"
  },
  {
    title: "Node.js & Express",
    slug: "nodejs-express",
    description: "Crea APIs robustas, microservicios y aplicaciones en tiempo real con Node.js y Express. En este curso aprenderás desarrollo backend con Node.js, creación de APIs RESTful, implementación de autenticación y autorización, manejo de bases de datos SQL y NoSQL, y cómo construir aplicaciones en tiempo real con WebSockets. Obtendrás todos los conocimientos necesarios para desarrollar servicios backend escalables y mantenibles.",
    shortDescription: "Crea APIs robustas, microservicios y aplicaciones en tiempo real con Node.js y Express.",
    level: "Intermedio",
    category: "Backend",
    duration: 25,
    modules: 6,
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=1489&q=80",
    featured: false,
    popular: false,
    new: true,
    instructor: "Angel Salazar"
  },
  {
    title: "Angular Avanzado",
    slug: "angular-avanzado",
    description: "Domina el desarrollo de aplicaciones web empresariales con Angular. En este curso cubrirás desde los fundamentos de TypeScript hasta características avanzadas de Angular como manejo de estados, optimización de rendimiento, integración con APIs, pruebas unitarias y de integración, y despliegue en producción. Crearás aplicaciones complejas siguiendo las mejores prácticas y patrones de arquitectura.",
    shortDescription: "Domina el desarrollo de aplicaciones web empresariales con Angular y TypeScript.",
    level: "Avanzado",
    category: "Frontend",
    duration: 40,
    modules: 8,
    image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1489&q=80",
    featured: false,
    popular: true,
    new: false,
    instructor: "Laura Méndez"
  },
  {
    title: "Machine Learning con Python",
    slug: "machine-learning-python",
    description: "Aprende a construir, entrenar y desplegar modelos predictivos y de clasificación con scikit-learn y TensorFlow. Este curso te llevará desde conceptos básicos de machine learning hasta técnicas avanzadas como redes neuronales, procesamiento de lenguaje natural y visión por computadora. Trabajarás con datasets reales y aprenderás a implementar soluciones para problemas del mundo real.",
    shortDescription: "Construye, entrena y despliega modelos inteligentes con las principales bibliotecas de ML.",
    level: "Avanzado",
    category: "Data Science",
    duration: 60,
    modules: 12,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1489&q=80",
    featured: true,
    popular: true,
    new: false,
    instructor: "Carlos Ruiz"
  },
  {
    title: "Desarrollo de Aplicaciones Móviles con Flutter",
    slug: "desarrollo-flutter",
    description: "Crea aplicaciones nativas para iOS y Android con un solo código base usando Flutter y Dart. Aprenderás a diseñar interfaces de usuario atractivas, implementar navegación entre pantallas, gestionar el estado de la aplicación, conectarte a APIs y bases de datos, y publicar tus aplicaciones en las tiendas de aplicaciones. El curso incluye varios proyectos completos para reforzar tu aprendizaje.",
    shortDescription: "Crea aplicaciones nativas para iOS y Android con Flutter y Dart.",
    level: "Intermedio",
    category: "Mobile",
    duration: 35,
    modules: 7,
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1489&q=80",
    featured: false,
    popular: false,
    new: true,
    instructor: "Angel Salazar"
  },
  {
    title: "Desarrollo de Videojuegos con Unity",
    slug: "desarrollo-unity",
    description: "Aprende a crear juegos 2D y 3D para múltiples plataformas con Unity y C#. El curso cubre desde los fundamentos de la programación en C# hasta conceptos avanzados de desarrollo de videojuegos como físicas, animaciones, inteligencia artificial, interfaces de usuario, efectos visuales y audio. Desarrollarás varios juegos completos que podrás publicar y mostrar en tu portafolio.",
    shortDescription: "Crea juegos 2D y 3D para múltiples plataformas con Unity y C#.",
    level: "Todos los niveles",
    category: "Game Dev",
    duration: 65,
    modules: 14,
    image: "https://codideep.com/img/blogpost/imagenportada/202305250000001.png",
    featured: true,
    popular: false,
    new: false,
    instructor: "Carlos Ruiz"
  },
  {
    title: "DevOps y CI/CD",
    slug: "devops-cicd",
    description: "Aprende a implementar metodologías DevOps, automatización de despliegues y entrega continua en entornos empresariales. Este curso cubre herramientas esenciales como Docker, Kubernetes, Jenkins, GitHub Actions, y servicios en la nube como AWS, Google Cloud y Azure. Aprenderás a crear pipelines de CI/CD, gestionar infraestructura como código, monitorizar aplicaciones y garantizar la seguridad en todo el proceso de desarrollo.",
    shortDescription: "Implementa metodologías DevOps, automatización de despliegues y entrega continua.",
    level: "Avanzado",
    category: "DevOps",
    duration: 45,
    modules: 9,
    image: "https://www.portainer.io/hubfs/Best%20CICD%20Concepts%20for%20DevOps%201600x900.png",
    featured: false,
    popular: true,
    new: false,
    instructor: "Laura Méndez"
  }
];

// Módulos para el curso de Desarrollo Web
export const webDevModules = [
  {
    courseId: 1, // Desarrollo Web course
    title: "Introducción a la Computación",
    description: "Aprende los conceptos básicos de la computación. Incluye historia de la computación, hardware y software.",
    duration: 2,
    order: 1,
    difficulty: "Easy",
    instructor: "Angel Salazar"
  },
  {
    courseId: 1, // Desarrollo Web course
    title: "HTML Básico",
    description: "Descubre el mundo del código: tu primer paso hacia HTML. Aprende a crear tu primera página web con HTML.",
    duration: 2,
    order: 2,
    difficulty: "Easy",
    instructor: "Angel Salazar"
  },
  {
    courseId: 1, // Desarrollo Web course
    title: "HTML Intermedio",
    description: "Maneja el uso de enlaces y multimedia para enriquecer tu contenido. Aprende a crear enlaces, imágenes y videos en HTML.",
    duration: 2,
    order: 3,
    difficulty: "Easy",
    instructor: "Angel Salazar"
  },
  {
    courseId: 1, // Desarrollo Web course
    title: "HTML Avanzado",
    description: "Conoce como crear formularios y mejores prácticas. Aprende a crear formularios y validar datos en HTML.",
    duration: 2,
    order: 4,
    difficulty: "Easy",
    instructor: "Angel Salazar"
  },
  {
    courseId: 1, // Desarrollo Web course
    title: "CSS Básico",
    description: "Embellece la web con CSS, definiendo estilo y diseño visual. Aplica estilos básicos a tus páginas web.",
    duration: 2,
    order: 5,
    difficulty: "Easy",
    instructor: "Angel Salazar"
  },
  {
    courseId: 1, // Desarrollo Web course
    title: "CSS Intermedio",
    description: "Diseña sitios web de forma visualmente agradable y coherente. Aprende a usar selectores y propiedades CSS.",
    duration: 2,
    order: 6,
    difficulty: "Easy",
    instructor: "Angel Salazar"
  },
  {
    courseId: 1, // Desarrollo Web course
    title: "CSS Avanzado",
    description: "Domina transiciones, animaciones, y flexbox. Aprende a crear diseños responsivos y atractivos.",
    duration: 2,
    order: 7,
    difficulty: "Easy",
    instructor: "Angel Salazar"
  },
  {
    courseId: 1, // Desarrollo Web course
    title: "JavaScript Básico",
    description: "Descubre la magia de la programación con JavaScript. Crea páginas dinámicas e interactivas.",
    duration: 2,
    order: 8,
    difficulty: "Medium",
    instructor: "Angel Salazar"
  },
  {
    courseId: 1, // Desarrollo Web course
    title: "JavaScript Intermedio",
    description: "Logra que tus sitios web respondan de manera más intuitiva. Aprende a manipular el DOM y eventos.",
    duration: 2,
    order: 9,
    difficulty: "Medium",
    instructor: "Angel Salazar"
  },
  {
    courseId: 1, // Desarrollo Web course
    title: "JavaScript Avanzado",
    description: "Profundiza en funciones, arrays y objetos para gestionar datos. Descubre como trabajar con funciones avanzadas.",
    duration: 2,
    order: 10,
    difficulty: "Medium",
    instructor: "Angel Salazar"
  },
  {
    courseId: 1, // Desarrollo Web course
    title: "Publicación de tu Página Web",
    description: "Sube tu página web a internet y comparte el link a tus amigos. Aprende a usar Git, GitHub y Github Pages.",
    duration: 2,
    order: 11,
    difficulty: "Medium",
    instructor: "Angel Salazar"
  }
];

// Secciones para el curso de Desarrollo Web
export const webDevSections = [
  {
    moduleId: 1, // Introducción a la Computación module
    title: "Historia de la Computación",
    content: "Aprenderás sobre la historia de la computación, desde los primeros dispositivos hasta las computadoras modernas.",
    duration: 30,
    order: 1
  },
  {
    moduleId: 1, // Introducción a la Computación module
    title: "Hardware y Software",
    content: "Aprenderás sobre los componentes físicos de una computadora y el software que los controla.",
    duration: 45,
    order: 2
  },
  {
    moduleId: 1, // Introducción a la Computación module
    title: "Sistemas Operativos",
    content: "Aprenderás sobre los diferentes sistemas operativos y su función en la computación moderna.",
    duration: 60,
    order: 3
  }
];