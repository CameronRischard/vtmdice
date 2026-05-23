import OBR from "@owlbear-rodeo/sdk";
import { useEffect } from "react";
import throttle from "lodash.throttle";

const THROTTLE_TIME = 100;
const SIDEBAR_WIDTH = 60;
const PANEL_WIDTH = 200;

/**
 * Observe window resize and keep the popover sized to fit the
 * sidebar + tray (calc(100vh / 2)) + breakdown panel.
 */
export function ResizeObserver() {
  useEffect(() => {
    const handleResize = throttle(() => {
      OBR.action.setWidth(
        window.innerHeight / 2 + SIDEBAR_WIDTH + PANEL_WIDTH
      );
    }, THROTTLE_TIME);

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
}
