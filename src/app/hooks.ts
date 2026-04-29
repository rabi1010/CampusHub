import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Typed dispatch — knows about all your action creators
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed selector — no need to annotate state type every time
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
