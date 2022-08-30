import { AuditType, CriteriumResult } from "../types";

export interface AuditReport {
  consultUniqueId: string;

  procedureName: string;
  procedureUrl: string;

  publishDate?: string;
  updateDate?: string;

  auditType: AuditType;

  context: AuditReportContext;

  accessibilityRate: number;

  errorCount: number;

  blockingErrorCount: number;

  applicableCriteriaCount: number;

  totalCriteriaCount: number;

  /** Global distribution of criteria by result */
  resultDistribution: ResultDistribution;

  /** Distribution of criteria by page */
  pageDistributions: PageResultDistribution[];

  /** Distribution of criteria by topic */
  topicDistributions: TopicResultDistribution[];

  results: CriteriumResult[];
}

interface ResultDistribution {
  compliant: number;
  notCompliant: number;
  notApplicable: number;
}

interface PageResultDistribution extends ResultDistribution {
  name: string;
}

interface TopicResultDistribution extends ResultDistribution {
  name: string;
}

interface AuditReportContext {
  referencial: string;

  auditorName: string;

  technologies: string[];

  samples: PageSample[];

  // TODO: derogated content
  // derogatedContent: any

  tools: Tool[];

  desktopEnvironments: Environment[];
  mobileEnvironments: Environment[];
}

interface PageSample {
  // number: number;
  name: string;
  url: string;
}

interface Tool {
  name: string;
  function: string;
  url: string;
}

interface Environment {
  assistiveTechnology: string;
  browser: string;
  os: string;
}