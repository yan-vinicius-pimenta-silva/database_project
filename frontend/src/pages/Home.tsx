import { Container, Typography, Card, CardActionArea, CardContent, Grid } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  const sections = [
    { title: "Drivers", path: "/drivers", description: "Manage drivers data" },
    { title: "Vehicles", path: "/vehicles", description: "Manage fleet vehicles" },
    { title: "Loads", path: "/loads", description: "Track and manage cargo" },
    { title: "Trips", path: "/trips", description: "Plan and follow trips" }
  ];
  
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        B.A.A Logística – Management System
      </Typography>
      <Grid container spacing={3}>
        {sections.map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.title}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardActionArea component={Link} to={s.path}>
                <CardContent>
                  <Typography variant="h6">{s.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {s.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}