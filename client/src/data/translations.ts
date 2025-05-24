// Translations for UI elements in multiple languages

const translations = {
  en: {
    // General
    general: {
      appName: "Kalima",
      back: "Back",
      backToHome: "Back to Home",
      loading: "Loading...",
      search: "Search",
      viewAll: "View All",
      readMore: "Read More",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      confirm: "Confirm",
      submit: "Submit"
    },

    // Navigation
    nav: {
      home: "Home",
      categories: "Categories",
      favorites: "Favorites",
      profile: "Profile",
      suggestions: "Suggestions",
      admin: "Admin",
      logout: "Logout"
    },

    // Authentication
    auth: {
      login: "Login",
      register: "Register",
      logout: "Logout",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      displayName: "Display Name",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      createAccount: "Create an account",
      loginNow: "Login now",
      loggedInAs: "Logged in as"
    },

    // Categories
    categories: {
      allCategories: "All Categories",
      viewAll: "View All",
      latest: "Latest from",
      "language-learning": "Language Learning",
      "culture": "Culture",
      "science": "Science", 
      "stories": "Stories",
      "tips-lifestyle": "Tips & Lifestyle"
    },

    // Category Descriptions
    categoryDescriptions: {
      "language-learning": "Enhance your language skills with our comprehensive guides and resources for learners at all levels.",
      "culture": "Explore diverse cultural traditions, customs, and perspectives from around the world.",
      "science": "Discover fascinating scientific concepts explained in an accessible and engaging way.",
      "stories": "Immerse yourself in captivating narratives that entertain while improving your language comprehension.",
      "tips-lifestyle": "Practical advice and strategies to improve your learning habits and daily routines."
    },

    // Subcategories
    subcategories: {
      "vocabulary": "Vocabulary",
      "grammar": "Grammar",
      "phrases": "Phrases",
      "history": "History",
      "food": "Food",
      "travel": "Travel",
      "nature": "Nature",
      "technology": "Technology",
      "health": "Health",
      "short-stories": "Short Stories",
      "fairy-tales": "Fairy Tales",
      "productivity": "Productivity",
      "study-tips": "Study Tips",
      "motivation": "Motivation"
    },
    
    // Subcategory Descriptions
    subcategoryDescriptions: {
      "vocabulary": "Build your word bank with essential terms and expressions for everyday communication.",
      "grammar": "Master the rules and structures that form the foundation of clear and correct language use.",
      "phrases": "Learn practical expressions and idioms that native speakers use in real conversations.",
      "history": "Explore significant events, periods, and cultural developments that shaped societies.",
      "food": "Discover culinary traditions, recipes, and the cultural significance of foods around the world.",
      "travel": "Find insights about destinations, cultural etiquette, and practical travel language.",
      "nature": "Learn about ecosystems, wildlife, and natural phenomena in accessible scientific terms.",
      "technology": "Understand modern innovations and digital concepts explained in simple language.",
      "health": "Access information about wellbeing, healthy habits, and basic medical terminology.",
      "short-stories": "Enjoy brief narratives that entertain while improving your reading comprehension.",
      "fairy-tales": "Discover traditional and modern tales that carry cultural wisdom and imagination.",
      "productivity": "Learn strategies to enhance efficiency and accomplish more in your studies and work.",
      "study-tips": "Find practical advice to improve your learning techniques and academic performance.",
      "motivation": "Discover approaches to maintain enthusiasm and overcome challenges in your learning journey."
    },

    // Article
    article: {
      readMore: "Read more",
      relatedArticles: "Related Articles",
      noArticles: "No articles found",
      notFound: "Article not found",
      mayHaveBeenRemoved: "This article may have been removed or is unavailable.",
      translationMissing: "Translation not available",
      chooseAnotherLanguage: "Please choose another language for this article.",
      availableIn: "Available in:",
      educationalContent: "Educational Content",
      linkCopied: "Link copied",
      linkCopiedToClipboard: "Article link copied to clipboard"
    },

    // Favorites
    favorites: {
      title: "My Favorites",
      empty: "You haven't saved any articles yet.",
      browse: "Browse articles",
      loginRequired: "Login Required",
      loginToSave: "Please login to save articles to your favorites.",
      saved: "Saved",
      save: "Save",
      added: "Added to favorites",
      removed: "Removed from favorites",
      articleSaved: "Article saved to favorites",
      articleRemoved: "Article removed from favorites"
    },

    // Profile
    profile: {
      title: "Your Profile",
      personalInfo: "Personal Information",
      displayName: "Display Name",
      email: "Email",
      favoritesCount: "Saved Articles",
      suggestionsCount: "Submitted Suggestions",
      memberSince: "Member since",
      updateProfile: "Update Profile",
      deleteAccount: "Delete Account",
      confirmDeleteAccount: "Are you sure you want to delete your account? This action cannot be undone."
    },

    // Suggestions
    suggestions: {
      title: "Article Suggestions",
      empty: "You haven't submitted any article suggestions yet.",
      new: "Suggest New Article",
      submitted: "Your suggestions",
      form: {
        title: "Suggest an Article",
        titleLabel: "Article Title",
        titlePlaceholder: "Enter a title for your article",
        language: "Article Language",
        content: "Article Content",
        contentPlaceholder: "Write your article content here...",
        submit: "Submit Suggestion",
        success: "Suggestion submitted",
        successMessage: "Thank you for your contribution!"
      }
    },

    // Admin
    admin: {
      dashboard: "Dashboard",
      articles: "Articles",
      suggestions: "User Suggestions",
      users: "Users",
      settings: "Settings",
      createArticle: "Create Article",
      editArticle: "Edit Article",
      deleteArticle: "Delete Article",
      confirmDelete: "Are you sure you want to delete this article?",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
      saveArticle: "Save Article",
      publishArticle: "Publish Article",
      article: {
        title: "Title",
        titlePlaceholder: "Enter article title",
        slug: "Slug",
        slugDescription: "URL-friendly identifier for the article",
        summary: "Summary",
        summaryPlaceholder: "Brief description of the article",
        category: "Category",
        selectCategory: "Select a category",
        subcategory: "Subcategory",
        selectSubcategory: "Select a subcategory",
        content: "Content",
        paragraphPlaceholder: "Write paragraph content here...",
        addParagraph: "Add Paragraph",
        availableLanguages: "Available Languages",
        draft: "Draft",
        draftDescription: "Save as a draft (not visible to users)",
        featuredImage: "Featured Image",
        imageUrl: "Image URL",
        imageUrlDescription: "Enter a URL or search for an image",
        preview: "Preview",
        removeImage: "Remove Image"
      },
      imageSearch: {
        placeholder: "Search for an image",
        search: "Search",
        noTerm: "No search term",
        enterSearchTerm: "Please enter a search term",
        failed: "Failed to search for images"
      },
      stats: {
        totalArticles: "Total Articles",
        publishedArticles: "Published Articles",
        drafts: "Drafts",
        users: "Registered Users",
        suggestions: "User Suggestions",
        languages: "Languages"
      }
    },

    // Language
    language: {
      selectLanguage: "Select Language",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      german: "Deutsch"
    },

    // Theme
    theme: {
      toggleDark: "Switch to dark mode",
      toggleLight: "Switch to light mode"
    },

    // Footer
    footer: {
      rightsReserved: "All rights reserved.",
      description: "Multilingual educational content in Arabic, English, French, Spanish, and German."
    },

    // Error messages
    error: {
      title: "Error",
      generic: "Something went wrong",
      login: "Login failed",
      register: "Registration failed",
      notFound: "Page not found",
      unauthorized: "Unauthorized access",
      savingFailed: "Failed to save changes"
    },
    
    // Home page
    home: {
      hero: {
        title: "Learn in Multiple Languages",
        subtitle: "Explore educational content in Arabic, English, French, Spanish, and German.",
        cta: "Get Started"
      },
      featuredCategories: "Featured Categories",
      latestArticles: "Latest Articles",
      explore: "Explore"
    }
  },

  ar: {
    // General
    general: {
      appName: "كلمة",
      back: "رجوع",
      backToHome: "العودة إلى الصفحة الرئيسية",
      loading: "جاري التحميل...",
      search: "بحث",
      viewAll: "عرض الكل",
      readMore: "اقرأ المزيد",
      save: "حفظ",
      edit: "تعديل",
      delete: "حذف",
      cancel: "إلغاء",
      confirm: "تأكيد",
      submit: "إرسال"
    },

    // Navigation
    nav: {
      home: "الرئيسية",
      categories: "التصنيفات",
      favorites: "المفضلة",
      profile: "الملف الشخصي",
      suggestions: "الاقتراحات",
      admin: "المشرف",
      logout: "تسجيل الخروج"
    },

    // Authentication
    auth: {
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      logout: "تسجيل الخروج",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      displayName: "الاسم المعروض",
      forgotPassword: "نسيت كلمة المرور؟",
      noAccount: "ليس لديك حساب؟",
      hasAccount: "لديك حساب بالفعل؟",
      createAccount: "إنشاء حساب",
      loginNow: "تسجيل الدخول الآن",
      loggedInAs: "مسجل دخول باسم"
    },

    // Categories
    categories: {
      allCategories: "جميع التصنيفات",
      viewAll: "عرض الكل",
      latest: "أحدث من",
      "language-learning": "تعلم اللغات",
      "culture": "الثقافة",
      "science": "العلوم", 
      "stories": "قصص",
      "tips-lifestyle": "نصائح ونمط الحياة"
    },

    // Category Descriptions
    categoryDescriptions: {
      "language-learning": "عزز مهاراتك اللغوية من خلال أدلتنا الشاملة ومواردنا للمتعلمين في جميع المستويات.",
      "culture": "استكشف التقاليد والعادات والمنظورات الثقافية المتنوعة من جميع أنحاء العالم.",
      "science": "اكتشف المفاهيم العلمية المثيرة التي يتم شرحها بطريقة سهلة الفهم وجذابة.",
      "stories": "انغمس في روايات آسرة تمتع وتحسن فهمك للغة في نفس الوقت.",
      "tips-lifestyle": "نصائح عملية واستراتيجيات لتحسين عادات التعلم والروتين اليومي."
    },

    // Subcategories
    subcategories: {
      "vocabulary": "المفردات",
      "grammar": "القواعد",
      "phrases": "العبارات",
      "history": "التاريخ",
      "food": "الطعام",
      "travel": "السفر",
      "nature": "الطبيعة",
      "technology": "التكنولوجيا",
      "health": "الصحة",
      "short-stories": "قصص قصيرة",
      "fairy-tales": "حكايات خرافية",
      "productivity": "الإنتاجية",
      "study-tips": "نصائح للدراسة",
      "motivation": "التحفيز"
    },
    
    // Subcategory Descriptions
    subcategoryDescriptions: {
      "vocabulary": "بناء قاموسك اللغوي بالمصطلحات والتعبيرات الأساسية للتواصل اليومي.",
      "grammar": "إتقان القواعد والهياكل التي تشكل أساس الاستخدام اللغوي الواضح والصحيح.",
      "phrases": "تعلم التعبيرات العملية والمصطلحات التي يستخدمها المتحدثون الأصليون في المحادثات الحقيقية.",
      "history": "استكشاف الأحداث والفترات والتطورات الثقافية المهمة التي شكلت المجتمعات.",
      "food": "اكتشف التقاليد الطهي والوصفات والأهمية الثقافية للأطعمة حول العالم.",
      "travel": "اكتشف معلومات عن الوجهات وآداب السلوك الثقافية واللغة العملية للسفر.",
      "nature": "تعلم عن النظم البيئية والحياة البرية والظواهر الطبيعية بمصطلحات علمية سهلة الفهم.",
      "technology": "فهم الابتكارات الحديثة والمفاهيم الرقمية موضحة بلغة بسيطة.",
      "health": "الوصول إلى معلومات حول الرفاهية والعادات الصحية والمصطلحات الطبية الأساسية.",
      "short-stories": "استمتع بالروايات القصيرة التي تسلي وتحسن فهمك للقراءة.",
      "fairy-tales": "اكتشف الحكايات التقليدية والحديثة التي تحمل الحكمة الثقافية والخيال.",
      "productivity": "تعلم استراتيجيات لتعزيز الكفاءة وإنجاز المزيد في دراستك وعملك.",
      "study-tips": "العثور على نصائح عملية لتحسين تقنيات التعلم والأداء الأكاديمي.",
      "motivation": "اكتشف أساليب للحفاظ على الحماس والتغلب على التحديات في رحلة التعلم الخاصة بك."
    },

    // Article
    article: {
      readMore: "اقرأ المزيد",
      relatedArticles: "مقالات ذات صلة",
      noArticles: "لم يتم العثور على مقالات",
      notFound: "المقال غير موجود",
      mayHaveBeenRemoved: "ربما تمت إزالة هذا المقال أو أنه غير متاح.",
      translationMissing: "الترجمة غير متوفرة",
      chooseAnotherLanguage: "الرجاء اختيار لغة أخرى لهذا المقال.",
      availableIn: "متوفر في:",
      educationalContent: "محتوى تعليمي",
      linkCopied: "تم نسخ الرابط",
      linkCopiedToClipboard: "تم نسخ رابط المقال إلى الحافظة"
    },

    // Favorites
    favorites: {
      title: "المفضلة",
      empty: "لم تقم بحفظ أي مقالات بعد.",
      browse: "تصفح المقالات",
      loginRequired: "تسجيل الدخول مطلوب",
      loginToSave: "الرجاء تسجيل الدخول لحفظ المقالات في المفضلة.",
      saved: "تم الحفظ",
      save: "حفظ",
      added: "تمت الإضافة إلى المفضلة",
      removed: "تمت الإزالة من المفضلة",
      articleSaved: "تم حفظ المقال في المفضلة",
      articleRemoved: "تمت إزالة المقال من المفضلة"
    },

    // Profile
    profile: {
      title: "ملفك الشخصي",
      personalInfo: "المعلومات الشخصية",
      displayName: "الاسم المعروض",
      email: "البريد الإلكتروني",
      favoritesCount: "المقالات المحفوظة",
      suggestionsCount: "الاقتراحات المقدمة",
      memberSince: "عضو منذ",
      updateProfile: "تحديث الملف الشخصي",
      deleteAccount: "حذف الحساب",
      confirmDeleteAccount: "هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء."
    },

    // Suggestions
    suggestions: {
      title: "اقتراحات المقالات",
      empty: "لم تقدم أي اقتراحات للمقالات بعد.",
      new: "اقتراح مقال جديد",
      submitted: "اقتراحاتك",
      form: {
        title: "اقتراح مقال",
        titleLabel: "عنوان المقال",
        titlePlaceholder: "أدخل عنوانًا لمقالك",
        language: "لغة المقال",
        content: "محتوى المقال",
        contentPlaceholder: "اكتب محتوى مقالك هنا...",
        submit: "تقديم الاقتراح",
        success: "تم تقديم الاقتراح",
        successMessage: "شكرًا لمساهمتك!"
      }
    },

    // Admin
    admin: {
      dashboard: "لوحة التحكم",
      articles: "المقالات",
      suggestions: "اقتراحات المستخدمين",
      users: "المستخدمون",
      settings: "الإعدادات",
      createArticle: "إنشاء مقال",
      editArticle: "تعديل المقال",
      deleteArticle: "حذف المقال",
      confirmDelete: "هل أنت متأكد أنك تريد حذف هذا المقال؟",
      cancel: "إلغاء",
      save: "حفظ",
      saving: "جاري الحفظ...",
      saveArticle: "حفظ المقال",
      publishArticle: "نشر المقال",
      article: {
        title: "العنوان",
        titlePlaceholder: "أدخل عنوان المقال",
        slug: "الرابط المختصر",
        slugDescription: "معرف سهل القراءة للرابط",
        summary: "الملخص",
        summaryPlaceholder: "وصف موجز للمقال",
        category: "التصنيف",
        selectCategory: "اختر تصنيفًا",
        subcategory: "التصنيف الفرعي",
        selectSubcategory: "اختر تصنيفًا فرعيًا",
        content: "المحتوى",
        paragraphPlaceholder: "اكتب محتوى الفقرة هنا...",
        addParagraph: "إضافة فقرة",
        availableLanguages: "اللغات المتاحة",
        draft: "مسودة",
        draftDescription: "حفظ كمسودة (غير مرئية للمستخدمين)",
        featuredImage: "الصورة المميزة",
        imageUrl: "رابط الصورة",
        imageUrlDescription: "أدخل رابط أو ابحث عن صورة",
        preview: "معاينة",
        removeImage: "إزالة الصورة"
      },
      imageSearch: {
        placeholder: "البحث عن صورة",
        search: "بحث",
        noTerm: "لا توجد كلمة بحث",
        enterSearchTerm: "الرجاء إدخال كلمة بحث",
        failed: "فشل البحث عن الصور"
      },
      stats: {
        totalArticles: "إجمالي المقالات",
        publishedArticles: "المقالات المنشورة",
        drafts: "المسودات",
        users: "المستخدمون المسجلون",
        suggestions: "اقتراحات المستخدمين",
        languages: "اللغات"
      }
    },

    // Language
    language: {
      selectLanguage: "اختر اللغة",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      german: "Deutsch"
    },

    // Theme
    theme: {
      toggleDark: "التبديل إلى الوضع الداكن",
      toggleLight: "التبديل إلى الوضع الفاتح"
    },

    // Footer
    footer: {
      rightsReserved: "جميع الحقوق محفوظة.",
      description: "محتوى تعليمي متعدد اللغات بالعربية والإنجليزية والفرنسية والإسبانية والألمانية."
    },

    // Error messages
    error: {
      title: "خطأ",
      generic: "حدث خطأ ما",
      login: "فشل تسجيل الدخول",
      register: "فشل التسجيل",
      notFound: "الصفحة غير موجودة",
      unauthorized: "وصول غير مصرح به",
      savingFailed: "فشل حفظ التغييرات"
    },

    // Home page
    home: {
      hero: {
        title: "تعلم بلغات متعددة",
        subtitle: "استكشف المحتوى التعليمي باللغات العربية والإنجليزية والفرنسية والإسبانية والألمانية.",
        cta: "ابدأ الآن"
      },
      featuredCategories: "التصنيفات المميزة",
      latestArticles: "أحدث المقالات",
      explore: "استكشاف"
    }
  },

  fr: {
    // General
    general: {
      appName: "Kalima",
      back: "Retour",
      backToHome: "Retour à l'accueil",
      loading: "Chargement...",
      search: "Rechercher",
      viewAll: "Voir tout",
      readMore: "Lire plus",
      save: "Enregistrer",
      edit: "Modifier",
      delete: "Supprimer",
      cancel: "Annuler",
      confirm: "Confirmer",
      submit: "Soumettre"
    },

    // Navigation
    nav: {
      home: "Accueil",
      categories: "Catégories",
      favorites: "Favoris",
      profile: "Profil",
      suggestions: "Suggestions",
      admin: "Admin",
      logout: "Déconnexion"
    },

    // Authentication
    auth: {
      login: "Connexion",
      register: "Inscription",
      logout: "Déconnexion",
      email: "Email",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      displayName: "Nom d'affichage",
      forgotPassword: "Mot de passe oublié?",
      noAccount: "Vous n'avez pas de compte?",
      hasAccount: "Vous avez déjà un compte?",
      createAccount: "Créer un compte",
      loginNow: "Se connecter maintenant",
      loggedInAs: "Connecté en tant que"
    },

    // Categories
    categories: {
      allCategories: "Toutes les catégories",
      viewAll: "Voir tout",
      latest: "Derniers de",
      "language-learning": "Apprentissage des langues",
      "culture": "Culture",
      "science": "Science", 
      "stories": "Histoires",
      "tips-lifestyle": "Conseils et mode de vie"
    },

    // Category Descriptions
    categoryDescriptions: {
      "language-learning": "Améliorez vos compétences linguistiques grâce à nos guides complets et nos ressources pour les apprenants de tous niveaux.",
      "culture": "Explorez les traditions culturelles, les coutumes et les perspectives diverses du monde entier.",
      "science": "Découvrez des concepts scientifiques fascinants expliqués de manière accessible et captivante.",
      "stories": "Plongez dans des récits captivants qui divertissent tout en améliorant votre compréhension linguistique.",
      "tips-lifestyle": "Conseils pratiques et stratégies pour améliorer vos habitudes d'apprentissage et vos routines quotidiennes."
    },

    // Subcategories
    subcategories: {
      "vocabulary": "Vocabulaire",
      "grammar": "Grammaire",
      "phrases": "Phrases",
      "history": "Histoire",
      "food": "Cuisine",
      "travel": "Voyage",
      "nature": "Nature",
      "technology": "Technologie",
      "health": "Santé",
      "short-stories": "Nouvelles",
      "fairy-tales": "Contes de fées",
      "productivity": "Productivité",
      "study-tips": "Conseils d'étude",
      "motivation": "Motivation"
    },
    
    // Subcategory Descriptions
    subcategoryDescriptions: {
      "vocabulary": "Enrichissez votre banque de mots avec des termes et expressions essentiels pour la communication quotidienne.",
      "grammar": "Maîtrisez les règles et structures qui forment la base d'une utilisation claire et correcte de la langue.",
      "phrases": "Apprenez des expressions pratiques et des idiomes que les locuteurs natifs utilisent dans les conversations réelles.",
      "history": "Explorez les événements importants, les périodes et les développements culturels qui ont façonné les sociétés.",
      "food": "Découvrez les traditions culinaires, les recettes et l'importance culturelle des aliments du monde entier.",
      "travel": "Trouvez des informations sur les destinations, l'étiquette culturelle et le langage pratique du voyage.",
      "nature": "Apprenez sur les écosystèmes, la faune et les phénomènes naturels en termes scientifiques accessibles.",
      "technology": "Comprenez les innovations modernes et les concepts numériques expliqués en langage simple.",
      "health": "Accédez à des informations sur le bien-être, les habitudes saines et la terminologie médicale de base.",
      "short-stories": "Profitez de récits brefs qui divertissent tout en améliorant votre compréhension de la lecture.",
      "fairy-tales": "Découvrez des contes traditionnels et modernes qui véhiculent la sagesse culturelle et l'imagination.",
      "productivity": "Apprenez des stratégies pour améliorer l'efficacité et accomplir davantage dans vos études et votre travail.",
      "study-tips": "Trouvez des conseils pratiques pour améliorer vos techniques d'apprentissage et vos performances académiques.",
      "motivation": "Découvrez des approches pour maintenir l'enthousiasme et surmonter les défis dans votre parcours d'apprentissage."
    },

    // Article
    article: {
      readMore: "Lire plus",
      relatedArticles: "Articles associés",
      noArticles: "Aucun article trouvé",
      notFound: "Article non trouvé",
      mayHaveBeenRemoved: "Cet article a peut-être été supprimé ou n'est pas disponible.",
      translationMissing: "Traduction non disponible",
      chooseAnotherLanguage: "Veuillez choisir une autre langue pour cet article.",
      availableIn: "Disponible en:",
      educationalContent: "Contenu éducatif",
      linkCopied: "Lien copié",
      linkCopiedToClipboard: "Lien de l'article copié dans le presse-papiers"
    },

    // Favorites
    favorites: {
      title: "Mes favoris",
      empty: "Vous n'avez encore enregistré aucun article.",
      browse: "Parcourir les articles",
      loginRequired: "Connexion requise",
      loginToSave: "Veuillez vous connecter pour enregistrer des articles dans vos favoris.",
      saved: "Enregistré",
      save: "Enregistrer",
      added: "Ajouté aux favoris",
      removed: "Retiré des favoris",
      articleSaved: "Article enregistré dans les favoris",
      articleRemoved: "Article retiré des favoris"
    },
    
    // Profile
    profile: {
      title: "Votre profil",
      personalInfo: "Informations personnelles",
      displayName: "Nom d'affichage",
      email: "Email",
      favoritesCount: "Articles enregistrés",
      suggestionsCount: "Suggestions soumises",
      memberSince: "Membre depuis",
      updateProfile: "Mettre à jour le profil",
      deleteAccount: "Supprimer le compte",
      confirmDeleteAccount: "Êtes-vous sûr de vouloir supprimer votre compte? Cette action ne peut pas être annulée."
    },

    // Suggestions
    suggestions: {
      title: "Suggestions d'articles",
      empty: "Vous n'avez pas encore soumis de suggestions d'articles.",
      new: "Suggérer un nouvel article",
      submitted: "Vos suggestions",
      form: {
        title: "Suggérer un article",
        titleLabel: "Titre de l'article",
        titlePlaceholder: "Entrez un titre pour votre article",
        language: "Langue de l'article",
        content: "Contenu de l'article",
        contentPlaceholder: "Écrivez le contenu de votre article ici...",
        submit: "Soumettre la suggestion",
        success: "Suggestion soumise",
        successMessage: "Merci pour votre contribution!"
      }
    },

    // Admin
    admin: {
      dashboard: "Tableau de bord",
      articles: "Articles",
      suggestions: "Suggestions des utilisateurs",
      users: "Utilisateurs",
      settings: "Paramètres",
      createArticle: "Créer un article",
      editArticle: "Modifier l'article",
      deleteArticle: "Supprimer l'article",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cet article?",
      cancel: "Annuler",
      save: "Enregistrer",
      saving: "Enregistrement...",
      saveArticle: "Enregistrer l'article",
      publishArticle: "Publier l'article",
      article: {
        title: "Titre",
        titlePlaceholder: "Entrez le titre de l'article",
        slug: "Slug",
        slugDescription: "Identifiant convivial pour l'URL",
        summary: "Résumé",
        summaryPlaceholder: "Brève description de l'article",
        category: "Catégorie",
        selectCategory: "Sélectionnez une catégorie",
        subcategory: "Sous-catégorie",
        selectSubcategory: "Sélectionnez une sous-catégorie",
        content: "Contenu",
        paragraphPlaceholder: "Écrivez le contenu du paragraphe ici...",
        addParagraph: "Ajouter un paragraphe",
        availableLanguages: "Langues disponibles",
        draft: "Brouillon",
        draftDescription: "Enregistrer comme brouillon (non visible pour les utilisateurs)",
        featuredImage: "Image principale",
        imageUrl: "URL de l'image",
        imageUrlDescription: "Entrez une URL ou recherchez une image",
        preview: "Aperçu",
        removeImage: "Supprimer l'image"
      },
      imageSearch: {
        placeholder: "Rechercher une image",
        search: "Rechercher",
        noTerm: "Aucun terme de recherche",
        enterSearchTerm: "Veuillez entrer un terme de recherche",
        failed: "Échec de la recherche d'images"
      },
      stats: {
        totalArticles: "Total des articles",
        publishedArticles: "Articles publiés",
        drafts: "Brouillons",
        users: "Utilisateurs enregistrés",
        suggestions: "Suggestions des utilisateurs",
        languages: "Langues"
      }
    },

    // Language
    language: {
      selectLanguage: "Choisir la langue",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      german: "Deutsch"
    },

    // Theme
    theme: {
      toggleDark: "Passer au mode sombre",
      toggleLight: "Passer au mode clair"
    },

    // Footer
    footer: {
      rightsReserved: "Tous droits réservés.",
      description: "Contenu éducatif multilingue en arabe, anglais, français, espagnol et allemand."
    },

    // Error messages
    error: {
      title: "Erreur",
      generic: "Quelque chose s'est mal passé",
      login: "Échec de la connexion",
      register: "Échec de l'inscription",
      notFound: "Page non trouvée",
      unauthorized: "Accès non autorisé",
      savingFailed: "Échec de l'enregistrement des modifications"
    },

    // Home page
    home: {
      hero: {
        title: "Apprenez en plusieurs langues",
        subtitle: "Explorez du contenu éducatif en arabe, anglais, français, espagnol et allemand.",
        cta: "Commencer"
      },
      featuredCategories: "Catégories en vedette",
      latestArticles: "Derniers articles",
      explore: "Explorer"
    }
  },

  es: {
    // General
    general: {
      appName: "Kalima",
      back: "Volver",
      backToHome: "Volver al inicio",
      loading: "Cargando...",
      search: "Buscar",
      viewAll: "Ver todo",
      readMore: "Leer más",
      save: "Guardar",
      edit: "Editar",
      delete: "Eliminar",
      cancel: "Cancelar",
      confirm: "Confirmar",
      submit: "Enviar"
    },

    // Navigation
    nav: {
      home: "Inicio",
      categories: "Categorías",
      favorites: "Favoritos",
      profile: "Perfil",
      suggestions: "Sugerencias",
      admin: "Admin",
      logout: "Cerrar sesión"
    },

    // Authentication
    auth: {
      login: "Iniciar sesión",
      register: "Registrarse",
      logout: "Cerrar sesión",
      email: "Correo electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      displayName: "Nombre visible",
      forgotPassword: "¿Olvidaste tu contraseña?",
      noAccount: "¿No tienes una cuenta?",
      hasAccount: "¿Ya tienes una cuenta?",
      createAccount: "Crear una cuenta",
      loginNow: "Iniciar sesión ahora",
      loggedInAs: "Conectado como"
    },

    // Categories
    categories: {
      allCategories: "Todas las categorías",
      viewAll: "Ver todo",
      latest: "Lo último de",
      "language-learning": "Aprendizaje de idiomas",
      "culture": "Cultura",
      "science": "Ciencia", 
      "stories": "Cuentos",
      "tips-lifestyle": "Consejos y estilo de vida"
    },
    
    // Category Descriptions
    categoryDescriptions: {
      "language-learning": "Mejora tus habilidades lingüísticas con nuestras guías completas y recursos para estudiantes de todos los niveles.",
      "culture": "Explora diversas tradiciones culturales, costumbres y perspectivas de todo el mundo.",
      "science": "Descubre fascinantes conceptos científicos explicados de manera accesible y atractiva.",
      "stories": "Sumérgete en cautivadoras narrativas que entretienen mientras mejoran tu comprensión del idioma.",
      "tips-lifestyle": "Consejos prácticos y estrategias para mejorar tus hábitos de aprendizaje y rutinas diarias."
    },

    // Subcategories
    subcategories: {
      "vocabulary": "Vocabulario",
      "grammar": "Gramática",
      "phrases": "Frases",
      "history": "Historia",
      "food": "Comida",
      "travel": "Viajes",
      "nature": "Naturaleza",
      "technology": "Tecnología",
      "health": "Salud",
      "short-stories": "Cuentos cortos",
      "fairy-tales": "Cuentos de hadas",
      "productivity": "Productividad",
      "study-tips": "Consejos de estudio",
      "motivation": "Motivación"
    },
    
    // Subcategory Descriptions
    subcategoryDescriptions: {
      "vocabulary": "Construye tu banco de palabras con términos y expresiones esenciales para la comunicación cotidiana.",
      "grammar": "Domina las reglas y estructuras que forman la base de un uso claro y correcto del lenguaje.",
      "phrases": "Aprende expresiones prácticas y modismos que los hablantes nativos utilizan en conversaciones reales.",
      "history": "Explora eventos significativos, períodos y desarrollos culturales que moldearon las sociedades.",
      "food": "Descubre tradiciones culinarias, recetas y el significado cultural de los alimentos alrededor del mundo.",
      "travel": "Encuentra información sobre destinos, etiqueta cultural y lenguaje práctico para viajar.",
      "nature": "Aprende sobre ecosistemas, vida silvestre y fenómenos naturales en términos científicos accesibles.",
      "technology": "Comprende innovaciones modernas y conceptos digitales explicados en lenguaje sencillo.",
      "health": "Accede a información sobre bienestar, hábitos saludables y terminología médica básica.",
      "short-stories": "Disfruta de narrativas breves que entretienen mientras mejoran tu comprensión lectora.",
      "fairy-tales": "Descubre cuentos tradicionales y modernos que transmiten sabiduría cultural e imaginación.",
      "productivity": "Aprende estrategias para mejorar la eficiencia y lograr más en tus estudios y trabajo.",
      "study-tips": "Encuentra consejos prácticos para mejorar tus técnicas de aprendizaje y rendimiento académico.",
      "motivation": "Descubre enfoques para mantener el entusiasmo y superar desafíos en tu viaje de aprendizaje."
    },

    // Article
    article: {
      readMore: "Leer más",
      relatedArticles: "Artículos relacionados",
      noArticles: "No se encontraron artículos",
      notFound: "Artículo no encontrado",
      mayHaveBeenRemoved: "Este artículo puede haber sido eliminado o no está disponible.",
      translationMissing: "Traducción no disponible",
      chooseAnotherLanguage: "Por favor, elige otro idioma para este artículo.",
      availableIn: "Disponible en:",
      educationalContent: "Contenido educativo",
      linkCopied: "Enlace copiado",
      linkCopiedToClipboard: "Enlace del artículo copiado al portapapeles"
    },

    // Favorites
    favorites: {
      title: "Mis favoritos",
      empty: "Aún no has guardado ningún artículo.",
      browse: "Explorar artículos",
      loginRequired: "Inicio de sesión requerido",
      loginToSave: "Por favor, inicia sesión para guardar artículos en tus favoritos.",
      saved: "Guardado",
      save: "Guardar",
      added: "Añadido a favoritos",
      removed: "Eliminado de favoritos",
      articleSaved: "Artículo guardado en favoritos",
      articleRemoved: "Artículo eliminado de favoritos"
    },

    // Profile
    profile: {
      title: "Tu perfil",
      personalInfo: "Información personal",
      displayName: "Nombre visible",
      email: "Correo electrónico",
      favoritesCount: "Artículos guardados",
      suggestionsCount: "Sugerencias enviadas",
      memberSince: "Miembro desde",
      updateProfile: "Actualizar perfil",
      deleteAccount: "Eliminar cuenta",
      confirmDeleteAccount: "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
    },

    // Suggestions
    suggestions: {
      title: "Sugerencias de artículos",
      empty: "Aún no has enviado ninguna sugerencia de artículo.",
      new: "Sugerir nuevo artículo",
      submitted: "Tus sugerencias",
      form: {
        title: "Sugerir un artículo",
        titleLabel: "Título del artículo",
        titlePlaceholder: "Introduce un título para tu artículo",
        language: "Idioma del artículo",
        content: "Contenido del artículo",
        contentPlaceholder: "Escribe el contenido de tu artículo aquí...",
        submit: "Enviar sugerencia",
        success: "Sugerencia enviada",
        successMessage: "¡Gracias por tu contribución!"
      }
    },

    // Admin
    admin: {
      dashboard: "Panel de control",
      articles: "Artículos",
      suggestions: "Sugerencias de usuarios",
      users: "Usuarios",
      settings: "Configuración",
      createArticle: "Crear artículo",
      editArticle: "Editar artículo",
      deleteArticle: "Eliminar artículo",
      confirmDelete: "¿Estás seguro de que quieres eliminar este artículo?",
      cancel: "Cancelar",
      save: "Guardar",
      saving: "Guardando...",
      saveArticle: "Guardar artículo",
      publishArticle: "Publicar artículo",
      article: {
        title: "Título",
        titlePlaceholder: "Introduce el título del artículo",
        slug: "Slug",
        slugDescription: "Identificador amigable para la URL",
        summary: "Resumen",
        summaryPlaceholder: "Breve descripción del artículo",
        category: "Categoría",
        selectCategory: "Selecciona una categoría",
        subcategory: "Subcategoría",
        selectSubcategory: "Selecciona una subcategoría",
        content: "Contenido",
        paragraphPlaceholder: "Escribe el contenido del párrafo aquí...",
        addParagraph: "Añadir párrafo",
        availableLanguages: "Idiomas disponibles",
        draft: "Borrador",
        draftDescription: "Guardar como borrador (no visible para los usuarios)",
        featuredImage: "Imagen destacada",
        imageUrl: "URL de la imagen",
        imageUrlDescription: "Introduce una URL o busca una imagen",
        preview: "Vista previa",
        removeImage: "Eliminar imagen"
      },
      imageSearch: {
        placeholder: "Buscar una imagen",
        search: "Buscar",
        noTerm: "No hay término de búsqueda",
        enterSearchTerm: "Por favor, introduce un término de búsqueda",
        failed: "Error al buscar imágenes"
      },
      stats: {
        totalArticles: "Total de artículos",
        publishedArticles: "Artículos publicados",
        drafts: "Borradores",
        users: "Usuarios registrados",
        suggestions: "Sugerencias de usuarios",
        languages: "Idiomas"
      }
    },

    // Language
    language: {
      selectLanguage: "Seleccionar idioma",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      german: "Deutsch"
    },

    // Theme
    theme: {
      toggleDark: "Cambiar a modo oscuro",
      toggleLight: "Cambiar a modo claro"
    },

    // Footer
    footer: {
      rightsReserved: "Todos los derechos reservados.",
      description: "Contenido educativo multilingüe en árabe, inglés, francés, español y alemán."
    },

    // Error messages
    error: {
      title: "Error",
      generic: "Algo salió mal",
      login: "Error al iniciar sesión",
      register: "Error al registrarse",
      notFound: "Página no encontrada",
      unauthorized: "Acceso no autorizado",
      savingFailed: "Error al guardar cambios"
    },

    // Home page
    home: {
      hero: {
        title: "Aprende en varios idiomas",
        subtitle: "Explora contenido educativo en árabe, inglés, francés, español y alemán.",
        cta: "Comenzar"
      },
      featuredCategories: "Categorías destacadas",
      latestArticles: "Últimos artículos",
      explore: "Explorar"
    }
  },

  de: {
    // General
    general: {
      appName: "Kalima",
      back: "Zurück",
      backToHome: "Zurück zur Startseite",
      loading: "Wird geladen...",
      search: "Suchen",
      viewAll: "Alle anzeigen",
      readMore: "Mehr lesen",
      save: "Speichern",
      edit: "Bearbeiten",
      delete: "Löschen",
      cancel: "Abbrechen",
      confirm: "Bestätigen",
      submit: "Absenden"
    },

    // Navigation
    nav: {
      home: "Startseite",
      categories: "Kategorien",
      favorites: "Favoriten",
      profile: "Profil",
      suggestions: "Vorschläge",
      admin: "Admin",
      logout: "Abmelden"
    },

    // Authentication
    auth: {
      login: "Anmelden",
      register: "Registrieren",
      logout: "Abmelden",
      email: "E-Mail",
      password: "Passwort",
      confirmPassword: "Passwort bestätigen",
      displayName: "Anzeigename",
      forgotPassword: "Passwort vergessen?",
      noAccount: "Noch kein Konto?",
      hasAccount: "Bereits ein Konto?",
      createAccount: "Konto erstellen",
      loginNow: "Jetzt anmelden",
      loggedInAs: "Angemeldet als"
    },

    // Categories
    categories: {
      allCategories: "Alle Kategorien",
      viewAll: "Alle anzeigen",
      latest: "Neueste aus",
      "language-learning": "Sprachenlernen",
      "culture": "Kultur",
      "science": "Wissenschaft", 
      "stories": "Geschichten",
      "tips-lifestyle": "Tipps & Lebensstil"
    },
    
    // Category Descriptions
    categoryDescriptions: {
      "language-learning": "Verbessern Sie Ihre Sprachkenntnisse mit unseren umfassenden Leitfäden und Ressourcen für Lernende aller Niveaus.",
      "culture": "Entdecken Sie vielfältige kulturelle Traditionen, Bräuche und Perspektiven aus der ganzen Welt.",
      "science": "Entdecken Sie faszinierende wissenschaftliche Konzepte, die auf zugängliche und ansprechende Weise erklärt werden.",
      "stories": "Tauchen Sie ein in fesselnde Erzählungen, die unterhalten und gleichzeitig Ihr Sprachverständnis verbessern.",
      "tips-lifestyle": "Praktische Ratschläge und Strategien zur Verbesserung Ihrer Lerngewohnheiten und täglichen Routinen."
    },

    // Subcategories
    subcategories: {
      "vocabulary": "Vokabular",
      "grammar": "Grammatik",
      "phrases": "Redewendungen",
      "history": "Geschichte",
      "food": "Essen",
      "travel": "Reisen",
      "nature": "Natur",
      "technology": "Technologie",
      "health": "Gesundheit",
      "short-stories": "Kurzgeschichten",
      "fairy-tales": "Märchen",
      "productivity": "Produktivität",
      "study-tips": "Studientipps",
      "motivation": "Motivation"
    },

    // Article
    article: {
      readMore: "Mehr lesen",
      relatedArticles: "Ähnliche Artikel",
      noArticles: "Keine Artikel gefunden",
      notFound: "Artikel nicht gefunden",
      mayHaveBeenRemoved: "Dieser Artikel wurde möglicherweise entfernt oder ist nicht verfügbar.",
      translationMissing: "Übersetzung nicht verfügbar",
      chooseAnotherLanguage: "Bitte wähle eine andere Sprache für diesen Artikel.",
      availableIn: "Verfügbar in:",
      educationalContent: "Bildungsinhalt",
      linkCopied: "Link kopiert",
      linkCopiedToClipboard: "Artikel-Link in die Zwischenablage kopiert"
    },

    // Favorites
    favorites: {
      title: "Meine Favoriten",
      empty: "Du hast noch keine Artikel gespeichert.",
      browse: "Artikel durchsuchen",
      loginRequired: "Anmeldung erforderlich",
      loginToSave: "Bitte melde dich an, um Artikel zu deinen Favoriten hinzuzufügen.",
      saved: "Gespeichert",
      save: "Speichern",
      added: "Zu Favoriten hinzugefügt",
      removed: "Aus Favoriten entfernt",
      articleSaved: "Artikel in Favoriten gespeichert",
      articleRemoved: "Artikel aus Favoriten entfernt"
    },

    // Profile
    profile: {
      title: "Dein Profil",
      personalInfo: "Persönliche Informationen",
      displayName: "Anzeigename",
      email: "E-Mail",
      favoritesCount: "Gespeicherte Artikel",
      suggestionsCount: "Eingereichte Vorschläge",
      memberSince: "Mitglied seit",
      updateProfile: "Profil aktualisieren",
      deleteAccount: "Konto löschen",
      confirmDeleteAccount: "Bist du sicher, dass du dein Konto löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden."
    },

    // Suggestions
    suggestions: {
      title: "Artikelvorschläge",
      empty: "Du hast noch keine Artikelvorschläge eingereicht.",
      new: "Neuen Artikel vorschlagen",
      submitted: "Deine Vorschläge",
      form: {
        title: "Artikel vorschlagen",
        titleLabel: "Artikeltitel",
        titlePlaceholder: "Gib einen Titel für deinen Artikel ein",
        language: "Artikelsprache",
        content: "Artikelinhalt",
        contentPlaceholder: "Schreibe den Inhalt deines Artikels hier...",
        submit: "Vorschlag einreichen",
        success: "Vorschlag eingereicht",
        successMessage: "Danke für deinen Beitrag!"
      }
    },

    // Admin
    admin: {
      dashboard: "Dashboard",
      articles: "Artikel",
      suggestions: "Benutzervorschläge",
      users: "Benutzer",
      settings: "Einstellungen",
      createArticle: "Artikel erstellen",
      editArticle: "Artikel bearbeiten",
      deleteArticle: "Artikel löschen",
      confirmDelete: "Bist du sicher, dass du diesen Artikel löschen möchtest?",
      cancel: "Abbrechen",
      save: "Speichern",
      saving: "Wird gespeichert...",
      saveArticle: "Artikel speichern",
      publishArticle: "Artikel veröffentlichen",
      article: {
        title: "Titel",
        titlePlaceholder: "Gib den Artikeltitel ein",
        slug: "Slug",
        slugDescription: "URL-freundlicher Identifier für den Artikel",
        summary: "Zusammenfassung",
        summaryPlaceholder: "Kurze Beschreibung des Artikels",
        category: "Kategorie",
        selectCategory: "Wähle eine Kategorie",
        subcategory: "Unterkategorie",
        selectSubcategory: "Wähle eine Unterkategorie",
        content: "Inhalt",
        paragraphPlaceholder: "Schreibe den Absatzinhalt hier...",
        addParagraph: "Absatz hinzufügen",
        availableLanguages: "Verfügbare Sprachen",
        draft: "Entwurf",
        draftDescription: "Als Entwurf speichern (nicht sichtbar für Benutzer)",
        featuredImage: "Hauptbild",
        imageUrl: "Bild-URL",
        imageUrlDescription: "Gib eine URL ein oder suche nach einem Bild",
        preview: "Vorschau",
        removeImage: "Bild entfernen"
      },
      imageSearch: {
        placeholder: "Nach einem Bild suchen",
        search: "Suchen",
        noTerm: "Kein Suchbegriff",
        enterSearchTerm: "Bitte gib einen Suchbegriff ein",
        failed: "Bildsuche fehlgeschlagen"
      },
      stats: {
        totalArticles: "Gesamtzahl der Artikel",
        publishedArticles: "Veröffentlichte Artikel",
        drafts: "Entwürfe",
        users: "Registrierte Benutzer",
        suggestions: "Benutzervorschläge",
        languages: "Sprachen"
      }
    },

    // Language
    language: {
      selectLanguage: "Sprache auswählen",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      german: "Deutsch"
    },

    // Theme
    theme: {
      toggleDark: "Zum dunklen Modus wechseln",
      toggleLight: "Zum hellen Modus wechseln"
    },

    // Footer
    footer: {
      rightsReserved: "Alle Rechte vorbehalten.",
      description: "Mehrsprachige Bildungsinhalte auf Arabisch, Englisch, Französisch, Spanisch und Deutsch."
    },

    // Error messages
    error: {
      title: "Fehler",
      generic: "Etwas ist schief gelaufen",
      login: "Anmeldung fehlgeschlagen",
      register: "Registrierung fehlgeschlagen",
      notFound: "Seite nicht gefunden",
      unauthorized: "Unbefugter Zugriff",
      savingFailed: "Speichern der Änderungen fehlgeschlagen"
    },

    // Home page
    home: {
      hero: {
        title: "Lernen in mehreren Sprachen",
        subtitle: "Entdecke Bildungsinhalte auf Arabisch, Englisch, Französisch, Spanisch und Deutsch.",
        cta: "Loslegen"
      },
      featuredCategories: "Ausgewählte Kategorien",
      latestArticles: "Neueste Artikel",
      explore: "Entdecken"
    }
  }
};

export default translations;
