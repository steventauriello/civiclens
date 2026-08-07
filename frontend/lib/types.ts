export type IconName =
  | "arrow"
  | "barChart"
  | "building"
  | "check"
  | "chevron"
  | "document"
  | "external"
  | "eye"
  | "flag"
  | "layers"
  | "menu"
  | "question"
  | "search"
  | "shield"
  | "spark"
  | "wallet"
  | "x";

export type EvidenceSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  format: string;
  cadence: string;
  status: "confirmed" | "needs-test";
  note: string;
};

export type Allocation = {
  id: string;
  name: string;
  percent: number;
  description: string;
};

export type GuidedAnswer = {
  id: string;
  prompts: string[];
  eyebrow: string;
  title: string;
  summary: string;
  bullets: string[];
  sourceIds: string[];
  qualification?: string;
};

export type AenDimension = {
  letter: "A" | "E" | "N";
  title: string;
  status: string;
  evidenceFound: number;
  evidenceExpected: number;
  description: string;
  highlights: string[];
};
