// ============================================================
// 国际化文案 — 支持 12 种语言
// ============================================================

export type Lang = "en" | "zh" | "fr" | "ru" | "ar" | "es" | "pt" | "it" | "sl" | "he" | "de" | "tr" | "nl";

// 语言元信息：显示名、国旗 emoji、文本方向
export interface LangMeta {
  code: Lang;
  name: string;       // 用当地文字显示
  flag: string;       // 国旗 emoji
  dir: "ltr" | "rtl";
}

export const LANGS: LangMeta[] = [
  { code: "en", name: "English",  flag: "🇬🇧", dir: "ltr" },
  { code: "zh", name: "中文",      flag: "🇨🇳", dir: "ltr" },
  { code: "fr", name: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "de", name: "Deutsch",  flag: "🇩🇪", dir: "ltr" },
  { code: "es", name: "Español",  flag: "🇪🇸", dir: "ltr" },
  { code: "pt", name: "Português",flag: "🇵🇹", dir: "ltr" },
  { code: "it", name: "Italiano", flag: "🇮🇹", dir: "ltr" },
  { code: "ru", name: "Русский",  flag: "🇷🇺", dir: "ltr" },
  { code: "sl", name: "Slovenščina", flag: "🇸🇮", dir: "ltr" },
  { code: "tr", name: "Türkçe",   flag: "🇹🇷", dir: "ltr" },
  { code: "he", name: "עברית",     flag: "🇮🇱", dir: "rtl" },
  { code: "ar", name: "العربية",   flag: "🇸🇦", dir: "rtl" },
];

// 单一文案结构（必须 12 种语言都提供所有 key）
interface I18nDict {
  // Header
  brandName: string;
  brandNameShort: string;
  navSearch: string;
  navProducts: string;
  navAbout: string;

  // Navigation
  navFormulaSearch: string;
  navColorLibrary: string;
  navAppGuide: string;
  navAdmin: string;
  userManagement: string;
  logout: string;

  // Login
  loginWelcome: string;
  loginSubtitle: string;
  loginEmail: string;
  loginPassword: string;
  loginPlaceholderEmail: string;
  loginPlaceholderPassword: string;
  loginButton: string;
  loginSigningIn: string;
  loginErrorEmpty: string;
  loginErrorNetwork: string;
  loginErrorFailed: string;

  // SearchPanel
  panelTitle: string;
  make: string;
  colorCode: string;
  colorName: string;
  colorType: string;
  allMakes: string;
  colorTypeAll: string;
  colorTypeSolid: string;
  colorTypeMetallic: string;
  colorTypePearl: string;
  colorTypeMatte: string;
  colorTypeCandy: string;
  search: string;
  searching: string;
  reset: string;
  codeTooLong: string;
  colorCodePlaceholder: string;
  colorNamePlaceholder: string;
  year: string;
  yearPlaceholder: string;

  // ColorCard
  formulasCount: (n: number) => string;
  detail: string;
  expand: string;
  collapse: string;
  version: string;
  paintSystemNotes: string;

  // FormulaComponentsTable
  volume: string;
  tonerCode: string;
  tonerName: string;
  percentage: string;
  actualAmount: string;

  // FormulaDrawer
  colorInfo: string;
  formulaVariants: string;
  components: string;
  makeLabel: string;
  typeLabel: string;
  yearsLabel: string;
  codeLabel: string;
  print: string;
  copy: string;
  notesLabel: string;
  updatedLabel: string;
  colorTypeSolidLabel: string;
  colorTypeMetallicLabel: string;
  colorTypePearlLabel: string;
  colorTypeMatteLabel: string;
  colorTypeCandyLabel: string;
  colorTypeSpecialLabel: string;
  copySuccess: string;
  copyFail: string;

  // SearchResults
  searchHint: string;
  noResults: string;
  noResultsHint: string;
  foundCount: (n: number) => string;
  truncatedHint: (max: number) => string;
  totalFormula: (c: number, f: number) => string;
  colorsBadge: (n: number) => string;
  formulasBadge: (n: number) => string;
}

// 通用复数（粗略按 n>1 处理）
const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;

const dict = (d: Omit<I18nDict, "formulasCount" | "foundCount" | "truncatedHint" | "totalFormula" | "colorsBadge" | "formulasBadge"> & {
  formulasCount?: (n: number) => string;
  foundCount?: (n: number) => string;
  truncatedHint?: (max: number) => string;
  totalFormula?: (c: number, f: number) => string;
  colorsBadge?: (n: number) => string;
  formulasBadge?: (n: number) => string;
}): I18nDict => ({
  formulasCount: d.formulasCount ?? ((n) => plural(n, "formula", "formulas")),
  foundCount: d.foundCount ?? ((n) => `Found ${n} color${n > 1 ? "s" : ""}`),
  truncatedHint: d.truncatedHint ?? ((max) => `Showing first ${max} results. Please refine your search.`),
  totalFormula: d.totalFormula ?? ((c, f) => `Found ${c} color${c > 1 ? "s" : ""}, ${f} formula${f > 1 ? "s" : ""}`),
  colorsBadge: d.colorsBadge ?? ((n) => `${n} Colors`),
  formulasBadge: d.formulasBadge ?? ((n) => `${n} Formulas`),
  ...d,
});

