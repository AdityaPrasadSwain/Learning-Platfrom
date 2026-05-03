import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

const teamMembers = [
    {
        name: 'Sarah Jenkins',
        role: 'Founder & CEO',
        image: 'https://i.pravatar.cc/150?img=1',
        bio: 'Former EdTech executive with 15+ years of experience in building learning platforms.'
    },
    {
        name: 'David Chen',
        role: 'Chief Technology Officer',
        image: 'https://i.pravatar.cc/150?img=11',
        bio: 'AI researcher and full-stack developer passionate about adaptive learning.'
    },
    {
        name: 'Elena Rodriguez',
        role: 'Head of Curriculum',
        image: 'https://i.pravatar.cc/150?img=5',
        bio: 'Instructional designer focused on creating engaging and effective online courses.'
    },
    {
        name: 'Michael Chang',
        role: 'Lead Designer',
        image: 'https://i.pravatar.cc/150?img=12',
        bio: 'UI/UX expert dedicated to crafting intuitive and beautiful user experiences.'
    }
];

const Team = () => {
    return (
        <section id="team" className="py-24 px-6 bg-slate-50 dark:bg-ai-base/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Team</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        The passionate minds behind LearningStream, dedicated to transforming education.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-ai-surface rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5 text-center group hover:shadow-lg transition-all"
                        >
                            <div className="p-8">
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-brand-primary/20 group-hover:border-brand-primary/50 transition-colors">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                                <p className="text-brand-primary font-medium mb-4">{member.role}</p>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                                    {member.bio}
                                </p>
                                <div className="flex justify-center gap-4 text-slate-400">
                                    <a href="#" className="hover:text-brand-primary transition-colors"><Twitter size={20} /></a>
                                    <a href="#" className="hover:text-brand-primary transition-colors"><Linkedin size={20} /></a>
                                    <a href="#" className="hover:text-brand-primary transition-colors"><Github size={20} /></a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
