/** Locale-independent docs fixtures: code samples, endpoint paths, env var names and event names stay untouched. */
export const docsShared = {
  requestExample: `POST /api/demo/support
Content-Type: application/json

{
  "conversation_id": "session-conversation-id",
  "customer_id": "session-customer-id",
  "message": "What are your pricing plans?"
}`,
  sseExample: `event: response.delta
data: {"type":"response.delta","payload":{"text":"Here is how…"}}

event: response.completed
data: {"type":"response.completed","payload":{"intent":"faq"}}`,
  environmentExample: `NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@your-domain.com

NEXUS_BACKEND_URL=http://127.0.0.1:8000
NEXUS_DEVELOPMENT_API_KEY=replace-with-server-only-key`,
  architectureFlow: "Browser → Next.js support proxy → TQEN Engine stream → Support workspace",
  browserEndpointCode: "POST /api/demo/support",
  deltaCode: "response.delta.payload.text",
  completedCode: "response.completed",
  failedCode: "request.failed",
  eventNames: [
    "request.started",
    "request.validated",
    "memory.loaded",
    "intent.detected",
    "retrieval.started",
    "retrieval.completed",
    "response.started",
    "response.delta",
    "response.completed",
    "request.failed",
  ] as const,
};

export type QuickStartStep =
  | { kind: "text"; text: string }
  | { kind: "link"; before: string; linkText: string; linkHref: string; after: string };

export interface DocsSectionRef {
  id: string;
  title: string;
}

export interface DocsCopy {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  sections: readonly DocsSectionRef[];
  navLabel: string;
  navAriaLabel: string;
  sectionNavSuffix: string;
  overviewBody: string;
  overviewNoteTitle: string;
  overviewNoteBody: string;
  quickStartSteps: readonly QuickStartStep[];
  architectureBody: string;
  integrationBody1: string;
  integrationBody2: string;
  apiBodyBefore: string;
  apiBodyAfter: string;
  apiNoteTitle: string;
  apiNoteBody: string;
  sseBody: string;
  streamTableEvent: string;
  streamTableBehavior: string;
  /** Aligned by index with docsShared.eventNames. */
  eventBehaviors: readonly string[];
  streamDeltaSuffix: string;
  streamCompletedSuffix: string;
  streamFailedSuffix: string;
  knowledgeBody: string;
  adaptiveBody: string;
  calendarBody: string;
  envBody: string;
  securityBody: string;
  troubleshootingBody: string;
  codeLabels: { request: string; stream: string; env: string };
  copyButton: string;
  copiedButton: string;
}

