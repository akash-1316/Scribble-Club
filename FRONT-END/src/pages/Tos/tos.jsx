import React from "react";
import "./tos.css"; // Reuse the same CSS for styling

const TermsOfService = () => {
  return (
    <div className="privacy-container">
      <h1>Terms of Service</h1>
      <p><strong>Effective Date:</strong> September 8, 2025</p>

      <p>
        Welcome to [Your Website Name] ("we," "our," or "us"). By accessing or using our website 
        <a href="[your website URL]">[your website URL]</a> ("Website") and the services offered, 
        you agree to comply with and be bound by these Terms of Service ("Terms"). Please read them carefully.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By using our Website, you confirm that you have read, understood, and agree to these Terms, 
        as well as any additional policies referenced herein, including our Privacy Policy. 
        If you do not agree, you must not use our Website or services.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 13 years old to use our Website. By using our services, you represent 
        and warrant that you meet this age requirement and have the legal authority to enter into these Terms.
      </p>

      <h2>3. Account Registration</h2>
      <ul>
        <li>Provide accurate, current, and complete information during registration.</li>
        <li>Maintain the security of your account credentials and notify us of any unauthorized use.</li>
        <li>Accept responsibility for all activity that occurs under your account.</li>
      </ul>

      <h2>4. Products and Services</h2>
      <p>
        We offer products such as posters, badges, notebooks, and customizable artwork. By placing an order, you agree that:
      </p>
      <ul>
        <li>All custom artwork details you provide are accurate and lawful.</li>
        <li>We reserve the right to refuse, cancel, or modify any order at our discretion.</li>
        <li>Product images are for illustrative purposes; actual products may slightly vary in color, size, or design.</li>
      </ul>

      <h2>5. Ordering and Payment</h2>
      <ul>
        <li>Prices are displayed in [currency] and are subject to change without notice.</li>
        <li>Payment must be made in full at the time of order through our supported payment methods.</li>
        <li>You agree to provide valid payment information. Transactions are subject to verification and approval by third-party payment processors.</li>
      </ul>

      <h2>6. Shipping and Delivery</h2>
      <ul>
        <li>Delivery times are estimates and not guaranteed.</li>
        <li>Shipping costs and policies are outlined on our Website.</li>
        <li>We are not responsible for delays caused by carriers, customs, or other external factors.</li>
      </ul>

      <h2>7. Returns, Refunds, and Cancellations</h2>
      <ul>
        <li>Due to the personalized nature of custom artwork, returns and refunds for customized products are limited.</li>
        <li>Standard, non-custom products may be returned according to our Returns Policy.</li>
        <li>Any cancellations must be requested before production begins; we reserve the right to deny cancellations after production has started.</li>
      </ul>

      <h2>8. Intellectual Property</h2>
      <ul>
        <li>All content on our Website, including images, text, logos, and designs, is the property of [Your Website Name] or its licensors and protected by copyright, trademark, and other intellectual property laws.</li>
        <li>You may not reproduce, distribute, or use our content without prior written consent.</li>
        <li>For custom artwork you submit, you retain ownership, but grant us a limited license to use it for order fulfillment and internal purposes.</li>
      </ul>

      <h2>9. User Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Website for unlawful purposes or violate any applicable law.</li>
        <li>Upload or submit content that infringes on intellectual property rights.</li>
        <li>Interfere with the Website’s operation, security, or other users’ access.</li>
      </ul>

      <h2>10. Third-Party Services</h2>
      <p>
        We may use third-party vendors for payments, shipping, analytics, and other services. Your use of these services is subject to their own terms and conditions.
      </p>

      <h2>11. Disclaimers and Limitation of Liability</h2>
      <ul>
        <li>Our products and services are provided "as is" without warranties of any kind, either express or implied.</li>
        <li>We do not guarantee the accuracy, reliability, or completeness of any content on the Website.</li>
        <li>To the maximum extent permitted by law, [Your Website Name] will not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Website or products.</li>
      </ul>

      <h2>12. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless [Your Website Name], its affiliates, employees, and partners from any claims, damages, losses, liabilities, or expenses arising from your violation of these Terms or your use of the Website.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws of [Your Country/State]. Any disputes will be resolved in the courts of [Your Jurisdiction], without regard to conflict of law principles.
      </p>

      <h2>14. Changes to Terms</h2>
      <p>
        We may update these Terms periodically. Updated Terms will be posted on the Website with a revised "Effective Date." Continued use of the Website constitutes acceptance of the updated Terms.
      </p>

      <h2>15. Contact Information</h2>
      <p>For any questions, concerns, or feedback regarding these Terms, please contact us:</p>
      <p>
        [Your Website Name] <br />
        Email: <a href="mailto:[Your Contact Email]">[Your Contact Email]</a> <br />
        Address: [Your Business Address] <br />
        Phone: [Your Contact Phone]
      </p>
    </div>
  );
};

export default TermsOfService;
