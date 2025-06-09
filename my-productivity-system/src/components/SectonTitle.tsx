// frontend/src/components/SectionTitle.tsx
import React from 'react';

interface SectionTitleProps {
    iconClass: string;
    title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ iconClass, title }) => {
    return (
        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
            <i className={`${iconClass} mr-3 text-accentCyan`}></i> {title}
        </h2>
    );
};

export default SectionTitle;
