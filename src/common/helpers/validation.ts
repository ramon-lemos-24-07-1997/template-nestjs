import { CustomException } from "src/common/exceptions/custom.exception";


const checkRequiredParams = (req: any, params: string[], key: string | null = null): void => {
  const data = key ? req.body[key] : req.body;
  if (!data || typeof data !== 'object') throw new CustomException(`Parâmetro "${key}" ausente ou inválido.`, 400);
  const missingParams = params.filter(param => !data.hasOwnProperty(param) || data[param] === null || data[param] === '');
  if (missingParams.length > 0) throw new CustomException(`Parâmetros ausentes ou vazios: ${missingParams.join(', ')}`, 400);
};


export {
  checkRequiredParams,
};