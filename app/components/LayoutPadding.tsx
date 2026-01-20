"use client";

import { usePathname } from "next/navigation";

export default function LayoutPadding({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // sider som IKKE skal ha padding-top
    const noPaddingRoutes = ["/map"];

    const hasPadding = !noPaddingRoutes.some((r) =>
        pathname === r || pathname.startsWith(r + "/")
    );

    return (
        <div className={hasPadding ? "pt-20" : ""}>
            {children}
        </div>
    );
}