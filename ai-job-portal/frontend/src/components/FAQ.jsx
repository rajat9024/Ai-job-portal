import React, { useState } from "react";
import "../styles/FAQ.css"

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I post a job on JobsKart?",
      answer:
        "To post a job, login as an Employer, navigate to the Employer Dashboard, and fill out the job posting form."
    },
    {
      question: "Which documents are required for verification and why?",
      answer:
        "Basic business documents such as company registration and GST details are required to ensure authenticity and credibility."
    },
    {
      question: "What is the validity of my job post?",
      answer:
        "Each job post remains valid for 30 days. You can renew or extend the validity from your dashboard."
    },
    {
      question: "Is there an android or iOS apps for employers?",
      answer:
        "Yes, JobsKart offers both Android and iOS apps for employers to manage job postings and applicants on the go."
    }
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-heading">FAQ</h2>
      <p className="faq-subheading">
        Here are some frequently asked questions !
      </p>

      <div className="faq-list">
        <p className="faq-footer">Employers</p>
        {faqData.map((item, index) => (
        <div className="faq-item" key={index}>
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <span>{item.question}</span>
              <span className="faq-icon">
                {activeIndex === index ? "-" : "＋"}
              </span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{item.answer}</div>
            )}
             
          </div>
          
        ))}
        
        </div>

     
    </div>
  );
}

export default FAQ;
