import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

interface YouTubeVideoProps {
    videoId: string;
    title: string;
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ videoId, title }) => {
    return (
        <Card sx={{ mb: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="iframe"
                height={200}
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                frameBorder="0"
                allowFullScreen
                sx={{ border: 0 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" component="div" noWrap>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default YouTubeVideo;