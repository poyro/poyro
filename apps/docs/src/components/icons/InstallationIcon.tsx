import { DarkMode, Gradient, LightMode } from "@/components/Icon";

export function InstallationIcon({
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
          gradientTransform="matrix(0 21 -21 0 12 3)"
          id={`${id}-gradient`}
        />
        <Gradient
          color={color}
          gradientTransform="matrix(0 21 -21 0 16 7)"
          id={`${id}-gradient-dark`}
        />
      </defs>
      <LightMode>
        <circle cx={12} cy={12} fill={`url(#${id}-gradient)`} r={12} />
        <path
          className="fill-[var(--icon-background)] stroke-[color:var(--icon-foreground)]"
          d="m8 8 9 21 2-10 10-2L8 8Z"
          fillOpacity={0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </LightMode>
      <DarkMode>
        <path
          d="m4 4 10.286 24 2.285-11.429L28 14.286 4 4Z"
          fill={`url(#${id}-gradient-dark)`}
          stroke={`url(#${id}-gradient-dark)`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </DarkMode>
    </>
  );
}
