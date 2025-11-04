export const StatsSection = () => {
  const stats = [
    { value: "Over 10,00,000+", label: "Learners" },
    { value: "40+ Top-Rated", label: "Courses" },
    { value: "85+ Highly", label: "Experienced Faculty" },
    { value: "50+ Top Leading", label: "Partners" },
  ];

  return (
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
