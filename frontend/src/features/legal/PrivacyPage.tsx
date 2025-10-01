'use client';

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: October 26, 2023</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 animate-fade-in-up">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-white leading-relaxed mb-4">
              At EduTech, we are committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <p className="text-white leading-relaxed mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              enroll in courses, or contact us. This may include:
            </p>
            <ul className="list-disc list-inside text-white space-y-2 ml-4">
              <li>Personal information (name, email address, etc.)</li>
              <li>Account credentials</li>
              <li>Payment information</li>
              <li>Course progress and performance data</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-white leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-white space-y-2 ml-4">
              <li>Provide and maintain our services</li>
              <li>Process your transactions</li>
              <li>Personalize your learning experience</li>
              <li>Communicate with you about updates and offers</li>
              <li>Improve our Platform and services</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-white leading-relaxed mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-white space-y-2 ml-4">
              <li>Service providers who assist in our operations</li>
              <li>Instructors and educators for course delivery</li>
              <li>Legal authorities when required by law</li>
              <li>Third parties with your consent</li>
            </ul>
            <p className="text-white leading-relaxed mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <p className="text-white leading-relaxed mb-4">
              We implement appropriate security measures to protect your information, including 
              encryption, access controls, and regular security assessments. However, no method of 
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
            <p className="text-white leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-white space-y-2 ml-4">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
              <li>Object to certain processing activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
            <p className="text-white leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage, 
              and deliver personalized content. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <p className="text-white leading-relaxed mb-4">
              Our Platform is not intended for children under 13. We do not knowingly collect 
              personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
            <p className="text-white leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any 
              significant changes by posting the new policy on our Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="text-white leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:support@edutech.com" className="text-blue-600 hover:text-blue-700">
                support@edutech.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};