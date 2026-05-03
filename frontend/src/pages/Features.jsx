import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Target, Video, Award } from 'lucide-react';

const featuresList = [
    { icon: <Brain size={24} />, title: 'AI-Powered Learning', desc: 'Personalized course recommendations and adaptive quizzes based on your performance.' },
    { icon: <Video size={24} />, title: 'High-Quality Video Content', desc: 'Seamless streaming of expert-led video tutorials.' },
    { icon: <Zap size={24} />, title: 'Instant Feedback', desc: 'Get real-time results and detailed explanations for all quizzes.' },
    { icon: <Shield size={24} />, title: 'Secure Platform', desc: 'Enterprise-grade security for your data and payment information.' },
    { icon: <Target size={24} />, title: 'Goal Tracking', desc: 'Set learning objectives and track your progress daily.' },
    { icon: <Award size={24} />, title: 'Certifications', desc: 'Earn recognized certificates upon course completion.' }
];

const Features = () => {
    return (
        <section id="features" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Features</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Discover the tools and technologies that make our platform the best choice for your learning journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresList.map((feature, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-ai-surface p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md transition-shadow group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
