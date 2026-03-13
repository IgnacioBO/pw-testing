import winston, {format} from "winston";
import path from 'node:path';
import fs from 'node:fs';

//Crear carpeta de logs si no existe
//const logsDir = path.resolve(process.cwd(), 'logs');
//fs.mkdirSync(logsDir, { recursive: true });


//GetCaller es una funcion que obtiene el archivo y linea de codigo desde donde se llamo al logger.
function getCaller(): string {
  const originalPrepareStackTrace = Error.prepareStackTrace;

  try {
    const err = new Error();
    Error.captureStackTrace(err, getCaller);

    Error.prepareStackTrace = (_, stack) => stack;
    const stack = err.stack as unknown as NodeJS.CallSite[];

    const frame = stack.find((callSite) => {
      const fileName = callSite.getFileName();
      if (!fileName) return false;

      // Saltar internals, node_modules y este mismo archivo logger
      return (
        !fileName.includes('node:internal') &&
        !fileName.includes('node_modules') &&
        !fileName.endsWith(`${path.sep}logger.ts`) &&
        !fileName.endsWith(`${path.sep}logger.js`)
      );
    });

    if (!frame) return 'unknown:0';

    const fileName = frame.getFileName() ?? 'unknown';
    const line = frame.getLineNumber() ?? 0;

    return `${path.basename(fileName)}:${line}`;
  } catch {
    return 'unknown:0';
  } finally {
    Error.prepareStackTrace = originalPrepareStackTrace;
  }
}

//addCaller llama a getCaller para obtener el archivo y linea, y se agrega a info.caller, para que luego en el formato del log se pueda mostrar esa informacion.
const addCaller = winston.format((info) => {
  info.caller = getCaller();
  return info;
});


//Formato de salida del log
const logPrintf = format.printf(info => 
  `[${info.level}] ${info.timestamp} [${info.caller}]: ${info.message} ${info.stack ? `\n${info.stack}` : ''}`
);

//Formatos basicos sin colores:
const baseFormat = winston.format.combine(
  //Dejar en mayusculas y asegurar que tengan 5 caracteres (por ejemplo INFO y ERROR quedan alineados)
  winston.format(info => {
    info.level = info.level.toUpperCase().padEnd(5, ' ');
    return info;
  })(),
  //Si hay error que imprima el stack trace completo, no solo el mensaje del error
  winston.format.errors({ stack: true }),
  addCaller(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), 
);


export const log = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    baseFormat,
    logPrintf
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error'}),
    new winston.transports.File({ filename: 'logs/combined.log'}),
    new winston.transports.Console({
      level : 'debug',
      format: winston.format.combine(
        //baseFormat,
        winston.format.colorize(),
       logPrintf
      )
      
    }) 
  ],
});
