export const COPY = {
  app: {
    title: 'Synapse Dashboard — ITC Performance Marketing',
    dataFresh: (mins: number) => `Data fresh ${mins} min ago`,
  },
  filters: { filters: 'Filters', reset: 'Reset', more: 'More filters' },
  common: {
    exportCSV: 'Export CSV',
    exportPNG: 'Export PNG',
    oneClickDeck: 'One-click deck',
    noData: 'No data for these filters. Try expanding the date range.',
  },
  metricLabels: {
    spend: 'Spend',
    sales: 'Sales',
    roas: 'ROAS',
    cpa: 'CPA',
    conv: 'Conversions',
    ntb: 'NTB%',
    sow: 'Share of wallet',
  },
  toasts: {
    draftCreated: 'Draft created.',
    planGenerated: 'Plan generated.',
    planApplied: 'Applied to plan.',
    exported: 'Ledger exported as CSV.',
    actionQueued: 'Action queued.',
    monthPackReady: 'Month-end pack prepared.',
  },
} as const;


