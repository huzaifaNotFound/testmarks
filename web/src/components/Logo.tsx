export default function Logo({
  size = "default",
  dark = false,
}: {
  size?: "sm" | "default" | "lg";
  dark?: boolean;
}) {
  const scales = { sm: 0.75, default: 1, lg: 1.4 };
  const s = scales[size];

  return (
    <div className="flex items-center gap-2.5">
      {/* Mark: compass rose / open book geometry */}
      <svg
        width={Math.round(32 * s)}
        height={Math.round(32 * s)}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        {/* Outer circle — parchment ring */}
        <circle cx="16" cy="16" r="15" fill="#3D3580" />

        {/* Inner ornate cross — compass / pages */}
        <path
          d="M16 5 L18 13 L26 11 L19 16 L26 21 L18 19 L16 27 L14 19 L6 21 L13 16 L6 11 L14 13 Z"
          fill="none"
          stroke="#C8952A"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Center dot — warm gold */}
        <circle cx="16" cy="16" r="2.5" fill="#C8952A" />

        {/* Cardinal dots — ivory */}
        <circle cx="16" cy="7"  r="1.2" fill="#FBF3E0" />
        <circle cx="16" cy="25" r="1.2" fill="#FBF3E0" />
        <circle cx="7"  cy="16" r="1.2" fill="#FBF3E0" />
        <circle cx="25" cy="16" r="1.2" fill="#FBF3E0" />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontFamily: '"Crimson Pro", Georgia, serif',
            fontWeight: 700,
            fontSize: Math.round(17 * s),
            color: dark ? "#EDE8DF" : "#1E1B16",
            letterSpacing: "-0.02em",
          }}
          className={dark ? "" : "dark:text-[#EDE8DF]"}
        >
          Test Marks
        </span>
        <span
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontWeight: 600,
            fontSize: Math.round(9 * s),
            color: dark ? "#7B74CC" : "#3D3580",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
          className={dark ? "" : "dark:text-[#7B74CC]"}
        >
          AI
        </span>
      </div>
    </div>
  );
}
