import type { Locale } from "@/lib/i18n/routing";

/** Every hardcoded UI string in the support workspace chrome. EN values are verbatim. */
export interface WorkspaceChrome {
  /** "is responding" — used as `{assistantName} is responding[.]` */
  responding: string;
  sending: string;
  send: string;
  inProgress: string;
  complete: string;
  notNeeded: string;
  liveWorkflow: string;
  workflowDescription: string;
  integrationTitle: string;
  integrationAriaLabel: string;
  workflowEmpty: string;
  requestEnded: string;
  skipLink: string;
  brandHomeLabel: string;
  newConversationLabel: string;
  newShort: string;
  newLong: string;
  backShort: string;
  backLong: string;
  liveWorkspaceFallback: string;
  workflowToggle: string;
  recoveryHint: string;
  retryMessage: string;
  noAutoRetry: string;
  composerFallbackLabel: string;
  preparingSession: string;
  composerHint: string;
  dialogTitle: string;
  /** Prefix before the assistant name in the reset dialog description. */
  dialogDescriptionPrefix: string;
  /** Suffix after the assistant name in the reset dialog description. */
  dialogDescriptionSuffix: string;
  cancel: string;
  startNew: string;
  requestFailed: string;
  responseComplete: string;
  calendarTitle: string;
  calendarDescription: string;
  calendarOpen: string;
  calendarOpenLabel: string;
}

export const workspaceEn: WorkspaceChrome = {
  responding: "is responding",
  sending: "Sending",
  send: "Send",
  inProgress: "In progress",
  complete: "Complete",
  notNeeded: "Not needed",
  liveWorkflow: "Live workflow",
  workflowDescription: "Stages appear only when they are emitted by the TQEN Engine.",
  integrationTitle: "PGPara service modules",
  integrationAriaLabel: "Integration-ready PGPara tools",
  workflowEmpty: "Workflow activity will appear here after you send a message.",
  requestEnded: "Request ended.",
  skipLink: "Skip to workspace",
  brandHomeLabel: "Return to Demo Hub",
  newConversationLabel: "New conversation",
  newShort: "New",
  newLong: "New conversation",
  backShort: "Demo",
  backLong: "Back to Demo Hub",
  liveWorkspaceFallback: "Live workspace",
  workflowToggle: "Workflow",
  recoveryHint: "Your original message is preserved for recovery.",
  retryMessage: "Retry message",
  noAutoRetry: "Action requests are not retried automatically to avoid duplicate external actions.",
  composerFallbackLabel: "Message TQEN Support",
  preparingSession: "Preparing your secure session…",
  composerHint: "Enter to send · Shift+Enter for a new line",
  dialogTitle: "Start a new conversation?",
  dialogDescriptionPrefix: "The current transcript and visible workflow stages will be cleared from this browser. ",
  dialogDescriptionSuffix: " receives a new conversation and customer context on your next message.",
  cancel: "Cancel",
  startNew: "Start new conversation",
  requestFailed: "The request could not be completed.",
  responseComplete: "Response complete.",
  calendarTitle: "Google Calendar event",
  calendarDescription: "The engine returned this event link. Event details are managed in Google Calendar.",
  calendarOpen: "Open in Google Calendar",
  calendarOpenLabel: "Open Calendar event in Google Calendar",
};

export const workspaceAr: WorkspaceChrome = {
  responding: "يرد الآن",
  sending: "جارٍ الإرسال",
  send: "إرسال",
  inProgress: "جارٍ التنفيذ",
  complete: "اكتمل",
  notNeeded: "غير مطلوب",
  liveWorkflow: "سير العمل المباشر",
  workflowDescription: "تظهر المراحل فقط عند صدورها عن TQEN Engine.",
  integrationTitle: "وحدات خدمة PGPara",
  integrationAriaLabel: "أدوات PGPara الجاهزة للتكامل",
  workflowEmpty: "ستظهر نشاطات سير العمل هنا بعد إرسال رسالة.",
  requestEnded: "انتهى الطلب.",
  skipLink: "تخطَّ إلى مساحة العمل",
  brandHomeLabel: "العودة إلى مركز التجارب",
  newConversationLabel: "محادثة جديدة",
  newShort: "جديد",
  newLong: "محادثة جديدة",
  backShort: "التجارب",
  backLong: "العودة إلى مركز التجارب",
  liveWorkspaceFallback: "مساحة عمل مباشرة",
  workflowToggle: "سير العمل",
  recoveryHint: "رسالتك الأصلية محفوظة للاسترجاع.",
  retryMessage: "إعادة إرسال الرسالة",
  noAutoRetry: "لا تُعاد محاولة طلبات الإجراءات تلقائيًا لتجنب تكرار الإجراءات الخارجية.",
  composerFallbackLabel: "راسل دعم TQEN",
  preparingSession: "جارٍ تجهيز جلستك الآمنة…",
  composerHint: "Enter للإرسال · Shift+Enter لسطر جديد",
  dialogTitle: "بدء محادثة جديدة؟",
  dialogDescriptionPrefix: "سيتم مسح النص الحالي ومراحل سير العمل الظاهرة من هذا المتصفح. ",
  dialogDescriptionSuffix: " سيستلم محادثة جديدة وسياق العميل مع رسالتك التالية.",
  cancel: "إلغاء",
  startNew: "بدء محادثة جديدة",
  requestFailed: "تعذّر إكمال الطلب.",
  responseComplete: "اكتمل الرد.",
  calendarTitle: "حدث Google Calendar",
  calendarDescription: "أعاد المحرك رابط هذا الحدث. تُدار تفاصيل الحدث في Google Calendar.",
  calendarOpen: "فتح في Google Calendar",
  calendarOpenLabel: "فتح حدث التقويم في Google Calendar",
};

export function workspaceCopy(locale: Locale): WorkspaceChrome {
  return locale === "ar" ? workspaceAr : workspaceEn;
}
