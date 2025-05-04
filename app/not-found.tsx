export default function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>404 - Página no encontrada</h1>
      <p style={{ marginBottom: "1rem" }}>Lo sentimos, la página que estás buscando no existe.</p>
      <a
        href="/"
        style={{
          display: "inline-block",
          padding: "0.5rem 1rem",
          backgroundColor: "#047857",
          color: "white",
          borderRadius: "0.25rem",
          textDecoration: "none",
        }}
      >
        Volver al inicio
      </a>
    </div>
  )
}
