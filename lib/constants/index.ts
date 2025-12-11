export const navLinks = [
  {
    id: 1,
    name: "Projects",
    type: "finder",
  },
  {
    id: 3,
    name: "Contact",
    type: "contact",
  },
  {
    id: 4,
    name: "Resume",
    type: "resume",
  },
];

export const navUtilsIcons = [
  {
    id: 1,
    imgSrc: "/icons/wifi.svg",
  },
  {
    id: 2,
    imgSrc: "/icons/search.svg",
  },
  {
    id: 3,
    imgSrc: "/icons/user.svg",
  },
  {
    id: 4,
    imgSrc: "/icons/mode.svg",
  },
];

export const socials = [
  {
    id: 1,
    text: "Whatsapp",
    icon: "/icons/whatsapp-white.png",
    bg: "#075E54",
    link: "https://wa.me/6283130000094",
    tooltipText: 'Hubungi lewat Whatsapp'
  },
  
  {
    id: 2,
    text: "Telegram",
    icon: "/icons/telegram-white.png",
    bg: "#0088CC",
    link: "https://t.me/herrywidnyana",
    tooltipText: 'Hubungi lewat Telegram'
  },
  {
    id: 3,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#000",
    link: "https://github.com/herrywidnyana22",
    tooltipText: 'Lihat di Github'
  },
  {
    id: 4,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#0077B5",
    link: "https://linkedin.com/in/herrywidnyana",
    tooltipText: 'Lihat di LinkedIn'
  },
];


