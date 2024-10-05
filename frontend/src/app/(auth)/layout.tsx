import "./layout.css";
import FirstHalf from "@/components/auth/FirstHalf";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div id="d1">
                <FirstHalf />
                <div id="d1_2">{children}</div>
            </div>
        </>
    );
}
