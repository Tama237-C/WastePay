import type { Metadata } from "next";
import { WorkspaceGateway } from "@/components/app/workspace-gateway";

export const metadata: Metadata = {
  title: "WastePay Staff Access",
  description: "Choose your secure WastePay staff workspace.",
};

export default function AppWorkspacesPage() {
  return <WorkspaceGateway />;
}
