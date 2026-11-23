import { ImageResponse } from "next/og";

export const alt =
  "ECOLOGIX — Cameroon’s circular plastic economy infrastructure";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #020617 0%, #07111f 54%, #031712 100%)",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -190,
            left: -160,
            width: 560,
            height: 560,
            borderRadius: 999,
            background: "rgba(52, 211, 153, 0.2)",
            filter: "blur(110px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -180,
            bottom: -210,
            width: 600,
            height: 600,
            borderRadius: 999,
            background: "rgba(56, 189, 248, 0.14)",
            filter: "blur(120px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "58px 58px",
          }}
        />

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            padding: "54px 60px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "62%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingRight: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 24,
                  border: "1px solid rgba(110, 231, 183, 0.38)",
                  background:
                    "linear-gradient(145deg, #34d399 0%, #10b981 62%, #059669 100%)",
                  color: "#02140f",
                  fontSize: 25,
                  fontWeight: 900,
                  letterSpacing: "-2px",
                  boxShadow: "0 18px 55px rgba(16,185,129,0.25)",
                }}
              >
                WP
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: 25,
                    fontWeight: 900,
                    letterSpacing: "7px",
                  }}
                >
                  ECOLOGIX
                </div>

                <div
                  style={{
                    marginTop: 7,
                    color: "#34d399",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "4px",
                  }}
                >
                  CIRCULAR PLASTIC ECONOMY
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  color: "#6ee7b7",
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: "4px",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: "#34d399",
                    boxShadow: "0 0 22px rgba(52,211,153,0.9)",
                  }}
                />

                BUILT FOR CIRCULAR RECOVERY
              </div>

              <div
                style={{
                  marginTop: 25,
                  maxWidth: 690,
                  fontSize: 66,
                  lineHeight: 1.02,
                  fontWeight: 900,
                  letterSpacing: "-4px",
                }}
              >
                Plastic waste becomes value.
              </div>

              <div
                style={{
                  marginTop: 24,
                  maxWidth: 690,
                  color: "#94a3b8",
                  fontSize: 21,
                  lineHeight: 1.5,
                }}
              >
                Technology, logistics, recovery depots, plastic intelligence,
                and transparent value distribution for Cameroon.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                color: "#64748b",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "2px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "11px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.035)",
                }}
              >
                HOME COLLECTION
              </div>

              <div
                style={{
                  display: "flex",
                  padding: "11px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.035)",
                }}
              >
                PLASTIC BUYBACK
              </div>

              <div
                style={{
                  display: "flex",
                  padding: "11px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.035)",
                }}
              >
                MOBILE MONEY
              </div>
            </div>
          </div>

          <div
            style={{
              width: "38%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 390,
                height: 500,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                borderRadius: 44,
                border: "1px solid rgba(255,255,255,0.12)",
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.075), rgba(255,255,255,0.018))",
                padding: 28,
                boxShadow:
                  "0 45px 110px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      color: "#34d399",
                      fontSize: 11,
                      fontWeight: 900,
                      letterSpacing: "3px",
                    }}
                  >
                    RECOVERY NETWORK
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      color: "#64748b",
                      fontSize: 13,
                    }}
                  >
                    Connected infrastructure
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 12px",
                    borderRadius: 999,
                    border: "1px solid rgba(52,211,153,0.22)",
                    background: "rgba(52,211,153,0.08)",
                    color: "#6ee7b7",
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "2px",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: "#34d399",
                    }}
                  />

                  LIVE
                </div>
              </div>

              <div
                style={{
                  marginTop: 25,
                  display: "flex",
                  flexDirection: "column",
                  gap: 13,
                }}
              >
                {[
                  ["01", "Collection request", "PUBLIC"],
                  ["02", "Driver dispatch", "FIELD"],
                  ["03", "Depot verification", "RECOVERY"],
                  ["04", "Circular value", "IMPACT"],
                ].map(([number, title, label]) => (
                  <div
                    key={number}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: 15,
                      borderRadius: 20,
                      border: "1px solid rgba(255,255,255,0.09)",
                      background: "rgba(2,6,23,0.62)",
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 13,
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#475569",
                        fontSize: 10,
                        fontWeight: 900,
                      }}
                    >
                      {number}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        fontSize: 14,
                        fontWeight: 800,
                      }}
                    >
                      {title}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        color: "#475569",
                        fontSize: 8,
                        fontWeight: 900,
                        letterSpacing: "2px",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: 16,
                    borderRadius: 20,
                    border: "1px solid rgba(52,211,153,0.16)",
                    background: "rgba(52,211,153,0.065)",
                  }}
                >
                  <div
                    style={{
                      color: "#34d399",
                      fontSize: 9,
                      fontWeight: 900,
                      letterSpacing: "2px",
                    }}
                  >
                    INFRASTRUCTURE
                  </div>

                  <div
                    style={{
                      marginTop: 9,
                      fontSize: 16,
                      fontWeight: 900,
                    }}
                  >
                    Connected
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: 16,
                    borderRadius: 20,
                    border: "1px solid rgba(56,189,248,0.16)",
                    background: "rgba(56,189,248,0.065)",
                  }}
                >
                  <div
                    style={{
                      color: "#38bdf8",
                      fontSize: 9,
                      fontWeight: 900,
                      letterSpacing: "2px",
                    }}
                  >
                    MARKET
                  </div>

                  <div
                    style={{
                      marginTop: 9,
                      fontSize: 16,
                      fontWeight: 900,
                    }}
                  >
                    Cameroon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}