const PROJECT_LOCATION = {
  id: 1,
  type: "work",
  name: "My Work",
  icon: "/icons/work.svg",
  kind: "folder",
  tooltipText: "Lihat semua project",
  children: [
    // ▶ Project 1
    {
      id: "project1",
      name: "MyDrive",
      icon: "/icons/folder.png",
      subIcon: "/icons/mydrive-logo.svg",
      kind: "folder",
      tooltipText: "MyDrive",
      children: [
        {
          id: "mydrive1",
          name: "README.txt",
          projectName: "MyDrive",
          projectIcon: "/icons/mydrive-logo.svg",
          tooltipText: "Lihat detail",
          progressValue: 85,
          icon: "/icons/txt.png",
          kind: "file",
          fileType: "projectInfo",
          description: [
            "MyDrive merupakah website cloud storage yang dirancang untuk memberikan pengalaman penyimpanan file yang cepat, aman, dan mudah diakses.",
            "Dengan MyDrive, kamu dapat mengunggah, mengelola, dan berbagi file dengan beberapa klik saja.",
            "Antarmuka yang intuitif memungkinkan pengguna dari berbagai tingkat keahlian untuk menavigasi dan mengorganisir file mereka tanpa kesulitan.",
            "Dibangun dengan Next.js dan Appwrite, MyDrive menggabungkan teknologi modern untuk memastikan performa optimal dan keamanan data.",
          ],

          techStack: [
            {
              "src": "/icons/nextjs.webp",
              "label": "Next.js"
            },
            {
              "src": "/icons/typescript.webp",
              "label": "Typescript"
            },
            {
              "src": "/icons/python.png",
              "label": "Python"
            },
            {
              "src": "/icons/tailwind.webp",
              "label": "TailwindCSS"
            },
            {
              "src": "/icons/fastAPI.webp",
              "label": "FastAPI"
            }
          ],
        },
        {
          id: "mydrive2",
          name: "MyDrive Demo",
          icon: "/icons/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://www.mydrive.herrywidnyana.com",
          tooltipText: "Lihat demo",
        },
        {
          id: "mydrive3",
          name: "Tech Stack",
          projectName: "MyDrive",
          icon: "/icons/terminal.png",
          kind: "file",
          fileType: "techstack",
          tooltipText: "Lihat tech stack",
          techStack:[
            {
              category: "Frontend",
              items: ["React.js", "Next.js", "TypeScript"],
            },
            {
              category: "Styling",
              items: ["Tailwind CSS", "CSS"],
            },
            {
              category: "Backend",
              items: ["Python", "FastAPI", "CloudFlare"],
            },
            {
              category: "Dev Tools",
              items: ["Git", "GitHub", "Docker"],
            },
          ],
        },
        {
          id: "mydrive4",
          name: "preview.png",
          icon: "/icons/image.png",
          kind: "file",
          fileType: "img",
          imageUrl: "/icons/project-2.png",
          tooltipText: "Lihat sample preview",
        },
        {
          id: "mydrive5",
          name: "Github",
          icon: "/icons/github.webp",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/herrywidnyana22/mydrive",
          tooltipText: "Lihat source",
        },
      ],
    },

    // ▶ Project 2
    {
      id: "project2",
      name: "AI Agent Portfolio",
      icon: "/icons/folder.png",
      subIcon: "/icons/logo.webp",
      kind: "folder",
      tooltipText: "AI Agent Portfolio",
      children: [
        {
          id: "myweb1",
          name: "README.txt",
          projectName: "AI Agent Portfolio",
          projectIcon: "/icons/logo.webp",
          tooltipText: "Lihat detail",
          progressValue: 100,
          icon: "/icons/txt.png",
          kind: "file",
          fileType: "projectInfo",
          description: [
            "Sebuah portfolio pribadi berbasis Next.js dan Tailwind yang menampilkan project-project serta tulisan blog.",
            "Didukung AI Agent canggih yang akan menemanimu mengeksplore portfolio ini dengan cara yang interaktif dan personal.",
            "Kamu bisa bertanya tentang project, teknologi yang digunakan, atau bahkan proses developmentnya.",
            "Bahkan kamu bisa langsung menghubungi saya lewat chat yang terintegrasi dengan Telegram!",
          ],

          techStack: [
            {
              "src": "/icons/nextjs.webp",
              "label": "Next.js"
            },
            {
              "src": "/icons/geminiAI.png",
              "label": "Gemini AI"
            },
            {
              "src": "/icons/gsap.png",
              "label": "GSAP Animations"
            },
            {
              "src": "/icons/typescript.webp",
              "label": "Typescript"
            },
            {
              "src": "/icons/tailwind.webp",
              "label": "Tailwind"
            },
            
          ],
        },
        {
          id: "myweb2",
          name: "Demo",
          icon: "/icons/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://www.herrywidnyana.com",
          tooltipText: "Lihat demo",
        },
        {
          id: "myweb3",
          name: "Tech Stack",
          projectName: "AI Agent Portfolio",
          icon: "/icons/terminal.png",
          kind: "file",
          fileType: "techstack",
          tooltipText: "Lihat tech stack",
          techStack:[
            {
              category: "Frontend",
              items: ["React.js", "Next.js", "TypeScript"],
            },
            {
              category: "Styling",
              items: ["Tailwind CSS", "CSS"],
            },
            {
              category: "Backend",
              items: ["Gemini AI", "SpreedSheet API"],
            },
            {
              category: "Dev Tools",
              items: ["Git", "GitHub", "Docker"],
            },
          ],
        },
        {
          id: "myweb4",
          name: "preview.png",
          icon: "/icons/image.png",
          kind: "file",
          fileType: "img",
          imageUrl: "/icons/project-2.png",
          tooltipText: "Lihat sample preview",
        },
        {
          id: "myweb5",
          name: "Github",
          icon: "/icons/github.webp",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/herrywidnyana22/myweb",
          tooltipText: "Lihat source",
        },
      ],
    },

    // ▶ Project 3
    {
      id: "project3",
      name: "Livenote",
      icon: "/icons/folder.png",
      subIcon: "/icons/livenote.svg",
      kind: "folder",
      tooltipText: "AI Agent Portfolio",
      children: [
        {
          id: "livenote1",
          name: "README.txt",
          projectName: "LiveNote",
          projectIcon: "/icons/livenote.svg",
          tooltipText: "Lihat detail",
          progressValue: 100,
          icon: "/icons/txt.png",
          kind: "file",
          fileType: "projectInfo",
          description: [
            "Livenote adalah aplikasi catatan real-time yang mendukung berbagi catatan, edit langsung, dan fitur scratch, dengan autentikasi dari Clerk dan backend Convex.",
            "Aplikasi ini memungkinkan pengguna untuk membuat, mengedit, dan berbagi catatan secara kolaboratif dalam waktu nyata.",
            "Fitur scratch memungkinkan pengguna untuk menambahkan catatan cepat tanpa harus membuat dokumen baru.",
            "Dibangun dengan teknologi modern, Livenote menjamin keamanan data pengguna serta performa aplikasi yang optimal.",
          ],

          techStack: [
            {
                "src": "/icons/nextjs.webp",
                "label": "Next.js"
            },
            {
                "src": "/icons/typescript.webp",
                "label": "Typescript"
            },
            {
                "src": "/icons/convex.webp",
                "label": "convex"
            },
            {
                "src": "/icons/clerk.svg",
                "label": "Clerk"
            },
            {
                "src": "/icons/tailwind.webp",
                "label": "TailwindCSS"
            }
          ],
        },
        {
          id: "livenote2",
          name: "Livenote Demo",
          icon: "/icons/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://www.livenote.herrywidnyana.com",
          tooltipText: "Lihat demo",
        },
        {
          id: "livenote3",
          name: "Tech Stack",
          projectName: "Livenote",
          icon: "/icons/terminal.png",
          kind: "file",
          fileType: "techstack",
          tooltipText: "Lihat tech stack",
          techStack:[
            {
              category: "Frontend",
              items: ["React.js", "Next.js", "TypeScript"],
            },
            {
              category: "Styling",
              items: ["Tailwind CSS", "CSS"],
            },
            {
              category: "Backend",
              items: ["Convex", "Clerk"],
            },
            {
              category: "Dev Tools",
              items: ["Git", "GitHub", "Docker"],
            },
          ],
        },
        {
          id: "livenote4",
          name: "preview.png",
          icon: "/icons/image.png",
          kind: "file",
          fileType: "img",
          imageUrl: "/icons/project-2.png",
          tooltipText: "Lihat sample preview",
        },
        {
          id: "livenote5",
          name: "Github",
          icon: "/icons/github.webp",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/herrywidnyana22/livenote",
          tooltipText: "Lihat source",
        },
      ],
    },
    // ▶ Project 4
    {
      id: "project4",
      name: "Real Chat",
      icon: "/icons/folder.png",
      subIcon: "/icons/realchat.png",
      kind: "folder",
      tooltipText: "Real Chat",
      children: [
        {
          id: "realchat1",
          name: "README.txt",
          projectName: "Real Chat",
          projectIcon: "/icons/realchat.png",
          tooltipText: "Lihat detail",
          progressValue: 100,
          icon: "/icons/txt.png",
          kind: "file",
          fileType: "projectInfo",
          description: [
            "Realchat adalah aplikasi chat real-time lengkap dengan sistem autentikasi, dibuat menggunakan Next.js, MongoDB, Prisma, dan Tailwind.",
            "Aplikasi ini memungkinkan pengguna untuk mendaftar, masuk, dan berkomunikasi secara langsung dengan pengguna lain melalui antarmuka yang bersih dan intuitif.",
            "Fitur-fitur seperti obrolan grup, pengiriman pesan instan, dan notifikasi real-time membuat pengalaman berkomunikasi menjadi lancar dan menyenangkan.",
            "Dibangun dengan teknologi modern, Realchat menjamin keamanan data pengguna serta performa aplikasi yang optimal.",
          ],

          techStack: [
            {
              "src": "/icons/nextjs.webp",
              "label": "Next.js"
            },
            {
              "src": "/icons/typescript.webp",
              "label": "Typescript"
            },
            {
              "src": "/icons/prisma.png",
              "label": "Prisma"
            },
            {
              "src": "/icons/mongodb.png",
              "label": "MongoDB"
            },
            {
              "src": "/icons/tailwind.webp",
              "label": "TailwindCSS"
            }
          ],
        },
        {
          id: "realchat2",
          name: "Realchat Demo ",
          icon: "/icons/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://www.realchat.herrywidnyana.com",
          tooltipText: "Lihat demo",
        },
        {
          id: "realchat3",
          name: "Tech Stack",
          projectName: "Realchat",
          icon: "/icons/terminal.png",
          kind: "file",
          fileType: "techstack",
          tooltipText: "Lihat tech stack",
          techStack:[
            {
              category: "Frontend",
              items: ["React.js", "Next.js", "TypeScript"],
            },
            {
              category: "Styling",
              items: ["Tailwind CSS", "CSS"],
            },
            {
              category: "Backend",
              items: ["MongoDB", "Prisma"],
            },
            {
              category: "Dev Tools",
              items: ["Git", "GitHub", "Docker"],
            },
          ],
        },
        {
          id: "realchat4",
          name: "preview.png",
          icon: "/icons/image.png",
          kind: "file",
          fileType: "img",
          imageUrl: "/icons/project-2.png",
          tooltipText: "Lihat sample preview",
        },
        {
          id: "realchat5",
          name: "Github",
          icon: "/icons/github.webp",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/herrywidnyana22/realchat",
          tooltipText: "Lihat source",
        },
      ],
    },
    // ▶ Project 6
    {
      id: "project5",
      name: "My Plant",
      icon: "/icons/folder.png",
      subIcon: "/icons/myplant.png",
      kind: "folder",
      tooltipText: "My Plant Watering System",
      children: [
        {
          id: "myplant1",
          name: "README.txt",
          projectName: "MyPlant",
          projectIcon: "/icons/myplant.png",
          tooltipText: "Lihat detail",
          progressValue: 100,
          icon: "/icons/txt.png",
          kind: "file",
          fileType: "projectInfo",
          description: [
            "Automatic Watering System adalah panduan lengkap untuk membangun sistem penyiraman tanaman otomatis berbasis mikrokontroler dan sensor kelembaban tanah.",
            "Panduan ini mencakup langkah-langkah mulai dari pemilihan komponen, instalasi perangkat keras, hingga pemrograman mikrokontroler untuk mengontrol penyiraman berdasarkan tingkat kelembaban tanah.",
          ],
          techStack: [
            {
              "src": "/icons/nextjs.webp",
              "label": "Next.js"
            },
            {
              "src": "/icons/typescript.webp",
              "label": "Typescript"
            },
            {
              "src": "/icons/arduino.webp",
              "label": "Arduino"
            },
            {
              "src": "/icons/mqtt.png",
              "label": "MQTT"
            },
            {
              "src": "/icons/tailwind.webp",
              "label": "TailwindCSS"
            }
          ],
        },
        {
          id: "myplant2",
          name: "Demo MyPlant",
          icon: "/icons/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://www.myplant.herrywidnyana.com",
          tooltipText: "Lihat demo",
        },
        {
          id: "myplant3",
          name: "Tech Stack",
          projectName: "MyPlant",
          icon: "/icons/terminal.png",
          kind: "file",
          fileType: "techstack",
          tooltipText: "Lihat tech stack",
          techStack:[
            {
              category: "Frontend",
              items: ["React.js", "Next.js", "TypeScript"],
            },
            {
              category: "Styling",
              items: ["Tailwind CSS", "CSS"],
            },
            {
              category: "Backend",
              items: ["MQTT"],
            },
            {
              category: "Hardware",
              items: ["ESP32", "Relay", "Solenoid Valve"],
            },
            {
              category: "Dev Tools",
              items: ["Git", "GitHub", "Docker", "Arduino UNO"],
            },
          ],
        },
        {
          id: "myplant4",
          name: "preview.png",
          icon: "/icons/image.png",
          kind: "file",
          fileType: "img",
          imageUrl: "/icons/project-2.png",
          tooltipText: "Lihat sample preview",
        },
        {
          id: "myplant5",
          name: "Github",
          icon: "/icons/github.webp",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/herrywidnyana22/myplant",
          tooltipText: "Lihat source",
        },
      ],
    },
    // ▶ Project 6
    {
      id: "project6",
      name: "Build VPS",
      icon: "/icons/folder.png",
      subIcon: "/icons/vps.png",
      kind: "folder",
      tooltipText: "Build VPS",
      children: [
        {
          id: "vps1",
          name: "README.txt",
          projectName: "Build VPS",
          projectIcon: "/icons/vps.png",
          tooltipText: "Lihat detail",
          progressValue: 100,
          icon: "/icons/txt.png",
          kind: "file",
          fileType: "projectInfo",
          description: [
            "Build VPS adalah panduan lengkap untuk membangun infrastruktur cloud self-hosted berbasis Docker dan Cloudflare Tunnel — menjalankan banyak aplikasi Next.js secara aman di VPS rumahan.",
            "Panduan ini mencakup langkah-langkah mulai dari pemilihan VPS, instalasi Docker, konfigurasi Cloudflare Tunnel, hingga deployment aplikasi Next.js.",
            "Dengan mengikuti panduan ini, kamu akan dapat mengelola server pribadi yang aman dan efisien, serta memahami konsep dasar cloud computing dan containerization.",
          ],

          techStack: [
            {
              "src": "/icons/ubuntu.webp",
              "label": "Ubuntu Server"
            },
            {
              "src": "/icons/cloudflare.svg",
              "label": "Cloudflared"
            },
            {
              "src": "/icons/docker.webp",
              "label": "Docker"
            }
          ],
        },
        {
          id: "vps2",
          name: "Tech Stack",
          projectName: "Build VPS",
          icon: "/icons/terminal.png",
          kind: "file",
          fileType: "techstack",
          tooltipText: "Lihat tech stack",
          techStack:[
            {
              category: "Server",
              items: ["Ubuntu Server", "Cloudflare"],
            },
            {
              category: "Dev Tools",
              items: ["Git", "Docker"],
            },
          ],
        },
        {
          id: "vps3",
          name: "preview.png",
          icon: "/icons/image.png",
          kind: "file",
          fileType: "img",
          imageUrl: "/icons/project-2.png",
          tooltipText: "Lihat sample preview",
        },
      ],
    },
    // ▶ Project 7
    {
      id: "project7",
      name: "Styling Project",
      icon: "/icons/css.png",
      kind: "folder",
      tooltipText: "Styling Project",
      children: [
        {
          id: "css1",
          name: "Stacking",
          icon: "/icons/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://www.myplant.herrywidnyana.com",
          tooltipText: "Lihat demo",
        },
        {
          id: "css2",
          name: "Stacking",
          icon: "/icons/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://www.myplant.herrywidnyana.com",
          tooltipText: "Lihat demo",
        },
        {
          id: "css3",
          name: "Stacking",
          icon: "/icons/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://www.myplant.herrywidnyana.com",
          tooltipText: "Lihat demo",
        },
      ]
    },
  ],
};

