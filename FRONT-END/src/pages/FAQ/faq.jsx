import React, { useState } from "react";
import "./faq.css"; // We'll style it separately

const FAQ = () => {
  const faqData = [
    {
      question: "What products do you sell?",
      answer: "We sell posters, badges, notebooks, and customizable artwork based on your requirements."
    },
    {
      question: "How can I place a custom artwork order?",
      answer: "You can place a custom order by providing your design preferences, colors, text, and other details during checkout or via our contact form."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit/debit cards, PayPal, and other online payment methods supported on our website."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Cancellations or modifications are allowed only before production starts. Once production begins, we may not be able to make changes."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary based on your location. Standard shipping estimates are provided during checkout, but external delays may occur."
    },
    {
      question: "Do you offer refunds?",
      answer: "Refunds for standard products are allowed according to our Returns Policy. Custom artwork is usually non-refundable unless there is a production error."
    },
    {
      question: "How do you handle my custom artwork submissions?",
      answer: "We treat your submitted designs with confidentiality. You retain ownership, but we use them solely for order fulfillment and internal purposes."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide. Shipping charges and delivery times may vary depending on your location."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us via email at [Your Contact Email] or through our contact form on the website."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      {faqData.map((item, index) => (
        <div key={index} className="faq-item">
          <div
            className="faq-question"
            onClick={() => toggleFAQ(index)}
          >
            {item.question}
            <span className="faq-toggle">{activeIndex === index ? "-" : "+"}</span>
          </div>
          {activeIndex === index && (
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
