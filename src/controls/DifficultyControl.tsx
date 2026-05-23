import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useDiceControlsStore } from "./store";

export function DifficultyControl() {
  const difficulty = useDiceControlsStore((state) => state.diceDifficulty);
  const setDifficulty = useDiceControlsStore(
    (state) => state.setDiceDifficulty
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Difficulty" placement="top" disableInteractive>
        <IconButton
          aria-label="difficulty"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ fontSize: "14px", width: 40, height: 40 }}
        >
          <Stack alignItems="center" justifyContent="center">
            <Typography variant="caption" lineHeight={1}>
              DIF
            </Typography>
            <Typography variant="body2" fontWeight={700} lineHeight={1.1}>
              {difficulty ?? "—"}
            </Typography>
          </Stack>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
      >
        <Stack p={1.5} gap={1} width={180}>
          <Typography variant="body2">Difficulty (successes needed)</Typography>
          <TextField
            size="small"
            type="number"
            value={difficulty ?? ""}
            placeholder="None"
            inputProps={{ min: 0, max: 20, step: 1 }}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") {
                setDifficulty(null);
              } else {
                const n = parseInt(raw, 10);
                if (!Number.isNaN(n)) setDifficulty(Math.max(0, n));
              }
            }}
          />
          <Button
            size="small"
            onClick={() => setDifficulty(null)}
            disabled={difficulty === null}
          >
            Clear
          </Button>
        </Stack>
      </Menu>
    </>
  );
}
