/**
 * Ghana Schools Database
 * Comprehensive list of JHS/Basic Schools across Ghana
 */

export interface School {
  id: string;
  name: string;
  type: 'JHS' | 'SHS' | 'Private' | 'Islamic' | 'International' | 'Basic';
  region: string;
  district?: string;
  town?: string;
  verified: boolean;
  studentCount: number;
  logo?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
  founded?: number;
  motto?: string;
}

export const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Eastern',
  'Central',
  'Northern',
  'Upper East',
  'Upper West',
  'Volta',
  'Bono',
  'Bono East',
  'Ahafo',
  'Oti',
  'Savannah',
  'North East',
  'Western North',
] as const;

export type GhanaRegion = typeof GHANA_REGIONS[number];

// Top 100+ Ghana Schools Database
export const GHANA_SCHOOLS: School[] = [
  // Greater Accra Region
  {
    id: 'achimota-school',
    name: 'Achimota School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Achimota',
    verified: true,
    studentCount: 0,
    colors: { primary: '#006400', secondary: '#FFD700' },
    founded: 1927,
    motto: 'Ut Omnes Unum Sint'
  },
  {
    id: 'presec-legon',
    name: 'Presbyterian Boys\' Secondary School (Presec Legon)',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Legon',
    verified: true,
    studentCount: 0,
    colors: { primary: '#000080', secondary: '#FFFFFF' },
    founded: 1938,
    motto: 'Nihil Sine Labore'
  },
  {
    id: 'wesley-girls',
    name: 'Wesley Girls\' High School',
    type: 'SHS',
    region: 'Central',
    district: 'Cape Coast',
    town: 'Cape Coast',
    verified: true,
    studentCount: 0,
    colors: { primary: '#800080', secondary: '#FFFFFF' },
    founded: 1836,
    motto: 'Wise Unto Salvation'
  },
  {
    id: 'mfantsipim',
    name: 'Mfantsipim School',
    type: 'SHS',
    region: 'Central',
    district: 'Cape Coast',
    town: 'Cape Coast',
    verified: true,
    studentCount: 0,
    colors: { primary: '#0000FF', secondary: '#FFFFFF' },
    founded: 1876,
    motto: 'Dwen Hwe Kan'
  },
  {
    id: 'holy-child',
    name: 'Holy Child School',
    type: 'SHS',
    region: 'Central',
    district: 'Cape Coast',
    town: 'Cape Coast',
    verified: true,
    studentCount: 0,
    colors: { primary: '#800000', secondary: '#FFD700' },
    founded: 1946,
    motto: 'Holiness is Wholeness'
  },
  {
    id: 'adisadel',
    name: 'Adisadel College',
    type: 'SHS',
    region: 'Central',
    district: 'Cape Coast',
    town: 'Cape Coast',
    verified: true,
    studentCount: 0,
    colors: { primary: '#008000', secondary: '#FFD700' },
    founded: 1910,
    motto: 'Fidelis et Fortis'
  },
  {
    id: 'opoku-ware',
    name: 'Opoku Ware School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Santasi',
    verified: true,
    studentCount: 0,
    colors: { primary: '#FF0000', secondary: '#FFFFFF' },
    founded: 1952,
    motto: 'Virtute Et Scientia'
  },
  {
    id: 'prempeh-college',
    name: 'Prempeh College',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Kumasi',
    verified: true,
    studentCount: 0,
    colors: { primary: '#000000', secondary: '#FFD700' },
    founded: 1949,
    motto: 'Prepared To Serve'
  },
  {
    id: 'yaa-asantewaa',
    name: 'Yaa Asantewaa Girls\' SHS',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Tanoso',
    verified: true,
    studentCount: 0,
    colors: { primary: '#800080', secondary: '#FFFFFF' },
    founded: 1960,
    motto: 'Knowledge and Service'
  },
  {
    id: 'st-louis',
    name: 'St. Louis Secondary School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Kumasi',
    verified: true,
    studentCount: 0,
    colors: { primary: '#0000FF', secondary: '#FFFFFF' },
    founded: 1952,
    motto: 'Purity and Discipline'
  },
  
  // Greater Accra SHS Schools (continued)
  {
    id: 'accra-academy',
    name: 'Accra Academy',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Bubuashie',
    verified: true,
    studentCount: 0,
    colors: { primary: '#800000', secondary: '#FFD700' }
  },
  {
    id: 'accra-girls',
    name: 'Accra Girls Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Maamobi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'st-thomas-aquinas',
    name: 'St. Thomas Aquinas Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Cantonments',
    verified: true,
    studentCount: 0,
    colors: { primary: '#0000CD', secondary: '#FFFFFF' }
  },
  {
    id: 'labone-shs',
    name: 'Labone Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Labone',
    verified: true,
    studentCount: 0
  },
  {
    id: 'tema-shs',
    name: 'Tema Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Tema',
    town: 'Tema Community 5',
    verified: true,
    studentCount: 0
  },
  {
    id: 'ghanata-shs',
    name: 'Ghanata Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Shai-Osudoku',
    town: 'Dodowa',
    verified: true,
    studentCount: 0,
    motto: 'Excellence through Discipline'
  },
  {
    id: 'west-africa-shs',
    name: 'West Africa Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Ga East',
    town: 'Adenta',
    verified: true,
    studentCount: 0
  },
  {
    id: 'madina-shs',
    name: 'Madina Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Ga East',
    town: 'Madina',
    verified: true,
    studentCount: 0
  },
  {
    id: 'oreilly-shs',
    name: 'O\'Reilly Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Teshie',
    verified: true,
    studentCount: 0
  },
  {
    id: 'odorgonno-shs',
    name: 'Odorgonno Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Awoshie',
    verified: true,
    studentCount: 0
  },
  {
    id: 'dansoman-shs',
    name: 'Dansoman Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Dansoman',
    verified: true,
    studentCount: 0
  },
  {
    id: 'ebenezer-shs',
    name: 'Ebenezer Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Dansoman',
    verified: true,
    studentCount: 0
  },
  {
    id: 'nungua-shs',
    name: 'Nungua Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Nungua',
    verified: true,
    studentCount: 0
  },
  {
    id: 'ashiaman-shs',
    name: 'Ashiaman Senior High School',
    type: 'SHS',
    region: 'Greater Accra',
    district: 'Tema',
    town: 'Ashaiman',
    verified: true,
    studentCount: 0
  },
  
  // Ashanti Region SHS Schools (continued)
  {
    id: 'kumasi-academy',
    name: 'Kumasi Academy',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Asokore Mampong',
    verified: true,
    studentCount: 0,
    colors: { primary: '#4B0082', secondary: '#FFD700' }
  },
  {
    id: 'kumasi-girls',
    name: 'Kumasi Girls Senior High School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Abrepo',
    verified: true,
    studentCount: 0
  },
  {
    id: 'kumasi-high',
    name: 'Kumasi High School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Atonsu Gyenase',
    verified: true,
    studentCount: 0
  },
  {
    id: 'kumasi-shs-technical',
    name: 'Kumasi Senior High Technical School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Patasi',
    verified: true,
    studentCount: 0,
    motto: 'Animuonyamfo'
  },
  {
    id: 'osei-kyeretwie',
    name: 'Osei Kyeretwie Senior High School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Old Tafo',
    verified: true,
    studentCount: 0
  },
  {
    id: 'asanteman-shs',
    name: 'Asanteman Senior High School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Bantama',
    verified: true,
    studentCount: 0,
    motto: 'The Royals'
  },
  {
    id: 'st-monica-shs',
    name: 'St. Monica\'s Senior High School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Sekyere West',
    town: 'Mampong',
    verified: true,
    studentCount: 0
  },
  {
    id: 'konongo-odumase-shs',
    name: 'Konongo Odumase Senior High School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Asante Akim',
    town: 'Konongo-Odumase',
    verified: true,
    studentCount: 0
  },
  {
    id: 'agogo-state-college',
    name: 'Agogo State College',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Asante Akim North',
    town: 'Agogo',
    verified: true,
    studentCount: 0
  },
  {
    id: 'osei-tutu-shs',
    name: 'Osei Tutu Senior High School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Atwima Nwabiagya',
    town: 'Akropong',
    verified: true,
    studentCount: 0
  },
  {
    id: 'simms-shs',
    name: 'Simms Senior High School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Kwabre',
    town: 'Fawoade',
    verified: true,
    studentCount: 0
  },
  {
    id: 'juaben-shs',
    name: 'Juaben Senior High School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Ejisu-Juaben',
    town: 'Juaben',
    verified: true,
    studentCount: 0
  },
  {
    id: 'tepa-shs',
    name: 'Tepa Senior High School',
    type: 'SHS',
    region: 'Ashanti',
    district: 'Ahafo Ano North',
    town: 'Tepa',
    verified: true,
    studentCount: 0
  },
  
  // Central Region SHS Schools (continued)
  {
    id: 'ghana-national-college',
    name: 'Ghana National College',
    type: 'SHS',
    region: 'Central',
    district: 'Cape Coast',
    town: 'Cape Coast',
    verified: true,
    studentCount: 0,
    colors: { primary: '#FF4500', secondary: '#000000' }
  },
  {
    id: 'st-augustines-college',
    name: 'Saint Augustine\'s College',
    type: 'SHS',
    region: 'Central',
    district: 'Cape Coast',
    town: 'Cape Coast',
    verified: true,
    studentCount: 0,
    colors: { primary: '#006400', secondary: '#FFD700' }
  },
  {
    id: 'aggrey-memorial',
    name: 'Aggrey Memorial A.M.E Zion Senior High School',
    type: 'SHS',
    region: 'Central',
    district: 'Cape Coast',
    town: 'Cape Coast',
    verified: true,
    studentCount: 0
  },
  {
    id: 'mfantsiman-girls',
    name: 'Mfantsiman Girls\' Secondary School',
    type: 'SHS',
    region: 'Central',
    district: 'Mfantsiman',
    town: 'Saltpond',
    verified: true,
    studentCount: 0
  },
  {
    id: 'saltpond-methodist',
    name: 'Saltpond Methodist High School',
    type: 'SHS',
    region: 'Central',
    district: 'Mfantsiman',
    town: 'Saltpond',
    verified: true,
    studentCount: 0
  },
  {
    id: 'winneba-shs',
    name: 'Winneba Senior High School',
    type: 'SHS',
    region: 'Central',
    district: 'Effutu',
    town: 'Winneba',
    verified: true,
    studentCount: 0
  },
  {
    id: 'swedru-shs',
    name: 'Swedru Senior High School',
    type: 'SHS',
    region: 'Central',
    district: 'Agona',
    town: 'Swedru',
    verified: true,
    studentCount: 0
  },
  {
    id: 'apam-shs',
    name: 'Apam Senior High School',
    type: 'SHS',
    region: 'Central',
    district: 'Gomoa',
    town: 'Apam',
    verified: true,
    studentCount: 0
  },
  {
    id: 'mankesim-shs',
    name: 'Mankesim Senior High School',
    type: 'SHS',
    region: 'Central',
    district: 'Mfantsiman',
    town: 'Mankesim',
    verified: true,
    studentCount: 0
  },
  {
    id: 'komenda-shs',
    name: 'Komenda Senior High School',
    type: 'SHS',
    region: 'Central',
    district: 'Komenda-Edina-Eguafo-Abirem',
    town: 'Komenda',
    verified: true,
    studentCount: 0
  },
  
  // Eastern Region SHS Schools
  {
    id: 'pope-john-shs',
    name: 'Pope John Senior High School and Minor Seminary',
    type: 'SHS',
    region: 'Eastern',
    district: 'New-Juaben',
    town: 'Koforidua',
    verified: true,
    studentCount: 0,
    colors: { primary: '#8B0000', secondary: '#FFFFFF' }
  },
  {
    id: 'ghana-shs-koforidua',
    name: 'Ghana Senior High School, Koforidua',
    type: 'SHS',
    region: 'Eastern',
    district: 'New-Juaben',
    town: 'Koforidua',
    verified: true,
    studentCount: 0
  },
  {
    id: 'koforidua-shs',
    name: 'Koforidua Senior High School',
    type: 'SHS',
    region: 'Eastern',
    district: 'New-Juaben',
    town: 'Koforidua',
    verified: true,
    studentCount: 0
  },
  {
    id: 'presby-boys-mampong',
    name: 'Presbyterian Senior High School, Akuapim-Mampong',
    type: 'SHS',
    region: 'Eastern',
    district: 'Akuapim North',
    town: 'Akuapim-Mampong',
    verified: true,
    studentCount: 0
  },
  {
    id: 'aburi-girls',
    name: 'Aburi Girls\' Senior High School',
    type: 'SHS',
    region: 'Eastern',
    district: 'Akuapim South',
    town: 'Aburi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'oda-shs',
    name: 'Oda Senior High School',
    type: 'SHS',
    region: 'Eastern',
    district: 'Birim Central',
    town: 'Akim Oda',
    verified: true,
    studentCount: 0
  },
  {
    id: 'akim-swedru-shs',
    name: 'Akim Swedru Senior High School',
    type: 'SHS',
    region: 'Eastern',
    district: 'Birim South',
    town: 'Akim Swedru',
    verified: true,
    studentCount: 0,
    motto: 'Star of the East'
  },
  {
    id: 'abuakwa-state-college',
    name: 'Abuakwa State College',
    type: 'SHS',
    region: 'Eastern',
    district: 'East Akim',
    town: 'Kibi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'ofori-panin-shs',
    name: 'Ofori Panin Senior High School',
    type: 'SHS',
    region: 'Eastern',
    district: 'East Akim',
    town: 'Kukurantumi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'mpraeso-shs',
    name: 'Mpraeso Senior High School',
    type: 'SHS',
    region: 'Eastern',
    district: 'Kwahu South',
    town: 'Mpraeso',
    verified: true,
    studentCount: 0
  },
  {
    id: 'abetifi-presby',
    name: 'Abetifi Presbyterian Senior High School',
    type: 'SHS',
    region: 'Eastern',
    district: 'Kwahu East',
    town: 'Abetifi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'nkwatia-shs',
    name: 'Nkwatia Senior High School',
    type: 'SHS',
    region: 'Eastern',
    district: 'Kwahu East',
    town: 'Nkwatia Kwahu',
    verified: true,
    studentCount: 0
  },
  {
    id: 'krobo-girls',
    name: 'Krobo Girls\' Senior High School',
    type: 'SHS',
    region: 'Eastern',
    district: 'Manya Krobo',
    town: 'Odumase Krobo',
    verified: true,
    studentCount: 0
  },
  {
    id: 'nsawam-shs',
    name: 'Nsawam Senior High School',
    type: 'SHS',
    region: 'Eastern',
    district: 'Akuapim South',
    town: 'Nsawam',
    verified: true,
    studentCount: 0
  },
  
  // Western Region SHS Schools
  {
    id: 'st-johns-shs',
    name: 'St John\'s Senior High School',
    type: 'SHS',
    region: 'Western',
    district: 'Sekondi-Takoradi',
    town: 'Sekondi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'sekondi-college',
    name: 'Sekondi College',
    type: 'SHS',
    region: 'Western',
    district: 'Sekondi-Takoradi',
    town: 'Sekondi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'takoradi-shs',
    name: 'Takoradi Senior High School',
    type: 'SHS',
    region: 'Western',
    district: 'Sekondi-Takoradi',
    town: 'Takoradi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'fijai-shs',
    name: 'Fijai Senior High School',
    type: 'SHS',
    region: 'Western',
    district: 'Sekondi-Takoradi',
    town: 'Fijai',
    verified: true,
    studentCount: 0
  },
  {
    id: 'archbishop-porter-girls',
    name: 'Archbishop Porter Girls Senior High School',
    type: 'SHS',
    region: 'Western',
    district: 'Sekondi-Takoradi',
    town: 'Sekondi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'tarkwa-shs',
    name: 'Tarkwa Senior High School',
    type: 'SHS',
    region: 'Western',
    district: 'Tarkwa-Nsuaem',
    town: 'Tarkwa',
    verified: true,
    studentCount: 0
  },
  {
    id: 'st-augustines-bogoso',
    name: 'St. Augustine\'s Senior High School',
    type: 'SHS',
    region: 'Western',
    district: 'Prestea Huni Valley',
    town: 'Bogoso',
    verified: true,
    studentCount: 0
  },
  {
    id: 'half-assini-shs',
    name: 'Half Assini Senior High School',
    type: 'SHS',
    region: 'Western',
    district: 'Jomoro',
    town: 'Half Assini',
    verified: true,
    studentCount: 0
  },
  {
    id: 'axim-girls',
    name: 'Axim Girls Senior High School',
    type: 'SHS',
    region: 'Western',
    district: 'Nzema East',
    town: 'Axim',
    verified: true,
    studentCount: 0
  },
  
  // Northern Region SHS Schools
  {
    id: 'tamale-shs',
    name: 'Tamale Senior High School',
    type: 'SHS',
    region: 'Northern',
    district: 'Tamale',
    town: 'Tamale',
    verified: true,
    studentCount: 0,
    motto: 'Tamasco'
  },
  {
    id: 'ghana-shs-tamale',
    name: 'Ghana Senior High School, Tamale',
    type: 'SHS',
    region: 'Northern',
    district: 'Tamale',
    town: 'Tamale',
    verified: true,
    studentCount: 0
  },
  {
    id: 'tamale-girls-shs',
    name: 'Tamale Girls Senior High School',
    type: 'SHS',
    region: 'Northern',
    district: 'Tamale',
    town: 'Tamale',
    verified: true,
    studentCount: 0
  },
  {
    id: 'business-shs-tamale',
    name: 'Business Senior High School, Tamale',
    type: 'SHS',
    region: 'Northern',
    district: 'Tamale',
    town: 'Tamale',
    verified: true,
    studentCount: 0
  },
  {
    id: 'damongo-shs',
    name: 'Damongo Senior High School',
    type: 'SHS',
    region: 'Northern',
    district: 'West Gonja',
    town: 'Damongo',
    verified: true,
    studentCount: 0
  },
  {
    id: 'bole-shs',
    name: 'Bole Senior High School',
    type: 'SHS',
    region: 'Northern',
    district: 'West Gonja',
    town: 'Bole',
    verified: true,
    studentCount: 0
  },
  {
    id: 'yendi-shs',
    name: 'Yendi Senior High School',
    type: 'SHS',
    region: 'Northern',
    district: 'Yendi',
    town: 'Yendi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'savelugu-shs',
    name: 'Savelugu Senior High School',
    type: 'SHS',
    region: 'Northern',
    district: 'Savelugu-Nanton',
    town: 'Savelugu',
    verified: true,
    studentCount: 0
  },
  {
    id: 'salaga-shs',
    name: 'Salaga Senior High School',
    type: 'SHS',
    region: 'Northern',
    district: 'East Gonja',
    town: 'Salaga',
    verified: true,
    studentCount: 0
  },
  {
    id: 'walewale-shs',
    name: 'Walewale Senior High Technical School',
    type: 'SHS',
    region: 'Northern',
    district: 'West Mamprusi',
    town: 'Walewale',
    verified: true,
    studentCount: 0
  },
  
  // Volta Region SHS Schools
  {
    id: 'mawuli-school',
    name: 'Mawuli School',
    type: 'SHS',
    region: 'Volta',
    district: 'Ho',
    town: 'Ho',
    verified: true,
    studentCount: 0,
    colors: { primary: '#008000', secondary: '#FFD700' }
  },
  {
    id: 'mawuko-girls',
    name: 'E.P.Church Mawuko Girls Senior High School',
    type: 'SHS',
    region: 'Volta',
    district: 'Ho',
    town: 'Ho',
    verified: true,
    studentCount: 0
  },
  {
    id: 'ola-girls-ho',
    name: 'OLA Girls Senior High School, Ho',
    type: 'SHS',
    region: 'Volta',
    district: 'Ho',
    town: 'Ho',
    verified: true,
    studentCount: 0
  },
  {
    id: 'st-prosper-college',
    name: 'Saint Prosper\'s College',
    type: 'SHS',
    region: 'Volta',
    district: 'Ho',
    town: 'Ho',
    verified: true,
    studentCount: 0
  },
  {
    id: 'ketasco',
    name: 'Keta Senior High Technical School',
    type: 'SHS',
    region: 'Volta',
    district: 'Keta',
    town: 'Keta',
    verified: true,
    studentCount: 0
  },
  {
    id: 'anlo-shs',
    name: 'Anlo Senior High School',
    type: 'SHS',
    region: 'Volta',
    district: 'Keta',
    town: 'Anloga',
    verified: true,
    studentCount: 0
  },
  {
    id: 'zion-college',
    name: 'Zion College',
    type: 'SHS',
    region: 'Volta',
    district: 'Keta',
    town: 'Anloga',
    verified: true,
    studentCount: 0
  },
  {
    id: 'some-shs',
    name: 'Some Senior High School',
    type: 'SHS',
    region: 'Volta',
    district: 'Ketu South',
    town: 'Agbozume',
    verified: true,
    studentCount: 0
  },
  {
    id: 'st-pauls-aflao',
    name: 'St. Paul\'s Senior High School, Aflao',
    type: 'SHS',
    region: 'Volta',
    district: 'Ketu South',
    town: 'Hatsukope/Aflao',
    verified: true,
    studentCount: 0
  },
  {
    id: 'kpando-shs',
    name: 'Kpando Senior High School',
    type: 'SHS',
    region: 'Volta',
    district: 'Kpando',
    town: 'Kpandu',
    verified: true,
    studentCount: 0
  },
  {
    id: 'bishop-herman-college',
    name: 'Bishop Herman College',
    type: 'SHS',
    region: 'Volta',
    district: 'Kpando',
    town: 'Kpandu',
    verified: true,
    studentCount: 0
  },
  {
    id: 'peki-shs',
    name: 'Peki Senior High School',
    type: 'SHS',
    region: 'Volta',
    district: 'South Dayi',
    town: 'Peki',
    verified: true,
    studentCount: 0
  },
  {
    id: 'sogakope-shs',
    name: 'Sogakope Senior High School',
    type: 'SHS',
    region: 'Volta',
    district: 'South Tongu',
    town: 'Sogakope',
    verified: true,
    studentCount: 0
  },
  {
    id: 'hohoe-ep-shs',
    name: 'E.P. Senior High School, Hohoe',
    type: 'SHS',
    region: 'Volta',
    district: 'Hohoe',
    town: 'Hohoe',
    verified: true,
    studentCount: 0
  },
  
  // Upper East Region SHS Schools
  {
    id: 'bolgatanga-shs',
    name: 'Bolgatanga Senior High School',
    type: 'SHS',
    region: 'Upper East',
    district: 'Bolgatanga',
    town: 'Bolgatanga',
    verified: true,
    studentCount: 0
  },
  {
    id: 'bolgatanga-girls',
    name: 'Bolgatanga Girls Senior High School',
    type: 'SHS',
    region: 'Upper East',
    district: 'Bolgatanga',
    town: 'Bolgatanga',
    verified: true,
    studentCount: 0
  },
  {
    id: 'zuarungu-shs',
    name: 'Zuarungu Senior High School',
    type: 'SHS',
    region: 'Upper East',
    district: 'Bolgatanga',
    town: 'Zuarungu',
    verified: true,
    studentCount: 0
  },
  {
    id: 'bawku-shs',
    name: 'Bawku Senior High School',
    type: 'SHS',
    region: 'Upper East',
    district: 'Bawku',
    town: 'Bawku',
    verified: true,
    studentCount: 0
  },
  {
    id: 'navrongo-shs',
    name: 'Navrongo Senior High School',
    type: 'SHS',
    region: 'Upper East',
    district: 'Kassena-Nankana',
    town: 'Navrongo',
    verified: true,
    studentCount: 0
  },
  {
    id: 'sandema-shs',
    name: 'Sandema Senior High School',
    type: 'SHS',
    region: 'Upper East',
    district: 'Builsa',
    town: 'Sandema',
    verified: true,
    studentCount: 0
  },
  {
    id: 'zebilla-shs',
    name: 'Zebilla Senior High School',
    type: 'SHS',
    region: 'Upper East',
    district: 'Bawku West',
    town: 'Zebilla',
    verified: true,
    studentCount: 0
  },
  
  // Upper West Region SHS Schools
  {
    id: 'wa-shs',
    name: 'Wa Senior High School',
    type: 'SHS',
    region: 'Upper West',
    district: 'Wa',
    town: 'Wa',
    verified: true,
    studentCount: 0
  },
  {
    id: 'wa-technical-shs',
    name: 'Wa Senior High Technical School',
    type: 'SHS',
    region: 'Upper West',
    district: 'Wa',
    town: 'Wa',
    verified: true,
    studentCount: 0
  },
  {
    id: 'jirapa-shs',
    name: 'Jirapa Senior High School',
    type: 'SHS',
    region: 'Upper West',
    district: 'Jirapa',
    town: 'Jirapa',
    verified: true,
    studentCount: 0
  },
  {
    id: 'st-francis-girls-jirapa',
    name: 'St. Francis Girls\' Senior High School',
    type: 'SHS',
    region: 'Upper West',
    district: 'Jirapa',
    town: 'Jirapa',
    verified: true,
    studentCount: 0
  },
  {
    id: 'lawra-shs',
    name: 'Lawra Senior High School',
    type: 'SHS',
    region: 'Upper West',
    district: 'Lawra',
    town: 'Lawra',
    verified: true,
    studentCount: 0
  },
  {
    id: 'nandom-shs',
    name: 'Nandom Senior High School',
    type: 'SHS',
    region: 'Upper West',
    district: 'Lawra-Nandom',
    town: 'Nandom',
    verified: true,
    studentCount: 0
  },
  {
    id: 'tumu-shs',
    name: 'Tumu Senior High Technical School',
    type: 'SHS',
    region: 'Upper West',
    district: 'Wa',
    town: 'Tumu',
    verified: true,
    studentCount: 0
  },
  
  // Bono Region SHS Schools
  {
    id: 'sunyani-shs',
    name: 'Sunyani Senior High School',
    type: 'SHS',
    region: 'Bono',
    district: 'Sunyani',
    town: 'Sunyani',
    verified: true,
    studentCount: 0
  },
  {
    id: 'notre-dame-shs',
    name: 'Notre Dame High School',
    type: 'SHS',
    region: 'Bono',
    district: 'Sunyani',
    town: 'Sunyani',
    verified: true,
    studentCount: 0
  },
  {
    id: 'berekum-shs',
    name: 'Berekum Senior High School',
    type: 'SHS',
    region: 'Bono',
    district: 'Berekum',
    town: 'Berekum',
    verified: true,
    studentCount: 0
  },
  {
    id: 'dormaa-shs',
    name: 'Dormaa Senior High School',
    type: 'SHS',
    region: 'Bono',
    district: 'Dormaa',
    town: 'Dormaa Ahenkro',
    verified: true,
    studentCount: 0
  },
  {
    id: 'wenchi-methodist',
    name: 'Wenchi Methodist Senior High School',
    type: 'SHS',
    region: 'Bono',
    district: 'Wenchi',
    town: 'Wenchi',
    verified: true,
    studentCount: 0
  },
  
  // Bono East Region SHS Schools
  {
    id: 'atebubu-shs',
    name: 'Atebubu Senior High School',
    type: 'SHS',
    region: 'Bono East',
    district: 'Atebubu-Amantin',
    town: 'Atebubu',
    verified: true,
    studentCount: 0
  },
  {
    id: 'techiman-shs',
    name: 'Techiman Senior High School',
    type: 'SHS',
    region: 'Bono East',
    district: 'Techiman',
    town: 'Techiman',
    verified: true,
    studentCount: 0
  },
  {
    id: 'kintampo-shs',
    name: 'Kintampo Senior High School',
    type: 'SHS',
    region: 'Bono East',
    district: 'Kintampo',
    town: 'Kintampo',
    verified: true,
    studentCount: 0,
    founded: 1971
  },
  {
    id: 'nkoranza-shs',
    name: 'Nkoranza Senior High School',
    type: 'SHS',
    region: 'Bono East',
    district: 'Nkoranza',
    town: 'Nkoranza',
    verified: true,
    studentCount: 0
  },
  
  // Ahafo Region SHS Schools
  {
    id: 'goaso-shs',
    name: 'Ahafoman Senior High School',
    type: 'SHS',
    region: 'Ahafo',
    district: 'Asunafo North',
    town: 'Goaso',
    verified: true,
    studentCount: 0
  },
  {
    id: 'ola-girls-kenyasi',
    name: 'OLA Girls Senior High School, Kenyasi',
    type: 'SHS',
    region: 'Ahafo',
    district: 'Asutifi',
    town: 'Kenyasi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'hwidiem-shs',
    name: 'Hwidiem Senior High School',
    type: 'SHS',
    region: 'Ahafo',
    district: 'Asutifi',
    town: 'Hwidiem',
    verified: true,
    studentCount: 0
  },
  {
    id: 'bechem-presby',
    name: 'Bechem Presbyterian Senior High School',
    type: 'SHS',
    region: 'Ahafo',
    district: 'Tano North',
    town: 'Bechem',
    verified: true,
    studentCount: 0
  },
  {
    id: 'duayaw-nkwanta-shs',
    name: 'Duayaw Nkwanta Senior High School',
    type: 'SHS',
    region: 'Ahafo',
    district: 'Tano North',
    town: 'Duayaw Nkwanta',
    verified: true,
    studentCount: 0
  },
  
  // Oti Region SHS Schools
  {
    id: 'bueman-shs',
    name: 'Bueman Senior High School',
    type: 'SHS',
    region: 'Oti',
    district: 'Jasikan',
    town: 'Jasikan',
    verified: true,
    studentCount: 0
  },
  {
    id: 'worawora-shs',
    name: 'Worawora Secondary School',
    type: 'SHS',
    region: 'Oti',
    district: 'Jasikan',
    town: 'Worawora',
    verified: true,
    studentCount: 0
  },
  {
    id: 'krachi-shs',
    name: 'Krachi Senior High School',
    type: 'SHS',
    region: 'Oti',
    district: 'Krachi',
    town: 'Kete-Krachi',
    verified: true,
    studentCount: 0
  },
  {
    id: 'kpassa-shs',
    name: 'Kpassa Senior High School',
    type: 'SHS',
    region: 'Oti',
    district: 'Krachi East',
    town: 'Kpassa',
    verified: true,
    studentCount: 0
  },
  {
    id: 'nkwanta-shs',
    name: 'Nkwanta Senior High School',
    type: 'SHS',
    region: 'Oti',
    district: 'Nkwanta',
    town: 'Nkwanta',
    verified: true,
    studentCount: 0
  },
  
  // Western North Region SHS Schools
  {
    id: 'bibiani-shs',
    name: 'Bibiani Senior High Technical School',
    type: 'SHS',
    region: 'Western North',
    district: 'Bibiani-Anhwiaso-Bekwai',
    town: 'Bibiani',
    verified: true,
    studentCount: 0
  },
  {
    id: 'sefwi-wiawso-shs',
    name: 'Sefwi Wiawso Senior High School',
    type: 'SHS',
    region: 'Western North',
    district: 'Sefwi Wiawso',
    town: 'Sefwi Wiawso',
    verified: true,
    studentCount: 0
  },
  {
    id: 'sefwi-bekwai-shs',
    name: 'Sefwi Bekwai Senior High School',
    type: 'SHS',
    region: 'Western North',
    district: 'Bibiani-Anhwiaso-Bekwai',
    town: 'Sefwi Bekwai',
    verified: true,
    studentCount: 0
  },
  
  // JHS Schools - Accra
  {
    id: 'accra-academy-jhs',
    name: 'Accra Academy JHS',
    type: 'JHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Kaneshie',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'labone-jhs',
    name: 'Labone Senior High School JHS',
    type: 'JHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Labone',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'achimota-jhs',
    name: 'Achimota JHS',
    type: 'JHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Achimota',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'tema-methodist-jhs',
    name: 'Tema Methodist Day JHS',
    type: 'JHS',
    region: 'Greater Accra',
    district: 'Tema',
    town: 'Tema',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'awoshie-presby-jhs',
    name: 'Awoshie Presbyterian JHS',
    type: 'JHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Awoshie',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'airport-residential-jhs',
    name: 'Airport Residential Area JHS',
    type: 'JHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Airport Residential',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'ola-jhs',
    name: 'Our Lady of Apostles JHS',
    type: 'JHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Dansoman',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'dansoman-presby-jhs',
    name: 'Dansoman Presbyterian JHS',
    type: 'JHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Dansoman',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'kaneshie-presby-jhs',
    name: 'Kaneshie Presbyterian JHS',
    type: 'JHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Kaneshie',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'ringway-estates-jhs',
    name: 'Ringway Estates JHS',
    type: 'JHS',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Osu',
    verified: true,
    studentCount: 0,
  },
  
  // JHS Schools - Kumasi
  {
    id: 'anloga-jhs',
    name: 'Anloga Junction JHS',
    type: 'JHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Anloga',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'atonsu-jhs',
    name: 'Atonsu Agogo JHS',
    type: 'JHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Atonsu',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'bantama-jhs',
    name: 'Bantama JHS',
    type: 'JHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Bantama',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'asokwa-jhs',
    name: 'Asokwa Roman Catholic JHS',
    type: 'JHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Asokwa',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'knust-jhs',
    name: 'KNUST JHS',
    type: 'JHS',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'KNUST',
    verified: true,
    studentCount: 0,
  },
  
  // JHS Schools - Cape Coast
  {
    id: 'adisadel-jhs',
    name: 'Adisadel College JHS',
    type: 'JHS',
    region: 'Central',
    district: 'Cape Coast',
    town: 'Cape Coast',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'efutu-jhs',
    name: 'Efutu JHS',
    type: 'JHS',
    region: 'Central',
    district: 'Cape Coast',
    town: 'Cape Coast',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'pedu-jhs',
    name: 'Pedu JHS',
    type: 'JHS',
    region: 'Central',
    district: 'Cape Coast',
    town: 'Pedu',
    verified: true,
    studentCount: 0,
  },
  
  // JHS Schools - Takoradi
  {
    id: 'fijai-jhs',
    name: 'Fijai JHS',
    type: 'JHS',
    region: 'Western',
    district: 'Sekondi-Takoradi',
    town: 'Fijai',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'ngyiresia-jhs',
    name: 'Ngyiresia JHS',
    type: 'JHS',
    region: 'Western',
    district: 'Sekondi-Takoradi',
    town: 'Ngyiresia',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'kokompe-jhs',
    name: 'Kokompe JHS',
    type: 'JHS',
    region: 'Western',
    district: 'Sekondi-Takoradi',
    town: 'Kokompe',
    verified: true,
    studentCount: 0,
  },
  
  // Private/International Schools
  {
    id: 'ghana-international-school',
    name: 'Ghana International School',
    type: 'International',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Cantonments',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'lincoln-community-school',
    name: 'Lincoln Community School',
    type: 'International',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Roman Ridge',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'tema-international-school',
    name: 'Tema International School',
    type: 'International',
    region: 'Greater Accra',
    district: 'Tema',
    town: 'Tema',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'action-academy',
    name: 'Action Academy',
    type: 'Private',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Kumasi',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'royal-international-school',
    name: 'Royal International School',
    type: 'Private',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'East Legon',
    verified: true,
    studentCount: 0,
  },
  
  // Islamic Schools
  {
    id: 'islamic-jhs-accra',
    name: 'Islamic JHS - Accra',
    type: 'Islamic',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Nima',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'islamic-jhs-kumasi',
    name: 'Islamic JHS - Kumasi',
    type: 'Islamic',
    region: 'Ashanti',
    district: 'Kumasi',
    town: 'Aboabo',
    verified: true,
    studentCount: 0,
  },
  
  // Basic Schools
  {
    id: 'ridge-church-school',
    name: 'Ridge Church School',
    type: 'Basic',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Ridge',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'roman-ridge-jhs',
    name: 'Roman Ridge JHS',
    type: 'Basic',
    region: 'Greater Accra',
    district: 'Accra',
    town: 'Roman Ridge',
    verified: true,
    studentCount: 0,
  },
  
  // Eastern Region
  {
    id: 'pope-john-jhs',
    name: 'Pope John Senior High and Minor Seminary JHS',
    type: 'JHS',
    region: 'Eastern',
    district: 'Koforidua',
    town: 'Effiduase',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'oti-boateng-jhs',
    name: 'Oti Boateng JHS',
    type: 'JHS',
    region: 'Eastern',
    district: 'New Juaben',
    town: 'Koforidua',
    verified: true,
    studentCount: 0,
  },
  
  // Northern Region
  {
    id: 'tamale-jhs',
    name: 'Tamale JHS',
    type: 'JHS',
    region: 'Northern',
    district: 'Tamale',
    town: 'Tamale',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'ghana-jhs-tamale',
    name: 'Ghana Senior High School JHS',
    type: 'JHS',
    region: 'Northern',
    district: 'Tamale',
    town: 'Tamale',
    verified: true,
    studentCount: 0,
  },
  
  // Volta Region
  {
    id: 'mawuli-jhs',
    name: 'Mawuli School JHS',
    type: 'JHS',
    region: 'Volta',
    district: 'Ho',
    town: 'Ho',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'kpando-jhs',
    name: 'Kpando JHS',
    type: 'JHS',
    region: 'Volta',
    district: 'Kpando',
    town: 'Kpando',
    verified: true,
    studentCount: 0,
  },
];

