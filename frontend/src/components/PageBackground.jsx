import React from 'react';

const PageBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-brand-primary/20 rounded-full blur-[100px] animate-pulse-soft" />
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-brand-secondary/20 rounded-full blur-[100px] animate-pulse-soft delay-1000" />
            <div className="absolute bottom-[0%] left-[20%] w-[30%] h-[30%] bg-brand-accent/10 rounded-full blur-[80px] animate-pulse-soft delay-2000" />
        </div>
    );
};

export default PageBackground;
