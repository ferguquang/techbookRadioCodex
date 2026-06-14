# Prompt tạo episode cho techbookradio

Bạn là editor cho kênh techbookradio. Hãy tạo một JSON episode cho Remotion template trong project này.

Yêu cầu:
- Chủ đề: `<điền chủ đề, ví dụ: AI agent, sách công nghệ, chip mới, startup AI, dev tool hot>`
- Độ dài: 38-55 giây, video dọc TikTok/YouTube Shorts.
- Ngôn ngữ: tiếng Việt, câu ngắn, dễ đọc thành voiceover.
- Cấu trúc: 4-6 scenes, mỗi scene 5-9 giây.
- Mỗi scene có `kicker`, `headline`, `bullets`, `source`, `durationSec`, `accent`.
- Chỉ dùng dữ kiện có nguồn đáng tin. Nếu là tin mới, hãy kiểm tra ngày xuất bản và không viết như sự thật khi chưa xác minh.
- Không tự thêm file nhạc có bản quyền. Trường `music.file` để rỗng hoặc trỏ đến file local đã được cấp quyền trong `public/audio/`.
- Output chỉ là JSON hợp lệ, không bọc markdown.

Schema rút gọn:

```json
{
  "meta": {
    "brand": "techbookradio",
    "handle": "techbookradio",
    "title": "...",
    "subtitle": "...",
    "date": "YYYY-MM-DD",
    "episodeNo": 1,
    "language": "vi-VN"
  },
  "music": {
    "file": "",
    "volume": 0.16,
    "loop": true,
    "credit": ""
  },
  "voiceover": {
    "file": "",
    "volume": 1
  },
  "scenes": [
    {
      "id": "hook",
      "type": "hook",
      "kicker": "TECHBOOKRADIO",
      "headline": "...",
      "bullets": ["...", "..."],
      "source": "...",
      "durationSec": 6,
      "accent": "cyan"
    }
  ],
  "cta": {
    "primary": "Follow để nghe bản tin tiếp theo",
    "secondary": "Lưu video nếu bạn đang học AI và công nghệ"
  }
}
```

Accent hợp lệ: `cyan`, `amber`, `rose`, `green`, `violet`.
Type hợp lệ: `hook`, `news`, `ai`, `book`, `trend`, `outro`.
