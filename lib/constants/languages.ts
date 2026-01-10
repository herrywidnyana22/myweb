export interface Language {
  code: string;
  name: string;
  flag: string; // Emoji flag
  countryCode: string; // ISO 3166-1 alpha-2 country code for flag CDN
  nativeName: string;
}

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', countryCode: 'gb', nativeName: 'English' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', countryCode: 'id', nativeName: 'Bahasa Indonesia' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', countryCode: 'jp', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', countryCode: 'cn', nativeName: '中文' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', countryCode: 'kr', nativeName: '한국어' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', countryCode: 'es', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', countryCode: 'fr', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', countryCode: 'de', nativeName: 'Deutsch' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', countryCode: 'sa', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', countryCode: 'pt', nativeName: 'Português' },
];

export const DEFAULT_LANGUAGE = 'id'; // Indonesian as source
export const MAX_TRANSLATION_LANGUAGES = 3;

// Multilingual text type
export type MultiLangText = {
  source: string;
  [key: string]: string; // Dynamic language codes
};

// Helper to get text in specific language with fallback
export function getLocalizedText(
  text: string | MultiLangText | null | undefined,
  language: string,
  fallbackLanguage = DEFAULT_LANGUAGE
): string {
  if (!text) return '';
  
  // If it's a plain string, return it
  if (typeof text === 'string') return text;
  
  // If it's a multilingual object
  if (typeof text === 'object') {
    // Try requested language
    if (text[language]) return text[language];
    
    // Try fallback language
    if (text[fallbackLanguage]) return text[fallbackLanguage];
    
    // Try source
    if (text.source) return text.source;
    
    // Return any available language
    const keys = Object.keys(text);
    if (keys.length > 0) return text[keys[0]];
  }
  
  return '';
}

// Helper to create multilingual text object
export function createMultiLangText(sourceText: string): MultiLangText {
  return { source: sourceText };
}

