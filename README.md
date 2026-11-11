# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# juega-4
classic-game

## Conecta-4

Juego local para dos personas, con tablero de 7 columnas por 6 filas. Los nombres
se guardan en `localStorage`; no requiere servidor ni base de datos.

### Flujo del juego

```mermaid
flowchart TD
    A[Dashboard] -->|Jugar ahora| B[Nombre y ficha roja]
    B --> C[Nombre y ficha amarilla]
    C --> D[Inicializar tablero 7 x 6]
    D --> E[Turno del jugador actual]
    E -->     F[Tap o clic en la primera fila de una columna]
    F --> G[Soltar ficha en el espacio inferior disponible]
    G --> H{¿Conecta 4?}
    H -->|Sí| I[Registrar victoria y mostrar resultado]
    H -->|No| J{¿Tablero lleno?}
    J -->|Sí| K[Mostrar empate]
    J -->|No| L[Cambiar turno]
    L --> E
    I --> M[Nueva partida o volver al inicio]
    K --> M
    M --> D
```

La primera partida comienza con rojo; la segunda con amarillo y así
sucesivamente. El botón **Reiniciar partida** conserva el marcador y alterna
el jugador inicial. **Resetear marcador** pone ambas victorias en cero.

Icono de la pestaña obtenido en
<a href="https://www.magnific.com/es/icono/discusion_9324084#fromView=search&page=1&position=28&uuid=f3648305-0a7b-4dd4-9eeb-9d0be7f16193">Icono de Vector Stall</a>
