import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic params
        const title = searchParams.get("title") || "Vibe Stack";
        const description = searchParams.get("description") || "Share and discover the best AI coding projects, resources, and workflows.";
        const type = searchParams.get("type") || "Generic"; // "Project", "Resource", "Guide"

        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#09090b", // zinc-950
                        backgroundImage: "radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)",
                        backgroundSize: "100px 100px",
                        position: "relative",
                    }}
                >
                    {/* Abstract background blobs */}
                    <div
                        style={{
                            position: "absolute",
                            top: "-100px",
                            left: "-100px",
                            height: "400px",
                            width: "400px",
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.05)",
                            filter: "blur(80px)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-50px",
                            right: "-50px",
                            height: "300px",
                            width: "300px",
                            borderRadius: "50%",
                            background: "rgba(34, 197, 94, 0.1)", // Green tint
                            filter: "blur(80px)",
                        }}
                    />

                    {/* Content Container */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "60px",
                            textAlign: "center",
                        }}
                    >
                        {/* Type Badge */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "8px 24px",
                                background: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "50px",
                                color: "#d4d4d8", // zinc-300
                                fontSize: 20,
                                fontWeight: 600,
                                marginBottom: 40,
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                        >
                            {type}
                        </div>

                        {/* Title */}
                        <div
                            style={{
                                fontSize: 70,
                                fontWeight: 800,
                                background: "linear-gradient(to bottom right, #ffffff, #a1a1aa)",
                                backgroundClip: "text",
                                color: "transparent",
                                lineHeight: 1.1,
                                marginBottom: 20,
                                maxWidth: "900px",
                            }}
                        >
                            {title}
                        </div>

                        {/* Description */}
                        <div
                            style={{
                                fontSize: 30,
                                color: "#a1a1aa", // zinc-400
                                maxWidth: "800px",
                                lineHeight: 1.4,
                            }}
                        >
                            {description.length > 100 ? description.slice(0, 100) + "..." : description}
                        </div>
                    </div>

                    {/* Logo / Footer */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 40,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: "#22c55e",
                            }}
                        />
                        <div
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: "white",
                            }}
                        >
                            vibestack.ai
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
