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

## Capturas

### Dashboard principal

![Dashboard principal](public/screenshots/dashboard.png)

### Configuración del jugador

![Configuración del jugador](public/screenshots/player-setup.png)

### Partida en curso o finalizada

![Tablero de juego](public/screenshots/game.png)

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

Durante la partida, cada jugador puede seleccionar el icono de lápiz junto a
su nombre para editarlo. El nuevo nombre se guarda al pulsar Enter o al salir
del campo.
