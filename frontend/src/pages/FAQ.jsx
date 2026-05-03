import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "How do I get started?",
        answer: "Simply click the 'Register' button in the top right corner to create your account. Once registered, you can browse our catalog and enroll in courses immediately."
    },
    {
        question: "Are the courses self-paced?",
        answer: "Yes, the majority of our courses are completely self-paced. You can learn on your own schedule and review materials as many times as you need."
    },
    {
        question: "Can I teach on this platform?",
        answer: "Absolutely! If you're an expert in your field, you can apply to become an instructor via the 'Start Teaching' link in the footer. Our team will review your application within 48 hours."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and Apple Pay. Transactions are securely processed through Stripe."
    },
    {
        question: "Is there a refund policy?",
        answer: "We offer a 14-day money-back guarantee for all individual course purchases if you're not satisfied with the content."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section id="faq" className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Questions</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Find answers to common questions about our platform, courses, and more.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className="bg-white dark:bg-ai-surface border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm"
                        >
                            <button
                                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="font-semibold text-lg text-slate-900 dark:text-white">{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-slate-500"
                                >
                                    <ChevronDown size={20} />
                                </motion.div>
                            </button>
                            
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-6 pb-5 text-slate-600 dark:text-slate-400">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
