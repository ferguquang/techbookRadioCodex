# Voice provider options

Current project default:

1. FPT.AI: active provider for techbookradio in this project. Best current fit for native Vietnamese narration and short technology news videos.
2. ElevenLabs: kept as an optional provider for experiments, but the current API key/plan only allowed English/premade voices through API, so it is not the default.

Optional fallbacks to revisit later:

- Google Cloud Text-to-Speech: strong free monthly quota, but requires billing enabled and can charge after free usage.
- Azure AI Speech: good Vietnamese neural voices, but requires Azure setup and free limits should be monitored in Azure portal.
- Amazon Polly: useful if already using AWS. Free tier is mainly for new accounts/first 12 months.

Sources:

- FPT.AI TTS API: https://docs.fpt.ai/docs/vi/speech/api/text-to-speech/
- ElevenLabs Vietnamese TTS: https://elevenlabs.io/text-to-speech/vietnamese
- ElevenLabs API docs: https://elevenlabs.io/docs/api-reference/text-to-speech/convert
- Google Cloud TTS pricing: https://cloud.google.com/text-to-speech/pricing
- Azure Speech pricing: https://azure.microsoft.com/en-us/pricing/details/speech/
- Amazon Polly pricing: https://aws.amazon.com/polly/pricing/
