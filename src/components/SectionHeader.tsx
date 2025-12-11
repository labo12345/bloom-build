interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeader = ({ badge, title, subtitle, centered = true }: SectionHeaderProps) => {
  return (
    <div className={centered ? "text-center" : ""}>
      {badge && (
        <span className="inline-block px-4 py-1.5 bg-blush text-foreground text-sm font-medium rounded-full mb-4">
          {badge}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
