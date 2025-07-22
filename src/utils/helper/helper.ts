// import ErrorResponse from '../error/ErrorHandler';
// import bcrypt from 'bcrypt';
// import validator from 'validator';
// import fs from 'fs';
// import path from 'path';
// import s3 from '../../infra/aws/s3';
// import { v4 as uuidv4 } from 'uuid';
// import mime from 'mime-types';
// import { PutObjectCommand } from '@aws-sdk/client-s3';
// import ffmpeg from 'fluent-ffmpeg';
// import logger from '../logger/logger';
// import axios from 'axios';
// import { intervalToDuration, formatDuration } from 'date-fns';
// import { ptBR } from 'date-fns/locale';
// import  { cnpj } from 'cpf-cnpj-validator';


// ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH!);

// const forbiddenEmails: string[] = [];

// const allowedFormats = ['mp3', 'wav', 'ogg', 'aac', 'mp4', 'opus', 'oga', 'weba', 'm4a', 'x-aac','xls', 'xlsx', 'csv', 'doc', 'docx', 'pdf', 'txt', 'xml',
//   'jpeg', 'jpg', 'png', 'gif', 'webp', 'svg', 'zip', 'rar'
// ];

// const userTypeMap: { [key: string]: string } = {
//   admin: 'Administrador',
//   attendant: 'Atendente',
//   common: 'Comum'
// };

// const isEmailValid = (email: string): void => {
//   const isValid= validator.isEmail(email);
//   if (!isValid) {
//     throw new ErrorResponse(`E-mail inválido: ${email}`);
//   }
// };

// const isForbidden = (email: string): boolean => {
//   return forbiddenEmails.includes(email);
// };

// const addForbidden = async (email: string): Promise<void> => {
//   forbiddenEmails.push(email);
// };

// const removeForbidden = (email: string): void => {
//   const index = forbiddenEmails.indexOf(email);
//   if (index !== -1) {
//     forbiddenEmails.splice(index, 1);
//   }
// };

// const removeForbiddenAfterInterval = (email: string): void => {
//   setTimeout(() => {
//     removeForbidden(email);
//   }, 1000 * 60 * 5);
// };

// const createHash = (): string => {
//   let hash = "";
//   const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   for (let i = 0; i < 12; i++) {
//     hash += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return hash;
// };

// const generateCompanyValidationCode = (): string => {
//   const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
//   let code = "";
//   for (let i = 0; i < 6; i++) {
//     code += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return code;
// };

// const checkRequiredParams = (req: any, params: string[], key: string | null = null): void => {
//   const data = key ? req.body[key] : req.body;
//   if (!data || typeof data !== 'object') throw new ErrorResponse(`Parâmetro "${key}" ausente ou inválido.`);
//   const missingParams = params.filter(param => !data.hasOwnProperty(param) || data[param] === null || data[param] === '');
//   if (missingParams.length > 0) throw new ErrorResponse(`Parâmetros ausentes ou vazios: ${missingParams.join(', ')}`);
// };

// const convertUserType = (userType: string): string => {
//   return userTypeMap[userType];
// };

// const compareSync = (password: string, hash: string): boolean => {
//   return bcrypt.compareSync(password, hash);
// };

// const hashSync = (password: string): string => {
//   return bcrypt.hashSync(password, 10);
// };

// const getFileExtension = (mimetype: string): string => {
//   const mimeTypes = ['application/x-zip-compressed', 'application/x-compressed'];
//   if (mimeTypes.includes(mimetype)) return 'zip'; 
//   const extension = mime.extension(mimetype);
//   if (!extension) {
//     throw new ErrorResponse(`Tipo de mídia não suportado: ${mimetype}`);
//   }
//   return extension;
// };

// const getFileType = (extesion: string): string => {
//   const type = mime.lookup(extesion);
//   if (!type) {
//     throw new ErrorResponse(`Tipo de mídia não suportado: ${extesion}`);
//   }
//   if (type.split('/')[0] === 'application') {
//     return 'document';
//   }
//   return type.split('/')[0]; 
// };

// const saveFileLocally = (buffer: Buffer, extension: string, directory: string): string => {
//   try {
//     const publicDir = path.join(process.cwd(), 'public', directory);
//     if (!fs.existsSync(publicDir)) {
//       fs.mkdirSync(publicDir, { recursive: true });
//     }
//     const filename = `${new Date().getTime()}-${uuidv4()}.${extension}`;
//     const filePath = path.join(publicDir, filename);
//     fs.writeFileSync(filePath, buffer);
//     return filePath;
//   } catch (err) {
//     logger.error('Erro ao salvar arquivo localmente:', err);
//     throw new ErrorResponse('Erro ao salvar arquivo localmente');
//   }
// };

