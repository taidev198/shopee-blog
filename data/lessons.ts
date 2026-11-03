export type ResourceKind = 'video' | 'sheet' | 'link' | 'folder'

export interface Resource {
  kind: ResourceKind
  title: string
  url: string
  /** YouTube video id, only for kind === 'video' */
  videoId?: string
}

export interface Section {
  slug: string
  order: string
  title: string
  icon: string
  summary: string
  resources: Resource[]
  /** Extra Zalo group links rendered as a list (section 6) */
  hasZaloGroups?: boolean
}

const yt = (videoId: string, title: string): Resource => ({
  kind: 'video',
  title,
  videoId,
  url: `https://www.youtube.com/watch?v=${videoId}`,
})
const sheet = (title: string, url: string): Resource => ({ kind: 'sheet', title, url })
const link = (title: string, url: string): Resource => ({ kind: 'link', title, url })
const folder = (title: string, url: string): Resource => ({ kind: 'folder', title, url })

export const sections: Section[] = [
  {
    slug: 'phan-tich-doi-thu-thuat-toan',
    order: '1',
    title: 'Phân tích đối thủ & thuật toán hiển thị Shopee',
    icon: '🔍',
    summary: 'Phân tích đối thủ trên sàn, ngoại sàn (metric.vn) và cách thuật toán hiển thị của Shopee hoạt động.',
    resources: [
      yt('9IDnXrLpYy8', 'Phân tích đối thủ bán hàng shopee và chiến lược bán hàng shopee hiệu quả 2023'),
      link('Metric.vn – phân tích đối thủ ngoại sàn', 'https://metric.vn'),
      yt('uV2_S4QGcpk', 'Buổi 1 Coaching 1:1 HV Duy – Thuật toán hiển thị Shopee'),
    ],
  },
  {
    slug: 'tieu-de-chuan-seo',
    order: '2',
    title: 'Đặt tiêu đề chuẩn SEO',
    icon: '🏷️',
    summary: 'Checklist chuẩn SEO và video hướng dẫn đặt tiêu đề sản phẩm.',
    resources: [
      sheet('Checklist chuẩn SEO', 'https://docs.google.com/spreadsheets/u/1/d/1U6cG6nz0U4VjUMfIh_lcm8Ugf1L0w696_Ms8E4swl0U/edit?usp=sharing'),
      yt('hq64sTK7gek', 'Hướng dẫn đặt tiêu đề sản phẩm chuẩn SEO'),
    ],
  },
  {
    slug: 'marketing-noi-san-shopee',
    order: '3',
    title: 'Marketing nội sàn Shopee',
    icon: '📣',
    summary: 'Các chương trình marketing, treo livestream và quảng cáo cơ bản.',
    resources: [
      yt('hYCmoMKBD4o', 'Các chương trình marketing – Buổi 2 Coaching 1:1 HV Duy'),
      yt('v2My3wedE6I', 'Treo livestream Shopee – cách live stream bằng máy tính đơn giản nhất'),
      yt('0-HxgJSgDkw', 'Quảng cáo cơ bản – Buổi 3 Quảng cáo Shopee HV Duy'),
    ],
  },
  {
    slug: 'quang-cao-shopee-nang-cao',
    order: '4',
    title: 'Quảng cáo Shopee nâng cao',
    icon: '🚀',
    summary: 'Tạo quảng cáo giao diện cũ/mới và chuỗi 4 buổi đào tạo chuyên sâu.',
    resources: [
      yt('QuhaSSrfXek', 'Hướng dẫn tạo quảng cáo giao diện cũ 2024'),
      yt('wcZAGMV9MS8', 'Hướng dẫn tạo quảng cáo giao diện mới 2024'),
      yt('VQnlazdXDhc', 'Buổi 1 – Quảng cáo nâng cao Shopee'),
      yt('cRtDWKKWtJQ', 'Buổi 2 – Quảng cáo Shopee chuyên sâu'),
      yt('ZAx0OUVi-RA', 'Buổi 3 – Đào tạo quảng cáo Shopee chuyên sâu'),
      yt('AffpkO0UYU4', 'Buổi 4 – Quảng cáo Shopee nâng cao'),
    ],
  },
  {
    slug: 'seeding-buff-don',
    order: '5',
    title: 'Seeding / Buff đơn',
    icon: '⭐',
    summary: 'Quy trình seeding chuẩn, công thức seeding 5★ cam kết ra đơn.',
    resources: [
      yt('V7zB5Mkxy8E', 'Quy trình seeding chuẩn'),
      sheet('Bản sao của Seeding Lazada – Cappi (công thức seeding 5★)', 'https://docs.google.com/spreadsheets/d/1mzQgrVaqhB5xCBSnopRaL_z32C_Ki9It3VZ5jrgYszQ/edit#gid=1689052173'),
    ],
  },
  {
    slug: 'traffic-ngoai-san',
    order: '6',
    title: 'Traffic ngoại sàn',
    icon: '🌐',
    summary: 'Kéo traffic từ mạng xã hội, TikTok, mã giảm giá và các nhóm Zalo/Facebook đăng deal.',
    hasZaloGroups: true,
    resources: [
      yt('7e-p5o9nUZs', 'Buổi 4 – Traffic ngoại sàn HV Duy'),
      yt('gZzhtequR44', 'Buổi 6 – Xây dựng kênh MXH cho sản phẩm/gian hàng HV Duy'),
      yt('2VusQcypA6s', 'Buổi 10 – Coach 1:1 Mã giảm giá và xây kênh TikTok HV Chính'),
      yt('t6tUthrApDI', 'Đăng deal / mã giảm giá'),
      sheet('Bản sao của Nhóm zalo/facebook đăng bài', 'https://docs.google.com/spreadsheets/d/1vBQfx-97gaqwDL4nJ_rjcX61qmXO8mhJHWIxWsjNnPo/edit?usp=sharing'),
    ],
  },
  {
    slug: 'co-cau-san-pham-vong-doi',
    order: '7',
    title: 'Cơ cấu sản phẩm & vòng đời sản phẩm',
    icon: '♻️',
    summary: 'Cách xây dựng cơ cấu sản phẩm và quản lý vòng đời sản phẩm.',
    resources: [yt('rb2l3ACVlV0', 'Buổi 5 – Cơ cấu và vòng đời sản phẩm')],
  },
  {
    slug: 'phan-tich-doi-thu',
    order: '8',
    title: 'Phân tích đối thủ',
    icon: '🕵️',
    summary: 'Phương pháp phân tích đối thủ để xây chiến lược bán hàng.',
    resources: [yt('9IDnXrLpYy8', 'Phân tích đối thủ bán hàng shopee và chiến lược bán hàng shopee hiệu quả 2023')],
  },
  {
    slug: 'traffic-noi-san-lazada',
    order: '9',
    title: 'Traffic nội sàn Lazada',
    icon: '🛍️',
    summary: 'Kéo traffic nội sàn Lazada và hướng dẫn chạy quảng cáo Lazada.',
    resources: [
      yt('0z5K3131gR4', 'Buổi 7 – Traffic nội sàn Lazada (app người mua) HV Duy'),
      yt('E-SQn2scLSA', 'Buổi 7 – Coach 1:1 Traffic nội sàn Lazada p2 HV Chính'),
      yt('qWDG8oE4C6g', 'Quảng cáo Lazada – Coaching 1:1'),
    ],
  },
  {
    slug: 'tiktok',
    order: '10',
    title: 'TikTok',
    icon: '🎵',
    summary: 'Xây kênh TikTok để kéo traffic về gian hàng.',
    resources: [yt('LV7TrAXVuw0', 'Buổi 9 – TikTok p2 HV Chính')],
  },
  {
    slug: 'nhan-ban-shop',
    order: '11',
    title: 'Nhân bản shop',
    icon: '🧬',
    summary: 'Hướng dẫn nhân bản shop trên Shopee.',
    resources: [yt('mi4DB_Hznic', 'Hướng dẫn nhân bản shop trên Shopee')],
  },
  {
    slug: 'cau-hoi-thuong-gap',
    order: 'B',
    title: 'Câu hỏi thường gặp',
    icon: '❓',
    summary: 'Kế hoạch vận hành, xử lý quảng cáo, chi phí bán hàng, hoàn tiền và các công cụ hữu ích.',
    resources: [
      sheet('Kế hoạch vận hành shop Shopee', 'https://docs.google.com/spreadsheets/d/16f37k5Pu6f6EDUdgwn7WOacG6l51lUhhIT1jUTCXxzA/edit?usp=sharing'),
      yt('3ehUQUXdNNc', 'Quảng cáo không cắn tiền, chi phí ads cao – nguyên nhân & giải pháp (p1)'),
      yt('oiUFLcvuodk', 'Quảng cáo không cắn tiền, chi phí ads cao – nguyên nhân & giải pháp (p2)'),
      yt('pBA6IiKxjBw', 'Định nghĩa các loại quảng cáo Shopee'),
      yt('F2g445-lNT0', 'Đăng ký ngày sp cho ngày sale trong tháng của sàn'),
      yt('VcTBnB-K4dI', 'Quy trình trả hàng/hoàn tiền Shopee cho người bán và người mua'),
      yt('SBmQ8977b8Y', 'Theo dõi chỉ số quảng cáo Shopee hàng ngày với Google Sheet'),
      sheet('Chi phí bán hàng Shopee', 'https://docs.google.com/spreadsheets/d/1SY2W08niNnkzXMSeCq07j71Wb-PltG1Kn2ImNZhgmXM/edit?usp=sharing'),
      sheet('Chi phí bán hàng Lazada', 'https://docs.google.com/spreadsheets/d/10hl760R6WBz8vueH7wB904AwKP_rjBO35DG919ftDNY/edit?usp=sharing'),
      folder('Top từ khoá tìm kiếm hot theo từng tháng (báo cáo từ Shopee)', 'https://drive.google.com/drive/folders/1Z9eATzU-CS4DrDZL64If-Yb5lrCHM7rX'),
      link('Tool check từ khoá QC Shopee của đối thủ (AutoShopee Kit)', 'https://kit.autoshopee.com/'),
    ],
  },
]

export const getSection = (slug: string) => sections.find((s) => s.slug === slug)
export const videoCount = sections.reduce((n, s) => n + s.resources.filter((r) => r.kind === 'video').length, 0)
export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
