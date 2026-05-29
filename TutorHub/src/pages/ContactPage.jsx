import { useState } from 'react';
import toast from 'react-hot-toast';
import StaticPage from '../components/layout/StaticPage';
import axiosInstance from '../services/axiosInstance';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axiosInstance.post('/api/contact', form);
      toast.success('Message received. We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <StaticPage
      title="Contact Us"
      subtitle="Questions about bookings, tutor verification, or your account? We are here to help."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 not-prose">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-1">Email</h3>
            <a href="mailto:support@tutorhub.pk" className="text-primary font-semibold text-sm">
              support@tutorhub.pk
            </a>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-1">Hours</h3>
            <p className="text-slate-600 text-sm">Monday – Friday, 9:00 AM – 6:00 PM (PKT)</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-1">Location</h3>
            <p className="text-slate-600 text-sm">Lahore, Pakistan — serving students nationwide online</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Your name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Subject</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm disabled:opacity-60"
          >
            {sending ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </StaticPage>
  );
};

export default ContactPage;
