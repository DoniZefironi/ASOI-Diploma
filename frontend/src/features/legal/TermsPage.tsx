'use client';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Terms of Service & Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: October 26, 2023</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to EduTech! These Terms of Service (“Terms”) govern your use of our platform, 
              including our website, applications, and services (collectively, the “Platform”). 
              By accessing or using the Platform, you agree to be bound by these Terms and our Privacy Policy. 
              If you do not agree to these Terms, please do not use the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              EduTech provides online courses in computer science, electronics, English language, 
              and the Internet of Things (IoT). We also offer career guidance resources and a circuit 
              simulator tool. We reserve the right to modify or discontinue any part of the Platform at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features, you may need to create an account. You are responsible for 
              maintaining the confidentiality of your account information and for all activities that 
              occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and 
              protect your personal information. By using the Platform, you consent to our data 
              practices as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on the Platform, including course materials, is protected by copyright and 
              other intellectual property laws. You may not reproduce, distribute, or create derivative 
              works from our content without our express permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. User Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to use the Platform in a lawful and respectful manner. You may not engage in 
              any activity that is harmful, offensive, or violates the rights of others. We reserve 
              the right to suspend or terminate your account for any violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Platform is provided “as is” without any warranties, express or implied. We do not 
              guarantee the accuracy, completeness, or reliability of any content on the Platform. 
              Your use of the Platform is at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the fullest extent permitted by law, EduTech shall not be liable for any indirect, 
              incidental, special, or consequential damages arising out of or in connection with 
              your use of the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update these Terms from time to time. We will notify you of any significant changes. 
              Your continued use of the Platform after any changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the 
              jurisdiction in which EduTech is established, without regard to its conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
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