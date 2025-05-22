import { getFirestore, collection, doc, setDoc, getDocs, Timestamp, writeBatch } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import categories from '@/data/categories';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase for this module
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create translations for categories
function getCategoryTranslations(categoryName: string) {
  const translations: Record<string, string> = {
    en: categoryName,
    fr: '',
    ar: '',
    es: '',
    de: ''
  };

  // Map English category names to translations
  switch(categoryName) {
    case 'Language Learning':
      translations.fr = 'Apprentissage des langues';
      translations.ar = 'تعلم اللغات';
      translations.es = 'Aprendizaje de idiomas';
      translations.de = 'Sprachenlernen';
      break;
    case 'Culture':
      translations.fr = 'Culture';
      translations.ar = 'الثقافة';
      translations.es = 'Cultura';
      translations.de = 'Kultur';
      break;
    case 'Science':
      translations.fr = 'Science';
      translations.ar = 'العلوم';
      translations.es = 'Ciencia';
      translations.de = 'Wissenschaft';
      break;
    case 'Stories':
      translations.fr = 'Histoires';
      translations.ar = 'قصص';
      translations.es = 'Historias';
      translations.de = 'Geschichten';
      break;
    case 'Tips & Lifestyle':
      translations.fr = 'Conseils et mode de vie';
      translations.ar = 'نصائح ونمط الحياة';
      translations.es = 'Consejos y estilo de vida';
      translations.de = 'Tipps & Lifestyle';
      break;
    default:
      break;
  }

  return translations;
}

// Create translations for subcategories
function getSubcategoryTranslations(subcategoryName: string) {
  const translations: Record<string, string> = {
    en: subcategoryName,
    fr: '',
    ar: '',
    es: '',
    de: ''
  };

  // Map English subcategory names to translations
  switch(subcategoryName) {
    // Language Learning subcategories
    case 'Vocabulary':
      translations.fr = 'Vocabulaire';
      translations.ar = 'المفردات';
      translations.es = 'Vocabulario';
      translations.de = 'Vokabular';
      break;
    case 'Grammar':
      translations.fr = 'Grammaire';
      translations.ar = 'القواعد';
      translations.es = 'Gramática';
      translations.de = 'Grammatik';
      break;
    case 'Phrases':
      translations.fr = 'Phrases';
      translations.ar = 'العبارات';
      translations.es = 'Frases';
      translations.de = 'Sätze';
      break;
    
    // Culture subcategories
    case 'History':
      translations.fr = 'Histoire';
      translations.ar = 'التاريخ';
      translations.es = 'Historia';
      translations.de = 'Geschichte';
      break;
    case 'Food':
      translations.fr = 'Cuisine';
      translations.ar = 'الطعام';
      translations.es = 'Comida';
      translations.de = 'Essen';
      break;
    case 'Travel':
      translations.fr = 'Voyage';
      translations.ar = 'السفر';
      translations.es = 'Viaje';
      translations.de = 'Reisen';
      break;
    
    // Science subcategories
    case 'Nature':
      translations.fr = 'Nature';
      translations.ar = 'الطبيعة';
      translations.es = 'Naturaleza';
      translations.de = 'Natur';
      break;
    case 'Technology':
      translations.fr = 'Technologie';
      translations.ar = 'التكنولوجيا';
      translations.es = 'Tecnología';
      translations.de = 'Technologie';
      break;
    case 'Health':
      translations.fr = 'Santé';
      translations.ar = 'الصحة';
      translations.es = 'Salud';
      translations.de = 'Gesundheit';
      break;
    
    // Stories subcategories
    case 'Short Stories':
      translations.fr = 'Nouvelles';
      translations.ar = 'قصص قصيرة';
      translations.es = 'Cuentos cortos';
      translations.de = 'Kurzgeschichten';
      break;
    case 'Fairy Tales':
      translations.fr = 'Contes de fées';
      translations.ar = 'حكايات خرافية';
      translations.es = 'Cuentos de hadas';
      translations.de = 'Märchen';
      break;
    
    // Tips & Lifestyle subcategories
    case 'Productivity':
      translations.fr = 'Productivité';
      translations.ar = 'الإنتاجية';
      translations.es = 'Productividad';
      translations.de = 'Produktivität';
      break;
    case 'Study Tips':
      translations.fr = 'Conseils d\'étude';
      translations.ar = 'نصائح للدراسة';
      translations.es = 'Consejos de estudio';
      translations.de = 'Lerntipps';
      break;
    case 'Motivation':
      translations.fr = 'Motivation';
      translations.ar = 'التحفيز';
      translations.es = 'Motivación';
      translations.de = 'Motivation';
      break;
    default:
      break;
  }

  return translations;
}

