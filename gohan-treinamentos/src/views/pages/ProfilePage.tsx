import { Typography, Paper, Avatar } from "@mui/material";
import { Box } from "lucide-react";

// ProfilePage
const ProfilePage: React.FC = () => {
    return (
        <Box className="p-4">
            <Typography variant="h4" gutterBottom>Profile</Typography>
            <Paper elevation={3} className="p-6 flex flex-col items-center rounded-lg">
                <Avatar sx={{ width: 80, height: 80, mb: 2 }} alt="User Avatar" src="/static/images/avatar/1.jpg" />
                <Typography variant="h6">John Doe</Typography>
                <Typography color="text.secondary">john.doe@example.com</Typography>
                <Typography variant="body2" className="mt-4 text-center">Profile page content goes here.</Typography>
            </Paper>
        </Box>
    );
};

export default ProfilePage;