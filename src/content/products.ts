import type { Product } from "@/types/content";

/**
 * PLACEHOLDER CONTENT — the six works.
 *
 * Six, not nine. A studio with six substantial pieces is more credible than
 * one with nine thin ones, and it cuts the image load by a third.
 *
 * THE COPY RULE, and it is the one most easily broken here. The shortage of
 * words is the design: a description is at most twelve words, a statement one
 * sentence of twenty, a body paragraph forty. Editorial copy poured into a
 * brutalist layout is what makes a site like this fail — the layout says
 * "register", the prose says "magazine", and the reader believes the prose.
 *
 * WHAT IS NEVER WRITTEN HERE: a client's name, an award, a press mention, a
 * result, a percentage, a headcount. «کارفرما» names a *kind* of client —
 * «ناشر مستقل», «کافه», «استودیوی عکاسی» — which is what lets the same demo
 * be shown to a photographer and to a motion designer without a word
 * changing. No sentence praises the studio; the work is the claim.
 *
 * IMAGES: every plate is 1:1. The source files are square and every crop on
 * the site is CSS, so there is no second image set to keep in sync and a real
 * photograph replaces a placeholder by filename alone.
 */
export const products: Product[] = [
  {
    id: "w-01",
    slug: "kart-o-kaghaz",
    figure: "01",
    name: "کارت و کاغذ",
    latin: "KART-O-KAGHAZ",
    category: "هویت بصری",
    role: "طراحی و اجرا",
    description: "کارت، سربرگ و پاکت برای یک برند پوشاک.",
    statement: "هویتی که فقط روی کاغذ دیده می‌شود، باید روی همان کاغذ آزمایش شود.",
    body: [
      "نمونه‌ها پیش از تأیید روی سه کاغذ چاپ شدند. انتخاب نهایی کاغذ بدون روکش بود، چون مرکب در آن فرو می‌نشیند و لبه‌ها نرم می‌شوند.",
      "سربرگ و پاکت از همان شبکه‌ای پیروی می‌کنند که روی کارت بسته شد. هیچ عنصری در این مجموعه بزرگ‌تر از کارت نیست.",
    ],
    details: [
      { label: "کارفرما", value: "برند پوشاک" },
      { label: "سال", value: "1403" },
      { label: "نقش", value: "طراحی و اجرا" },
      { label: "تحویلی", value: "کارت، سربرگ، پاکت" },
    ],
    image: {
      src: "/media/work-01.jpg",
      alt: "دسته‌ای کارت سفید و کاغذ تاشده، پخش‌شده روی سطح بتنی",
      ratio: "1/1",
    },
    views: [
      {
        src: "/media/work-01-a.jpg",
        alt: "همان دسته کارت از زاویهٔ پایین، با سایه‌های بلند",
        ratio: "1/1",
      },
      {
        src: "/media/work-01-b.jpg",
        alt: "یک کارت سفید ایستاده مقابل دیوار بتنی",
        ratio: "1/1",
      },
    ],
    status: "published",
  },
  {
    id: "w-02",
    slug: "neshane-o-sath",
    figure: "02",
    name: "نشانه و سطح",
    latin: "NESHANE-O-SATH",
    category: "هویت بصری",
    role: "طراحی نشانه",
    description: "نشانه و دستورالعمل استفاده، برای یک استودیوی عکاسی.",
    statement: "نشانه وقتی کار می‌کند که در کوچک‌ترین اندازه هم همان شکل باشد.",
    body: [
      "نشانه از سه سطح ساخته شده است که روی هم می‌نشینند. در اندازهٔ کوچک دو سطح حذف می‌شوند و شکل باقی‌مانده هنوز خوانده می‌شود.",
      "دستورالعمل کوتاه است: حداقل اندازه، حداقل فاصله، و دو حالت رنگ. بقیه‌اش به دست کسی سپرده شده که هر روز با آن کار می‌کند.",
    ],
    details: [
      { label: "کارفرما", value: "استودیوی عکاسی" },
      { label: "سال", value: "1404" },
      { label: "نقش", value: "طراحی نشانه" },
      { label: "تحویلی", value: "نشانه و دستورالعمل" },
    ],
    image: {
      src: "/media/work-02.jpg",
      alt: "شکل‌های هندسی تخت روی هم، در سفید و مشکی و نارنجی تند",
      ratio: "1/1",
    },
    views: [
      {
        src: "/media/work-02-a.jpg",
        alt: "سه شکل از همان مجموعه، جدا از هم روی سطحی ساده",
        ratio: "1/1",
      },
      {
        src: "/media/work-02-b.jpg",
        alt: "همان شکل‌ها در هم‌پوشانی نزدیک، برش تنگ",
        ratio: "1/1",
      },
    ],
    status: "published",
  },
  {
    id: "w-03",
    slug: "ketab-baz",
    figure: "03",
    name: "کتاب باز",
    latin: "KETAB-BAZ",
    category: "چاپ و نشر",
    role: "طراحی و صفحه‌آرایی",
    description: "جلد و صفحه‌آرایی یک مجموعه شعر، برای ناشر مستقل.",
    statement: "کتابی که باز نمی‌ماند، خوانده نمی‌شود.",
    body: [
      "صحافی طوری انتخاب شد که کتاب روی میز باز بماند. این تصمیم پیش از انتخاب حروف گرفته شد، چون عرض ستون به آن وابسته بود.",
      "حاشیهٔ داخلی از حاشیهٔ بیرونی پهن‌تر است. در کتابی با این ضخامت تنها راه بود که هیچ سطری داخل شیرازه گم نشود.",
    ],
    details: [
      { label: "کارفرما", value: "ناشر مستقل" },
      { label: "سال", value: "1404" },
      { label: "نقش", value: "طراحی و صفحه‌آرایی" },
      { label: "تحویلی", value: "جلد و صفحه‌آرایی" },
    ],
    image: {
      src: "/media/work-03.jpg",
      alt: "کتابی باز با صفحه‌های سفید، شیرازه تخت روی سطح بتنی",
      ratio: "1/1",
    },
    views: [
      { src: "/media/work-03-a.jpg", alt: "دسته‌ای کتاب با جلد سفید از بالا", ratio: "1/1" },
      { src: "/media/work-03-b.jpg", alt: "یک جلد سفید با گوشهٔ بلندشده و سایهٔ تند", ratio: "1/1" },
    ],
    status: "published",
  },
  {
    id: "w-04",
    slug: "form-chapi",
    figure: "04",
    name: "فرم چاپی",
    latin: "FORM-CHAPI",
    category: "چاپ و نشر",
    role: "طراحی چاپ",
    description: "مجموعهٔ فرم‌های چاپی یک کافه، در یک اندازه.",
    statement: "هر فرم اندازهٔ خودش را داشت؛ حالا همه از یک ورق بریده می‌شوند.",
    body: [
      "شش فرم جدا با شش اندازه، روی یک ورق استاندارد بازنویسی شدند. ضایعات چاپ کم شد و انبار کردن‌شان ساده‌تر.",
      "تایپوگرافی در هر شش فرم یکی است. تفاوت‌شان فقط در یک نوار رنگی بالای صفحه است.",
    ],
    details: [
      { label: "کارفرما", value: "کافه" },
      { label: "سال", value: "1405" },
      { label: "نقش", value: "طراحی چاپ" },
      { label: "تحویلی", value: "شش فرم چاپی" },
    ],
    image: {
      src: "/media/work-04.jpg",
      alt: "ورق‌های چاپی سفید، روی هم و کمی باز شده",
      ratio: "1/1",
    },
    views: [
      { src: "/media/work-04-a.jpg", alt: "لبهٔ تاب‌خوردهٔ یک ورق، برش بسیار نزدیک", ratio: "1/1" },
      { src: "/media/work-04-b.jpg", alt: "ورق‌های تاشده که نقشی هندسی و تیز می‌سازند", ratio: "1/1" },
    ],
    status: "published",
  },
  {
    id: "w-05",
    slug: "jabe-navari",
    figure: "05",
    name: "جعبهٔ نواری",
    latin: "JABE-NAVARI",
    category: "بسته‌بندی",
    role: "طراحی بسته",
    description: "جعبهٔ مقوایی بدون چاپ، با یک نوار رنگی.",
    statement: "یک نوار روی مقوای خام، به جای تمام چیزی که معمولاً چاپ می‌شود.",
    body: [
      "مقوا بدون روکش و بدون چاپ می‌ماند. تنها عنصر افزوده یک نوار است که دور جعبه می‌چرخد و جای بازشدن را نشان می‌دهد.",
      "برچسب محتوا روی همان نوار می‌نشیند. جعبه بدون برچسب هم کامل است، و همین باعث می‌شود یک قالب برای چند محصول کافی باشد.",
    ],
    details: [
      { label: "کارفرما", value: "فروشگاه لوازم خانه" },
      { label: "سال", value: "1403" },
      { label: "نقش", value: "طراحی بسته" },
      { label: "تحویلی", value: "جعبه و نوار" },
    ],
    image: {
      src: "/media/work-05.jpg",
      alt: "جعبهٔ مقوایی ساده و بدون برچسب، با یک نوار نارنجی تند",
      ratio: "1/1",
    },
    views: [
      { src: "/media/work-05-a.jpg", alt: "همان جعبه، باز و با درهای بالا رفته، از نمای بالا", ratio: "1/1" },
      { src: "/media/work-05-b.jpg", alt: "سه جعبهٔ یکسان در یک ردیف فشرده", ratio: "1/1" },
    ],
    status: "published",
  },
  {
    id: "w-06",
    slug: "shishe-o-lule",
    figure: "06",
    name: "شیشه و لوله",
    latin: "SHISHE-O-LULE",
    category: "بسته‌بندی",
    role: "طراحی بسته",
    description: "بسته‌بندی یک نوشیدنی: شیشه، لولهٔ کاغذی، برچسب.",
    statement: "دو ظرف با دو جنس، که باید کنار هم یک چیز به نظر برسند.",
    body: [
      "شیشه بدون رنگ ماند و لولهٔ کاغذی بدون روکش. آنچه این دو را به هم وصل می‌کند نسبت برچسب است، نه رنگش.",
      "برچسب روی هر دو در یک ارتفاع می‌نشیند. وقتی کنار هم بایستند، یک خط افقی از هر دو عبور می‌کند.",
    ],
    details: [
      { label: "کارفرما", value: "تولیدکنندهٔ نوشیدنی" },
      { label: "سال", value: "1405" },
      { label: "نقش", value: "طراحی بسته" },
      { label: "تحویلی", value: "شیشه، لوله، برچسب" },
    ],
    image: {
      src: "/media/work-06.jpg",
      alt: "یک شیشهٔ بدون برچسب و یک لولهٔ کاغذی ساده، ایستاده کنار هم",
      ratio: "1/1",
    },
    views: [
      { src: "/media/work-06-a.jpg", alt: "همان دو ظرف خوابیده، با سایه‌های موازی بلند", ratio: "1/1" },
      { src: "/media/work-06-b.jpg", alt: "برش نزدیک روی شانهٔ شیشه، با کنتراست تند", ratio: "1/1" },
    ],
    status: "published",
  },
];

/**
 * What every surface renders: drafts filtered out, exactly as a CMS would.
 *
 * No `resolveProducts()` step. The engine had one because two presentation
 * fields — an ambient shade colour and a grid arrangement — were optional on
 * the authoring type and had to be filled in before a component could use
 * them. Neither exists here: the design is flat, so there is no shade, and
 * every row of the register is identical, so there is no arrangement. Nothing
 * is left to default, and the authoring shape and the rendering shape are the
 * same shape.
 */
export const publishedProducts = products.filter((p) => p.status === "published");
