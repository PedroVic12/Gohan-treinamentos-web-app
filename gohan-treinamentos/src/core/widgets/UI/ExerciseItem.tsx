import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface ExerciseItemProps {
    name: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ name, checked, onChange }) => {
    return (
        <FormControlLabel
            control={<Checkbox checked={checked} onChange={onChange} color="primary" />}
            label={name}
            sx={{ width: '100%', mb: 1 }}
        />
    );
};

export default ExerciseItem;