// Multilingual UI Text
export const multiLangUIText: Record<string, MultiLangText> = {
  quote: {
    source: 'Just a guy who loves coding & running 🏃‍♂️💻',
    id: 'Hanya seorang pria yang suka coding & lari 🏃‍♂️💻',
    en: 'Just a guy who loves coding & running 🏃‍♂️💻',
    ja: 'コーディングとランニングが好きな男 🏃‍♂️💻',
    zh: '一个热爱编程和跑步的人 🏃‍♂️💻',
    ko: '코딩과 러닝을 좋아하는 남자 🏃‍♂️💻',
    es: 'Solo un chico que ama programar y correr 🏃‍♂️💻',
    fr: 'Juste un gars qui aime coder et courir 🏃‍♂️💻',
    de: 'Nur ein Typ, der Programmieren und Laufen liebt 🏃‍♂️💻',
    ar: 'مجرد رجل يحب البرمجة والجري 🏃‍♂️💻',
    pt: 'Apenas um cara que ama programar e correr 🏃‍♂️💻',
  },

  sendPlaceholder: {
    source: 'Sini-sini kenalan sama aku...',
    id: 'Sini-sini kenalan sama aku...',
    en: 'Come on, let\'s get to know each other...',
    ja: 'さあ、知り合いましょう...',
    zh: '来吧，让我们互相认识...',
    ko: '자, 서로 알아가요...',
    es: 'Vamos, conozcámonos...',
    fr: 'Allez, faisons connaissance...',
    de: 'Komm, lass uns kennenlernen...',
    ar: 'تعال، دعنا نتعرف على بعضنا...',
    pt: 'Vamos, vamos nos conhecer...',
  },

  clearChatConfirm: {
    source: 'Yakin ingin menghapus semua chat ini?',
    id: 'Yakin ingin menghapus semua chat ini?',
    en: 'Are you sure you want to delete all these chats?',
    ja: 'すべてのチャットを削除してもよろしいですか？',
    zh: '您确定要删除所有这些聊天吗？',
    ko: '이 모든 채팅을 삭제하시겠습니까?',
    es: '¿Estás seguro de que quieres eliminar todos estos chats?',
    fr: 'Êtes-vous sûr de vouloir supprimer tous ces chats?',
    de: 'Möchten Sie wirklich alle diese Chats löschen?',
    ar: 'هل أنت متأكد أنك تريد حذف كل هذه المحادثات؟',
    pt: 'Tem certeza de que deseja excluir todos esses chats?',
  },

  emptyMessage: {
    source: 'Belum ada pesan nih kak...',
    id: 'Belum ada pesan nih kak...',
    en: 'No messages yet...',
    ja: 'まだメッセージがありません...',
    zh: '还没有消息...',
    ko: '아직 메시지가 없습니다...',
    es: 'Aún no hay mensajes...',
    fr: 'Pas encore de messages...',
    de: 'Noch keine Nachrichten...',
    ar: 'لا توجد رسائل بعد...',
    pt: 'Ainda sem mensagens...',
  },

  minimize: {
    source: 'Perkecil',
    id: 'Perkecil',
    en: 'Minimize',
    ja: '最小化',
    zh: '最小化',
    ko: '최소화',
    es: 'Minimizar',
    fr: 'Réduire',
    de: 'Minimieren',
    ar: 'تصغير',
    pt: 'Minimizar',
  },

  clear: {
    source: 'Hapus Chat',
    id: 'Hapus Chat',
    en: 'Clear Chat',
    ja: 'チャットをクリア',
    zh: '清除聊天',
    ko: '채팅 지우기',
    es: 'Limpiar Chat',
    fr: 'Effacer le Chat',
    de: 'Chat löschen',
    ar: 'مسح المحادثة',
    pt: 'Limpar Chat',
  },

  welcome: {
    source: 'Selamat datang 👋',
    id: 'Selamat datang 👋',
    en: 'Welcome 👋',
    ja: 'ようこそ 👋',
    zh: '欢迎 👋',
    ko: '환영합니다 👋',
    es: 'Bienvenido 👋',
    fr: 'Bienvenue 👋',
    de: 'Willkommen 👋',
    ar: 'أهلا وسهلا 👋',
    pt: 'Bem-vindo 👋',
  },

  description: {
    source: 'Kenalan yuk, kak!',
    id: 'Kenalan yuk, kak!',
    en: 'Let\'s get to know each other!',
    ja: '知り合いましょう！',
    zh: '让我们互相认识吧！',
    ko: '서로 알아가요!',
    es: '¡Conozcámonos!',
    fr: 'Faisons connaissance!',
    de: 'Lass uns kennenlernen!',
    ar: 'دعونا نتعرف على بعضنا البعض!',
    pt: 'Vamos nos conhecer!',
  },

  confirmLang: {
    source: 'Apakah kamu ingin mengubah semua konten website',
    id: 'Apakah kamu ingin mengubah semua konten website',
    en: 'Do you want to change all website content',
    ja: 'すべてのウェブサイトコンテンツを変更しますか',
    zh: '您想更改所有网站内容吗',
    ko: '모든 웹사이트 콘텐츠를 변경하시겠습니까',
    es: '¿Quieres cambiar todo el contenido del sitio web',
    fr: 'Voulez-vous changer tout le contenu du site web',
    de: 'Möchten Sie alle Website-Inhalte ändern',
    ar: 'هل تريد تغيير كل محتوى الموقع',
    pt: 'Você quer mudar todo o conteúdo do site',
  },

  cancel: {
    source: 'Batal',
    id: 'Batal',
    en: 'Cancel',
    ja: 'キャンセル',
    zh: '取消',
    ko: '취소',
    es: 'Cancelar',
    fr: 'Annuler',
    de: 'Abbrechen',
    ar: 'إلغاء',
    pt: 'Cancelar',
  },

  confirm: {
    source: 'Konfirmasi',
    id: 'Konfirmasi',
    en: 'Confirm',
    ja: '確認',
    zh: '确认',
    ko: '확인',
    es: 'Confirmar',
    fr: 'Confirmer',
    de: 'Bestätigen',
    ar: 'تأكيد',
    pt: 'Confirmar',
  },

  langSwitched: {
    source: 'Sip! Aku sudah ganti semua konten website',
    id: 'Sip! Aku sudah ganti semua konten website',
    en: 'Done! I\'ve changed all website content',
    ja: '完了！すべてのウェブサイトコンテンツを変更しました',
    zh: '完成！我已经更改了所有网站内容',
    ko: '완료! 모든 웹사이트 콘텐츠를 변경했습니다',
    es: '¡Listo! He cambiado todo el contenido del sitio web',
    fr: 'Terminé! J\'ai changé tout le contenu du site web',
    de: 'Fertig! Ich habe alle Website-Inhalte geändert',
    ar: 'تم! لقد قمت بتغيير كل محتوى الموقع',
    pt: 'Feito! Eu mudei todo o conteúdo do site',
  },

  langStatus: {
    source: 'Bahasa saat ini',
    id: 'Bahasa saat ini',
    en: 'Current language',
    ja: '現在の言語',
    zh: '当前语言',
    ko: '현재 언어',
    es: 'Idioma actual',
    fr: 'Langue actuelle',
    de: 'Aktuelle Sprache',
    ar: 'اللغة الحالية',
    pt: 'Idioma atual',
  },

  translateOnProgressConfirm: {
    source: 'Mohon tunggu ya, lagi menerjemahkan konten...',
    id: 'Mohon tunggu ya, lagi menerjemahkan konten...',
    en: 'Please wait, translating content...',
    ja: 'お待ちください、コンテンツを翻訳しています...',
    zh: '请稍候，正在翻译内容...',
    ko: '잠시만 기다려주세요, 콘텐츠를 번역하고 있습니다...',
    es: 'Por favor espera, traduciendo contenido...',
    fr: 'Veuillez patienter, traduction du contenu en cours...',
    de: 'Bitte warten Sie, Inhalt wird übersetzt...',
    ar: 'يرجى الانتظار، جارٍ ترجمة المحتوى...',
    pt: 'Por favor aguarde, traduzindo conteúdo...',
  },

  actionCanceled: {
    source: 'Oke, request saya batalkan 👍',
    id: 'Oke, request saya batalkan 👍',
    en: 'Okay, I\'ve canceled the request 👍',
    ja: 'わかりました、リクエストをキャンセルしました 👍',
    zh: '好的，我已取消请求 👍',
    ko: '알겠습니다, 요청을 취소했습니다 👍',
    es: 'Vale, he cancelado la solicitud 👍',
    fr: 'D\'accord, j\'ai annulé la demande 👍',
    de: 'Okay, ich habe die Anfrage abgebrochen 👍',
    ar: 'حسنًا، لقد ألغيت الطلب 👍',
    pt: 'Ok, eu cancelei a solicitação 👍',
  },

  forwarding: {
    source: 'Diteruskan ke',
    id: 'Diteruskan ke',
    en: 'Forwarded to',
    ja: '転送先',
    zh: '转发至',
    ko: '전달됨',
    es: 'Reenviado a',
    fr: 'Transféré à',
    de: 'Weitergeleitet an',
    ar: 'تم التحويل إلى',
    pt: 'Encaminhado para',
  },

  telegramStatus: {
    source: 'Terhubung ke Telegram',
    id: 'Terhubung ke Telegram',
    en: 'Connected to Telegram',
    ja: 'Telegramに接続されました',
    zh: '已连接到Telegram',
    ko: 'Telegram에 연결됨',
    es: 'Conectado a Telegram',
    fr: 'Connecté à Telegram',
    de: 'Mit Telegram verbunden',
    ar: 'متصل بـ Telegram',
    pt: 'Conectado ao Telegram',
  },

  telegramConnectConfirm: {
    source: 'User baru masuk mode Telegram dari website.',
    id: 'User baru masuk mode Telegram dari website.',
    en: 'New user entered Telegram mode from website.',
    ja: '新しいユーザーがウェブサイトからTelegramモードに入りました。',
    zh: '新用户从网站进入Telegram模式。',
    ko: '새 사용자가 웹사이트에서 Telegram 모드로 진입했습니다.',
    es: 'Nuevo usuario entró en modo Telegram desde el sitio web.',
    fr: 'Nouvel utilisateur entré en mode Telegram depuis le site web.',
    de: 'Neuer Benutzer hat den Telegram-Modus von der Website betreten.',
    ar: 'دخل مستخدم جديد وضع Telegram من الموقع.',
    pt: 'Novo usuário entrou no modo Telegram do site.',
  },

  telegramChatConfirm: {
    source: 'Sekarang chat kamu akan saya teruskan langsung ke telegram <mark data-type="name">Herry Widnyana</mark>',
    id: 'Sekarang chat kamu akan saya teruskan langsung ke telegram <mark data-type="name">Herry Widnyana</mark>',
    en: 'Now I\'ll forward your chat directly to telegram <mark data-type="name">Herry Widnyana</mark>',
    ja: 'これからあなたのチャットをテレグラム <mark data-type="name">Herry Widnyana</mark> に直接転送します',
    zh: '现在我会将您的聊天直接转发到telegram <mark data-type="name">Herry Widnyana</mark>',
    ko: '이제 귀하의 채팅을 telegram <mark data-type="name">Herry Widnyana</mark>로 직접 전달하겠습니다',
    es: 'Ahora reenviaré tu chat directamente a telegram <mark data-type="name">Herry Widnyana</mark>',
    fr: 'Maintenant, je vais transférer votre chat directement à telegram <mark data-type="name">Herry Widnyana</mark>',
    de: 'Jetzt leite ich Ihren Chat direkt an telegram <mark data-type="name">Herry Widnyana</mark> weiter',
    ar: 'الآن سأقوم بإعادة توجيه محادثتك مباشرة إلى telegram <mark data-type="name">Herry Widnyana</mark>',
    pt: 'Agora vou encaminhar seu chat diretamente para o telegram <mark data-type="name">Herry Widnyana</mark>',
  },

  telegramNotice: {
    source: 'Anda sedang terhubung langsung ke Telegram @herrywidnyana, semua chat akan diteruskan',
    id: 'Anda sedang terhubung langsung ke Telegram @herrywidnyana, semua chat akan diteruskan',
    en: 'You are connected directly to Telegram @herrywidnyana, all chats will be forwarded',
    ja: 'Telegram @herrywidnyana に直接接続されています。すべてのチャットが転送されます',
    zh: '您已直接连接到Telegram @herrywidnyana，所有聊天将被转发',
    ko: 'Telegram @herrywidnyana에 직접 연결되었습니다. 모든 채팅이 전달됩니다',
    es: 'Estás conectado directamente a Telegram @herrywidnyana, todos los chats serán reenviados',
    fr: 'Vous êtes connecté directement à Telegram @herrywidnyana, tous les chats seront transférés',
    de: 'Sie sind direkt mit Telegram @herrywidnyana verbunden, alle Chats werden weitergeleitet',
    ar: 'أنت متصل مباشرة بـ Telegram @herrywidnyana، سيتم إعادة توجيه جميع المحادثات',
    pt: 'Você está conectado diretamente ao Telegram @herrywidnyana, todos os chats serão encaminhados',
  },

  turnOff: {
    source: 'Putuskan',
    id: 'Putuskan',
    en: 'Disconnect',
    ja: '切断',
    zh: '断开连接',
    ko: '연결 해제',
    es: 'Desconectar',
    fr: 'Déconnecter',
    de: 'Trennen',
    ar: 'قطع الاتصال',
    pt: 'Desconectar',
  },

  chatError: {
    source: 'Maaf kak, chat lagi gangguan nih. Coba lagi sebentar ya 🙏',
    id: 'Maaf kak, chat lagi gangguan nih. Coba lagi sebentar ya 🙏',
    en: 'Sorry, chat is experiencing issues. Please try again later 🙏',
    ja: 'すみません、チャットに問題が発生しています。後でもう一度お試しください 🙏',
    zh: '抱歉，聊天出现问题。请稍后再试 🙏',
    ko: '죄송합니다. 채팅에 문제가 발생했습니다. 나중에 다시 시도해주세요 🙏',
    es: 'Lo siento, el chat está experimentando problemas. Por favor, inténtalo de nuevo más tarde 🙏',
    fr: 'Désolé, le chat rencontre des problèmes. Veuillez réessayer plus tard 🙏',
    de: 'Entschuldigung, der Chat hat Probleme. Bitte versuchen Sie es später noch einmal 🙏',
    ar: 'عذرًا، الدردشة تواجه مشاكل. يرجى المحاولة مرة أخرى لاحقًا 🙏',
    pt: 'Desculpe, o chat está com problemas. Por favor, tente novamente mais tarde 🙏',
  },

  dataEmpty: {
    source: 'Belum ada data',
    id: 'Belum ada data',
    en: 'No data yet',
    ja: 'データがありません',
    zh: '暂无数据',
    ko: '아직 데이터가 없습니다',
    es: 'Aún no hay datos',
    fr: 'Pas encore de données',
    de: 'Noch keine Daten',
    ar: 'لا توجد بيانات بعد',
    pt: 'Ainda sem dados',
  },

  dataLoadFailed: {
    source: 'Gagal memuat data',
    id: 'Gagal memuat data',
    en: 'Failed to load data',
    ja: 'データの読み込みに失敗しました',
    zh: '加载数据失败',
    ko: '데이터 로드 실패',
    es: 'Error al cargar datos',
    fr: 'Échec du chargement des données',
    de: 'Daten konnten nicht geladen werden',
    ar: 'فشل تحميل البيانات',
    pt: 'Falha ao carregar dados',
  },

  viewCode: {
    source: 'Lihat code',
    id: 'Lihat code',
    en: 'View code',
    ja: 'コードを見る',
    zh: '查看代码',
    ko: '코드 보기',
    es: 'Ver código',
    fr: 'Voir le code',
    de: 'Code anzeigen',
    ar: 'عرض الكود',
    pt: 'Ver código',
  },

  source: {
    source: 'Sumber',
    id: 'Sumber',
    en: 'Source',
    ja: 'ソース',
    zh: '来源',
    ko: '소스',
    es: 'Fuente',
    fr: 'Source',
    de: 'Quelle',
    ar: 'المصدر',
    pt: 'Fonte',
  },

  viewDemo: {
    source: 'Lihat Demo',
    id: 'Lihat Demo',
    en: 'View Demo',
    ja: 'デモを見る',
    zh: '查看演示',
    ko: '데모 보기',
    es: 'Ver Demo',
    fr: 'Voir la démo',
    de: 'Demo ansehen',
    ar: 'عرض التجربة',
    pt: 'Ver Demo',
  },

  preview: {
    source: 'Pratinjau',
    id: 'Pratinjau',
    en: 'Preview',
    ja: 'プレビュー',
    zh: '预览',
    ko: '미리보기',
    es: 'Vista previa',
    fr: 'Aperçu',
    de: 'Vorschau',
    ar: 'معاينة',
    pt: 'Visualização',
  },

  welcomeText: {
    source: 'Halo! Selamat datang di',
    id: 'Halo! Selamat datang di',
    en: 'Hello! Welcome to',
    ja: 'こんにちは！ようこそ',
    zh: '你好！欢迎来到',
    ko: '안녕하세요! 환영합니다',
    es: '¡Hola! Bienvenido a',
    fr: 'Bonjour! Bienvenue sur',
    de: 'Hallo! Willkommen bei',
    ar: 'مرحبا! مرحبا بك في',
    pt: 'Olá! Bem-vindo ao',
  },

  welcomeTitle: {
    source: 'Halaman Pribadiku',
    id: 'Halaman Pribadiku',
    en: 'My Personal Page',
    ja: 'マイページ',
    zh: '我的个人主页',
    ko: '나의 개인 페이지',
    es: 'Mi Página Personal',
    fr: 'Ma Page Personnelle',
    de: 'Meine persönliche Seite',
    ar: 'صفحتي الشخصية',
    pt: 'Minha Página Pessoal',
  },

  progressText: {
    source: 'Progres',
    id: 'Progres',
    en: 'Progress',
    ja: '進捗',
    zh: '进度',
    ko: '진행률',
    es: 'Progreso',
    fr: 'Progrès',
    de: 'Fortschritt',
    ar: 'التقدم',
    pt: 'Progresso',
  },

  me: {
    source: 'saya?',
    id: 'saya?',
    en: 'me?',
    ja: '私？',
    zh: '我？',
    ko: '나?',
    es: '¿yo?',
    fr: 'moi?',
    de: 'ich?',
    ar: 'أنا؟',
    pt: 'eu?',
  },

  fileExplore: {
    source: 'Jelajahi File',
    id: 'Jelajahi File',
    en: 'Explore Files',
    ja: 'ファイルを探索',
    zh: '浏览文件',
    ko: '파일 탐색',
    es: 'Explorar Archivos',
    fr: 'Explorer les Fichiers',
    de: 'Dateien erkunden',
    ar: 'استكشاف الملفات',
    pt: 'Explorar Arquivos',
  },

  profile: {
    source: 'Profil',
    id: 'Profil',
    en: 'Profile',
    ja: 'プロフィール',
    zh: '个人资料',
    ko: '프로필',
    es: 'Perfil',
    fr: 'Profil',
    de: 'Profil',
    ar: 'الملف الشخصي',
    pt: 'Perfil',
  },

  myContact: {
    source: 'Kontak Saya',
    id: 'Kontak Saya',
    en: 'My Contact',
    ja: '連絡先',
    zh: '我的联系方式',
    ko: '내 연락처',
    es: 'Mi Contacto',
    fr: 'Mon Contact',
    de: 'Mein Kontakt',
    ar: 'معلومات الاتصال',
    pt: 'Meu Contato',
  },

  education: {
    source: 'Riwayat Pendidikan',
    id: 'Riwayat Pendidikan',
    en: 'Education History',
    ja: '学歴',
    zh: '教育经历',
    ko: '교육 이력',
    es: 'Historial Educativo',
    fr: 'Parcours Éducatif',
    de: 'Bildungsgeschichte',
    ar: 'السيرة التعليمية',
    pt: 'Histórico Educacional',
  },

  experience: {
    source: 'Pengalaman Kerja',
    id: 'Pengalaman Kerja',
    en: 'Work Experience',
    ja: '職歴',
    zh: '工作经验',
    ko: '경력',
    es: 'Experiencia Laboral',
    fr: 'Expérience Professionnelle',
    de: 'Berufserfahrung',
    ar: 'الخبرة العملية',
    pt: 'Experiência Profissional',
  },

  project: {
    source: 'Proyek',
    id: 'Proyek',
    en: 'Projects',
    ja: 'プロジェクト',
    zh: '项目',
    ko: '프로젝트',
    es: 'Proyectos',
    fr: 'Projets',
    de: 'Projekte',
    ar: 'المشاريع',
    pt: 'Projetos',
  },

  resume: {
    source: 'Lihat Resume',
    id: 'Lihat Resume',
    en: 'View Resume',
    ja: '履歴書を見る',
    zh: '查看简历',
    ko: '이력서 보기',
    es: 'Ver Currículum',
    fr: 'Voir le CV',
    de: 'Lebenslauf ansehen',
    ar: 'عرض السيرة الذاتية',
    pt: 'Ver Currículo',
  },

  emptyImage:{
    source: 'Belum ada gambar...',
    id: 'Belum ada gambar...',
    en: 'No image available',
    ja: '画像がありません',
    zh: '没有图片',
    ko: '이미지가 없습니다',
    es: 'No hay imagen disponible',
    fr: 'Pas d\'image disponible',
    de: 'Kein Bild verfügbar',
    ar: 'لا توجد صورة متاحة',
    pt: 'Nenhuma imagem disponível',
  },

  contactTitle:{
    source: 'Yuk terhubung!',
    id: 'Yuk terhubung!',
    en: 'Let\'s connect!',
    ja: 'つながりましょう！',
    zh: '让我们联系吧！',
    ko: '연결하자!',
    es: '¡Conectémonos!',
    fr: 'Connectons-nous!',
    de: 'Lass uns verbinden!',
    ar: 'دعونا نتواصل!',
    pt: 'Vamos nos conectar!',
  },

  contactSubtitle:{
    source: 'Punya ide? Ada bug yang perlu diperbaiki? atau hanya ingin ngobrol tentang teknologi? Saya siap.',
    id: 'Punya ide? Ada bug yang perlu diperbaiki? atau hanya ingin ngobrol tentang teknologi? Saya siap.',
    en: 'Got an idea? A bug to squash? or just want to talk tech? I am in.',
    ja: 'アイデアがありますか？バグを修正しますか？または、技術について話したいだけですか？私は参加します。',
    zh: '有想法吗？有bug需要修复？还是只是想聊聊技术？我愿意。',
    ko: '아이디어가 있나요? 버그를 수정하시겠습니까? 아니면 그냥 기술에 대해 이야기하고 싶으신가요? 저는 참여합니다.',
    es: '¿Tienes una idea? ¿Un error que solucionar? o ¿solo quieres hablar de tecnología? Estoy dentro.',
    fr: 'Vous avez une idée ? Un bug à corriger ? ou vous voulez juste parler tech ? Je suis partant.',
    de: 'Hast du eine Idee? Einen Bug zu beheben? Oder willst du einfach nur über Technik sprechen? Ich bin dabei.',
    ar: 'هل لديك فكرة؟ خطأ لإصلاحه؟ أو هل تريد فقط التحدث عن التكنولوجيا؟ أنا معكم.',
    pt: 'Tem uma ideia? Um bug para corrigir? ou só quer falar sobre tecnologia? Estou dentro.',
  },

  progress:{
    source: 'Progres',
    id: 'Progres',
    en: 'Progress',
    ja: '進捗', 
    zh: '进度',
    ko: '진행률',
    es: 'Progreso',
    fr: 'Progrès',
    de: 'Fortschritt',
    ar: 'التقدم',
    pt: 'Progresso',
  }
};

