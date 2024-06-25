import { DarkMode, Gradient, LightMode } from "@/components/Icon";

export function WarningIcon({
  id,
  color,
}: {
  id: string;
  color?: React.ComponentProps<typeof Gradient>["color"];
}) {
  return (
    <>
      <defs>
        <Gradient
          color={color}
          gradientTransform="rotate(65.924 1.519 20.92) scale(25.7391)"
          id={`${id}-gradient`}
        />
        <Gradient
          color={color}
          gradientTransform="matrix(0 24.5 -24.5 0 16 5.5)"
          id={`${id}-gradient-dark`}
        />
      </defs>
      <LightMode>
        <circle cx={20} cy={20} fill={`url(#${id}-gradient)`} r={12} />
        <path
          className="fill-[var(--icon-background)] stroke-[color:var(--icon-foreground)]"
          d="M3 16c0 7.18 5.82 13 13 13s13-5.82 13-13S23.18 3 16 3 3 8.82 3 16Z"
          fillOpacity={0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
        <path
          className="fill-[var(--icon-foreground)] stroke-[color:var(--icon-foreground)]"
          d="m15.408 16.509-1.04-5.543a1.66 1.66 0 1 1 3.263 0l-1.039 5.543a.602.602 0 0 1-1.184 0Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
        <path
          className="fill-[var(--icon-background)] stroke-[color:var(--icon-foreground)]"
          d="M16 23a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          fillOpacity={0.5}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </LightMode>
      <DarkMode>
        <path
          clipRule="evenodd"
          d="M2 16C2 8.268 8.268 2 16 2s14 6.268 14 14-6.268 14-14 14S2 23.732 2 16Zm11.386-4.85a2.66 2.66 0 1 1 5.228 0l-1.039 5.543a1.602 1.602 0 0 1-3.15 0l-1.04-5.543ZM16 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
          fill={`url(#${id}-gradient-dark)`}
          fillRule="evenodd"
        />
      </DarkMode>
    </>
  );
}
