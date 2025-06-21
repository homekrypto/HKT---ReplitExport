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