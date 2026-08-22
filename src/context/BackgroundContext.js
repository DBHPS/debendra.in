"use client";
import { createContext, useContext } from "react";

/**
 * Carries the page background colour as a framer-motion value.
 *
 * The background element lives in the persistent shell so it survives
 * navigation, but the value is driven from inside the Systems page, which is
 * what knows where the Experience section sits relative to the scroll.
 */
export const BackgroundSignalContext = createContext(null);

export function useBackgroundSignal() {
  return useContext(BackgroundSignalContext);
}
