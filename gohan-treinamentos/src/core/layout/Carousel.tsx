import { Box, IconButton, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


// --- Carousel Component ---
interface CarouselProps {
    children: ReactNode[];
}

const Carousel: React.FC<CarouselProps> = ({ children }) => {
    const [current, setCurrent] = useState(0);
    const maxIndex = children.length - 1;

    const next = () => {
        setCurrent(current === maxIndex ? 0 : current + 1);
    };

    const prev = () => {
        setCurrent(current === 0 ? maxIndex : current - 1);
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', mt: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {children[current]}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <IconButton onClick={prev} color="primary">
                    <ArrowBackIcon />
                </IconButton>
                <Typography sx={{ mx: 2, display: 'flex', alignItems: 'center' }}>
                    {current + 1} / {children.length}
                </Typography>
                <IconButton onClick={next} color="primary">
                    <ArrowForwardIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