export const PLACEHOLDERS: Record<string, string[]> = {
  id: [
    "Halo! Ada yang bisa saya bantu?",
    "Yuk kenalan, cerita tentang project kamu...",
    "Tanya seputar portfolio saya...",
    "Tertarik untuk kolaborasi?",
    "Butuh developer untuk project?",
  ],

  en: [
    "Hi! How can I help you today?",
    "Let's talk about your project...",
    "Ask me about my work...",
    "Interested in collaborating?",
    "Looking for a developer?",
  ],

  ja: [
    "こんにちは！何かお手伝いできますか？",
    "あなたのプロジェクトについて話しましょう...",
    "私の仕事について聞いてください...",
    "コラボレーションに興味がありますか？",
    "開発者をお探しですか？",
  ],

  zh: [
    "你好！有什么可以帮您的吗？",
    "聊聊您的项目吧...",
    "问问我的工作...",
    "有兴趣合作吗？",
    "在找开发人员吗？",
  ],

  ko: [
    "안녕하세요! 무엇을 도와드릴까요?",
    "당신의 프로젝트에 대해 이야기해요...",
    "제 작업에 대해 물어보세요...",
    "협업에 관심이 있으신가요?",
    "개발자를 찾고 계신가요?",
  ],

  es: [
    "¡Hola! ¿En qué puedo ayudarte?",
    "Hablemos sobre tu proyecto...",
    "Pregúntame sobre mi trabajo...",
    "¿Interesado en colaborar?",
    "¿Buscas un desarrollador?",
  ],

  fr: [
    "Bonjour! Comment puis-je vous aider?",
    "Parlons de votre projet...",
    "Posez-moi des questions sur mon travail...",
    "Intéressé par une collaboration?",
    "Vous cherchez un développeur?",
  ],

  de: [
    "Hallo! Wie kann ich Ihnen helfen?",
    "Lassen Sie uns über Ihr Projekt sprechen...",
    "Fragen Sie mich über meine Arbeit...",
    "Interessiert an einer Zusammenarbeit?",
    "Suchen Sie einen Entwickler?",
  ],

  ar: [
    "مرحبا! كيف يمكنني مساعدتك؟",
    "دعونا نتحدث عن مشروعك...",
    "اسألني عن عملي...",
    "هل أنت مهتم بالتعاون؟",
    "هل تبحث عن مطور؟",
  ],

  pt: [
    "Olá! Como posso ajudá-lo?",
    "Vamos falar sobre seu projeto...",
    "Pergunte-me sobre meu trabalho...",
    "Interessado em colaborar?",
    "Procurando por um desenvolvedor?",
  ],
};

