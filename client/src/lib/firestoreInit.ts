import { db } from './firebase';
import { collection, doc, setDoc, getDocs, getDoc, Timestamp, writeBatch } from 'firebase/firestore';
import categories from '@/data/categories';
import translations from '@/data/translations';

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

// Initialize categories collection in Firestore
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
      
      const subcategoriesData = category.subcategories.map(subcategory => ({
        key: subcategory.slug,
        translations: getSubcategoryTranslations(subcategory.name)
      }));
      
      batch.set(categoryRef, {
        name: category.name,
        translations: getCategoryTranslations(category.name),
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
    availableLanguages: ['en', 'fr', 'ar'],
    imageUrl: 'https://source.unsplash.com/featured/?travel',
    translations: {
      en: {
        title: '50 Common Words for Travel',
        summary: 'Useful vocabulary for travelers.',
        content: [
          'Traveling to a new country can be both exciting and challenging, especially when you don\'t speak the local language.',
          'Having a basic vocabulary of common words and phrases can make your travel experience much smoother and more enjoyable.',
          'This article covers 50 essential words that will help you navigate transportation, accommodation, dining, and emergencies in a foreign country.',
          'Learning just a few key phrases in the local language can also show respect for the culture and often leads to more authentic experiences and warmer interactions with locals.',
          'Practice these words before your trip and consider keeping a small pocket dictionary or translation app handy for additional support during your travels.'
        ],
        category: 'language-learning',
        subcategory: 'vocabulary'
      },
      fr: {
        title: '50 mots courants pour voyager',
        summary: 'Vocabulaire utile pour les voyageurs.',
        content: [
          'Voyager dans un nouveau pays peut être à la fois passionnant et difficile, surtout lorsque vous ne parlez pas la langue locale.',
          'Avoir un vocabulaire de base de mots et de phrases courants peut rendre votre expérience de voyage beaucoup plus fluide et agréable.',
          'Cet article couvre 50 mots essentiels qui vous aideront à naviguer dans les transports, l\'hébergement, la restauration et les urgences dans un pays étranger.',
          'Apprendre quelques phrases clés dans la langue locale peut également montrer du respect pour la culture et conduit souvent à des expériences plus authentiques et à des interactions plus chaleureuses avec les habitants.',
          'Pratiquez ces mots avant votre voyage et envisagez de garder un petit dictionnaire de poche ou une application de traduction à portée de main pour un soutien supplémentaire pendant vos voyages.'
        ],
        category: 'language-learning',
        subcategory: 'vocabulary'
      },
      ar: {
        title: '٥٠ كلمة شائعة للسفر',
        summary: 'مفردات مفيدة للمسافرين.',
        content: [
          'يمكن أن يكون السفر إلى بلد جديد مثيرًا وصعبًا في نفس الوقت، خاصة عندما لا تتحدث اللغة المحلية.',
          'إن امتلاك مفردات أساسية من الكلمات والعبارات الشائعة يمكن أن يجعل تجربة سفرك أكثر سلاسة ومتعة.',
          'تغطي هذه المقالة 50 كلمة أساسية ستساعدك على التنقل في وسائل النقل والإقامة وتناول الطعام وحالات الطوارئ في بلد أجنبي.',
          'يمكن أن يظهر تعلم بعض العبارات الرئيسية باللغة المحلية أيضًا احترامًا للثقافة وغالبًا ما يؤدي إلى تجارب أكثر أصالة وتفاعلات أكثر دفئًا مع السكان المحليين.',
          'تدرب على هذه الكلمات قبل رحلتك وفكر في الاحتفاظ بقاموس صغير أو تطبيق ترجمة في متناول اليد للحصول على دعم إضافي أثناء رحلاتك.'
        ],
        category: 'language-learning',
        subcategory: 'vocabulary'
      }
    },
    draft: false,
    createdAt: Timestamp.now()
  },
  {
    slug: 'amazing-facts-about-nature',
    availableLanguages: ['en', 'es', 'de'],
    imageUrl: 'https://source.unsplash.com/featured/?nature',
    translations: {
      en: {
        title: '10 Amazing Facts About Nature',
        summary: 'Nature is full of wonders.',
        content: [
          'The natural world is filled with astonishing phenomena that continue to fascinate scientists and nature enthusiasts alike.',
          'From the depths of the oceans to the heights of the atmosphere, nature reveals incredible adaptations and surprising connections.',
          'This article explores ten remarkable facts about our natural world that highlight the complexity and beauty of Earth\'s ecosystems.',
          'Understanding these natural wonders helps us appreciate the importance of conservation efforts to protect our planet\'s biodiversity.',
          'Each of these facts reminds us of how much we still have to learn about the intricate systems that make up our natural environment.'
        ],
        category: 'science',
        subcategory: 'nature'
      },
      es: {
        title: '10 hechos sorprendentes sobre la naturaleza',
        summary: 'La naturaleza está llena de maravillas.',
        content: [
          'El mundo natural está lleno de fenómenos asombrosos que continúan fascinando a científicos y entusiastas de la naturaleza por igual.',
          'Desde las profundidades de los océanos hasta las alturas de la atmósfera, la naturaleza revela adaptaciones increíbles y conexiones sorprendentes.',
          'Este artículo explora diez hechos notables sobre nuestro mundo natural que destacan la complejidad y belleza de los ecosistemas de la Tierra.',
          'Comprender estas maravillas naturales nos ayuda a apreciar la importancia de los esfuerzos de conservación para proteger la biodiversidad de nuestro planeta.',
          'Cada uno de estos hechos nos recuerda cuánto nos queda por aprender sobre los intrincados sistemas que componen nuestro entorno natural.'
        ],
        category: 'science',
        subcategory: 'nature'
      },
      de: {
        title: '10 erstaunliche Fakten über die Natur',
        summary: 'Die Natur ist voller Wunder.',
        content: [
          'Die natürliche Welt ist voller erstaunlicher Phänomene, die Wissenschaftler und Naturliebhaber gleichermaßen faszinieren.',
          'Von den Tiefen der Ozeane bis zu den Höhen der Atmosphäre zeigt die Natur unglaubliche Anpassungen und überraschende Verbindungen.',
          'Dieser Artikel untersucht zehn bemerkenswerte Fakten über unsere natürliche Welt, die die Komplexität und Schönheit der Ökosysteme der Erde hervorheben.',
          'Das Verständnis dieser Naturwunder hilft uns, die Bedeutung von Naturschutzbemühungen zum Schutz der biologischen Vielfalt unseres Planeten zu schätzen.',
          'Jede dieser Tatsachen erinnert uns daran, wie viel wir noch über die komplexen Systeme lernen müssen, die unsere natürliche Umgebung ausmachen.'
        ],
        category: 'science',
        subcategory: 'nature'
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