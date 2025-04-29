import { InsertTeam } from '@shared/schema';

// Initial team data for seeding the application
export const initialTeam: InsertTeam[] = [
  {
    name: "Angel Salazar",
    role: "CEO & Fundador",
    bio: "Creador de Web Code Academy, apasionado por democratizar la educación tecnológica y ayudar a otros a alcanzar sus metas profesionales.",
    image: "https://raw.githubusercontent.com/AngelIsaiSzr/Resources/refs/heads/main/images/Angel%20Salazar.png",
    linkedIn: "https://linkedin.com/in/angelsalazar",
    github: "https://github.com/angelsalazar",
    twitter: "https://twitter.com/angelsalazar",
    order: 1
  },
  {
    name: "Yamileth Leonides",
    role: "COO",
    bio: "Experta en operaciones y gestión de proyectos educativos, con amplia experiencia en el sector tecnológico y de e-learning.",
    image: "https://raw.githubusercontent.com/AngelIsaiSzr/Resources/refs/heads/main/images/Fotitoooo.jpeg",
    linkedIn: "https://linkedin.com/in/lauramendez",
    github: "https://github.com/lauramendez",
    twitter: "https://twitter.com/lauramendez",
    order: 2
  }
];

/*
  {
    name: "Carlos Ruiz",
    role: "Instructor Principal",
    bio: "Desarrollador fullstack con más de 10 años de experiencia en la industria y 5 años como educador en tecnología.",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    linkedIn: "https://linkedin.com/in/carlosruiz",
    github: "https://github.com/carlosruiz",
    twitter: "https://twitter.com/carlosruiz",
    order: 3
  },
  {
    name: "Sofía Torres",
    role: "Community Manager",
    bio: "Especialista en comunicación digital y gestión de comunidades educativas en línea, enfocada en crear experiencias significativas.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    linkedIn: "https://linkedin.com/in/sofiatorres",
    instagram: "https://instagram.com/sofiatorres",
    twitter: "https://twitter.com/sofiatorres",
    order: 4
  },
  {
    name: "Miguel Martínez",
    role: "Instructor",
    bio: "Especialista en desarrollo frontend con experiencia en React, Angular y Vue. Apasionado por crear experiencias de usuario excepcionales.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    linkedIn: "https://linkedin.com/in/miguelmartinez",
    github: "https://github.com/miguelmartinez",
    twitter: "https://twitter.com/miguelmartinez",
    order: 5
  },
  {
    name: "Ana García",
    role: "Instructora",
    bio: "Experta en ciencia de datos y machine learning. Ha trabajado en múltiples proyectos de análisis de datos y modelado predictivo para empresas Fortune 500.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    linkedIn: "https://linkedin.com/in/anagarcia",
    github: "https://github.com/anagarcia",
    twitter: "https://twitter.com/anagarcia",
    order: 6
  }
*/