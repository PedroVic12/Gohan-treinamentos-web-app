// frontend/src/components/InfoCard.tsx
import React from 'react';

interface InfoCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children, className = "" }) => {
    return (
        <div className={`bg-secondary p-6 rounded-lg shadow-md border border-currentLine ${className}`}>
            <h3 className="font-semibold text-primary mb-2">{title}</h3>
            {children}
        </div>
    );
};

export default InfoCard;
