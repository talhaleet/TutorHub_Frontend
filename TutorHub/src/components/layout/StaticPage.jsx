import PublicLayout from './PublicLayout';

/**
 * Reusable layout for Help, Contact, Privacy, Terms, etc.
 */
const StaticPage = ({ title, subtitle, children }) => (
  <PublicLayout>
    <section className="bg-gradient-to-b from-blue-50 to-white border-b border-slate-100 py-12 sm:py-16 px-4">
      <div className="container-page max-w-3xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
    <section className="container-page max-w-3xl mx-auto py-10 sm:py-14 px-4 pb-16">
      <div className="static-page-content">
        {children}
      </div>
    </section>
  </PublicLayout>
);

export default StaticPage;
