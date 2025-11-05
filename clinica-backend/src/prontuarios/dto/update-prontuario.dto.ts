import { PartialType } from '@nestjs/mapped-types';
import { CreateProntuarioDto } from './create-prontuario.dto';

// O Update é um 'create' onde tudo é opcional
export class UpdateProntuarioDto extends PartialType(CreateProntuarioDto) {}
