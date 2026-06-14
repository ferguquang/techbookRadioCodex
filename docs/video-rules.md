# techbookradio video rules

## Brand

- Tên kênh và handle hiển thị: `techbookradio`.
- Không dùng các handle hoặc tên cũ của kênh trong episode mới.
- CTA mặc định nên dùng: `Follow techbookradio ...`.

## Format

- Video dọc `9:16`, Remotion composition `1080x1920`.
- Chủ đề chính: tin công nghệ, sách công nghệ, AI, hot trend công nghệ, dev tool, startup, cloud, security, chip.
- Nội dung ngắn, dễ nghe, ưu tiên câu tiếng Việt rõ nghĩa.
- Mỗi episode nên có 4-6 scenes. Scene hook phải vào thẳng vấn đề, không làm landing page hay intro dài.
- Không hiển thị badge `EP` ở góc trên bên phải.
- Không hiển thị timestamp tiến độ ở góc cuối bên phải.

## Content History

- Luôn đọc `content/episode-history.json` trước khi tạo ý tưởng hoặc episode mới.
- Tránh trùng `title`, hook, core angle, ví dụ, key terms và các ý đã cover trong history.
- Nếu làm follow-up từ một tập cũ, angle mới phải hẹp và khác rõ ràng, ví dụ đi sâu vào RAG, memory, tool selection, eval hoặc security.
- Sau khi tập được chốt hoặc render, cập nhật `content/episode-history.json` với entry ngắn gồm `title`, `coreAngle`, `hook`, `coveredIdeas`, `keyTerms`, `contentFile` và `avoidRepeating`.

## Voice

- Trước khi render video có voice mới, phải hỏi người dùng muốn dùng voice nào.
- Provider chính hiện tại: FPT.AI.
- Giọng đã thử:
  - `banmai`: nữ miền Bắc.
  - `leminh`: nam miền Bắc, chữ `r` có thể nghe gần `d/gi`.
  - `lannhi`: nữ miền Nam, phù hợp hơn khi cần âm `r` rõ hơn.
- Không commit API key. Dùng `.env` local theo `.env.example` hoặc truyền key tạm qua shell.

## Pronunciation

FPT.AI cần normalize một số từ trước khi gửi TTS:

- `techbookradio` -> `Téc búc ra đi ô`
- `prompt`, `promt` -> `pờ rom`
- `context` -> `con tếch`
- `AI` -> `ây ai`
- `OpenAI` -> `Ô pần ây ai`
- `API` -> `ây pi ai`
- `GPU` -> `gi pi yu`
- `MCP` -> `em si pi`
- `RAG` -> `rắc`

Rule kỹ thuật nằm trong `scripts/lib/voice.mjs`.

## Music

- Không commit nhạc TikTok/YouTube trend nếu chưa có quyền sử dụng.
- Cách an toàn: render video không nhạc, sau đó thêm nhạc trong TikTok/YouTube editor.
- Nếu có track đã được cấp quyền, đặt vào `public/audio/trend.mp3` và set `music.file` trong episode JSON.

## Git Hygiene

- Commit source, content, prompt/rules, scripts, README/docs và hướng dẫn cài đặt.
- Commit `content/episode-history.json` để máy khác vẫn biết tập cũ đã làm gì.
- Không commit `node_modules`, `.env`, `.env.local`, audio sinh ra trong `public/audio/`, build cache, hoặc output render trong `out/`.
