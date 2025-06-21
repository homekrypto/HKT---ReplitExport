export type Language = 'en' | 'es' | 'ar' | 'de' | 'fr' | 'zh';

export interface Translation {
  nav: {
    home: string;
    howItWorks: string;
    buyHkt: string;
    dashboard: string;
    connectWallet: string;
  };
  hero: {
    title: string;
    subtitle: string;
    startInvesting: string;
    learnMore: string;
    totalInvestment: string;
    finalValue: string;
    roiIn3Years: string;
  };
  footer: {
    subscribe: string;
    subscribeDesc: string;
    enterEmail: string;
    theme: string;
    language: string;
    product: string;
    resources: string;
    legal: string;
    copyright: string;
    howItWorks: string;
    investmentPlans: string;
    propertyPortfolio: string;
    tokenomics: string;
    whitepaper: string;
    smartContract: string;
    auditReports: string;
    faq: string;
    terms: string;
    privacy: string;
    riskDisclosure: string;
    contact: string;
    companyDesc: string;
    contractAddress: string;
  };
  calculator: {
    title: string;
    monthlyInvestment: string;
    investmentPeriod: string;
    calculateReturns: string;
    calculating: string;
    totalInvestment: string;
    finalValue: string;
    totalProfit: string;
    roi: string;
    hktTokens: string;
  };
  mission: {
    title: string;
    subtitle: string;
    statement: {
      title: string;
      content: string;
    };
    values: {
      title: string;
    };
    accessibility: {
      title: string;
      description: string;
    };
    transparency: {
      title: string;
      description: string;
    };
    innovation: {
      title: string;
      description: string;
    };
    returns: {
      title: string;
      description: string;
    };
    community: {
      title: string;
      description: string;
    };
    quality: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      content: string;
      point1: string;
      point2: string;
      point3: string;
    };
    stats: {
      properties: string;
      investors: string;
      countries: string;
      returns: string;
    };
    team: {
      title: string;
      ceo: string;
      cto: string;
      cfo: string;
      ceoDesc: string;
      ctoDesc: string;
      cfoDesc: string;
    };
    cta: {
      title: string;
      subtitle: string;
      invest: string;
      learn: string;
    };
  };
  toast: {
    subscribeSuccess: string;
    subscribeSuccessDesc: string;
    subscribeFailed: string;
    subscribeFailedDesc: string;
  };
}

