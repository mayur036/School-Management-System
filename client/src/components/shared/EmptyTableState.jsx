const EmptyTableState = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      {Icon && (
        <div
          aria-hidden="true"
          className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl"
        >
          <Icon className="size-6" />
        </div>
      )}
      <div className="flex flex-col gap-1 px-4">
        <p className="text-foreground font-medium">{title}</p>
        {description && (
          <p className="text-muted-foreground text-sm max-w-75 md:max-w-100">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmptyTableState;
