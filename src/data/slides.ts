export interface SlideData {
  id: number;
  type: 'title' | 'toc' | 'content' | 'video' | 'end';
  title: string;
  subtitle?: string;
  presenter?: string;
  points?: string[];
  highlightMessage?: string;
  bgImage: string;
  contentImage?: string;
  videoUrl?: string;
  accentColor: 'blue' | 'purple' | 'orange' | 'cyan';
}

export const slides: SlideData[] = [
  {
    id: 1,
    type: 'title',
    title: 'MẶT TRÁI CỦA\nCÔNG NGHỆ THÔNG TIN',
    subtitle: 'Ảo ảnh & Hiện thực: Tác động lên Giáo dục & Xã hội',
    presenter: 'Thành viên: Dương Trung Thành, Nguyễn Tấn Dũng, Trần Gia Huy, Bùi Hoàng Tuấn Khang',
    bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80',
    accentColor: 'cyan',
  },
  {
    id: 2,
    type: 'toc',
    title: 'LỘ TRÌNH KHÁM PHÁ',
    points: [
      'Bạo lực & Lừa đảo: Cái giá của sự vô danh',
      'Phóng sự VTV1: Hiểm họa tấn công mạng & AI',
      'Quyền riêng tư & Bản quyền: Sự xâm lấn vô hình',
      'Gian lận & Sức khỏe: Những lỗ hổng của hệ thống',
      'Nghiện kỹ thuật số: Khi thuật toán điều khiển con người',
      'Biện pháp phòng tránh: Xây dựng "Vắc-xin số"',
    ],
    bgImage: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1920&q=80',
    contentImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'purple',
  },
  {
    id: 3,
    type: 'content',
    title: 'GÓC KHUẤT CỦA MẠNG XÃ HỘI',
    points: [
      'Bạo lực ngôn từ (Cyberbullying) tinh vi, tàn khốc không kém bạo lực thể xác.',
      'Tội phạm mạng (Cybercrime): Lừa đảo tài chính, đánh cắp danh tính ngày càng tinh vi.',
    ],
    highlightMessage: 'Một cú click chuột là một nhát dao vô hình.',
    bgImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1920&q=80',
    contentImage: 'https://images.unsplash.com/photo-1562569633-622303bafef5?auto=format&fit=crop&w=800&q=80',
    accentColor: 'orange',
  },
  {
    id: 4,
    type: 'video',
    title: 'PHÓNG SỰ VTV1: HITECH CÔNG NGHỆ TƯƠNG LAI',
    subtitle: 'Hiểm họa tấn công mạng hỗ trợ bởi AI & Thiệt hại gần 18.000 tỷ đồng tại Việt Nam',
    highlightMessage: '“Trí tuệ nhân tạo AI cũng chỉ là công nghệ và công cụ do con người nghiên cứu ra. Sử dụng công nghệ này vào việc gì, với mục đích gì mới là điều quan trọng. Và cuối cùng, quyết định điều đó lại chính là con người.”',
    bgImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1920&q=80',
    accentColor: 'cyan',
  },
  {
    id: 5,
    type: 'content',
    title: 'CUỘC SỐNG TRONG "NHÀ KÍNH"',
    points: [
      'Quyền riêng tư bị xâm phạm: Mọi dữ liệu cá nhân đều bị theo dõi và thu thập.',
      'Vi phạm bản quyền: Văn hóa "copy-paste" giết chết sự sáng tạo chân chính.',
    ],
    bgImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1920&q=80',
    contentImage: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=800&q=80',
    accentColor: 'blue',
  },
  {
    id: 6,
    type: 'content',
    title: 'CÁI GIÁ PHẢI TRẢ CHO SỰ TIỆN LỢI',
    points: [
      'Gian lận thi cử & đạo văn bằng AI/công cụ tìm kiếm tạo ra bằng cấp giả.',
      'Bệnh lý thể chất (cận thị, béo phì) & tinh thần (trầm cảm, FOMO).',
    ],
    bgImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1920&q=80',
    contentImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    accentColor: 'cyan',
  },
  {
    id: 7,
    type: 'content',
    title: 'NÔ LỆ CỦA THUẬT TOÁN',
    points: [
      'Vòng lặp của Dopamine: Nút "Like" và thông báo tạo ra sự thèm khát ảo.',
      'Hội chứng "Brainrot" (Mục rữa não): Tiêu thụ vô thức nội dung ngắn rác rưởi, gây suy giảm sự tập trung.',
      'Cô lập thực tại: Thế giới ảo hấp dẫn hơn cuộc sống thực.',
    ],
    bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80',
    contentImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    accentColor: 'purple',
  },
  {
    id: 8,
    type: 'content',
    title: 'SỐNG VĂN MINH TRONG THỜI ĐẠI SỐ',
    points: [
      'Kỹ năng số & Đạo đức mạng (Dạy tư duy phản biện, nhận biết tin giả).',
      'Thiết lập ranh giới (Digital detox, thời gian giới nghiêm).',
      'Bảo mật & Trách nhiệm (Bảo vệ thông tin, tôn trọng bản quyền).',
    ],
    bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80',
    contentImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
    accentColor: 'blue',
  },
  {
    id: 9,
    type: 'content',
    title: 'LÀM CHỦ CÔNG NGHỆ\nLÀM CHỦ CUỘC SỐNG',
    subtitle: 'CNTT là một công cụ tuyệt vời, nhưng là một ông chủ tồi.',
    points: [
      'Dùng công nghệ có mục đích: Đừng để thuật toán dẫn dắt thời gian và tâm trí.',
      'Ưu tiên thế giới thực: Những cuộc trò chuyện trực tiếp là liều thuốc vô giá.',
      'Làm chủ tư duy: Luôn là người điều khiển công cụ, không làm nô lệ kỹ thuật số.',
    ],
    highlightMessage: 'Hãy dùng cái đầu thông thái để ra quyết định và trái tim ấm áp để kết nối thực sự.',
    bgImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80',
    contentImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'orange',
  },
  {
    id: 10,
    type: 'end',
    title: 'THANK YOU',
    subtitle: 'Mời cô và các bạn nhận xét.',
    bgImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80',
    accentColor: 'cyan',
  },
];
