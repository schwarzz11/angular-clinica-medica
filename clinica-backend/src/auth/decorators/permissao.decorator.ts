import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { PERMISSAO_KEY } from '../guards/permissao.guard';

/**
 * Decorator @Permissao('chave-da-permissao')
 * Usado junto com JwtAuthGuard e PermissaoGuard
 */
// Trocamos a arrow function por uma 'export function'
export function Permissao(permisao: string): CustomDecorator {
  return SetMetadata(PERMISSAO_KEY, permisao);
}