// Special entry for independent learners
export const INDEPENDENT_LEARNER: School = {
  id: 'independent-learner',
  name: 'Independent Learner',
  type: 'Private',
  region: 'All Regions',
  verified: true,
  studentCount: 0,
  colors: { primary: '#6B7280', secondary: '#9CA3AF' },
};

// Helper functions
export function getSchools(): School[] {
  return [...GHANA_SCHOOLS, INDEPENDENT_LEARNER];
}

export function getSchoolById(id: string): School | undefined {
  if (id === INDEPENDENT_LEARNER.id) return INDEPENDENT_LEARNER;
  return GHANA_SCHOOLS.find(school => school.id === id);
}

export function getSchoolsByRegion(region: string): School[] {
  if (region === 'All Regions') return GHANA_SCHOOLS;
  return GHANA_SCHOOLS.filter(school => school.region === region);
}

export function getSchoolsByType(type: School['type']): School[] {
  return GHANA_SCHOOLS.filter(school => school.type === type);
}

export function searchSchools(query: string): School[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return getSchools();
  
  return getSchools().filter(school => 
    school.name.toLowerCase().includes(lowerQuery) ||
    school.town?.toLowerCase().includes(lowerQuery) ||
    school.region.toLowerCase().includes(lowerQuery)
  );
}