// Legacy baseUIText for backward compatibility (Indonesian)
export const baseUIText = {

    quote: 'Just a guy who loves coding & running 🏃‍♂️💻',

    sendPlaceholder: "Sini-sini kenalan sama aku...",
    clearChatConfirm: "Yakin ingin menghapus semua chat ini?",
    emptyMessage: "Belum ada pesan nih kak...",

    minimize: "Perkecil",
    clear: "Hapus Chat",


    welcome: "Selamat datang 👋",
    description: "Kenalan yuk, kak!",

    confirmLang: `Apakah kamu ingin mengubah semua konten website`,
    cancel: "Batal",
    confirm: "Konfirmasi",

    langSwitched: `Sip! Aku sudah ganti semua konten website`,
    langStatus: 'Bahasa saat ini',
    translateOnProgressConfirm: "Mohon tunggu ya, lagi menerjemahkan konten...",

    actionCanceled: "Oke, request saya batalkan 👍",

    forwarding: "Diteruskan ke",

    telegramStatus: 'Terhubung ke Telegram',
    telegramConnectConfirm: "User baru masuk mode Telegram dari website.",
    telegramChatConfirm: `Sekarang chat kamu akan saya teruskan langsung ke telegram <mark data-type="name">Herry Widnyana</mark>`,
    telegramNotice: 'Anda sedang terhubung langsung ke Telegram @herrywidnyana, semua chat akan diteruskan',
    turnOff: "Putuskan",
    
    chatError: 'Maaf kak, chat lagi gangguan nih. Coba lagi sebentar ya 🙏',

    dataEmpty: 'Belum ada data',
    dataLoadFailed: 'Gagal memuat data',

    viewCode: 'Lihat code',
    source: 'Sumber',
    viewDemo: 'Lihat Demo',
    preview: 'Pratinjau',

    welcomeText: 'Halo! Selamat datang di',
    welcomeTitle: 'Halaman Pribadiku',

    progressText: 'Progres',

    fileExplore: 'Jelajahi File',
    profile: 'Profil',
    myContact: 'Kontak Saya',
    education: 'Riwayat Pendidikan',
    experience: 'Pengalaman Kerja',
    project: 'Proyek',
    resume: 'Lihat Resume',
};
