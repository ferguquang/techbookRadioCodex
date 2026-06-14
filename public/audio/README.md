# Audio assets

Đặt file audio local ở đây rồi tham chiếu trong JSON bằng đường dẫn tương đối từ thư mục `public`.

Ví dụ:

```json
"music": {
  "file": "audio/trend.mp3",
  "volume": 0.16,
  "loop": true
},
"voiceover": {
  "file": "audio/voiceover.wav",
  "volume": 1
}
```

Lưu ý bản quyền: với nhạc hot trend trên TikTok, cách an toàn nhất là render video không nhạc rồi thêm nhạc trực tiếp trong TikTok/YouTube editor hoặc dùng track bạn có quyền thương mại.

## Tạo voice

Copy `.env.example` thành `.env`, sau đó điền key FPT.AI:

```bash
FPTAI_API_KEY=...
```

Tạo demo FPT.AI:

```bash
npm run voice:demo
```

Tạo voice cho một episode:

```bash
npm run voice:episode -- --episode=content/episode.sample.json
```

Render có bước hỏi chọn voice trước:

```bash
npm run render:episode -- --episode=content/episode.sample.json
```
