# EventBridge Scheduler + Step Functions

Patrón de arquitectura que utiliza EventBridge Scheduler para ejecutar una Step Function de forma programada.

## Arquitectura

```
EventBridge Scheduler (cada 5 min) → IAM Role → Step Function
```

## Componentes

- **EventBridge Scheduler**: Dispara la ejecución cada 5 minutos usando `rate(5 minutes)`
- **IAM Role**: Rol con permisos `states:StartExecution` para invocar la Step Function
- **Step Functions**: Máquina de estados definida en `state-machine.asl.json`

## Casos de uso

- Procesamiento batch periódico
- Tareas de mantenimiento programadas
- Sincronización de datos
- Generación de reportes

## Despliegue

```bash
npm install
npx cdk deploy
```

## Modificar frecuencia

Edita `scheduler.ScheduleExpression.rate()` en el stack:
- `cdk.Duration.minutes(5)` - Cada 5 minutos
- `cdk.Duration.hours(1)` - Cada hora
- `cdk.Duration.days(1)` - Diario
