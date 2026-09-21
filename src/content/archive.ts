import type { ArchiveItem } from "@/types/content";

/**
 * PLACEHOLDER CONTENT — the archive.
 *
 * Process shots, not finished work. Six plates, one ratio, no captions at all:
 * a caption under a process photograph is a small essay about a thing the
 * reader can already see, and this design has no room for one.
 *
 * `alt` still carries a full description — that is not a caption, it is the
 * picture for someone who cannot see it, and dropping it because the visible
 * caption went away would be the wrong reading of "no captions".
 *
 * `code` is authored rather than derived from `order`, so reordering the
 * archive never silently renumbers a plate.
 */
export const archiveItems: ArchiveItem[] = [
  {
    id: "a-01",
    code: "A01",
    alt: "غلتک‌های مرکب و یک ورق آزمایشی سفید روی میز دستگاه چاپ",
    image: {
      src: "/media/archive-01.jpg",
      alt: "غلتک‌های مرکب و یک ورق آزمایشی سفید روی میز دستگاه چاپ",
      ratio: "1/1",
    },
    order: 1,
  },
  {
    id: "a-02",
    code: "A02",
    alt: "بادبزن نمونه‌رنگ، باز شده به شکل کمان، فقط در تن‌های خاموش",
    image: {
      src: "/media/archive-02.jpg",
      alt: "بادبزن نمونه‌رنگ، باز شده به شکل کمان، فقط در تن‌های خاموش",
      ratio: "1/1",
    },
    order: 2,
  },
  {
    id: "a-03",
    code: "A03",
    alt: "نمونه‌های کاغذ تاشده با ضخامت‌های مختلف، مرتب‌شده روی هم",
    image: {
      src: "/media/archive-03.jpg",
      alt: "نمونه‌های کاغذ تاشده با ضخامت‌های مختلف، مرتب‌شده روی هم",
      ratio: "1/1",
    },
    order: 3,
  },
  {
    id: "a-04",
    code: "A04",
    alt: "خط‌کش فلزی و تیغ روی زیرانداز برش، با کاغذ سفید زیر آن",
    image: {
      src: "/media/archive-04.jpg",
      alt: "خط‌کش فلزی و تیغ روی زیرانداز برش، با کاغذ سفید زیر آن",
      ratio: "1/1",
    },
    order: 4,
  },
  {
    id: "a-05",
    code: "A05",
    alt: "فیلم‌های رنگی نیمه‌شفاف روی هم، یکی نارنجی تند میان خاکستری‌ها",
    image: {
      src: "/media/archive-05.jpg",
      alt: "فیلم‌های رنگی نیمه‌شفاف روی هم، یکی نارنجی تند میان خاکستری‌ها",
      ratio: "1/1",
    },
    order: 5,
  },
  {
    id: "a-06",
    code: "A06",
    alt: "شبکه‌ای از مربع‌های کاغذ سفید، سنجاق‌شده به دیوار بتنی",
    image: {
      src: "/media/archive-06.jpg",
      alt: "شبکه‌ای از مربع‌های کاغذ سفید، سنجاق‌شده به دیوار بتنی",
      ratio: "1/1",
    },
    order: 6,
  },
];

export const sortedArchive = [...archiveItems].sort((a, b) => a.order - b.order);
