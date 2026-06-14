# techbookradio Codex

Remotion project tạo video dọc 9:16 cho techbookradio: tin công nghệ, AI, sách công nghệ và hot trend dạng TikTok/YouTube Shorts.

## Chạy project

Nếu shell chưa thấy Node trên máy này:

```bash
export PATH="/opt/homebrew/bin:$PATH"
```

Cài dependency:

```bash
npm install
```

Mở Remotion Studio:

```bash
npm run studio
```

Render video demo. Lệnh này sẽ hỏi bạn chọn voice trước khi render:

```bash
npm run render
```

File output mặc định: `out/techbook-short.mp4`.

Render thẳng không hỏi voice:

```bash
npm run render:raw
```

## Tạo tập mới

Tạo file episode từ template:

```bash
npm run new:episode -- "AI agent và workflow tự động hóa"
```

Render với file riêng. Lệnh này sẽ hỏi chọn FPT.AI, ElevenLabs hoặc bỏ qua voice:

```bash
npm run render:episode -- --episode=content/2026-06-14-ai-agent-va-workflow-tu-dong-hoa.json
```

## Voice với FPT.AI

Copy file env mẫu:

```bash
cp .env.example .env
```

Điền key FPT.AI:

```bash
FPTAI_API_KEY=...
```

Tạo voice demo để nghe thử. Mặc định script sẽ tạo các giọng FPT.AI phổ biến:

```bash
npm run voice:demo
```

Output:

- `public/audio/demo-fptai-banmai.mp3`
- `public/audio/demo-fptai-lannhi.mp3`
- `public/audio/demo-fptai-leminh.mp3`
- `public/audio/demo-fptai-myan.mp3`
- `public/audio/demo-fptai-thuminh.mp3`
- `public/audio/demo-fptai-giahuy.mp3`
- `public/audio/demo-fptai-linhsan.mp3`

Các file audio sinh ra trong `public/audio/` là artifact local và được ignore khỏi git.

Tạo voice cho episode nhưng chưa render:

```bash
npm run voice:episode -- --episode=content/episode.sample.json
```

Tuỳ chỉnh voice:

```bash
npm run voice -- --provider=fptai --voice=banmai --text="Xin chào từ techbookradio" --out=public/audio/test-fptai.mp3
```

## Workflow với Codex

1. Dùng prompt trong `prompts/codex-episode-prompt.md`.
2. Yêu cầu Codex kiểm tra nguồn tin mới, rồi xuất JSON đúng schema.
3. Lưu JSON vào `content/<ngay>-<slug>.json`.
4. Render bằng `npm run render:episode -- --episode=content/<file>.json`.
5. Khi được hỏi, chọn FPT.AI để tạo voice tiếng Việt hoặc bỏ qua voice lần này.

Các quy tắc sản xuất video đã chốt được lưu trong `docs/video-rules.md`.

## Nhạc trend

Không nên commit hoặc render sẵn nhạc TikTok đang hot nếu chưa có quyền sử dụng. Có 2 cách làm an toàn:

- Render video không nhạc, sau đó thêm nhạc bằng TikTok/YouTube editor.
- Đặt track đã được cấp quyền vào `public/audio/trend.mp3` và set `"music.file": "audio/trend.mp3"` trong JSON.

## Cấu trúc chính

- `src/TechbookShorts.tsx`: template video dọc.
- `src/style.css`: visual style, typography, animation.
- `content/episode.sample.json`: dữ liệu demo.
- `prompts/codex-episode-prompt.md`: prompt tạo episode bằng Codex.
- `docs/video-rules.md`: rule tạo video, voice, brand và nhạc.
- `public/audio/`: nhạc nền và voiceover local.
