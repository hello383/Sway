export const metadata = {
  title: 'Privacy Policy - Sway',
  description: 'Privacy Policy for Sway - Ireland\'s Remote Job Database',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-8">Privacy Policy</h1>
        <p className="text-white/70 mb-8">Last updated: December 26, 2025</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-white/80 leading-relaxed">
              Sway ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at joinsway.org (the "Service").
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2">2.1 Personal Information</h3>
                <p className="text-white/80 leading-relaxed">
                  When you create a profile, we collect:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 mt-2 space-y-1">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number (optional)</li>
                  <li>Location (town and county in Ireland)</li>
                  <li>Professional information (role, experience, company, salary expectations)</li>
                  <li>Work preferences (hours, communication style, environment)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">2.2 Authentication Information</h3>
                <p className="text-white/80 leading-relaxed">
                  If you sign in with Google, we receive your Google account information (name, email) as provided by Google's OAuth service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-white/80 ml-4 space-y-1">
              <li>Create and manage your profile</li>
              <li>Match you with remote job opportunities</li>
              <li>Send you job alerts (if you opt in)</li>
              <li>Make your profile visible to employers (if you choose this option)</li>
              <li>Support Grow Remote's campaign to bring remote jobs to Ireland</li>
              <li>Generate anonymized statistics about remote work demand in Ireland</li>
              <li>Communicate with you about the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Profile Visibility</h2>
            <p className="text-white/80 leading-relaxed">
              You can choose how your profile is used:
            </p>
            <ul className="list-disc list-inside text-white/80 ml-4 mt-2 space-y-2">
              <li><strong>Visible to employers:</strong> Your profile is searchable and viewable by employers who can contact you directly.</li>
              <li><strong>Email notifications only:</strong> Your profile is private. You'll receive email alerts about matching jobs.</li>
              <li><strong>Campaign support only:</strong> Your information is used only for campaign statistics and is not stored in the searchable database.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Sharing</h2>
            <p className="text-white/80 leading-relaxed">
              We share your information only as follows:
            </p>
            <ul className="list-disc list-inside text-white/80 ml-4 mt-2 space-y-1">
              <li><strong>With employers:</strong> Only if you choose to make your profile visible</li>
              <li><strong>With Grow Remote:</strong> Anonymized data for campaign purposes</li>
              <li><strong>Service providers:</strong> We use Supabase for data storage and authentication</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
            <p className="text-white/80 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Under GDPR (as you're in Ireland), you have the right to:
            </p>
            <ul className="list-disc list-inside text-white/80 ml-4 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              To exercise these rights, contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>
            <p className="text-white/80 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide services. You can delete your profile at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Cookies and Tracking</h2>
            <p className="text-white/80 leading-relaxed">
              We use essential cookies for authentication and session management. We do not use tracking cookies or third-party analytics without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
            <p className="text-white/80 leading-relaxed">
              Our Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
            <p className="text-white/80 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p className="text-white/80 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-white/80 leading-relaxed mt-2">
              <strong>Email:</strong> privacy@joinsway.org<br />
              <strong>Website:</strong> https://joinsway.org
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Partnership with Grow Remote</h2>
            <p className="text-white/80 leading-relaxed">
              Sway is built in partnership with Grow Remote. Anonymized data may be shared with Grow Remote for campaign purposes to demonstrate remote work demand across Ireland and support policy initiatives.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <a href="/" className="text-purple-400 hover:text-purple-300 font-bold">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}

