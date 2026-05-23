import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import { InteractiveTray } from "./tray/InteractiveTray";
import { Sidebar } from "./controls/Sidebar";
import { DiceResultsPanel } from "./controls/DiceResultsPanel";

export function App() {
  return (
    <Container disableGutters maxWidth="md">
      <Stack direction="row" justifyContent="center">
        <Sidebar />
        <InteractiveTray />
        <DiceResultsPanel />
      </Stack>
    </Container>
  );
}
