interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode; // e.g. an "Add Student" button
}

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center
                    justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-ink-50">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-ink-400 mt-1">{subtitle}</p>}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