export const docsEn: DocsCopy = {
  metaTitle: "TQEN Agent Documentation",
  metaDescription: "A practical guide to the current TQEN Agent website workspace and communication engine integration.",
  heroEyebrow: "TQEN Agent documentation",
  heroTitle: "Operate the conversation with confidence.",
  heroDescription: "A practical guide to the current Agent workspace, its streaming behavior and the capabilities that support it. Documentation for other TQEN products will be published with their public integration surfaces.",
  sections: [
    { id: "overview", title: "Overview" },
    { id: "quick-start", title: "Quick Start" },
    { id: "architecture", title: "Architecture" },
    { id: "website-integration", title: "Website Integration" },
    { id: "api-reference", title: "API Reference" },
    { id: "sse-event-reference", title: "SSE Events" },
    { id: "knowledge-base-setup", title: "Knowledge Base" },
    { id: "adaptive-style-memory", title: "Adaptive Style" },
    { id: "google-calendar-setup", title: "Google Calendar" },
    { id: "environment-variables", title: "Environment" },
    { id: "security", title: "Security" },
    { id: "troubleshooting", title: "Troubleshooting" },
  ],
  navLabel: "On this page",
  navAriaLabel: "Documentation navigation",
  sectionNavSuffix: "documentation navigation",
  overviewBody: "TQEN Agent is the live communication workspace. The public product currently demonstrates a website support workspace connected to the TQEN Engine.",
  overviewNoteTitle: "Current public scope.",
  overviewNoteBody: "Customer Support is the live workspace. Other scenarios, integrations and channels are planned rather than functioning public demos.",
  quickStartSteps: [
    { kind: "link", before: "Open the ", linkText: "Demo Hub", linkHref: "/demo", after: "." },
    { kind: "text", text: "Choose Customer Support." },
    { kind: "text", text: "Send a message in English, Arabic or Turkish and observe the real workflow events emitted for that request." },
  ],
  architectureBody: "The browser sends a message to a Next.js server route. That route keeps development credentials server-side and streams the engine response back to the browser. The workspace renders safe response text and only the events the engine emits.",
  integrationBody1: "Use the website workspace for a browser-based support experience. Keep backend credentials on the server; the browser should send only the conversation identifier, customer identifier and message.",
  integrationBody2: "The public implementation persists the conversation identifiers in browser session storage, so a refresh can continue the same browser session without creating a public account system.",
  apiBodyBefore: "The browser-facing endpoint is ",
  apiBodyAfter: ". It accepts JSON and returns a server-sent event stream.",
  apiNoteTitle: "Authentication stays server-side.",
  apiNoteBody: "The browser does not receive the development API key. The Next.js proxy adds the private authentication header when it calls the configured engine.",
  sseBody: "Each event is framed as SSE. The workspace uses the event name and safe JSON data to update visible state. It does not fabricate missing retrieval or tool stages.",
  streamTableEvent: "Event",
  streamTableBehavior: "Workspace behavior",
  eventBehaviors: [
    "The browser message reached the engine.",
    "The request passed the engine’s validation stage.",
    "Conversation context was emitted as loaded.",
    "The engine emitted an intent result.",
    "Business-knowledge retrieval began.",
    "Business-knowledge retrieval completed.",
    "The response stage began.",
    "Safe assistant text arrived in payload.text.",
    "The request completed successfully.",
    "The request failed; the workspace displays a safe recovery message.",
  ],
  streamDeltaSuffix: "appends to the active assistant message.",
  streamCompletedSuffix: "is terminal success;",
  streamFailedSuffix: "produces a safe recovery message.",
  knowledgeBody: "Business knowledge is retrieved from Qdrant-backed collections. Keep content current, scoped to the intended business and reviewed for accuracy before it enters a live workflow.",
  adaptiveBody: "Style examples help TQEN adapt the form of a response while preserving the underlying business answer. Treat examples as reviewed communication guidance, not as a replacement for business policy.",
  calendarBody: "Scheduling requires a configured Google Calendar integration and an available workflow. Confirm the intended calendar and keep credentials server-side before enabling actions. The public workspace only displays the event URL the engine returns; event details remain in Google Calendar.",
  envBody: "Configure public website settings separately from server-only engine settings. Do not expose service credentials through browser-prefixed variables or client code.",
  securityBody: "The public demo keeps the engine key in the server proxy and presents safe error messages instead of provider details. Production access controls, retention and deployment requirements should be assessed for each engagement.",
  troubleshootingBody: "If the workspace cannot start, confirm the server can reach the streaming engine and that the server-only variables are configured. If a stream stops, check safe server logs and ensure the engine emits a terminal completion or failure event. Do not retry a failed action request automatically, because that could duplicate an external Calendar action.",
  codeLabels: { request: "Browser request", stream: "Stream framing", env: "Sanitized configuration" },
  copyButton: "Copy",
  copiedButton: "Copied",
};