// const saveFileToS3 = async (buffer: Buffer, extension: string): Promise<string> => {
//   try {
//     const filename = `${new Date().getTime()}-${uuidv4()}.${extension}`;
//     const uploadParams = {
//       Bucket: process.env.AWS_BUCKET_NAME!,
//       Key: filename,
//       Body: buffer,
//       ContentType: mime.lookup(extension) || 'application/octet-stream'
//     };
//     const command = new PutObjectCommand(uploadParams);
//     await s3.send(command);
//     return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
//   } catch (err) {
//     logger.error('Erro ao salvar arquivo no S3:', err);
//     throw new ErrorResponse('Erro ao salvar arquivo no S3');
//   }
// };

// const checkProfileLimit = (profile: string, users: number, company: { max_admin: number, max_attendant: number, max_common: number }): void => {
//   const profileToMaxLimit: Record<string, number> = {
//     admin: company.max_admin,
//     attendant: company.max_attendant,
//     common: company.max_common,
//   };
//   const maxLimit = profileToMaxLimit[profile];
//   if (maxLimit === undefined) {
//     throw new ErrorResponse("Perfil inválido");
//   }
//   if (users >= maxLimit) {
//     throw new ErrorResponse(`Limite de ${convertUserType(profile)} atingido para esta empresa`);
//   }
// };

// const checkAdminPrivileges = (profile: string): void => {
//   const profiles = ['super_admin', 'admin'];
//   if (!profiles.includes(profile)) {
//     throw new ErrorResponse("Perfil sem privilégios para esta ação");
//   }
// }

// const isAdmin = (profile: string): boolean => {
//   return profile === 'admin' || profile === 'super_admin';
// }

// const convertAudioToMp4 = async (audio: string): Promise<string> => {
//   const audioDir = path.join(process.cwd(), "public", "temp");
//   const audioPath = path.join(audioDir, `${Date.now()}.mp4`);
//   if (!fs.existsSync(audioDir)) {
//     fs.mkdirSync(audioDir, { recursive: true });
//   }
//   try {
//     await new Promise<void>((resolve, reject) => {
//       ffmpeg(audio)
//         .audioChannels(1)
//         .audioCodec("aac")
//         .toFormat("mp4")
//         .addOutputOptions(["-avoid_negative_ts make_zero", '-threads 1'])
//         .on("error", (error, stdout, stderr) => {
//           logger.error("Falha ao converter o áudio", error);
//           logger.error("ffmpeg stderr:", stderr);
//           reject(error);
//         })
//         .on("end", () => {
//           resolve();
//         })
//         .saveToFile(audioPath);
//     });
//     return audioPath;
//   } catch (error) {
//     logger.error("Erro na conversão do áudio:", error);
//     throw new ErrorResponse('Erro na conversão do áudio.');
//   }
// };

// const processBuffer = (buffer: any): Buffer => {
//   if (!Buffer.isBuffer(buffer)) {
//     if (buffer?.buffer?.data) {
//       return Buffer.from(buffer.buffer.data);
//     } else {
//       throw new ErrorResponse('O argumento "buffer" deve ser uma instância de Buffer');
//     }
//   }
//   return buffer;
// };

// const isValidFormat = (extension: string, allowedFormats: string[]): boolean => {
//   return allowedFormats.includes(extension.toLowerCase());
// };

// const validateMedia = (mediaFiles: Express.Multer.File[]): void => {
//   for (const media of mediaFiles) {
//     const extension = media.originalname.split('.').pop();
//     if (!extension) {
//       throw new ErrorResponse('Extensão de arquivo não encontrada');
//     }
//     if (!isValidFormat(extension, allowedFormats)) {
//       throw new ErrorResponse(`O formato do arquivo ${media.originalname} não é suportado`);
//     }
//   }
// };

// const saveProfilePictureLocally = async (url: string, directory: string): Promise<string | null> => {
//   try {
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
//     const buffer = Buffer.from(response.data, 'binary');
//     const extension = mime.extension(response.headers['content-type']) || 'jpg'; 
//     const filePath = saveFileLocally(buffer, extension, directory);
//     return filePath;
//   } catch (err) {
//     logger.error('Erro ao salvar a foto de perfil localmente:', err);
//     return null;
//   }
// };