const ABOUT_LOCATION = {
  id: 2,
  type: "about",
  name: "About me",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "me.png",
      icon: "/icons/image.png",
      kind: "file",
      fileType: "img",
      position: "top-10 left-5",
      imageUrl: "/images/profile.webp",
    },
    {
      id: 2,
      name: "casual-me.png",
      icon: "/icons/image.png",
      kind: "file",
      fileType: "img",
      imageUrl: "/icons/adrian-2.jpg",
    },
    {
      id: 3,
      name: "conference-me.png",
      icon: "/icons/image.png",
      kind: "file",
      fileType: "img",
      imageUrl: "/icons/adrian-3.jpeg",
    },
    {
      id: 4,
      name: "about-me.txt",
      icon: "/icons/txt.png",
      kind: "file",
      fileType: "txt",
      subtitle: "Meet the Developer Behind the Code",
      image: "/images/profile.webp",
      description: [
        "Hey! I’m Herry 👋 — I build websites that look good, feel smooth, and actually work",
        "I specialize in JavaScript, React, and Next.js, and I love building things that feel fast, clean, and intuitive.",
        "I’m big on clean UI, good UX, and writing code that doesn’t need a search party to debug.",
        "Outside of work, I’m usually tweaking side projects at midnight, hunting for cool gadgets, or enjoying a good cup of coffee ☕",
      ],
    },
    {
      id: 5,
      name: "Contact",
      icon: "/icons/contact.png",
      kind: "file",
      fileType: "contact",
      tooltipText: "Lihat semua contact"
    },
  ],
};

