# Mi panel con DummyJSON

HTML, CSS y JavaScript puro. Login, perfil y tareas con la API de [DummyJSON](https://dummyjson.com/docs).

- Página publicada: _https://gaelflores04.github.io/Panel-Aplicaciones-web/_
- Usuario de prueba: `emilys` / `emilyspass`

## Dónde usé cada método de arreglo

| Método | Dónde (en `app.js`) | Para qué |
|---|---|---|
| `filter` | `pintarTareas` y `eliminarTarea` | Aplicar el filtro y el buscador; quitar la tarea eliminada. |
| `map` | `cambiarEstado` | Crear un arreglo nuevo cambiando solo la tarea marcada. |
| `reduce` | `pintarContadores` | Contar cuántas tareas están completadas. |
| `find` | `cambiarEstado` y `eliminarTarea` | Encontrar la tarea por su `id`. |
| `sort` | `pintarTareas` | Mostrar primero las pendientes. |
| `forEach` | `pintarTareas` y eventos de filtros | Pintar cada tarea; marcar el filtro activo. |

## Notas
- `pedir()` revisa `res.ok` y lanza un error con el `status`, así un 401 o 404 llega al `catch`.
- Si `GET /auth/me` responde 401, se borra el token y se regresa al login.
- DummyJSON no guarda cambios, así que actualizo el arreglo `tareas` cuando la respuesta es exitosa.
- Las tareas nuevas llevan `local: true` y un `id` propio (`Date.now()`); marcarlas o borrarlas no llama a la API.