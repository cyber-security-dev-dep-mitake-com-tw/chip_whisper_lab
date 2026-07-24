import type { Metadata } from "next";
import { ControlCenter } from "./control-center";

export const metadata: Metadata = {
  title: "Workbench",
  description: "Local ChipWhisperer lab control and Apple Silicon setup.",
};

export default function Home() {
  return <ControlCenter />;
}