// Initialize categories collection in Firestore with the new structure
export async function initializeCategories() {
  try {
    // Check if categories already exist
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    if (!categoriesSnapshot.empty) {
      console.log('Categories already initialized, skipping');
      return;
    }

    const batch = writeBatch(db);
    
    // Add each category to Firestore
    for (const category of categories) {
      const categoryRef = doc(collection(db, 'categories'), category.slug);
      
      // Prepare titles map for each language
      const titles = {
        en: category.name,
        fr: getCategoryTranslations(category.name).fr,
        ar: getCategoryTranslations(category.name).ar,
        es: getCategoryTranslations(category.name).es,
        de: getCategoryTranslations(category.name).de
      };
      
      // Prepare subcategories with new format
      const subcategoriesData = category.subcategories.map(subcategory => {
        const subTitles = {
          en: subcategory.name,
          fr: getSubcategoryTranslations(subcategory.name).fr,
          ar: getSubcategoryTranslations(subcategory.name).ar,
          es: getSubcategoryTranslations(subcategory.name).es,
          de: getSubcategoryTranslations(subcategory.name).de
        };
        
        return {
          slug: subcategory.slug,
          titles: subTitles
        };
      });
      
      batch.set(categoryRef, {
        slug: category.slug,
        titles: titles,
        subcategories: subcategoriesData
      });
    }
    
    await batch.commit();
    console.log('Categories initialized successfully');
  } catch (error) {
    console.error('Error initializing categories:', error);
    throw error;
  }
}