const RESUME_LOCATION = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/icons/pdf.png",
      kind: "file",
      fileType: "pdf",
      // you can add `href` if you want to open a hosted resume
      // href: "/your/resume/path.pdf",
    },
  ],
};


export const locations = {
  project: PROJECT_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
};

export const INITIAL_Z_INDEX = 1000;

export const WINDOW_CONFIG = {
  explorer: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  contact: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  resume: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  photos: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  txtfile: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  imgfile: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  techstack: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  projectInfo: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
}

export const FONT_WEIGHTS:FontWeightMap  = {
    title: {min: 400, max: 900, base: 400},
    subtitle: {min: 100, max: 400, base: 100},
}

export const SAMPLE_PROJECTS = [
    {
        "type": "project",
        "title": "Portfolio Website",
        "description": "Sebuah portfolio pribadi berbasis Next.js dan Tailwind yang menampilkan project-project serta tulisan blog.",
        "icon": "/icons/logo.webp",
        "iconCategory": [
            {
                "src": "/icons/nextjs.webp",
                "label": "Next.js"
            },
            {
                "src": "/icons/typescript.webp",
                "label": "Typescript"
            },
            {
                "src": "/icons/tailwind.webp",
                "label": "Tailwind"
            }
        ],
        "progressValue": "90",
        "demoLink": "https://herrywidnyana.com",
        "githubLink": "https://github.com/herrywidnyana22/myweb"
    },
    {
        "type": "project",
        "title": "Mydrive",
        "description": "Aplikasi penyimpanan berbasis cloud yang menyediakan upload, berbagi, dan pengelolaan file — dibuat dengan Next.js dan Appwrite",
        "icon": "/icons/mydrive-logo.svg",
        "iconCategory": [
            {
                "src": "/icons/nextjs.webp",
                "label": "Next.js"
            },
            {
                "src": "/icons/typescript.webp",
                "label": "Typescript"
            },
            {
                "src": "/icons/appwrite.svg",
                "label": "Appwrite"
            },
            {
                "src": "/icons/tailwind.webp",
                "label": "TailwindCSS"
            }
        ],
        "progressValue": "99",
        "demoLink": "https://mydrive.herrywidnyana.com",
        "githubLink": "https://github.com/herrywidnyana22/mydrive"
    },
    {
        "type": "project",
        "title": "Real Chat",
        "description": "Aplikasi chat real-time lengkap dengan sistem autentikasi, dibuat menggunakan Next.js, MongoDB, Prisma, dan Tailwind.",
        "icon": "/icons/realchat.png",
        "iconCategory": [
            {
                "src": "/icons/nextjs.webp",
                "label": "Next.js"
            },
            {
                "src": "/icons/typescript.webp",
                "label": "Typescript"
            },
            {
                "src": "/icons/prisma.png",
                "label": "Prisma"
            },
            {
                "src": "/icons/mongodb.png",
                "label": "MongoDB"
            },
            {
                "src": "/icons/tailwind.webp",
                "label": "TailwindCSS"
            }
        ],
        "progressValue": "95",
        "demoLink": "https://mychat.herrywidnyana.com",
        "githubLink": "https://github.com/herrywidnyana22/realchat"
    },
    {
        "type": "project",
        "title": "Livenote",
        "description": "Aplikasi catatan real-time yang mendukung berbagi catatan, edit langsung, dan fitur scratch, dengan autentikasi dari Clerk dan backend Convex",
        "icon": "/icons/livenote.svg",
        "iconCategory": [
            {
                "src": "/icons/nextjs.webp",
                "label": "Next.js"
            },
            {
                "src": "/icons/typescript.webp",
                "label": "Typescript"
            },
            {
                "src": "/icons/convex.webp",
                "label": "convex"
            },
            {
                "src": "/icons/clerk.svg",
                "label": "Clerk"
            },
            {
                "src": "/icons/tailwind.webp",
                "label": "TailwindCSS"
            }
        ],
        "progressValue": "90",
        "demoLink": "https://livenote.herrywidnyana.com",
        "githubLink": "https://github.com/herrywidnyana22/livenote"
    },
    {
        "type": "project",
        "title": "Build VPS",
        "description": "Membangun infrastruktur cloud self-hosted berbasis Docker dan Cloudflare Tunnel — menjalankan banyak aplikasi Next.js secara aman di VPS rumahan",
        "icon": "/icons/vps.png",
        "iconCategory": [
            {
                "src": "/icons/ubuntu.webp",
                "label": "Ubuntu Server"
            },
            {
                "src": "/icons/cloudflare.svg",
                "label": "Cloudflared"
            },
            {
                "src": "/icons/docker.webp",
                "label": "Docker"
            }
        ],
        "progressValue": "100",
        "demoLink": "https://herrywidnyana.com",
        "githubLink": "https://herrywidnyana.com"
    }
]
