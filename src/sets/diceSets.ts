import { DiceSet } from "../types/DiceSet";

import * as galaxyPreviews from "../previews/galaxy";

export const VTM_REGULAR_STYLE = "GALAXY" as const;
export const VTM_HUNGER_STYLE = "SUNSET" as const;

export const VTM_REGULAR_DIE_ID = "VTM_REGULAR_D10";
export const VTM_HUNGER_DIE_ID = "VTM_HUNGER_D10";

const vtmSet: DiceSet = {
  id: "vtm",
  name: "vampire the masquerade",
  dice: [
    { id: VTM_REGULAR_DIE_ID, type: "D10", style: VTM_REGULAR_STYLE },
    { id: VTM_HUNGER_DIE_ID, type: "D10", style: VTM_HUNGER_STYLE },
  ],
  previewImage: galaxyPreviews.D10,
};

export const diceSets: DiceSet[] = [vtmSet];
