import React from "react";

const page = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Terms and Conditions
        </h1>

        <div className="prose prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-300">
              By accessing and using SakhiAI, you agree to be bound by these
              Terms and Conditions and all applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-gray-300 mb-4">
              You are granted a limited, non-exclusive, non-transferable license
              to use SakhiAI for personal or business purposes.
            </p>
            <p className="text-gray-300">This license does not include:</p>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for commercial purposes</li>
              <li>Attempting to reverse engineer the software</li>
              <li>Removing any copyright or proprietary notations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. PDF Document Usage
            </h2>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li>You retain all rights to your uploaded PDF documents</li>
              <li>
                You must have the legal right to upload and process any
                documents
              </li>
              <li>We do not claim ownership of your uploaded content</li>
              <li>
                Documents are processed securely and in accordance with our
                privacy policy
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. Service Limitations
            </h2>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li>
                We strive for 99.9% uptime but do not guarantee uninterrupted
                service
              </li>
              <li>
                AI responses are generated automatically and may not always be
                100% accurate
              </li>
              <li>
                Document processing times may vary based on size and complexity
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              5. User Responsibilities
            </h2>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li>Maintaining account security</li>
              <li>Ensuring uploaded content doesn't violate any laws</li>
              <li>
                Using the service in compliance with all applicable regulations
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Privacy & Data</h2>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li>
                We protect your data using industry-standard security measures
              </li>
              <li>
                Data processing complies with GDPR and other relevant
                regulations
              </li>
              <li>For complete details, please refer to our Privacy Policy</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
            <p className="text-gray-300">
              We reserve the right to modify these terms at any time. Users will
              be notified of significant changes.
            </p>
          </section>

          <div className="text-center text-gray-400">
            Built with ❤️ by Vikas Wakde
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
