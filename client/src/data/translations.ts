// Translations for UI elements in multiple languages

const translations = {
  en: {
    // General
    general: {
      appName: "Kalima Online",
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
      submit: "Submit",
      browseSubcategory: "Browse"
    },
    
    // Search
    search: {
      search: "Search",
      searchArticles: "Search Articles",
      typeToSearch: "Type to search...",
      noResults: "No results found",
      enterSearchTerm: "Enter at least 2 characters to search",
      searching: "Searching...",
      pressToSearch: "Press ⌘K to search",
      results: "Search Results",
      result: "Result",
      seeAllResults: "See All Results",
      for: "for",
      tryDifferentTerms: "Try different search terms"
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
      "tips-lifestyle": "Tips & Lifestyle",
      "history": "History",
      "food": "Food",
      "technology": "Technology",
      "health": "Health",
      "education": "Education"
    
    },
    categoryDescriptions: {
      "language-learning": "Learn new languages and improve your language skills.",
      "culture": "Explore different cultures and traditions around the world.",
      "science": "Discover fascinating scientific concepts and innovations.",
      "stories": "Enjoy a variety of engaging stories and narratives.",
      "tips-lifestyle": "Get practical tips and advice on improving your lifestyle.",
      "education": "Educational content for students and learners.",
      "technology": "Stay updated with the latest technology trends and gadgets.",
      "health": "Learn about health and wellness, including fitness and nutrition.",
      "history": "Explore historical events and figures from around the world.",
      "food": "Discover delicious recipes and cooking tips from various cuisines."
      
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
        title: "Kalima online, Your Window to the World",
        subtitle: "Read, Learn, Share. Kalima Online connects global voices through knowledge without language barriers.",
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
    
    // Search
    search: {
      search: "بحث",
      searchArticles: "البحث في المقالات",
      typeToSearch: "اكتب للبحث...",
      noResults: "لم يتم العثور على نتائج",
      enterSearchTerm: "أدخل حرفين على الأقل للبحث",
      searching: "جاري البحث...",
      pressToSearch: "اضغط ⌘K للبحث",
      results: "نتائج البحث",
      result: "نتيجة",
      seeAllResults: "مشاهدة كل النتائج",
      for: "عن",
      tryDifferentTerms: "حاول استخدام كلمات بحث مختلفة"
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
        title: "كلمة أونلاين، نافذتك إلى العالم",
        subtitle: "اقرأ، تعلّم، وشارك. كلمة أونلاين تربط بين الأصوات العالمية من خلال المعرفة بلا حواجز لغوية.",
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
    
    // Search
    search: {
      search: "Rechercher",
      searchArticles: "Rechercher des Articles",
      typeToSearch: "Tapez pour rechercher...",
      noResults: "Aucun résultat trouvé",
      enterSearchTerm: "Saisissez au moins 2 caractères pour rechercher",
      searching: "Recherche en cours...",
      pressToSearch: "Appuyez sur ⌘K pour rechercher",
      results: "Résultats de Recherche",
      result: "Résultat",
      seeAllResults: "Voir Tous les Résultats",
      for: "pour",
      tryDifferentTerms: "Essayez des termes de recherche différents"
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
        title: "Kalima Online, votre fenêtre sur le monde",
        subtitle: "Lisez. Apprenez. Partagez. Kalima connecte les voix du monde à travers le savoir sans barrières linguistiques.",
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
    
    // Search
    search: {
      search: "Buscar",
      searchArticles: "Buscar Artículos",
      typeToSearch: "Escribe para buscar...",
      noResults: "No se encontraron resultados",
      enterSearchTerm: "Introduce al menos 2 caracteres para buscar",
      searching: "Buscando...",
      pressToSearch: "Presiona ⌘K para buscar",
      results: "Resultados de Búsqueda",
      result: "Resultado",
      seeAllResults: "Ver Todos los Resultados",
      for: "para",
      tryDifferentTerms: "Intenta con términos de búsqueda diferentes"
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
        title: "Kalima Online, tu ventana al mundo",
        subtitle: "Lee. Aprende. Comparte. Kalima conecta voces globales a través del conocimiento sin barreras de idioma.",
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
    
    // Search
    search: {
      search: "Suchen",
      searchArticles: "Artikel Suchen",
      typeToSearch: "Tippen zum Suchen...",
      noResults: "Keine Ergebnisse gefunden",
      enterSearchTerm: "Geben Sie mindestens 2 Zeichen ein, um zu suchen",
      searching: "Suche läuft...",
      pressToSearch: "Drücken Sie ⌘K zum Suchen",
      results: "Suchergebnisse",
      result: "Ergebnis",
      seeAllResults: "Alle Ergebnisse anzeigen",
      for: "für",
      tryDifferentTerms: "Versuchen Sie andere Suchbegriffe"
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
        title: "Kalima Online– Dein Fenster zur Welt",
        subtitle: "Lies. Lerne. Teile. Kalima Online verbindet weltweite Stimmen durch Wissen — ohne Sprachbarrieren.",
        cta: "Loslegen"
      },
      featuredCategories: "Ausgewählte Kategorien",
      latestArticles: "Neueste Artikel",
      explore: "Entdecken"
    }
  }
};

export default translations;