export const i18n: Record<Lang, I18nDict> = {
  // ========== English ==========
  en: dict({
    brandName: "HIWE Formula Search",
    brandNameShort: "HIWE",
    navSearch: "Search", navProducts: "Products", navAbout: "About",

    navFormulaSearch: "Formula Search",
    navColorLibrary: "Color Visual Library",
    navAppGuide: "Application Guide",
    navAdmin: "Data Management",
    userManagement: "User Management",
    logout: "Logout",

    loginWelcome: "Welcome back",
    loginSubtitle: "Enter your credentials to access the system",
    loginEmail: "Email",
    loginPassword: "Password",
    loginPlaceholderEmail: "you@example.com",
    loginPlaceholderPassword: "Enter your password",
    loginButton: "Get started",
    loginSigningIn: "Signing in...",
    loginErrorEmpty: "Please enter username and password",
    loginErrorNetwork: "Network error, please retry",
    loginErrorFailed: "Login failed",

    panelTitle: "Formula Search",
    make: "Make", colorCode: "Color Code", colorName: "Color Name", colorType: "Color Type",
    allMakes: "All Makes",
    colorTypeAll: "All", colorTypeSolid: "Solid", colorTypeMetallic: "Metallic",
    colorTypePearl: "Pearl", colorTypeMatte: "Matte", colorTypeCandy: "Candy",
    search: "Search", searching: "Searching...", reset: "Reset",
    codeTooLong: "Color code is usually <= 10 chars, please check",
    colorCodePlaceholder: "e.g. 040, NH731P",
    colorNamePlaceholder: "e.g. Super White",
    year: "Year", yearPlaceholder: "e.g. 2020 or 2018-2022",

    detail: "Detail", expand: "Expand", collapse: "Collapse",
    version: "Version", paintSystemNotes: "Notes",

    volume: "Volume", tonerCode: "Toner Code", tonerName: "Toner Name",
    percentage: "Percentage(%)", actualAmount: "Actual Amount(g)",

    colorInfo: "Color Info", formulaVariants: "Formula Variants", components: "Components",
    makeLabel: "Make", typeLabel: "Type", yearsLabel: "Years", codeLabel: "Code",
    print: "Print", copy: "Copy", notesLabel: "Notes", updatedLabel: "Updated",
    colorTypeSolidLabel: "Solid", colorTypeMetallicLabel: "Metallic", colorTypePearlLabel: "Pearl",
    colorTypeMatteLabel: "Matte", colorTypeCandyLabel: "Candy", colorTypeSpecialLabel: "Special",
    copySuccess: "Copied to clipboard", copyFail: "Copy failed, please retry",

    searchHint: "Enter search criteria on the left",
    noResults: "No matching colors found",
    noResultsHint: "Try a different make or color code",
  }),

  // ========== 中文 ==========
  zh: dict({
    brandName: "HIWE 配方搜索",
    brandNameShort: "HIWE",
    navSearch: "配方搜索", navProducts: "产品", navAbout: "关于",

    navFormulaSearch: "Formula Search",
    navColorLibrary: "Color Visual Library",
    navAppGuide: "Application Guide",
    navAdmin: "Data Management",
    userManagement: "用户管理",
    logout: "退出",

    loginWelcome: "欢迎回来",
    loginSubtitle: "请输入账号信息登录系统",
    loginEmail: "邮箱", loginPassword: "密码",
    loginPlaceholderEmail: "请输入邮箱",
    loginPlaceholderPassword: "请输入密码",
    loginButton: "登录", loginSigningIn: "登录中...",
    loginErrorEmpty: "请输入用户名和密码",
    loginErrorNetwork: "网络错误，请重试",
    loginErrorFailed: "登录失败",

    panelTitle: "配方搜索",
    make: "品牌", colorCode: "颜色代码", colorName: "颜色名称", colorType: "漆面类型",
    allMakes: "全部品牌",
    colorTypeAll: "全部", colorTypeSolid: "实色", colorTypeMetallic: "金属",
    colorTypePearl: "珠光", colorTypeMatte: "哑光", colorTypeCandy: "糖果漆",
    search: "搜索", searching: "搜索中...", reset: "重置",
    codeTooLong: "颜色代码通常不超过 10 个字符，请检查输入",
    colorCodePlaceholder: "例如 040, NH731P",
    colorNamePlaceholder: "例如 Super White, 珍珠白",
    year: "年份", yearPlaceholder: "例如 2020 或 2018-2022",

    detail: "详情", expand: "展开", collapse: "收起",
    version: "版本", paintSystemNotes: "备注",

    volume: "用量", tonerCode: "色母编号", tonerName: "色母名称",
    percentage: "百分比(%)", actualAmount: "实际用量(g)",

    colorInfo: "颜色信息", formulaVariants: "配方变体", components: "配方成分",
    makeLabel: "品牌", typeLabel: "类型", yearsLabel: "适用年份", codeLabel: "颜色代码",
    print: "打印配方", copy: "复制为文本", notesLabel: "备注", updatedLabel: "更新于",
    colorTypeSolidLabel: "实色", colorTypeMetallicLabel: "金属漆", colorTypePearlLabel: "珠光漆",
    colorTypeMatteLabel: "哑光", colorTypeCandyLabel: "糖果漆", colorTypeSpecialLabel: "特殊漆",
    copySuccess: "已复制到剪贴板", copyFail: "复制失败，请重试",

    searchHint: "请在左侧输入搜索条件",
    noResults: "未找到匹配的颜色配方",
    noResultsHint: "请尝试更换品牌或颜色代码",
    formulasCount: (n) => `${n} 个配方`,
    foundCount: (n) => `找到 ${n} 个匹配颜色`,
    truncatedHint: (max) => `显示前 ${max} 条结果，请细化搜索条件`,
    totalFormula: (c, f) => `找到 ${c} 个颜色，共 ${f} 个配方`,
    colorsBadge: (n) => `${n} 个颜色`,
    formulasBadge: (n) => `${n} 个配方`,
  }),

  // ========== Français ==========
  fr: dict({
    brandName: "HIWE Recherche de formule",
    brandNameShort: "HIWE",
    navSearch: "Recherche", navProducts: "Produits", navAbout: "À propos",
    navFormulaSearch: "Recherche de formule",
    navColorLibrary: "Bibliothèque de couleurs",
    navAppGuide: "Guide d'application",
    navAdmin: "Gestion des données",
    userManagement: "Gestion des utilisateurs",
    logout: "Déconnexion",
    loginWelcome: "Bon retour",
    loginSubtitle: "Entrez vos identifiants pour accéder au système",
    loginEmail: "E-mail", loginPassword: "Mot de passe",
    loginPlaceholderEmail: "vous@exemple.com",
    loginPlaceholderPassword: "Entrez votre mot de passe",
    loginButton: "Commencer", loginSigningIn: "Connexion...",
    loginErrorEmpty: "Veuillez saisir le nom d'utilisateur et le mot de passe",
    loginErrorNetwork: "Erreur réseau, veuillez réessayer",
    loginErrorFailed: "Échec de la connexion",
    panelTitle: "Recherche de formule",
    make: "Marque", colorCode: "Code couleur", colorName: "Nom de la couleur", colorType: "Type de couleur",
    allMakes: "Toutes les marques",
    colorTypeAll: "Tous", colorTypeSolid: "Uni", colorTypeMetallic: "Métallisé",
    colorTypePearl: "Nacré", colorTypeMatte: "Mat", colorTypeCandy: "Candy",
    search: "Rechercher", searching: "Recherche...", reset: "Réinitialiser",
    codeTooLong: "Le code couleur ne dépasse généralement pas 10 caractères",
    colorCodePlaceholder: "ex. 040, NH731P",
    colorNamePlaceholder: "ex. Super White",
    year: "Année", yearPlaceholder: "ex. 2020 ou 2018-2022",
    detail: "Détail", expand: "Développer", collapse: "Réduire",
    version: "Version", paintSystemNotes: "Notes",
    volume: "Volume", tonerCode: "Code du toner", tonerName: "Nom du toner",
    percentage: "Pourcentage(%)", actualAmount: "Quantité réelle(g)",
    colorInfo: "Informations couleur", formulaVariants: "Variantes de formule", components: "Composants",
    makeLabel: "Marque", typeLabel: "Type", yearsLabel: "Années", codeLabel: "Code",
    print: "Imprimer", copy: "Copier", notesLabel: "Notes", updatedLabel: "Mis à jour",
    colorTypeSolidLabel: "Uni", colorTypeMetallicLabel: "Métallisé", colorTypePearlLabel: "Nacré",
    colorTypeMatteLabel: "Mat", colorTypeCandyLabel: "Candy", colorTypeSpecialLabel: "Spécial",
    copySuccess: "Copié dans le presse-papier", copyFail: "Échec de la copie",
    searchHint: "Saisissez les critères de recherche à gauche",
    noResults: "Aucune couleur correspondante trouvée",
    noResultsHint: "Essayez une autre marque ou un autre code couleur",
    formulasCount: (n) => `${n} formule${n > 1 ? "s" : ""}`,
    foundCount: (n) => `${n} couleur${n > 1 ? "s" : ""} trouvée${n > 1 ? "s" : ""}`,
    truncatedHint: (max) => `Affichage des ${max} premiers résultats. Affinez votre recherche.`,
    totalFormula: (c, f) => `${c} couleur${c > 1 ? "s" : ""}, ${f} formule${f > 1 ? "s" : ""}`,
    colorsBadge: (n) => `${n} Couleurs`,
    formulasBadge: (n) => `${n} Formules`,
  }),

  // ========== Deutsch ==========
  de: dict({
    brandName: "HIWE Formelsuche",
    brandNameShort: "HIWE",
    navSearch: "Suche", navProducts: "Produkte", navAbout: "Über uns",
    navFormulaSearch: "Formelsuche",
    navColorLibrary: "Farbvisualisierungsbibliothek",
    navAppGuide: "Anwendungsleitfaden",
    navAdmin: "Datenverwaltung",
    userManagement: "Benutzerverwaltung",
    logout: "Abmelden",
    loginWelcome: "Willkommen zurück",
    loginSubtitle: "Geben Sie Ihre Anmeldedaten ein",
    loginEmail: "E-Mail", loginPassword: "Passwort",
    loginPlaceholderEmail: "sie@beispiel.com",
    loginPlaceholderPassword: "Geben Sie Ihr Passwort ein",
    loginButton: "Loslegen", loginSigningIn: "Anmelden...",
    loginErrorEmpty: "Bitte Benutzername und Passwort eingeben",
    loginErrorNetwork: "Netzwerkfehler, bitte erneut versuchen",
    loginErrorFailed: "Anmeldung fehlgeschlagen",
    panelTitle: "Formelsuche",
    make: "Marke", colorCode: "Farbcode", colorName: "Farbname", colorType: "Farbtyp",
    allMakes: "Alle Marken",
    colorTypeAll: "Alle", colorTypeSolid: "Uni", colorTypeMetallic: "Metallic",
    colorTypePearl: "Perleffekt", colorTypeMatte: "Matt", colorTypeCandy: "Candy",
    search: "Suchen", searching: "Suchen...", reset: "Zurücksetzen",
    codeTooLong: "Farbcode ist normalerweise <= 10 Zeichen",
    colorCodePlaceholder: "z. B. 040, NH731P",
    colorNamePlaceholder: "z. B. Super White",
    year: "Jahr", yearPlaceholder: "z. B. 2020 oder 2018-2022",
    detail: "Detail", expand: "Erweitern", collapse: "Einklappen",
    version: "Version", paintSystemNotes: "Notizen",
    volume: "Volumen", tonerCode: "Toner-Code", tonerName: "Toner-Name",
    percentage: "Prozent(%)", actualAmount: "Tatsächliche Menge(g)",
    colorInfo: "Farbinformationen", formulaVariants: "Formelvarianten", components: "Komponenten",
    makeLabel: "Marke", typeLabel: "Typ", yearsLabel: "Jahre", codeLabel: "Code",
    print: "Drucken", copy: "Kopieren", notesLabel: "Notizen", updatedLabel: "Aktualisiert",
    colorTypeSolidLabel: "Uni", colorTypeMetallicLabel: "Metallic", colorTypePearlLabel: "Perleffekt",
    colorTypeMatteLabel: "Matt", colorTypeCandyLabel: "Candy", colorTypeSpecialLabel: "Spezial",
    copySuccess: "In die Zwischenablage kopiert", copyFail: "Kopieren fehlgeschlagen",
    searchHint: "Geben Sie links Suchkriterien ein",
    noResults: "Keine passenden Farben gefunden",
    noResultsHint: "Versuchen Sie eine andere Marke oder einen anderen Farbcode",
    formulasCount: (n) => `${n} Formel${n > 1 ? "n" : ""}`,
    foundCount: (n) => `${n} Farbe${n > 1 ? "n" : ""} gefunden`,
    truncatedHint: (max) => `Erste ${max} Ergebnisse. Bitte verfeinern Sie die Suche.`,
    totalFormula: (c, f) => `${c} Farbe${c > 1 ? "n" : ""}, ${f} Formel${f > 1 ? "n" : ""}`,
    colorsBadge: (n) => `${n} Farben`,
    formulasBadge: (n) => `${n} Formeln`,
  }),

  // ========== Español ==========
  es: dict({
    brandName: "HIWE Búsqueda de fórmulas",
    brandNameShort: "HIWE",
    navSearch: "Buscar", navProducts: "Productos", navAbout: "Acerca de",
    navFormulaSearch: "Búsqueda de fórmulas",
    navColorLibrary: "Biblioteca visual de colores",
    navAppGuide: "Guía de aplicación",
    navAdmin: "Gestión de datos",
    userManagement: "Gestión de usuarios",
    logout: "Cerrar sesión",
    loginWelcome: "Bienvenido de nuevo",
    loginSubtitle: "Ingrese sus credenciales para acceder al sistema",
    loginEmail: "Correo electrónico", loginPassword: "Contraseña",
    loginPlaceholderEmail: "usted@ejemplo.com",
    loginPlaceholderPassword: "Ingrese su contraseña",
    loginButton: "Comenzar", loginSigningIn: "Iniciando sesión...",
    loginErrorEmpty: "Ingrese nombre de usuario y contraseña",
    loginErrorNetwork: "Error de red, inténtelo de nuevo",
    loginErrorFailed: "Inicio de sesión fallido",
    panelTitle: "Búsqueda de fórmulas",
    make: "Marca", colorCode: "Código de color", colorName: "Nombre del color", colorType: "Tipo de color",
    allMakes: "Todas las marcas",
    colorTypeAll: "Todos", colorTypeSolid: "Sólido", colorTypeMetallic: "Metálico",
    colorTypePearl: "Perla", colorTypeMatte: "Mate", colorTypeCandy: "Caramelo",
    search: "Buscar", searching: "Buscando...", reset: "Restablecer",
    codeTooLong: "El código de color suele tener <= 10 caracteres",
    colorCodePlaceholder: "ej. 040, NH731P",
    colorNamePlaceholder: "ej. Super White",
    year: "Año", yearPlaceholder: "ej. 2020 o 2018-2022",
    detail: "Detalle", expand: "Expandir", collapse: "Contraer",
    version: "Versión", paintSystemNotes: "Notas",
    volume: "Volumen", tonerCode: "Código de tóner", tonerName: "Nombre del tóner",
    percentage: "Porcentaje(%)", actualAmount: "Cantidad real(g)",
    colorInfo: "Información del color", formulaVariants: "Variantes de fórmula", components: "Componentes",
    makeLabel: "Marca", typeLabel: "Tipo", yearsLabel: "Años", codeLabel: "Código",
    print: "Imprimir", copy: "Copiar", notesLabel: "Notas", updatedLabel: "Actualizado",
    colorTypeSolidLabel: "Sólido", colorTypeMetallicLabel: "Metálico", colorTypePearlLabel: "Perla",
    colorTypeMatteLabel: "Mate", colorTypeCandyLabel: "Caramelo", colorTypeSpecialLabel: "Especial",
    copySuccess: "Copiado al portapapeles", copyFail: "Error al copiar",
    searchHint: "Ingrese criterios de búsqueda a la izquierda",
    noResults: "No se encontraron colores coincidentes",
    noResultsHint: "Pruebe con otra marca o código de color",
    formulasCount: (n) => `${n} fórmula${n > 1 ? "s" : ""}`,
    foundCount: (n) => `${n} color${n > 1 ? "es" : ""} encontrado${n > 1 ? "s" : ""}`,
    truncatedHint: (max) => `Mostrando los primeros ${max} resultados. Refine su búsqueda.`,
    totalFormula: (c, f) => `${c} color${c > 1 ? "es" : ""}, ${f} fórmula${f > 1 ? "s" : ""}`,
    colorsBadge: (n) => `${n} Colores`,
    formulasBadge: (n) => `${n} Fórmulas`,
  }),

  // ========== Português ==========
  pt: dict({
    brandName: "HIWE Pesquisa de fórmulas",
    brandNameShort: "HIWE",
    navSearch: "Pesquisar", navProducts: "Produtos", navAbout: "Sobre",
    navFormulaSearch: "Pesquisa de fórmulas",
    navColorLibrary: "Biblioteca visual de cores",
    navAppGuide: "Guia de aplicação",
    navAdmin: "Gestão de dados",
    userManagement: "Gestão de usuários",
    logout: "Sair",
    loginWelcome: "Bem-vindo de volta",
    loginSubtitle: "Insira suas credenciais para acessar o sistema",
    loginEmail: "E-mail", loginPassword: "Senha",
    loginPlaceholderEmail: "voce@exemplo.com",
    loginPlaceholderPassword: "Insira sua senha",
    loginButton: "Começar", loginSigningIn: "Entrando...",
    loginErrorEmpty: "Insira nome de usuário e senha",
    loginErrorNetwork: "Erro de rede, tente novamente",
    loginErrorFailed: "Falha no login",
    panelTitle: "Pesquisa de fórmulas",
    make: "Marca", colorCode: "Código da cor", colorName: "Nome da cor", colorType: "Tipo de cor",
    allMakes: "Todas as marcas",
    colorTypeAll: "Todos", colorTypeSolid: "Sólido", colorTypeMetallic: "Metálico",
    colorTypePearl: "Pérola", colorTypeMatte: "Fosco", colorTypeCandy: "Candy",
    search: "Pesquisar", searching: "Pesquisando...", reset: "Redefinir",
    codeTooLong: "O código de cor geralmente tem <= 10 caracteres",
    colorCodePlaceholder: "ex. 040, NH731P",
    colorNamePlaceholder: "ex. Super White",
    year: "Ano", yearPlaceholder: "ex. 2020 ou 2018-2022",
    detail: "Detalhe", expand: "Expandir", collapse: "Recolher",
    version: "Versão", paintSystemNotes: "Notas",
    volume: "Volume", tonerCode: "Código do toner", tonerName: "Nome do toner",
    percentage: "Percentagem(%)", actualAmount: "Quantidade real(g)",
    colorInfo: "Informação da cor", formulaVariants: "Variantes de fórmula", components: "Componentes",
    makeLabel: "Marca", typeLabel: "Tipo", yearsLabel: "Anos", codeLabel: "Código",
    print: "Imprimir", copy: "Copiar", notesLabel: "Notas", updatedLabel: "Atualizado",
    colorTypeSolidLabel: "Sólido", colorTypeMetallicLabel: "Metálico", colorTypePearlLabel: "Pérola",
    colorTypeMatteLabel: "Fosco", colorTypeCandyLabel: "Candy", colorTypeSpecialLabel: "Especial",
    copySuccess: "Copiado para a área de transferência", copyFail: "Falha ao copiar",
    searchHint: "Insira critérios de pesquisa à esquerda",
    noResults: "Nenhuma cor correspondente encontrada",
    noResultsHint: "Tente outra marca ou código de cor",
    formulasCount: (n) => `${n} fórmula${n > 1 ? "s" : ""}`,
    foundCount: (n) => `${n} cor${n > 1 ? "es" : ""} encontrada${n > 1 ? "s" : ""}`,
    truncatedHint: (max) => `Mostrando os primeiros ${max} resultados. Refine sua pesquisa.`,
    totalFormula: (c, f) => `${c} cor${c > 1 ? "es" : ""}, ${f} fórmula${f > 1 ? "s" : ""}`,
    colorsBadge: (n) => `${n} Cores`,
    formulasBadge: (n) => `${n} Fórmulas`,
  }),

  // ========== Italiano ==========
  it: dict({
    brandName: "HIWE Ricerca formule",
    brandNameShort: "HIWE",
    navSearch: "Cerca", navProducts: "Prodotti", navAbout: "Informazioni",
    navFormulaSearch: "Ricerca formule",
    navColorLibrary: "Libreria visiva dei colori",
    navAppGuide: "Guida all'applicazione",
    navAdmin: "Gestione dati",
    userManagement: "Gestione utenti",
    logout: "Esci",
    loginWelcome: "Bentornato",
    loginSubtitle: "Inserisci le tue credenziali per accedere al sistema",
    loginEmail: "E-mail", loginPassword: "Password",
    loginPlaceholderEmail: "tu@esempio.com",
    loginPlaceholderPassword: "Inserisci la tua password",
    loginButton: "Inizia", loginSigningIn: "Accesso in corso...",
    loginErrorEmpty: "Inserisci nome utente e password",
    loginErrorNetwork: "Errore di rete, riprova",
    loginErrorFailed: "Accesso non riuscito",
    panelTitle: "Ricerca formule",
    make: "Marca", colorCode: "Codice colore", colorName: "Nome colore", colorType: "Tipo colore",
    allMakes: "Tutte le marche",
    colorTypeAll: "Tutti", colorTypeSolid: "Solido", colorTypeMetallic: "Metallizzato",
    colorTypePearl: "Perla", colorTypeMatte: "Opaco", colorTypeCandy: "Candy",
    search: "Cerca", searching: "Ricerca...", reset: "Reimposta",
    codeTooLong: "Il codice colore di solito ha <= 10 caratteri",
    colorCodePlaceholder: "es. 040, NH731P",
    colorNamePlaceholder: "es. Super White",
    year: "Anno", yearPlaceholder: "es. 2020 o 2018-2022",
    detail: "Dettaglio", expand: "Espandi", collapse: "Riduci",
    version: "Versione", paintSystemNotes: "Note",
    volume: "Volume", tonerCode: "Codice toner", tonerName: "Nome toner",
    percentage: "Percentuale(%)", actualAmount: "Quantità effettiva(g)",
    colorInfo: "Info colore", formulaVariants: "Varianti formula", components: "Componenti",
    makeLabel: "Marca", typeLabel: "Tipo", yearsLabel: "Anni", codeLabel: "Codice",
    print: "Stampa", copy: "Copia", notesLabel: "Note", updatedLabel: "Aggiornato",
    colorTypeSolidLabel: "Solido", colorTypeMetallicLabel: "Metallizzato", colorTypePearlLabel: "Perla",
    colorTypeMatteLabel: "Opaco", colorTypeCandyLabel: "Candy", colorTypeSpecialLabel: "Speciale",
    copySuccess: "Copiato negli appunti", copyFail: "Copia non riuscita",
    searchHint: "Inserisci i criteri di ricerca a sinistra",
    noResults: "Nessun colore corrispondente trovato",
    noResultsHint: "Prova un'altra marca o codice colore",
    formulasCount: (n) => `${n} formula${n > 1 ? "e" : ""}`,
    foundCount: (n) => `${n} color${n > 1 ? "i" : "e"} trovat${n > 1 ? "i" : "o"}`,
    truncatedHint: (max) => `Mostrando i primi ${max} risultati. Affina la ricerca.`,
    totalFormula: (c, f) => `${c} color${c > 1 ? "i" : "e"}, ${f} formula${f > 1 ? "e" : ""}`,
    colorsBadge: (n) => `${n} Colori`,
    formulasBadge: (n) => `${n} Formule`,
  }),

  // ========== Русский ==========
  ru: dict({
    brandName: "HIWE Поиск формул",
    brandNameShort: "HIWE",
    navSearch: "Поиск", navProducts: "Продукты", navAbout: "О нас",
    navFormulaSearch: "Поиск формул",
    navColorLibrary: "Визуальная библиотека цветов",
    navAppGuide: "Руководство по применению",
    navAdmin: "Управление данными",
    userManagement: "Управление пользователями",
    logout: "Выход",
    loginWelcome: "С возвращением",
    loginSubtitle: "Введите свои учётные данные для входа",
    loginEmail: "Эл. почта", loginPassword: "Пароль",
    loginPlaceholderEmail: "вы@пример.com",
    loginPlaceholderPassword: "Введите пароль",
    loginButton: "Начать", loginSigningIn: "Вход...",
    loginErrorEmpty: "Введите имя пользователя и пароль",
    loginErrorNetwork: "Ошибка сети, повторите попытку",
    loginErrorFailed: "Не удалось войти",
    panelTitle: "Поиск формул",
    make: "Марка", colorCode: "Код цвета", colorName: "Название цвета", colorType: "Тип цвета",
    allMakes: "Все марки",
    colorTypeAll: "Все", colorTypeSolid: "Однотонный", colorTypeMetallic: "Металлик",
    colorTypePearl: "Перламутр", colorTypeMatte: "Матовый", colorTypeCandy: "Канди",
    search: "Поиск", searching: "Поиск...", reset: "Сброс",
    codeTooLong: "Код цвета обычно <= 10 символов",
    colorCodePlaceholder: "напр. 040, NH731P",
    colorNamePlaceholder: "напр. Super White",
    year: "Год", yearPlaceholder: "напр. 2020 или 2018-2022",
    detail: "Подробнее", expand: "Развернуть", collapse: "Свернуть",
    version: "Версия", paintSystemNotes: "Примечания",
    volume: "Объём", tonerCode: "Код тонера", tonerName: "Название тонера",
    percentage: "Процент(%)", actualAmount: "Факт. кол-во(г)",
    colorInfo: "Информация о цвете", formulaVariants: "Варианты формулы", components: "Компоненты",
    makeLabel: "Марка", typeLabel: "Тип", yearsLabel: "Годы", codeLabel: "Код",
    print: "Печать", copy: "Копировать", notesLabel: "Примечания", updatedLabel: "Обновлено",
    colorTypeSolidLabel: "Однотонный", colorTypeMetallicLabel: "Металлик", colorTypePearlLabel: "Перламутр",
    colorTypeMatteLabel: "Матовый", colorTypeCandyLabel: "Канди", colorTypeSpecialLabel: "Специальный",
    copySuccess: "Скопировано в буфер обмена", copyFail: "Не удалось скопировать",
    searchHint: "Введите критерии поиска слева",
    noResults: "Соответствующих цветов не найдено",
    noResultsHint: "Попробуйте другую марку или код цвета",
    formulasCount: (n) => {
      const mod10 = n % 10, mod100 = n % 100;
      const word = mod10 === 1 && mod100 !== 11 ? "формула"
                 : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? "формулы"
                 : "формул";
      return `${n} ${word}`;
    },
    foundCount: (n) => {
      const mod10 = n % 10, mod100 = n % 100;
      const word = mod10 === 1 && mod100 !== 11 ? "цвет"
                 : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? "цвета"
                 : "цветов";
      return `Найдено ${n} ${word}`;
    },
    truncatedHint: (max) => `Показаны первые ${max} результатов. Уточните поиск.`,
    totalFormula: (c, f) => `${c} цветов, ${f} формул`,
    colorsBadge: (n) => `${n} Цв.`,
    formulasBadge: (n) => `${n} Формул`,
  }),

  // ========== Slovenščina ==========
  sl: dict({
    brandName: "HIWE Iskanje formul",
    brandNameShort: "HIWE",
    navSearch: "Iskanje", navProducts: "Izdelki", navAbout: "O nas",
    navFormulaSearch: "Iskanje formul",
    navColorLibrary: "Vizualna knjižnica barv",
    navAppGuide: "Vodnik za uporabo",
    navAdmin: "Upravljanje podatkov",
    userManagement: "Upravljanje uporabnikov",
    logout: "Odjava",
    loginWelcome: "Dobrodošli nazaj",
    loginSubtitle: "Vnesite poverilnice za dostop do sistema",
    loginEmail: "E-pošta", loginPassword: "Geslo",
    loginPlaceholderEmail: "vi@primer.com",
    loginPlaceholderPassword: "Vnesite geslo",
    loginButton: "Začni", loginSigningIn: "Prijavljanje...",
    loginErrorEmpty: "Vnesite uporabniško ime in geslo",
    loginErrorNetwork: "Omrežna napaka, poskusite znova",
    loginErrorFailed: "Prijava neuspešna",
    panelTitle: "Iskanje formul",
    make: "Znamka", colorCode: "Koda barve", colorName: "Ime barve", colorType: "Vrsta barve",
    allMakes: "Vse znamke",
    colorTypeAll: "Vse", colorTypeSolid: "Enobarvna", colorTypeMetallic: "Kovinska",
    colorTypePearl: "Biser", colorTypeMatte: "Mat", colorTypeCandy: "Candy",
    search: "Iskanje", searching: "Iskanje...", reset: "Ponastavi",
    codeTooLong: "Koda barve je običajno <= 10 znakov",
    colorCodePlaceholder: "npr. 040, NH731P",
    colorNamePlaceholder: "npr. Super White",
    year: "Leto", yearPlaceholder: "npr. 2020 ali 2018-2022",
    detail: "Podrobnosti", expand: "Razširi", collapse: "Strni",
    version: "Različica", paintSystemNotes: "Opombe",
    volume: "Prostornina", tonerCode: "Koda tonerja", tonerName: "Ime tonerja",
    percentage: "Odstotek(%)", actualAmount: "Dejanska količina(g)",
    colorInfo: "Podatki o barvi", formulaVariants: "Različice formul", components: "Sestavine",
    makeLabel: "Znamka", typeLabel: "Vrsta", yearsLabel: "Leta", codeLabel: "Koda",
    print: "Natisni", copy: "Kopiraj", notesLabel: "Opombe", updatedLabel: "Posodobljeno",
    colorTypeSolidLabel: "Enobarvna", colorTypeMetallicLabel: "Kovinska", colorTypePearlLabel: "Biser",
    colorTypeMatteLabel: "Mat", colorTypeCandyLabel: "Candy", colorTypeSpecialLabel: "Posebna",
    copySuccess: "Kopirano v odložišče", copyFail: "Kopiranje neuspešno",
    searchHint: "Vnesite iskalne kriterije na levi",
    noResults: "Ni ujemajočih se barv",
    noResultsHint: "Poskusite drugo znamko ali kodo barve",
    formulasCount: (n) => `${n} formul${n === 1 ? "a" : n === 2 ? "i" : n === 3 || n === 4 ? "e" : ""}`,
    foundCount: (n) => `Najdenih ${n} barv`,
    truncatedHint: (max) => `Prikazanih prvih ${max} rezultatov. Izpopolnite iskanje.`,
    totalFormula: (c, f) => `${c} barv, ${f} formul`,
    colorsBadge: (n) => `${n} Barv`,
    formulasBadge: (n) => `${n} Formul`,
  }),

  // ========== Türkçe ==========
  tr: dict({
    brandName: "HIWE Formül Arama",
    brandNameShort: "HIWE",
    navSearch: "Ara", navProducts: "Ürünler", navAbout: "Hakkında",
    navFormulaSearch: "Formül Arama",
    navColorLibrary: "Renk Görsel Kitaplığı",
    navAppGuide: "Uygulama Kılavuzu",
    navAdmin: "Veri Yönetimi",
    userManagement: "Kullanıcı Yönetimi",
    logout: "Çıkış",
    loginWelcome: "Tekrar hoş geldiniz",
    loginSubtitle: "Sisteme erişmek için kimlik bilgilerinizi girin",
    loginEmail: "E-posta", loginPassword: "Parola",
    loginPlaceholderEmail: "siz@ornek.com",
    loginPlaceholderPassword: "Parolanızı girin",
    loginButton: "Başla", loginSigningIn: "Giriş yapılıyor...",
    loginErrorEmpty: "Kullanıcı adı ve parola girin",
    loginErrorNetwork: "Ağ hatası, tekrar deneyin",
    loginErrorFailed: "Giriş başarısız",
    panelTitle: "Formül Arama",
    make: "Marka", colorCode: "Renk Kodu", colorName: "Renk Adı", colorType: "Renk Tipi",
    allMakes: "Tüm Markalar",
    colorTypeAll: "Tümü", colorTypeSolid: "Düz", colorTypeMetallic: "Metalik",
    colorTypePearl: "Sedef", colorTypeMatte: "Mat", colorTypeCandy: "Candy",
    search: "Ara", searching: "Aranıyor...", reset: "Sıfırla",
    codeTooLong: "Renk kodu genellikle <= 10 karakterdir",
    colorCodePlaceholder: "örn. 040, NH731P",
    colorNamePlaceholder: "örn. Super White",
    year: "Yıl", yearPlaceholder: "örn. 2020 veya 2018-2022",
    detail: "Detay", expand: "Genişlet", collapse: "Daralt",
    version: "Sürüm", paintSystemNotes: "Notlar",
    volume: "Hacim", tonerCode: "Toner Kodu", tonerName: "Toner Adı",
    percentage: "Yüzde(%)", actualAmount: "Gerçek miktar(g)",
    colorInfo: "Renk Bilgisi", formulaVariants: "Formül Varyantları", components: "Bileşenler",
    makeLabel: "Marka", typeLabel: "Tip", yearsLabel: "Yıllar", codeLabel: "Kod",
    print: "Yazdır", copy: "Kopyala", notesLabel: "Notlar", updatedLabel: "Güncellendi",
    colorTypeSolidLabel: "Düz", colorTypeMetallicLabel: "Metalik", colorTypePearlLabel: "Sedef",
    colorTypeMatteLabel: "Mat", colorTypeCandyLabel: "Candy", colorTypeSpecialLabel: "Özel",
    copySuccess: "Panoya kopyalandı", copyFail: "Kopyalama başarısız",
    searchHint: "Sol tarafa arama kriterlerini girin",
    noResults: "Eşleşen renk bulunamadı",
    noResultsHint: "Farklı bir marka veya renk kodu deneyin",
    formulasCount: (n) => `${n} formül`,
    foundCount: (n) => `${n} renk bulundu`,
    truncatedHint: (max) => `İlk ${max} sonuç gösteriliyor. Lütfen aramayı daraltın.`,
    totalFormula: (c, f) => `${c} renk, ${f} formül`,
    colorsBadge: (n) => `${n} Renk`,
    formulasBadge: (n) => `${n} Formül`,
  }),

  // ========== עברית (RTL) ==========
  he: dict({
    brandName: "HIWE חיפוש פורמולות",
    brandNameShort: "HIWE",
    navSearch: "חיפוש", navProducts: "מוצרים", navAbout: "אודות",
    navFormulaSearch: "חיפוש פורמולות",
    navColorLibrary: "ספריית צבעים חזותית",
    navAppGuide: "מדריך יישום",
    navAdmin: "ניהול נתונים",
    userManagement: "ניהול משתמשים",
    logout: "יציאה",
    loginWelcome: "ברוך שובך",
    loginSubtitle: "הזן את האישורים שלך כדי לגשת למערכת",
    loginEmail: "דוא״ל", loginPassword: "סיסמה",
    loginPlaceholderEmail: "אתה@דוגמה.com",
    loginPlaceholderPassword: "הזן את הסיסמה שלך",
    loginButton: "התחל", loginSigningIn: "מתחבר...",
    loginErrorEmpty: "אנא הזן שם משתמש וסיסמה",
    loginErrorNetwork: "שגיאת רשת, אנא נסה שוב",
    loginErrorFailed: "ההתחברות נכשלה",
    panelTitle: "חיפוש פורמולות",
    make: "יצרן", colorCode: "קוד צבע", colorName: "שם הצבע", colorType: "סוג צבע",
    allMakes: "כל היצרנים",
    colorTypeAll: "הכל", colorTypeSolid: "אחיד", colorTypeMetallic: "מטאלי",
    colorTypePearl: "פנינה", colorTypeMatte: "מט", colorTypeCandy: "קנדי",
    search: "חפש", searching: "מחפש...", reset: "איפוס",
    codeTooLong: "קוד צבע הוא בדרך כלל <= 10 תווים",
    colorCodePlaceholder: "לדוגמה. 040, NH731P",
    colorNamePlaceholder: "לדוגמה. Super White",
    year: "שנה", yearPlaceholder: "לדוגמה. 2020 או 2018-2022",
    detail: "פרטים", expand: "הרחב", collapse: "צמצם",
    version: "גרסה", paintSystemNotes: "הערות",
    volume: "נפח", tonerCode: "קוד טונר", tonerName: "שם טונר",
    percentage: "אחוז(%)", actualAmount: "כמות בפועל(גר׳)",
    colorInfo: "מידע על הצבע", formulaVariants: "וריאציות פורמולה", components: "רכיבים",
    makeLabel: "יצרן", typeLabel: "סוג", yearsLabel: "שנים", codeLabel: "קוד",
    print: "הדפס", copy: "העתק", notesLabel: "הערות", updatedLabel: "עודכן",
    colorTypeSolidLabel: "אחיד", colorTypeMetallicLabel: "מטאלי", colorTypePearlLabel: "פנינה",
    colorTypeMatteLabel: "מט", colorTypeCandyLabel: "קנדי", colorTypeSpecialLabel: "מיוחד",
    copySuccess: "הועתק ללוח", copyFail: "ההעתקה נכשלה",
    searchHint: "הזן קריטריוני חיפוש משמאל",
    noResults: "לא נמצאו צבעים תואמים",
    noResultsHint: "נסה יצרן או קוד צבע אחר",
    formulasCount: (n) => `${n} פורמולות`,
    foundCount: (n) => `נמצאו ${n} צבעים`,
    truncatedHint: (max) => `מציג את ${max} התוצאות הראשונות. אנא צמצם את החיפוש.`,
    totalFormula: (c, f) => `${c} צבעים, ${f} פורמולות`,
    colorsBadge: (n) => `${n} צבעים`,
    formulasBadge: (n) => `${n} פורמולות`,
  }),

  // ========== العربية (RTL) ==========
  ar: dict({
    brandName: "HIWE بحث التركيبات",
    brandNameShort: "HIWE",
    navSearch: "بحث", navProducts: "منتجات", navAbout: "حول",
    navFormulaSearch: "بحث التركيبات",
    navColorLibrary: "مكتبة الألوان المرئية",
    navAppGuide: "دليل التطبيق",
    navAdmin: "إدارة البيانات",
    userManagement: "إدارة المستخدمين",
    logout: "تسجيل خروج",
    loginWelcome: "مرحبًا بعودتك",
    loginSubtitle: "أدخل بيانات اعتمادك للوصول إلى النظام",
    loginEmail: "البريد الإلكتروني", loginPassword: "كلمة المرور",
    loginPlaceholderEmail: "أنت@مثال.com",
    loginPlaceholderPassword: "أدخل كلمة المرور",
    loginButton: "ابدأ", loginSigningIn: "جارٍ تسجيل الدخول...",
    loginErrorEmpty: "يرجى إدخال اسم المستخدم وكلمة المرور",
    loginErrorNetwork: "خطأ في الشبكة، يرجى المحاولة مرة أخرى",
    loginErrorFailed: "فشل تسجيل الدخول",
    panelTitle: "بحث التركيبات",
    make: "الصانع", colorCode: "رمز اللون", colorName: "اسم اللون", colorType: "نوع اللون",
    allMakes: "جميع الصانعين",
    colorTypeAll: "الكل", colorTypeSolid: "صلب", colorTypeMetallic: "معدني",
    colorTypePearl: "لؤلؤي", colorTypeMatte: "غير لامع", colorTypeCandy: "حلوى",
    search: "بحث", searching: "جارٍ البحث...", reset: "إعادة تعيين",
    codeTooLong: "رمز اللون عادة <= 10 أحرف",
    colorCodePlaceholder: "مثال: 040, NH731P",
    colorNamePlaceholder: "مثال: Super White",
    year: "السنة", yearPlaceholder: "مثال: 2020 أو 2018-2022",
    detail: "تفاصيل", expand: "توسيع", collapse: "طي",
    version: "الإصدار", paintSystemNotes: "ملاحظات",
    volume: "الحجم", tonerCode: "رمز الحبر", tonerName: "اسم الحبر",
    percentage: "النسبة(٪)", actualAmount: "الكمية الفعلية(جم)",
    colorInfo: "معلومات اللون", formulaVariants: "متغيرات التركيبة", components: "المكونات",
    makeLabel: "الصانع", typeLabel: "النوع", yearsLabel: "السنوات", codeLabel: "الرمز",
    print: "طباعة", copy: "نسخ", notesLabel: "ملاحظات", updatedLabel: "تم التحديث",
    colorTypeSolidLabel: "صلب", colorTypeMetallicLabel: "معدني", colorTypePearlLabel: "لؤلؤي",
    colorTypeMatteLabel: "غير لامع", colorTypeCandyLabel: "حلوى", colorTypeSpecialLabel: "خاص",
    copySuccess: "تم النسخ إلى الحافظة", copyFail: "فشل النسخ",
    searchHint: "أدخل معايير البحث على اليسار",
    noResults: "لم يتم العثور على ألوان مطابقة",
    noResultsHint: "جرب صانعًا أو رمز لون مختلفًا",
    formulasCount: (n) => {
      if (n === 1) return "تركيبة واحدة";
      if (n === 2) return "تركيبتان";
      if (n >= 3 && n <= 10) return `${n} تركيبات`;
      return `${n} تركيبة`;
    },
    foundCount: (n) => {
      if (n === 1) return "تم العثور على لون واحد";
      if (n === 2) return "تم العثور على لونين";
      if (n >= 3 && n <= 10) return `تم العثور على ${n} ألوان`;
      return `تم العثور على ${n} لونًا`;
    },
    truncatedHint: (max) => `يتم عرض أول ${max} نتائج. يرجى تحسين البحث.`,
    totalFormula: (c, f) => `${c} ألوان، ${f} تركيبات`,
    colorsBadge: (n) => `${n} ألوان`,
    formulasBadge: (n) => `${n} تركيبات`,
  }),

  // ========== Nederlands ==========
  nl: dict({
    brandName: "HIWE Formule zoeken",
    brandNameShort: "HIWE",
    navSearch: "Zoeken", navProducts: "Producten", navAbout: "Over ons",
    navFormulaSearch: "Formule zoeken",
    navColorLibrary: "Kleurenbibliotheek",
    navAppGuide: "Toepassingsgids",
    navAdmin: "Gegevensbeheer",
    userManagement: "Gebruikersbeheer",
    logout: "Afmelden",
    loginWelcome: "Welkom terug",
    loginSubtitle: "Voer uw inloggegevens in",
    loginEmail: "E-mail", loginPassword: "Wachtwoord",
    loginPlaceholderEmail: "u@voorbeeld.com",
    loginPlaceholderPassword: "Voer uw wachtwoord in",
    loginButton: "Starten", loginSigningIn: "Inloggen...",
    loginErrorEmpty: "Voer gebruikersnaam en wachtwoord in",
    loginErrorNetwork: "Netwerkfout, probeer opnieuw",
    loginErrorFailed: "Inloggen mislukt",
    panelTitle: "Formule zoeken",
    make: "Merk", colorCode: "Kleurcode", colorName: "Kleurnaam", colorType: "Kleurtype",
    allMakes: "Alle merken",
    colorTypeAll: "Alle", colorTypeSolid: "Effen", colorTypeMetallic: "Metallic",
    colorTypePearl: "Parelmoer", colorTypeMatte: "Mat", colorTypeCandy: "Candy",
    search: "Zoeken", searching: "Zoeken...", reset: "Resetten",
    codeTooLong: "Kleurcode is meestal <= 10 tekens",
    colorCodePlaceholder: "bijv. 040, NH731P",
    colorNamePlaceholder: "bijv. Super White",
    year: "Jaar", yearPlaceholder: "bijv. 2020 of 2018-2022",
    detail: "Detail", expand: "Uitklappen", collapse: "Inklappen",
    version: "Versie", paintSystemNotes: "Notities",
    volume: "Volume", tonerCode: "Tonercode", tonerName: "Toner naam",
    percentage: "Percentage(%)", actualAmount: "Werkelijke hoeveelheid(g)",
    colorInfo: "Kleurinfo", formulaVariants: "Formulevarianten", components: "Componenten",
    makeLabel: "Merk", typeLabel: "Type", yearsLabel: "Jaren", codeLabel: "Code",
    print: "Afdrukken", copy: "Kopiëren", notesLabel: "Notities", updatedLabel: "Bijgewerkt",
    colorTypeSolidLabel: "Effen", colorTypeMetallicLabel: "Metallic", colorTypePearlLabel: "Parelmoer",
    colorTypeMatteLabel: "Mat", colorTypeCandyLabel: "Candy", colorTypeSpecialLabel: "Speciaal",
    copySuccess: "Gekopieerd naar klembord", copyFail: "Kopiëren mislukt",
    searchHint: "Voer links zoekcriteria in",
    noResults: "Geen overeenkomende kleuren gevonden",
    noResultsHint: "Probeer een ander merk of kleurcode",
    formulasCount: (n) => `${n} formule${n > 1 ? "s" : ""}`,
    foundCount: (n) => `${n} kleur${n > 1 ? "en" : ""} gevonden`,
    truncatedHint: (max) => `Eerste ${max} resultaten weergegeven. Vernauw uw zoekopdracht.`,
    totalFormula: (c, f) => `${c} kleur${c > 1 ? "en" : ""}, ${f} formule${f > 1 ? "s" : ""}`,
    colorsBadge: (n) => `${n} Kleuren`,
    formulasBadge: (n) => `${n} Formules`,
  }),
};