// const saveProfilePictureToS3 = async (url: string): Promise<string | null> => {
//   try {
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
//     const buffer = Buffer.from(response.data, 'binary');
//     const extension = mime.extension(response.headers['content-type']) || 'jpg';
//     const s3Url = await saveFileToS3(buffer, extension);
//     return s3Url;
//   } catch (err) {
//     logger.error('Erro ao salvar a foto de perfil no S3:', err);
//     return null;
//   }
// };

// const formatPhoneNumber = (phone: string): string => {
//   if (phone.length !== 13) {
//       throw new ErrorResponse('Número de telefone inválido');
//   }
//   if (phone[4] === '9') {
//       return phone.slice(0, 4) + phone.slice(5); 
//   }
//   return phone;
// };

// const areArraysEmpty = (...arrays: any[][]): boolean => {
//   return arrays.every((array) => !array || array.length === 0);
// };

// const isImage = (mimetype: string): boolean | ErrorResponse => {
//   const extPermitted = ['jpg', 'jpeg', 'png'];
//   const extension = getFileExtension(mimetype);
//   if (!extPermitted.includes(extension)) {
//     throw new ErrorResponse(`Tipo de arquivo não permitido ${extension}. Extensões permitidas: ${extPermitted.join(', ')}`);
//   }
//   return true;
// };

// const getMimeTypeFromUrl = async (url: string): Promise<string> => {
//   try {
//     const response = await axios.head(url);
//     return response.headers['content-type'] || 'application/octet-stream';
//   } catch (error) {
//     logger.error('Erro ao obter o tipo MIME:', error);
//     throw new ErrorResponse('Erro ao obter o tipo MIME');
//   }
// }

// const calculeTma = (tickets: any[]): string => {
//   if (!tickets.length) return "Não há registros";
//   const seconds = tickets.reduce((som, ticket) => {
//     const start = new Date(ticket.opened_at).getTime();
//     const end = new Date(ticket.resolved_at).getTime();
//     return som + (end - start) / 1000; 
//   }, 0);
//   let tmaInSeconds = seconds / tickets.length;
//   tmaInSeconds = Math.round(tmaInSeconds)
//   return toFormat(tmaInSeconds);
// }

// const calculeTmq = (tickets: any[]): string => {
//   if (!tickets.length) return "Não há registros";
//   const seconds = tickets.reduce((som, ticket) => {
//     const start = new Date(ticket.entered_queue_at).getTime();
//     const end = new Date(ticket.opened_at).getTime();
//     return som + (end - start) / 1000; 
//   }, 0);
//   let tmqInSeconds = seconds / tickets.length;
//   tmqInSeconds = Math.round(tmqInSeconds)
//   return toFormat(tmqInSeconds);
// }

// const toFormat = (seconds: number): string => {
//   const duration = intervalToDuration({ start: 0, end: seconds * 1000 }); 
//   return formatDuration(duration, { locale: ptBR, format: ['days', 'hours', 'minutes'] });
// }

// const throwIfMatches = (currentValues: any[], expectedValues: any[], errorMessage: string): void => {
//   if (currentValues.length !== expectedValues.length) {
//     throw new Error("Os arrays devem ter o mesmo comprimento");
//   }
//   const allMatch = currentValues.every((value, index) => {
//     return value === expectedValues[index];
//   });
//   if (allMatch) {
//     throw new ErrorResponse(errorMessage);
//   }

// }

// const isValidCnpj = (cnpjValue: string): void => {
//   const isValid = cnpj.isValid(cnpjValue); 
//   if (!isValid) {
//     throw new ErrorResponse('CNPJ inválido');
//   }
// }


// export {
//   isEmailValid,
//   isForbidden,
//   addForbidden,
//   removeForbidden,
//   removeForbiddenAfterInterval,
//   createHash,
//   checkRequiredParams,
//   convertUserType,
//   compareSync,
//   hashSync,
//   saveFileLocally,
//   saveFileToS3,
//   getFileExtension,
//   getFileType,
//   checkProfileLimit,
//   checkAdminPrivileges,
//   convertAudioToMp4,
//   processBuffer,
//   validateMedia,
//   saveProfilePictureLocally,
//   saveProfilePictureToS3,
//   formatPhoneNumber,
//   isAdmin,
//   areArraysEmpty,
//   isImage,
//   getMimeTypeFromUrl,
//   calculeTma,
//   calculeTmq,
//   throwIfMatches,
//   isValidCnpj,
//   generateCompanyValidationCode
// };