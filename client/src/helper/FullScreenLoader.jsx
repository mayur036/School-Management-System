export const FullScreenLoader = ({ message = 'Loading your workspace...' }) => {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-all duration-300">
      <div className="relative flex flex-col items-center gap-6">
        {/* Ambient background glow */}
        <div className="bg-primary/10 absolute -inset-10 -z-10 rounded-full blur-3xl" />

        {/* Dual Ring Loader */}
        <div className="relative h-16 w-16">
          {/* Static outer track */}
          <div className="border-primary/20 absolute inset-0 rounded-full border-4" />
          {/* Active spinning indicator */}
          <div className="border-t-primary absolute inset-0 animate-spin rounded-full border-4 border-r-transparent border-b-transparent border-l-transparent" />
          {/* Secondary counter-rotating dashed ring */}
          <div className="border-muted-foreground/30 absolute -inset-2 animate-[spin_3s_linear_infinite_reverse] rounded-full border border-dashed" />
        </div>

        {/* Message elements */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-foreground/90 text-sm font-semibold tracking-wider uppercase">
            {message}
          </h3>
          <p className="text-muted-foreground animate-pulse text-xs">
            Please wait a moment
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