export function getSchoolStats(schoolId: string) {
  // In production, this would fetch from database
  const school = getSchoolById(schoolId);
  if (!school) return null;
  
  return {
    school,
    totalStudents: school.studentCount,
    activeStudents: 0,
    averageRating: 0,
    totalWins: 0,
    ranking: 0,
  };
}

// Initialize school data in localStorage
export function initializeSchoolData() {
  if (typeof window === 'undefined') return;
  
  const existing = localStorage.getItem('ghana-schools');
  if (!existing) {
    localStorage.setItem('ghana-schools', JSON.stringify(GHANA_SCHOOLS));
  }
}

// Add a new school (for user requests)
export function requestNewSchool(schoolData: {
  name: string;
  region: string;
  town?: string;
  type: School['type'];
}) {
  // In production, this would send to admin for approval
  const newSchool: School = {
    id: `user-${Date.now()}`,
    name: schoolData.name,
    type: schoolData.type,
    region: schoolData.region,
    town: schoolData.town,
    verified: false,
    studentCount: 0,
  };
  
  const schools = JSON.parse(localStorage.getItem('ghana-schools') || '[]');
  schools.push(newSchool);
  localStorage.setItem('ghana-schools', JSON.stringify(schools));
  
  return newSchool;
}

export function updateSchoolStudentCount(schoolId: string, increment: number = 1) {
  const schools = JSON.parse(localStorage.getItem('ghana-schools') || '[]');
  const schoolIndex = schools.findIndex((s: School) => s.id === schoolId);
  
  if (schoolIndex !== -1) {
    schools[schoolIndex].studentCount += increment;
    localStorage.setItem('ghana-schools', JSON.stringify(schools));
  }
}