// Sample article data
const sampleArticles = [
  {
    slug: 'common-words-for-travel',
    category: 'language-learning',
    subcategory: 'vocabulary',
    availableLanguages: ['en', 'fr', 'ar'],
    imageUrl: 'https://source.unsplash.com/featured/?travel',
    translations: {
      en: {
        title: '50 Common Words for Travel',
        summary: 'Useful vocabulary for travelers.',
        content: [
          { type: 'heading', text: 'Essential Travel Vocabulary' },
          { type: 'paragraph', text: 'Traveling to a new country can be both exciting and challenging, especially when you don\'t speak the local language.' },
          { type: 'paragraph', text: 'Having a basic vocabulary of common words and phrases can make your travel experience much smoother and more enjoyable.' },
          { type: 'heading', text: 'Why Learn Basic Phrases?' },
          { type: 'paragraph', text: 'This article covers 50 essential words that will help you navigate transportation, accommodation, dining, and emergencies in a foreign country.' },
          { type: 'paragraph', text: 'Learning just a few key phrases in the local language can also show respect for the culture and often leads to more authentic experiences and warmer interactions with locals.' }
        ]
      },
      fr: {
        title: '50 mots courants pour voyager',
        summary: 'Vocabulaire utile pour les voyageurs.',
        content: [
          { type: 'heading', text: 'Vocabulaire essentiel de voyage' },
          { type: 'paragraph', text: 'Voyager dans un nouveau pays peut être à la fois passionnant et difficile, surtout lorsque vous ne parlez pas la langue locale.' },
          { type: 'paragraph', text: 'Avoir un vocabulaire de base de mots et de phrases courants peut rendre votre expérience de voyage beaucoup plus fluide et agréable.' },
          { type: 'heading', text: 'Pourquoi apprendre des phrases de base?' },
          { type: 'paragraph', text: 'Cet article couvre 50 mots essentiels qui vous aideront à naviguer dans les transports, l\'hébergement, la restauration et les urgences dans un pays étranger.' },
          { type: 'paragraph', text: 'Apprendre quelques phrases clés dans la langue locale peut également montrer du respect pour la culture et conduit souvent à des expériences plus authentiques et à des interactions plus chaleureuses avec les habitants.' }
        ]
      },
      ar: {
        title: '٥٠ كلمة شائعة للسفر',
        summary: 'مفردات مفيدة للمسافرين.',
        content: [
          { type: 'heading', text: 'مفردات السفر الأساسية' },
          { type: 'paragraph', text: 'يمكن أن يكون السفر إلى بلد جديد مثيرًا وصعبًا في نفس الوقت، خاصة عندما لا تتحدث اللغة المحلية.' },
          { type: 'paragraph', text: 'إن امتلاك مفردات أساسية من الكلمات والعبارات الشائعة يمكن أن يجعل تجربة سفرك أكثر سلاسة ومتعة.' },
          { type: 'heading', text: 'لماذا تتعلم العبارات الأساسية؟' },
          { type: 'paragraph', text: 'تغطي هذه المقالة 50 كلمة أساسية ستساعدك على التنقل في وسائل النقل والإقامة وتناول الطعام وحالات الطوارئ في بلد أجنبي.' },
          { type: 'paragraph', text: 'يمكن أن يظهر تعلم بعض العبارات الرئيسية باللغة المحلية أيضًا احترامًا للثقافة وغالبًا ما يؤدي إلى تجارب أكثر أصالة وتفاعلات أكثر دفئًا مع السكان المحليين.' }
        ]
      }
    },
    draft: false,
    createdAt: Timestamp.now()
  },
  {
    slug: 'amazing-facts-about-nature',
    category: 'science',
    subcategory: 'nature',
    availableLanguages: ['en', 'es', 'de'],
    imageUrl: 'https://source.unsplash.com/featured/?nature',
    translations: {
      en: {
        title: '10 Amazing Facts About Nature',
        summary: 'Nature is full of wonders.',
        content: [
          { type: 'heading', text: 'The Wonders of Our Natural World' },
          { type: 'paragraph', text: 'The natural world is filled with astonishing phenomena that continue to fascinate scientists and nature enthusiasts alike.' },
          { type: 'paragraph', text: 'From the depths of the oceans to the heights of the atmosphere, nature reveals incredible adaptations and surprising connections.' },
          { type: 'heading', text: 'Understanding Earth\'s Ecosystems' },
          { type: 'paragraph', text: 'This article explores ten remarkable facts about our natural world that highlight the complexity and beauty of Earth\'s ecosystems.' },
          { type: 'paragraph', text: 'Understanding these natural wonders helps us appreciate the importance of conservation efforts to protect our planet\'s biodiversity.' }
        ]
      },
      es: {
        title: '10 hechos sorprendentes sobre la naturaleza',
        summary: 'La naturaleza está llena de maravillas.',
        content: [
          { type: 'heading', text: 'Las maravillas de nuestro mundo natural' },
          { type: 'paragraph', text: 'El mundo natural está lleno de fenómenos asombrosos que continúan fascinando a científicos y entusiastas de la naturaleza por igual.' },
          { type: 'paragraph', text: 'Desde las profundidades de los océanos hasta las alturas de la atmósfera, la naturaleza revela adaptaciones increíbles y conexiones sorprendentes.' },
          { type: 'heading', text: 'Entendiendo los ecosistemas de la Tierra' },
          { type: 'paragraph', text: 'Este artículo explora diez hechos notables sobre nuestro mundo natural que destacan la complejidad y belleza de los ecosistemas de la Tierra.' },
          { type: 'paragraph', text: 'Comprender estas maravillas naturales nos ayuda a apreciar la importancia de los esfuerzos de conservación para proteger la biodiversidad de nuestro planeta.' }
        ]
      },
      de: {
        title: '10 erstaunliche Fakten über die Natur',
        summary: 'Die Natur ist voller Wunder.',
        content: [
          { type: 'heading', text: 'Die Wunder unserer natürlichen Welt' },
          { type: 'paragraph', text: 'Die natürliche Welt ist voller erstaunlicher Phänomene, die Wissenschaftler und Naturliebhaber gleichermaßen faszinieren.' },
          { type: 'paragraph', text: 'Von den Tiefen der Ozeane bis zu den Höhen der Atmosphäre zeigt die Natur unglaubliche Anpassungen und überraschende Verbindungen.' },
          { type: 'heading', text: 'Verständnis der Ökosysteme der Erde' },
          { type: 'paragraph', text: 'Dieser Artikel untersucht zehn bemerkenswerte Fakten über unsere natürliche Welt, die die Komplexität und Schönheit der Ökosysteme der Erde hervorheben.' },
          { type: 'paragraph', text: 'Das Verständnis dieser Naturwunder hilft uns, die Bedeutung von Naturschutzbemühungen zum Schutz der biologischen Vielfalt unseres Planeten zu schätzen.' }
        ]
      }
    },
    draft: false,
    createdAt: Timestamp.now()
  }
];

// Initialize articles collection in Firestore
export async function initializeArticles() {
  try {
    // Check if articles already exist
    const articlesSnapshot = await getDocs(collection(db, 'articles'));
    if (!articlesSnapshot.empty) {
      console.log('Articles already initialized, skipping');
      return;
    }

    const batch = writeBatch(db);
    
    // Add each sample article to Firestore
    for (const article of sampleArticles) {
      const articleRef = doc(collection(db, 'articles'), article.slug);
      batch.set(articleRef, article);
    }
    
    await batch.commit();
    console.log('Articles initialized successfully');
  } catch (error) {
    console.error('Error initializing articles:', error);
    throw error;
  }
}

// Initialize both collections
export async function initializeFirestore() {
  try {
    await initializeCategories();
    await initializeArticles();
    console.log('Firestore initialization complete');
  } catch (error) {
    console.error('Firestore initialization failed:', error);
  }
}