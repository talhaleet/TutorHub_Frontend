import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardShell from '../components/layout/DashboardShell';
import TutorRecommendationCard from '../components/assistant/TutorRecommendationCard';
import { chatWithTutorAssistant } from '../services/tutorAssistantService';
import { isTutorJsonArray, parseTutorJsonArray } from '../utils/assistantUtils';

const starterPrompts = [
  'I need an online Math tutor for grade 9 in Lahore under PKR 2000/hour.',
  'Define science in simple words.',
  'How do I book a session on TutorHub?',
];

const WELCOME =
  'Hi! I am TutorHub AI (offline mode — instant, no API quota).\n\n' +
  '• Ask study questions: "Define science", "Who was Quaid-e-Azam?"\n' +
  '• Find tutors: "Online Math tutor grade 9 Lahore under 2000 PKR"\n' +
  '• Tutor matches show as cards — tap to open their profile';

export default function TutorAssistantPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME, recommendations: [] },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [agentMode, setAgentMode] = useState('offline');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const buildHistory = (currentMessages) =>
    currentMessages
      .slice(1)
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-24)
      .map((m) => ({
        role: m.role,
        content: m.historyContent ?? m.content,
      }));

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || sending) return;

    const userMsg = { role: 'user', content, recommendations: [], historyContent: content };
    const history = buildHistory(messages);

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const data = await chatWithTutorAssistant(content, history);
      if (data.mode) setAgentMode(data.mode);
      let recommendations = data.recommendations || [];
      let displayContent = data.reply;
      let historyContent = data.historyText ?? data.reply;

      if (isTutorJsonArray(displayContent)) {
        recommendations = parseTutorJsonArray(displayContent);
        displayContent =
          'Here are tutors that match your request. Tap a card to open their profile.';
        historyContent = displayContent;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: displayContent,
          historyContent,
          recommendations,
        },
      ]);
    } catch (err) {
      const errText =
        err?.response?.data?.message ||
        'Sorry, the assistant is temporarily unavailable. Check that the API is running and your AI API key is configured.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errText,
          historyContent: errText,
          recommendations: [],
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardShell className="max-w-5xl mx-auto w-full">
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tutor AI Assistant</h1>
          <p className="text-slate-500 text-sm">
            Mode: <span className="font-semibold text-emerald-600">{agentMode}</span> — instant answers, no cloud API required.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div ref={scrollRef} className="h-[58vh] overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50">
            {messages.map((m, idx) => {
              const legacyCards =
                m.role === 'assistant' && isTutorJsonArray(m.content)
                  ? parseTutorJsonArray(m.content)
                  : [];
              const cards =
                m.recommendations?.length > 0 ? m.recommendations : legacyCards;
              const showText =
                m.content && !isTutorJsonArray(m.content);

              return (
              <div
                key={`${m.role}-${idx}`}
                className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'
                  }`}
                >
                  {showText ? <p className="whitespace-pre-wrap">{m.content}</p> : null}

                  {m.role === 'assistant' && cards.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Recommended tutors — tap to view profile
                      </p>
                      <div className="grid gap-3 sm:grid-cols-1">
                        {cards.map((tutor) => (
                          <TutorRecommendationCard key={tutor.tutorId} tutor={tutor} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
            })}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2 bg-white border border-slate-200 text-sm text-slate-500">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={sending}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50 text-left"
                >
                  {prompt.length > 55 ? `${prompt.slice(0, 55)}…` : prompt}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything or describe the tutor you need…"
                className="flex-1 h-11 px-4 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="h-11 px-5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {sending ? 'Sending…' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </DashboardShell>
    </DashboardLayout>
  );
}