export const translations: Record<Language, Translation> = {
  en: {
    nav: {
      home: 'Home',
      howItWorks: 'How It Works',
      buyHkt: 'Buy HKT',
      dashboard: 'Dashboard',
      connectWallet: 'Connect Wallet',
    },
    hero: {
      title: 'Own Real Estate Through Blockchain',
      subtitle: 'Invest in premium property with Home Krypto Token (HKT). Start with just $106.83/month and own shares in high-value real estate assets.',
      startInvesting: 'Start Investing Now',
      learnMore: 'Learn More',
      totalInvestment: 'Total Investment',
      finalValue: 'Final Value',
      roiIn3Years: 'ROI in 3 Years',
    },
    footer: {
      subscribe: 'Stay Updated',
      subscribeDesc: 'Get the latest HKT news and investment opportunities.',
      enterEmail: 'Enter your email',
      theme: 'Theme',
      language: 'Language',
      product: 'Product',
      resources: 'Resources',
      legal: 'Legal',
      copyright: 'Home Krypto Token (HKT). All rights reserved.',
      howItWorks: 'How It Works',
      investmentPlans: 'Investment Plans',
      propertyPortfolio: 'Property Portfolio',
      tokenomics: 'Tokenomics',
      whitepaper: 'Whitepaper',
      smartContract: 'Smart Contract',
      auditReports: 'Audit Reports',
      faq: 'FAQ',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      riskDisclosure: 'Risk Disclosure',
      contact: 'Contact Us',
      companyDesc: 'Revolutionizing real estate investment through blockchain technology.',
      contractAddress: 'Smart Contract Address: 0x1234...abcd (Ethereum Network)',
    },
    calculator: {
      title: 'Investment Calculator',
      monthlyInvestment: 'Monthly Investment',
      investmentPeriod: 'Investment Period',
      calculateReturns: 'Calculate Returns',
      calculating: 'Calculating...',
      totalInvestment: 'Total Investment:',
      finalValue: 'Final Value:',
      totalProfit: 'Total Profit:',
      roi: 'ROI:',
      hktTokens: 'HKT Tokens:',
    },
    toast: {
      subscribeSuccess: 'Successfully subscribed!',
      subscribeSuccessDesc: "You'll receive updates about HKT and investment opportunities.",
      subscribeFailed: 'Subscription failed',
      subscribeFailedDesc: 'Please try again later.',
    },
    mission: {
      title: 'Our Mission',
      subtitle: 'Democratizing real estate investment through blockchain technology, making premium property ownership accessible to everyone, everywhere.',
      statement: {
        title: 'Mission Statement',
        content: 'To revolutionize real estate investment by providing transparent, accessible, and profitable opportunities through innovative blockchain technology, enabling anyone to build wealth through premium property ownership.'
      },
      values: {
        title: 'Our Core Values'
      },
      accessibility: {
        title: 'Accessibility',
        description: 'Breaking down barriers to real estate investment with low minimum investments starting at $106.83/month.'
      },
      transparency: {
        title: 'Transparency',
        description: 'Full blockchain transparency with real-time tracking of investments, returns, and property performance.'
      },
      innovation: {
        title: 'Innovation',
        description: 'Leveraging cutting-edge blockchain technology to create new possibilities in real estate investment.'
      },
      returns: {
        title: 'Sustainable Returns',
        description: 'Delivering consistent 15% annual returns through strategic property selection and professional management.'
      },
      community: {
        title: 'Community First',
        description: 'Building a global community of investors who share in the success of premium real estate opportunities.'
      },
      quality: {
        title: 'Quality Properties',
        description: 'Carefully curated portfolio of high-value properties in prime locations with strong growth potential.'
      },
      vision: {
        title: 'Our Vision',
        content: 'We envision a future where anyone, regardless of their location or financial background, can participate in the wealth-building opportunities that real estate provides.',
        point1: 'Global accessibility to premium real estate markets',
        point2: 'Transparent and fair investment opportunities for all',
        point3: 'Sustainable wealth building through property ownership'
      },
      stats: {
        properties: 'Property Value',
        investors: 'Active Investors',
        countries: 'Countries',
        returns: 'Avg. Returns'
      },
      team: {
        title: 'Leadership Team',
        ceo: 'Chief Executive Officer',
        cto: 'Chief Technology Officer',
        cfo: 'Chief Financial Officer',
        ceoDesc: '15+ years in real estate development and blockchain innovation, leading the vision for democratized property investment.',
        ctoDesc: 'Former blockchain architect at major fintech companies, ensuring secure and scalable technology infrastructure.',
        cfoDesc: 'Wall Street veteran with expertise in real estate finance and investment strategy, optimizing returns for all stakeholders.'
      },
      cta: {
        title: 'Join the Real Estate Revolution',
        subtitle: 'Start building your property portfolio today with HKT tokens',
        invest: 'Start Investing',
        learn: 'Learn More'
      }
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      howItWorks: 'Cómo Funciona',
      buyHkt: 'Comprar HKT',
      dashboard: 'Panel',
      connectWallet: 'Conectar Billetera',
    },
    hero: {
      title: 'Posee Bienes Raíces a Través de Blockchain',
      subtitle: 'Invierte en propiedades premium con Home Krypto Token (HKT). Comienza con solo $106.83/mes y posee acciones en activos inmobiliarios de alto valor.',
      startInvesting: 'Comenzar a Invertir',
      learnMore: 'Saber Más',
      totalInvestment: 'Inversión Total',
      finalValue: 'Valor Final',
      roiIn3Years: 'ROI en 3 Años',
    },
    footer: {
      subscribe: 'Manténgase Actualizado',
      subscribeDesc: 'Reciba las últimas noticias de HKT y oportunidades de inversión.',
      enterEmail: 'Ingrese su email',
      theme: 'Tema',
      language: 'Idioma',
      product: 'Producto',
      resources: 'Recursos',
      legal: 'Legal',
      copyright: 'Home Krypto Token (HKT). Todos los derechos reservados.',
      howItWorks: 'Cómo Funciona',
      investmentPlans: 'Planes de Inversión',
      propertyPortfolio: 'Portafolio de Propiedades',
      tokenomics: 'Tokenomics',
      whitepaper: 'Libro Blanco',
      smartContract: 'Contrato Inteligente',
      auditReports: 'Reportes de Auditoría',
      faq: 'Preguntas Frecuentes',
      terms: 'Términos de Servicio',
      privacy: 'Política de Privacidad',
      riskDisclosure: 'Divulgación de Riesgos',
      contact: 'Contáctanos',
      companyDesc: 'Revolucionando la inversión inmobiliaria a través de la tecnología blockchain.',
      contractAddress: 'Dirección del Contrato Inteligente: 0x1234...abcd (Red Ethereum)',
    },
    calculator: {
      title: 'Calculadora de Inversión',
      monthlyInvestment: 'Inversión Mensual',
      investmentPeriod: 'Período de Inversión',
      calculateReturns: 'Calcular Retornos',
      calculating: 'Calculando...',
      totalInvestment: 'Inversión Total:',
      finalValue: 'Valor Final:',
      totalProfit: 'Ganancia Total:',
      roi: 'ROI:',
      hktTokens: 'Tokens HKT:',
    },
    toast: {
      subscribeSuccess: '¡Suscripción exitosa!',
      subscribeSuccessDesc: 'Recibirá actualizaciones sobre HKT y oportunidades de inversión.',
      subscribeFailed: 'Falló la suscripción',
      subscribeFailedDesc: 'Por favor intente de nuevo más tarde.',
    },
    mission: {
      title: 'Nuestra Misión',
      subtitle: 'Democratizando la inversión inmobiliaria a través de la tecnología blockchain, haciendo accesible la propiedad premium para todos, en todas partes.',
      statement: {
        title: 'Declaración de Misión',
        content: 'Revolucionar la inversión inmobiliaria proporcionando oportunidades transparentes, accesibles y rentables a través de tecnología blockchain innovadora, permitiendo que cualquiera construya riqueza a través de la propiedad premium.'
      },
      values: {
        title: 'Nuestros Valores Fundamentales'
      },
      accessibility: {
        title: 'Accesibilidad',
        description: 'Eliminando barreras a la inversión inmobiliaria con inversiones mínimas bajas comenzando en $106.83/mes.'
      },
      transparency: {
        title: 'Transparencia',
        description: 'Transparencia completa de blockchain con seguimiento en tiempo real de inversiones, rendimientos y rendimiento de propiedades.'
      },
      innovation: {
        title: 'Innovación',
        description: 'Aprovechando la tecnología blockchain de vanguardia para crear nuevas posibilidades en inversión inmobiliaria.'
      },
      returns: {
        title: 'Rendimientos Sostenibles',
        description: 'Entregando rendimientos anuales consistentes del 15% a través de selección estratégica de propiedades y gestión profesional.'
      },
      community: {
        title: 'Comunidad Primero',
        description: 'Construyendo una comunidad global de inversores que comparten el éxito de oportunidades inmobiliarias premium.'
      },
      quality: {
        title: 'Propiedades de Calidad',
        description: 'Portafolio cuidadosamente curado de propiedades de alto valor en ubicaciones prime con fuerte potencial de crecimiento.'
      },
      vision: {
        title: 'Nuestra Visión',
        content: 'Visualizamos un futuro donde cualquiera, independientemente de su ubicación o trasfondo financiero, pueda participar en las oportunidades de construcción de riqueza que proporciona el sector inmobiliario.',
        point1: 'Accesibilidad global a mercados inmobiliarios premium',
        point2: 'Oportunidades de inversión transparentes y justas para todos',
        point3: 'Construcción sostenible de riqueza a través de la propiedad'
      },
      stats: {
        properties: 'Valor de Propiedades',
        investors: 'Inversores Activos',
        countries: 'Países',
        returns: 'Rendimientos Promedio'
      },
      team: {
        title: 'Equipo de Liderazgo',
        ceo: 'Director Ejecutivo',
        cto: 'Director de Tecnología',
        cfo: 'Director Financiero',
        ceoDesc: '15+ años en desarrollo inmobiliario e innovación blockchain, liderando la visión para inversión inmobiliaria democratizada.',
        ctoDesc: 'Ex-arquitecto blockchain en importantes empresas fintech, asegurando infraestructura tecnológica segura y escalable.',
        cfoDesc: 'Veterano de Wall Street con experiencia en finanzas inmobiliarias y estrategia de inversión, optimizando rendimientos para todos los stakeholders.'
      },
      cta: {
        title: 'Únete a la Revolución Inmobiliaria',
        subtitle: 'Comienza a construir tu portafolio inmobiliario hoy con tokens HKT',
        invest: 'Comenzar a Invertir',
        learn: 'Aprender Más'
      }
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      howItWorks: 'كيف يعمل',
      buyHkt: 'شراء HKT',
      dashboard: 'لوحة التحكم',
      connectWallet: 'ربط المحفظة',
    },
    hero: {
      title: 'امتلك العقارات من خلال البلوك تشين',
      subtitle: 'استثمر في العقارات الفاخرة مع رمز هوم كريبتو (HKT). ابدأ بـ 106.83 دولار فقط شهريًا واحصل على حصص في أصول عقارية عالية القيمة.',
      startInvesting: 'ابدأ الاستثمار الآن',
      learnMore: 'اعرف أكثر',
      totalInvestment: 'إجمالي الاستثمار',
      finalValue: 'القيمة النهائية',
      roiIn3Years: 'العائد في 3 سنوات',
    },
    footer: {
      subscribe: 'ابق على اطلاع',
      subscribeDesc: 'احصل على آخر أخبار HKT وفرص الاستثمار.',
      enterEmail: 'أدخل بريدك الإلكتروني',
      theme: 'المظهر',
      language: 'اللغة',
      product: 'المنتج',
      resources: 'الموارد',
      legal: 'قانوني',
      copyright: 'رمز هوم كريبتو (HKT). جميع الحقوق محفوظة.',
      howItWorks: 'كيف يعمل',
      investmentPlans: 'خطط الاستثمار',
      propertyPortfolio: 'محفظة العقارات',
      tokenomics: 'اقتصاد الرمز',
      whitepaper: 'الورقة البيضاء',
      smartContract: 'العقد الذكي',
      auditReports: 'تقارير التدقيق',
      faq: 'الأسئلة الشائعة',
      terms: 'شروط الخدمة',
      privacy: 'سياسة الخصوصية',
      riskDisclosure: 'الكشف عن المخاطر',
      contact: 'اتصل بنا',
      companyDesc: 'نثوّر استثمار العقارات من خلال تقنية البلوك تشين.',
      contractAddress: 'عنوان العقد الذكي: 0x1234...abcd (شبكة إيثريوم)',
    },
    calculator: {
      title: 'حاسبة الاستثمار',
      monthlyInvestment: 'الاستثمار الشهري',
      investmentPeriod: 'فترة الاستثمار',
      calculateReturns: 'احسب العوائد',
      calculating: 'جاري الحساب...',
      totalInvestment: 'إجمالي الاستثمار:',
      finalValue: 'القيمة النهائية:',
      totalProfit: 'إجمالي الربح:',
      roi: 'العائد على الاستثمار:',
      hktTokens: 'رموز HKT:',
    },
    toast: {
      subscribeSuccess: 'تم الاشتراك بنجاح!',
      subscribeSuccessDesc: 'ستتلقى تحديثات حول HKT وفرص الاستثمار.',
      subscribeFailed: 'فشل الاشتراك',
      subscribeFailedDesc: 'يرجى المحاولة مرة أخرى لاحقًا.',
    },
  },
  de: {
    nav: {
      home: 'Startseite',
      howItWorks: 'Wie es funktioniert',
      buyHkt: 'HKT kaufen',
      dashboard: 'Dashboard',
      connectWallet: 'Wallet verbinden',
    },
    hero: {
      title: 'Immobilien über Blockchain besitzen',
      subtitle: 'Investieren Sie in Premium-Immobilien mit Home Krypto Token (HKT). Beginnen Sie mit nur 106,83 $/Monat und besitzen Sie Anteile an hochwertigen Immobilien.',
      startInvesting: 'Jetzt investieren',
      learnMore: 'Mehr erfahren',
      totalInvestment: 'Gesamtinvestition',
      finalValue: 'Endwert',
      roiIn3Years: 'ROI in 3 Jahren',
    },
    footer: {
      subscribe: 'Auf dem Laufenden bleiben',
      subscribeDesc: 'Erhalten Sie die neuesten HKT-Nachrichten und Investitionsmöglichkeiten.',
      enterEmail: 'E-Mail eingeben',
      theme: 'Design',
      language: 'Sprache',
      product: 'Produkt',
      resources: 'Ressourcen',
      legal: 'Rechtliches',
      copyright: 'Home Krypto Token (HKT). Alle Rechte vorbehalten.',
      howItWorks: 'Wie es funktioniert',
      investmentPlans: 'Investitionspläne',
      propertyPortfolio: 'Immobilienportfolio',
      tokenomics: 'Tokenomics',
      whitepaper: 'Whitepaper',
      smartContract: 'Smart Contract',
      auditReports: 'Audit-Berichte',
      faq: 'FAQ',
      terms: 'Nutzungsbedingungen',
      privacy: 'Datenschutzrichtlinie',
      riskDisclosure: 'Risikoangaben',
      contact: 'Kontakt',
      companyDesc: 'Revolutionierung von Immobilieninvestitionen durch Blockchain-Technologie.',
      contractAddress: 'Smart Contract Adresse: 0x1234...abcd (Ethereum Netzwerk)',
    },
    calculator: {
      title: 'Investitionsrechner',
      monthlyInvestment: 'Monatliche Investition',
      investmentPeriod: 'Investitionszeitraum',
      calculateReturns: 'Renditen berechnen',
      calculating: 'Berechnung...',
      totalInvestment: 'Gesamtinvestition:',
      finalValue: 'Endwert:',
      totalProfit: 'Gesamtgewinn:',
      roi: 'ROI:',
      hktTokens: 'HKT-Token:',
    },
    toast: {
      subscribeSuccess: 'Erfolgreich abonniert!',
      subscribeSuccessDesc: 'Sie erhalten Updates über HKT und Investitionsmöglichkeiten.',
      subscribeFailed: 'Abonnement fehlgeschlagen',
      subscribeFailedDesc: 'Bitte versuchen Sie es später erneut.',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      howItWorks: 'Comment ça marche',
      buyHkt: 'Acheter HKT',
      dashboard: 'Tableau de bord',
      connectWallet: 'Connecter le portefeuille',
    },
    hero: {
      title: 'Posséder de l\'immobilier via la blockchain',
      subtitle: 'Investissez dans l\'immobilier premium avec Home Krypto Token (HKT). Commencez avec seulement 106,83 $/mois et possédez des parts dans des actifs immobiliers de grande valeur.',
      startInvesting: 'Commencer à investir',
      learnMore: 'En savoir plus',
      totalInvestment: 'Investissement total',
      finalValue: 'Valeur finale',
      roiIn3Years: 'ROI en 3 ans',
    },
    footer: {
      subscribe: 'Restez informé',
      subscribeDesc: 'Recevez les dernières nouvelles HKT et opportunités d\'investissement.',
      enterEmail: 'Entrez votre email',
      theme: 'Thème',
      language: 'Langue',
      product: 'Produit',
      resources: 'Ressources',
      legal: 'Légal',
      copyright: 'Home Krypto Token (HKT). Tous droits réservés.',
      howItWorks: 'Comment ça marche',
      investmentPlans: 'Plans d\'investissement',
      propertyPortfolio: 'Portefeuille immobilier',
      tokenomics: 'Tokenomics',
      whitepaper: 'Livre blanc',
      smartContract: 'Contrat intelligent',
      auditReports: 'Rapports d\'audit',
      faq: 'FAQ',
      terms: 'Conditions d\'utilisation',
      privacy: 'Politique de confidentialité',
      riskDisclosure: 'Divulgation des risques',
      contact: 'Nous contacter',
      companyDesc: 'Révolutionner l\'investissement immobilier grâce à la technologie blockchain.',
      contractAddress: 'Adresse du contrat intelligent: 0x1234...abcd (Réseau Ethereum)',
    },
    calculator: {
      title: 'Calculateur d\'investissement',
      monthlyInvestment: 'Investissement mensuel',
      investmentPeriod: 'Période d\'investissement',
      calculateReturns: 'Calculer les rendements',
      calculating: 'Calcul en cours...',
      totalInvestment: 'Investissement total:',
      finalValue: 'Valeur finale:',
      totalProfit: 'Profit total:',
      roi: 'ROI:',
      hktTokens: 'Jetons HKT:',
    },
    toast: {
      subscribeSuccess: 'Abonnement réussi!',
      subscribeSuccessDesc: 'Vous recevrez des mises à jour sur HKT et les opportunités d\'investissement.',
      subscribeFailed: 'Échec de l\'abonnement',
      subscribeFailedDesc: 'Veuillez réessayer plus tard.',
    },
  },
  zh: {
    nav: {
      home: '首页',
      howItWorks: '工作原理',
      buyHkt: '购买 HKT',
      dashboard: '仪表板',
      connectWallet: '连接钱包',
    },
    hero: {
      title: '通过区块链拥有房地产',
      subtitle: '通过家庭加密代币(HKT)投资优质房地产。仅需每月106.83美元即可拥有高价值房地产资产的股份。',
      startInvesting: '立即开始投资',
      learnMore: '了解更多',
      totalInvestment: '总投资',
      finalValue: '最终价值',
      roiIn3Years: '3年投资回报率',
    },
    footer: {
      subscribe: '保持更新',
      subscribeDesc: '获取最新的HKT新闻和投资机会。',
      enterEmail: '输入您的邮箱',
      theme: '主题',
      language: '语言',
      product: '产品',
      resources: '资源',
      legal: '法律',
      copyright: '家庭加密代币(HKT)。保留所有权利。',
      howItWorks: '工作原理',
      investmentPlans: '投资计划',
      propertyPortfolio: '房地产投资组合',
      tokenomics: '代币经济学',
      whitepaper: '白皮书',
      smartContract: '智能合约',
      auditReports: '审计报告',
      faq: '常见问题',
      terms: '服务条款',
      privacy: '隐私政策',
      riskDisclosure: '风险披露',
      contact: '联系我们',
      companyDesc: '通过区块链技术革命化房地产投资。',
      contractAddress: '智能合约地址: 0x1234...abcd (以太坊网络)',
    },
    calculator: {
      title: '投资计算器',
      monthlyInvestment: '月投资额',
      investmentPeriod: '投资期间',
      calculateReturns: '计算收益',
      calculating: '计算中...',
      totalInvestment: '总投资:',
      finalValue: '最终价值:',
      totalProfit: '总利润:',
      roi: '投资回报率:',
      hktTokens: 'HKT代币:',
    },
    toast: {
      subscribeSuccess: '订阅成功！',
      subscribeSuccessDesc: '您将收到关于HKT和投资机会的更新。',
      subscribeFailed: '订阅失败',
      subscribeFailedDesc: '请稍后再试。',
    },
  },
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  ar: 'العربية',
  de: 'Deutsch',
  fr: 'Français',
  zh: '中文',
};