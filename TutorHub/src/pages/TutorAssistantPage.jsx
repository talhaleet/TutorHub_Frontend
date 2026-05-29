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
    { id: 'welcome', role: 'assistant', content: WELCOME, recommendations: [] },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [agentMode, setAgentMode] = useState('offline');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [menuId, setMenuId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const buildHistory = (currentMessages) =>
    currentMessages
      .slice(1)
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .filter((m) => !m.isDeleted)
      .slice(-24)
      .map((m) => ({
        role: m.role,
        content: m.historyContent ?? m.content,
      }));

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || sending) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      recommendations: [],
      historyContent: content,
    };
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
          id: `assistant-${Date.now()}`,
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
          id: `assistant-err-${Date.now()}`,
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

  const handleSaveEdit = (id) => {
    const text = editText.trim();
    if (!text) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, content: text, historyContent: text, isEdited: true }
          : m
      )
    );
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this message?')) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, content: '', isDeleted: true, historyContent: '[deleted]' }
          : m
      )
    );
    setMenuId(null);
  };

  return (
    <DashboardLayout>
      <DashboardShell className="max-w-5xl mx-auto w-full min-w-0">
        <div className="mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Tutor AI Assistant
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Mode: <span className="font-semibold text-emerald-600">{agentMode}</span> — instant
            answers, no cloud API required.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[calc(100dvh-60px-11rem)] sm:min-h-[calc(100dvh-60px-9rem)] md:min-h-[520px]">
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4 bg-slate-50"
          >
            {messages.map((m) => {
              const legacyCards =
                m.role === 'assistant' && isTutorJsonArray(m.content)
                  ? parseTutorJsonArray(m.content)
                  : [];
              const cards =
                m.recommendations?.length > 0 ? m.recommendations : legacyCards;
              const showText =
                m.content && !isTutorJsonArray(m.content) && !m.isDeleted;

              return (
                <div
                  key={m.id}
                  className={`group flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`relative max-w-[94%] sm:max-w-[85%] ${
                      m.role === 'user' ? 'flex flex-row-reverse items-start gap-1' : ''
                    }`}
                  >
                    {m.role === 'user' && !m.isDeleted && m.id !== 'welcome' && editingId !== m.id && (
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => setMenuId(menuId === m.id ? null : m.id)}
                          className="p-2 rounded-lg text-slate-400 hover:bg-slate-200/80 touch-manipulation"
                          aria-label="Message options"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {menuId === m.id && (
                          <div className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-slate-200 bg-white shadow-lg py-1 text-sm">
                            <button
                              type="button"
                              className="w-full px-4 py-2.5 text-left hover:bg-slate-50 touch-manipulation"
                              onClick={() => {
                                setEditingId(m.id);
                                setEditText(m.content);
                                setMenuId(null);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 touch-manipulation"
                              onClick={() => handleDelete(m.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {editingId === m.id ? (
                      <div className="rounded-2xl border border-blue-200 bg-white p-3 shadow-sm space-y-2 min-w-[200px]">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={2}
                          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditText('');
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(m.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`rounded-2xl px-3.5 sm:px-4 py-3 text-sm leading-relaxed break-words ${
                          m.isDeleted
                            ? 'bg-slate-100 text-slate-400 italic border border-slate-200'
                            : m.role === 'user'
                              ? 'bg-blue-600 text-white rounded-br-md'
                              : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'
                        }`}
                      >
                        {m.isDeleted ? (
                          <span>This message was deleted</span>
                        ) : (
                          <>
                            {showText ? (
                              <p className="whitespace-pre-wrap">{m.content}</p>
                            ) : null}

                            {m.role === 'assistant' && cards.length > 0 && (
                              <div className="mt-4 space-y-3">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                  Recommended tutors — tap to view profile
                                </p>
                                <div className="grid gap-3 grid-cols-1">
                                  {cards.map((tutor) => (
                                    <TutorRecommendationCard key={tutor.tutorId} tutor={tutor} />
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {m.role === 'user' && m.isEdited && !m.isDeleted && (
                      <p className="text-[10px] text-slate-400 text-right mt-1 italic">edited</p>
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

          <div className="p-3 sm:p-4 border-t border-slate-200 bg-white shrink-0 safe-area-pb">
            <div className="flex flex-wrap gap-2 mb-3">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={sending}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50 text-left max-w-full"
                >
                  {prompt.length > 48 ? `${prompt.slice(0, 48)}…` : prompt}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex flex-col xs:flex-row gap-2 sm:flex-row"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything or describe the tutor you need…"
                className="flex-1 min-w-0 h-11 px-4 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="h-11 px-5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 shrink-0 w-full sm:w-auto"
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
