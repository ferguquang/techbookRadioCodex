import type {EpisodeProps} from '../types';

export const defaultEpisode: EpisodeProps = {
  meta: {
    brand: 'techbookradio',
    handle: 'techbookradio',
    title: 'Bản tin công nghệ nghe nhanh',
    subtitle: 'AI, sách công nghệ và trend đáng chú ý',
    date: '2026-06-14',
    episodeNo: 1,
    language: 'vi-VN',
  },
  music: {
    file: '',
    volume: 0.16,
    loop: true,
    credit: 'Thêm nhạc trend đã được cấp quyền vào public/audio/trend.mp3',
  },
  voiceover: {
    file: '',
    volume: 1,
  },
  scenes: [
    {
      id: 'hook',
      type: 'hook',
      kicker: 'TECHBOOKRADIO',
      headline: '5 phút bắt nhịp công nghệ trước khi bắt đầu ngày mới',
      bullets: ['AI', 'Sách công nghệ', 'Hot trend'],
      source: 'Demo template',
      durationSec: 6,
      accent: 'cyan',
    },
    {
      id: 'ai-agents',
      type: 'ai',
      kicker: 'AI TREND',
      headline: 'AI agent đang chuyển từ demo sang workflow thật',
      bullets: [
        'Doanh nghiệp quan tâm nhiều hơn đến tự động hóa tác vụ lặp lại.',
        'Điểm cần theo dõi: bảo mật dữ liệu, quyền truy cập và kiểm chứng kết quả.',
        'Gợi ý video: so sánh agent cá nhân với automation truyền thống.',
      ],
      source: 'Thay bằng nguồn tin thật trong JSON',
      durationSec: 9,
      accent: 'violet',
    },
    {
      id: 'book',
      type: 'book',
      kicker: 'SÁCH CÔNG NGHỆ',
      headline: 'Một cuốn sách hay không chỉ kể chuyện, nó cho bạn mô hình tư duy',
      bullets: [
        'Chọn sách theo vấn đề bạn đang gặp: sản phẩm, dữ liệu, AI hoặc hệ thống.',
        'Mỗi tập nên có 1 insight có thể áp dụng ngay trong công việc.',
      ],
      source: 'Techbook pick',
      durationSec: 8,
      accent: 'amber',
    },
    {
      id: 'trend',
      type: 'trend',
      kicker: 'HOT SIGNAL',
      headline: 'Trend công nghệ đáng theo dõi: video ngắn giải thích khái niệm khó',
      bullets: [
        'Cấu trúc hiệu quả: hook mạnh, 3 ý chính, CTA lưu video.',
        'Giữ mỗi câu voice ngắn để khớp phụ đề và nhịp nhạc.',
      ],
      source: 'TikTok / YouTube Shorts format',
      durationSec: 8,
      accent: 'rose',
    },
    {
      id: 'outro',
      type: 'outro',
      kicker: 'LƯU LẠI',
      headline: 'Theo dõi techbookradio để nghe công nghệ theo cách dễ nhớ hơn',
      bullets: ['Gợi ý chủ đề tiếp theo ở phần bình luận'],
      source: 'techbookradio',
      durationSec: 6,
      accent: 'green',
    },
  ],
  cta: {
    primary: 'Follow để nghe bản tin tiếp theo',
    secondary: 'Lưu video nếu bạn đang học AI và công nghệ',
  },
};
