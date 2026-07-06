// Datos que se cargan la PRIMERA vez que la base está vacía
export const SEED = {
  "users": [
    {
      "id": "u-admin",
      "name": "Administración",
      "username": "admin",
      "password": "splash2026",
      "role": "admin",
      "active": true
    },
    {
      "id": "u-ferm",
      "name": "Fer Montero",
      "username": "ferm",
      "password": "ferm2026",
      "role": "profe",
      "active": true
    },
    {
      "id": "u-julianb",
      "name": "Julián",
      "username": "julianb",
      "password": "julianb2026",
      "role": "profe",
      "active": true
    }
  ],
  "activities": [
    {
      "id": "act-bi",
      "name": "Básquet infantil",
      "profeId": "u-ferm",
      "schedules": [
        {
          "id": "h-bi-1",
          "label": "Lunes 17:30 hs"
        },
        {
          "id": "h-bi-2",
          "label": "Miércoles 17:30 hs"
        }
      ]
    },
    {
      "id": "act-fi",
      "name": "Fútbol infantil",
      "profeId": "u-ferm",
      "schedules": [
        {
          "id": "h-fi-1",
          "label": "Lunes 18:30 hs"
        },
        {
          "id": "h-fi-2",
          "label": "Miércoles 18:30 hs"
        }
      ]
    },
    {
      "id": "act-id",
      "name": "Iniciación deportiva",
      "profeId": "u-ferm",
      "schedules": [
        {
          "id": "h-id-1",
          "label": "Martes 17:30 hs"
        },
        {
          "id": "h-id-2",
          "label": "Jueves 17:30 hs"
        }
      ]
    },
    {
      "id": "act-ba",
      "name": "Básquet adultos",
      "profeId": "u-ferm",
      "schedules": [
        {
          "id": "h-ba-1",
          "label": "Jueves 18:30 hs"
        }
      ]
    },
    {
      "id": "act-va",
      "name": "Vóley adultos",
      "profeId": "u-julianb",
      "schedules": [
        {
          "id": "h-va-1",
          "label": "Martes 18:30 hs"
        },
        {
          "id": "h-va-2",
          "label": "Viernes 18:30 hs"
        }
      ]
    },
    {
      "id": "act-ff",
      "name": "Fútbol femenino",
      "profeId": "u-julianb",
      "schedules": [
        {
          "id": "h-ff-1",
          "label": "Viernes 17:30 hs"
        }
      ]
    }
  ],
  "students": {
    "h-bi-1": [
      {
        "nombre": "Harris Juan Ignacio",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-1"
      },
      {
        "nombre": "Aseff Daniel",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-2"
      },
      {
        "nombre": "Ruival Frade Ulises",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-3"
      }
    ],
    "h-bi-2": [
      {
        "nombre": "Harris Juan Ignacio",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-4"
      },
      {
        "nombre": "Bautista Kubis",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-5"
      },
      {
        "nombre": "Aseff Daniel",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-6"
      }
    ],
    "h-fi-1": [
      {
        "nombre": "Ramiro De La Calle",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-7"
      },
      {
        "nombre": "Bonicontro Lucas Tato",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-8"
      },
      {
        "nombre": "Contreras Leonel",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-9"
      },
      {
        "nombre": "Contreras Lautaro",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-10"
      },
      {
        "nombre": "Schwarzbock Justo",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-11"
      },
      {
        "nombre": "Nahuel Flores",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-12"
      },
      {
        "nombre": "Helena De La Calle",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-13"
      }
    ],
    "h-fi-2": [
      {
        "nombre": "Ramiro De La Calle",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-14"
      },
      {
        "nombre": "Bonicontro Lucas Tato",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-15"
      },
      {
        "nombre": "Bautista Kubis Gallardo",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-16"
      },
      {
        "nombre": "Schwarzbock Justo",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-17"
      },
      {
        "nombre": "Nahuel Flores",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-18"
      },
      {
        "nombre": "Helena De La Calle",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-19"
      }
    ],
    "h-id-1": [
      {
        "nombre": "Juan Martín Costa",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-20"
      },
      {
        "nombre": "Valentino Rejas",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-21"
      },
      {
        "nombre": "Clochette Lara",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-22"
      },
      {
        "nombre": "Felipe Ponso",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-23"
      }
    ],
    "h-id-2": [
      {
        "nombre": "Juan Martín Costa",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-24"
      },
      {
        "nombre": "Valentino Rejas",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-25"
      },
      {
        "nombre": "Clochette Lara",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-26"
      }
    ],
    "h-ba-1": [
      {
        "nombre": "Alan Schwartz",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-27"
      },
      {
        "nombre": "Braen Caminoa",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-28"
      }
    ],
    "h-va-1": [
      {
        "nombre": "Barrios Gladys",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-29"
      },
      {
        "nombre": "Alfonso Myrna",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-30"
      },
      {
        "nombre": "Calfuqueo Andrea",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-31"
      },
      {
        "nombre": "Priscila Sushin",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-32"
      },
      {
        "nombre": "Ocampo Natalia",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-33"
      },
      {
        "nombre": "Perisse M Celeste",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-34"
      },
      {
        "nombre": "Vives Sofía",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-35"
      },
      {
        "nombre": "Cuello Manuel",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-36"
      },
      {
        "nombre": "González Florencia",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-37"
      },
      {
        "nombre": "Marco Liliana",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-38"
      },
      {
        "nombre": "Lospéñato Andrea",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-39"
      },
      {
        "nombre": "Solari Paula",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-40"
      },
      {
        "nombre": "Paola Albe",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-41"
      },
      {
        "nombre": "Isnardi Carolina",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-42"
      }
    ],
    "h-va-2": [
      {
        "nombre": "Barrios Gladys",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-43"
      },
      {
        "nombre": "Alfonso Myrna",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-44"
      },
      {
        "nombre": "Calfuqueo Andrea",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-45"
      },
      {
        "nombre": "Priscila Sushin",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-46"
      },
      {
        "nombre": "Ocampo Natalia",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-47"
      },
      {
        "nombre": "Martinet Amparo",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-48"
      },
      {
        "nombre": "Vives Sofía",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-49"
      },
      {
        "nombre": "Cuello Manuel",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-50"
      },
      {
        "nombre": "Sadaba Elizabeth",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-51"
      },
      {
        "nombre": "González Florencia",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-52"
      },
      {
        "nombre": "Lospéñato Andrea",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-53"
      },
      {
        "nombre": "Solari Paula",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-54"
      },
      {
        "nombre": "Paola Albe",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-55"
      },
      {
        "nombre": "Isnardi Carolina",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-56"
      },
      {
        "nombre": "Frigerio María Eugenia",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-57"
      },
      {
        "nombre": "Fresno Navarro Lucía",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-58"
      },
      {
        "nombre": "Piorno Alicia",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-59"
      },
      {
        "nombre": "Butaffuoco Mirella",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-60"
      },
      {
        "nombre": "Schwartz Lozada Alan",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-61"
      },
      {
        "nombre": "Perisse M Celeste",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-62"
      },
      {
        "nombre": "Marco Liliana",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-63"
      }
    ],
    "h-ff-1": [
      {
        "nombre": "González Yaqueline",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-64"
      },
      {
        "nombre": "Tognetti Celia",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-65"
      },
      {
        "nombre": "Lucía Higuera",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-66"
      },
      {
        "nombre": "Raquinqueo Magali",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-67"
      },
      {
        "nombre": "Arias Ana Lucía",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-68"
      },
      {
        "nombre": "Patricia Mancado",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-69"
      },
      {
        "nombre": "Mariscal Mariel",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-70"
      },
      {
        "nombre": "Zubieta Higina Andrea",
        "apellido": "",
        "dni": "",
        "tel": "",
        "active": true,
        "alta": "2026-07-05",
        "baja": null,
        "id": "s-pre-71"
      }
    ]
  },
  "attendance": {}
};