export const docsAr: DocsCopy = {
  metaTitle: "توثيق TQEN Agent",
  metaDescription: "دليل عملي لمساحة عمل TQEN Agent الحالية وتكامل محرك التواصل.",
  heroEyebrow: "توثيق TQEN Agent",
  heroTitle: "أدر المحادثة بثقة.",
  heroDescription: "دليل عملي لمساحة عمل TQEN Agent الحالية وسلوك الدفق والقدرات التي تدعمه. سيُنشر توثيق منتجات TQEN الأخرى مع واجهات تكاملها العامة.",
  sections: [
    { id: "overview", title: "نظرة عامة" },
    { id: "quick-start", title: "البداية السريعة" },
    { id: "architecture", title: "البنية" },
    { id: "website-integration", title: "تكامل الموقع" },
    { id: "api-reference", title: "مرجع API" },
    { id: "sse-event-reference", title: "أحداث SSE" },
    { id: "knowledge-base-setup", title: "قاعدة المعرفة" },
    { id: "adaptive-style-memory", title: "الأسلوب المتكيف" },
    { id: "google-calendar-setup", title: "Google Calendar" },
    { id: "environment-variables", title: "البيئة" },
    { id: "security", title: "الأمان" },
    { id: "troubleshooting", title: "استكشاف الأخطاء" },
  ],
  navLabel: "في هذه الصفحة",
  navAriaLabel: "التنقل في التوثيق",
  sectionNavSuffix: "— التنقل في التوثيق",
  overviewBody: "TQEN Agent هو مساحة التواصل الحيّة. يعرض المنتج العام حاليًا مساحة دعم عبر الموقع متصلة بـ TQEN Engine.",
  overviewNoteTitle: "النطاق العام الحالي.",
  overviewNoteBody: "دعم العملاء هو مساحة العمل الحيّة. السيناريوهات والتكاملات والقنوات الأخرى مخطط لها وليست تجارب عامة عاملة.",
  quickStartSteps: [
    { kind: "link", before: "افتح ", linkText: "مركز التجارب", linkHref: "/demo", after: "." },
    { kind: "text", text: "اختر تجربة دعم العملاء." },
    { kind: "text", text: "أرسل رسالة بالإنجليزية أو العربية أو التركية وراقب أحداث سير العمل الحقيقية الصادرة عن ذلك الطلب." },
  ],
  architectureBody: "يرسل المتصفح رسالة إلى مسار خادم في Next.js. يحفظ ذلك المسار بيانات الاعتماد التطويرية في الخادم ويعيد دفق رد المحرك إلى المتصفح. تعرض مساحة العمل نص الرد الآمن والأحداث الصادرة عن المحرك فقط.",
  integrationBody1: "استخدم مساحة عمل الموقع لتجربة دعم عبر المتصفح. أبقِ بيانات اعتماد الخلفية على الخادم؛ على المتصفح إرسال معرّف المحادثة ومعرّف العميل والرسالة فقط.",
  integrationBody2: "يحفظ التطبيق العام معرّفات المحادثة في التخزين المؤقت لجلسة المتصفح، فيمكن متابعة الجلسة نفسها بعد التحديث دون إنشاء نظام حسابات عام.",
  apiBodyBefore: "نقطة النهاية الخاصة بالمتصفح هي ",
  apiBodyAfter: ". تقبل JSON وتعيد دفق أحداث مرسلة من الخادم (SSE).",
  apiNoteTitle: "المصادقة تبقى في الخادم.",
  apiNoteBody: "لا يستلم المتصفح مفتاح API التطويري. يضيف وكيل Next.js ترويسة المصادقة الخاصة عند مناداة المحرك المُعد.",
  sseBody: "يُغلّف كل حدث بتنسيق SSE. تستخدم مساحة العمل اسم الحدث وبيانات JSON الآمنة لتحديث الحالة المرئية، ولا تخترع مراحل استرجاع أو أدوات مفقودة.",
  streamTableEvent: "الحدث",
  streamTableBehavior: "سلوك مساحة العمل",
  eventBehaviors: [
    "وصلت رسالة المتصفح إلى المحرك.",
    "اجتاز الطلب مرحلة التحقق في المحرك.",
    "تم تحميل سياق المحادثة.",
    "أصدر المحرك نتيجة القصد.",
    "بدأ استرجاع المعرفة الخاصة بالأعمال.",
    "اكتمل استرجاع المعرفة الخاصة بالأعمال.",
    "بدأت مرحلة الرد.",
    "وصل نص آمن من المساعد ضمن payload.text.",
    "اكتمل الطلب بنجاح.",
    "فشل الطلب؛ تعرض مساحة العمل رسالة استرجاع آمنة.",
  ],
  streamDeltaSuffix: "يُلحق بالرسالة النشطة للمساعد.",
  streamCompletedSuffix: "هو نجاح نهائي؛",
  streamFailedSuffix: "ينتج رسالة استرجاع آمنة.",
  knowledgeBody: "تُسترجع معرفة الأعمال من مجموعات مدعومة بـ Qdrant. حافظ على تحديث المحتوى ونطاقه ضمن العمل المقصود وراجعه للتأكد من دقته قبل دخوله أي سير عمل حيّ.",
  adaptiveBody: "تساعد أمثلة الأسلوب TQEN على تكييف صياغة الرد مع الحفاظ على الإجابة الأساسية للعمل. تعامل مع الأمثلة كإرشادات تواصل مراجَعة، لا كبديل عن سياسة العمل.",
  calendarBody: "تتطلب الجدولة تكامل Google Calendar مُعدًا وسير عمل متاحًا. أكّد التقويم المقصود وأبقِ بيانات الاعتماد في الخادم قبل تفعيل الإجراءات. تعرض مساحة العمل العامة رابط الحدث الذي يعيده المحرك فقط؛ وتبقى تفاصيل الحدث في Google Calendar.",
  envBody: "اضبط إعدادات الموقع العامة بمعزل عن إعدادات المحرك الخاصة بالخادم. لا تكشف بيانات اعتماد الخدمة عبر متغيرات تبدأ ببادئة المتصفح أو شيفرة العميل.",
  securityBody: "تحفظ التجربة العامة مفتاح المحرك في وكيل الخادم وتعرض رسائل خطأ آمنة بدل تفاصيل المزوّد. يجب تقييم ضوابط الوصول للإنتاج والاحتفاظ ومتطلبات النشر لكل ارتباط على حدة.",
  troubleshootingBody: "إذا تعذّر بدء مساحة العمل، تأكد من قدرة الخادم على الوصول إلى محرك الدفق وأن المتغيرات الخاصة بالخادم مُعدّة. إذا توقف الدفق، تحقق من سجلات الخادم الآمنة وتأكد من إصدار المحرك حدث إتمام أو فشل نهائي. لا تُعد محاولة طلب إجراء فاشل تلقائيًا، فقد يؤدي ذلك إلى تكرار إجراء تقويم خارجي.",
  codeLabels: { request: "طلب المتصفح", stream: "تغليف الدفق", env: "إعدادات مُنقّحة" },
  copyButton: "نسخ",
  copiedButton: "تم النسخ",
};
