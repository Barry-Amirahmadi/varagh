import type {
  AboutContent,
  ArchivePageContent,
  ContactContent,
  DisciplinesContent,
  IndexContent,
  NotFoundContent,
  SelectedContent,
  StatementContent,
  WorkPageContent,
} from "@/types/content";

/**
 * PLACEHOLDER CONTENT — the copy deck.
 *
 * Every line below is a *position* an editor can rewrite, not a factual claim.
 * Nothing here states a founding year, a client, an award, a headcount or a
 * number, because none was supplied.
 *
 * TYPING RULE: every export is annotated with an interface from
 * `@/types/content`, never left to inference. An inferred type describes the
 * literal that happens to be written here; a declared one describes what any
 * source — this file, or a CMS response — has to provide. Only the second is a
 * contract, and the second is the whole claim of the content layer.
 *
 * LINK RULE: every `href` is written from the site root. `next/link` applies
 * the deployment base path to a root-relative href, and that is the only form
 * that survives being served from a GitHub Pages project subpath.
 *
 * BANNED VOCABULARY, enforced by reading rather than by a lint rule: خلاق ·
 * حرفه‌ای · باتجربه · منحصربه‌فرد · برتر · پیشرو · بهترین · باکیفیت ·
 * نوآورانه. A designer opening this writes those words for clients every day
 * and spots them instantly. Any sentence praising the studio is cut — the work
 * is the claim.
 */

/**
 * The statement band — the entire first screen.
 *
 * Six words. Not a headline with a supporting paragraph under it: there is no
 * paragraph, and adding one is the single easiest way to turn this page back
 * into the editorial template it is derived from.
 *
 * `meta` is the line under the rule. The third entry is an em dash standing
 * where a founding year would go, because the studio has not claimed one and
 * an empty slot is more honest than an invented figure.
 */
export const statement: StatementContent = {
  text: "کار ما روی کاغذ تمام می‌شود",
  meta: ["تهران", "هویت بصری · چاپ و نشر · بسته‌بندی", "—"],
};

/**
 * The index — the core of the homepage and the whole of the collection route.
 *
 * It replaces both the showcase and the gallery preview the engine's homepage
 * carried. One register, six rows, no images: what a studio's visitor wants
 * first is the shape of the body of work, and six pictures answer that more
 * slowly than six lines do.
 */
export const workIndex: IndexContent = {
  heading: "فهرست کارها",
  listLabel: "فهرست کارها",
  columns: {
    figure: "شماره",
    title: "عنوان",
    discipline: "حوزه",
    role: "نقش",
  },
  countLabel: "کار",
  jumpLabel: "پرش به حوزه",
  allLabel: "فهرست کامل، به تفکیک حوزه",
  allHref: "/products/",
  seo: {
    title: "فهرست کارها",
    description: "شش کار در سه حوزه — هویت بصری، چاپ و نشر، بسته‌بندی.",
  },
};

export const selected: SelectedContent = {
  heading: "سه کار",
  listLabel: "سه کار برگزیده",
};

export const disciplines: DisciplinesContent = {
  heading: "حوزه‌ها",
  items: [
    {
      id: "d-identity",
      title: "هویت بصری",
      body: "نشانه، رنگ، حروف و شبکه. آنچه تحویل می‌دهیم یک فایل نیست؛ مجموعه‌ای از تصمیم‌هاست که کس دیگری بتواند هر روز به کارشان ببرد.",
    },
    {
      id: "d-print",
      title: "چاپ و نشر",
      body: "کتاب، نشریه، فرم. کار از انتخاب کاغذ و صحافی شروع می‌شود، نه از صفحهٔ اول. باقی تصمیم‌ها بعد از آن گرفته می‌شوند.",
    },
    {
      id: "d-packaging",
      title: "بسته‌بندی",
      body: "جعبه، برچسب، ظرف. اندازه و جنس پیش از گرافیک تعیین می‌شود، چون چیزی که چاپ می‌شود روی چیزی می‌نشیند که باید ساخته شود.",
    },
  ],
};

/**
 * The contact band, and the details block at the foot of the about page.
 *
 * Two channels, no form. A form needs a third-party backend to post to, and
 * the engine shipped one with `action="#"` that put a typed email address into
 * the URL and into browser history — a defect this repo's smoke pass now
 * forbids reintroducing.
 */
export const contact: ContactContent = {
  heading: "تماس",
  instagramLabel: "اینستاگرام",
  emailLabel: "ایمیل",
  labels: {
    city: "شهر",
    email: "ایمیل",
    instagram: "اینستاگرام",
  },
};

export const workPage: WorkPageContent = {
  detailsHeading: "مشخصات",
  viewsHeading: "تصویرهای بیشتر",
  relatedHeading: "ادامهٔ فهرست",
  backLabel: "بازگشت به فهرست",
  breadcrumbHome: "صفحهٔ اصلی",
  breadcrumbCollection: "فهرست کارها",
  breadcrumbLabel: "مسیر صفحه",
};

export const archivePage: ArchivePageContent = {
  heading: "آرشیو",
  lead: "تصویرهای حین کار. بدون شرح.",
  listLabel: "آرشیو تصویرها",
  seo: {
    title: "آرشیو",
    description: "تصویرهای حین کار استودیو ورق — کاغذ، مرکب، نمونه‌رنگ و برش.",
  },
};

/**
 * The about page.
 *
 * Three paragraphs, no image, no founder, no founding year, no laboratory,
 * no "since". None of that has been supplied, and a portfolio piece that
 * invents a company history to fill an about page is making in prose the
 * mistake the content-honesty rule is about. What is written here is method:
 * how the studio decides, which is something a studio can assert about itself.
 */
export const about: AboutContent = {
  heading: "استودیو",
  body: [
    "ورق یک استودیوی طراحی گرافیک است. کارمان در سه حوزه می‌گذرد: هویت بصری، چاپ و نشر، و بسته‌بندی. هر سه به یک چیز ختم می‌شوند — سطحی که باید چاپ شود و در دست کسی قرار بگیرد.",
    "روش کار ثابت است. اول محدودیت‌ها نوشته می‌شوند: اندازه، جنس، تیراژ، بودجه. طراحی بعد از آن شروع می‌شود، و هر تصمیمی که با یکی از آن محدودیت‌ها نخواند همان‌جا کنار گذاشته می‌شود.",
    "آنچه تحویل می‌دهیم قابل اجراست: فایل‌های چاپی، دستورالعمل کوتاه، و نمونه‌ای که پیش از تیراژ روی همان کاغذ نهایی گرفته شده باشد.",
  ],
  seo: {
    title: "استودیو",
    description: "روش کار استودیو ورق، و راه‌های تماس.",
  },
};

/**
 * The 404 page.
 *
 * `figure` is in Persian digits, unlike every other number set in the mono
 * face on this site. It is not a catalogue mark — see the scoping note in
 * `src/lib/digits.ts` — it is a status code being read aloud to a Persian
 * reader who has already gone wrong.
 */
export const notFound: NotFoundContent = {
  figure: "۴۰۴",
  heading: "این نشانی وجود ندارد",
  lead: "ممکن است نشانی تغییر کرده باشد. فهرست کارها از صفحهٔ اصلی در دسترس است.",
  action: { label: "بازگشت به صفحهٔ اصلی", href: "/" },
};
