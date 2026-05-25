export const COLOMBIA: Record<string, string[]> = {
  'Amazonas': ['Leticia', 'Puerto Nariño'],
  'Antioquia': ['Medellín', 'Bello', 'Envigado', 'Itagüí', 'Apartadó', 'Turbo', 'Rionegro', 'Caucasia', 'Sabaneta', 'La Estrella'],
  'Arauca': ['Arauca', 'Arauquita', 'Saravena', 'Tame'],
  'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Galapa', 'Puerto Colombia'],
  'Bogotá D.C.': ['Bogotá D.C.'],
  'Bolívar': ['Cartagena', 'Magangué', 'El Carmen de Bolívar', 'Mompós', 'Turbaco'],
  'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 'Moniquirá'],
  'Caldas': ['Manizales', 'Villamaría', 'La Dorada', 'Chinchiná', 'Riosucio', 'Aguadas'],
  'Caquetá': ['Florencia', 'San Vicente del Caguán', 'Puerto Rico'],
  'Casanare': ['Yopal', 'Aguazul', 'Villanueva', 'Tauramena', 'Paz de Ariporo'],
  'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Miranda', 'Patía'],
  'Cesar': ['Valledupar', 'Aguachica', 'Codazzi', 'La Jagua de Ibirico', 'Bosconia'],
  'Chocó': ['Quibdó', 'Istmina', 'Riosucio'],
  'Córdoba': ['Montería', 'Cereté', 'Lorica', 'Montelíbano', 'Sahagún', 'Tierralta'],
  'Cundinamarca': ['Soacha', 'Facatativá', 'Zipaquirá', 'Fusagasugá', 'Chía', 'Mosquera', 'Madrid', 'Girardot', 'Cajicá'],
  'Guainía': ['Inírida'],
  'Guaviare': ['San José del Guaviare', 'El Retorno'],
  'Huila': ['Neiva', 'Pitalito', 'La Plata', 'Garzón', 'Campoalegre'],
  'La Guajira': ['Riohacha', 'Maicao', 'Uribia', 'Villanueva', 'Fonseca'],
  'Magdalena': ['Santa Marta', 'Ciénaga', 'El Banco', 'Fundación', 'Plato'],
  'Meta': ['Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'Cumaral'],
  'Nariño': ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres', 'La Unión'],
  'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario', 'Los Patios', 'El Zulia'],
  'Putumayo': ['Mocoa', 'Puerto Asís', 'Orito', 'Villagarzón'],
  'Quindío': ['Armenia', 'Calarcá', 'Montenegro', 'Quimbaya', 'La Tebaida'],
  'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia', 'Marsella'],
  'San Andrés y Providencia': ['San Andrés', 'Providencia'],
  'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Barrancabermeja', 'Piedecuesta', 'Lebrija', 'Socorro'],
  'Sucre': ['Sincelejo', 'Corozal', 'Sampués', 'San Marcos', 'Tolú'],
  'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda', 'Mariquita', 'Líbano'],
  'Valle del Cauca': ['Cali', 'Buenaventura', 'Palmira', 'Buga', 'Tuluá', 'Cartago', 'Jamundí', 'Florida'],
  'Vaupés': ['Mitú'],
  'Vichada': ['Puerto Carreño', 'La Primavera'],
}

export const DEPARTAMENTOS = Object.keys(COLOMBIA).sort()

export function getMunicipios(departamento: string): string[] {
  return COLOMBIA[departamento] ?? []
}
