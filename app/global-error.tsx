"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html lang="es">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "1rem",
            textAlign: "center",
            backgroundColor: "#f9fafb",
          }}
        >
          <div style={{ maxWidth: "28rem", margin: "0 auto" }}>
            <h1
              style={{
                marginBottom: "1rem",
                fontSize: "2.25rem",
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              Error del servidor
            </h1>
            <p
              style={{
                marginBottom: "2rem",
                fontSize: "1.125rem",
                color: "#4b5563",
              }}
            >
              Ha ocurrido un error grave. Por favor, intenta de nuevo más tarde.
            </p>
            <button
              onClick={() => reset()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.375rem",
                backgroundColor: "#047857",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
