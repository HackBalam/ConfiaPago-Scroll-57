export default function NotFound() {
  return (
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
          Página no encontrada
        </h1>
        <p
          style={{
            marginBottom: "2rem",
            fontSize: "1.125rem",
            color: "#4b5563",
          }}
        >
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <a
          href="/"
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
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
